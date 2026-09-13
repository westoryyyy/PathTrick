'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import Image from 'next/image';
import styles from './layout.module.css';

const NAV_ITEMS = [
  { href: '/dashboard/sma', label: 'Dashboard', icon: '📊' },
  { href: '/sma/learning', label: 'Learning Progress', icon: '🎯' },
  { href: '/sma/university', label: 'University Hub', icon: '🎓' },
  { href: '/sma/scholarships', label: 'Scholarship Hub', icon: '📜' },
  { href: '/sma/analytics', label: 'Analytics', icon: '📈' },
];

export default function SMALayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

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
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard/sma' && item.href !== '/sma');

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
                {item.badge && (
                  <span className={`${styles.navBadge} ${item.badge === 'Peta' ? styles.navBadgeBlue : ''}`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>



        <button 
          onClick={() => router.push('/')}
          className={styles.logoutBtn}
        >
          🚪 LOG OUT
        </button>
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

            <div className={styles.profileChip}>
              <div className={styles.profileAvatar}>👨‍🎓</div>
              <div className={styles.profileInfo}>
                <span className={styles.profileName}>Tukiman</span>
                <span className={styles.profileEmail}>D.Tukiman@gmail.com</span>
              </div>
              <div style={{ marginLeft: '12px', background: '#3b261b', padding: '4px 8px', borderRadius: '4px', border: '2px solid #5a3a29' }}>
                <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.4rem', color: '#fbbf24' }}>🟣 0x8a..3F</span>
              </div>
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
