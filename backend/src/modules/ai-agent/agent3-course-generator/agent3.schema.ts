import { z } from "zod";

// -----------------------------------------------------------------------
// Course sekarang murni Quiz-based (Mini Project + AI Evaluator sudah
// dihapus dari scope — keputusan final). "practiceProject" di bawah
// BUKAN kebalikan dari keputusan itu — ini cuma teks deskriptif,
// TANPA quiz, TIDAK dinilai sistem, TIDAK mempengaruhi status lulus course.
// Murni tantangan portofolio yang user kerjakan sendiri di luar sistem.
// -----------------------------------------------------------------------

const questionOptionSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
});

// superRefine di questionSchema: correctAnswer.id dicek INLINE saat Zod parse,
// bukan di fungsi terpisah setelah guardrail — lebih robust, error lebih jelas.
const questionSchema = z
  .object({
    type: z.literal("MULTIPLE_CHOICE"),
    prompt: z.string().min(1).max(500),
    options: z.array(questionOptionSchema).min(2).max(5),
    correctAnswer: z.object({ id: z.string().min(1) }),
    points: z.number().int().positive(),
    difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
    order: z.number().int().positive(),
  })
  .superRefine((data, ctx) => {
    const validIds = new Set(data.options.map((o) => o.id));
    if (!validIds.has(data.correctAnswer.id)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["correctAnswer", "id"],
        message: `correctAnswer.id "${data.correctAnswer.id}" harus salah satu dari options[].id di soal yang sama`,
      });
    }
  });

const studySectionSchema = z.object({
  order: z.number().int().positive(),
  title: z.string().min(1).max(150),
  content: z.string().min(1).max(3000),
  quiz: z.object({
    title: z.string().min(1).max(150),
    passingScore: z.number().int().min(0).max(100).default(75),
    questions: z.array(questionSchema).min(2).max(4),
  }),
});

// practiceProject: section terpisah tanpa quiz — deskripsi tantangan portofolio
// yang user kerjakan sendiri, TIDAK dinilai sistem, TIDAK mempengaruhi lulus course.
const practiceProjectSectionSchema = z.object({
  order: z.number().int().positive(),
  title: z.string().min(1).max(150),
  content: z.string().min(1).max(3000),
});

export const agent3InputSchema = z.object({
  jurusan: z.string().min(1),
  facultyTag: z.string().min(1),
  // WAJIB minimal 1 — kalau kosong, agent3.service.ts HARUS berhenti sebelum
  // panggil LLM (jangan generate course tanpa RAG context sama sekali).
  knowledgeContext: z
    .array(z.object({ title: z.string(), content: z.string() }))
    .min(1, "Knowledge context tidak boleh kosong — jalankan knowledge:embed dulu"),
});

export type Agent3Input = z.infer<typeof agent3InputSchema>;

export const agent3OutputSchema = z.object({
  title: z.string().min(1).max(150),
  description: z.string().min(1).max(500),
  facultyTags: z.array(z.string()).min(1),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  sections: z.array(studySectionSchema).length(3), // WAJIB persis 3 section
  practiceProject: practiceProjectSectionSchema,
});

export type Agent3Output = z.infer<typeof agent3OutputSchema>;

/**
 * Fallback ini BUKAN course yang layak dipublish — ini placeholder yang
 * menjamin bentuknya tetap valid schema (guardrail tetap butuh ini agar
 * tidak crash). Agent 3 dipanggil admin (bukan real-time user onboarding
 * seperti Agent 1/2), jadi kalau fallback yang keluar, course-nya WAJIB
 * tidak auto-publish — admin harus generate ulang atau isi manual.
 * (Lihat admin.route.ts: shouldPublish eksplisit dipaksa false kalau usedFallback true.)
 */
export function buildAgent3Fallback(input: Agent3Input): Agent3Output {
  const placeholderQuestion = (order: number) => ({
    type: "MULTIPLE_CHOICE" as const,
    prompt: "Materi belum berhasil digenerate otomatis — soal ini placeholder.",
    options: [
      { id: "a", text: "Placeholder A" },
      { id: "b", text: "Placeholder B" },
    ],
    correctAnswer: { id: "a" },
    points: 50,
    difficulty: "EASY" as const,
    order,
  });

  const placeholderSection = (order: number, title: string) => ({
    order,
    title,
    content:
      "Materi belum berhasil digenerate otomatis. Admin perlu generate ulang atau isi manual.",
    quiz: {
      title: `Kuis: ${title}`,
      passingScore: 75,
      questions: [placeholderQuestion(1), placeholderQuestion(2)],
    },
  });

  return {
    title: `[DRAFT] Course ${input.jurusan}`,
    description:
      "Course ini gagal digenerate otomatis dan WAJIB direview/diisi manual sebelum dipublish.",
    facultyTags: [input.facultyTag],
    level: "Beginner",
    sections: [
      placeholderSection(1, "Materi 1 (belum tersedia)"),
      placeholderSection(2, "Materi 2 (belum tersedia)"),
      placeholderSection(3, "Materi 3 (belum tersedia)"),
    ],
    practiceProject: {
      order: 4,
      title: "Proyek Latihan (belum tersedia)",
      content: "Belum tersedia — admin perlu isi manual.",
    },
  };
}

// Agent 3 tidak punya "ID kandidat" seperti Agent 1/2. Satu-satunya hal
// yang perlu konsisten (correctAnswer.id vs options[].id) sudah ditegakkan
// lewat superRefine di questionSchema di atas. Fungsi ini tetap ada
// (return [] selalu) supaya bentuknya konsisten dengan runAgentWithGuardrail.
export function checkAgent3ReferencedIds(
  _input: Agent3Input,
  _output: Agent3Output
): string[] {
  return [];
}
