import { create } from 'zustand';
import { GICSSectorCode } from '@/data/gicsData';
import {
  ClassifiedSkill,
  classifySkills, calculateCareerRank,
  CareerRank,
} from '@/data/wefSkillData'; // Note: we kept the filename wefSkillData.ts but its content is simplified

export type { CareerRank };

interface TargetJob {
  id: string;
  title: string;
  company: string;
  gicsSector: GICSSectorCode;
  requiredSkills: string[];
  matchPercentage: number;
}

interface ScholarState {
  careerRank: CareerRank;
  xp: number;
  earnedSBTs: string[];
  classifiedSkills: ClassifiedSkill[];
  targetJob: TargetJob | null;
  matchedJobs: TargetJob[];
  isLoading: boolean;

  // Actions
  fetchProfileData: () => Promise<void>;
  analyzeSkillGap: () => { missing: string[]; possessed: string[] };
  clearSkills: () => void;
}

const MOCK_JOBS: TargetJob[] = [
  {
    id: 'job-1',
    title: 'Frontend Engineer',
    company: 'GoTo Group',
    gicsSector: 'IT',
    requiredSkills: ['React', 'TypeScript', 'Framer Motion', 'Tailwind CSS'],
    matchPercentage: 90,
  },
  {
    id: 'job-2',
    title: 'UI/UX Designer',
    company: 'Traveloka',
    gicsSector: 'DISC',
    requiredSkills: ['Figma', 'User Research', 'Prototyping'],
    matchPercentage: 65,
  },
  {
    id: 'job-3',
    title: 'Junior Web Developer',
    company: 'Tokopedia',
    gicsSector: 'IT',
    requiredSkills: ['React', 'Git'],
    matchPercentage: 100,
  },
  {
    id: 'job-4',
    title: 'Data Analyst',
    company: 'Bank Central Asia',
    gicsSector: 'FIN',
    requiredSkills: ['SQL', 'Excel', 'Data Analysis', 'Python'],
    matchPercentage: 55,
  },
];

const MOCK_CLASSIFIED_SKILLS: ClassifiedSkill[] = [
  { name: 'React', level: 4 },
  { name: 'TypeScript', level: 3 },
  { name: 'Git', level: 3 },
  { name: 'JavaScript', level: 4 },
  { name: 'Node.js', level: 3 },
  { name: 'Analytical Thinking', level: 3 },
  { name: 'Problem Solving', level: 2 },
  { name: 'Teamwork', level: 2 },
  { name: 'Communication', level: 2 },
];

export const useScholarStore = create<ScholarState>((set, get) => ({
  careerRank: 'Junior',
  xp: 450,
  earnedSBTs: ['React', 'TypeScript', 'Git Basics'],
  classifiedSkills: MOCK_CLASSIFIED_SKILLS,
  targetJob: MOCK_JOBS[0],
  matchedJobs: MOCK_JOBS,
  isLoading: false,

  fetchProfileData: async () => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 800));
    set({ isLoading: false });
  },

  analyzeSkillGap: () => {
    const { targetJob, earnedSBTs } = get();
    if (!targetJob) return { missing: [], possessed: [] };
    const missing = targetJob.requiredSkills.filter(skill => !earnedSBTs.includes(skill));
    const possessed = targetJob.requiredSkills.filter(skill => earnedSBTs.includes(skill));
    
    // Update career rank based on current skills count
    const { classifiedSkills } = get();
    const newRank = calculateCareerRank(classifiedSkills.length);
    set({ careerRank: newRank });

    return { missing, possessed };
  },

  clearSkills: () => {
    set({ earnedSBTs: [], classifiedSkills: [] });
  },
}));
