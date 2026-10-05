export type ChaserCareerLabel = 'Junior' | 'Mid-level' | 'Senior' | 'Lead' | 'Principal';

export interface ChaserLevelTier {
  name: ChaserCareerLabel;
  minXp: number;
  maxXp: number;
  nextLabel?: ChaserCareerLabel;
  nextXp?: number;
  description: string;
}

export interface ChaserLevelInfo {
  numericLevel: number;
  careerLabel: ChaserCareerLabel;
  currentTier: ChaserLevelTier;
  xpInCurrentTier: number;
  xpToNextTier: number;
  xpToNextLevel: number;
  tierRange: string;
}

export const CHASER_LEVEL_TIERS: ChaserLevelTier[] = [
  {
    name: 'Junior',
    minXp: 0,
    maxXp: 2999,
    nextLabel: 'Mid-level',
    nextXp: 3000,
    description: 'Pemula yang mulai membangun pengalaman dan portofolio kerja.',
  },
  {
    name: 'Mid-level',
    minXp: 3000,
    maxXp: 5999,
    nextLabel: 'Senior',
    nextXp: 6000,
    description: 'Sudah mulai siap menangani proyek dan tugas yang lebih kompleks.',
  },
  {
    name: 'Senior',
    minXp: 6000,
    maxXp: 9999,
    nextLabel: 'Lead',
    nextXp: 10000,
    description: 'Mampu memberi value tinggi dan bekerja dengan tingkat kompleksitas yang lebih besar.',
  },
  {
    name: 'Lead',
    minXp: 10000,
    maxXp: 14999,
    nextLabel: 'Principal',
    nextXp: 15000,
    description: 'Memiliki kemampuan memandu tim dan memecahkan masalah strategis.',
  },
  {
    name: 'Principal',
    minXp: 15000,
    maxXp: Number.POSITIVE_INFINITY,
    description: 'Tingkat senioritas puncak yang sudah siap untuk tantangan kompleks.',
  },
];

export function getChaserLevelInfo(xp: number): ChaserLevelInfo {
  const numericLevel = Math.max(0, Math.floor(xp / 1000));

  let currentTier = CHASER_LEVEL_TIERS[0];
  for (const tier of CHASER_LEVEL_TIERS) {
    if (xp >= tier.minXp && xp < tier.maxXp) {
      currentTier = tier;
      break;
    }
  }

  const xpInCurrentTier = xp - currentTier.minXp;
  const xpToNextTier = currentTier.nextXp == null ? 0 : Math.max(0, currentTier.nextXp - xp);
  const xpToNextLevel = 1000 - (xp % 1000 || 1000);

  return {
    numericLevel,
    careerLabel: currentTier.name,
    currentTier,
    xpInCurrentTier,
    xpToNextTier,
    xpToNextLevel,
    tierRange: `${currentTier.minXp}–${currentTier.maxXp === Number.POSITIVE_INFINITY ? '∞' : currentTier.maxXp} XP`,
  };
}
