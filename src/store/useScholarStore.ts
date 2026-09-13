import { create } from 'zustand';

type CareerRank = 'Trainee' | 'Intern' | 'Junior' | 'Senior' | 'Lead' | 'CTO' | 'Founder';

interface TargetJob {
  id: string;
  title: string;
  company: string;
  requiredSkills: string[];
  matchPercentage: number;
}

interface ScholarState {
  careerRank: CareerRank;
  xp: number;
  earnedSBTs: string[];
  targetJob: TargetJob | null;
  matchedJobs: TargetJob[];
  isLoading: boolean;
  
  // Actions
  fetchProfileData: () => Promise<void>;
  analyzeSkillGap: () => { missing: string[]; possessed: string[] };
  clearSkills: () => void; // For testing empty state
}

const MOCK_JOBS: TargetJob[] = [
  {
    id: 'job-1',
    title: 'Frontend Engineer',
    company: 'GoTo Group',
    requiredSkills: ['React', 'TypeScript', 'Framer Motion', 'Tailwind CSS'],
    matchPercentage: 90,
  },
  {
    id: 'job-2',
    title: 'UI/UX Designer',
    company: 'Traveloka',
    requiredSkills: ['Figma', 'User Research', 'Prototyping'],
    matchPercentage: 65,
  }
];

export const useScholarStore = create<ScholarState>((set, get) => ({
  careerRank: 'Intern',
  xp: 450,
  earnedSBTs: ['React', 'TypeScript', 'Git Basics'],
  targetJob: MOCK_JOBS[0],
  matchedJobs: MOCK_JOBS,
  isLoading: false,

  fetchProfileData: async () => {
    set({ isLoading: true });
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    set({ isLoading: false });
  },

  analyzeSkillGap: () => {
    const { targetJob, earnedSBTs } = get();
    if (!targetJob) return { missing: [], possessed: [] };

    const missing = targetJob.requiredSkills.filter(skill => !earnedSBTs.includes(skill));
    const possessed = targetJob.requiredSkills.filter(skill => earnedSBTs.includes(skill));

    return { missing, possessed };
  },

  clearSkills: () => {
    set({ earnedSBTs: [] });
  }
}));
