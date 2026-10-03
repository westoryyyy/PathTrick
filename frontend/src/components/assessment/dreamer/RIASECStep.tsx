'use client';

import { useOnboardingStore, type RIASECScores } from '@/store/useOnboardingStore';
import PixelIcon from '@/components/ui/PixelIcon';

const DIMENSIONS: {
  key: keyof RIASECScores;
  label: string;
  icon: string;
  desc: string;
  color: string;
}[] = [
  { key: 'realistic',    label: 'Realistic',    icon: '⚒️', desc: 'Suka bekerja dengan tangan, alat, mesin, atau di luar ruangan.', color: '#ef4444' },
  { key: 'investigative',label: 'Investigative', icon: '🔬', desc: 'Suka menganalisis data, meneliti, dan memecahkan masalah.', color: '#3b82f6' },
  { key: 'artistic',     label: 'Artistic',     icon: '🎨', desc: 'Suka berkreasi, berimajinasi, dan mengekspresikan diri.', color: '#a855f7' },
  { key: 'social',       label: 'Social',       icon: '🤝', desc: 'Suka membantu orang lain, mengajar, dan bekerja tim.', color: '#10b981' },
  { key: 'enterprising', label: 'Enterprising', icon: '🚀', desc: 'Suka memimpin, memengaruhi, dan mengambil risiko.', color: '#f59e0b' },
  { key: 'conventional', label: 'Conventional', icon: '📊', desc: 'Suka bekerja terstruktur, mengorganisir data, dan prosedur.', color: '#06b6d4' },
];

const GEMS = [1, 2, 3, 4, 5];

export default function RIASECStep() {
  const riasec = useOnboardingStore((s) => s.dreamerAssessment.riasec);
  const setScore = useOnboardingStore((s) => s.setRIASECScore);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '12px',
      width: '100%',
    }}>
      {DIMENSIONS.map((dim) => {
        const currentScore = riasec[dim.key];
        const isFilled = currentScore > 0;
        return (
          <div
            key={dim.key}
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              padding: '14px',
              background: isFilled ? '#d4a373' : '#bc8f65',
              border: `4px solid ${isFilled ? dim.color : '#5a3a29'}`,
              boxShadow: isFilled
                ? `inset 0 0 12px rgba(0,0,0,0.25), 0 0 0 3px ${dim.color}44, 3px 3px 0 rgba(0,0,0,0.5)`
                : 'inset 0 0 12px rgba(0,0,0,0.25), 3px 3px 0 rgba(0,0,0,0.5)',
              transition: 'filter 0.1s',
              minHeight: '180px',
            }}
          >
            {/* Description */}
            <p className="font-pixel" style={{
              fontSize: '0.6rem',
              color: 'rgba(255,255,255,0.9)',
              margin: 0,
              lineHeight: 1.8,
              textTransform: 'uppercase',
              textShadow: '1px 1px 0 #3b261b',
              flex: 1,
            }}>
              {dim.desc}
            </p>

            {/* Gem rating bar */}
            <div style={{
              position: 'relative',
              background: 'rgba(0,0,0,0.2)',
              border: '2px solid rgba(59,38,27,0.5)',
              padding: '8px 8px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              {GEMS.map((score) => {
                const isActive = score <= currentScore;
                return (
                  <button
                    key={score}
                    type="button"
                    onClick={() => setScore(dim.key, score)}
                    aria-label={`${dim.label} skor ${score}`}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '2px 4px',
                      fontSize: isActive ? '1.1rem' : '0.95rem',
                      filter: isActive
                        ? `drop-shadow(0 0 5px ${dim.color}) brightness(1.2)`
                        : 'grayscale(1) opacity(0.3)',
                      transform: isActive ? 'scale(1.15)' : 'scale(1)',
                      transition: 'all 0.15s',
                      lineHeight: 1,
                    }}
                  >
                    💎
                  </button>
                );
              })}

              <span className="font-pixel" style={{
                position: 'absolute', bottom: '5px', left: '8px',
                fontSize: '0.48rem', color: 'rgba(255,255,255,0.85)',
                textShadow: '1px 1px 0 #3b261b',
                whiteSpace: 'nowrap', pointerEvents: 'none',
              }}>Sangat Tidak Setuju</span>
              <span className="font-pixel" style={{
                position: 'absolute', bottom: '5px', right: '8px',
                fontSize: '0.48rem', color: 'rgba(255,255,255,0.85)',
                textShadow: '1px 1px 0 #3b261b',
                whiteSpace: 'nowrap', pointerEvents: 'none',
              }}>Sangat Setuju</span>
            </div>

            {/* Score badge */}
            {isFilled && (
              <div className="font-pixel" style={{
                position: 'absolute', top: '-10px', right: '10px',
                fontSize: '0.5rem', color: 'white',
                background: dim.color, border: '2px solid white',
                padding: '2px 6px',
                boxShadow: '2px 2px 0 rgba(0,0,0,0.7)',
              }}>
                {currentScore}/5
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function isRIASECComplete(riasec: RIASECScores): boolean {
  return Object.values(riasec).every((v) => v > 0);
}
