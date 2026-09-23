'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useOnboardingStore, type UserRole } from '@/store/useOnboardingStore';
import { useUserStore } from '@/store/useUserStore';
import styles from './page.module.css';

const ROLES = [
  { id: 'sma',       role: 'The Dreamer', title: 'Siswa SMA',              img: '/NPC High School Student.png', color: '#a855f7', glow: 'rgba(168,85,247,0.5)', desc: 'Masih SMA & bingung mau kuliah apa? Temukan jurusan & karier sesuai bakatmu.',        perks: ['Asesmen Minat & Bakat', 'Tes RIASEC', 'Rekomendasi Jurusan', 'Info Beasiswa'],   tag: 'POPULER' },
  { id: 'mahasiswa', role: 'The Chaser',  title: 'Mahasiswa / Fresh Grad', img: '/NPC University Student.png',   color: '#f59e0b', glow: 'rgba(245,158,11,0.5)', desc: 'Mahasiswa atau baru lulus? Upload CV-mu dan biarkan AI membuatkan roadmap kariermu.', perks: ['Asesmen Karier AI', 'CV Analysis', 'Job Matching', 'Career Roadmap'],             tag: null      },
];

export default function SelectRolePage() {
  const router = useRouter();

  // Privy hooks — must come first as other hooks depend on `user`
  const { user, linkWallet } = usePrivy();
  const { wallets } = useWallets();
  const { displayName: savedName, setProfile } = useUserStore();

  // Store
  const setRole = useOnboardingStore((s) => s.setRole);
  const selectedRole = useOnboardingStore((s) => s.selectedRole);
  const savedPrivyUserId = useOnboardingStore((s) => s.savedPrivyUserId);
  const resetOnboarding = useOnboardingStore((s) => s.resetOnboarding);

  const [selected, setSelected] = useState<string | null>(null);
  const [entering, setEntering] = useState(false);

  const hasName = !!(savedName || user?.google?.name || user?.email?.address);
  const isWalletOnly = !user?.google && !user?.email && wallets.length > 0;
  const needsNicknameSetup = isWalletOnly && !hasName;
  const isGoogleLogin = !!user?.google;
  const needsWalletConnection = isGoogleLogin && wallets.length === 0;

  const [showGate, setShowGate] = useState(needsNicknameSetup);
  const [nickname, setNickname] = useState('');
  const [isSavingNickname, setIsSavingNickname] = useState(false);
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);

  // If user already has a role AND it belongs to the current user → go to their dashboard
  // If it's a different user → clear stale data and show role selection
  useEffect(() => {
    if (!user) return; // wait for Privy to load user
    const currentUserId = user.id;
    if (selectedRole && savedPrivyUserId === currentUserId) {
      router.replace(`/${selectedRole}/dashboard`);
    } else if (selectedRole && savedPrivyUserId !== currentUserId) {
      // Different user logged in — clear stale role data
      resetOnboarding();
    }
  }, [user, selectedRole, savedPrivyUserId, router, resetOnboarding]);

  const handleNicknameConfirm = () => {
    if (!nickname.trim()) return;
    setIsSavingNickname(true);
    setTimeout(() => {
      setProfile(nickname.trim(), wallets[0]?.address || '');
      setShowGate(false);
      setIsSavingNickname(false);
    }, 600);
  };

  const handleConnectWallet = async () => {
    try {
      setIsConnectingWallet(true);
      await linkWallet();
      setIsConnectingWallet(false);
    } catch (error) {
      console.error('Wallet connection error:', error);
      setIsConnectingWallet(false);
    }
  };

  const handleContinue = () => {
    if (!selected) return;
    // If Google login but no wallet, prompt to connect first
    if (isGoogleLogin && wallets.length === 0) {
      handleConnectWallet();
      return;
    }
    setEntering(true);
    setRole(selected as UserRole, user?.id);  // tie role to current Privy user ID
    setTimeout(() => router.push('/assessment'), 1200);
  };

  return (
    <div className={styles.page}>

      {showGate && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999,
          background: 'rgba(0,0,0,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(4px)',
        }}>
          <div style={{
            background: '#c8a96e',
            border: '6px solid #5a3520',
            borderRadius: '4px',
            padding: '6px',
            boxShadow: '6px 6px 0 #3b1f0e, inset 0 0 0 3px #e8c98a',
            maxWidth: '440px',
            width: '90%',
          }}>
            <div style={{
              background: '#784626',
              border: '3px solid #3b1f0e',
              borderRadius: '2px',
              padding: '32px 28px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px',
            }}>
              <div style={{ fontSize: '3.5rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>⚔️</div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.8rem', color: '#fbbf24', marginBottom: '8px', lineHeight: 1.6 }}>
                  CHOOSE YOUR
                </p>
                <p style={{ fontFamily: '"Press Start 2P"', fontSize: '1rem', color: '#fff', lineHeight: 1.6 }}>
                  ADVENTURER NAME
                </p>
              </div>
              <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.4rem', color: '#d4a96a', textAlign: 'center', lineHeight: 1.8 }}>
                Nama ini akan tertera di Sertifikat Web3 (SBT) kamu dan ditampilkan di seluruh platform PathTrick.
              </p>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleNicknameConfirm()}
                placeholder="Masukkan nickname..."
                maxLength={24}
                autoFocus
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  fontFamily: '"Press Start 2P"',
                  fontSize: '0.7rem',
                  background: '#3b1f0e',
                  border: '3px solid #e8c98a',
                  borderTopColor: '#5a3520',
                  borderLeftColor: '#5a3520',
                  color: '#fde68a',
                  outline: 'none',
                  textAlign: 'center',
                  letterSpacing: '0.05em',
                  boxSizing: 'border-box',
                }}
              />
              <button
                onClick={handleNicknameConfirm}
                disabled={!nickname.trim() || isSavingNickname}
                style={{
                  width: '100%',
                  padding: '16px',
                  fontFamily: '"Press Start 2P"',
                  fontSize: '0.7rem',
                  background: nickname.trim() ? '#DD1A21' : '#5a3520',
                  border: '4px solid',
                  borderColor: nickname.trim() ? '#7f0d10' : '#3b1f0e',
                  borderTopColor: nickname.trim() ? '#ff4d55' : '#784626',
                  borderLeftColor: nickname.trim() ? '#ff4d55' : '#784626',
                  color: nickname.trim() ? '#fff' : '#7a5c40',
                  cursor: nickname.trim() ? 'pointer' : 'not-allowed',
                  textShadow: nickname.trim() ? '1px 1px 0 rgba(0,0,0,0.5)' : 'none',
                  transition: 'all 0.2s',
                }}
                onMouseDown={(e) => { if (nickname.trim()) e.currentTarget.style.transform = 'translate(2px,2px)'; }}
                onMouseUp={(e) => { e.currentTarget.style.transform = 'none'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; }}
              >
                {isSavingNickname ? '⏳ SAVING...' : '✅ CONFIRM & CONTINUE'}
              </button>
              {wallets[0] && (
                <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.35rem', color: '#a87b51', textAlign: 'center' }}>
                  Wallet: {wallets[0].address.slice(0, 8)}...{wallets[0].address.slice(-6)}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* WALLET CONNECTION GATE – show when Google login but no wallet */}
      {needsWalletConnection && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999,
          background: 'rgba(0,0,0,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(4px)',
        }}>
          <div style={{
            background: '#c8a96e',
            border: '6px solid #5a3520',
            borderRadius: '4px',
            padding: '6px',
            boxShadow: '6px 6px 0 #3b1f0e, inset 0 0 0 3px #e8c98a',
            maxWidth: '480px',
            width: '90%',
          }}>
            <div style={{
              background: '#784626',
              border: '3px solid #3b1f0e',
              borderRadius: '2px',
              padding: '32px 28px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px',
            }}>
              <div style={{ fontSize: '3rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>💼</div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.8rem', color: '#fbbf24', marginBottom: '8px', lineHeight: 1.6 }}>
                  CONNECT WALLET
                </p>
                <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.7rem', color: '#fff', lineHeight: 1.6 }}>
                  Essential untuk Web3
                </p>
              </div>
              <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.4rem', color: '#d4a96a', textAlign: 'center', lineHeight: 1.8 }}>
                PathTrick membutuhkan wallet yang terhubung untuk minting sertifikat on-chain (SBT) dan menyelesaikan quest blockchain.
              </p>
              <button
                onClick={handleConnectWallet}
                disabled={isConnectingWallet}
                style={{
                  width: '100%',
                  padding: '18px',
                  fontFamily: '"Press Start 2P"',
                  fontSize: '0.7rem',
                  background: '#3b82f6',
                  border: '4px solid',
                  borderColor: '#1e40af',
                  borderTopColor: '#60a5fa',
                  borderLeftColor: '#60a5fa',
                  color: '#fff',
                  cursor: isConnectingWallet ? 'not-allowed' : 'pointer',
                  textShadow: '1px 1px 0 rgba(0,0,0,0.5)',
                  transition: 'all 0.2s',
                  opacity: isConnectingWallet ? 0.7 : 1,
                }}
                onMouseDown={(e) => { if (!isConnectingWallet) e.currentTarget.style.transform = 'translate(2px,2px)'; }}
                onMouseUp={(e) => { e.currentTarget.style.transform = 'none'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; }}
              >
                {isConnectingWallet ? '⏳ CONNECTING...' : '🔗 CONNECT WALLET'}
              </button>
              <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.35rem', color: '#a87b51', textAlign: 'center' }}>
                ℹ️ Gunakan MetaMask, Wallet Connect, atau Privy Wallet
              </p>
            </div>
          </div>
        </div>
      )}

      <div className={styles.boardContainer}>
        <div className={styles.boardHeader}>
          <h1 className={styles.boardTitle}>Pilih Role Anda</h1>
          {/* Show wallet connection hint for Google login without wallet */}
          {isGoogleLogin && wallets.length === 0 && (
            <div style={{
              marginTop: '12px',
              padding: '12px',
              background: 'rgba(255,193,7,0.1)',
              border: '2px solid #ffc107',
              borderRadius: '4px',
              textAlign: 'center'
            }}>
              <p style={{ 
                fontFamily: '"Press Start 2P"', 
                fontSize: '0.4rem', 
                color: '#fbbf24', 
                margin: 0,
                lineHeight: 1.6
              }}>
                ⚠️ Wallet belum terhubung. Hubungkan wallet sebelum lanjut!
              </p>
            </div>
          )}
        </div>
        <div className={styles.boardContent}>
          {ROLES.map((role) => {
            const isSelected = selected === role.id;
            return (
              <div key={role.id} className={styles.panelWrapper}>
                <button
                  id={`role-${role.id}`}
                  className={`${styles.innerPanel} ${isSelected ? styles.innerPanelSelected : ''}`}
                  onClick={() => setSelected(role.id)}
                >
                  <div className={styles.panelHeader}>
                    Peran: {role.title}
                  </div>
                  <div className={styles.panelBody}>
                    <Image
                      src={role.img}
                      alt={role.role}
                      width={160}
                      height={160}
                      className={styles.charImg}
                      draggable={false}
                    />
                  </div>
                  <div className={styles.panelFooter}>
                    {role.desc}
                  </div>
                </button>
              </div>
            );
          })}
        </div>
        <button
          id="role-continue-btn"
          className={`${styles.continueBtn} ${selected ? styles.continueBtnActive : ''}`}
          onClick={handleContinue}
          disabled={!selected || entering || (needsWalletConnection && !isConnectingWallet)}
          title={needsWalletConnection ? 'Hubungkan wallet terlebih dahulu' : ''}
        >
          {isConnectingWallet ? (
            <><span className={styles.spinner} /> Menghubungkan Wallet...</>
          ) : needsWalletConnection ? (
            <>🔗 Hubungkan Wallet Dulu →</>
          ) : entering ? (
            <><span className={styles.spinner} /> Memulai Petualangan...</>
          ) : selected ? (
            <>⚔️ Mulai sebagai {ROLES.find(r => r.id === selected)?.role}</>
          ) : (
            'Pilih karaktermu dulu →'
          )}
        </button>
      </div>
    </div>
  );
}
