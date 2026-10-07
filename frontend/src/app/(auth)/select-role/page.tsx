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
  readApiResponse,
} from '@/config/pathtrick';
import { getAuthHeaders, useAuthSync, resolveHomePath } from '@/hooks/useAuthSync';
import { type RoleOption } from '@/data/roles';

/**
 * Bridge: backend role id/name → frontend route slug.
 * Satu-satunya tempat yang perlu diupdate kalau nama route berubah.
 */
const ROLE_TO_ROUTE: Record<string, UserRole> = {
  // by id (dari seed)
  'role-dreamer': 'dreamer',
  'role-chaser': 'chaser',
  // by name (fallback)
  'DREAMER': 'dreamer',
  'CHASER': 'chaser',
};

const ROLE_TRANSLATIONS: Record<string, { description: { id: string, en: string }, perks: { id: string[], en: string[] } }> = {
  'role-dreamer': {
    description: {
      id: 'Masih SMA & bingung mau kuliah apa? Temukan jurusan & karier sesuai bakatmu.',
      en: 'Still in high school & confused about college? Find majors & careers based on your talents.'
    },
    perks: {
      id: ['Asesmen Minat & Bakat', 'Tes RIASEC', 'Rekomendasi Jurusan', 'Info Beasiswa'],
      en: ['Talent & Interest Assessment', 'RIASEC Test', 'Major Recommendations', 'Scholarship Info']
    }
  },
  'role-chaser': {
    description: {
      id: 'Mahasiswa atau baru lulus? Upload CV-mu dan biarkan AI membuatkan roadmap kariermu.',
      en: 'College student or recent grad? Upload your CV and let AI create your career roadmap.'
    },
    perks: {
      id: ['Asesmen Karier AI', 'CV Analysis', 'Job Matching', 'Career Roadmap'],
      en: ['AI Career Assessment', 'CV Analysis', 'Job Matching', 'Career Roadmap']
    }
  }
};

import PixelIcon from '@/components/ui/PixelIcon';
import styles from './page.module.css';
import { useTranslation } from '@/hooks/useTranslation';

export default function SelectRolePage() {
  const router = useRouter();
  const { t, locale } = useTranslation();

  // Privy hooks — must come first as other hooks depend on `user`
  const { user, ready, authenticated } = usePrivy();
  const { wallets } = useWallets();
  const { displayName: savedName, setProfile } = useUserStore();
  useAuthSync();

  // Store
  const setRole = useOnboardingStore((s) => s.setRole);
  const resetOnboarding = useOnboardingStore((s) => s.resetOnboarding);

  const [selected, setSelected] = useState<string | null>(null);
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [rolesError, setRolesError] = useState('');
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);
  const [entering, setEntering] = useState(false);
  // True while we're verifying role from backend on first load.
  // Prevents flash of role-selector UI when user actually has a role.
  const [isVerifyingRole, setIsVerifyingRole] = useState(true);

  const [existingRoleSlug, setExistingRoleSlug] = useState<string | null>(null);

  const [showGate, setShowGate] = useState(false); // diset via useEffect saat wallet terdeteksi
  const [nickname, setNickname] = useState('');
  const [isSavingNickname, setIsSavingNickname] = useState(false);



  // ── Verify role from BACKEND on first load ──
  // This is the primary guard. It fetches /api/users/me to check whether
  // the backend already has a role for this user, handling cases where:
  // - Zustand store is stale (different account, corrupt data)
  // - User closed the tab before completing role selection
  useEffect(() => {
    if (!ready) return;
    if (!authenticated || !user) { setIsVerifyingRole(false); return; }
    let cancelled = false;
    const controller = new AbortController();
    const failsafe = window.setTimeout(() => {
      if (!cancelled) setIsVerifyingRole(false);
    }, 10000);
    const waitForToken = async () => {
      // JWT is written by useAuthSync; poll up to ~6s instead of depending on a flag
      for (let i = 0; i < 30 && !getAuthHeaders()['Authorization']; i++) {
        if (cancelled) return false;
        await new Promise(r => setTimeout(r, 200));
      }
      return !!getAuthHeaders()['Authorization'];
    };
    const fetchTimer = window.setTimeout(() => controller.abort(), 8000);
    waitForToken().then((hasToken) => {
      if (cancelled) return;
      if (!hasToken) { setIsVerifyingRole(false); return; }
      return fetch(`${API_BASE_URL}/api/users/me`, { headers: getAuthHeaders(), signal: controller.signal })
      .then(async (res) => {
        if (!res.ok || cancelled) { setIsVerifyingRole(false); return; }
        const data = await res.json() as { name?: string | null, role?: { name?: string } | null };
        if (cancelled) return;
        const roleName = data?.role?.name?.toUpperCase();
        
        let slug: string | null = null;
        if (roleName === 'DREAMER') slug = 'dreamer';
        else if (roleName === 'CHASER') slug = 'chaser';
        else if (roleName === 'ADMIN') slug = 'admin';

        const backendName = data?.name;
        const needsName = !backendName;

        if (needsName) {
          setShowGate(true);
          setExistingRoleSlug(slug);
          setIsVerifyingRole(false);
          return;
        }

        const hasRoadmap = (data as any)?.roadmaps && (data as any).roadmaps.length > 0;

        if (slug === 'dreamer' || slug === 'chaser') {
          setRole(slug, user.id);
          // Only send to dashboard if assessment was already completed (verified by backend roadmap).
          // Otherwise send to /assessment so they can finish onboarding.
          if (hasRoadmap) {
            useOnboardingStore.setState({ onboardingCompleted: true }); // sync state just in case
            router.replace(`/${slug}/dashboard`);
          } else {
            router.replace('/assessment');
          }
        } else if (slug === 'admin') {
          router.replace('/admin/dashboard');
        } else {
          // No role in backend — clear any stale store data and show role selector
          resetOnboarding();
          setIsVerifyingRole(false);
        }
      });
    })
      .catch(() => { if (!cancelled) setIsVerifyingRole(false); })
      .finally(() => { window.clearTimeout(fetchTimer); window.clearTimeout(failsafe); });
    return () => {
      cancelled = true;
      controller.abort();
      window.clearTimeout(fetchTimer);
      window.clearTimeout(failsafe);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, authenticated, user?.id]);

  // ── Load available roles from backend ──
  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE_URL}/api/roles`, { headers: { ...getAuthHeaders() } })
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
          typeof role.iconUrl === 'string'
        );
        if (!validRoles.length) throw new Error('Backend tidak mengembalikan role yang valid.');
        if (!cancelled) setRoles(validRoles);
      })
      .catch((error: unknown) => {
        console.warn('Roles API unavailable:', error);
        if (!cancelled) {
          setRoles([]);
          setRolesError('Role belum dapat dimuat. Coba lagi atau hubungi administrator.');
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoadingRoles(false);
      });
    return () => { cancelled = true; };
  }, []);

  const handleNicknameConfirm = async () => {
    if (!nickname.trim()) return;
    setIsSavingNickname(true);

    try {
      // Tunggu JWT tersedia (max ~5 detik) — token disimpan oleh useAuthSync
      // yang mungkin belum selesai saat pop-up ini muncul pertama kali
      let headers = getAuthHeaders();
      for (let i = 0; i < 20 && !headers['Authorization']; i++) {
        await new Promise(r => setTimeout(r, 250));
        headers = getAuthHeaders();
      }

      if (headers['Authorization']) {
        const body: Record<string, string> = { name: nickname.trim() };
        if (wallets[0]?.address) body.walletAddress = wallets[0].address;

        await fetch(`${API_BASE_URL}/api/users/me`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...headers },
          body: JSON.stringify(body),
        });
      } else {
        console.warn('[Nickname] JWT belum tersedia setelah 5 detik, lewatkan sync backend');
      }
    } catch (error) {
      console.error('[Nickname] Gagal sync ke backend:', error);
    } finally {
      setProfile(nickname.trim(), wallets[0]?.address || '');
      setShowGate(false);
      setIsSavingNickname(false);

      if (existingRoleSlug) {
        if (existingRoleSlug === 'admin') {
          router.replace('/admin/dashboard');
        } else {
          setRole(existingRoleSlug as UserRole, user?.id);
          router.replace(await resolveHomePath(existingRoleSlug));
        }
      }
    }
  };



  const handleContinue = async () => {
    if (!selected) return;
    // We no longer block Google logins that don't have a wallet yet.
    // Privy automatically provisions embedded wallets in the background
    // based on our Providers.tsx configuration (createOnLogin: 'users-without-wallets').
    try {
      setEntering(true);

      // Detect ADMIN role (id atau name)
      const selectedRole = roles.find(r => r.id === selected);
      const roleName = (selectedRole as any)?.name ?? '';
      const routeSlug = ROLE_TO_ROUTE[selected] ?? ROLE_TO_ROUTE[roleName];
      if (selected === 'role-admin' || roleName === 'ADMIN') {
        // Admin tidak perlu assessment — langsung ke panel admin
        await fetch(`${API_BASE_URL}/api/users/me/role`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
          body: JSON.stringify({ roleId: selected }),
        });
        router.replace('/admin/dashboard');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/users/me/role`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ roleId: selected }),
      });
      const data = await readApiResponse(response);
      if (!response.ok) throw new Error(getApiError(data, 'Role gagal disimpan.'));
      if (!routeSlug) {
        throw new Error('Role dari backend belum memiliki halaman yang tersedia.');
      }
      setRole(routeSlug, user?.id);
      router.push('/assessment');
    } catch (error) {
      console.warn('Role API unavailable:', error);
      setRolesError(error instanceof Error ? error.message : 'Role gagal disimpan. Coba lagi atau hubungi administrator.');
      setEntering(false);
    }
  };

  // Show loading state while backend role verification is in progress.
  // Uses the existing page/boardContainer structure to avoid layout shift.
  if (isVerifyingRole) {
    return (
      <div className={styles.page}>
        <div className={styles.boardContainer}>
          <p>{locale === 'id' ? 'Memverifikasi sesi...' : 'Verifying session...'}</p>
        </div>
      </div>
    );
  }

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
                  {locale === 'id' ? 'TENTUKAN NAMA' : 'CHOOSE YOUR'}
                </p>
                <p style={{ fontFamily: '"Press Start 2P"', fontSize: '1rem', color: '#fff', lineHeight: 1.6 }}>
                  {locale === 'id' ? 'PETUALANGMU' : 'ADVENTURER NAME'}
                </p>
              </div>
              <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.4rem', color: '#d4a96a', textAlign: 'center', lineHeight: 1.8 }}>
                {locale === 'id' 
                  ? 'Nama ini akan tampil di Sertifikat Web3 (SBT) milikmu dan dapat dilihat di seluruh platform PathTrick.' 
                  : 'This name will appear on your Web3 Certificate (SBT) and be displayed across the PathTrick platform.'}
              </p>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleNicknameConfirm()}
                placeholder={locale === 'id' ? 'Masukkan namamu...' : 'Enter nickname...'}
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
                {isSavingNickname 
                  ? (locale === 'id' ? '⏳ MENYIMPAN...' : '⏳ SAVING...') 
                  : (locale === 'id' ? '✅ KONFIRMASI & LANJUTKAN' : '✅ CONFIRM & CONTINUE')}
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



      <div className={styles.boardContainer}>
        <div className={styles.boardHeader}>
          <h1 className={styles.boardTitle}>{locale === 'id' ? 'Pilih Role Anda' : 'Choose Your Role'}</h1>

        </div>
        <div className={styles.boardContent}>
          {isLoadingRoles && <p>{locale === 'id' ? 'Memuat role...' : 'Loading roles...'}</p>}
          {!isLoadingRoles && rolesError && (
            <p role="alert">
              {rolesError}{' '}
              <button type="button" onClick={() => window.location.reload()}>
                {locale === 'id' ? 'Coba lagi' : 'Try again'}
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
                    {locale === 'id' ? 'Peran:' : 'Role:'} {role.displayName}
                  </div>
                  <div className={styles.panelBody}>
                    <Image
                      src={role.iconUrl || '/PathTrick.png'}
                      alt={role.displayName}
                      width={160}
                      height={160}
                      className={styles.charImg}
                      draggable={false}
                    />
                  </div>
                  <div className={styles.panelFooter}>
                    <p>{ROLE_TRANSLATIONS[role.id]?.description?.[locale as 'id' | 'en'] || role.description}</p>
                    {role.perks.length > 0 && <small>{ROLE_TRANSLATIONS[role.id]?.perks?.[locale as 'id' | 'en']?.join(' • ') || role.perks.join(' • ')}</small>}
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
          disabled={!selected || entering}
        >
          {entering ? (
            <><span className={styles.spinner} /> {locale === 'id' ? 'Memulai Petualangan...' : 'Starting Adventure...'}</>
          ) : selected ? (
            <>{locale === 'id' ? 'Mulai sebagai' : 'Start as'} {roles.find(r => r.id === selected)?.displayName}</>
          ) : (
            locale === 'id' ? 'Pilih karaktermu dulu →' : 'Select your character first →'
          )}
        </button>
      </div>
    </div>
  );
}
