'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useScholarStore } from '@/store/useScholarStore';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useUserStore } from '@/store/useUserStore';
import styles from '@/components/ui/Dashboard.module.css';
import { AnimatePresence } from 'framer-motion';
import CVUpdaterWidget from './CVUpdaterWidget';
import { useTranslation } from '@/hooks/useTranslation';

export default function MahasiswaDashboard() {
  const { t } = useTranslation();
  const { targetJob, fetchProfileData, analyzeSkillGap, isLoading } = useScholarStore();
  const [gapData, setGapData] = useState<{ missing: string[]; possessed: string[] }>({ missing: [], possessed: [] });
  const [gamification, setGamification] = useState<{xp: number, completedCourses: number, achievements: any[]}>({ xp: 0, completedCourses: 0, achievements: [] });
  
  const { user } = usePrivy();
  const { wallets } = useWallets();
  const { displayName: savedName, totalXP, level } = useUserStore();
  const activeWallet = wallets[0];
  const displayName = savedName 
    || user?.google?.name 
    || user?.email?.address?.split('@')[0] 
    || (activeWallet ? `${activeWallet.address.slice(0, 6)}...${activeWallet.address.slice(-4)}` : 'The Chaser');

  useEffect(() => {
    async function fetchData() {
      await fetchProfileData();
      setGapData(analyzeSkillGap());

      const { getAuthHeaders } = await import('@/hooks/useAuthSync');
      const { API_BASE_URL } = await import('@/config/pathtrick');
      try {
        const res = await fetch(`${API_BASE_URL}/api/gamification`, { headers: getAuthHeaders() });
        if (res.ok) {
          setGamification(await res.json());
        }
      } catch (e) {}
    }
    fetchData();
  }, [fetchProfileData, analyzeSkillGap]);

  const dynamicRank = level >= 6 ? 'Senior' : level >= 3 ? 'Mid-level' : 'Junior';
  const nextTier = level >= 6 ? 'Master' : level >= 3 ? 'Senior' : 'Mid-level';
  const xpToNext = level * 2500;

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', fontFamily: 'var(--font-pixel)', color: '#fbbf24' }}>
        {t('common.loadingAiInsights')}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* ── Header ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h1 style={{ fontFamily: 'var(--font-pixel)', fontSize: '1.5rem', color: '#fff', textShadow: '2px 2px 0 #3b261b', textTransform: 'uppercase' }}>
          {t('mahasiswa.dashboard.welcomeBack').replace('{name}', displayName)}
        </h1>
        <p style={{ fontFamily: '"Pixelify Sans", sans-serif', fontSize: '1.2rem', color: '#d4d4d8', lineHeight: '1.6', whiteSpace: 'nowrap' }}>
          {t('mahasiswa.dashboard.subtitle')}
        </p>
      </div>

      <div className={styles.widgetGrid}>
        
        <div className={styles.topRow}>
          {/* ── Career Rank Widget ── */}
          <div className={styles.retroCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>{t('mahasiswa.dashboard.careerRank')}</span>
            </div>
            <div className={styles.rankContent}>
              <div className={styles.tierBadge}>
                <img src="/CareerRankLogo.png" alt="Rank" className={styles.tierIcon} style={{ width: '72px', height: '72px', objectFit: 'contain', imageRendering: 'pixelated' }} />
                <span className={styles.tierName}>{dynamicRank} LEVEL</span>
              </div>
              <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                <p style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.6rem', color: '#d4d4d8', lineHeight: '1.6' }}>
                    {t('mahasiswa.dashboard.nextTier').replace('{tier}', nextTier)}
                  </p>
              </div>
              <div className={styles.readinessContainer}>
                <div className={styles.readinessLabel}>
                  <span>{t('mahasiswa.dashboard.xpProgress')}</span>
                  <span style={{ color: '#34d399' }}>{totalXP} / {xpToNext} XP</span>
                </div>
                <div className={styles.readinessBarBg} style={{ height: '32px' }}>
                  <div className={styles.readinessBarFillBlue} style={{ width: `${Math.min((totalXP / xpToNext) * 100, 100)}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* ── Progression & Stats ── */}
          <div className={styles.retroCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>{t('mahasiswa.dashboard.progression')}</span>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px dashed #5a3a29', paddingBottom: '16px' }}>
                <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.75rem', color: '#f8fafc', textShadow: '2px 2px 0px rgba(0,0,0,0.7)' }}>{t('mahasiswa.dashboard.dailyMission')}</span>
                <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.75rem', color: '#fcd34d', textShadow: '2px 2px 0px rgba(0,0,0,0.7)' }}>0/3</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px dashed #5a3a29', paddingBottom: '16px' }}>
                <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.75rem', color: '#f8fafc', textShadow: '2px 2px 0px rgba(0,0,0,0.7)' }}>{t('mahasiswa.dashboard.weeklyChallenge')}</span>
                <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.75rem', color: '#fcd34d', textShadow: '2px 2px 0px rgba(0,0,0,0.7)' }}>0 Active</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px dashed #5a3a29', paddingBottom: '16px' }}>
                <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.75rem', color: '#f8fafc', textShadow: '2px 2px 0px rgba(0,0,0,0.7)' }}>{t('mahasiswa.dashboard.skillTree')}</span>
                <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.75rem', color: '#fcd34d', textShadow: '2px 2px 0px rgba(0,0,0,0.7)' }}>{gamification.completedCourses * 5}%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.75rem', color: '#f8fafc', textShadow: '2px 2px 0px rgba(0,0,0,0.7)' }}>{t('mahasiswa.dashboard.achievementVault')}</span>
                <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.75rem', color: '#fcd34d', textShadow: '2px 2px 0px rgba(0,0,0,0.7)' }}>{gamification.achievements.length} {t('mahasiswa.dashboard.unlocked')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── AI Job Match + CV Updater (same row, equal height) ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', alignItems: 'stretch' }}>
          {/* ── AI Job Match Widget ── */}
          <div className={styles.retroCard} style={{ display: 'flex', flexDirection: 'column' }}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>{t('mahasiswa.dashboard.aiJobMatch')}</span>
            </div>
            <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'space-between' }}>
              <p style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.7rem', color: '#d4d4d8', lineHeight: '1.6' }}>
                {t('mahasiswa.dashboard.jobsFoundThisWeek')}
              </p>
              
              {targetJob && (
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', border: '2px solid #5a3a29', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <h3 style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.9rem', color: '#fbbf24', lineHeight: '1.4' }}>{targetJob.title}</h3>
                  <p style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.7rem', color: '#fff' }}>{targetJob.company}</p>
                  <div style={{ display: 'inline-block', background: '#047857', border: '2px solid #064e3b', color: '#fff', fontSize: '0.7rem', fontFamily: 'var(--font-pixel)', padding: '8px 12px', marginTop: '8px', width: 'fit-content', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)' }}>
                  MATCH: {targetJob.matchPercentage}%
                  </div>
                </div>
              )}
              
              <Link href="/chaser/career-hub" style={{
                display: 'block',
                marginTop: 'auto',
                width: '100%',
                padding: '16px',
                fontFamily: 'var(--font-pixel)',
                fontSize: '0.8rem',
                color: '#3b261b',
                background: '#fbbf24',
                border: '2px solid #3b261b',
                boxShadow: '4px 4px 0 #3b261b',
                cursor: 'pointer',
                textAlign: 'center',
                textDecoration: 'none'
              }}>
                {t('mahasiswa.dashboard.viewAllMatches')}
              </Link>
            </div>
          </div>

          {/* ── CV Updater Widget ── */}
          <CVUpdaterWidget />
        </div>

      </div>
    </div>
  );
}
