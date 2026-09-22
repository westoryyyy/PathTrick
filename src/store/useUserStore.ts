import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mockBackendData } from '@/data/mockBackendData';

interface UserState {
  totalXP: number;
  level: number;
  dailyBountyClaimed: boolean;
  hasCompletedQuizToday: boolean;
  addXP: (amount: number) => void;
  claimDailyBounty: () => void;
  completeQuiz: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      totalXP: mockBackendData.user.totalXP,
      level: mockBackendData.user.level,
      dailyBountyClaimed: mockBackendData.user.dailyBounty.isClaimed,
      hasCompletedQuizToday: false, // Default to false for the flow demonstration
      addXP: (amount) => set((state) => {
        const newXP = state.totalXP + amount;
        // Simple formula: Level up every 500 XP or so (start at lv 7 for 2450)
        const newLevel = Math.floor(newXP / 500) + 2; 
        return { totalXP: newXP, level: Math.max(state.level, newLevel) };
      }),
      claimDailyBounty: () => set({ dailyBountyClaimed: true }),
      completeQuiz: () => set({ hasCompletedQuizToday: true }),
    }),
    {
      name: 'pathtrick-user-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
