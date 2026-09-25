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
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      totalXP: mockBackendData.user.totalXP,
      level: mockBackendData.user.level,
      dailyBountyClaimed: mockBackendData.user.dailyBounty.isClaimed,
      hasCompletedQuizToday: false,
      displayName: '',
      displayEmail: '',
      avatarUrl: '/char_dreamer.png',
      hasJustLeveledUp: false,
      addXP: (amount) => set((state) => ({ totalXP: state.totalXP + amount })),
      triggerLevelUp: () => set((state) => ({
        level: state.level + 1,
        hasJustLeveledUp: true
      })),
      claimDailyBounty: () => set({ dailyBountyClaimed: true }),
      completeQuiz: () => set({ hasCompletedQuizToday: true }),
      setProfile: (name, email) => set({ displayName: name, displayEmail: email }),
      setAvatar: (avatarUrl) => set({ avatarUrl }),
      clearLevelUpFlag: () => set({ hasJustLeveledUp: false }),
    }),
    {
      name: 'pathtrick-user-storage-v2',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
