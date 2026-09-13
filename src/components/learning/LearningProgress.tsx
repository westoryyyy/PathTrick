'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockBackendData } from '@/data/mockBackendData';
import { House, Stage } from '@/types/backend';
import styles from '@/components/ui/Dashboard.module.css';

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
  const { houses, user } = mockBackendData;
  const [expandedHouse, setExpandedHouse] = useState<string | null>(houses[0]?.id || null);

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
          <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.45rem', padding: '6px 12px', background: '#525252', border: '2px solid #404040', color: '#a3a3a3', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)' }}>
            🔒 LOCKED
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
        <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.8rem', color: '#d4d4d8', lineHeight: '1.6' }}>
          Track your journey through the 12 Houses and master new skills.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        
        {/* ─── LEFT COLUMN: HOUSES ACCORDION ─── */}
        <div style={{ flex: '1 1 60%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {houses.map((house: House, idx: number) => {
            const isCompleted = house.status === 'completed';
            const isLocked = house.status === 'locked';

            return (
              <motion.div
                key={house.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={styles.retroCard}
                style={{
                  padding: '0',
                  opacity: isLocked ? 0.7 : 1,
                  filter: isLocked ? 'grayscale(100%)' : 'none'
                }}
              >
                {/* House Header */}
                <button
                  onClick={() => !isLocked && setExpandedHouse(expandedHouse === house.id ? null : house.id)}
                  style={{ width: '100%', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: isLocked ? 'not-allowed' : 'pointer', background: 'transparent', border: 'none', outline: 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                    <div style={{ width: '56px', height: '56px', background: '#3b261b', border: '2px solid #5a3a29', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)' }}>
                      {house.icon}
                    </div>
                    <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.7rem', color: '#fbbf24' }}>
                        HOUSE {house.houseNumber}
                      </span>
                      <h3 style={{ fontFamily: '"Press Start 2P"', fontSize: '1rem', color: '#fff', textShadow: '1px 1px 0 #3b261b', marginTop: '4px' }}>
                        {house.title}
                      </h3>
                      <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.7rem', color: '#d4a373', lineHeight: '1.6', marginTop: '4px' }}>
                        {house.description}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge & Progress */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ background: '#3b261b', border: '2px solid #5a3a29', padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', boxShadow: 'inset 2px 2px 0 rgba(0,0,0,0.5)' }}>
                      <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.6rem', color: '#fff' }}>
                        {getProgressPercentage(house.stages)}%
                      </span>
                      <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.3rem', color: '#fbbf24' }}>DONE</span>
                    </div>

                    {!isLocked && (
                      <motion.div
                        animate={{ rotate: expandedHouse === house.id ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ fontSize: '1.5rem', color: '#fbbf24' }}
                      >
                        ▼
                      </motion.div>
                    )}
                  </div>
                </button>

                {/* Status Badge */}
                <div style={{ padding: '0 24px 24px 24px' }}>
                  {getStatusBadge(house.status)}
                </div>

                {/* Expanded Stages List */}
                <AnimatePresence>
                  {expandedHouse === house.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ borderTop: '4px dashed #5a3a29', padding: '24px', background: 'rgba(0,0,0,0.1)' }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {house.stages.map((stage: Stage, stageIdx: number) => (
                          <motion.div
                            key={stage.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: stageIdx * 0.05 }}
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '16px',
                              background: '#d4a373',
                              border: '2px solid #5a3a29',
                              padding: '16px',
                              boxShadow: 'inset 0 0 8px rgba(0,0,0,0.1), 2px 2px 0 rgba(0,0,0,0.3)',
                              opacity: stage.isCompleted ? 0.7 : 1
                            }}
                          >
                            <div style={{ width: '40px', height: '40px', background: '#fff', border: '2px solid #3b261b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', boxShadow: '2px 2px 0 rgba(0,0,0,0.2)' }}>
                              {stageIconMap[stage.contentType || 'material']}
                            </div>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h4 style={{ fontFamily: '"Press Start 2P"', fontSize: '0.8rem', color: stage.isCompleted ? '#064e3b' : '#3b261b' }}>
                                  {stage.name}
                                </h4>
                                {stage.isCompleted && <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.6rem', color: '#fff', background: '#047857', padding: '4px 8px', border: '2px solid #064e3b' }}>LULUS</span>}
                              </div>
                              <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.6rem', color: '#5a3a29', lineHeight: '1.6', marginTop: '8px' }}>
                                {stage.description}
                              </p>
                              <div style={{ display: 'flex', gap: '12px', fontFamily: '"Press Start 2P"', fontSize: '0.5rem', color: '#78350f', marginTop: '8px' }}>
                                <span>{stage.duration}</span>
                                <span style={{ textTransform: 'uppercase', background: '#fbbf24', padding: '4px 8px', border: '1px solid #b45309' }}>
                                  {stage.contentType}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
              <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.35rem', color: '#fbbf24', cursor: 'pointer' }}>VIEW ALL</span>
            </div>
            
            <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.35rem', color: '#d4d4d8', marginBottom: '16px', lineHeight: '1.6' }}>
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
                disabled={user.dailyBounty.isClaimed}
                style={{
                  width: '100%',
                  padding: '24px',
                  fontFamily: '"Press Start 2P"',
                  fontSize: '0.8rem',
                  color: user.dailyBounty.isClaimed ? '#a3a3a3' : '#fff',
                  background: user.dailyBounty.isClaimed ? '#525252' : '#047857',
                  border: `2px solid ${user.dailyBounty.isClaimed ? '#404040' : '#064e3b'}`,
                  boxShadow: user.dailyBounty.isClaimed ? 'none' : '4px 4px 0 rgba(0,0,0,0.5)',
                  cursor: user.dailyBounty.isClaimed ? 'not-allowed' : 'pointer',
                  transform: user.dailyBounty.isClaimed ? 'none' : 'active:translate(2px, 2px)',
                  marginTop: '8px'
                }}
              >
                {user.dailyBounty.isClaimed ? `NEXT CLAIM AT ${user.dailyBounty.nextClaimAt}` : '🎁 CLAIM DAILY XP'}
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' }}>
              <div style={{ background: '#3b261b', border: '2px solid #5a3a29', padding: '16px', textAlign: 'center', boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.5)' }}>
                <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.8rem', color: '#60a5fa' }}>{user.totalXP}</p>
                <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.35rem', color: '#d4d4d8', marginTop: '8px' }}>TOTAL XP</p>
              </div>
              <div style={{ background: '#3b261b', border: '2px solid #5a3a29', padding: '16px', textAlign: 'center', boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.5)' }}>
                <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.8rem', color: '#fbbf24' }}>LV {user.level}</p>
                <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.35rem', color: '#d4d4d8', marginTop: '8px' }}>LEVEL</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
