import { z } from "zod";

// ---------------------------------------------------------------------
// Potongan skema yang dipakai bersama Agent 1 (Chaser) dan Agent 2 (Scholar).
// Prinsip inti kontrak ini: AI TIDAK PERNAH mengarang nama entitas (universitas,
// beasiswa, lowongan, course) sendiri. Backend query kandidat dari tabel
// master lebih dulu, kirim sebagai bagian dari INPUT ke LLM, dan LLM cuma
// boleh mengembalikan ID dari kandidat yang sudah dikirim. Ini menutup
// jalur halusinasi paling berbahaya (rekomendasi yang tidak ada di database).
// ---------------------------------------------------------------------

export const matchResultSchema = z.object({
  matchScore: z.number().int().min(0).max(100),
  reasoning: z.string().min(1).max(500),
});

export const candidateCourseSchema = z.object({
  id: z.string(),
  title: z.string(),
  facultyTags: z.array(z.string()),
});

export const roadmapStepSchema = z.object({
  order: z.number().int().positive(),
  title: z.string().min(1),
  description: z.string().min(1),
  // WAJIB salah satu id dari candidateCourses yang dikirim di input -- ini
  // yang diperiksa ulang di lapisan guardrail (cross-check ID), bukan cuma
  // divalidasi bentuknya oleh Zod.
  courseId: z.string(),
});

export const roadmapSchema = z.object({
  summary: z.string().min(1).max(1000),
  tahapan: z.array(roadmapStepSchema).min(1),
});