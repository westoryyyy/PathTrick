'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '@/components/ui/Dashboard.module.css';
import PixelIcon from '@/components/ui/PixelIcon';
import { useUserStore } from '@/store/useUserStore';
import { useScholarStore } from '@/store/useScholarStore';
import { useRouter, useSearchParams } from 'next/navigation';

const MAHASISWA_MODULES = [
  { id: 'React', title: 'React Mastery', desc: 'Advanced component architecture and hooks.', icon: '⚛️', chapters: [{ id: 'module-react-bab-1', name: 'BAB 1: Component & JSX', duration: '6 Levels' }, { id: 'module-react-bab-2', name: 'BAB 2: Hooks', duration: '6 Levels' }] },
  { id: 'TypeScript', title: 'TypeScript Pro', desc: 'Strict typing for robust frontend apps.', icon: '🟦', chapters: [{ id: 'module-ts-bab-1', name: 'BAB 1: Type Fundamentals', duration: '5 Levels' }, { id: 'module-ts-bab-2', name: 'BAB 2: Advanced Types', duration: '4 Levels' }] },
  { id: 'Framer Motion', title: 'Framer Motion Animation', desc: 'Fluid animations and gestures in React.', icon: '✨', chapters: [{ id: 'module-framer-bab-1', name: 'BAB 1: Basic Animations', duration: '5 Levels' }] },
  { id: 'Tailwind CSS', title: 'Tailwind CSS Fundamentals', desc: 'Utility-first styling for modern UI.', icon: '🎨', chapters: [{ id: 'module-tailwind-bab-1', name: 'BAB 1: Utility Classes', duration: '5 Levels' }] },
  { id: 'SQL', title: 'SQL & Database Design', desc: 'Relational database architecture.', icon: '💾', chapters: [{ id: 'module-sql-bab-1', name: 'BAB 1: Queries', duration: '5 Levels' }] },
  { id: 'Excel', title: 'Advanced Excel', desc: 'Data modeling and advanced formulas.', icon: '📊', chapters: [{ id: 'module-excel-bab-1', name: 'BAB 1: Functions', duration: '5 Levels' }] },
  { id: 'Data Analysis', title: 'Data Analysis with Python', desc: 'Pandas, NumPy, and DataViz.', icon: '📈', chapters: [{ id: 'module-data-bab-1', name: 'BAB 1: Pandas', duration: '5 Levels' }] },
  { id: 'Figma', title: 'UI/UX Design with Figma', desc: 'Wireframing, prototyping, and design systems.', icon: '🖌️', chapters: [{ id: 'module-figma-bab-1', name: 'BAB 1: UI Basics', duration: '5 Levels' }] },
  { id: 'User Research', title: 'User Research Methods', desc: 'Conducting effective user interviews.', icon: '👥', chapters: [{ id: 'module-research-bab-1', name: 'BAB 1: Interviews', duration: '5 Levels' }] },
  { id: 'Prototyping', title: 'Rapid Prototyping', desc: 'Validating ideas quickly with prototypes.', icon: '🚀', chapters: [{ id: 'module-proto-bab-1', name: 'BAB 1: Wireframing', duration: '5 Levels' }] },
  { id: 'Git', title: 'Git & Version Control', desc: 'Mastering workflows and collaboration.', icon: '🐙', chapters: [{ id: 'module-git-bab-1', name: 'BAB 1: Basics', duration: '5 Levels' }] },
];

export default function MahasiswaLearningProgress() {
  const router = useRouter();
  const { totalXP, level, dailyBountyClaimed, hasCompletedQuizToday, claimDailyBounty, completeQuiz, addXP } = useUserStore();
  const { fetchProfileData, analyzeSkillGap, earnedSBTs, matchedJobs } = useScholarStore();
  
  const searchParams = useSearchParams();
  const jobId = searchParams.get('jobId');

  const [missingSkills, setMissingSkills] = useState<string[]>([]);
  const [isClaimingBounty, setIsClaimingBounty] = useState(false);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  useEffect(() => {
    fetchProfileData().then(() => {
      // Calculate missing skills based on jobId if provided
      if (jobId) {
        const job = matchedJobs.find(j => j.id === jobId);
        if (job) {
          const missing = job.requiredSkills.filter(skill => !earnedSBTs.includes(skill));
          setMissingSkills(missing);
          return;
        }
      }
      
      // If no jobId or job not found, combine all missing skills across all matched jobs
      const allRequired = new Set<string>();
      matchedJobs.forEach(job => job.requiredSkills.forEach(s => allRequired.add(s)));
      const missing = Array.from(allRequired).filter(skill => !earnedSBTs.includes(skill));
      setMissingSkills(missing);
    });
  }, [fetchProfileData, jobId, matchedJobs, earnedSBTs]);

  // Filter modules to ONLY show those that match the user's missing skills
  const activeModules = MAHASISWA_MODULES.filter(mod => missingSkills.includes(mod.id));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '100%' }}>
      {/* ─── HEADER ─── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h1 style={{ fontFamily: '"Press Start 2P"', fontSize: '1.5rem', color: '#fff', textShadow: '2px 2px 0 #3b261b' }}>
          PROFESSIONAL TRAINING
        </h1>
        <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.7rem', color: '#d4d4d8', lineHeight: '1.6' }}>
          Berdasarkan analisis AI, berikut adalah skill gap Anda. Selesaikan modul pelatihan ini untuk memenuhi kualifikasi industri.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        
        {/* ─── LEFT COLUMN: SKILL GAP ACCORDION ─── */}
        <div style={{ flex: '1 1 60%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {activeModules.length === 0 ? (
            <div className={styles.retroCard} style={{ padding: '32px', textAlign: 'center', borderColor: '#047857' }}>
              <span style={{ display: 'block', marginBottom: '16px' }}>NO GAPS</span>
              <h3 style={{ fontFamily: '"Press Start 2P"', fontSize: '1rem', color: '#34d399', lineHeight: '1.6' }}>NO SKILL GAPS DETECTED!</h3>
              <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.6rem', color: '#d4d4d8', lineHeight: '1.8', marginTop: '16px' }}>
                You have met all the requirements for your target jobs or haven&apos;t selected any. Head to the Career Hub to explore more roles.
              </p>
            </div>
          ) : (
            activeModules.map((mod, idx) => {
              const isExpanded = expandedModule === mod.id;
              // Mock progress based on if it's earned
              const progress = earnedSBTs.includes(mod.id) ? 100 : 0;
              
              return (
                <motion.div
                  key={mod.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={styles.retroCard}
                  style={{
                    padding: '0',
                    borderColor: '#fbbf24',
                    borderWidth: '4px'
                  }}
                >
                  {/* Module Header (Accordion Toggle) */}
                  <button
                    onClick={() => setExpandedModule(isExpanded ? null : mod.id)}
                    style={{ 
                      width: '100%', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                      cursor: 'pointer', background: 'transparent', border: 'none', outline: 'none', textDecoration: 'none' 
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                      <div style={{ width: '56px', height: '56px', background: '#3b261b', border: '2px solid #5a3a29', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)' }}>
                        <PixelIcon icon={mod.icon} size={40} />
                      </div>
                      <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <h3 style={{ fontFamily: '"Press Start 2P"', fontSize: '1rem', color: '#fff', textShadow: '1px 1px 0 #3b261b', marginTop: '4px' }}>
                          SKILL PATH: {mod.id.toUpperCase()}
                        </h3>
                        <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.65rem', color: '#5a3a29', lineHeight: '1.6', marginTop: '4px' }}>
                          {mod.title} — {mod.desc}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge & Progress */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ background: '#b91c1c', border: '2px solid #7f1d1d', color: '#fff', fontSize: '0.45rem', fontFamily: '"Press Start 2P"', padding: '6px 12px', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)' }}>
                        TARGET SKILL
                      </div>
                      <div style={{ background: '#3b261b', border: '2px solid #5a3a29', padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', boxShadow: 'inset 2px 2px 0 rgba(0,0,0,0.5)' }}>
                        <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.6rem', color: '#fff' }}>
                          {progress}%
                        </span>
                        <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.3rem', color: '#fbbf24' }}>DONE</span>
                      </div>
                      <div style={{ fontSize: '1.5rem', color: '#fbbf24', transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                        ➔
                      </div>
                    </div>
                  </button>

                  {/* Accordion Content (Chapters) */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{ padding: '0 24px 24px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <div style={{ height: '2px', background: '#5a3a29', width: '100%', marginBottom: '8px' }} />
                          
                          {mod.chapters.map((chapter) => (
                            <div 
                              key={chapter.id}
                              className="flex items-center justify-between bg-[#c29a6e] border-2 border-[#5a3a29] p-4 group shadow-[2px_2px_0_rgba(0,0,0,0.2)]"
                            >
                              <div className="flex items-center gap-4">
                                <PixelIcon icon="📚" size={24} />
                                <div>
                                  <h4 style={{ fontFamily: '"Press Start 2P"', fontSize: '0.75rem', color: '#3b261b' }}>{chapter.name}</h4>
                                  <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.55rem', color: '#78350f', marginTop: '6px' }}>{chapter.duration}</p>
                                </div>
                              </div>
                              <button 
                                onClick={() => router.push(`/map?chapter=${chapter.id}&role=mahasiswa`)}
                                className="bg-[#10b981] hover:bg-[#059669] text-white px-4 py-2 border-2 border-[#064e3b] transition-colors shadow-[2px_2px_0_#064e3b]"
                                style={{ fontFamily: '"Press Start 2P"', fontSize: '0.6rem', cursor: 'pointer' }}
                              >
                                PLAY ▶
                              </button>
                            </div>
                          ))}
                          
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </div>

        {/* ─── RIGHT COLUMN: STATS & BOUNTY ─── */}
        <div style={{ flex: '1 1 30%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className={styles.retroCard} style={{ background: '#3b261b', borderColor: '#5a3a29' }}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle} style={{ color: '#fbbf24' }}><PixelIcon icon="🏆" size={18} /> SCHOLAR STATS</span>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px dashed #5a3a29', paddingBottom: '12px' }}>
                <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.7rem', color: '#a8a29e' }}>Level</span>
                <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.8rem', color: '#fbbf24' }}>{level}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px dashed #5a3a29', paddingBottom: '12px' }}>
                <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.7rem', color: '#a8a29e' }}>Total XP</span>
                <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.8rem', color: '#34d399' }}>{totalXP}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.7rem', color: '#a8a29e' }}>Missing Skills</span>
                <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.8rem', color: '#f87171' }}>{missingSkills.length}</span>
              </div>
            </div>
          </div>

          <div className={styles.retroCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}><PixelIcon icon="🏆" size={18} /> DAILY BOUNTY</span>
            </div>
            <div style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', textAlign: 'center' }}>
              <span style={{ fontSize: '3rem', filter: dailyBountyClaimed ? 'grayscale(100%)' : 'none' }}>📦</span>
              <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.7rem', color: '#5a3a29', lineHeight: '1.6' }}>
                {dailyBountyClaimed 
                  ? "You've claimed today's bounty! Come back tomorrow." 
                  : (hasCompletedQuizToday 
                      ? "Kuis selesai! Ambil hadiahmu sekarang!" 
                      : "Selesaikan 1 modul quiz hari ini untuk mendapatkan +150 XP!")}
              </p>
              
              <button 
                disabled={dailyBountyClaimed || isClaimingBounty}
                onClick={async () => {
                  if (!hasCompletedQuizToday) {
                    // Not completed yet, route to map
                    router.push('/map?role=mahasiswa');
                    return;
                  }
                  
                  // Already completed, claim the bounty
                  setIsClaimingBounty(true);
                  setTimeout(() => {
                    claimDailyBounty();
                    addXP(150);
                    setIsClaimingBounty(false);
                  }, 800);
                }}
                style={{ 
                  background: dailyBountyClaimed ? '#737373' : (hasCompletedQuizToday ? '#10b981' : '#f59e0b'),
                  color: dailyBountyClaimed ? '#a3a3a3' : (hasCompletedQuizToday ? '#fff' : '#3b261b'),
                  border: `4px solid ${dailyBountyClaimed ? '#404040' : (hasCompletedQuizToday ? '#059669' : '#b45309')}`,
                  borderRadius: '12px',
                  padding: '12px 16px',
                  fontFamily: '"Press Start 2P"',
                  fontSize: '0.6rem',
                  cursor: dailyBountyClaimed ? 'not-allowed' : 'pointer',
                  width: '100%',
                  boxShadow: dailyBountyClaimed ? 'none' : 'inset -2px -2px 0 rgba(0,0,0,0.5), 4px 4px 0 rgba(0,0,0,0.8)',
                  transform: isClaimingBounty ? 'scale(0.95)' : 'scale(1)',
                  transition: 'transform 0.1s',
                  animation: (hasCompletedQuizToday && !dailyBountyClaimed && !isClaimingBounty) ? 'pulseGlow 2s infinite' : 'none'
                }}
              >
                {!hasCompletedQuizToday 
                  ? 'KERJAKAN QUIZ ▶' 
                  : (isClaimingBounty ? 'CLAIMING...' : (dailyBountyClaimed ? 'CLAIMED' : 'CLAIM +150 XP'))}
              </button>
              
              {/* HIDDEN DEV BUTTON TO SIMULATE COMPLETING QUIZ */}
              {!hasCompletedQuizToday && (
                <button 
                  onClick={() => completeQuiz()} 
                  style={{ fontSize: '0.4rem', opacity: 0.1, position: 'absolute', top: 5, right: 5 }}
                  title="Dev: Simulate Quiz Completion"
                >
                  (Dev: Complete)
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
