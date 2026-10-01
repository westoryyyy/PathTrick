'use client';

import { useEffect, useCallback, useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { API_BASE_URL, readApiResponse } from '@/config/pathtrick';
import { loadUserOnboarding, useOnboardingStore, type UserRole } from '@/store/useOnboardingStore';
import { useUserStore } from '@/store/useUserStore';

const TOKEN_KEY = 'pathtrick_token';

type BackendRoleName = 'DREAMER' | 'CHASER' | 'ADMIN';

type BackendMeResponse = {
    id: string;
    email?: string | null;
    name?: string | null;
    role?: {
      id?: string;
      name?: string;
      displayName?: string;
      iconUrl?: string | null;
    } | null;
    walletAddress?: string | null;
    gamification?: { xp: number } | null;
};

function mapBackendRoleToRoute(roleName?: string | null): UserRole | null {
  switch (roleName?.toUpperCase()) {
    case 'DREAMER':
      return 'dreamer';
    case 'CHASER':
      return 'chaser';
    default:
      return null;
  }
}

function isAdminRole(roleName?: string | null): boolean {
  return roleName?.toUpperCase() === 'ADMIN';
}

function getProfileName(
  backendName: string | null | undefined,
  email: string | null | undefined,
  fallbackName: string | null | undefined
): string {
  return backendName?.trim()
    || fallbackName?.trim()
    || email?.split('@')[0]
    || 'Explorer';
}

/**
 * Hydrates frontend state from backend after login.
 * Returns the resolved route role (or null if no role yet).
 */
async function hydrateFrontendState(
  appToken: string,
  privyUser: { id: string; email?: { address?: string | null } | null; google?: { name?: string | null; email?: string | null } | null; }
): Promise<{ routeRole: UserRole | 'admin' | null }> {
  const response = await fetch(`${API_BASE_URL}/api/users/me`, {
    headers: {
      Authorization: `Bearer ${appToken}`,
    },
  });

  const data = await readApiResponse(response);
  if (!response.ok) {
    console.warn('[AuthSync] Failed to hydrate /api/users/me:', response.status, data);
    return { routeRole: null };
  }

  const payload = data as BackendMeResponse;
  const backendUser = payload;
  if (!backendUser) {
    console.warn('[AuthSync] /api/users/me returned no user payload');
    return { routeRole: null };
  }

  const fallbackEmail = privyUser.email?.address ?? privyUser.google?.email ?? null;
  const fallbackName = privyUser.google?.name ?? null;
  const resolvedEmail = backendUser.email ?? fallbackEmail ?? '';
  const resolvedName = getProfileName(backendUser.name, resolvedEmail, fallbackName);

  const xp = backendUser.gamification?.xp || 0;
  const calculatedLevel = Math.max(1, Math.floor(xp / 1000) + 1);
  useUserStore.getState().hydrateUser(xp, calculatedLevel, resolvedName, resolvedEmail);

  const currentOnboarding = useOnboardingStore.getState();
  loadUserOnboarding(privyUser.id);

  const backendRoleName = backendUser.role?.name?.toUpperCase() as BackendRoleName | undefined;

  if (isAdminRole(backendRoleName)) {
    useOnboardingStore.setState({ savedPrivyUserId: privyUser.id, selectedRole: 'admin' });
    return { routeRole: 'admin' };
  }

  const routeRole = mapBackendRoleToRoute(backendRoleName);

  if (routeRole) {
    const onboardingAfterLoad = useOnboardingStore.getState();
    if (
      onboardingAfterLoad.savedPrivyUserId !== privyUser.id ||
      onboardingAfterLoad.selectedRole !== routeRole
    ) {
      onboardingAfterLoad.setRole(routeRole, privyUser.id);
    }
  } else if (currentOnboarding.savedPrivyUserId !== privyUser.id) {
    useOnboardingStore.setState({ savedPrivyUserId: privyUser.id });
  }

  return { routeRole };
}

// Module-level singleton: ensures sync runs only once per user per session,
// even if useAuthSync() is mounted in multiple components simultaneously.
let _syncedForUser: string | null = null;

/**
 * Syncs the Privy session with our backend.
 *
 * Once Privy reports `authenticated`, this hook:
 * 1. Calls POST /api/auth/sync with the Privy access token.
 * 2. Stores the returned app JWT in localStorage under 'pathtrick_token'.
 * 3. All subsequent backend calls use this JWT as Authorization: Bearer header.
 *
 * The Privy token is NEVER sent to any other backend endpoint.
 */
export function useAuthSync() {
  const { authenticated, ready, getAccessToken, user } = usePrivy();
  const { wallets } = useWallets();
  // isSyncing: true while the backend sync + hydrate is in progress.
  // Exposed as reactive state so consumers can show a loading indicator.
  const [isSyncing, setIsSyncing] = useState(false);

  const syncAuth = useCallback(async () => {
    if (!authenticated || !ready || !user) return;

    // Don't re-sync for the same Privy user within this session
    if (_syncedForUser === user.id) return;

    setIsSyncing(true);
    try {
      const privyToken = await getAccessToken();
      if (!privyToken) {
        console.warn('[AuthSync] Could not obtain Privy access token');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${privyToken}`,
        },
        body: JSON.stringify({
          email: user.email?.address ?? user.google?.email ?? undefined,
          name: user.google?.name ?? undefined,
          // Kirim walletAddress dari useWallets hook (lebih reliable dari linkedAccounts)
          walletAddress: wallets[0]?.address ?? undefined,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        console.error('[AuthSync] Backend sync failed:', response.status, err);
        return;
      }

      const data = await response.json();
      if (data.token) {
        localStorage.setItem(TOKEN_KEY, data.token);
        _syncedForUser = user.id;
        console.log('[AuthSync] JWT stored successfully for user:', data.user?.name ?? user.id);
        const { routeRole } = await hydrateFrontendState(data.token, user);

        // ── Post-login redirect ──
        // Only redirect from the landing page (/) or if user has no role at all.
        // Admin redirect is handled inside hydrateFrontendState via window.location.replace.
        const currentPath = window.location.pathname;
        const isOnLanding = currentPath === '/';

        if (routeRole && routeRole !== 'admin') {
          // User has a role and is on landing page → do NOT auto-redirect.
          // They navigated here intentionally (e.g. clicked the logo) or landed here
          // for the first time. The Dashboard button is visible; let them choose.
          // Only redirect automatically if they came from a fresh login action
          // (detected by the 'pt_fresh_login' flag set by handleStart on login).
          const isFreshLogin = sessionStorage.getItem('pt_fresh_login') === '1';
          if (isFreshLogin) {
            sessionStorage.removeItem('pt_fresh_login');
            window.location.replace(`/${routeRole}/dashboard`);
          }
          // Otherwise: stay on landing page, button will show "Dashboard".
        } else if (!routeRole) {
          // No role yet → must go through onboarding
          if (!currentPath.startsWith('/select-role')) {
            window.location.replace('/select-role');
          }
        }
      }
    } catch (error) {
      console.error('[AuthSync] Network error:', error);
    } finally {
      setIsSyncing(false);
    }
  }, [authenticated, ready, user, wallets, getAccessToken]);

  useEffect(() => {
    setTimeout(() => void syncAuth(), 0);
  }, [syncAuth]);

  // Separate effect to ensure we capture the wallet address,
  // since Privy sometimes populates `wallets` a few moments *after* authentication.
  useEffect(() => {
    if (!authenticated || !wallets[0]?.address) return;
    const appToken = localStorage.getItem(TOKEN_KEY);
    if (!appToken) return;

    const walletKey = `synced_wallet_${user?.id}`;
    if (sessionStorage.getItem(walletKey) === wallets[0].address) return;

    fetch(`${API_BASE_URL}/api/users/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${appToken}`,
      },
      body: JSON.stringify({ walletAddress: wallets[0].address }),
    }).then(res => {
      if (res.ok) {
        sessionStorage.setItem(walletKey, wallets[0].address);
        console.log('[AuthSync] Wallet synced to backend:', wallets[0].address);
      }
    });
  }, [authenticated, wallets, user?.id]);

  return {
    /** The stored app JWT, or null if not yet synced */
    token: typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null,
    /** Whether the sync has completed for the current user */
    isSynced: _syncedForUser === user?.id,
    /** True while the backend sync + hydrate is in progress */
    isSyncing,
    /** Force re-sync (e.g. after role change) */
    resync: syncAuth,
  };
}

/**
 * Get the stored JWT for use in fetch calls.
 * Returns headers object ready to spread into fetch options.
 */
export function getAuthHeaders(): Record<string, string> {
  const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

/**
 * Clear stored JWT (call on logout).
 */
export function clearAuthToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
}
