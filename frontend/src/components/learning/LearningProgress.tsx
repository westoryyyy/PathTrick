'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { House, Stage } from '@/types/backend';
import styles from '@/components/ui/Dashboard.module.css';
import PixelIcon from '@/components/ui/PixelIcon';
import { useUserStore } from '@/store/useUserStore';
import { useMapStore } from '@/store/useMapStore';
import { useRouter } from 'next/navigation';
import { getAuthHeaders } from '@/hooks/useAuthSync';
import { API_BASE_URL } from '@/config/pathtrick';
import { PixelSkeletonRows } from '@/components/ui/PixelSkeleton';
import { useTranslation } from '@/hooks/useTranslation';
import StartAssessmentButton from '@/components/ui/StartAssessmentButton';

const stageIconMap: Record<string, string> = {
  material: '📚',
  quiz: '✍️',
  lab: '💻',
  project: '🚀',
};

const stageColorMap: Record<string, string> = {
  material: 'from-blue-500 to-indigo-600',
  quiz: 'from-amber-500 to-orange-600',
  lab: 'from-purple-500 to-pink-600',
  project: 'from-emerald-500 to-teal-600',
};

export default function LearningProgress() {
  const router = useRouter();
  const { locale } = useTranslation();
  const { totalXP, level, dailyBountyClaimed, claimDailyBounty, addXP, setDailyBountyClaimed } = useUserStore();
  const [isClaimingBounty, setIsClaimingBounty] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [houses, setHouses] = useState<House[]>([]);
  const [loadingMap, setLoadingMap] = useState(true);
  const [loadingVault, setLoadingVault] = useState(true);
  const [vaultSBTs, setVaultSBTs] = useState<any[]>([]);
  const [dailyQuest, setDailyQuest] = useState<{ id: string; isCompleted: boolean; isRewardClaimed: boolean; rewardXp: number } | null>(null);
  const fetchRoadmap = useMapStore(state => state.fetchRoadmap);

  React.useEffect(() => {
    async function loadData() {
      try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_BASE_URL}/api/users/me`, { headers });
        if (!res.ok) throw new Error('Failed to fetch profile');
        const data = await res.json();

        const mappedHouses: Record<string, House> = {};

        if (data.roadmaps && data.roadmaps.length > 0) {
          const activeRoadmap = data.roadmaps[0];
          activeRoadmap.courses?.forEach((rc: any) => {
            const course = rc.course;
            if (!course?.house) return;

            if (!mappedHouses[course.house.id]) {
              mappedHouses[course.house.id] = {
                id: course.house.id,
                title: course.house.title,
                description: course.house.description,
                icon: course.house.icon,
                status: 'active',
                houseNumber: course.house.houseNumber,
                gradient: course.house.gradient,
                stages: [],
              };
            }

            const progress = data.courseProgress?.find((p: any) => p.courseId === course.id);

            mappedHouses[course.house.id].stages.push({
              id: course.id,
              name: course.title,
              description: course.description,
              isCompleted: progress?.status === 'COMPLETED',
              contentType: 'material',
              chapters: course.chapters?.map((ch: any) => ({
                id: ch.id,
                name: ch.title,
                duration: ch.sections?.length?.toString() || '1'
              })) || [],
            });
          });
        }

        const housesRes = await fetch(`${API_BASE_URL}/api/houses`, { headers });
        if (housesRes.ok) {
          const housesData = await housesRes.json();
          const levelLocked = level < 5;

          housesData.houses.forEach((apiHouse: any) => {
            const courseCount = apiHouse._count?.courses ?? 0;
            if (mappedHouses[apiHouse.id]) {
              mappedHouses[apiHouse.id].status = apiHouse.isActive ? 'active' : (levelLocked ? 'lockedByLevel' : 'locked');
              mappedHouses[apiHouse.id].isActive = apiHouse.isActive;
              mappedHouses[apiHouse.id].courseCount = courseCount;
              mappedHouses[apiHouse.id].skillsOverview = apiHouse.skillsOverview;
              mappedHouses[apiHouse.id].idealFor = apiHouse.idealFor;
              (mappedHouses[apiHouse.id] as any).matchScore = apiHouse.matchScore ?? 0;
            } else {
              mappedHouses[apiHouse.id] = {
                id: apiHouse.id,
                title: apiHouse.title,
                description: apiHouse.description,
                icon: apiHouse.icon,
                status: apiHouse.isActive ? 'active' : (levelLocked ? 'lockedByLevel' : 'locked'),
                isActive: apiHouse.isActive,
                houseNumber: apiHouse.houseNumber,
                gradient: apiHouse.gradient || 'from-slate-500 to-slate-700',
                stages: [],
                courseCount,
                skillsOverview: apiHouse.skillsOverview,
                idealFor: apiHouse.idealFor,
                matchScore: apiHouse.matchScore ?? 0,
              };
            }
          });
        }

        try {
          const questsRes = await fetch(`${API_BASE_URL}/api/quests`, { headers });
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
              setDailyBountyClaimed(resolvedQuest.isRewardClaimed);
            }
          }
        } catch (questError) {
          console.error('Failed to load quests:', questError);
        }

        const sortedHouses = Object.values(mappedHouses).sort((a: any, b: any) => {
          const scoreDelta = (b.matchScore ?? 0) - (a.matchScore ?? 0);
          if (scoreDelta !== 0) return scoreDelta;

          const statusOrder = (h: any) => {
            if (h.status === 'active' || h.status === 'completed') return 0;
            if (h.status === 'lockedByLevel') return 1;
            if (h.status === 'locked') return 2;
            return 3;
          };

          const statusDelta = statusOrder(a) - statusOrder(b);
          if (statusDelta !== 0) return statusDelta;

          return a.houseNumber - b.houseNumber;
        });
        setHouses(sortedHouses);
        // mark map loading finished
        setLoadingMap(false);

        // Fetch vault SBTs
        try {
          const vaultRes = await fetch(`${API_BASE_URL}/api/badges`, { headers });
          if (vaultRes.ok) {
            const vaultData = await vaultRes.json();
            setVaultSBTs(vaultData.badges || []);
          } else {
            setVaultSBTs([]);
          }
        } catch (e) {
          console.error('Failed to load vault badges:', e);
          setVaultSBTs([]);
        } finally {
          setLoadingVault(false);
        }
      } catch (err) {
        console.error('Failed to load roadmap:', err);
        // ensure loading flags are cleared so UI doesn't hang
        setLoadingMap(false);
        setLoadingVault(false);
      }
      
      try {
        await fetchRoadmap();
      } catch(e) {
        console.error('Failed to load roadmap for progress calculation:', e);
      }
    }
    loadData();
  }, []);

  const playHoverSound = () => {
    try {
      const audio = new Audio('/HoverTombol.ogg');
      audio.volume = 0.3;
      audio.play().catch(() => {});
    } catch(e) {}
  };

  const completedDynamicNodes = useMapStore(state => state.completedDynamicNodes);

  const getProgressPercentage = (stages: Stage[]): number => {
    if (stages.length === 0) return 0;
    const completedCount = stages.filter(s => s.isCompleted).length;
    return Math.floor((completedCount / stages.length) * 100);
  };

  const getStatusBadge = (status: string): React.ReactNode => {
    switch (status) {
      case 'completed':
        return (
          <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.45rem', padding: '6px 12px', background: '#047857', border: '2px solid #064e3b', color: '#fff', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)' }}>
            ✓ COMPLETED
          </span>
        );
      case 'active':
        return null;
      case 'locked':
        return (
          <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.45rem', padding: '6px 12px', background: '#78350f', border: '2px solid #451a03', color: '#fcd34d', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PixelIcon icon="🔒" size={18} /> LOCKED
          </span>
        );
      case 'lockedByLevel':
        return (
          <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.45rem', padding: '6px 12px', background: '#3f3f46', border: '2px solid #27272a', color: '#a1a1aa', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PixelIcon icon="🔒" size={18} /> LOCKED
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '100%' }}>
      {/* ─── HEADER ─── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h1 style={{ fontFamily: '"Press Start 2P"', fontSize: '1.5rem', color: '#fff', textShadow: '2px 2px 0 #3b261b' }}>
          {locale === 'id' ? 'PROGRES BELAJAR' : 'LEARNING PROGRESS'}
        </h1>
        <p style={{ fontFamily: '"Pixelify Sans", sans-serif', fontSize: '1.2rem', color: '#d4d4d8', lineHeight: '1.6', maxWidth: '800px' }}>
          {locale === 'id' ? 'Jelajahi 10 House dan kuasai ilmu baru. Klik House untuk mulai petualanganmu!' : 'Explore 10 Houses and master new skills. Click a House to begin your adventure!'}
        </p>
        {!loadingMap && houses.every(h => !h.matchScore) && (
          <StartAssessmentButton role="dreamer" />
        )}
      </div>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>

        {/* ─── LEFT COLUMN: HOUSES ACCORDION ─── */}
        <div style={{ flex: '1 1 60%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {(() => {
            const ITEMS_PER_PAGE = 4;
            const totalPages = Math.ceil(houses.length / ITEMS_PER_PAGE);
            const currentHouses = houses.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

            if (loadingMap) {
              return <PixelSkeletonRows count={4} />;
            }
            
            if (houses.length === 0) {
              return <div style={{ color: 'white', fontFamily: '"Press Start 2P"' }}>NO HOUSES AVAILABLE.</div>;
            }

            return (
              <>
                {currentHouses.map((house: House, idx: number) => {
                  const isCompleted = house.status === 'completed';
                  const isLocked = house.status === 'locked' || house.status === 'lockedByLevel';
                  const isLockedByLevel = house.status === 'lockedByLevel';
                  const progress = getProgressPercentage(house.stages);

                  return (
                    <motion.div
                      key={house.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="relative group w-full"
                    >
                      <div
                        className={styles.retroCard}
                        onMouseEnter={playHoverSound}
                        onClick={() => { 
                          if (!isLockedByLevel) {
                            router.push(`/house/${house.id}`);
                          } 
                        }}
                        style={{
                          padding: '0',
                          opacity: isLockedByLevel ? 0.5 : (isLocked ? 0.7 : 1),
                          filter: isLockedByLevel ? 'grayscale(100%) contrast(0.8)' : (isLocked ? 'grayscale(100%)' : 'none'),
                          position: 'relative',
                          overflow: 'hidden',
                          cursor: isLockedByLevel ? 'not-allowed' : 'pointer'
                        }}
                      >
                      {isLockedByLevel && (
                        <div style={{
                          position: 'absolute',
                          top: 0, left: 0, right: 0, bottom: 0,
                          background: 'repeating-linear-gradient(45deg, rgba(0,0,0,0.6), rgba(0,0,0,0.6) 10px, rgba(0,0,0,0.7) 10px, rgba(0,0,0,0.7) 20px)',
                          zIndex: 10,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '12px',
                          pointerEvents: 'none'
                        }}>
                          <PixelIcon icon="🔒" size={42} />
                          <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.8rem', color: '#fca5a5', background: '#7f1d1d', padding: '8px 16px', border: '2px solid #b91c1c' }}>
                            REACH LVL 5 TO UNLOCK
                          </span>
                        </div>
                      )}
                      {/* Remove EXP PENALTY ribbon */}

                      {/* House Header */}
                      <div
                        style={{ width: '100%', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'transparent' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                          <div style={{ width: '56px', height: '56px', background: '#3b261b', border: '2px solid #5a3a29', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)' }}>
                            <PixelIcon icon={house.icon} size={40} />
                          </div>
                          <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <h3 style={{ fontFamily: '"Press Start 2P"', fontSize: '1rem', color: '#fff', textShadow: '1px 1px 0 #3b261b', marginTop: '4px' }}>
                              {house.title}
                            </h3>
                            <p style={{ fontFamily: '"Pixelify Sans", sans-serif', fontSize: '1rem', color: '#5a3a29', lineHeight: '1.6' }}>
                              {house.description}
                            </p>
                          </div>
                        </div>

                        {/* Status Badge & Progress */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          {!isLockedByLevel ? (
                            <div style={{ background: '#3b261b', border: '2px solid #5a3a29', padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', boxShadow: 'inset 2px 2px 0 rgba(0,0,0,0.5)' }}>
                              <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.6rem', color: '#fff' }}>
                                {progress}%
                              </span>
                              <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.3rem', color: '#fbbf24' }}>DONE</span>
                            </div>
                          ) : (
                            <div style={{ background: '#27272a', border: '2px solid #3f3f46', padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', boxShadow: 'inset 2px 2px 0 rgba(0,0,0,0.5)' }}>
                              <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.8rem', color: '#a1a1aa' }}>
                                <PixelIcon icon="🔒" size={22} />
                              </span>
                            </div>
                          )}

                          {!isLockedByLevel && (
                            <div style={{ fontSize: '1.5rem', color: '#fbbf24' }}>
                              ➔
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Info (Preview Modul & Minat Bakat) */}
                      <div style={{ padding: '0 24px 24px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

                        {isLocked && !isLockedByLevel && (
                          <div style={{ background: 'rgba(185, 28, 28, 0.1)', padding: '12px', borderLeft: '3px solid #b91c1c', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <PixelIcon icon="⚠️" size={20} />
                            <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.55rem', color: '#fca5a5', lineHeight: '1.6' }}>
                              AI tidak menyarankan path ini. Modul tetap bisa diakses, tetapi hadiah XP berkurang 50%.
                            </span>
                          </div>
                        )}

                        {/* Status & Modules count */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          {getStatusBadge(isLockedByLevel ? 'lockedByLevel' : house.status)}
                          <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.5rem', color: '#78350f' }}>{house.courseCount ?? house.stages.length} MODUL DI DALAM</span>
                        </div>
                      </div>
                      
                      {/* Interactive hover scale effect wrapper around the card was added by the group class, but let's add the tooltip here */}
                      </div > 

                      {/* Tooltip Content */}
                      {(house.skillsOverview || house.idealFor) && (
                        <div className="absolute left-[calc(100%+16px)] top-1/2 -translate-y-1/2 w-[300px] z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden md:block">
                           <div className="bg-[#c29a6e] border-4 border-[#5a3a29] rounded-[16px] p-5 shadow-[4px_4px_0_rgba(0,0,0,0.3)] flex flex-col gap-5 relative">
                             {/* Arrow pointing left */}
                             <div className="absolute top-1/2 -translate-y-1/2 -left-4 w-0 h-0 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-r-[12px] border-r-[#5a3a29]"></div>
                             <div className="absolute top-1/2 -translate-y-1/2 -left-[6px] w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[8px] border-r-[#c29a6e]"></div>

                             {house.skillsOverview && (
                               <div className="flex flex-col gap-3">
                                 <h4 className="flex items-center gap-2" style={{ fontFamily: '"Press Start 2P"', fontSize: '0.65rem', color: '#5a3a29' }}><PixelIcon icon="⚔️" size={16} /> <span>SKILL YANG DIASAH</span></h4>
                                 <div className="flex flex-col gap-1">
                                   {house.skillsOverview.map(skill => (
                                     <div key={skill} className="flex items-start gap-2">
                                       <span className="text-[#5a3a29] text-[8px] mt-1">●</span>
                                       <span style={{ fontFamily: '"Pixelify Sans", sans-serif', fontSize: '1rem', color: '#1a100c', lineHeight: '1.4' }}>{skill}</span>
                                     </div>
                                   ))}
                                 </div>
                               </div>
                             )}
                             {house.idealFor && (
                               <div className="flex flex-col gap-3">
                                 <h4 className="flex items-center gap-2" style={{ fontFamily: '"Press Start 2P"', fontSize: '0.65rem', color: '#5a3a29' }}><PixelIcon icon="💡" size={16} /> <span>COCOK UNTUK</span></h4>
                                 <div className="flex flex-col gap-1">
                                   {house.idealFor.map(ideal => (
                                     <div key={ideal} className="flex items-start gap-2">
                                       <span className="text-[#5a3a29] text-[8px] mt-1">●</span>
                                       <span style={{ fontFamily: '"Pixelify Sans", sans-serif', fontSize: '1rem', color: '#1a100c', lineHeight: '1.4' }}>{ideal}</span>
                                     </div>
                                   ))}
                                 </div>
                               </div>
                             )}
                           </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      onMouseEnter={playHoverSound}
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
                      ◀ {locale === 'id' ? 'KEMBALI' : 'PREV'}
                    </button>

                    <div style={{ fontFamily: '"Press Start 2P"', fontSize: '0.7rem', color: '#fbbf24', textShadow: '2px 2px 0 #3b261b' }}>
                      {locale === 'id' ? 'HAL' : 'PAGE'} {currentPage}/{totalPages}
                    </div>

                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      onMouseEnter={playHoverSound}
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
                      {locale === 'id' ? 'LANJUT' : 'NEXT'} ▶
                    </button>
                  </div>
                )}
              </>
            )
          })()}
        </div>

        {/* ─── RIGHT COLUMN: THE VAULT & DAILY BOUNTY ─── */}
        <div style={{ flex: '1 1 35%', display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* The Vault */}
          <div className={styles.retroCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>{locale === 'id' ? 'BRANKAS (THE VAULT)' : 'THE VAULT'}</span>
              <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.55rem', color: '#fbbf24', cursor: 'pointer' }}
                onClick={() => router.push('/dreamer/certificate')}>{locale === 'id' ? 'LIHAT SEMUA' : 'VIEW ALL'}</span>
            </div>

            {loadingVault ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Skeleton Loader */}
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={{
                    height: '24px',
                    background: '#2a1f1a',
                    border: '2px solid #5a3a29',
                    borderRadius: '4px',
                    marginBottom: '12px'
                  }}
                />
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                    style={{
                      background: 'rgba(0,0,0,0.2)',
                      border: '2px solid #5a3a29',
                      padding: '12px',
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'center'
                    }}
                  >
                    <div style={{ width: '48px', height: '48px', background: '#3b261b', border: '2px solid #5a3a29', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)' }} />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ height: '14px', background: '#3b261b', borderRadius: '2px', width: '80%' }} />
                      <div style={{ height: '10px', background: '#3b261b', borderRadius: '2px', width: '60%' }} />
                    </div>
                  </motion.div>
                ))}
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                  style={{
                    background: '#3b261b',
                    border: '2px solid #5a3a29',
                    padding: '16px',
                    marginTop: '12px',
                    height: '120px',
                    boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.5)'
                  }}
                />
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                  {vaultSBTs.slice(0, 3).map((sbt: any, i: number) => (
                    <div key={sbt.id || i} style={{ background: 'rgba(0,0,0,0.2)', border: '2px solid #5a3a29', padding: '12px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div style={{ width: '48px', height: '48px', background: '#3b261b', border: '2px solid #5a3a29', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)' }}>
                        <PixelIcon icon={sbt.course?.coverImageUrl ? '🏅' : '🏅'} size={24} />
                      </div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.7rem', color: '#fff', lineHeight: '1.4' }}>{sbt.course?.title || 'Badge'}</span>
                        <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.5rem', color: '#fbbf24', lineHeight: '1.4', marginTop: '4px' }}>Completed {sbt.course?.title?.split('–')?.[0] || ''}</span>
                      </div>
                    </div>
                  ))}
                  {vaultSBTs.length === 0 && (
                    <div style={{ padding: '16px', textAlign: 'center', fontFamily: '"Press Start 2P"', fontSize: '0.5rem', color: '#d4d4d8', lineHeight: '1.6' }}>
                      {locale === 'id' ? 'Belum ada token. Selesaikan kursus untuk mendapatkan SBT!' : 'No tokens yet. Complete a course to earn an SBT!'}
                    </div>
                  )}
                </div>

                {/* Active SBT Progress */}
                <div style={{ background: '#3b261b', border: '2px solid #5a3a29', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.5)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ fontSize: '2rem' }}>🚀</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.8rem', color: '#fff', lineHeight: '1.4' }}>Keep Going!</span>
                      <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.5rem', color: '#34d399' }}>{Math.max(5 - vaultSBTs.length, 0)} {locale === 'id' ? 'LAGI' : 'NEXT'}</span>
                    </div>
                  </div>
                  <div className={styles.readinessContainer}>
                    <div className={styles.readinessBarBg} style={{ height: '16px' }}>
                      <div className={styles.readinessBarFillBlue} style={{ width: `${Math.min((vaultSBTs.length / 5) * 100, 100)}%` }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: '"Press Start 2P"', fontSize: '0.35rem', color: '#fff' }}>
                      <span>PROGRESS</span>
                      <span style={{ color: '#60a5fa' }}>{Math.min((vaultSBTs.length / 5) * 100, 100)}%</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Daily Bounty */}
          <div className={styles.retroCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}><PixelIcon icon="⚔️" size={18} /> {locale === 'id' ? 'BOUNTY HARIAN' : 'DAILY BOUNTY'}</span>
            </div>

            <div style={{ background: '#d4a373', border: '4px solid #5a3a29', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: 'inset 2px 2px 0 rgba(255,255,255,0.2), inset -4px -4px 8px rgba(0,0,0,0.3)' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '48px', height: '48px', background: '#fff', border: '2px solid #5a3a29', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)' }}>
                  🏅
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <h4 style={{ fontFamily: '"Press Start 2P"', fontSize: '0.9rem', color: '#3b261b', lineHeight: '1.6', margin: 0 }}>
                    Daily Skill Builder
                  </h4>
                  <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.6rem', color: '#047857', background: '#fff', padding: '6px 12px', border: '1px solid #064e3b' }}>
                    150 XP
                  </span>
                </div>
              </div>

              <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.7rem', color: '#5a3a29', lineHeight: '1.8' }}>
                {locale === 'id' ? 'Selesaikan 1 modul quiz untuk mendapatkan +150 XP' : 'Complete 1 quiz module to earn +150 XP'}
              </p>

              <button
                disabled={dailyBountyClaimed || isClaimingBounty}
                onClick={async () => {
                  if (dailyBountyClaimed || isClaimingBounty) {
                    return;
                  }

                  setIsClaimingBounty(true);
                  try {
                    if (dailyQuest) {
                      const { getAuthHeaders: getHeaders } = await import('@/hooks/useAuthSync');
                      await fetch(`${API_BASE_URL}/api/quests/${dailyQuest.id}/claim`, {
                        method: 'POST',
                        headers: getHeaders(),
                      });
                    }
                    setTimeout(() => {
                      addXP(dailyQuest?.rewardXp || 150);
                      claimDailyBounty();
                      setDailyBountyClaimed(true);
                      setIsClaimingBounty(false);
                    }, 1200);
                  } catch (e) {
                    setTimeout(() => {
                      addXP(dailyQuest?.rewardXp || 150);
                      claimDailyBounty();
                      setDailyBountyClaimed(true);
                      setIsClaimingBounty(false);
                    }, 1200);
                  }
                }}
                onMouseEnter={playHoverSound}
                style={{
                  width: '100%',
                  padding: '24px',
                  fontFamily: '"Press Start 2P"',
                  fontSize: '0.8rem',
                  color: dailyBountyClaimed ? '#a3a3a3' : '#fff',
                  background: dailyBountyClaimed ? '#525252' : '#047857',
                  border: `2px solid ${dailyBountyClaimed ? '#404040' : '#064e3b'}`,
                  boxShadow: dailyBountyClaimed ? 'none' : '4px 4px 0 rgba(0,0,0,0.5)',
                  cursor: dailyBountyClaimed || isClaimingBounty ? 'not-allowed' : 'pointer',
                  transform: dailyBountyClaimed ? 'none' : 'active:translate(2px, 2px)',
                  marginTop: '8px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {isClaimingBounty ? (
                  <motion.span
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                  >
                    {locale === 'id' ? 'MENGKLAIM...' : 'CLAIMING...'}
                  </motion.span>
                ) : dailyBountyClaimed ? (
                  locale === 'id' ? 'KLAIM BESOK' : 'CLAIM TOMORROW'
                ) : (
                  locale === 'id' ? 'KLAIM XP HARIAN' : 'CLAIM DAILY XP'
                )}
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' }}>
              <div style={{ background: '#3b261b', border: '2px solid #5a3a29', padding: '16px', textAlign: 'center', boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.5)', position: 'relative' }}>
                <AnimatePresence>
                  {isClaimingBounty && (
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: -20, opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1 }}
                      style={{ position: 'absolute', top: 0, left: 0, right: 0, color: '#34d399', fontFamily: '"Press Start 2P"', fontSize: '0.6rem' }}
                    >
                      +150 XP!
                    </motion.div>
                  )}
                </AnimatePresence>
                <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.8rem', color: '#60a5fa' }}>{totalXP}</p>
                <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.55rem', color: '#d4d4d8', marginTop: '8px' }}>TOTAL XP</p>
              </div>
              <div style={{ background: '#3b261b', border: '2px solid #5a3a29', padding: '16px', textAlign: 'center', boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.5)' }}>
                <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.8rem', color: '#fbbf24' }}>LV {level}</p>
                <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.55rem', color: '#d4d4d8', marginTop: '8px' }}>LEVEL</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
