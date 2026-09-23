'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useUserStore } from '@/store/useUserStore';
import LearningProgress from '@/components/learning/LearningProgress';
import UniversityHub from '@/components/ui/UniversityHub';
import ScholarshipHub from '@/components/ui/ScholarshipHub';
import RelicsAndTreasures from '@/components/ui/RelicsAndTreasures';
import Image from 'next/image';
import styles from './Dashboard.module.css';

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
  id: number;
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
    matchPercentage: 75,
    targetTier: 'Top Applicant',
    aiFeedback: 'Selesaikan 2 kursus lagi untuk mencapai 100% kesiapan!',
  },
  scholarshipTarget: {
    name: 'KIP Kuliah & Beasiswa Unggulan',
    provider: 'Pemerintah',
    matchPercentage: 88,
    currentTier: 'High Match',
    officialLink: '#',
    aiFeedback: 'Sangat cocok dengan profil RIASEC & kebutuhan finansialmu.',
  },
};

const INITIAL_BOUNTIES: Bounty[] = [
  { id: 1, task: 'Taklukkan Modul HTML Basics', desc: 'Selesaikan 1 quiz di House of Tech', reward: '+150 XP', done: true, claimed: false },
  { id: 2, task: 'Simulasi Penalaran Matematika', desc: 'Latihan 5 soal TPS SNBT 2026', reward: '+200 XP', done: false },
  { id: 3, task: 'Diskusi Komunitas Mahasiswa', desc: 'Bantu 1 teman di forum tanya jawab', reward: '+50 XP', done: false },
  { id: 4, task: 'Klaim SBT First House Master', desc: 'Selesaikan evaluasi tahap 4 mini project', reward: 'Free Claim', done: false },
];

const VAULT_SBTS = [
  { id: 1, name: 'HTML Basics', desc: 'House of Tech', earned: true, icon: '🛡️' },
  { id: 2, name: 'Python Logic', desc: 'Algorithm Core', earned: true, icon: '⚔️' },
  { id: 3, name: 'Figma UI/UX', desc: 'Design Fundamentals', earned: false, icon: '💎' },
  { id: 4, name: 'Data Wizard', desc: 'Data Analytics', earned: false, icon: '🔮' },
];

const LEADERBOARD_MOCK = [
  { rank: 1, name: 'AlexTheGreat', score: 3450 },
  { rank: 2, name: 'You', score: 1250 },
  { rank: 3, name: 'BudiSetiawan', score: 980 },
];

export default function Dashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const defaultNav = tabParam === 'learning' ? 'Learning Progress' : 'Dashboard';
  const [bounties, setBounties] = useState<Bounty[]>(INITIAL_BOUNTIES);
  const [activeNav, setActiveNav] = useState(defaultNav);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMailOpen, setIsMailOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [unreadMails, setUnreadMails] = useState([{ id: 1, sender: 'Prof. Oak', msg: 'Jangan lupa kerjakan kuis HTML!' }, { id: 2, sender: 'System', msg: 'Selamat datang di PathTrick!' }]);
  const [unreadNotifs, setUnreadNotifs] = useState([{ id: 1, msg: 'Anda berhasil naik ke Level 12!' }]);
  const { logout, user } = usePrivy();
  const { wallets } = useWallets();
  const { displayName: savedName } = useUserStore();

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

  const toggleBounty = (id: number) => {
    setBounties(prev =>
      prev.map(b => {
        if (b.id === id) {
          if (!b.done) return { ...b, done: true, claimed: false };
          if (b.done && !b.claimed) return { ...b, claimed: true };
          return { ...b, done: false, claimed: false }; // cycle back for testing
        }
        return b;
      })
    );
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
      
      {/* Profile XP Banner */}
      <div className={styles.retroCard} style={{ flexDirection: 'row', alignItems: 'center', gap: '24px' }}>
        <div style={{ fontSize: '4rem', background: '#d4a373', border: '4px solid #5a3a29', borderRadius: '8px', padding: '12px' }}>
          👨‍🎓
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <h2 style={{ fontFamily: '"Press Start 2P"', fontSize: '1rem', color: '#fff', textShadow: '2px 2px 0 #3b261b' }}>
              {displayName}
            </h2>
            <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.8rem', color: '#fbbf24' }}>{mockAiResponse.user.level}</span>
          </div>
          <div className={styles.readinessContainer}>
            <div className={styles.readinessLabel}>
              <span>XP PROGRESS</span>
              <span>{mockAiResponse.user.totalXP} / 2000 XP</span>
            </div>
            <div className={styles.readinessBarBg} style={{ height: '32px' }}>
              <div className={styles.readinessBarFillBlue} style={{ width: `${(mockAiResponse.user.totalXP / 2000) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Top Row: Univ Rank & Scholarship Rank */}
      <div className={styles.topRow}>
        
        {/* University Rank (Combined Concept 1 & 2) */}
        <div className={styles.retroCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>🎓 UNIVERSITY RANK</span>
          </div>
          <div className={styles.rankContent}>
            <div className={styles.tierBadge}>
              <span className={styles.tierIcon}>🏅</span>
              <span className={styles.tierName}>{mockAiResponse.universityTarget.targetTier}</span>
            </div>
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
              <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.7rem', lineHeight: '1.6', color: '#d4d4d8' }}>
                Target: {mockAiResponse.universityTarget.name}
              </p>
            </div>
            <div className={styles.readinessContainer}>
              <div className={styles.readinessLabel}>
                <span>READINESS</span>
                <span style={{ color: '#34d399' }}>{mockAiResponse.universityTarget.matchPercentage}% MATCH</span>
              </div>
              <div className={styles.readinessBarBg}>
                <div className={styles.readinessBarFill} style={{ width: `${mockAiResponse.universityTarget.matchPercentage}%` }} />
              </div>
              <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.6rem', lineHeight: '1.6', color: '#fbbf24', marginTop: '8px', textAlign: 'center' }}>
                {mockAiResponse.universityTarget.aiFeedback}
              </p>
            </div>
          </div>
        </div>

        {/* Scholarship Rank (Combined Concept 1 & 2) */}
        <div className={styles.retroCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>📜 SCHOLARSHIP RANK</span>
          </div>
          <div className={styles.rankContent}>
            <div className={styles.tierBadge}>
              <span className={styles.tierIcon}>🏆</span>
              <span className={styles.tierName}>{mockAiResponse.scholarshipTarget.currentTier}</span>
            </div>
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
              <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.7rem', lineHeight: '1.6', color: '#d4d4d8' }}>
                Target: {mockAiResponse.scholarshipTarget.name}
              </p>
            </div>
            <div className={styles.readinessContainer}>
              <div className={styles.readinessLabel}>
                <span>PROFILE MATCH</span>
                <span style={{ color: '#34d399' }}>{mockAiResponse.scholarshipTarget.matchPercentage}% MATCH</span>
              </div>
              <div className={styles.readinessBarBg}>
                <div className={styles.readinessBarFill} style={{ width: `${mockAiResponse.scholarshipTarget.matchPercentage}%` }} />
              </div>
              <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.6rem', lineHeight: '1.6', color: '#fbbf24', marginTop: '8px', textAlign: 'center' }}>
                {mockAiResponse.scholarshipTarget.aiFeedback}
              </p>
            </div>
          </div>
        </div>

      </div>

      <div className={styles.topRow}>
        
        {/* Daily Missions / Quest Log */}
        <div className={styles.retroCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>📜 QUEST LOG (MISSIONS)</span>
            <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.7rem', color: '#fbbf24' }}>
              {completedCount}/{bounties.length}
            </span>
          </div>
          <div className={styles.questList}>
            <AnimatePresence>
              {bounties.map((bounty) => (
                <div 
                  key={bounty.id} 
                  className={`${styles.questItem} ${bounty.claimed ? styles.questItemDone : ''}`}
                  onClick={() => toggleBounty(bounty.id)}
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
                    {bounty.claimed ? 'CLAIMED' : (bounty.done ? 'CLAIM' : bounty.reward)}
                  </span>
                </div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: Leaderboard & Vault */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Leaderboard Preview */}
          <div className={styles.retroCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>👑 WEEKLY LEADERBOARD</span>
            </div>
            <div className={styles.lbList}>
              {LEADERBOARD_MOCK.map((lb) => (
                <div key={lb.rank} className={`${styles.lbItem} ${lb.rank === 1 ? styles.lbItemTop : ''}`}>
                  <div className={styles.lbRankInfo}>
                    <span className={styles.lbRankNum}>#{lb.rank}</span>
                    <span className={styles.lbName}>
                      {lb.rank === 2 ? displayName : lb.name}
                      {lb.rank === 2 && <span style={{ fontSize: '0.6em', color: '#fbbf24', marginLeft: '6px' }}>(YOU)</span>}
                    </span>
                  </div>
                  <span className={styles.lbScore}>{lb.score} XP</span>
                </div>
              ))}
            </div>
          </div>

          {/* Achievement Vault Showcase */}
          <div className={styles.retroCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>💎 ACHIEVEMENT VAULT</span>
              <span 
                onClick={() => router.push('/sma/certificate')}
                style={{ fontFamily: '"Press Start 2P"', fontSize: '0.4rem', color: '#fbbf24', cursor: 'pointer' }}
              >
                VIEW ALL
              </span>
            </div>
            <div className={styles.vaultGrid}>
              {VAULT_SBTS.map((sbt) => (
                <div key={sbt.id} className={`${styles.sbtItem} ${!sbt.earned ? styles.sbtItemLocked : ''}`}>
                  <div className={styles.sbtIcon}>{sbt.icon}</div>
                  <div className={styles.sbtInfo}>
                    <span className={styles.sbtName}>{sbt.name}</span>
                    <span className={styles.sbtDesc}>{sbt.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
