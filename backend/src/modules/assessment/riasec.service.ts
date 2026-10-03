const RIASEC_CATEGORIES = ["R", "I", "A", "S", "E", "C"] as const;
export type RiasecCategory = (typeof RIASEC_CATEGORIES)[number];

export interface RiasecAnswer {
  category: RiasecCategory;
  value: number;
}

export interface RiasecScoreResult {
  scores: Record<RiasecCategory, number>;
  topCode: string; // 3 huruf tertinggi, mis. "AIE"
}

/**
 * Murni penjumlahan skor per kategori -- TIDAK ADA panggilan AI di sini.
 * Ini yang membuat RIASEC jadi fitur paling "demo-safe" di seluruh sistem
 * (tidak bisa halusinasi, tidak bergantung LLM API sama sekali).
 */
export function scoreRiasec(answers: RiasecAnswer[]): RiasecScoreResult {
  const scores: Record<RiasecCategory, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

  for (const answer of answers) {
    scores[answer.category] += answer.value;
  }

  const topCode = [...RIASEC_CATEGORIES]
    .sort((a, b) => scores[b] - scores[a])
    .slice(0, 3)
    .join("");

  return { scores, topCode };
}

// -----------------------------------------------------------------------
// Pemetaan tipe RIASEC ke 10 Houses -- dipakai backend buat FILTER
// KANDIDAT dari DB (candidate.service.ts) DAN buat menyusun teks instruksi
// ke LLM (lewat describeRiasecToFacultyMapping() di bawah).
// -----------------------------------------------------------------------
const RIASEC_TO_FACULTY_TAGS: Record<RiasecCategory, string[]> = {
  R: ["House of Engineering", "House of Agriculture"],
  I: ["House of ICT", "House of Natural Sciences"],
  A: ["House of Arts & Humanities", "House of Education"],
  S: ["House of Social Sciences", "House of Health & Welfare", "House of Education"],
  E: ["House of Business & Law", "House of Services"],
  C: ["House of Business & Law"],
};

export const ALL_HOUSES = [
  "House of Education",
  "House of Arts & Humanities",
  "House of Social Sciences",
  "House of Business & Law",
  "House of Natural Sciences",
  "House of ICT",
  "House of Engineering",
  "House of Agriculture",
  "House of Health & Welfare",
  "House of Services",
];

// Mapping dari ISCED Studyfields ke Houses (untuk assessment & filter univ)
export const STUDYFIELD_TO_HOUSE: Record<string, string> = {
  "Ilmu Komputer & TI": "House of ICT",
  "Data Science & AI": "House of ICT",
  "Sipil & Arsitektur": "House of Engineering",
  "Mesin & Elektro": "House of Engineering",
  "Kedokteran Umum/Gigi": "House of Health & Welfare",
  "Keperawatan & Farmasi": "House of Health & Welfare",
  "Bisnis & Manajemen": "House of Business & Law",
  "Akuntansi & Keuangan": "House of Business & Law",
  "Ilmu Hukum": "House of Business & Law",
  "Ilmu Politik & Publik": "House of Social Sciences",
  "Ilmu Komunikasi": "House of Social Sciences",
  "Hubungan Internasional": "House of Social Sciences",
  "Psikologi": "House of Education",
  "Pendidikan Guru": "House of Education",
  "Teknologi Pendidikan": "House of Education",
  "Desain & Seni Rupa": "House of Arts & Humanities",
  "Sastra & Bahasa": "House of Arts & Humanities",
  "Matematika & Statistika": "House of Natural Sciences",
  "Fisika, Kimia & Biologi": "House of Natural Sciences",
  "Agribisnis & Pertanian": "House of Agriculture",
  "Kehutanan & Lingkungan": "House of Agriculture",
};

export const STUDYFIELD_TO_SHORTCODE: Record<string, string> = {
  'Agribisnis & Pertanian': 'agr_farm',
  'Akuntansi & Keuangan': 'biz_acc',
  'Bisnis & Manajemen': 'biz_mgmt',
  'Data Science & AI': 'data_ai',
  'Desain & Seni Rupa': 'arts_design',
  'Fisika, Kimia & Biologi': 'sci_natural',
  'Hubungan Internasional': 'soc_ir',
  'Ilmu Hukum': 'law',
  'Ilmu Komunikasi': 'soc_comm',
  'Ilmu Komputer & TI': 'cs_it',
  'Ilmu Politik & Publik': 'law_public',
  'Kedokteran Umum/Gigi': 'med_doctor',
  'Kehutanan & Lingkungan': 'agr_env',
  'Keperawatan & Farmasi': 'med_nurse',
  'Matematika & Statistika': 'sci_math',
  'Mesin & Elektro': 'eng_mech',
  'Pendidikan Guru': 'edu_teacher',
  'Psikologi': 'soc_psy',
  'Sastra & Bahasa': 'arts_lang',
  'Sipil & Arsitektur': 'eng_civil',
  'Teknologi Pendidikan': 'edu_tech'
};

export const RIASEC_TO_SHORTCODES: Record<RiasecCategory, string[]> = {
  R: ["eng_mech", "eng_civil", "agr_farm", "agr_env"],
  I: ["cs_it", "data_ai", "sci_natural", "sci_math"],
  A: ["arts_design", "arts_lang", "edu_pedagogy"],
  S: ["soc_psy", "edu_teacher", "edu_tech", "med_nurse", "med_doctor"],
  E: ["biz_mgmt", "soc_comm", "soc_ir", "law_public"],
  C: ["biz_acc", "law", "business_management"],
};

export const ALL_STUDYFIELDS = Object.keys(STUDYFIELD_TO_HOUSE);

const RIASEC_LABELS: Record<RiasecCategory, string> = {
  R: "Realistic",
  I: "Investigative",
  A: "Artistic",
  S: "Social",
  E: "Enterprising",
  C: "Conventional",
};

export function mapTopCodeToFacultyTags(topCode: string): string[] {
  const tags = new Set<string>();
  for (const letter of topCode) {
    const mapped = RIASEC_TO_FACULTY_TAGS[letter as RiasecCategory];
    if (mapped) mapped.forEach((tag) => tags.add(tag));
  }
  return [...tags];
}

export function mapTopCodeToShortCodes(topCode: string): string[] {
  const tags = new Set<string>();
  for (const letter of topCode) {
    const mapped = RIASEC_TO_SHORTCODES[letter as RiasecCategory];
    if (mapped) mapped.forEach((tag) => tags.add(tag));
  }
  return [...tags];
}

/**
 * Generate teks prosa deskripsi mapping RIASEC->rumpun ilmu, dipakai
 * langsung di system prompt Agent 1 (agent1.prompt.ts). Kalau
 * RIASEC_TO_FACULTY_TAGS di atas diubah, teks ini otomatis ikut berubah
 * tanpa ada yang perlu mengedit agent1.prompt.ts secara manual.
 */
export function describeRiasecToFacultyMapping(): string {
  return RIASEC_CATEGORIES.map((category) => {
    const tags = RIASEC_TO_FACULTY_TAGS[category].join("/");
    return `${category} (${RIASEC_LABELS[category]}) mendekati ${tags}`;
  }).join(", ");
}
