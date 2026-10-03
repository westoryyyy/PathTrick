'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import Image from 'next/image';
import { useMapStore } from '@/store/useMapStore';
import styles from './layout.module.css';
import DailyMantra from '@/components/ui/DailyMantra';
import { useUserStore } from '@/store/useUserStore';
import { useOnboardingStore } from '@/store/useOnboardingStore';
import PixelIcon from '@/components/ui/PixelIcon';
import BGMPlayer from '@/components/ui/BGMPlayer';
import { clearAuthToken, getAuthHeaders } from '@/hooks/useAuthSync';
import LanguageToggle from '@/components/ui/LanguageToggle';
import { useTranslation } from '@/hooks/useTranslation';
import { API_BASE_URL } from '@/config/pathtrick';
import WalletPanel from '@/components/ui/WalletPanel';

const NAV_KEYS = [
  { href: '/chaser/dashboard', labelKey: 'nav.mahasiswa.dashboard', icon: '📊' },
  { href: '/chaser/learning-mission', labelKey: 'nav.mahasiswa.learningMission', icon: '🎯' },
  { href: '/chaser/career-hub', labelKey: 'nav.mahasiswa.careerHub', icon: '💼' },
  { href: '/chaser/leaderboard', labelKey: 'nav.mahasiswa.skillBadges', icon: '🏆' },
];

export default function MahasiswaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isWalletAnimating, setIsWalletAnimating] = useState(false);
  const { logout, user } = usePrivy();
  const { wallets } = useWallets();
  const activeWallet = wallets[0];
  const { setRole: setMapRole } = useMapStore();
  const { displayName: savedName, displayEmail: savedEmail, avatarUrl } = useUserStore();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const { getAuthHeaders } = await import('@/hooks/useAuthSync');
      const { API_BASE_URL } = await import('@/config/pathtrick');
      const res = await fetch(`${API_BASE_URL}/api/notifications`, { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (_) {}
  };

  useEffect(() => {
    if (user) {
      setTimeout(() => fetchNotifications(), 0);
    }
  }, [user]);

  const handleMarkAllRead = async () => {
    try {
      const { getAuthHeaders } = await import('@/hooks/useAuthSync');
      const { API_BASE_URL } = await import('@/config/pathtrick');
      await fetch(`${API_BASE_URL}/api/notifications/read-all`, { method: 'POST', headers: getAuthHeaders() });
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (_) {}
  };

  // Priority: 1. User-edited (Zustand), 2. Auto from Privy (Google/Email), 3. Wallet address fallback
  const displayName = savedName
    || user?.google?.name
    || user?.email?.address?.split('@')[0]
    || (activeWallet ? `${activeWallet.address.slice(0, 6)}...${activeWallet.address.slice(-4)}` : 'Explorer');

  const displayEmail = user?.google?.email
    || user?.email?.address
    || savedEmail
    || (activeWallet ? `${activeWallet.address.slice(0, 6)}...${activeWallet.address.slice(-4)}` : '');

  React.useEffect(() => {
    setMapRole('MAHASISWA');
  }, [setMapRole]);

  const handleLogout = async () => {
    clearAuthToken();
    await logout();
    router.push('/');
  };

  // ── Route Guard: verifikasi role dari BACKEND ──
  // Zustand memberikan render cepat; backend adalah sumber kebenaran akhir.
  const { selectedRole, savedPrivyUserId, setRole: setOnboardingRole } = useOnboardingStore();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    if (!user) return;
    const token = getAuthHeaders()['Authorization'];
    if (!token) {
      setIsCheckingAuth(false);
      return;
    }
    let cancelled = false;
    fetch(`${API_BASE_URL}/api/users/me`, { headers: getAuthHeaders() })
      .then(async (res) => {
        if (cancelled) return;
        if (!res.ok) { router.replace('/'); return; }
        const data = await res.json() as any;
        if (cancelled) return;
        
        if (data.gamification) {
          const calculatedLevel = Math.max(1, Math.floor(data.gamification.xp / 1000) + 1);
          useUserStore.getState().hydrateUser(data.gamification.xp, calculatedLevel, data.name || '', data.email || '');
        }
        
        const roleName = data?.role?.name?.toUpperCase();
        if (!roleName) {
          router.replace('/select-role');
        } else if (roleName === 'CHASER') {
          setOnboardingRole('chaser', user.id);
          setIsCheckingAuth(false);
        } else if (roleName === 'DREAMER') {
          setOnboardingRole('dreamer', user.id);
          router.replace('/dreamer/dashboard');
        } else if (roleName === 'ADMIN') {
          router.replace('/admin/dashboard');
        } else {
          router.replace('/select-role');
        }
      })
      .catch(() => {
        if (cancelled) return;
        if (!selectedRole || savedPrivyUserId !== user.id) {
          router.replace('/select-role');
        } else if (selectedRole !== 'chaser') {
          router.replace(`/${selectedRole}/dashboard`);
        } else {
          setIsCheckingAuth(false);
        }
      });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const playHoverSound = () => {
    try {
      const audio = new Audio('/HoverTombol.ogg');
      audio.volume = 0.3;
      audio.play().catch(() => { });
    } catch (_) { }
  };

  const isFullScreenPage = pathname.startsWith('/chaser/learning-mission/') && pathname !== '/chaser/learning-mission';

  // Don't render the dashboard while backend role check is in progress.
  if (isCheckingAuth) return null;

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
            <Link href="/" onMouseEnter={playHoverSound} onClick={() => sessionStorage.setItem('pt_stay_on_landing', '1')}>
              <Image src="/PathTrick.png" alt="PathTrick" width={180} height={40} className={styles.logoImg} priority />
            </Link>
          </div>
          <span className={styles.roleBadge}>{t('nav.mahasiswa.roleBadge')}</span>
        </div>

        <nav className={styles.nav}>
          {NAV_KEYS.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/chaser/dashboard');

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                onMouseEnter={playHoverSound}
              >
                <div className={styles.navIconTitle}>
                  <PixelIcon icon={item.icon} size={22} />
                  <span>{t(item.labelKey)}</span>
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <BGMPlayer />
            <LanguageToggle />
          </div>

          <div className={styles.headerActions}>
            <div style={{ position: 'relative' }}>
              <div 
                className={styles.iconBtn} 
                onClick={() => { 
                  if (!isNotificationsOpen) {
                    handleMarkAllRead();
                  }
                  setIsNotificationsOpen(!isNotificationsOpen); 
                  setIsDropdownOpen(false); 
                  setIsWalletOpen(false);
                }}
                onMouseEnter={playHoverSound}
              >
                🔔
                {unreadCount > 0 && <span className={styles.iconBadge}>{unreadCount}</span>}
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
                  maxHeight: '400px',
                  overflowY: 'auto',
                  zIndex: 100,
                  padding: '12px'
                }}>
                  <div style={{ borderBottom: '2px dashed #5a3a29', paddingBottom: '8px', marginBottom: '8px' }}>
                    <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.6rem', color: '#3b261b' }}>{t('common.alerts')}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {notifications.length === 0 ? (
                      <div style={{ background: '#3b261b', padding: '10px', border: '2px solid #5a3a29', borderRadius: '8px' }}>
                        <p style={{ fontSize: '0.55rem', color: '#fbbf24', lineHeight: '1.4', fontFamily: '"Press Start 2P"' }}>{t('common.noNewNotifications')}</p>
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} style={{ background: '#3b261b', padding: '10px', border: '2px solid #5a3a29', borderRadius: '8px', opacity: n.isRead ? 0.7 : 1 }}>
                          <p style={{ fontSize: '0.55rem', color: '#fbbf24', lineHeight: '1.4', fontFamily: '"Press Start 2P"' }}>{n.title}</p>
                          <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.4rem', color: '#d1d5db', marginTop: '6px' }}>{n.body}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ─── WALLET BUTTON ─── */}
            <div style={{ position: 'relative' }}>
              <div
                className={`${styles.iconBtn} group`}
                onClick={() => {
                  setIsDropdownOpen(false);
                  setIsNotificationsOpen(false);
                  setIsWalletAnimating(true);
                  setTimeout(() => {
                    setIsWalletOpen(prev => !prev);
                    setIsWalletAnimating(false);
                  }, 150);
                }}
                onMouseEnter={playHoverSound}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px', position: 'relative' }}
              >
                <Image
                  src={isWalletAnimating ? (isWalletOpen ? '/Wallet.png' : '/Open Wallet.png') : (isWalletOpen ? '/Open Wallet.png' : '/Wallet.png')}
                  alt={isWalletOpen ? 'Open Wallet' : 'Wallet'}
                  width={28}
                  height={28}
                  style={{
                    imageRendering: 'pixelated',
                    transform: isWalletAnimating ? 'scale(0.6) rotate(-15deg)' : 'scale(1) rotate(0deg)',
                    transition: 'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.15s ease',
                    opacity: isWalletAnimating ? 0 : 1,
                  }}
                />

                {/* Custom RPG Tooltip */}
                <div className="absolute z-[150] top-[calc(100%+12px)] left-1/2 -translate-x-1/2 w-max px-3 py-2 bg-[#3b2416] border-2 border-[#6a4734] shadow-[0_4px_12px_rgba(0,0,0,0.5)] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200">
                  <p className="font-pixel text-[0.45rem] leading-[1.6] text-[#fdf6e3] m-0 text-center drop-shadow-[1px_1px_0_#1a100a]">
                    {isWalletOpen ? 'Tutup Wallet' : 'Buka Wallet'}
                  </p>
                  <div className="absolute -top-[7px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[6px] border-l-transparent border-r-transparent border-b-[#6a4734]"></div>
                </div>
              </div>

              {isWalletOpen && (
                <WalletPanel
                  walletAddress={activeWallet?.address}
                  onClose={() => setIsWalletOpen(false)}
                />
              )}
            </div>

            <div style={{ position: 'relative' }}>
              <div
                className={styles.profileChip}
                onClick={() => { setIsDropdownOpen(!isDropdownOpen); setIsNotificationsOpen(false); setIsWalletOpen(false); }}
                onMouseEnter={playHoverSound}
                style={{ cursor: 'pointer' }}
              >
                <div className={styles.profileAvatar}>
                  <Image src={avatarUrl} alt="Profile avatar" width={44} height={44} />
                </div>
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
                    <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.45rem', color: '#fbbf24', marginBottom: '8px' }}>{t('common.walletAddress')}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <p style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: '#d1d5db', wordBreak: 'break-all', background: '#3b261b', padding: '8px', borderRadius: '4px', border: '1px solid #5a3a29', flex: 1, margin: 0 }}>
                        {activeWallet ? activeWallet.address : t('common.autoCreatedOnMint')}
                      </p>
                      {activeWallet && (
                        <button
                          onClick={() => navigator.clipboard.writeText(activeWallet.address)}
                          style={{ background: '#5cb85c', border: '2px solid #224a22', color: '#fff', padding: '6px', cursor: 'pointer', borderRadius: '4px' }}
                          title={t('common.copyAddress')}
                        >
                          📋
                        </button>
                      )}
                    </div>
                  </div>
                  <button onMouseEnter={playHoverSound} onClick={() => router.push('/profile')} style={{ background: 'none', border: 'none', textAlign: 'left', padding: '12px', fontFamily: '"Press Start 2P"', fontSize: '0.6rem', color: '#3b261b', cursor: 'pointer' }}>{t('common.editProfile')}</button>
                  <button onMouseEnter={playHoverSound} onClick={() => router.push('/docs')} style={{ background: 'none', border: 'none', textAlign: 'left', padding: '12px', fontFamily: '"Press Start 2P"', fontSize: '0.6rem', color: '#3b261b', cursor: 'pointer' }}>{t('common.docs')}</button>
                  <button onMouseEnter={playHoverSound} onClick={handleLogout} style={{ background: 'none', border: 'none', textAlign: 'left', padding: '12px', fontFamily: '"Press Start 2P"', fontSize: '0.6rem', color: '#b91c1c', cursor: 'pointer', borderTop: '2px dashed #5a3a29', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}><span>{t('common.logout')}</span> <Image src="/exit icon.png" alt="Logout" width={20} height={20} style={{ imageRendering: 'pixelated' }} /></button>
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
