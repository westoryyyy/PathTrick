'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useOnboardingStore, type UserRole } from '@/store/useOnboardingStore';
import { useUserStore } from '@/store/useUserStore';
import {
  API_BASE_URL,
  getApiError,
  isLocalRoleFallbackEnabled,
  readApiResponse,
} from '@/config/pathtrick';
import { LOCAL_ROLES, type RoleOption } from '@/data/roles';
import PixelIcon from '@/components/ui/PixelIcon';
import styles from './page.module.css';

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
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [rolesError, setRolesError] = useState('');
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);
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

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE_URL}/api/roles`, { credentials: 'include' })
      .then(async (response) => {
        const data = await readApiResponse(response);
        if (!response.ok) throw new Error(getApiError(data, 'Gagal memuat role.'));
        const roleData = Array.isArray(data) ? data : data.roles;
        if (!Array.isArray(roleData)) throw new Error('Format role dari backend tidak valid.');
        const validRoles = roleData.filter((role): role is RoleOption =>
          typeof role === 'object' &&
          role !== null &&
          typeof role.id === 'string' &&
          typeof role.displayName === 'string' &&
          typeof role.description === 'string' &&
          Array.isArray(role.perks) &&
          role.perks.every((perk: unknown) => typeof perk === 'string') &&
          typeof role.imageUrl === 'string'
        );
        if (!validRoles.length) throw new Error('Backend tidak mengembalikan role yang valid.');
        if (!cancelled) setRoles(validRoles);
      })
      .catch((error: unknown) => {
        console.warn('Roles API unavailable:', error);
        if (!cancelled) {
          if (isLocalRoleFallbackEnabled()) {
            setRoles(LOCAL_ROLES);
            setRolesError('');
          } else {
            setRoles([]);
            setRolesError('Role belum dapat dimuat. Coba lagi atau hubungi administrator.');
          }
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoadingRoles(false);
      });
    return () => { cancelled = true; };
  }, []);

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

  const handleContinue = async () => {
    if (!selected) return;
    // If Google login but no wallet, prompt to connect first
    if (isGoogleLogin && wallets.length === 0) {
      handleConnectWallet();
      return;
    }
    try {
      setEntering(true);
      const response = await fetch(`${API_BASE_URL}/api/users/me/role`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ roleId: selected }),
      });
      const data = await readApiResponse(response);
      if (!response.ok) throw new Error(getApiError(data, 'Role gagal disimpan.'));
      if (selected !== 'sma' && selected !== 'mahasiswa') {
        throw new Error('Role dari backend belum memiliki halaman yang tersedia.');
      }
      setRole(selected as UserRole, user?.id);
      router.push('/assessment');
    } catch (error) {
      console.warn('Role API unavailable:', error);
      if (selected !== 'sma' && selected !== 'mahasiswa') {
        setRolesError(error instanceof Error ? error.message : 'Role gagal disimpan.');
        setEntering(false);
        return;
      }
      if (isLocalRoleFallbackEnabled()) {
        setRole(selected as UserRole, user?.id);
        router.push('/assessment');
      } else {
        setRolesError('Role gagal disimpan. Coba lagi atau hubungi administrator.');
        setEntering(false);
      }
    }
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
              <PixelIcon icon="⚔️" size={56} />
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
              <PixelIcon icon="💼" size={48} />
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
                {isConnectingWallet ? 'CONNECTING...' : 'CONNECT WALLET'}
              </button>
              <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.35rem', color: '#a87b51', textAlign: 'center' }}>
                Gunakan MetaMask, Wallet Connect, atau Privy Wallet
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
                Wallet belum terhubung. Hubungkan wallet sebelum lanjut!
              </p>
            </div>
          )}
        </div>
        <div className={styles.boardContent}>
          {isLoadingRoles && <p>Memuat role...</p>}
          {!isLoadingRoles && rolesError && (
            <p role="alert">
              {rolesError}{' '}
              <button type="button" onClick={() => window.location.reload()}>
                Coba lagi
              </button>
            </p>
          )}
          {!isLoadingRoles && !rolesError && roles.map((role) => {
            const isSelected = selected === role.id;
            return (
              <div key={role.id} className={styles.panelWrapper}>
                <button
                  id={`role-${role.id}`}
                  className={`${styles.innerPanel} ${isSelected ? styles.innerPanelSelected : ''}`}
                  onClick={() => setSelected(role.id)}
                >
                  <div className={styles.panelHeader}>
                    Peran: {role.displayName}
                  </div>
                  <div className={styles.panelBody}>
                    <Image
                      src={role.imageUrl || '/PathTrick.png'}
                      alt={role.displayName}
                      width={160}
                      height={160}
                      className={styles.charImg}
                      draggable={false}
                    />
                  </div>
                  <div className={styles.panelFooter}>
                    <p>{role.description}</p>
                    {role.perks.length > 0 && <small>{role.perks.join(' • ')}</small>}
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
            <>Hubungkan Wallet Dulu →</>
          ) : entering ? (
            <><span className={styles.spinner} /> Memulai Petualangan...</>
          ) : selected ? (
            <>Mulai sebagai {roles.find(r => r.id === selected)?.displayName}</>
          ) : (
            'Pilih karaktermu dulu →'
          )}
        </button>
      </div>
    </div>
  );
}
