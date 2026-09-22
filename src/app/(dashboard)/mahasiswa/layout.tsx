'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import Image from 'next/image';
import { useMapStore } from '@/store/useMapStore';
import styles from './layout.module.css';
import DailyMantra from '@/components/ui/DailyMantra';

const NAV_ITEMS = [
  { href: '/mahasiswa/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/mahasiswa/learning-mission', label: 'Learning Mission', icon: '🎯' },
  { href: '/mahasiswa/career-hub', label: 'Career Hub', icon: '💼' },
  { href: '/mahasiswa/leaderboard', label: 'Skill Badges', icon: '🏆' },
];

export default function MahasiswaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { logout, connectWallet } = usePrivy();
  const { setRole } = useMapStore();

  React.useEffect(() => {
    setRole('MAHASISWA');
  }, [setRole]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const isFullScreenPage = pathname.startsWith('/mahasiswa/learning-mission/') && pathname !== '/mahasiswa/learning-mission';

  if (isFullScreenPage) {
    return (
      <div className={styles.layout} style={{ display: 'block', overflowY: 'auto' }}>
        {children}
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      
      {/* ─── LEFT SIDEBAR (RETRO PIXEL) ─── */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <Image src="/PathTrick.png" alt="PathTrick" width={180} height={40} className={styles.logoImg} priority />
          </div>
          <span className={styles.roleBadge}>The Scholar</span>
        </div>

        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/mahasiswa/dashboard');

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
              >
                <div className={styles.navIconTitle}>
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* ─── DAILY MANTRA ─── */}
        <DailyMantra />

        <div style={{ marginTop: 'auto' }}>
          {/* Top profile dropdown equivalent, but inside sidebar is fine, or we use header. Let's keep it in header */}
        </div>
      </aside>

      {/* ─── MAIN CONTENT AREA ─── */}
      <main className={styles.mainArea}>
        
        {/* Top Bar Header */}
        <header className={styles.header}>
          
          <div className={styles.searchBar}>
            <span className={styles.searchTitle}>CATEGORIES</span>
            <input
              type="text"
              placeholder="Search..."
              className={styles.searchInput}
            />
          </div>

          <div className={styles.headerActions}>
            <div style={{ position: 'relative' }}>
              <div 
                className={styles.iconBtn} 
                onClick={() => { setIsMessagesOpen(!isMessagesOpen); setIsNotificationsOpen(false); setIsDropdownOpen(false); }}
              >
                ✉️
                <span className={styles.iconBadge}>2</span>
              </div>
              
              {isMessagesOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '12px',
                  background: '#bc8f65',
                  border: '4px solid #5a3a29',
                  borderRadius: '16px',
                  boxShadow: 'inset -2px -2px 0 rgba(0,0,0,0.3), 4px 4px 0 rgba(0,0,0,0.8)',
                  display: 'flex',
                  flexDirection: 'column',
                  width: '280px',
                  zIndex: 100,
                  padding: '12px'
                }}>
                  <div style={{ borderBottom: '2px dashed #5a3a29', paddingBottom: '8px', marginBottom: '8px' }}>
                    <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.6rem', color: '#3b261b' }}>INBOX</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ background: '#a87b51', padding: '8px', border: '2px solid #5a3a29', borderRadius: '8px' }}>
                      <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.45rem', color: '#3b261b', marginBottom: '4px' }}>AI Recruiter</p>
                      <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.45rem', color: '#fff', lineHeight: '1.4' }}>I found 5 new jobs matching your skills!</p>
                    </div>
                    <div style={{ background: '#a87b51', padding: '8px', border: '2px solid #5a3a29', borderRadius: '8px' }}>
                      <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.45rem', color: '#3b261b', marginBottom: '4px' }}>PathTrick Sys</p>
                      <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.45rem', color: '#fff', lineHeight: '1.4' }}>Your SQL badge has been minted on-chain.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div style={{ position: 'relative' }}>
              <div 
                className={styles.iconBtn} 
                onClick={() => { setIsNotificationsOpen(!isNotificationsOpen); setIsMessagesOpen(false); setIsDropdownOpen(false); }}
              >
                🔔
                <span className={styles.iconBadge}>1</span>
              </div>
              
              {isNotificationsOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '12px',
                  background: '#bc8f65',
                  border: '4px solid #5a3a29',
                  borderRadius: '16px',
                  boxShadow: 'inset -2px -2px 0 rgba(0,0,0,0.3), 4px 4px 0 rgba(0,0,0,0.8)',
                  display: 'flex',
                  flexDirection: 'column',
                  width: '280px',
                  zIndex: 100,
                  padding: '12px'
                }}>
                  <div style={{ borderBottom: '2px dashed #5a3a29', paddingBottom: '8px', marginBottom: '8px' }}>
                    <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.6rem', color: '#3b261b' }}>ALERTS</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ background: '#3b261b', padding: '10px', border: '2px solid #5a3a29', borderRadius: '8px' }}>
                      <p style={{ fontSize: '0.55rem', color: '#fbbf24', lineHeight: '1.4', fontFamily: '"Press Start 2P"' }}>Level Up!</p>
                      <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.4rem', color: '#d1d5db', marginTop: '6px' }}>You reached Level 2.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div style={{ position: 'relative' }}>
              <div 
                className={styles.profileChip} 
                onClick={() => { setIsDropdownOpen(!isDropdownOpen); setIsMessagesOpen(false); setIsNotificationsOpen(false); }} 
                style={{ cursor: 'pointer' }}
              >
                <div className={styles.profileAvatar}>👨‍💻</div>
                <div className={styles.profileInfo}>
                  <span className={styles.profileName}>Tukiman</span>
                  <span className={styles.profileEmail}>D.Tukiman@gmail.com</span>
                </div>
                <div style={{ marginLeft: '12px', background: '#3b261b', padding: '4px 8px', borderRadius: '4px', border: '2px solid #5a3a29' }}>
                  <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.4rem', color: '#fbbf24' }}>▼</span>
                </div>
              </div>

              {isDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '12px',
                  background: '#bc8f65',
                  border: '4px solid #5a3a29',
                  borderRadius: '16px',
                  boxShadow: 'inset -2px -2px 0 rgba(0,0,0,0.3), 4px 4px 0 rgba(0,0,0,0.8)',
                  display: 'flex',
                  flexDirection: 'column',
                  minWidth: '200px',
                  zIndex: 100,
                  overflow: 'hidden',
                  padding: '8px'
                }}>
                  <button onClick={() => router.push('/profile')} style={{ background: 'none', border: 'none', textAlign: 'left', padding: '12px', fontFamily: '"Press Start 2P"', fontSize: '0.6rem', color: '#3b261b', cursor: 'pointer' }}>Edit Profile</button>
                  <button onClick={() => connectWallet()} style={{ background: 'none', border: 'none', textAlign: 'left', padding: '12px', fontFamily: '"Press Start 2P"', fontSize: '0.6rem', color: '#3b261b', cursor: 'pointer' }}>Connect Wallet</button>
                  <button onClick={() => router.push('/docs')} style={{ background: 'none', border: 'none', textAlign: 'left', padding: '12px', fontFamily: '"Press Start 2P"', fontSize: '0.6rem', color: '#3b261b', cursor: 'pointer' }}>Docs</button>
                  <button onClick={handleLogout} style={{ background: 'none', border: 'none', textAlign: 'left', padding: '12px', fontFamily: '"Press Start 2P"', fontSize: '0.6rem', color: '#b91c1c', cursor: 'pointer', borderTop: '2px dashed #5a3a29' }}>🚪 LOG OUT</button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className={styles.content}>
          {children}
        </div>
      </main>
    </div>
  );
}
