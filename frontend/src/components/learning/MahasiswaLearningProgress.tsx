'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import styles from '@/components/ui/Dashboard.module.css';
import PixelIcon from '@/components/ui/PixelIcon';
import { useUserStore } from '@/store/useUserStore';
import { useScholarStore } from '@/store/useScholarStore';
import { useMapStore } from '@/store/useMapStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { getAuthHeaders } from '@/hooks/useAuthSync';
import { API_BASE_URL } from '@/config/pathtrick';
import { useTranslation } from '@/hooks/useTranslation';

// Removed hardcoded MAHASISWA_MODULES

export default function MahasiswaLearningProgress() {
  const router = useRouter();
  const { t } = useTranslation();
  const { totalXP, level, dailyBountyClaimed, hasCompletedQuizToday, claimDailyBounty, completeQuiz, addXP, setDailyBountyClaimed, setHasCompletedQuizToday } = useUserStore();
  const { fetchProfileData, analyzeSkillGap, earnedSBTs, matchedJobs } = useScholarStore();

  const completedDynamicNodes = useMapStore(state => state.completedDynamicNodes);

  const searchParams = useSearchParams();
  const jobId = searchParams.get('jobId');

  const [isClaimingBounty, setIsClaimingBounty] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [dailyQuest, setDailyQuest] = useState<{ id: string; isCompleted: boolean; isRewardClaimed: boolean; rewardXp: number } | null>(null);

  const [activeModules, setActiveModules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProfileData().then(async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/courses`, { headers: getAuthHeaders() });
        if (res.ok) {
          const data = await res.json();
          // Skill path Chaser = 1 BAB (6 level) -> klik langsung ke map BAB pertama.
          const mappedCourses = data.courses.map((c: any) => ({
            id: c.id,
            title: c.title,
            desc: c.description || c.reasonRecommended || 'Materi khusus yang direkomendasikan untuk Anda.',
            icon: '📚',
            skillTags: (c.skillTags?.length ? c.skillTags : c.skills?.map((s: any) => s.name)) || [],
            firstChapterId: c.chapters?.[0]?.id ?? null,
            sectionCount: c.sectionCount ?? 0,
            progressObj: c.progress
          }));
          setActiveModules(mappedCourses);
        }

        const questsRes = await fetch(`${API_BASE_URL}/api/quests`, { headers: getAuthHeaders() });
        if (questsRes.ok) {
          const questsData = await questsRes.json();
          const quest = Array.isArray(questsData.quests)
            ? questsData.quests.find((item: any) => item.type === 'DAILY_LOGIN')
            : null;
          if (quest) {
            const resolvedQuest = {
              id: quest.id,
              isCompleted: !!quest.isCompleted,
              isRewardClaimed: !!quest.isRewardClaimed,
              rewardXp: quest.rewardXp ?? 0,
            };
            setDailyQuest(resolvedQuest);
            setHasCompletedQuizToday(resolvedQuest.isCompleted);
            setDailyBountyClaimed(resolvedQuest.isRewardClaimed);
          }
        }
      } catch (e) {
        console.error('Failed to fetch courses:', e);
      } finally {
        setIsLoading(false);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchProfileData]);

  const norm = (s: string) => s.trim().toLowerCase();

  // Lowongan yang dipilih dari Career Hub ("Train Missing Skills").
  const targetJob = jobId ? matchedJobs.find(j => j.id === jobId) : undefined;

  const missingSkills = useMemo(() => {
    const owned = new Set(earnedSBTs.map(norm));
    const source = targetJob ? targetJob.requiredSkills : matchedJobs.flatMap(j => j.requiredSkills);
    return Array.from(new Set(source.filter(s => !owned.has(norm(s)))));
  }, [targetJob, matchedJobs, earnedSBTs]);

  // Skill path yang mengajarkan missing skill lowongan terpilih ditaruh paling atas.
  const { priorityModules, otherModules } = useMemo(() => {
    if (!targetJob) return { priorityModules: [] as any[], otherModules: activeModules };
    const missing = new Set(missingSkills.map(norm));
    const isPriority = (m: any) => m.skillTags.some((t: string) => missing.has(norm(t)));
    return {
      priorityModules: activeModules.filter(isPriority),
      otherModules: activeModules.filter(m => !isPriority(m)),
    };
  }, [targetJob, activeModules, missingSkills]);

  const orderedModules = [...priorityModules, ...otherModules];
  const priorityIds = new Set(priorityModules.map(m => m.id));

  const playHoverSound = () => {
    try {
      const audio = new Audio('/HoverTombol.ogg');
      audio.volume = 0.3;
      audio.play().catch(() => { });
    } catch (e) { }
  };

  const ITEMS_PER_PAGE = 4;
  const totalPages = Math.ceil(orderedModules.length / ITEMS_PER_PAGE);
  const pageStart = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentModules = orderedModules.slice(pageStart, pageStart + ITEMS_PER_PAGE);

  const sectionTitleStyle: React.CSSProperties = { fontFamily: '"Press Start 2P"', fontSize: '0.75rem', color: '#fbbf24', textShadow: '2px 2px 0 #3b261b', marginTop: '8px', lineHeight: '1.6' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '100%' }}>
      {/* ─── HEADER ─── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h1 style={{ fontFamily: '"Press Start 2P"', fontSize: '1.5rem', color: '#fff', textShadow: '2px 2px 0 #3b261b' }}>
          PROFESSIONAL TRAINING
        </h1>
        <p style={{ fontFamily: '"Pixelify Sans", sans-serif', fontSize: '1.2rem', color: '#d4d4d8', lineHeight: '1.6', maxWidth: '800px' }}>
          {t('common.aiSkillGapAnalysis')}
        </p>
        <button
          onClick={() => {
            import('@/store/useOnboardingStore').then(({ useOnboardingStore }) => {
              const store = useOnboardingStore.getState();
              store.setRole('chaser', store.savedPrivyUserId ?? undefined); // reset currentStep=0, totalSteps
              useOnboardingStore.setState({
                chaserAssessment: {
                  cvFile: null,
                  cvFileName: '',
                  cvExtractionStatus: 'idle',
                  cvExtractedData: null,
                  cvText: '',
                  portfolioFile: null,
                  portfolioFileName: '',
                  portfolioText: '',
                  workInterests: [],
                  preferredGICS: [],
                },
                onboardingCompleted: false,
              });
              router.push('/assessment');
            });
          }}
          style={{ alignSelf: 'flex-start', padding: '8px 16px', background: '#3b82f6', color: 'white', fontFamily: '"Press Start 2P"', fontSize: '0.8rem', borderRadius: '8px', cursor: 'pointer', border: '2px solid #2563eb' }}
        >
          ULANGI ASESMEN
        </button>
      </div>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>

        {/* ─── LEFT COLUMN: SKILL GAP ACCORDION ─── */}
        <div style={{ flex: '1 1 60%', display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {!isLoading && orderedModules.length === 0 && (
            <div style={{ fontFamily: '"Press Start 2P"', fontSize: '0.7rem', color: '#d4d4d8' }}>BELUM ADA SKILL PATH.</div>
          )}

          {currentModules.map((mod, idx) => {
            const absoluteIdx = pageStart + idx;
            const isPriority = priorityIds.has(mod.id);
            const isFirstPriority = targetJob && absoluteIdx === 0 && isPriority;
            const isFirstOther = targetJob && absoluteIdx === priorityModules.length;
            const canPlay = !!mod.firstChapterId;

            // Progress: 1 skill path = 1 BAB, jadi cukup pakai cursor section.
            let progress = 0;
            if (mod.progressObj?.status === 'COMPLETED') progress = 100;
            else if (mod.progressObj) {
              const done = (mod.progressObj.currentSectionOrder || 1) - 1;
              progress = Math.min(99, Math.floor((done / Math.max(1, mod.sectionCount)) * 100));
            }

            return (
              <React.Fragment key={mod.id}>
                {isFirstPriority && (
                  <h2 style={sectionTitleStyle}>🎯 MISSING SKILL: {targetJob!.title.toUpperCase()}</h2>
                )}
                {isFirstOther && (
                  <h2 style={{ ...sectionTitleStyle, color: '#d4d4d8', marginTop: priorityModules.length ? '24px' : '8px' }}>
                    {priorityModules.length === 0 ? 'TIDAK ADA SKILL PATH UNTUK MISSING SKILL INI — ' : ''}SKILL LAINNYA
                  </h2>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={styles.retroCard}
                  onMouseEnter={playHoverSound}
                  onClick={() => canPlay && router.push(`/map?chapter=${mod.firstChapterId}&role=chaser`)}
                  style={{
                    padding: 0,
                    position: 'relative',
                    borderColor: isPriority ? '#ef4444' : '#fbbf24',
                    borderWidth: '4px',
                    cursor: canPlay ? 'pointer' : 'not-allowed',
                    opacity: canPlay ? 1 : 0.6,
                  }}
                >
                  {isPriority && (
                    <div style={{ position: 'absolute', top: '-6px', left: '-12px', zIndex: 10 }}>
                      <div style={{ background: '#b91c1c', border: '2px solid #7f1d1d', color: '#fff', fontSize: '0.45rem', fontFamily: '"Press Start 2P"', padding: '6px 12px', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)', position: 'relative', zIndex: 2 }}>
                        MISSING SKILL
                      </div>
                      <div style={{ position: 'absolute', top: '100%', left: '0', width: 0, height: 0, borderTop: '12px solid #450a0a', borderLeft: '12px solid transparent', zIndex: 1 }} />
                    </div>
                  )}

                  {/* Header: ikon, judul, deskripsi, progress */}
                  <div style={{ width: '100%', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                      <div style={{ width: '56px', height: '56px', background: '#3b261b', border: '2px solid #5a3a29', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)', flexShrink: 0 }}>
                        <PixelIcon icon={mod.icon} size={40} />
                      </div>
                      <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <h3 style={{ fontFamily: '"Press Start 2P"', fontSize: '1rem', color: '#fff', textShadow: '1px 1px 0 #3b261b', marginTop: '4px', lineHeight: '1.5' }}>
                          {mod.title.toUpperCase()}
                        </h3>
                        <p style={{ fontFamily: '"Pixelify Sans", sans-serif', fontSize: '1rem', color: '#5a3a29', lineHeight: '1.6' }}>
                          {mod.desc}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ background: '#3b261b', border: '2px solid #5a3a29', padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', boxShadow: 'inset 2px 2px 0 rgba(0,0,0,0.5)' }}>
                        <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.6rem', color: '#fff' }}>{progress}%</span>
                        <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.3rem', color: '#fbbf24' }}>DONE</span>
                      </div>
                      <div style={{ fontSize: '1.5rem', color: '#fbbf24' }}>➔</div>
                    </div>
                  </div>

                  {/* Footer: skill tags & jumlah level */}
                  <div style={{ padding: '0 24px 24px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {mod.skillTags.map((tag: string) => {
                        const isMissingTag = isPriority && missingSkills.some(s => norm(s) === norm(tag));
                        return (
                          <span key={tag} style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.75rem', padding: '4px 8px', background: isMissingTag ? '#7f1d1d' : '#3b261b', color: isMissingTag ? '#fecaca' : '#fde68a', border: `2px solid ${isMissingTag ? '#b91c1c' : '#5a3a29'}` }}>
                            {tag}
                          </span>
                        );
                      })}
                    </div>
                    <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.5rem', color: '#78350f' }}>
                      {canPlay ? `${mod.sectionCount || 6} LEVEL` : 'SEGERA HADIR'}
                    </span>
                  </div>
                </motion.div>
              </React.Fragment>
            );
          })}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
              <button onMouseEnter={playHoverSound}
                disabled={currentPage === 1}
                onClick={() => { setCurrentPage(prev => Math.max(1, prev - 1)); }}
                style={{
                  fontFamily: '"Press Start 2P"', fontSize: '0.65rem', padding: '12px 16px',
                  background: currentPage === 1 ? '#8a6040' : '#fbbf24',
                  color: currentPage === 1 ? '#c4af9a' : '#3b261b',
                  border: `4px solid ${currentPage === 1 ? '#5a3a29' : '#b45309'}`,
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  boxShadow: currentPage === 1 ? 'none' : '4px 4px 0 rgba(0,0,0,0.5)',
                  opacity: currentPage === 1 ? 0.5 : 1
                }}
              >
                ◀ PREV
              </button>

              <div style={{ fontFamily: '"Press Start 2P"', fontSize: '0.7rem', color: '#fbbf24', textShadow: '2px 2px 0 #3b261b' }}>
                PAGE {currentPage}/{totalPages}
              </div>

              <button onMouseEnter={playHoverSound}
                disabled={currentPage === totalPages}
                onClick={() => { setCurrentPage(prev => Math.min(totalPages, prev + 1)); }}
                style={{
                  fontFamily: '"Press Start 2P"', fontSize: '0.65rem', padding: '12px 16px',
                  background: currentPage === totalPages ? '#8a6040' : '#fbbf24',
                  color: currentPage === totalPages ? '#c4af9a' : '#3b261b',
                  border: `4px solid ${currentPage === totalPages ? '#5a3a29' : '#b45309'}`,
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  boxShadow: currentPage === totalPages ? 'none' : '4px 4px 0 rgba(0,0,0,0.5)',
                  opacity: currentPage === totalPages ? 0.5 : 1
                }}
              >
                NEXT ▶
              </button>
            </div>
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
                  ? t('common.bountyClaimedMsg')
                  : (hasCompletedQuizToday
                    ? t('common.quizCompletedMsg')
                    : t('common.quizDailyQuest'))}
              </p>

              <button onMouseEnter={playHoverSound}
                disabled={!dailyQuest?.isCompleted || dailyBountyClaimed || isClaimingBounty}
                onClick={async () => {
                  if (!dailyQuest?.isCompleted || dailyBountyClaimed || isClaimingBounty) {
                    return;
                  }

                  if (!dailyBountyClaimed && !isClaimingBounty) {
                    setIsClaimingBounty(true);

                    try {
                      const res = await fetch(`${API_BASE_URL}/api/quests/${dailyQuest.id}/claim`, {
                        method: 'POST',
                        headers: getAuthHeaders(),
                      });

                      if (res.ok) {
                        setTimeout(() => {
                          claimDailyBounty();
                          addXP(dailyQuest.rewardXp || 150);
                          setIsClaimingBounty(false);
                        }, 800);
                      } else {
                        setIsClaimingBounty(false);
                      }
                    } catch (e) {
                      setIsClaimingBounty(false);
                    }
                  }
                }}
                style={{
                  background: dailyBountyClaimed ? '#737373' : (!dailyQuest?.isCompleted ? '#f59e0b' : '#10b981'),
                  color: dailyBountyClaimed ? '#a3a3a3' : (!dailyQuest?.isCompleted ? '#3b261b' : '#fff'),
                  border: `4px solid ${dailyBountyClaimed ? '#404040' : (!dailyQuest?.isCompleted ? '#b45309' : '#059669')}`,
                  borderRadius: '12px',
                  padding: '12px 16px',
                  fontFamily: '"Press Start 2P"',
                  fontSize: '0.6rem',
                  cursor: dailyBountyClaimed || isClaimingBounty || !dailyQuest?.isCompleted ? 'not-allowed' : 'pointer',
                  width: '100%',
                  boxShadow: dailyBountyClaimed ? 'none' : 'inset -2px -2px 0 rgba(0,0,0,0.5), 4px 4px 0 rgba(0,0,0,0.8)',
                  transform: isClaimingBounty ? 'scale(0.95)' : 'scale(1)',
                  transition: 'transform 0.1s',
                  animation: (dailyQuest?.isCompleted && !dailyBountyClaimed && !isClaimingBounty) ? 'pulseGlow 2s infinite' : 'none'
                }}
              >
                {isClaimingBounty
                  ? t('common.claimingBtn')
                  : (dailyBountyClaimed
                    ? t('common.claimedBtn')
                    : (!dailyQuest?.isCompleted ? 'LOGIN DAILY' : t('common.claimXpBtn')))}
              </button>

              {/* HIDDEN DEV BUTTON TO SIMULATE COMPLETING QUIZ */}
              {!hasCompletedQuizToday && (
                <button onMouseEnter={playHoverSound}
                  onClick={() => {
                    completeQuiz();
                    setHasCompletedQuizToday(true);
                  }}
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
