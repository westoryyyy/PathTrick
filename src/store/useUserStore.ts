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
  addXP: (amount: number) => void;
  claimDailyBounty: () => void;
  completeQuiz: () => void;
  setProfile: (name: string, email: string) => void;
  setAvatar: (avatarUrl: string) => void;
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
      addXP: (amount) => set((state) => {
        const newXP = state.totalXP + amount;
        const newLevel = Math.floor(newXP / 500) + 2; 
        return { totalXP: newXP, level: Math.max(state.level, newLevel) };
      }),
      claimDailyBounty: () => set({ dailyBountyClaimed: true }),
      completeQuiz: () => set({ hasCompletedQuizToday: true }),
      setProfile: (name, email) => set({ displayName: name, displayEmail: email }),
      setAvatar: (avatarUrl) => set({ avatarUrl }),
    }),
    {
      name: 'pathtrick-user-storage-v2',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
