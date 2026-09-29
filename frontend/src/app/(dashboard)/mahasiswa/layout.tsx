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

const NAV_KEYS = [
  { href: '/mahasiswa/dashboard', labelKey: 'nav.mahasiswa.dashboard', icon: '📊' },
  { href: '/mahasiswa/learning-mission', labelKey: 'nav.mahasiswa.learningMission', icon: '🎯' },
  { href: '/mahasiswa/career-hub', labelKey: 'nav.mahasiswa.careerHub', icon: '💼' },
  { href: '/mahasiswa/leaderboard', labelKey: 'nav.mahasiswa.skillBadges', icon: '🏆' },
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
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { logout, user } = usePrivy();
  const { wallets } = useWallets();
  const activeWallet = wallets[0];
  const { setRole: setMapRole } = useMapStore();
  const { displayName: savedName, displayEmail: savedEmail, avatarUrl } = useUserStore();

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
        const data = await res.json() as { role?: { name?: string } | null };
        if (cancelled) return;
        const roleName = data?.role?.name?.toUpperCase();
        if (!roleName) {
          router.replace('/select-role');
        } else if (roleName === 'CHASER') {
          setOnboardingRole('mahasiswa', user.id);
          setIsCheckingAuth(false);
        } else if (roleName === 'DREAMER') {
          setOnboardingRole('sma', user.id);
          router.replace('/sma/dashboard');
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
        } else if (selectedRole !== 'mahasiswa') {
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
    } catch (e) { }
  };

  const isFullScreenPage = pathname.startsWith('/mahasiswa/learning-mission/') && pathname !== '/mahasiswa/learning-mission';

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
            <Image src="/PathTrick.png" alt="PathTrick" width={180} height={40} className={styles.logoImg} priority />
          </div>
          <span className={styles.roleBadge}>{t('nav.mahasiswa.roleBadge')}</span>
        </div>

        <nav className={styles.nav}>
          {NAV_KEYS.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/mahasiswa/dashboard');

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
                onClick={() => { setIsMessagesOpen(!isMessagesOpen); setIsNotificationsOpen(false); setIsDropdownOpen(false); }}
                onMouseEnter={playHoverSound}
              >
                <img src="/inboxLogo.png" alt="Inbox" style={{ width: '32px', height: '32px', objectFit: 'contain', imageRendering: 'pixelated' }} />
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
                    <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.6rem', color: '#3b261b' }}>{t('common.inbox')}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ background: '#a87b51', padding: '8px', border: '2px solid #5a3a29', borderRadius: '8px' }}>
                      <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.45rem', color: '#3b261b', marginBottom: '4px' }}>{t('common.aiRecruiter')}</p>
                      <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.45rem', color: '#fff', lineHeight: '1.4' }}>{t('common.aiRecruiterMsg')}</p>
                    </div>
                    <div style={{ background: '#a87b51', padding: '8px', border: '2px solid #5a3a29', borderRadius: '8px' }}>
                      <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.45rem', color: '#3b261b', marginBottom: '4px' }}>{t('common.pathTrickSys')}</p>
                      <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.45rem', color: '#fff', lineHeight: '1.4' }}>{t('common.sqlBadgeMinted')}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div style={{ position: 'relative' }}>
              <div
                className={styles.iconBtn}
                onClick={() => { setIsNotificationsOpen(!isNotificationsOpen); setIsMessagesOpen(false); setIsDropdownOpen(false); }}
                onMouseEnter={playHoverSound}
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
                    <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.6rem', color: '#3b261b' }}>{t('common.alerts')}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ background: '#3b261b', padding: '10px', border: '2px solid #5a3a29', borderRadius: '8px' }}>
                      <p style={{ fontSize: '0.55rem', color: '#fbbf24', lineHeight: '1.4', fontFamily: '"Press Start 2P"' }}>{t('common.levelUp')}</p>
                      <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.4rem', color: '#d1d5db', marginTop: '6px' }}>{t('common.reachedLevel2')}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div style={{ position: 'relative' }}>
              <div
                className={styles.profileChip}
                onClick={() => { setIsDropdownOpen(!isDropdownOpen); setIsMessagesOpen(false); setIsNotificationsOpen(false); }}
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
