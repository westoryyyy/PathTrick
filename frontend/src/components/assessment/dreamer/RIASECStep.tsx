'use client';

import { useEffect, useState, useMemo } from 'react';
import { useOnboardingStore } from '@/store/useOnboardingStore';
import { API_BASE_URL } from '@/config/pathtrick';
import PixelIcon from '@/components/ui/PixelIcon';

interface RiasecQuestion {
  id: string;
  text: string;
  order: number;
}

const GEMS = [1, 2, 3, 4, 5];
const QUESTIONS_PER_PAGE = 6;
const DEFAULT_CARD_COLOR = '#3b82f6'; // We can use blue for all questions since category is hidden

export default function RIASECStep() {
  const [questions, setQuestions] = useState<RiasecQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  const riasecAnswers = useOnboardingStore((s) => s.dreamerAssessment.riasecAnswers);
  const setRiasecAnswer = useOnboardingStore((s) => s.setRiasecAnswer);
  const setRiasecTotalQuestions = useOnboardingStore((s) => s.setRiasecTotalQuestions);

  useEffect(() => {
    let isMounted = true;
    fetch(`${API_BASE_URL}/api/riasec/questions`)
      .then((res) => {
        if (!res.ok) throw new Error('Gagal memuat soal.');
        return res.json();
      })
      .then((data: RiasecQuestion[]) => {
        if (isMounted) {
          setQuestions(data);
          setRiasecTotalQuestions(data.length);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error(err);
          setError('Gagal terhubung ke server.');
          setIsLoading(false);
        }
      });
    return () => { isMounted = false; };
  }, [setRiasecTotalQuestions]);

  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
  
  const currentQuestions = useMemo(() => {
    const startIndex = (currentPage - 1) * QUESTIONS_PER_PAGE;
    return questions.slice(startIndex, startIndex + QUESTIONS_PER_PAGE);
  }, [questions, currentPage]);

  if (isLoading) {
    return (
      <div className="font-pixel text-center text-white p-8">
        <p>Memuat Asesmen RIASEC...</p>
        <span className="inline-block mt-4 animate-bounce">⏳</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="font-pixel text-center text-red-400 p-8">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-900 text-white border-2 border-red-500 hover:bg-red-800"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
      {/* Progress Info */}
      <div className="flex justify-between items-center font-pixel text-white text-xs bg-black/30 p-3 border-2 border-[#5a3a29]">
        <span>Halaman {currentPage} dari {totalPages}</span>
        <span>
          Terjawab: {Object.keys(riasecAnswers ?? {}).filter(k => /^q\d{2}$/.test(k)).length} / {questions.length}
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        width: '100%',
      }}>
        {currentQuestions.map((q) => {
          const currentScore = riasecAnswers?.[q.id] ?? 0;
          const isFilled = currentScore > 0;
          
          // Generate a deterministic color based on question ID to make it colorful
          // q01 -> index 1, q02 -> index 2, etc.
          const colors = ['#ef4444', '#3b82f6', '#a855f7', '#10b981', '#f59e0b', '#06b6d4'];
          const qNum = parseInt(q.id.replace('q', ''), 10) || 1;
          const cardColor = colors[qNum % colors.length];

          return (
            <div
              key={q.id}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                padding: '14px',
                background: isFilled ? '#d4a373' : '#bc8f65',
                border: `4px solid ${isFilled ? cardColor : '#5a3a29'}`,
                boxShadow: isFilled
                  ? `inset 0 0 12px rgba(0,0,0,0.25), 0 0 0 3px ${cardColor}44, 3px 3px 0 rgba(0,0,0,0.5)`
                  : 'inset 0 0 12px rgba(0,0,0,0.25), 3px 3px 0 rgba(0,0,0,0.5)',
                transition: 'filter 0.1s',
                minHeight: '180px',
              }}
            >
              {/* Question Text */}
              <p className="font-pixel" style={{
                fontSize: '0.6rem',
                color: 'rgba(255,255,255,0.9)',
                margin: 0,
                lineHeight: 1.8,
                textTransform: 'uppercase',
                textShadow: '1px 1px 0 #3b261b',
                flex: 1,
              }}>
                {q.order}. {q.text}
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
                      onClick={() => setRiasecAnswer(q.id, score)}
                      aria-label={`Skor ${score}`}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '2px 4px',
                        fontSize: isActive ? '1.1rem' : '0.95rem',
                        filter: isActive
                          ? `drop-shadow(0 0 5px ${cardColor}) brightness(1.2)`
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

                {/* Labels */}
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
                  background: cardColor, border: '2px solid white',
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

      {/* Pagination Controls */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className={`font-pixel text-xs px-4 py-2 border-2 ${
            currentPage === 1 
              ? 'bg-gray-600 border-gray-700 text-gray-400 cursor-not-allowed' 
              : 'bg-[#d4a373] border-[#5a3a29] text-white hover:brightness-110'
          }`}
          style={{ boxShadow: currentPage === 1 ? 'none' : '3px 3px 0 rgba(0,0,0,0.5)' }}
        >
          &lt; SEBELUMNYA
        </button>

        <button
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className={`font-pixel text-xs px-4 py-2 border-2 ${
            currentPage === totalPages 
              ? 'bg-gray-600 border-gray-700 text-gray-400 cursor-not-allowed' 
              : 'bg-[#d4a373] border-[#5a3a29] text-white hover:brightness-110'
          }`}
          style={{ boxShadow: currentPage === totalPages ? 'none' : '3px 3px 0 rgba(0,0,0,0.5)' }}
        >
          SELANJUTNYA &gt;
        </button>
      </div>
    </div>
  );
}
