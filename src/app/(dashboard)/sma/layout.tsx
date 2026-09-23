'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import Image from 'next/image';
import styles from './layout.module.css';
import DailyMantra from '@/components/ui/DailyMantra';
import { useUserStore } from '@/store/useUserStore';

type NavItem = { href: string; label: string; icon: string; badge?: string };

const NAV_ITEMS: NavItem[] = [
  { href: '/sma/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/sma/learning-progress', label: 'Learning Progress', icon: '🎯' },
  { href: '/sma/university-hub', label: 'University Hub', icon: '🎓' },
  { href: '/sma/scholarship-hub', label: 'Scholarship Hub', icon: '📜' },
  { href: '/sma/certificate', label: 'Relics & Treasures', icon: '🏅' },
];

export default function SMALayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { logout, user } = usePrivy();
  const { wallets } = useWallets();
  const activeWallet = wallets[0];
  const { displayName: savedName, displayEmail: savedEmail } = useUserStore();

  // Priority: 1. User-edited (Zustand), 2. Auto from Privy (Google/Email), 3. Wallet address fallback
  const displayName = savedName
    || user?.google?.name 
    || user?.email?.address?.split('@')[0] 
    || (activeWallet ? `${activeWallet.address.slice(0, 6)}...${activeWallet.address.slice(-4)}` : 'Explorer');
  
  const displayEmail = user?.google?.email 
    || user?.email?.address 
    || savedEmail
    || (activeWallet ? activeWallet.address : '');

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const isMissionPage = pathname.startsWith('/sma/learning-progress/') && pathname !== '/sma/learning-progress';

  if (isMissionPage) {
    return (
      <div className={styles.layout} style={{ display: 'block', padding: '24px', overflowY: 'auto' }}>
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
          <span className={styles.roleBadge}>The Dreamer</span>
        </div>

        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/sma/dashboard' && item.href !== '/sma');

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

        {/* ─── DAILY MANTRA ─── */}
        <DailyMantra />

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
                      <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.45rem', color: '#3b261b', marginBottom: '4px' }}>AI Career Coach</p>
                      <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.45rem', color: '#fff', lineHeight: '1.4' }}>Your personal roadmap is ready! Let's explore.</p>
                    </div>
                    <div style={{ background: '#a87b51', padding: '8px', border: '2px solid #5a3a29', borderRadius: '8px' }}>
                      <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.45rem', color: '#3b261b', marginBottom: '4px' }}>PathTrick Sys</p>
                      <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.45rem', color: '#fff', lineHeight: '1.4' }}>A new scholarship matching your profile was found.</p>
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
                      <p style={{ fontSize: '0.55rem', color: '#fbbf24', lineHeight: '1.4', fontFamily: '"Press Start 2P"' }}>Naik Kelas!</p>
                      <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.4rem', color: '#d1d5db', marginTop: '6px' }}>Kamu sekarang Level 2.</p>
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
                <div className={styles.profileAvatar}>👨‍🎓</div>
                <div className={styles.profileInfo}>
                  <span className={styles.profileName}>{displayName}</span>
                  <span className={styles.profileEmail}>{displayEmail}</span>
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
                  <div style={{ padding: '12px', borderBottom: '2px dashed #5a3a29' }}>
                    <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.45rem', color: '#fbbf24', marginBottom: '8px' }}>Web3 Wallet Address:</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <p style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: '#d1d5db', wordBreak: 'break-all', background: '#3b261b', padding: '8px', borderRadius: '4px', border: '1px solid #5a3a29', flex: 1, margin: 0 }}>
                        {activeWallet ? activeWallet.address : 'Auto-created on Mint'}
                      </p>
                      {activeWallet && (
                        <button 
                          onClick={() => navigator.clipboard.writeText(activeWallet.address)}
                          style={{ background: '#5cb85c', border: '2px solid #224a22', color: '#fff', padding: '6px', cursor: 'pointer', borderRadius: '4px' }}
                          title="Copy Address"
                        >
                          📋
                        </button>
                      )}
                    </div>
                  </div>
                  <button onClick={() => router.push('/profile')} style={{ background: 'none', border: 'none', textAlign: 'left', padding: '12px', fontFamily: '"Press Start 2P"', fontSize: '0.6rem', color: '#3b261b', cursor: 'pointer' }}>Edit Profile</button>
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
