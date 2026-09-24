import { create } from 'zustand';

interface BGMState {
  isPlaying: boolean;
  toggle: () => void;
  setPlaying: (playing: boolean) => void;
}

export const useBGMStore = create<BGMState>((set) => ({
  isPlaying: false,
  toggle: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setPlaying: (playing) => set({ isPlaying: playing }),
}));
