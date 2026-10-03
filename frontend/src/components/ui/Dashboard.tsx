'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useUserStore } from '@/store/useUserStore';
import LearningProgress from '@/components/learning/LearningProgress';
import UniversityHub from '@/components/ui/UniversityHub';
import ScholarshipHub from '@/components/ui/ScholarshipHub';
import RelicsAndTreasures from '@/components/ui/RelicsAndTreasures';
import PixelIcon from '@/components/ui/PixelIcon';
import Image from 'next/image';
import { useTranslation } from '@/hooks/useTranslation';
import styles from './Dashboard.module.css';
import { PixelSkeletonCardBody, PixelSkeletonRows } from '@/components/ui/PixelSkeleton';

// ─── API CONTRACT: TYPESCRIPT INTERFACES ───
interface UserProfile {
  name: string;
  email: string;
  level: string;
  totalXP: number;
}

interface DocumentChecklistItem {
  docName: string;
  isCompleted: boolean;
}

interface UniversityTarget {
  name: string;
  country: string;
  matchPercentage: number;
  targetTier: string;
  aiFeedback: string;
}

interface ScholarshipTarget {
  name: string;
  provider: string;
  matchPercentage: number;
  currentTier: string;
  officialLink: string;
  aiFeedback: string;
}

interface AIResponse {
  user: UserProfile;
  universityTarget: UniversityTarget;
  scholarshipTarget: ScholarshipTarget;
}

interface Bounty {
  id: string;
  type: string;
  task: string;
  desc: string;
  reward: string;
  done: boolean;
  claimed?: boolean;
}

// ─── MOCK DATA ───
const mockAiResponse: AIResponse = {
  user: {
    name: 'Tukiman',
    email: 'D.Tukiman@gmail.com',
    level: 'Lvl 12',
    totalXP: 1250,
  },
  universityTarget: {
    name: 'UI - Teknik Komputer',
    country: 'Indonesia',
    matchPercentage: 0,
    targetTier: 'Top Applicant',
    aiFeedback: 'Selesaikan 2 kursus lagi untuk mencapai 100% kesiapan!',
  },
  scholarshipTarget: {
    name: 'KIP Kuliah & Beasiswa Unggulan',
    provider: 'Pemerintah',
    matchPercentage: 0,
    currentTier: 'High Match',
    officialLink: '#',
    aiFeedback: 'Sangat cocok dengan profil RIASEC & kebutuhan finansialmu.',
  },
};



const VAULT_SBTS = [
  { id: 1, name: 'HTML Basics', desc: 'House of Tech', earned: true, icon: '🛡️' },
  { id: 2, name: 'Python Logic', desc: 'Algorithm Core', earned: true, icon: '⚔️' },
  { id: 3, name: 'Figma UI/UX', desc: 'Design Fundamentals', earned: false, icon: '💎' },
  { id: 4, name: 'Data Wizard', desc: 'Data Analytics', earned: false, icon: '🔮' },
];



export default function Dashboard() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const defaultNav = tabParam === 'learning' ? 'Learning Progress' : 'Dashboard';
  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [activeNav, setActiveNav] = useState(defaultNav);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMailOpen, setIsMailOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [unreadNotifs, setUnreadNotifs] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [gamification, setGamification] = useState<{xp: number, completedCourses: number, achievements: any[]}>({ xp: 0, completedCourses: 0, achievements: [] });
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [universityMatch, setUniversityMatch] = useState<UniversityTarget | null>(null);
  const [scholarshipMatch, setScholarshipMatch] = useState<ScholarshipTarget | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  const unlockedKeys = gamification.achievements.map((a: any) => a.key);
  const VAULT_SBTS = [
    { id: 1, name: 'Mission Completer', desc: t('badges.missionCompleter'), earned: unlockedKeys.includes('mission_completer'), icon: '/Mission Completer.png' },
    { id: 2, name: 'Early Bird', desc: t('badges.earlyBird'), earned: unlockedKeys.includes('early_bird'), icon: '/Early Bird.png' },
    { id: 3, name: 'Streak Warrior', desc: t('badges.streakWarrior'), earned: unlockedKeys.includes('streak_warrior'), icon: '/Streak Warrior copy.png' },
    { id: 4, name: 'Quiz Master', desc: t('badges.quizMaster'), earned: unlockedKeys.includes('quiz_master'), icon: '/Quiz Master copy.png' },
  ];

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const { getAuthHeaders } = await import('@/hooks/useAuthSync');
        const { API_BASE_URL } = await import('@/config/pathtrick');
        const headers = getAuthHeaders();
        const [meRes, gamiRes, lbRes, notifRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/users/me`, { headers }),
          fetch(`${API_BASE_URL}/api/gamification`, { headers }),
          fetch(`${API_BASE_URL}/api/leaderboard`, { headers }),
          fetch(`${API_BASE_URL}/api/notifications`, { headers })
        ]);
        const questsRes = await fetch(`${API_BASE_URL}/api/quests`, { headers });
        
        if (meRes.ok) {
          const meData = await meRes.json();
          if (meData.roadmaps && meData.roadmaps.length > 0) {
            const activeRoadmap = meData.roadmaps[0];
            if (activeRoadmap.universityMatches && activeRoadmap.universityMatches.length > 0) {
              const uMatch = activeRoadmap.universityMatches[0];
              setUniversityMatch({
                name: uMatch.university.name,
                country: uMatch.university.country,
                matchPercentage: uMatch.matchScore,
                targetTier: uMatch.matchScore >= 80 ? 'Top Applicant' : uMatch.matchScore >= 60 ? 'Good Match' : 'Reachable',
                aiFeedback: uMatch.reasoning || 'Tingkatkan lagi belajarmu!',
              });
            }
            if (activeRoadmap.scholarshipMatches && activeRoadmap.scholarshipMatches.length > 0) {
              const sMatch = activeRoadmap.scholarshipMatches[0];
              setScholarshipMatch({
                name: sMatch.scholarship.name,
                provider: sMatch.scholarship.provider || 'Provider',
                matchPercentage: sMatch.matchScore,
                currentTier: sMatch.matchScore >= 80 ? 'High Match' : sMatch.matchScore >= 60 ? 'Medium Match' : 'Basic Match',
                officialLink: sMatch.scholarship.officialUrl || '#',
                aiFeedback: sMatch.reasoning || 'Persiapkan dokumenmu dari sekarang.',
              });
            }
          }
        }
        
        if (gamiRes.ok) {
          const gData = await gamiRes.json();
          setGamification(gData);
        }
        if (lbRes.ok) {
          const lData = await lbRes.json();
          if (lData.leaderboard && lData.leaderboard.length > 0) {
            setLeaderboard(lData.leaderboard);
          }
        }
        if (notifRes.ok) {
          const nData = await notifRes.json();
          setUnreadNotifs(nData.notifications);
          setUnreadCount(nData.unreadCount);
        }
        if (questsRes.ok) {
          const qData = await questsRes.json();
          const questList = Array.isArray(qData.quests) ? qData.quests : [];
          setBounties(questList.map((quest: any) => ({
            id: quest.id,
            type: quest.type,
            task: quest.title,
            desc: quest.description,
            reward: `+${quest.rewardXp} XP`,
            done: !!quest.isCompleted,
            claimed: !!quest.isRewardClaimed,
          })));
        }
      } catch (e) {
        console.error('Failed to fetch dashboard data:', e);
      } finally {
        setLoadingData(false);
      }
    }
    fetchDashboardData();
  }, []);
  const { logout, user } = usePrivy();
  const { wallets } = useWallets();
  const { displayName: savedName, avatarUrl, totalXP, level } = useUserStore();

  // Real user display name - same priority as layouts
  const activeWallet = wallets[0];
  const displayName = savedName
    || user?.google?.name
    || user?.email?.address?.split('@')[0]
    || (activeWallet ? `${activeWallet.address.slice(0, 6)}...${activeWallet.address.slice(-4)}` : 'Explorer');

  const toggleMail = () => { setIsMailOpen(!isMailOpen); setIsNotifOpen(false); setIsDropdownOpen(false); };
  const toggleNotif = () => { setIsNotifOpen(!isNotifOpen); setIsMailOpen(false); setIsDropdownOpen(false); };
  const toggleProfile = () => { setIsDropdownOpen(!isDropdownOpen); setIsMailOpen(false); setIsNotifOpen(false); };

  const handleToggleTheme = () => {
    const current = document.documentElement.dataset.theme || 'dark';
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('theme', next);
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const completedCount = bounties.filter(b => b.claimed).length;

  const NAV_ITEMS = [
    { label: 'Dashboard', icon: '📊', isDashboard: true },
    { label: 'Learning Progress', icon: '🎯' },
    { label: 'University Hub', icon: '🎓' },
    { label: 'Scholarship Hub', icon: '📜' },
    { label: 'Relics & Treasures', icon: '🏅' },
  ];

  return (
    <div className={styles.widgetGrid}>
      
      {/* ── Header ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '8px' }}>
        <h1 style={{ fontFamily: 'var(--font-pixel)', fontSize: '1.5rem', color: '#fff', textShadow: '2px 2px 0 #3b261b', textTransform: 'uppercase' }}>
          {t('sma.dashboard.welcomeBack').replace('{name}', displayName)}
        </h1>
        <p style={{ fontFamily: '"Pixelify Sans", sans-serif', fontSize: '1.2rem', color: '#d4d4d8', lineHeight: '1.6', whiteSpace: 'nowrap' }}>
          {t('sma.dashboard.subtitle')}
        </p>
      </div>

      {/* Profile XP Banner */}
      <div className={styles.retroCard} style={{ flexDirection: 'row', alignItems: 'center', gap: '24px' }}>
        <div style={{ background: '#d4a373', border: '4px solid #5a3a29', borderRadius: '8px', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Image src={avatarUrl} alt="Profile avatar" width={64} height={64} />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <h2 style={{ fontFamily: '"Press Start 2P"', fontSize: '1rem', color: '#fff', textShadow: '2px 2px 0 #3b261b' }}>
              {displayName}
            </h2>
            <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.8rem', color: '#fbbf24' }}>Lvl {level}</span>
          </div>
            <div className={styles.readinessContainer}>
              <div className={styles.readinessLabel}>
                <span>{t('sma.dashboard.xpProgress')}</span>
                <span>{totalXP} / {(level + 1) * 1000} XP</span>
              </div>
              <div className={styles.readinessBarBg} style={{ height: '32px' }}>
                <div className={styles.readinessBarFillBlue} style={{ width: `${Math.min(((totalXP - level * 1000) / 1000) * 100, 100)}%` }} />
              </div>
            </div>
        </div>
      </div>

      {/* Top Row: Univ Rank & Scholarship Rank */}
      <div className={styles.topRow}>
        
        {/* University Rank */}
        <div className={styles.retroCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}><PixelIcon icon="🎓" size={18} /> {t('sma.dashboard.universityRank')}</span>
          </div>
          {loadingData ? <PixelSkeletonCardBody rows={1} panelHeight="100px" /> : (
          <div className={styles.rankContent}>
            <div className={styles.tierBadge}>
              <PixelIcon icon="👨‍🎓" size={72} className="drop-shadow-[4px_4px_0_rgba(0,0,0,0.5)]" />
              <span className={styles.tierName}>{universityMatch?.targetTier || 'No Match Yet'}</span>
            </div>
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
              <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.7rem', lineHeight: '1.6', color: '#d4d4d8' }}>
                {t('sma.dashboard.target')}{universityMatch?.name || 'TBD'}
              </p>
            </div>
            <div className={styles.readinessContainer}>
              <div className={styles.readinessLabel}>
                <span>{t('sma.dashboard.readiness')}</span>
                <span style={{ color: '#34d399' }}>{universityMatch?.matchPercentage || 0}{t('sma.dashboard.match')}</span>
              </div>
              <div className={styles.readinessBarBg}>
                <div className={styles.readinessBarFill} style={{ width: `${universityMatch?.matchPercentage || 0}%` }} />
              </div>
              <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.6rem', lineHeight: '1.6', color: '#fbbf24', marginTop: '8px', textAlign: 'center' }}>
                {universityMatch?.aiFeedback || 'Ikuti assessment untuk mendapatkan feedback.'}
              </p>
            </div>
          </div>
          )}
        </div>

        {/* Scholarship Rank */}
        <div className={styles.retroCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>📜 {t('sma.dashboard.scholarshipRank')}</span>
          </div>
          {loadingData ? <PixelSkeletonCardBody rows={1} panelHeight="100px" /> : (
          <div className={styles.rankContent}>
            <div className={styles.tierBadge}>
              <PixelIcon icon="🏆" size={72} className="drop-shadow-[4px_4px_0_rgba(0,0,0,0.5)]" />
              <span className={styles.tierName}>{scholarshipMatch?.currentTier || 'No Match Yet'}</span>
            </div>
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
              <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.7rem', lineHeight: '1.6', color: '#d4d4d8' }}>
                {t('sma.dashboard.target')}{scholarshipMatch?.name || 'TBD'}
              </p>
            </div>
            <div className={styles.readinessContainer}>
              <div className={styles.readinessLabel}>
                <span>{t('sma.dashboard.profileMatch')}</span>
                <span style={{ color: '#34d399' }}>{scholarshipMatch?.matchPercentage || 0}{t('sma.dashboard.match')}</span>
              </div>
              <div className={styles.readinessBarBg}>
                <div className={styles.readinessBarFill} style={{ width: `${scholarshipMatch?.matchPercentage || 0}%` }} />
              </div>
              <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.6rem', lineHeight: '1.6', color: '#fbbf24', marginTop: '8px', textAlign: 'center' }}>
                {scholarshipMatch?.aiFeedback || 'Ikuti assessment untuk mendapatkan feedback.'}
              </p>
            </div>
          </div>
          )}
        </div>

      </div>

      <div className={styles.topRow}>
        
        {/* Daily Missions / Quest Log */}
        <div className={styles.retroCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>📜 {t('sma.dashboard.questLog')}</span>
            <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.7rem', color: '#fbbf24' }}>
              {completedCount}/{bounties.length}
            </span>
          </div>
          {loadingData ? <PixelSkeletonRows count={4} /> : (
          <div className={styles.questList}>
            <AnimatePresence>
              {bounties.map((bounty) => (
                <div 
                  key={bounty.id} 
                  className={`${styles.questItem} ${bounty.claimed ? styles.questItemDone : ''}`}
                  onClick={async () => {
                    if (!bounty.done || bounty.claimed) return;
                    try {
                      const { getAuthHeaders } = await import('@/hooks/useAuthSync');
                      const { API_BASE_URL } = await import('@/config/pathtrick');
                      const res = await fetch(`${API_BASE_URL}/api/quests/${bounty.id}/claim`, {
                        method: 'POST',
                        headers: getAuthHeaders(),
                      });
                      if (res.ok) {
                        setBounties(prev => prev.map(item => item.id === bounty.id ? { ...item, claimed: true } : item));
                      }
                    } catch (error) {
                      console.error('Failed to claim quest:', error);
                    }
                  }}
                >
                  <div className={styles.questIcon}>
                    {bounty.claimed ? '✅' : (bounty.done ? '🎁' : '❔')}
                  </div>
                  <div className={styles.questInfo}>
                    <span className={`${styles.questTitle} ${bounty.claimed ? styles.questTitleDone : ''}`}>
                      {bounty.task}
                    </span>
                    <span className={styles.questDesc}>{bounty.desc}</span>
                  </div>
                  <span className={styles.questReward} style={
                    bounty.claimed 
                      ? { background: '#a3a3a3', borderColor: '#525252', color: '#fff', opacity: 0.8 } 
                      : (bounty.done 
                          ? { background: '#047857', borderColor: '#064e3b', color: '#fff' } 
                          : {})
                  }>
                    {bounty.claimed ? t('sma.dashboard.claimed') : (bounty.done ? t('sma.dashboard.claim') : bounty.reward)}
                  </span>
                </div>
              ))}
            </AnimatePresence>
          </div>
          )}
        </div>

        {/* Right Column: Leaderboard & Vault */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Leaderboard Preview */}
          <div className={styles.retroCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>👑 {t('sma.dashboard.weeklyLeaderboard')}</span>
            </div>
            {loadingData ? <PixelSkeletonRows count={3} /> : (
            <div className={styles.lbList}>
              {leaderboard.length > 0 ? leaderboard.slice(0, 5).map((lb: any) => {
                const score = typeof lb.score === 'number' ? lb.score : (typeof lb.xp === 'number' ? lb.xp : 0);
                const labelName = lb.name || 'Anonymous';

                return (
                  <div key={lb.rank} className={`${styles.lbItem} ${lb.rank === 1 ? styles.lbItemTop : ''}`}>
                    <div className={styles.lbRankInfo}>
                      <span className={styles.lbRankNum}>#{lb.rank}</span>
                      <span className={styles.lbName}>
                        {labelName}
                        {lb.userId === user?.id && <span style={{ fontSize: '0.6em', color: '#fbbf24', marginLeft: '6px' }}>{t('sma.dashboard.you')}</span>}
                      </span>
                    </div>
                    <span className={styles.lbScore}>{score} XP</span>
                  </div>
                );
              }) : (
                <div style={{ padding: '12px', fontSize: '0.8rem', color: '#999', textAlign: 'center', fontFamily: '"Press Start 2P"' }}>
                  No Data
                </div>
              )}
            </div>
            )}
          </div>

          {/* Achievement Vault Showcase */}
          <div className={styles.retroCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>💎 {t('sma.dashboard.achievementVault')}</span>
              <span 
                onClick={() => router.push(window.location.pathname.includes('/chaser') ? '/chaser/certificate' : '/dreamer/certificate')}
                style={{ fontFamily: '"Press Start 2P"', fontSize: '0.4rem', color: '#fbbf24', cursor: 'pointer' }}
              >
                {t('sma.dashboard.viewAll')}
              </span>
            </div>
            {loadingData ? <PixelSkeletonRows count={2} /> : (
            <div className={styles.vaultGrid}>
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
            )}
          </div>

        </div>
      </div>

    </div>
  );
}
