'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useScholarStore } from '@/store/useScholarStore';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useUserStore } from '@/store/useUserStore';
import styles from '@/components/ui/Dashboard.module.css';
import { AnimatePresence } from 'framer-motion';
import CVUpdaterWidget from './CVUpdaterWidget';
import { useTranslation } from '@/hooks/useTranslation';
import { getChaserLevelInfo } from '@/data/chaserLevelData';

export default function MahasiswaDashboard() {
  const { t } = useTranslation();
  const { targetJob, matchedJobs, earnedSBTs, fetchProfileData, analyzeSkillGap, isLoading } = useScholarStore();
  const [gapData, setGapData] = useState<{ missing: string[]; possessed: string[] }>({ missing: [], possessed: [] });
  const [gamification, setGamification] = useState<{xp: number, completedCourses: number, achievements: any[]}>({ xp: 0, completedCourses: 0, achievements: [] });
  const [mounted, setMounted] = useState(false);
  
  const { user } = usePrivy();
  const { wallets } = useWallets();
  const { displayName: savedName, totalXP, level } = useUserStore();
  const activeWallet = wallets[0];
  const displayName = savedName 
    || user?.google?.name 
    || user?.email?.address?.split('@')[0] 
    || (activeWallet ? `${activeWallet.address.slice(0, 6)}...${activeWallet.address.slice(-4)}` : 'The Chaser');

  useEffect(() => {
    setMounted(true);
    async function fetchData() {
      await fetchProfileData();
      setGapData(analyzeSkillGap());

      const { getAuthHeaders } = await import('@/hooks/useAuthSync');
      const { API_BASE_URL } = await import('@/config/pathtrick');
      try {
        const res = await fetch(`${API_BASE_URL}/api/gamification`, { headers: getAuthHeaders() });
        if (res.ok) {
          const g = await res.json();
          const backendXP = Number(g?.xp ?? 0);
          const backendLevel = Math.max(0, Math.floor(backendXP / 1000));
          setGamification(g);
          useUserStore.setState({ totalXP: backendXP, level: backendLevel });
        }
      } catch (e) {}
    }
    fetchData();
  }, [fetchProfileData, analyzeSkillGap]);

  const xpToNext = 1000;
  const progressInCurrentLevel = totalXP % 1000;
  const progressPercent = Math.min((progressInCurrentLevel / 1000) * 100, 100);
  const levelInfo = getChaserLevelInfo(totalXP);
  const dynamicRank = levelInfo.careerLabel;
  const nextTier = levelInfo.currentTier.nextLabel ?? 'Max';
  const nextTierXp = levelInfo.currentTier.nextXp ?? totalXP;
  const currentTierProgress = levelInfo.currentTier.nextXp == null
    ? 100
    : Math.min((levelInfo.xpInCurrentTier / Math.max(1, levelInfo.currentTier.nextXp - levelInfo.currentTier.minXp)) * 100, 100);

  // Persentase dihitung sama seperti Career Hub (overlap skill), lalu diurutkan tertinggi dulu.
  const topJobs = (matchedJobs?.length ? matchedJobs : targetJob ? [targetJob] : [])
    .map((job: any) => {
      const req: string[] = job.requiredSkills ?? [];
      const have = req.filter((s) => earnedSBTs.includes(s)).length;
      return { ...job, matchPercentage: req.length > 0 ? Math.round((have / req.length) * 100) : 100 };
    })
    .sort((a, b) => b.matchPercentage - a.matchPercentage)
    .slice(0, 3);

  const unlockedKeys = (gamification.achievements ?? []).map((a: any) => a.key);
  const VAULT_SBTS = [
    { id: 1, name: 'Mission Completer', desc: t('badges.missionCompleter'), earned: unlockedKeys.includes('mission_completer'), icon: '/Mission Completer.png' },
    { id: 2, name: 'Early Bird', desc: t('badges.earlyBird'), earned: unlockedKeys.includes('early_bird'), icon: '/Early Bird.png' },
    { id: 3, name: 'Streak Warrior', desc: t('badges.streakWarrior'), earned: unlockedKeys.includes('streak_warrior'), icon: '/Streak Warrior copy.png' },
    { id: 4, name: 'Quiz Master', desc: t('badges.quizMaster'), earned: unlockedKeys.includes('quiz_master'), icon: '/Quiz Master copy.png' },
  ];

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
        
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.5fr)', gap: '24px', alignItems: 'stretch' }}>
          {/* ── Career Rank Widget ── */}
          <div className={styles.retroCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>{t('mahasiswa.dashboard.careerRank')}</span>
            </div>
            <div className={styles.rankContent}>
              <div className={styles.tierBadge}>
                <img src="/CareerRankLogo.png" alt="Rank" className={styles.tierIcon} style={{ width: '72px', height: '72px', objectFit: 'contain', imageRendering: 'pixelated' }} />
                <span className={styles.tierName}>{dynamicRank}</span>
              </div>

              <div style={{ textAlign: 'center', marginBottom: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <p style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.62rem', color: '#fbbf24', lineHeight: '1.5', letterSpacing: '0.08em' }}>
                  LEVEL {levelInfo.numericLevel}
                </p>
                <p style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.56rem', color: '#d4d4d8', lineHeight: '1.6' }}>
                  {levelInfo.currentTier.description}
                </p>
                <p style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.56rem', color: '#34d399', lineHeight: '1.6' }}>
                  {nextTier === 'Max'
                    ? 'Anda sudah mencapai gelar tertinggi.'
                    : `${nextTier} di Level ${Math.floor(nextTierXp / 1000)}`}
                </p>
              </div>

              <div className={styles.readinessContainer}>
                <div className={styles.readinessLabel}>
                  <span>{t('mahasiswa.dashboard.xpProgress')}</span>
                  <span style={{ color: '#34d399' }}>{progressInCurrentLevel} / {xpToNext} XP</span>
                </div>
                <div className={styles.readinessBarBg} style={{ height: '32px' }}>
                  <div className={styles.readinessBarFillBlue} style={{ width: `${progressPercent}%` }} />
                </div>
              </div>

              <p style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.5rem', color: '#a1a1aa', textAlign: 'center', marginTop: '8px', lineHeight: '1.6' }}>
                ⓘ 1.000 XP = naik 1 level
              </p>
            </div>
          </div>

          {/* ── AI Job Match Widget ── */}
          <div className={styles.retroCard} style={{ display: 'flex', flexDirection: 'column' }}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>{t('mahasiswa.dashboard.aiJobMatch')}</span>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'space-between' }}>
              <p style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.6rem', color: '#d4d4d8', lineHeight: '1.6' }}>
                {mounted
                  ? t('mahasiswa.dashboard.jobsFoundThisWeek').replace('{count}', String(matchedJobs?.length ?? 0))
                  : t('mahasiswa.dashboard.jobsFoundThisWeek').replace('{count}', '...')
                }
              </p>
              
              {topJobs.map((job: any, i: number) => (
                <div key={job.id ?? i} style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', border: '2px solid #5a3a29', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: 0 }}>
                    <h3 style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.75rem', color: '#fbbf24', lineHeight: '1.4' }}>{job.title}</h3>
                    <p style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.6rem', color: '#fff' }}>{job.company}</p>
                  </div>
                  <div style={{ flexShrink: 0, background: '#047857', border: '2px solid #064e3b', color: '#fff', fontSize: '0.6rem', fontFamily: 'var(--font-pixel)', padding: '8px 10px', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)' }}>
                    MATCH: {job.matchPercentage}%
                  </div>
                </div>
              ))}
              
              <Link href="/chaser/career-hub" style={{
                display: 'block',
                marginTop: 'auto',
                width: '100%',
                padding: '12px',
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
        </div>

        {/* ── Achievement Vault + CV Updater (same row, equal height) ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 0.7fr) minmax(0, 1.5fr)', gap: '24px', alignItems: 'stretch' }}>
          {/* ── Achievement Vault ── */}
          <div className={styles.retroCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>💎 {t('sma.dashboard.achievementVault')}</span>
              <Link
                href="/chaser/leaderboard"
                style={{ fontFamily: '"Press Start 2P"', fontSize: '0.4rem', color: '#fbbf24', cursor: 'pointer' }}
              >
                {t('sma.dashboard.viewAll')}
              </Link>
            </div>
            <div className={styles.vaultGrid} style={{ gridTemplateColumns: '1fr' }}>
              {VAULT_SBTS.map((sbt) => (
                <div key={sbt.id} className={`${styles.sbtItem} ${!sbt.earned ? styles.sbtItemLocked : ''}`}>
                  <div className={styles.sbtIcon} style={{ position: 'relative' }}>
                    <Image
                      src={sbt.icon}
                      alt={sbt.name}
                      fill
                      style={{
                        objectFit: 'contain',
                        padding: '6px',
                        filter: sbt.earned ? 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.4))' : 'brightness(0) invert(0.8) opacity(0.8)'
                      }}
                    />
                  </div>
                  <div className={styles.sbtInfo}>
                    <span className={styles.sbtName}>{sbt.name}</span>
                    <span className={styles.sbtDesc}>{sbt.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── CV Updater Widget ── */}
          <CVUpdaterWidget />
        </div>

      </div>
    </div>
  );
}
