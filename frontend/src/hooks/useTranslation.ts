import { useTranslationStore } from '@/store/useTranslationStore';
import en from '@/translations/en.json';
import id from '@/translations/id.json';

const translations: Record<string, Record<string, unknown>> = { en, id };

/**
 * useTranslation — lightweight i18n hook.
 *
 * Usage:
 *   const { t, locale, toggleLocale } = useTranslation();
 *   t('common.logout')              // "LOG OUT" or "KELUAR"
 *   t('mahasiswa.dashboard.title')  // nested key lookup
 */
export function useTranslation() {
  const { locale, toggleLocale, setLocale } = useTranslationStore();
  const dict = translations[locale] ?? translations['en'];

  /**
   * Resolve a dot-notation key from the active translation dictionary.
   * Falls back to the English dictionary, then to the key string itself.
   */
  function t(key: string, fallback?: string): string {
    const parts = key.split('.');
    let current: unknown = dict;
    for (const part of parts) {
      if (typeof current !== 'object' || current === null) {
        break;
      }
      current = (current as Record<string, unknown>)[part];
    }
    if (typeof current === 'string') return current;

    // Fallback: try English
    let fallbackCurrent: unknown = translations['en'];
    for (const part of parts) {
      if (typeof fallbackCurrent !== 'object' || fallbackCurrent === null) {
        break;
      }
      fallbackCurrent = (fallbackCurrent as Record<string, unknown>)[part];
    }
    if (typeof fallbackCurrent === 'string') return fallbackCurrent;

    return fallback ?? key;
  }

  return { t, locale, toggleLocale, setLocale };
}
