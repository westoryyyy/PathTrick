import { z } from "zod";
import { candidateCourseSchema, matchResultSchema, roadmapSchema } from "../shared.schema";

// =======================================================================
// AGENT 1 (THE DREAMER) -- Anak SMA, cari univ & beasiswa
// =======================================================================

// -----------------------------------------------------------------------
// INPUT -- ini yang dikirim BACKEND ke LLM (bukan cuma preferensi user
// mentah). candidateUniversities/candidateScholarships/candidateCourses
// WAJIB sudah di-query dari tabel master oleh backend SEBELUM prompt
// dikirim -- filter berdasar facultyTags/country dari preferensi user.
// -----------------------------------------------------------------------

export const agent1InputSchema = z.object({
  persona: z.literal("DREAMER"),
  preferences: z.object({
    // null kalau user pakai jalur RIASEC (belum tahu fakultas)
    fakultas: z.union([z.string(), z.array(z.string())]).nullable(),
    riasecTopCode: z.string().nullable(),
    budgetRange: z
      .object({ min: z.number().int(), max: z.number().int() })
      .refine((range) => range.min <= range.max, {
        message: "budgetRange.min tidak boleh lebih besar dari budgetRange.max",
      })
      .nullable(),
    countryPreference: z.array(z.string()),
  }),
  candidateUniversities: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      country: z.string(),
      facultyTags: z.array(z.string()),
    })
  ),
  candidateScholarships: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      scope: z.string(),
      country: z.string().nullable().optional(),
      facultyTags: z.array(z.string()),
    })
  ),
  candidateCourses: z.array(candidateCourseSchema),
});

export type Agent1Input = z.infer<typeof agent1InputSchema>;

// -----------------------------------------------------------------------
// OUTPUT -- ini yang WAJIB dikembalikan LLM persis dalam bentuk ini.
// Dibagikan ke tim AI sebagai kontrak system prompt ("kembalikan HANYA
// JSON dengan bentuk berikut, tanpa teks lain").
// -----------------------------------------------------------------------

export const agent1OutputSchema = z.object({
  roadmap: roadmapSchema,
  universityMatches: z
    .array(
      matchResultSchema.extend({
        universityId: z.string(), // WAJIB dari candidateUniversities
      })
    )
    .min(1),
  scholarshipMatches: z.array(
    matchResultSchema.extend({
      scholarshipId: z.string(), // WAJIB dari candidateScholarships
    })
  ),
});

export type Agent1Output = z.infer<typeof agent1OutputSchema>;

// -----------------------------------------------------------------------
// FALLBACK -- dipakai kalau LLM gagal/timeout/rate limit atau hasilnya
// gagal validasi. Bentuknya generik tapi tetap valid terhadap schema di
// atas, supaya Frontend tidak pernah menerima shape yang beda antara
// jalur AI dan jalur fallback.
// -----------------------------------------------------------------------

export function buildAgent1Fallback(input: Agent1Input): Agent1Output {
  return {
    roadmap: {
      summary:
        "Roadmap sementara sedang disiapkan. Silakan mulai dari course dasar " +
        "yang tersedia sambil sistem menyusun rekomendasi yang lebih personal.",
      tahapan: input.candidateCourses.slice(0, 3).map((course, index) => ({
        order: index + 1,
        title: course.title,
        description: "Course dasar yang relevan dengan minat kamu.",
        courseId: course.id,
      })),
    },
    universityMatches: input.candidateUniversities.slice(0, 3).map((uni) => ({
      universityId: uni.id,
      matchScore: 50,
      reasoning: "Rekomendasi umum berdasarkan kecocokan bidang, belum dipersonalisasi penuh.",
    })),
    scholarshipMatches: input.candidateScholarships.slice(0, 3).map((s) => ({
      scholarshipId: s.id,
      matchScore: 50,
      reasoning: "Rekomendasi umum berdasarkan kecocokan bidang, belum dipersonalisasi penuh.",
    })),
  };
}

// -----------------------------------------------------------------------
// CROSS-CHECK ID -- lapisan guardrail kedua, SETELAH validasi bentuk Zod
// lolos. Zod cuma memastikan `courseId` itu sebuah string, bukan
// memastikan string itu benar-benar salah satu course yang kita kirim.
// -----------------------------------------------------------------------

export function checkAgent1ReferencedIds(input: Agent1Input, output: Agent1Output): string[] {
  const errors: string[] = [];

  const validCourseIds = new Set(input.candidateCourses.map((c) => c.id));
  const validUniversityIds = new Set(input.candidateUniversities.map((u) => u.id));
  const validScholarshipIds = new Set(input.candidateScholarships.map((s) => s.id));

  // Set terpisah buat deteksi ID dobel dalam array yang sama
  const seenCourseIds = new Set<string>();
  const seenUniversityIds = new Set<string>();
  const seenScholarshipIds = new Set<string>();

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
  for (const match of output.universityMatches) {
    if (!validUniversityIds.has(match.universityId)) {
      errors.push(`universityId "${match.universityId}" tidak ada di candidateUniversities`);
    }
    if (seenUniversityIds.has(match.universityId)) {
      errors.push(
        `universityId "${match.universityId}" muncul dobel di universityMatches -- akan tabrakan @@unique([roadmapId, universityId])`
      );
    }
    seenUniversityIds.add(match.universityId);
  }
  for (const match of output.scholarshipMatches) {
    if (!validScholarshipIds.has(match.scholarshipId)) {
      errors.push(`scholarshipId "${match.scholarshipId}" tidak ada di candidateScholarships`);
    }
    if (seenScholarshipIds.has(match.scholarshipId)) {
      errors.push(
        `scholarshipId "${match.scholarshipId}" muncul dobel di scholarshipMatches -- akan tabrakan @@unique([roadmapId, scholarshipId])`
      );
    }
    seenScholarshipIds.add(match.scholarshipId);
  }

  return errors;
}