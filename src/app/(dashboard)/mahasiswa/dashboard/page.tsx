'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useScholarStore } from '@/store/useScholarStore';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useUserStore } from '@/store/useUserStore';
import styles from '@/components/ui/Dashboard.module.css';
import { AnimatePresence } from 'framer-motion';

export default function MahasiswaDashboard() {
  const { careerRank, xp, targetJob, fetchProfileData, analyzeSkillGap, isLoading } = useScholarStore();
  const [gapData, setGapData] = useState<{ missing: string[]; possessed: string[] }>({ missing: [], possessed: [] });
  
  const { user } = usePrivy();
  const { wallets } = useWallets();
  const { displayName: savedName } = useUserStore();
  const activeWallet = wallets[0];
  const displayName = savedName 
    || user?.google?.name 
    || user?.email?.address?.split('@')[0] 
    || (activeWallet ? `${activeWallet.address.slice(0, 6)}...${activeWallet.address.slice(-4)}` : 'The Chaser');

  useEffect(() => {
    fetchProfileData().then(() => {
      setGapData(analyzeSkillGap());
    });
  }, [fetchProfileData, analyzeSkillGap]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', fontFamily: 'var(--font-pixel)', color: '#fbbf24' }}>
        LOADING AI INSIGHTS...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* ── Header ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h1 style={{ fontFamily: 'var(--font-pixel)', fontSize: '1.5rem', color: '#fff', textShadow: '2px 2px 0 #3b261b', textTransform: 'uppercase' }}>
          WELCOME BACK, {displayName}!
        </h1>
        <p style={{ fontFamily: '"Pixelify Sans", sans-serif', fontSize: '1.2rem', color: '#d4d4d8', lineHeight: '1.6', maxWidth: '800px' }}>
          AI Career Roadmap kamu sedang aktif memindai berbagai peluang terbaik.
        </p>
      </div>

      <div className={styles.widgetGrid}>
        
        <div className={styles.topRow}>
          {/* ── Career Rank Widget ── */}
          <div className={styles.retroCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>CAREER RANK</span>
            </div>
            <div className={styles.rankContent}>
              <div className={styles.tierBadge}>
                <img src="/CareerRankLogo.png" alt="Rank" className={styles.tierIcon} style={{ width: '72px', height: '72px', objectFit: 'contain', imageRendering: 'pixelated' }} />
                <span className={styles.tierName}>{careerRank} LEVEL</span>
              </div>
              <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                <p style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.6rem', color: '#d4d4d8', lineHeight: '1.6' }}>
                  Next Tier: Intern
                </p>
              </div>
              <div className={styles.readinessContainer}>
                <div className={styles.readinessLabel}>
                  <span>XP PROGRESS</span>
                  <span style={{ color: '#34d399' }}>{xp} / 1000 XP</span>
                </div>
                <div className={styles.readinessBarBg} style={{ height: '32px' }}>
                  <div className={styles.readinessBarFillBlue} style={{ width: `${(xp / 1000) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* ── Progression & Stats ── */}
          <div className={styles.retroCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>📈 PROGRESSION</span>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px dashed #5a3a29', paddingBottom: '16px' }}>
                <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.75rem', color: '#f8fafc', textShadow: '2px 2px 0px rgba(0,0,0,0.7)' }}>Daily Mission</span>
                <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.75rem', color: '#fcd34d', textShadow: '2px 2px 0px rgba(0,0,0,0.7)' }}>1/3</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px dashed #5a3a29', paddingBottom: '16px' }}>
                <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.75rem', color: '#f8fafc', textShadow: '2px 2px 0px rgba(0,0,0,0.7)' }}>Weekly Challenge</span>
                <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.75rem', color: '#fcd34d', textShadow: '2px 2px 0px rgba(0,0,0,0.7)' }}>Active</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px dashed #5a3a29', paddingBottom: '16px' }}>
                <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.75rem', color: '#f8fafc', textShadow: '2px 2px 0px rgba(0,0,0,0.7)' }}>Skill Tree</span>
                <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.75rem', color: '#fcd34d', textShadow: '2px 2px 0px rgba(0,0,0,0.7)' }}>12%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.75rem', color: '#f8fafc', textShadow: '2px 2px 0px rgba(0,0,0,0.7)' }}>Achievement Vault</span>
                <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.75rem', color: '#fcd34d', textShadow: '2px 2px 0px rgba(0,0,0,0.7)' }}>4 Unlocked</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.topRow}>
          {/* ── AI Job Match Widget ── */}
          <div className={styles.retroCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>AI JOB MATCH</span>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', justifyContent: 'space-between' }}>
              <p style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.7rem', color: '#d4d4d8', lineHeight: '1.6' }}>
                5 suitable jobs found this week!
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
              
              <Link href="/mahasiswa/career-hub" style={{
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
                VIEW ALL MATCHES
              </Link>
            </div>
          </div>


        </div>

      </div>
    </div>
  );
}
