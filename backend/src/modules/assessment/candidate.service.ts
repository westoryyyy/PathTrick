import { prisma } from "../../lib/prisma";

const CANDIDATE_LIMIT = 8;

export interface CandidateQueryResult<T> {
  candidates: T[];
  relaxed: boolean; // true kalau filter ketat gagal & terpaksa dilonggarkan
}

// -----------------------------------------------------------------------
// Pola 3 tingkat dipakai konsisten di semua fungsi query kandidat di bawah:
//   Tier 1: filter ketat (fakultas/skill + negara + budget longgar)
//   Tier 2: lepas negara+budget, pertahankan fakultas/skill -- sesuai
//           exception path SKPL ("rekomendasi terdekat + disclaimer")
//   Tier 3: last resort, ambil apa saja yang published -- supaya candidate
//           list HAMPIR TIDAK PERNAH kosong. List kosong = agent1/2 output
//           schema (.min(1) di match arrays) pasti gagal validasi, bahkan
//           di jalur fallback sekalipun (lihat guardrail.ts -- fallback
//           divalidasi ulang juga).
// `relaxed: true` dikembalikan ke caller supaya bisa ditampilkan disclaimer
// "hasil direlaksasi" ke user kalau perlu.
// -----------------------------------------------------------------------

export async function findCandidateUniversities(params: {
  facultyTags: string[];
  countryPreference: "dalam_negeri" | "luar_negeri" | "keduanya";
  budgetRange: { min: number; max: number } | null;
}): Promise<CandidateQueryResult<{ id: string; name: string; country: string; facultyTags: string[] }>> {
  const countryFilter =
    params.countryPreference === "dalam_negeri"
      ? { country: { equals: "Indonesia", mode: "insensitive" as const } }
      : params.countryPreference === "luar_negeri"
        ? { country: { not: { equals: "Indonesia", mode: "insensitive" as const } } }
        : {};

  // Budget dianggap "pertimbangan tambahan, bukan filter keras" (sesuai
  // instruksi ke Agent 1 di agent1.prompt.ts) -- jadi longgarkan 20% di
  // atas max, dan tetap sertakan universitas yang belum ada data biayanya.
  const budgetFilter = params.budgetRange
    ? {
      OR: [
        { estimatedCostMin: null },
        { estimatedCostMin: { lte: Math.round(params.budgetRange.max * 1.2) } },
      ],
    }
    : {};

  let candidates = await prisma.university.findMany({
    where: { facultyTags: { hasSome: params.facultyTags }, ...countryFilter, ...budgetFilter },
    select: { id: true, name: true, country: true, facultyTags: true },
    take: CANDIDATE_LIMIT,
  });
  if (candidates.length >= 3) return { candidates, relaxed: false };

  candidates = await prisma.university.findMany({
    where: { facultyTags: { hasSome: params.facultyTags } },
    select: { id: true, name: true, country: true, facultyTags: true },
    take: CANDIDATE_LIMIT,
  });
  if (candidates.length >= 1) return { candidates, relaxed: true };

  candidates = await prisma.university.findMany({
    select: { id: true, name: true, country: true, facultyTags: true },
    take: CANDIDATE_LIMIT,
  });
  return { candidates, relaxed: true };
}

export async function findCandidateScholarships(params: {
  facultyTags: string[];
  countryPreference: "dalam_negeri" | "luar_negeri" | "keduanya";
}): Promise<CandidateQueryResult<{ id: string; name: string; scope: string; facultyTags: string[] }>> {
  const scopeFilter =
    params.countryPreference === "keduanya" ? {} : { scope: { in: [params.countryPreference, "keduanya"] } };

  let candidates = await prisma.scholarship.findMany({
    where: { facultyTags: { hasSome: params.facultyTags }, ...scopeFilter },
    select: { id: true, name: true, scope: true, facultyTags: true },
    take: CANDIDATE_LIMIT,
  });
  if (candidates.length >= 3) return { candidates, relaxed: false };

  candidates = await prisma.scholarship.findMany({
    where: { facultyTags: { hasSome: params.facultyTags } },
    select: { id: true, name: true, scope: true, facultyTags: true },
    take: CANDIDATE_LIMIT,
  });
  if (candidates.length >= 1) return { candidates, relaxed: true };

  candidates = await prisma.scholarship.findMany({
    select: { id: true, name: true, scope: true, facultyTags: true },
    take: CANDIDATE_LIMIT,
  });
  return { candidates, relaxed: true };
}

export async function findCandidateCoursesByFacultyTags(
  facultyTags: string[]
): Promise<CandidateQueryResult<{ id: string; title: string; facultyTags: string[] }>> {
  let candidates = await prisma.course.findMany({
    where: { isPublished: true, facultyTags: { hasSome: facultyTags } },
    select: { id: true, title: true, facultyTags: true },
    take: CANDIDATE_LIMIT,
  });
  if (candidates.length >= 1) return { candidates, relaxed: false };

  candidates = await prisma.course.findMany({
    where: { isPublished: true },
    select: { id: true, title: true, facultyTags: true },
    take: CANDIDATE_LIMIT,
  });
  return { candidates, relaxed: true };
}

// Course untuk Chaser difilter longgar lewat kecocokan teks major/jobPreference
// terhadap nama Skill yang terhubung ke course -- bukan facultyTags. Kandidat
// yang lebih akurat (berdasar skill gap) baru diketahui SETELAH Agent 2
// jalan (skill gap adalah bagian dari OUTPUT, bukan input), jadi di titik
// ini kita cuma bisa filter kasar berdasar teks yang sudah ada.
export async function findCandidateCoursesForChaser(
  major: string,
  jobPreference: string
): Promise<CandidateQueryResult<{ id: string; title: string; facultyTags: string[] }>> {
  const keywords = [major, jobPreference].filter(Boolean);

  let candidates = await prisma.course.findMany({
    where: {
      isPublished: true,
      OR: keywords.flatMap((keyword) => [
        { title: { contains: keyword, mode: "insensitive" as const } },
        { skills: { some: { name: { contains: keyword, mode: "insensitive" as const } } } },
      ]),
    },
    select: { id: true, title: true, facultyTags: true },
    take: CANDIDATE_LIMIT,
  });
  if (candidates.length >= 1) return { candidates, relaxed: false };

  candidates = await prisma.course.findMany({
    where: { isPublished: true },
    select: { id: true, title: true, facultyTags: true },
    take: CANDIDATE_LIMIT,
  });
  return { candidates, relaxed: true };
}

export async function findCandidateJobs(
  jobPreference: string
): Promise<CandidateQueryResult<{ id: string; title: string; company: string; skillsRequired: string[] }>> {
  const keywords = jobPreference
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word.length >= 3); // buang kata terlalu pendek ("di", "ke") biar filter nggak terlalu longgar

  let candidates = await prisma.job.findMany({
    where: {
      OR:
        keywords.length > 0
          ? keywords.map((keyword) => ({ title: { contains: keyword, mode: "insensitive" as const } }))
          : [{ title: { contains: jobPreference, mode: "insensitive" as const } }],
    },
    select: { id: true, title: true, company: true, skillsRequired: true },
    take: CANDIDATE_LIMIT,
  });
  if (candidates.length >= 1) return { candidates, relaxed: false };

  candidates = await prisma.job.findMany({
    select: { id: true, title: true, company: true, skillsRequired: true },
    take: CANDIDATE_LIMIT,
  });
  return { candidates, relaxed: true };
}
