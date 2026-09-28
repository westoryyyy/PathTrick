import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Locale = 'en' | 'id';

interface TranslationStore {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
}

export const useTranslationStore = create<TranslationStore>()(
  persist(
    (set, get) => ({
      locale: 'en',
      setLocale: (locale) => set({ locale }),
      toggleLocale: () => set({ locale: get().locale === 'en' ? 'id' : 'en' }),
    }),
    { name: 'pathtrick-locale' }
  )
);
