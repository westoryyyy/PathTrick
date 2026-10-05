'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import Image from 'next/image';
import styles from './layout.module.css';
import { clearAuthToken, getAuthHeaders } from '@/hooks/useAuthSync';
import { API_BASE_URL } from '@/config/pathtrick';

const px: React.CSSProperties = { fontFamily: '"Pixelify Sans", sans-serif' };

const NAV_ITEMS = [
  {
    section: 'OVERVIEW',
    items: [
      { href: '/admin/dashboard', label: 'Dashboard', img: '/Map.png' },
      { href: '/admin/users', label: 'Users', img: '/NPC University Student.png' },
    ],
  },
  {
    section: 'KONTEN',
    items: [
      { href: '/admin/courses', label: 'Courses', img: '/Journall.png' },
      { href: '/admin/chaser-skills', label: 'Chaser Skills', img: '/Blade.png' },
    ],
  },
  {
    section: 'REKOMENDASI',
    items: [
      { href: '/admin/universities', label: 'Universitas', img: '/Compass.png' },
      { href: '/admin/scholarships', label: 'Beasiswa', img: '/Gold Ticket.png' },
      { href: '/admin/jobs', label: 'Lowongan Kerja', img: '/Blade.png' },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user, authenticated, ready } = usePrivy();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [roleChecked, setRoleChecked] = useState(false);
  const bgmRef = useRef<HTMLAudioElement | null>(null);

  const displayName = user?.google?.name || user?.email?.address?.split('@')[0] || 'Admin';

  // Backend role gate: only ADMIN may access this layout
  useEffect(() => {
    if (!ready) return;
    if (!authenticated) {
      router.replace('/');
      return;
    }
    fetch(`${API_BASE_URL}/api/users/me`, { headers: getAuthHeaders() })
      .then(r => r.json())
      .then((data: any) => {
        if (data?.role?.name !== 'ADMIN') {
          router.replace('/');
        } else {
          setRoleChecked(true);
        }
      })
      .catch(() => router.replace('/'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated, ready]);

  useEffect(() => {
    // Play BGM when dashboard mounts
    const audio = new Audio('/sound dashboard admin.mp3');
    audio.loop = true;
    audio.volume = 0.4; // Slightly lower volume so it's not overpowering

    // Autoplay policy might block this if no user interaction has occurred
    // We catch the error silently so it doesn't break the app
    audio.play().catch(() => {
      // If blocked, wait for user interaction
      const playOnInteract = () => {
        audio.play().catch(() => { });
        window.removeEventListener('click', playOnInteract);
      };
      window.addEventListener('click', playOnInteract);
    });

    bgmRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  const toggleMute = () => {
    if (bgmRef.current) {
      bgmRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleLogout = async () => {
    clearAuthToken();
    await logout();
    router.push('/');
  };

  const playHoverSound = () => {
    try {
      const audio = new Audio('/HoverTombol.ogg');
      audio.volume = 0.3;
      audio.play().catch(() => { });
    } catch (e) { }
  };

  const currentItem = NAV_ITEMS.flatMap(s => s.items).find(
    item => pathname === item.href || pathname.startsWith(item.href + '/')
  );
  const pageTitle = currentItem?.label ?? 'Admin Panel';

  if (!roleChecked) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#1a0d05', color: '#fbbf24', fontFamily: '"Pixelify Sans", sans-serif', fontSize: '1.2rem' }}>
        Memverifikasi akses...
      </div>
    );
  }

  return (
    <div className={styles.layout}>

      {/* ─── LEFT SIDEBAR ─── */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <Link href="/">
              <Image src="/PathTrick.png" alt="PathTrick" width={160} height={36} className={styles.logoImg} priority />
            </Link>
          </div>
          <div className={styles.roleBadge}>
            <Image src="/Shield.png" alt="" width={14} height={14} style={{ imageRendering: 'pixelated' }} />
            <span>ADMIN PANEL</span>
          </div>
        </div>

        <nav className={styles.nav}>
          {NAV_ITEMS.map((group) => (
            <React.Fragment key={group.section}>
              <span className={styles.navSection}>{group.section}</span>
              {group.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                    onMouseEnter={playHoverSound}
                  >
                    <Image src={item.img} alt="" width={18} height={18} style={{ imageRendering: 'pixelated', flexShrink: 0, height: 18 }} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </React.Fragment>
          ))}
        </nav>

        <button className={styles.logoutBtn} onClick={handleLogout} onMouseEnter={playHoverSound}>
          <Image src="/Keyhole.png" alt="" width={14} height={14} style={{ imageRendering: 'pixelated' }} />
          LOG OUT
        </button>
      </aside>

      {/* ─── MAIN CONTENT AREA ─── */}
      <main className={styles.mainArea}>

        {/* Top Header */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.headerTitle}>{pageTitle.toUpperCase()}</span>
          </div>

          <div className={styles.headerActions}>
            {/* Mute/Unmute BGM Toggle */}
            <button
              onClick={toggleMute}
              onMouseEnter={playHoverSound}
              style={{
                background: '#4a2410', border: '2px solid #5a3a29', color: '#fbbf24',
                width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)', fontSize: '1.2rem'
              }}
              title={isMuted ? "Unmute Music" : "Mute Music"}
            >
              {isMuted ? '🔇' : '🔊'}
            </button>

            <div style={{ position: 'relative' }}>
              <div
                className={styles.profileChip}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                onMouseEnter={playHoverSound}
              >
                <div className={styles.profileAvatar}>
                  <Image src="/NPC Admin.png" alt="Admin" width={32} height={32} style={{ imageRendering: 'pixelated' }} />
                </div>
                <div className={styles.profileInfo}>
                  <span className={styles.profileName}>{displayName}</span>
                  <span className={styles.profileRole}>Administrator</span>
                </div>
                <div style={{ marginLeft: '8px', background: 'rgba(90,58,41,0.4)', padding: '4px 8px', border: '2px solid #5a3a29' }}>
                  <span style={{ ...px, fontSize: '0.9rem', color: '#fbbf24' }}>▼</span>
                </div>
              </div>

              {isDropdownOpen && (
                <div style={{
                  position: 'absolute', top: '100%', right: 0, marginTop: '10px',
                  background: '#3b261b', border: '4px solid #5a3a29',
                  boxShadow: 'inset -2px -2px 0 rgba(0,0,0,0.3), 4px 4px 0 rgba(0,0,0,0.8)',
                  display: 'flex', flexDirection: 'column', minWidth: '180px', zIndex: 100, padding: '8px',
                }}>
                  <button
                    onMouseEnter={playHoverSound}
                    onClick={handleLogout}
                    style={{ ...px, background: 'none', border: 'none', textAlign: 'left', padding: '12px', fontSize: '1rem', color: '#b45309', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <Image src="/Keyhole.png" alt="" width={14} height={14} style={{ imageRendering: 'pixelated' }} />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className={styles.content}>
          {children}
        </div>
      </main>
    </div>
  );
}
