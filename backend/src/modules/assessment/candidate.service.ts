import { prisma } from "../../lib/prisma";

const CANDIDATE_LIMIT = 20;
const FETCH_LIMIT = 100;

const SKILL_ALIASES: Record<string, string> = {
  "nodejs": "node.js",
  "node.js": "node.js",
  "javascript": "javascript",
  "js": "javascript",
  "typescript": "typescript",
  "ts": "typescript",
  "python": "python",
  "py": "python",
  "sql": "sql",
  "postgresql": "postgresql",
  "postgre sql": "postgresql",
  "html": "html",
  "css": "css",
  "tailwindcss": "tailwind css",
  "tailwind": "tailwind css",
  "figma": "figma",
  "uxui": "ux/ui",
  "ux ui": "ux/ui",
  "reactjs": "react",
  "react js": "react",
  "nextjs": "next.js",
  "next js": "next.js",
  "machine learning": "machine learning",
  "ml": "machine learning",
  "ai": "artificial intelligence",
  "artificialintelligence": "artificial intelligence",
  "data analysis": "data analysis",
  "dataanalyst": "data analysis",
  "problem solving": "problem solving",
  "problem-solving": "problem solving",
};

function normalizeSkillName(raw: string): string {
  const cleaned = raw
    .toLowerCase()
    .replace(/[^a-z0-9+.#\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) return "";
  return SKILL_ALIASES[cleaned] ?? cleaned;
}

function normalizePreferenceTokens(raw: string): string[] {
  return Array.from(
    new Set(
      raw
        .toLowerCase()
        .split(/[^a-z0-9+#.]+/)
        .map((token) => normalizeSkillName(token))
        .filter(Boolean)
    )
  );
}

export interface CandidateQueryResult<T> {
  candidates: T[];
  relaxed: boolean; // true kalau filter ketat gagal & terpaksa dilonggarkan
}

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
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
  countryPreference: string[];
  budgetRange: { min: number; max: number } | null;
}): Promise<CandidateQueryResult<{ id: string; name: string; country: string; facultyTags: string[] }>> {
  const countryFilter = params.countryPreference.length > 0
    ? { country: { in: params.countryPreference, mode: "insensitive" as const } }
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
    take: FETCH_LIMIT,
  });
  if (candidates.length >= 3) return { candidates: shuffleArray(candidates).slice(0, CANDIDATE_LIMIT), relaxed: false };

  candidates = await prisma.university.findMany({
    where: { facultyTags: { hasSome: params.facultyTags } },
    select: { id: true, name: true, country: true, facultyTags: true },
    take: FETCH_LIMIT,
  });
  if (candidates.length >= 1) return { candidates: shuffleArray(candidates).slice(0, CANDIDATE_LIMIT), relaxed: true };

  candidates = await prisma.university.findMany({
    select: { id: true, name: true, country: true, facultyTags: true },
    take: FETCH_LIMIT,
  });
  return { candidates: shuffleArray(candidates).slice(0, CANDIDATE_LIMIT), relaxed: true };
}

export async function findCandidateScholarships(params: {
  facultyTags: string[];
  countryPreference: string[];
}): Promise<CandidateQueryResult<{ id: string; name: string; scope: string; country?: string | null; facultyTags: string[] }>> {
  const hasIndo = params.countryPreference.includes('indonesia');
  const hasForeign = params.countryPreference.some(c => c !== 'indonesia');
  
  const scopeFilter = hasIndo && hasForeign 
    ? {} 
    : (hasIndo ? { scope: { in: ["dalam_negeri", "keduanya"] } } : (hasForeign ? { scope: { in: ["luar_negeri", "keduanya"] } } : {}));

  const countryFilter = params.countryPreference.length > 0
    ? {
        OR: [
          { country: { in: params.countryPreference, mode: "insensitive" as const } },
          { country: { equals: "Global", mode: "insensitive" as const } },
          { country: { equals: "Keduanya", mode: "insensitive" as const } },
          ...(hasIndo ? [{ country: { equals: "Indonesia", mode: "insensitive" as const } }] : [])
        ]
      }
    : {};

  let candidates = await prisma.scholarship.findMany({
    where: { facultyTags: { hasSome: params.facultyTags }, ...scopeFilter, ...countryFilter },
    select: { id: true, name: true, scope: true, country: true, facultyTags: true },
    take: FETCH_LIMIT,
  });
  if (candidates.length >= 3) return { candidates: shuffleArray(candidates).slice(0, CANDIDATE_LIMIT), relaxed: false };

  candidates = await prisma.scholarship.findMany({
    where: { facultyTags: { hasSome: params.facultyTags } },
    select: { id: true, name: true, scope: true, country: true, facultyTags: true },
    take: FETCH_LIMIT,
  });
  if (candidates.length >= 1) return { candidates: shuffleArray(candidates).slice(0, CANDIDATE_LIMIT), relaxed: true };

  candidates = await prisma.scholarship.findMany({
    select: { id: true, name: true, scope: true, country: true, facultyTags: true },
    take: FETCH_LIMIT,
  });
  return { candidates: shuffleArray(candidates).slice(0, CANDIDATE_LIMIT), relaxed: true };
}

export async function findCandidateCoursesByFacultyTags(
  facultyTags: string[]
): Promise<CandidateQueryResult<{ id: string; title: string; facultyTags: string[] }>> {
  let candidates = await prisma.course.findMany({
    where: { isPublished: true, facultyTags: { hasSome: facultyTags } },
    select: { id: true, title: true, facultyTags: true },
    take: FETCH_LIMIT,
  });
  if (candidates.length >= 3) return { candidates: shuffleArray(candidates).slice(0, CANDIDATE_LIMIT), relaxed: false };

  candidates = await prisma.course.findMany({
    where: { isPublished: true },
    select: { id: true, title: true, facultyTags: true },
    take: FETCH_LIMIT,
  });
  return { candidates: shuffleArray(candidates).slice(0, CANDIDATE_LIMIT), relaxed: true };
}

// Course untuk Chaser difilter longgar lewat kecocokan teks major/jobPreference
// terhadap nama Skill yang terhubung ke course -- bukan facultyTags. Kandidat
// yang lebih akurat (berdasar skill gap) baru diketahui SETELAH Agent 2
// jalan (skill gap adalah bagian dari OUTPUT, bukan input), jadi di titik
// ini kita cuma bisa filter kasar berdasar teks yang sudah ada.
// Saat ini sektor Chaser yang aktif hanya Information Technology, jadi kandidat
// course (termasuk fallback) dibatasi ke facultyTags IT.
const CHASER_ALLOWED_FACULTY_TAGS = ["cs_it", "data_ai"];

export async function findCandidateCoursesForChaser(
  major: string,
  jobPreference: string
): Promise<CandidateQueryResult<{ id: string; title: string; facultyTags: string[] }>> {
  const keywords = Array.from(new Set([
    normalizeSkillName(major),
    ...normalizePreferenceTokens(jobPreference),
  ].filter(Boolean)));
  const itFilter = { houseId: null };

  let candidates = await prisma.course.findMany({
    where: {
      isPublished: true,
      ...itFilter,
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
    where: { isPublished: true, ...itFilter },
    select: { id: true, title: true, facultyTags: true },
    take: CANDIDATE_LIMIT,
  });
  return { candidates, relaxed: true };
}

export async function findCandidateJobs(
  jobPreference: string,
  userSkills: string[] = []
): Promise<CandidateQueryResult<{ id: string; title: string; company: string; skillsRequired: string[] }>> {
  const keywords = normalizePreferenceTokens(jobPreference);
  const skillSet = new Set(userSkills.map((s) => normalizeSkillName(s)));

  const jobs = await prisma.job.findMany({
    select: { id: true, title: true, company: true, skillsRequired: true },
    take: 200,
  });

  // Skor = overlap skill (bobot 2) + keyword preferensi di judul (bobot 1).
  const scored = jobs
    .map((job) => {
      const normalizedRequired = (job.skillsRequired ?? []).map((skill) => normalizeSkillName(skill));
      const skillHits = normalizedRequired.filter((s) => skillSet.has(s)).length;
      const title = job.title.toLowerCase();
      const keywordHits = keywords.filter((k) => title.includes(k)).length;
      return { job, score: skillHits * 2 + keywordHits };
    })
    .sort((a, b) => b.score - a.score);

  const relevant = scored.filter((s) => s.score > 0);
  if (relevant.length >= 1) {
    return { candidates: relevant.slice(0, CANDIDATE_LIMIT).map((s) => s.job), relaxed: false };
  }
  return { candidates: scored.slice(0, CANDIDATE_LIMIT).map((s) => s.job), relaxed: true };
}
