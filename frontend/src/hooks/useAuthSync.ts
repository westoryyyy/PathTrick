'use client';

import { useEffect, useRef, useCallback } from 'react';
import { usePrivy } from '@privy-io/react-auth';
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
      return 'sma';
    case 'CHASER':
      return 'mahasiswa';
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

async function hydrateFrontendState(appToken: string, privyUser: { id: string; email?: { address?: string | null } | null; google?: { name?: string | null; email?: string | null } | null; }): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/users/me`, {
    headers: {
      Authorization: `Bearer ${appToken}`,
    },
  });

  const data = await readApiResponse(response);
  if (!response.ok) {
    console.warn('[AuthSync] Failed to hydrate /api/users/me:', response.status, data);
    return;
  }

  const payload = data as BackendMeResponse;
  const backendUser = payload;
  if (!backendUser) {
    console.warn('[AuthSync] /api/users/me returned no user payload');
    return;
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
    if (!window.location.pathname.startsWith('/admin')) {
      window.location.replace('/admin/dashboard');
    }
    return;
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
}

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
  const syncedForUser = useRef<string | null>(null);

  const syncAuth = useCallback(async () => {
    if (!authenticated || !ready || !user) return;

    // Don't re-sync for the same Privy user within this session
    if (syncedForUser.current === user.id) return;

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
        syncedForUser.current = user.id;
        console.log('[AuthSync] JWT stored successfully for user:', data.user?.name ?? user.id);
        await hydrateFrontendState(data.token, user);
      }
    } catch (error) {
      console.error('[AuthSync] Network error:', error);
    }
  }, [authenticated, ready, user, getAccessToken]);

  useEffect(() => {
    syncAuth();
  }, [syncAuth]);

  return {
    /** The stored app JWT, or null if not yet synced */
    token: typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null,
    /** Whether the sync has completed for the current user */
    isSynced: syncedForUser.current === user?.id,
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
