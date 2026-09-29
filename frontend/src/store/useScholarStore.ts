import { create } from 'zustand';
import { GICSSectorCode } from '@/data/gicsData';
import {
  ClassifiedSkill,
  classifySkills, calculateCareerRank,
  CareerRank,
} from '@/data/wefSkillData'; // Note: we kept the filename wefSkillData.ts but its content is simplified
import { API_BASE_URL } from '@/config/pathtrick';
import { getAuthHeaders } from '@/hooks/useAuthSync';

export type { CareerRank };

interface TargetJob {
  id: string;
  title: string;
  company: string;
  gicsSector: GICSSectorCode;
  requiredSkills: string[];
  matchPercentage: number;
  coverImage?: string;
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
    coverImage: '/Blade.png',
  },
  {
    id: 'job-2',
    title: 'UI/UX Designer',
    company: 'Traveloka',
    gicsSector: 'DISC',
    requiredSkills: ['Figma', 'User Research', 'Prototyping'],
    matchPercentage: 65,
    coverImage: '/Blade.png',
  },
  {
    id: 'job-3',
    title: 'Junior Web Developer',
    company: 'Tokopedia',
    gicsSector: 'IT',
    requiredSkills: ['React', 'Git'],
    matchPercentage: 100,
    coverImage: '/Blade.png',
  },
  {
    id: 'job-4',
    title: 'Data Analyst',
    company: 'Bank Central Asia',
    gicsSector: 'FIN',
    requiredSkills: ['SQL', 'Excel', 'Data Analysis', 'Python'],
    matchPercentage: 55,
    coverImage: '/Blade.png',
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
  earnedSBTs: [],
  classifiedSkills: [],
  targetJob: MOCK_JOBS[0],
  matchedJobs: MOCK_JOBS,
  isLoading: false,

  fetchProfileData: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch(`${API_BASE_URL}/api/jobs`, { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        const jobsList = data.jobs || [];
        if (jobsList.length > 0) {
          const mappedJobs = jobsList.map((j: any) => ({
            id: j.id,
            title: j.title,
            company: j.company,
            // Fallback ke IT karena DB Job tidak punya field gicsSector
            gicsSector: 'IT' as GICSSectorCode, 
            requiredSkills: j.skillsRequired || [],
            matchPercentage: 0,
            coverImage: j.coverImageUrl || '/Blade.png',
          }));
          set({ matchedJobs: mappedJobs, targetJob: mappedJobs[0] });
        }
      }
    } catch (e) {
      console.error('Failed to fetch jobs', e);
    }
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
