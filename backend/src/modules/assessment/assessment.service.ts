import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { runAgent1 } from "../ai-agent/agent1-dreamer/agent1.service";
import { runAgent2 } from "../ai-agent/agent2-chaser/agent2.service";
import {
  mapTopCodeToFacultyTags,
  mapTopCodeToShortCodes,
  scoreRiasec,
  STUDYFIELD_TO_HOUSE,
  STUDYFIELD_TO_SHORTCODE,
} from "./riasec.service";
import {
  findCandidateCoursesByFacultyTags,
  findCandidateCoursesForChaser,
  findCandidateJobs,
  findCandidateScholarships,
  findCandidateUniversities,
} from "./candidate.service";
import {
  DreamerPreferencePayload,
  DreamerRiasecPayload,
  ChaserProfilePayload,
} from "./assessment.schema";

// -----------------------------------------------------------------------
// Error domain khusus -- DIBEDAKAN dari error tak terduga, supaya
// assessment.route.ts bisa balikin status code yang tepat (400, bukan 500)
// untuk kesalahan yang memang salah pemakaian (misal RIASEC belum diisi).
// -----------------------------------------------------------------------
export class AssessmentDomainError extends Error {
  constructor(
    message: string,
    public statusCode: 400 | 503 = 400
  ) {
    super(message);
    this.name = "AssessmentDomainError";
  }
}

// Catatan: roleName di sini adalah snapshot ("DREAMER" | "CHASER") â€”
// tidak diambil dari enum Persona (sudah dihapus), tapi dari Role.name
// yang diteruskan lewat parameter.
async function startNewAssessmentVersion(
  userId: string,
  roleName: string,
  type: "DREAMER_RIASEC" | "DREAMER_PREFERENCE" | "CHASER_PROFILE",
  payload: object
) {
  const previous = await prisma.assessment.findFirst({
    where: { userId, type, isActive: true },
  });

  if (previous) {
    await prisma.assessment.update({
      where: { id: previous.id },
      data: { isActive: false },
    });
  }

  return prisma.assessment.create({
    data: {
      userId,
      roleName,
      type,
      payload,
      version: (previous?.version ?? 0) + 1,
      isActive: true,
    },
  });
}

async function supersedeActiveRoadmap(tx: Prisma.TransactionClient, userId: string) {
  await tx.roadmap.updateMany({
    where: { userId, status: "ACTIVE" },
    data: { status: "SUPERSEDED" },
  });
}

// =======================================================================
// DREAMER_RIASEC -- murni deterministik, TIDAK memicu Agent 1, TIDAK
// menghasilkan Roadmap. Ini cuma langkah persiapan sebelum
// DREAMER_PREFERENCE (yang baru benar-benar generate roadmap).
// =======================================================================

export async function submitDreamerRiasec(userId: string, payload: DreamerRiasecPayload) {
  // ── Validasi 1: Ambil semua soal aktif dari DB ──────────────────────
  const activeQuestions = await prisma.riasecQuestion.findMany({
    where: { isActive: true },
    select: { id: true, category: true },
  });

  const activeIds = new Set(activeQuestions.map((q) => q.id));

  // ── Validasi 2: Tidak ada duplikat questionId ────────────────────────
  const submittedIds = payload.answers.map((a) => a.questionId);
  const uniqueSubmitted = new Set(submittedIds);
  if (uniqueSubmitted.size !== submittedIds.length) {
    throw new AssessmentDomainError("Terdapat questionId duplikat dalam submission. Setiap soal hanya boleh dijawab sekali.");
  }

  // ── Validasi 3: Semua questionId valid dan aktif ─────────────────────
  for (const qId of submittedIds) {
    if (!activeIds.has(qId)) {
      throw new AssessmentDomainError(`questionId "${qId}" tidak dikenali atau sudah tidak aktif.`);
    }
  }

  // ── Scoring: lookup kategori dari DB, bukan dari client ──────────────
  const categoryMap = new Map(activeQuestions.map((q) => [q.id, q.category]));
  const resolvedAnswers = payload.answers.map((a) => ({
    category: categoryMap.get(a.questionId)! as import("./riasec.service").RiasecCategory,
    value: a.value,
  }));

  const assessment = await startNewAssessmentVersion(userId, "DREAMER", "DREAMER_RIASEC", payload);
  const { scores, topCode } = scoreRiasec(resolvedAnswers);

  const riasecResult = await prisma.riasecResult.create({
    data: { assessmentId: assessment.id, userId, scores, topCode },
  });

  return { assessmentId: assessment.id, riasecResult: { scores, topCode: riasecResult.topCode } };
}

// =======================================================================
// DREAMER_PREFERENCE -- generate roadmap lewat Agent 1
// =======================================================================

export async function submitDreamerPreference(userId: string, payload: DreamerPreferencePayload) {
  let facultyTagsForQuery: string[];
  let riasecTopCode: string | null = null;

  if (payload.studyfield) {
    // Mapping dari studyfield ISCED ke short code
    const studyfields = Array.isArray(payload.studyfield) ? payload.studyfield : [payload.studyfield];
    facultyTagsForQuery = studyfields.map(sf => 
      STUDYFIELD_TO_SHORTCODE[sf as keyof typeof STUDYFIELD_TO_SHORTCODE] || 
      STUDYFIELD_TO_HOUSE[sf as keyof typeof STUDYFIELD_TO_HOUSE]
    ).filter(Boolean) as string[];
  } else {
    const latestRiasec = await prisma.riasecResult.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    if (!latestRiasec) {
      throw new AssessmentDomainError(
        "Studyfield kosong tapi belum ada hasil asesmen RIASEC -- lakukan asesmen RIASEC (type: DREAMER_RIASEC) terlebih dahulu"
      );
    }
    riasecTopCode = latestRiasec.topCode;
    // Map RIASEC topCode ke short codes
    facultyTagsForQuery = mapTopCodeToShortCodes(latestRiasec.topCode);
  }

  // Translasi enum budget tier ke range int per semester
  let budgetRange: { min: number; max: number } | null = null;
  switch (payload.budgetTier) {
    case "TERJANGKAU":
      budgetRange = { min: 0, max: 5000000 };
      break;
    case "MENENGAH":
      budgetRange = { min: 5000000, max: 15000000 };
      break;
    case "PREMIUM":
      budgetRange = { min: 15000000, max: 30000000 };
      break;
    case "EKSKLUSIF":
      budgetRange = { min: 30000000, max: 1000000000 }; // infinite
      break;
    case "FULL_SCHOLARSHIP":
      budgetRange = null; // Bypass filter cost, tapi nanti filter via beasiswa
      break;
  }

  const assessment = await startNewAssessmentVersion(userId, "DREAMER", "DREAMER_PREFERENCE", payload);

  let mappedCountries: string[] = [];
  if (payload.countryPreference) {
    const rawCountries = Array.isArray(payload.countryPreference) ? payload.countryPreference : [payload.countryPreference];
    mappedCountries = rawCountries.flatMap(c => {
      const normalized = c.toLowerCase().trim();
      if (normalized === 'dalam_negeri') return ['indonesia', 'id'];
      if (normalized === 'luar_negeri') return []; // Handled specially or ignored for specific matching
      return [normalized];
    });
  }

  const [universities, scholarships, courses] = await Promise.all([
    findCandidateUniversities({
      facultyTags: facultyTagsForQuery,
      countryPreference: mappedCountries,
      budgetRange,
    }),
    findCandidateScholarships({
      facultyTags: facultyTagsForQuery,
      countryPreference: mappedCountries,
    }),
    findCandidateCoursesByFacultyTags(facultyTagsForQuery),
  ]);

  const result = await runAgent1(userId, {
    persona: "DREAMER",
    preferences: {
      fakultas: payload.studyfield, // map field ke agent1 input
      riasecTopCode,
      budgetRange,
      countryPreference: mappedCountries,
    },
    candidateUniversities: universities.candidates,
    candidateScholarships: scholarships.candidates,
    candidateCourses: courses.candidates,
  });

  if (result.fallbackAlsoFailed || !result.data) {
    throw new AssessmentDomainError(
      "Sistem rekomendasi sedang gangguan (AI dan fallback keduanya gagal). Coba lagi sebentar lagi.",
      503
    );
  }

  // Narrow eksplisit di luar callback transaksi -- TypeScript kadang tidak
  // mempertahankan narrowing `result.data` dari closure luar begitu masuk
  // ke callback async $transaction.
  const data = result.data;

  const roadmap = await prisma.$transaction(async (tx) => {
    await supersedeActiveRoadmap(tx, userId);

    const newRoadmap = await tx.roadmap.create({
      data: {
        assessmentId: assessment.id,
        userId,
        roleName: "DREAMER",
        content: { summary: data.roadmap.summary, tahapan: data.roadmap.tahapan },
        status: "ACTIVE",
        generatedBy: result.usedFallback ? "FALLBACK" : "AI",
      },
    });

    await tx.roadmapCourse.createMany({
      data: data.roadmap.tahapan.map((step) => ({
        roadmapId: newRoadmap.id,
        courseId: step.courseId,
        order: step.order,
        reasonRecommended: step.description,
      })),
    });

    await tx.universityMatch.createMany({
      data: data.universityMatches.map((match) => ({
        roadmapId: newRoadmap.id,
        universityId: match.universityId,
        matchScore: match.matchScore,
        reasoning: match.reasoning,
      })),
    });

    await tx.scholarshipMatch.createMany({
      data: data.scholarshipMatches.map((match) => ({
        roadmapId: newRoadmap.id,
        scholarshipId: match.scholarshipId,
        matchScore: match.matchScore,
        reasoning: match.reasoning,
        // documentChecklist WAJIB diisi (Json, bukan nullable di schema,
        // tanpa @default). Diinisialisasi kosong di sini -- populasi
        // checklist per dokumen dilakukan belakangan di endpoint Detail
        // Beasiswa (belum dibuat), berdasar Scholarship.requiredDocuments.
        documentChecklist: {},
      })),
    });

    return newRoadmap;
  });

  return {
    assessmentId: assessment.id,
    roadmap: { id: roadmap.id, content: roadmap.content, status: roadmap.status, generatedBy: roadmap.generatedBy },
    universityMatches: data.universityMatches,
    scholarshipMatches: data.scholarshipMatches,
    usedFallback: result.usedFallback,
    candidatesRelaxed: universities.relaxed || scholarships.relaxed || courses.relaxed,
  };
}

// =======================================================================
// CHASER_PROFILE -- generate roadmap lewat Agent 2
// =======================================================================

export async function submitChaserProfile(userId: string, payload: ChaserProfilePayload) {
  const assessment = await startNewAssessmentVersion(userId, "CHASER", "CHASER_PROFILE", payload);

  const [courses, jobs] = await Promise.all([
    findCandidateCoursesForChaser(payload.major, payload.jobPreference),
    findCandidateJobs(payload.jobPreference, payload.confirmedSkills ?? []),
  ]);

  const result = await runAgent2(userId, {
    persona: "CHASER",
    profile: {
      cvText: payload.cvText,
      portfolioText: payload.portfolioText,
      major: payload.major,
      jobPreference: payload.jobPreference,
      confirmedSkills: payload.confirmedSkills,
    },
    candidateJobs: jobs.candidates,
    candidateCourses: courses.candidates,
  });

  if (result.fallbackAlsoFailed || !result.data) {
    throw new AssessmentDomainError(
      "Sistem rekomendasi sedang gangguan (AI dan fallback keduanya gagal). Coba lagi sebentar lagi.",
      503
    );
  }

  const data = result.data;

  const roadmap = await prisma.$transaction(async (tx) => {
    await supersedeActiveRoadmap(tx, userId);

    const newRoadmap = await tx.roadmap.create({
      data: {
        assessmentId: assessment.id,
        userId,
        roleName: "CHASER",
        content: {
          summary: data.roadmap.summary,
          tahapan: data.roadmap.tahapan,
          skillGap: data.skillGap,
          profileAnalysis: data.profileAnalysis,
        },
        status: "ACTIVE",
        generatedBy: result.usedFallback ? "FALLBACK" : "AI",
      },
    });

    await tx.roadmapCourse.createMany({
      data: data.roadmap.tahapan.map((step) => ({
        roadmapId: newRoadmap.id,
        courseId: step.courseId,
        order: step.order,
        reasonRecommended: step.description,
      })),
    });

    await tx.jobMatch.createMany({
      data: data.jobMatches.map((match) => ({
        roadmapId: newRoadmap.id,
        jobId: match.jobId,
        matchScore: match.matchScore,
        skillGap: data.skillGap,
        reasoning: match.reasoning,
      })),
    });

    return newRoadmap;
  });

  return {
    assessmentId: assessment.id,
    roadmap: { id: roadmap.id, content: roadmap.content, status: roadmap.status, generatedBy: roadmap.generatedBy },
    profileAnalysis: data.profileAnalysis,
    skillGap: data.skillGap,
    jobMatches: data.jobMatches,
    usedFallback: result.usedFallback,
    candidatesRelaxed: courses.relaxed || jobs.relaxed,
  };
}
