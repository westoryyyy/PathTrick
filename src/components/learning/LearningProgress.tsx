'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockBackendData } from '@/data/mockBackendData';
import { House, Stage } from '@/types/backend';
import styles from '@/components/ui/Dashboard.module.css';
import { useUserStore } from '@/store/useUserStore';
import { useRouter } from 'next/navigation';

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
  const { houses, user } = mockBackendData;
  const { totalXP, level, dailyBountyClaimed, claimDailyBounty, addXP } = useUserStore();
  const [isClaimingBounty, setIsClaimingBounty] = useState(false);

  const getProgressPercentage = (stages: Stage[]): number => {
    const completed = stages.filter(s => s.isCompleted).length;
    return Math.round((completed / stages.length) * 100);
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
        return (
          <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.45rem', padding: '6px 12px', background: '#2563eb', border: '2px solid #1e40af', color: '#fff', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)' }}>
            ➔ ACTIVE
          </span>
        );
      case 'locked':
        return (
          <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.45rem', padding: '6px 12px', background: '#78350f', border: '2px solid #451a03', color: '#fcd34d', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>⚔️</span> SIDE QUEST
          </span>
        );
      case 'lockedByLevel':
        return (
          <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.45rem', padding: '6px 12px', background: '#3f3f46', border: '2px solid #27272a', color: '#a1a1aa', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🔒</span> LOCKED
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
          LEARNING PROGRESS
        </h1>
        <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.7rem', color: '#d4d4d8', lineHeight: '1.6' }}>
          Jelajahi 10 House dan kuasai ilmu baru. Klik House untuk mulai petualanganmu!
        </p>
      </div>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        
        {/* ─── LEFT COLUMN: HOUSES ACCORDION ─── */}
        <div style={{ flex: '1 1 60%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {houses.map((house: House, idx: number) => {
            const isCompleted = house.status === 'completed';
            const isLocked = house.status === 'locked';
            const isLockedByLevel = isLocked && level < 5;
            const progress = getProgressPercentage(house.stages);

            return (
              <motion.div
                key={house.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={styles.retroCard}
                onClick={() => { if (!isLockedByLevel) router.push(`/house/${house.id}`); }}
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
                    <span style={{ fontSize: '3rem' }}>🔒</span>
                    <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.8rem', color: '#fca5a5', background: '#7f1d1d', padding: '8px 16px', border: '2px solid #b91c1c' }}>
                      REACH LVL 5 TO UNLOCK
                    </span>
                  </div>
                )}
                {isLocked && !isLockedByLevel && (
                  <div style={{
                    position: 'absolute',
                    top: 12, right: -40,
                    transform: 'rotate(45deg)',
                    background: '#b91c1c',
                    padding: '8px 48px',
                    border: '2px solid #7f1d1d',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                    zIndex: 10,
                    pointerEvents: 'none'
                  }}>
                    <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.5rem', color: '#fca5a5' }}>
                      EXP PENALTY
                    </span>
                  </div>
                )}
                {/* House Header */}
                <div
                  style={{ width: '100%', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'transparent' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                    <div style={{ width: '56px', height: '56px', background: '#3b261b', border: '2px solid #5a3a29', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)' }}>
                      {house.icon}
                    </div>
                    <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <h3 style={{ fontFamily: '"Press Start 2P"', fontSize: '1rem', color: '#fff', textShadow: '1px 1px 0 #3b261b', marginTop: '4px' }}>
                        {house.title}
                      </h3>
                      <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.65rem', color: '#5a3a29', lineHeight: '1.6', marginTop: '4px' }}>
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
                          🔒
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
                  
                  {isLockedByLevel ? (
                    <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '12px', borderLeft: '3px solid #525252', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1rem' }}>🔒</span>
                      <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.55rem', color: '#a3a3a3', lineHeight: '1.6' }}>
                        Selesaikan Main Quest dan kumpulkan XP hingga Level 5 untuk membuka area ini.
                      </span>
                    </div>
                  ) : (
                    isLocked && (
                      <div style={{ background: 'rgba(185, 28, 28, 0.1)', padding: '12px', borderLeft: '3px solid #b91c1c', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1rem' }}>⚠️</span>
                        <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.55rem', color: '#fca5a5', lineHeight: '1.6' }}>
                          AI tidak menyarankan path ini. Modul tetap bisa diakses, tetapi hadiah XP berkurang 50%.
                        </span>
                      </div>
                    )
                  )}

                  {/* Status & Modules count */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {getStatusBadge(isLockedByLevel ? 'lockedByLevel' : house.status)}
                    <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.5rem', color: '#78350f' }}>{house.stages.length} MODUL DI DALAM</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ─── RIGHT COLUMN: THE VAULT & DAILY BOUNTY ─── */}
        <div style={{ flex: '1 1 35%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* The Vault */}
          <div className={styles.retroCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>🏛️ THE VAULT</span>
              <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.55rem', color: '#fbbf24', cursor: 'pointer' }}>VIEW ALL</span>
            </div>
            
            <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.6rem', color: '#d4d4d8', marginBottom: '16px', lineHeight: '1.6' }}>
              Claimed Soulbound Tokens
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {user.claimedSBTs.map((sbt) => (
                <div key={sbt.id} style={{ background: 'rgba(0,0,0,0.2)', border: '2px solid #5a3a29', padding: '12px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '48px', height: '48px', background: '#3b261b', border: '2px solid #5a3a29', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)' }}>
                    {sbt.icon}
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.7rem', color: '#fff', lineHeight: '1.4' }}>{sbt.name}</span>
                    <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.5rem', color: '#fbbf24', lineHeight: '1.4', marginTop: '4px' }}>{sbt.description}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Active SBT Progress */}
            <div style={{ background: '#3b261b', border: '2px solid #5a3a29', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.5)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ fontSize: '2rem' }}>{user.activeSBT.icon}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.8rem', color: '#fff', lineHeight: '1.4' }}>{user.activeSBT.name}</span>
                  <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.5rem', color: '#34d399' }}>{user.activeSBT.nextMilestone} NEXT</span>
                </div>
              </div>
              <div className={styles.readinessContainer}>
                <div className={styles.readinessBarBg} style={{ height: '16px' }}>
                  <div className={styles.readinessBarFillBlue} style={{ width: `${user.activeSBT.progress}%` }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: '"Press Start 2P"', fontSize: '0.35rem', color: '#fff' }}>
                  <span>PROGRESS</span>
                  <span style={{ color: '#60a5fa' }}>{user.activeSBT.progress}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Daily Bounty */}
          <div className={styles.retroCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>⚔️ DAILY BOUNTY</span>
            </div>

            <div style={{ background: '#d4a373', border: '4px solid #5a3a29', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: 'inset 2px 2px 0 rgba(255,255,255,0.2), inset -4px -4px 8px rgba(0,0,0,0.3)' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '48px', height: '48px', background: '#fff', border: '2px solid #5a3a29', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)' }}>
                  {user.dailyBounty.icon}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <h4 style={{ fontFamily: '"Press Start 2P"', fontSize: '0.9rem', color: '#3b261b', lineHeight: '1.6' }}>
                    {user.dailyBounty.title}
                  </h4>
                  <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.6rem', color: '#047857', background: '#fff', padding: '6px 12px', border: '1px solid #064e3b', width: 'fit-content' }}>
                    {user.dailyBounty.xpReward} XP
                  </span>
                </div>
              </div>

              <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.7rem', color: '#5a3a29', lineHeight: '1.8' }}>
                {user.dailyBounty.description}
              </p>

              <button
                disabled={dailyBountyClaimed || isClaimingBounty}
                onClick={() => {
                  if (!dailyBountyClaimed && !isClaimingBounty) {
                    setIsClaimingBounty(true);
                    setTimeout(() => {
                      addXP(user.dailyBounty.xpReward);
                      claimDailyBounty();
                      setIsClaimingBounty(false);
                    }, 1200);
                  }
                }}
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
                    CLAIMING...
                  </motion.span>
                ) : dailyBountyClaimed ? (
                  `NEXT CLAIM AT ${user.dailyBounty.nextClaimAt}`
                ) : (
                  '🎁 CLAIM DAILY XP'
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
                      +{user.dailyBounty.xpReward} XP!
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
