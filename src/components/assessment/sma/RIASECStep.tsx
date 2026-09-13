'use client';

import { useOnboardingStore, type RIASECScores } from '@/store/useOnboardingStore';
import styles from './RIASECStep.module.css';

/* ── Dimension metadata ── */
const DIMENSIONS: {
  key: keyof RIASECScores;
  label: string;
  icon: string;
  desc: string;
  color: string;
}[] = [
  {
    key: 'realistic',
    label: 'Realistic',
    icon: '⚒️',
    desc: 'Suka bekerja dengan tangan, alat, mesin, atau di luar ruangan.',
    color: '#ef4444',
  },
  {
    key: 'investigative',
    label: 'Investigative',
    icon: '🔬',
    desc: 'Suka menganalisis data, meneliti, dan memecahkan masalah kompleks.',
    color: '#3b82f6',
  },
  {
    key: 'artistic',
    label: 'Artistic',
    icon: '🎨',
    desc: 'Suka berkreasi, berimajinasi, dan mengekspresikan diri secara bebas.',
    color: '#a855f7',
  },
  {
    key: 'social',
    label: 'Social',
    icon: '🤝',
    desc: 'Suka membantu orang lain, mengajar, membimbing, dan bekerja tim.',
    color: '#10b981',
  },
  {
    key: 'enterprising',
    label: 'Enterprising',
    icon: '🚀',
    desc: 'Suka memimpin, memengaruhi, dan mengambil risiko bisnis.',
    color: '#f59e0b',
  },
  {
    key: 'conventional',
    label: 'Conventional',
    icon: '📊',
    desc: 'Suka bekerja terstruktur, mengorganisir data, dan mengikuti prosedur.',
    color: '#06b6d4',
  },
];

/** Gem/star icons for the 1–5 rating */
const GEMS = ['💎', '💎', '💎', '💎', '💎'];

export default function RIASECStep() {
  const riasec = useOnboardingStore((s) => s.smaAssessment.riasec);
  const setScore = useOnboardingStore((s) => s.setRIASECScore);

  return (
    <div className={styles.grid}>
      {DIMENSIONS.map((dim) => {
        const currentScore = riasec[dim.key];
        return (
          <div
            key={dim.key}
            className={`${styles.card} ${currentScore > 0 ? styles.cardFilled : ''}`}
            style={{ '--dim-color': dim.color } as React.CSSProperties}
          >
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>{dim.icon}</span>
              <h3 className={styles.cardLabel}>{dim.label}</h3>
            </div>
            <p className={styles.cardDesc}>{dim.desc}</p>

            {/* Rating gems */}
            <div className={styles.ratingRow}>
              {GEMS.map((gem, i) => {
                const score = i + 1;
                const isActive = score <= currentScore;
                return (
                  <button
                    key={i}
                    type="button"
                    className={`${styles.gemBtn} ${isActive ? styles.gemActive : ''}`}
                    onClick={() => setScore(dim.key, score)}
                    aria-label={`${dim.label} skor ${score}`}
                  >
                    <span className={styles.gemIcon}>{gem}</span>
                    {i === 0 && <span className={styles.gemLabel}>Rendah</span>}
                    {i === 4 && <span className={styles.gemLabel}>Tinggi</span>}
                  </button>
                );
              })}
            </div>

            {/* Score indicator */}
            {currentScore > 0 && (
              <div className={styles.scoreTag}>
                {currentScore}/5
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/** Check if RIASEC is complete (all dimensions scored) */
export function isRIASECComplete(riasec: RIASECScores): boolean {
  return Object.values(riasec).every((v) => v > 0);
}
