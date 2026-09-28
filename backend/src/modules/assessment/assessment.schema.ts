import { z } from "zod";
import { ALL_STUDYFIELDS } from "./riasec.service";

// ── RIASEC Answer ──────────────────────────────────────────────────────
// Frontend hanya mengirim questionId (q01..q42) + nilai Likert.
// Kategori (R/I/A/S/E/C) TIDAK pernah dikirim client -- backend menyimpan
// pemetaan ini secara server-side di tabel RiasecQuestion.
// Ini menutup celah manipulation: user tidak bisa mengarang {category: "I"}
// untuk mendapatkan profil Investigative palsu.
export const riasecAnswerSchema = z.object({
  questionId: z.string().regex(/^q\d{2}$/, "questionId harus format q01..q42"),
  value: z.number().int().min(1).max(5), // skala Likert 1-5 (5 blue-gem)
});

export const dreamerRiasecPayloadSchema = z.object({
  answers: z.array(riasecAnswerSchema).min(42).max(42),
});

export const BUDGET_TIERS = ["TERJANGKAU", "MENENGAH", "PREMIUM", "EKSKLUSIF", "FULL_SCHOLARSHIP"] as const;

export const dreamerPreferencePayloadSchema = z.object({
  // studyfield opsional, diambil dari 21 ISCED list
  studyfield: z.enum(ALL_STUDYFIELDS as [string, ...string[]]).nullable(),
  budgetTier: z.enum(BUDGET_TIERS),
  countryPreference: z.enum(["dalam_negeri", "luar_negeri", "keduanya"]),
});

export const chaserProfilePayloadSchema = z.object({
  cvText: z.string().min(1).max(8000),
  portfolioText: z.string().max(4000).nullable(),
  major: z.string().min(1).max(100),
  jobPreference: z.string().min(1).max(200),
});

// Discriminated union: bentuk payload beda tergantung `type`, tapi TypeScript
// bisa narrow otomatis begitu `type` dicek -- ini yang dipakai langsung di
// assessment.route.ts sebagai body validator.
export const submitAssessmentSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("DREAMER_RIASEC"), payload: dreamerRiasecPayloadSchema }),
  z.object({ type: z.literal("DREAMER_PREFERENCE"), payload: dreamerPreferencePayloadSchema }),
  z.object({ type: z.literal("CHASER_PROFILE"), payload: chaserProfilePayloadSchema }),
]);

export type SubmitAssessmentBody = z.infer<typeof submitAssessmentSchema>;
export type DreamerRiasecPayload = z.infer<typeof dreamerRiasecPayloadSchema>;
export type DreamerPreferencePayload = z.infer<typeof dreamerPreferencePayloadSchema>;
export type ChaserProfilePayload = z.infer<typeof chaserProfilePayloadSchema>;