import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mockBackendData } from '@/data/mockBackendData';

interface UserState {
  totalXP: number;
  level: number;
  dailyBountyClaimed: boolean;
  hasCompletedQuizToday: boolean;
  displayName: string;
  displayEmail: string;
  avatarUrl: string;
  hasJustLeveledUp: boolean;
  addXP: (amount: number) => void;
  triggerLevelUp: () => void;
  claimDailyBounty: () => void;
  completeQuiz: () => void;
  setProfile: (name: string, email: string) => void;
  setAvatar: (avatarUrl: string) => void;
  clearLevelUpFlag: () => void;
  hydrateUser: (xp: number, level: number, name: string, email: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      totalXP: 0,
      level: 1,
      dailyBountyClaimed: false,
      hasCompletedQuizToday: false,
      displayName: '',
      displayEmail: '',
      avatarUrl: '/char_dreamer.png',
      hasJustLeveledUp: false,
      addXP: (amount) => set((state) => {
        const newXP = state.totalXP + amount;
        const newLevel = Math.max(1, Math.floor(newXP / 1000) + 1);
        if (newLevel > state.level) {
          return { totalXP: newXP, level: newLevel, hasJustLeveledUp: true };
        }
        return { totalXP: newXP };
      }),
      triggerLevelUp: () => set((state) => ({
        level: state.level + 1,
        hasJustLeveledUp: true
      })),
      claimDailyBounty: () => set({ dailyBountyClaimed: true }),
      completeQuiz: () => set({ hasCompletedQuizToday: true }),
      setProfile: (name, email) => set({ displayName: name, displayEmail: email }),
      setAvatar: (avatarUrl) => set({ avatarUrl }),
      clearLevelUpFlag: () => set({ hasJustLeveledUp: false }),
      hydrateUser: (xp: number, level: number, name: string, email: string) => set({ totalXP: xp, level, displayName: name, displayEmail: email }),
    }),
    {
      name: 'pathtrick-user-storage-v2',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
