// ─── API CONTRACT: STRICT TYPESCRIPT INTERFACES ───

export interface Chapter {
  id: string;
  name: string;
  description?: string;
  duration?: string;
}

export interface Stage {
  id: string;
  name: string;
  description?: string;
  isCompleted: boolean;
  duration?: string;
  contentType?: 'material' | 'quiz' | 'lab' | 'project';
  chapters?: Chapter[];
}

export interface House {
  id: string;
  title: string;
  description?: string;
  icon: string;
  status: 'completed' | 'active' | 'locked' | 'not_recommended' | 'lockedByLevel';
  isActive?: boolean;
  stages: Stage[];
  houseNumber: number;
  gradient: string;
  progress?: number;
  skillsOverview?: string[];
  idealFor?: string[];
  courseCount?: number;
  matchScore?: number;
}

export interface CareerTrack {
  id: string;
  title: string;
  description: string;
  techTags: string[];
  iconType: string;
  category: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  estimatedWeeks?: number;
}

export interface SoulboundToken {
  id: string;
  name: string;
  description: string;
  icon: string;
  claimedAt?: string;
  isClaimed: boolean;
}

export interface ActiveSBT {
  id: string;
  name: string;
  progress: number;
  icon: string;
  nextMilestone: string;
}

export interface DailyBounty {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  icon: string;
  isClaimed: boolean;
  nextClaimAt?: string;
}

export interface UserProgress {
  userId: string;
  claimedSBTs: SoulboundToken[];
  activeSBT: ActiveSBT;
  dailyBounty: DailyBounty;
  totalXP: number;
  level: number;
}

export interface BackendResponse {
  user: UserProgress;
  houses: House[];
  careerTracks: CareerTrack[];
  metadata: {
    riasecScore: string;
    primaryTrack: string;
    targetCountry: string;
  };
}
