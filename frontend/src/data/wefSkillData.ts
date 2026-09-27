// ─── Skill Data (Simplified) ────────────────────────────────────────────

export interface ClassifiedSkill {
  name: string;
  level: 1 | 2 | 3 | 4 | 5;
}

/** Auto-classify a list of raw skill strings into ClassifiedSkill[] */
export function classifySkills(rawSkills: string[]): ClassifiedSkill[] {
  return rawSkills.map(name => ({
    name,
    level: 3 as const,
  }));
}

export type CareerRank = 'Trainee' | 'Intern' | 'Junior' | 'Senior' | 'Lead' | 'CTO' | 'Founder';

export interface RankThreshold {
  rank: CareerRank;
  minSkillsCount: number;
  description: string;
}

export const CAREER_RANK_THRESHOLDS: RankThreshold[] = [
  { rank: 'Trainee', minSkillsCount: 0, description: 'Baru memulai perjalanan karier.' },
  { rank: 'Intern', minSkillsCount: 2, description: 'Memiliki fondasi dasar.' },
  { rank: 'Junior', minSkillsCount: 5, description: 'Keterampilan solid.' },
  { rank: 'Senior', minSkillsCount: 10, description: 'Keterampilan berkembang pesat.' },
  { rank: 'Lead', minSkillsCount: 15, description: 'Mulai memimpin tim.' },
  { rank: 'CTO', minSkillsCount: 20, description: 'Kemampuan eksekusi tinggi.' },
  { rank: 'Founder', minSkillsCount: 25, description: 'Siap membangun sesuatu dari nol.' },
];

/** Calculate career rank based on number of skills */
export function calculateCareerRank(skillCount: number): CareerRank {
  let highestQualified: CareerRank = 'Trainee';
  for (const threshold of CAREER_RANK_THRESHOLDS) {
    if (skillCount >= threshold.minSkillsCount) {
      highestQualified = threshold.rank;
    }
  }
  return highestQualified;
}
