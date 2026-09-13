'use client';

import { create } from 'zustand';

/* ═══════════════════════════════════════════════
   Type Definitions
   ═══════════════════════════════════════════════ */

export type UserRole = 'sma' | 'mahasiswa';

/** RIASEC dimension scores (1–5 each) */
export interface RIASECScores {
  realistic: number;
  investigative: number;
  artistic: number;
  social: number;
  enterprising: number;
  conventional: number;
}

/** SMA assessment form state */
export interface SMAAssessmentState {
  riasec: RIASECScores;
  budgetPreference: string;        // required
  facultyPreferences: string[];    // optional, multi-select
  countryPreferences: string[];    // optional, multi-select
}

/** Data extracted by AI from the uploaded CV */
export interface CVExtractedData {
  skills: string[];
  experience: string[];
  education: string;
}

/** Mahasiswa assessment form state */
export interface MahasiswaAssessmentState {
  cvFile: File | null;             // required
  cvFileName: string;
  cvExtractionStatus: 'idle' | 'uploading' | 'extracting' | 'done' | 'error';
  cvExtractedData: CVExtractedData | null;
  portfolioFile: File | null;      // optional
  portfolioFileName: string;
  workInterests: string[];         // confirmed by user
  preferredIndustries: string[];
}

/* ═══════════════════════════════════════════════
   Store Interface
   ═══════════════════════════════════════════════ */

interface OnboardingStore {
  /* ── Role Selection ── */
  selectedRole: UserRole | null;
  setRole: (role: UserRole) => void;

  /* ── Step Tracking ── */
  currentStep: number;
  totalSteps: number;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;

  /* ── SMA Assessment ── */
  smaAssessment: SMAAssessmentState;
  setSMAField: <K extends keyof SMAAssessmentState>(key: K, value: SMAAssessmentState[K]) => void;
  setRIASECScore: (dimension: keyof RIASECScores, score: number) => void;

  /* ── Mahasiswa Assessment ── */
  mahasiswaAssessment: MahasiswaAssessmentState;
  setMahasiswaField: <K extends keyof MahasiswaAssessmentState>(key: K, value: MahasiswaAssessmentState[K]) => void;
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

const DEFAULT_SMA: SMAAssessmentState = {
  riasec: { ...DEFAULT_RIASEC },
  budgetPreference: '',
  facultyPreferences: [],
  countryPreferences: [],
};

const DEFAULT_MAHASISWA: MahasiswaAssessmentState = {
  cvFile: null,
  cvFileName: '',
  cvExtractionStatus: 'idle',
  cvExtractedData: null,
  portfolioFile: null,
  portfolioFileName: '',
  workInterests: [],
  preferredIndustries: [],
};

/** Step counts per role */
const STEP_COUNTS: Record<UserRole, number> = {
  sma: 3,        // RIASEC → Budget → Preferences
  mahasiswa: 2,  // CV Upload → Work Interest
};

/* ═══════════════════════════════════════════════
   Store
   ═══════════════════════════════════════════════ */

export const useOnboardingStore = create<OnboardingStore>((set, get) => ({
  /* ── Role ── */
  selectedRole: null,
  setRole: (role) =>
    set({
      selectedRole: role,
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

  /* ── SMA ── */
  smaAssessment: { ...DEFAULT_SMA },
  setSMAField: (key, value) =>
    set((s) => ({
      smaAssessment: { ...s.smaAssessment, [key]: value },
    })),
  setRIASECScore: (dimension, score) =>
    set((s) => ({
      smaAssessment: {
        ...s.smaAssessment,
        riasec: { ...s.smaAssessment.riasec, [dimension]: score },
      },
    })),

  /* ── Mahasiswa ── */
  mahasiswaAssessment: { ...DEFAULT_MAHASISWA },
  setMahasiswaField: (key, value) =>
    set((s) => ({
      mahasiswaAssessment: { ...s.mahasiswaAssessment, [key]: value },
    })),
  setCVExtractedData: (data) =>
    set((s) => ({
      mahasiswaAssessment: {
        ...s.mahasiswaAssessment,
        cvExtractedData: data,
        cvExtractionStatus: data ? 'done' : 'error',
      },
    })),

  /* ── Submission ── */
  isSubmitting: false,
  submitAssessment: async () => {
    set({ isSubmitting: true });
    // TODO: POST to /api/assessment with role-specific payload
    // Simulated delay for now
    await new Promise((r) => setTimeout(r, 1500));
    set({ isSubmitting: false });
  },

  /* ── Reset ── */
  resetOnboarding: () =>
    set({
      selectedRole: null,
      currentStep: 0,
      totalSteps: 0,
      smaAssessment: { ...DEFAULT_SMA, riasec: { ...DEFAULT_RIASEC } },
      mahasiswaAssessment: { ...DEFAULT_MAHASISWA },
      isSubmitting: false,
    }),
}));
