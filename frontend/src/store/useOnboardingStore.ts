'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { GICSSectorCode } from '@/data/gicsData';
import { ClassifiedSkill } from '@/data/wefSkillData';

/* ═══════════════════════════════════════════════
   Type Definitions
   ═══════════════════════════════════════════════ */

export type UserRole = 'dreamer' | 'chaser' | 'admin';

/** RIASEC dimension scores (1–5 each) */
export interface RIASECScores {
  realistic: number;
  investigative: number;
  artistic: number;
  social: number;
  enterprising: number;
  conventional: number;
}

/** Dreamer assessment form state */
export interface DreamerAssessmentState {
  riasec: RIASECScores;
  budgetPreference: string;        // required
  facultyPreferences: string[];    // optional, multi-select
  countryPreferences: string[];    // optional, multi-select
}

/** Data extracted by AI from the uploaded CV */
export interface CVExtractedData {
  skills: ClassifiedSkill[];       // AI-extracted skills from CV/Portfolio
  experience: string[];
  education: string;
}

/** Chaser assessment form state */
export interface ChaserAssessmentState {
  cvFile: File | null;             // required
  cvFileName: string;
  cvExtractionStatus: 'idle' | 'uploading' | 'extracting' | 'done' | 'error';
  cvExtractedData: CVExtractedData | null;
  cvText: string;
  portfolioFile: File | null;      // optional
  portfolioFileName: string;
  portfolioText: string;
  workInterests: string[];         // tipe pekerjaan: Full-time, Remote, dll
  preferredGICS: GICSSectorCode[]; // GICS sectors (was: preferredIndustries: string[])
}

/* ═══════════════════════════════════════════════
   Store Interface
   ═══════════════════════════════════════════════ */

interface OnboardingStore {
  /* ── Role Selection ── */
  selectedRole: UserRole | null;
  savedPrivyUserId: string | null;        // ties selectedRole to a specific Privy user
  setRole: (role: UserRole, privyUserId?: string) => void;

  /* ── Step Tracking ── */
  currentStep: number;
  totalSteps: number;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;

  /* ── Dreamer Assessment ── */
  dreamerAssessment: DreamerAssessmentState;
  setDreamerField: <K extends keyof DreamerAssessmentState>(key: K, value: DreamerAssessmentState[K]) => void;
  setRIASECScore: (dimension: keyof RIASECScores, score: number) => void;

  /* ── Chaser Assessment ── */
  chaserAssessment: ChaserAssessmentState;
  setChaserField: <K extends keyof ChaserAssessmentState>(key: K, value: ChaserAssessmentState[K]) => void;
  setCVExtractedData: (data: CVExtractedData | null) => void;

  /* ── Submission ── */
  isSubmitting: boolean;
  submitAssessment: () => Promise<void>;

  /* ── Reset ── */
  resetOnboarding: () => void;
}

/* ═══════════════════════════════════════════════
   Default Values
   ═══════════════════════════════════════════════ */

const DEFAULT_RIASEC: RIASECScores = {
  realistic: 0,
  investigative: 0,
  artistic: 0,
  social: 0,
  enterprising: 0,
  conventional: 0,
};

const DEFAULT_DREAMER: DreamerAssessmentState = {
  riasec: { ...DEFAULT_RIASEC },
  budgetPreference: '',
  facultyPreferences: [],
  countryPreferences: [],
};

const DEFAULT_CHASER: ChaserAssessmentState = {
  cvFile: null,
  cvFileName: '',
  cvExtractionStatus: 'idle',
  cvExtractedData: null,
  cvText: '',
  portfolioFile: null,
  portfolioFileName: '',
  portfolioText: '',
  workInterests: [],
  preferredGICS: [],
};

/** Step counts per role */
const STEP_COUNTS: Record<UserRole, number> = {
  dreamer: 3,        // RIASEC → Budget → Preferences
  chaser: 2,  // CV Upload → Work Interest
  admin: 0,
};

/* ═══════════════════════════════════════════════
   Store
   ═══════════════════════════════════════════════ */

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set, get) => ({
      /* ── Role ── */
      selectedRole: null,
      savedPrivyUserId: null,
      setRole: (role, privyUserId) =>
        set({
          selectedRole: role,
          savedPrivyUserId: privyUserId ?? null,
          currentStep: 0,
          totalSteps: STEP_COUNTS[role],
        }),

  /* ── Steps ── */
  currentStep: 0,
  totalSteps: 0,
  nextStep: () => {
    const { currentStep, totalSteps } = get();
    if (currentStep < totalSteps - 1) set({ currentStep: currentStep + 1 });
  },
  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 0) set({ currentStep: currentStep - 1 });
  },
  goToStep: (step) => set({ currentStep: step }),

  /* ── Dreamer ── */
  dreamerAssessment: { ...DEFAULT_DREAMER },
  setDreamerField: (key, value) =>
    set((s) => ({
      dreamerAssessment: { ...s.dreamerAssessment, [key]: value },
    })),
  setRIASECScore: (dimension, score) =>
    set((s) => ({
      dreamerAssessment: {
        ...s.dreamerAssessment,
        riasec: { ...s.dreamerAssessment.riasec, [dimension]: score },
      },
    })),

  /* ── Chaser ── */
  chaserAssessment: { ...DEFAULT_CHASER },
  setChaserField: (key, value) =>
    set((s) => ({
      chaserAssessment: { ...s.chaserAssessment, [key]: value },
    })),
  setCVExtractedData: (data) =>
    set((s) => ({
      chaserAssessment: {
        ...s.chaserAssessment,
        cvExtractedData: data,
        cvExtractionStatus: data ? 'done' : s.chaserAssessment.cvExtractionStatus === 'error' ? 'idle' : s.chaserAssessment.cvExtractionStatus,
      },
    })),

  /* ── Submission ── */
  isSubmitting: false,
  submitAssessment: async () => {
    set({ isSubmitting: true });
    const { selectedRole, dreamerAssessment, chaserAssessment } = get();
    try {
      let requestBody: any = { role: selectedRole, data: dreamerAssessment };
      
      if (selectedRole === 'chaser') {
        const gicsNames = chaserAssessment.preferredGICS.join(', ');
        const workTypes = chaserAssessment.workInterests.join(', ');
        const jobPreferenceStr = `Industri: ${gicsNames}. Tipe Kerja: ${workTypes}`;
        
        requestBody = {
          type: "SCHOLAR_PROFILE",
          payload: {
            cvText: chaserAssessment.cvText || "",
            portfolioText: chaserAssessment.portfolioText || null,
            major: "Lulusan S1/Sederajat", // Fallback karena belum ada input jurusan di UI
            jobPreference: jobPreferenceStr,
          }
        };
      }


      const response = await fetch('/api/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
      
      if (!response.ok) throw new Error('API Error');
      const data = await response.json();
      console.log('AI Assessment Result:', data);
    } catch (e) {
      console.error('Submission failed', e);
    } finally {
      set({ isSubmitting: false });
    }
  },

  /* ── Reset ── */
  resetOnboarding: () =>
    set({
      selectedRole: null,
      savedPrivyUserId: null,
      currentStep: 0,
      totalSteps: 0,
      dreamerAssessment: { ...DEFAULT_DREAMER, riasec: { ...DEFAULT_RIASEC } },
      chaserAssessment: { ...DEFAULT_CHASER, preferredGICS: [], workInterests: [] },
      isSubmitting: false,
    }),
    }),
    {
      name: 'pathtrick-onboarding-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

/**
 * Get the per-user storage key for a given Privy user ID.
 * Each user gets their own isolated localStorage entry.
 */
export function getUserStorageKey(privyUserId: string): string {
  return `pathtrick-onboarding-${privyUserId}`;
}

/**
 * Load or save onboarding state scoped to a specific user ID.
 * Call this after login to switch the store to the logged-in user's data.
 */
export function loadUserOnboarding(privyUserId: string) {
  const key = getUserStorageKey(privyUserId);
  const raw = localStorage.getItem(key);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      useOnboardingStore.setState({ ...parsed, savedPrivyUserId: privyUserId });
    } catch {
      // ignore corrupt data
    }
  } else {
    // New user on this device — reset to clean slate
    useOnboardingStore.getState().resetOnboarding();
    useOnboardingStore.setState({ savedPrivyUserId: privyUserId });
  }
}

/**
 * Persist current onboarding state under the current user's key.
 * Called automatically via store subscription.
 */
export function saveUserOnboarding(privyUserId: string) {
  const key = getUserStorageKey(privyUserId);
  const state = useOnboardingStore.getState();
  // Omit non-serializable File objects
  const toSave = {
    selectedRole: state.selectedRole,
    savedPrivyUserId: state.savedPrivyUserId,
    currentStep: state.currentStep,
    totalSteps: state.totalSteps,
    dreamerAssessment: state.dreamerAssessment,
    chaserAssessment: {
      ...state.chaserAssessment,
      cvFile: null,
      portfolioFile: null,
    },
  };
  localStorage.setItem(key, JSON.stringify(toSave));
}

/**
 * Clear onboarding data for a specific user from localStorage.
 */
export function clearUserOnboarding(privyUserId: string) {
  localStorage.removeItem(getUserStorageKey(privyUserId));
}

// Subscribe to changes and save automatically
useOnboardingStore.subscribe((state) => {
  if (state.savedPrivyUserId) {
    saveUserOnboarding(state.savedPrivyUserId);
  }
});
