'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Image from 'next/image';
import styles from './layout.module.css';

const NAV_ITEMS = [
  { href: '/mahasiswa', label: 'Dashboard', icon: '📊' },
  { href: '/mahasiswa/learning', label: 'Learning Mission', icon: '🎯' },
  { href: '/mahasiswa/career-hub', label: 'Career Hub', icon: '💼' },
  { href: '/mahasiswa/leaderboard', label: 'Leaderboard', icon: '🏆' },
];

export default function MahasiswaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/mahasiswa');

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
            <div className={styles.iconBtn}>
              ✉️
              <span className={styles.iconBadge}>2</span>
            </div>
            <div className={styles.iconBtn}>
              🔔
              <span className={styles.iconBadge}>1</span>
            </div>

            <div style={{ position: 'relative' }}>
              <div className={styles.profileChip} onClick={() => setIsDropdownOpen(!isDropdownOpen)} style={{ cursor: 'pointer' }}>
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
                  marginTop: '8px',
                  background: '#bc8f65',
                  border: '2px solid #5a3a29',
                  boxShadow: '4px 4px 0 #3b261b',
                  display: 'flex',
                  flexDirection: 'column',
                  minWidth: '200px',
                  zIndex: 100,
                  padding: '8px'
                }}>
                  <button onClick={() => alert('Edit Profile')} style={{ background: 'none', border: 'none', textAlign: 'left', padding: '12px', fontFamily: '"Press Start 2P"', fontSize: '0.6rem', color: '#3b261b', cursor: 'pointer' }}>Edit Profile</button>
                  <button onClick={() => alert('Connect Wallet')} style={{ background: 'none', border: 'none', textAlign: 'left', padding: '12px', fontFamily: '"Press Start 2P"', fontSize: '0.6rem', color: '#3b261b', cursor: 'pointer' }}>Connect Wallet</button>
                  <button onClick={() => alert('Toggle Theme')} style={{ background: 'none', border: 'none', textAlign: 'left', padding: '12px', fontFamily: '"Press Start 2P"', fontSize: '0.6rem', color: '#3b261b', cursor: 'pointer' }}>Toggle Theme</button>
                  <button onClick={() => alert('Docs')} style={{ background: 'none', border: 'none', textAlign: 'left', padding: '12px', fontFamily: '"Press Start 2P"', fontSize: '0.6rem', color: '#3b261b', cursor: 'pointer' }}>Docs</button>
                  <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', textAlign: 'left', padding: '12px', fontFamily: '"Press Start 2P"', fontSize: '0.6rem', color: '#b91c1c', cursor: 'pointer', borderTop: '2px dashed #5a3a29' }}>🚪 LOG OUT</button>
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
