import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface BGMState {
  isPlaying: boolean;
  toggle: () => void;
  setPlaying: (playing: boolean) => void;
}

export const useBGMStore = create<BGMState>()(
  persist(
    (set) => ({
      isPlaying: true, // Auto play by default
      toggle: () => set((state) => ({ isPlaying: !state.isPlaying })),
      setPlaying: (playing) => set({ isPlaying: playing }),
    }),
    {
      name: 'bgm-storage',
    }
  )
);
