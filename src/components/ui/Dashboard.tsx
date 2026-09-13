'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import LearningProgress from '@/components/learning/LearningProgress';
import UniversityHub from '@/components/ui/UniversityHub';
import ScholarshipHub from '@/components/ui/ScholarshipHub';
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
  documentChecklist: DocumentChecklistItem[];
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
    matchPercentage: 66,
    currentTier: 'Nominee',
    officialLink: '#',
    documentChecklist: [
      { docName: 'IELTS / TOEFL Score', isCompleted: true },
      { docName: 'Passport', isCompleted: true },
      { docName: 'Motivation Letter', isCompleted: false },
      { docName: 'Letter of Recommendation', isCompleted: false },
    ],
  },
};

const INITIAL_BOUNTIES: Bounty[] = [
  { id: 1, task: 'Taklukkan Modul HTML Basics', desc: 'Selesaikan 1 quiz di House of Tech', reward: '+150 XP', done: true },
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
  { rank: 2, name: 'Tukiman', score: 1250 },
  { rank: 3, name: 'BudiSetiawan', score: 980 },
];

export default function Dashboard() {
  const router = useRouter();
  const [bounties, setBounties] = useState<Bounty[]>(INITIAL_BOUNTIES);
  const [activeNav, setActiveNav] = useState('Dashboard');

  const toggleBounty = (id: number) => {
    setBounties(prev =>
      prev.map(b => (b.id === id ? { ...b, done: !b.done } : b))
    );
  };

  const completedCount = bounties.filter(b => b.done).length;

  const NAV_ITEMS = [
    { label: 'Dashboard', icon: '📊', isDashboard: true },
    { label: 'Learning Progress', icon: '🎯' },
    { label: 'University Hub', icon: '🎓' },
    { label: 'Scholarship Hub', icon: '📜' },
    { label: 'Analytics', icon: '📈' },
  ];

  return (
    <div className={styles.layout}>
      
      {/* ─── LEFT SIDEBAR (RETRO PIXEL) ─── */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <Image src="/PathTrick.png" alt="PathTrick" width={180} height={40} className={styles.logoImg} priority />
          </div>
          <span className={styles.roleBadge}>The Dreamer</span>
        </div>

        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => {
            const isActive = activeNav === item.label;

            return (
              <button
                key={item.label}
                onClick={() => {
                  if (item.route) router.push(item.route);
                  else setActiveNav(item.label);
                }}
                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                style={{ width: '100%', border: '2px solid #5a3a29' }}
              >
                <div className={styles.navIconTitle}>
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`${styles.navBadge} ${item.badge === 'Peta' ? styles.navBadgeBlue : ''}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>



        <button onClick={() => router.push('/')} className={styles.logoutBtn}>
          🚪 LOG OUT
        </button>
      </aside>

      {/* ─── MAIN CONTENT AREA ─── */}
      <main className={styles.mainArea}>
        
        {/* Top Bar Header */}
        <header className={styles.header}>
          <div className={styles.searchBar}>
            <span className={styles.searchTitle}>CATEGORIES</span>
            <input type="text" placeholder="Search..." className={styles.searchInput} />
          </div>

          <div className={styles.headerActions}>
            <div className={styles.iconBtn}>✉️<span className={styles.iconBadge}>2</span></div>
            <div className={styles.iconBtn}>🔔<span className={styles.iconBadge}>1</span></div>

            <div className={styles.profileChip}>
              <div className={styles.profileAvatar}>👨‍🎓</div>
              <div className={styles.profileInfo}>
                <span className={styles.profileName}>{mockAiResponse.user.name}</span>
                <span className={styles.profileEmail}>{mockAiResponse.user.email}</span>
              </div>
              <div style={{ marginLeft: '12px', background: '#3b261b', padding: '4px 8px', borderRadius: '4px', border: '2px solid #5a3a29' }}>
                <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.4rem', color: '#fbbf24' }}>🟣 0x8a..3F</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className={styles.content}>
          {activeNav === 'Dashboard' && (
            <div className={styles.widgetGrid}>
              
              {/* Profile XP Banner */}
              <div className={styles.retroCard} style={{ flexDirection: 'row', alignItems: 'center', gap: '24px' }}>
                <div style={{ fontSize: '4rem', background: '#d4a373', border: '4px solid #5a3a29', borderRadius: '8px', padding: '12px' }}>
                  👨‍🎓
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <h2 style={{ fontFamily: '"Press Start 2P"', fontSize: '1rem', color: '#fff', textShadow: '2px 2px 0 #3b261b' }}>
                      {mockAiResponse.user.name}
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
                        <span>DOCUMENTS</span>
                        <span style={{ color: '#34d399' }}>{mockAiResponse.scholarshipTarget.matchPercentage}% COMPLETE</span>
                      </div>
                      <div className={styles.readinessBarBg}>
                        <div className={styles.readinessBarFill} style={{ width: `${mockAiResponse.scholarshipTarget.matchPercentage}%` }} />
                      </div>
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
                          className={`${styles.questItem} ${bounty.done ? styles.questItemDone : ''}`}
                          onClick={() => toggleBounty(bounty.id)}
                        >
                          <div className={styles.questIcon}>
                            {bounty.done ? '✅' : '❔'}
                          </div>
                          <div className={styles.questInfo}>
                            <span className={`${styles.questTitle} ${bounty.done ? styles.questTitleDone : ''}`}>
                              {bounty.task}
                            </span>
                            <span className={styles.questDesc}>{bounty.desc}</span>
                          </div>
                          <span className={styles.questReward} style={bounty.done ? { background: '#047857', borderColor: '#064e3b', color: '#fff' } : {}}>
                            {bounty.done ? 'LULUS' : bounty.reward}
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
                            <span className={styles.lbName}>{lb.name}</span>
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
          )}

          {activeNav === 'Learning Progress' && <LearningProgress />}
          {activeNav === 'University Hub' && <UniversityHub />}
          {activeNav === 'Scholarship Hub' && <ScholarshipHub />}
        </div>
      </main>
    </div>
  );
}
