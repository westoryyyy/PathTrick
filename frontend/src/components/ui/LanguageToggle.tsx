'use client';

import { useTranslationStore } from '@/store/useTranslationStore';
import styles from './LanguageToggle.module.css';

/**
 * LanguageToggle — pixel-art style EN / ID language switcher.
 * Drop this anywhere in a layout header to give the user language control.
 */
export default function LanguageToggle() {
  const { locale, toggleLocale } = useTranslationStore();
  const isEN = locale === 'en';

  return (
    <div
      className={styles.toggleContainer}
      onClick={toggleLocale}
      title={isEN ? 'Switch to Indonesian' : 'Switch to English'}
    >
      <div className={styles.trackLabels}>
        <span>ID</span>
        <span>EN</span>
      </div>
      <div className={`${styles.knob} ${isEN ? styles.isEn : ''}`}>
        <span className={styles.knobText}>{isEN ? 'EN' : 'ID'}</span>
      </div>
    </div>
  );
}
