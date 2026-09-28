'use client';

import { useTranslationStore } from '@/store/useTranslationStore';

/**
 * LanguageToggle — pixel-art style EN / ID language switcher.
 * Drop this anywhere in a layout header to give the user language control.
 */
export default function LanguageToggle() {
  const { locale, toggleLocale } = useTranslationStore();
  const isEN = locale === 'en';

  return (
    <button
      onClick={toggleLocale}
      title={isEN ? 'Switch to Indonesian' : 'Switch to English'}
      style={{
        fontFamily: '"Press Start 2P"',
        fontSize: '0.5rem',
        background: isEN ? '#1d4ed8' : '#d97706',
        color: '#fff',
        border: `2px solid ${isEN ? '#1e3a8a' : '#92400e'}`,
        boxShadow: `2px 2px 0 ${isEN ? '#1e3a8a' : '#92400e'}`,
        padding: '6px 10px',
        cursor: 'pointer',
        letterSpacing: '0.05em',
        userSelect: 'none',
        transition: 'background 0.15s, box-shadow 0.15s',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        whiteSpace: 'nowrap',
      }}
    >
      {isEN ? '🇬🇧 EN' : '🇮🇩 ID'}
    </button>
  );
}
