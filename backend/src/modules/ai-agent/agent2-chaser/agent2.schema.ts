import { z } from "zod";
import { candidateCourseSchema, matchResultSchema, roadmapSchema } from "../shared.schema";

// =======================================================================
// AGENT 2 (THE CHASER) -- Mahasiswa/Fresh Graduate, cari kerja
// =======================================================================

// -----------------------------------------------------------------------
// INPUT
// -----------------------------------------------------------------------

export const agent2InputSchema = z.object({
  persona: z.literal("CHASER"),
  profile: z.object({
    // Dibatasi .max() -- bukan cuma soal biaya token, tapi juga mitigasi
    // prompt injection lewat isi CV. 8000 karakter kira-kira cukup
    // untuk CV 2-3 halaman hasil ekstraksi teks.
    cvText: z.string().min(1).max(8000),
    portfolioText: z.string().max(4000).nullable(),
    major: z.string().min(1).max(100),
    jobPreference: z.string().min(1).max(200),
    confirmedSkills: z.array(z.string().max(60)).max(30).optional(),
  }),
  candidateJobs: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      company: z.string(),
      skillsRequired: z.array(z.string()),
    })
  ),
  candidateCourses: z.array(candidateCourseSchema),
});

export type Agent2Input = z.infer<typeof agent2InputSchema>;

// -----------------------------------------------------------------------
// OUTPUT
//
// Ketentuan penting buat prompt engineer: kalau `preferenceMatch` = false,
// `mismatchExplanation` WAJIB diisi (tidak boleh null) -- ini yang
// mewujudkan requirement produk "kalau CV vs minat kerja tidak sesuai, AI
// harus jelaskan kenapa, tapi tetap kasih roadmap ke skill yang kurang".
// Constraint ini ditegakkan lewat `.superRefine()` di bawah, bukan cuma
// dijelaskan di komentar -- jadi kalau LLM melanggarnya, guardrail akan
// menolak output ini dan jatuh ke fallback.
// -----------------------------------------------------------------------

export const agent2OutputSchema = z
  .object({
    profileAnalysis: z.object({
      detectedSkills: z.array(z.string()).min(1),
      preferenceMatch: z.boolean(),
      mismatchExplanation: z.string().min(1).max(500).nullable(),
    }),
    roadmap: roadmapSchema,
    skillGap: z.array(z.string()),
    jobMatches: z.array(
      matchResultSchema.extend({
        jobId: z.string(), // WAJIB dari candidateJobs
      })
    ),
  })
  .superRefine((data, ctx) => {
    if (data.profileAnalysis.preferenceMatch === false && !data.profileAnalysis.mismatchExplanation) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["profileAnalysis", "mismatchExplanation"],
        message:
          "mismatchExplanation wajib diisi kalau preferenceMatch = false " +
          "(requirement produk: AI harus jelaskan kenapa CV vs minat kerja tidak sesuai)",
      });
    }
  });

export type Agent2Output = z.infer<typeof agent2OutputSchema>;

// -----------------------------------------------------------------------
// FALLBACK
// -----------------------------------------------------------------------

export function buildAgent2Fallback(input: Agent2Input): Agent2Output {
  return {
    profileAnalysis: {
      // Output schema mewajibkan min(1); pakai skill yang sudah dikonfirmasi user, atau jurusan.
      detectedSkills: input.profile.confirmedSkills?.length ? input.profile.confirmedSkills : [input.profile.major],
      preferenceMatch: true,
      mismatchExplanation: null,
    },
    roadmap: {
      summary:
        "Roadmap sementara sedang disiapkan. Silakan mulai dari course dasar " +
        "yang tersedia sambil sistem menganalisis CV kamu lebih lanjut.",
      tahapan: input.candidateCourses.slice(0, 3).map((course, index) => ({
        order: index + 1,
        title: course.title,
        description: "Course dasar yang relevan dengan preferensi kerja kamu.",
        courseId: course.id,
      })),
    },
    skillGap: [],
    jobMatches: input.candidateJobs.slice(0, 3).map((job) => ({
      jobId: job.id,
      matchScore: 50,
      reasoning: "Rekomendasi umum berdasarkan bidang pekerjaan, belum dipersonalisasi penuh.",
    })),
  };
}

// -----------------------------------------------------------------------
// CROSS-CHECK ID -- sama seperti Agent 1, lapisan kedua setelah validasi
// bentuk Zod lolos.
// -----------------------------------------------------------------------

export function checkAgent2ReferencedIds(input: Agent2Input, output: Agent2Output): string[] {
  const errors: string[] = [];

  const validCourseIds = new Set(input.candidateCourses.map((c) => c.id));
  const validJobIds = new Set(input.candidateJobs.map((j) => j.id));

  const seenCourseIds = new Set<string>();
  const seenJobIds = new Set<string>();

  for (const step of output.roadmap.tahapan) {
    if (!validCourseIds.has(step.courseId)) {
      errors.push(`courseId "${step.courseId}" di roadmap.tahapan tidak ada di candidateCourses`);
    }
    if (seenCourseIds.has(step.courseId)) {
      errors.push(
        `courseId "${step.courseId}" muncul dobel di roadmap.tahapan -- akan tabrakan @@unique([roadmapId, courseId])`
      );
    }
    seenCourseIds.add(step.courseId);
  }
  for (const match of output.jobMatches) {
    if (!validJobIds.has(match.jobId)) {
      errors.push(`jobId "${match.jobId}" tidak ada di candidateJobs`);
    }
    if (seenJobIds.has(match.jobId)) {
      errors.push(
        `jobId "${match.jobId}" muncul dobel di jobMatches -- akan tabrakan @@unique([roadmapId, jobId])`
      );
    }
    seenJobIds.add(match.jobId);
  }

  return errors;
}