'use client';

/**
 * DevPanel — floating debug widget (development only)
 * Renders ONLY when NODE_ENV=development.
 * Shows current auth/onboarding state and lets you reset per-user data quickly.
 */

import { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import {
  useOnboardingStore,
  clearUserOnboarding,
} from '@/store/useOnboardingStore';
import { useUserStore } from '@/store/useUserStore';

import GameLoadingScreen from '@/components/ui/GameLoadingScreen';

if (process.env.NODE_ENV === 'production') {
  // Safety: export a no-op in production
}

export default function DevPanel() {
  if (process.env.NODE_ENV === 'production') return null;

  return <DevPanelInner />;
}

function DevPanelInner() {
  const [open, setOpen] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const { user, logout } = usePrivy();
  const store = useOnboardingStore();

  const userId = user?.id ?? null;
  const storageKey = userId ? `pathtrick-onboarding-${userId}` : null;

  function handleResetStore() {
    store.resetOnboarding();
    if (userId) clearUserOnboarding(userId);
    alert('✅ Store reset! Reload halaman untuk lihat efeknya.');
  }

  function handleClearAllStorage() {
    Object.keys(localStorage)
      .filter((k) => k.startsWith('pathtrick-'))
      .forEach((k) => localStorage.removeItem(k));
    alert('✅ Semua pathtrick-* storage dihapus!');
  }

  function handleForceLogout() {
    store.resetOnboarding();
    logout();
  }

  return (
    <>
    <div
      style={{
        position: 'fixed',
        bottom: '16px',
        left: '16px',
        zIndex: 9999,
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '9px',
      }}
    >
      {/* Toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          background: '#1a1a2e',
          color: '#00ff88',
          border: '2px solid #00ff88',
          padding: '6px 10px',
          cursor: 'pointer',
          boxShadow: '3px 3px 0 #004422',
          fontSize: '9px',
          fontFamily: '"Press Start 2P", monospace',
        }}
      >
        {open ? '✕ DEV' : '🛠 DEV'}
      </button>

      {/* Panel */}
      {open && (
        <div
          style={{
            marginTop: '6px',
            background: '#0d0d1a',
            border: '2px solid #00ff88',
            padding: '12px',
            width: '280px',
            boxShadow: '4px 4px 0 #004422',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <div style={{ color: '#00ff88', marginBottom: '4px' }}>🛠 DEV PANEL</div>

          {/* Auth Info */}
          <section>
            <div style={{ color: '#888', marginBottom: '4px' }}>── AUTH ──</div>
            <div style={{ color: '#fff', lineHeight: '1.8' }}>
              <div>User: <span style={{ color: '#f59e0b' }}>{user?.email?.address ?? user?.google?.email ?? 'n/a'}</span></div>
              <div>ID: <span style={{ color: '#f59e0b', wordBreak: 'break-all', fontSize: '7px' }}>{userId?.slice(0, 30) ?? 'n/a'}...</span></div>
            </div>
          </section>

          {/* Store State */}
          <section>
            <div style={{ color: '#888', marginBottom: '4px' }}>── STORE ──</div>
            <div style={{ color: '#fff', lineHeight: '1.8' }}>
              <div>Role: <span style={{ color: '#a78bfa' }}>{store.selectedRole ?? 'null'}</span></div>
              <div>Step: <span style={{ color: '#a78bfa' }}>{store.currentStep + 1}/{store.totalSteps || '?'}</span></div>
              <div>Budget: <span style={{ color: '#a78bfa' }}>{store.smaAssessment.budgetPreference || 'not set'}</span></div>
              <div>StorageKey: <span style={{ color: '#6ee7b7', fontSize: '7px', wordBreak: 'break-all' }}>{storageKey ?? 'none'}</span></div>
            </div>
          </section>

          {/* Quick Role Switch */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ color: '#888', marginBottom: '2px' }}>── QUICK ROLE SWITCH ──</div>

            <button
              onClick={() => {
                const s = useOnboardingStore.getState();
                const uid = user?.id ?? 'dev-user';
                s.setRole('mahasiswa', uid);
                window.location.href = '/chaser/dashboard';
              }}
              style={btnStyle('#0d2e0d', '#34d399')}
            >
              🎓 Play as THE CHASER (Mahasiswa)
            </button>

            <button
              onClick={() => {
                const s = useOnboardingStore.getState();
                const uid = user?.id ?? 'dev-user';
                s.setRole('sma', uid);
                window.location.href = '/dreamer/dashboard';
              }}
              style={btnStyle('#1a1a0d', '#fbbf24')}
            >
              🌟 Play as THE DREAMER (SMA)
            </button>

            <button
              onClick={() => window.location.href = '/admin/dashboard'}
              style={btnStyle('#0d1a12', '#34d399')}
            >
              ⚙ Open ADMIN DASHBOARD
            </button>

            <div style={{ color: '#888', marginTop: '4px', marginBottom: '2px' }}>── QUICK MAP LINKS ──</div>

            <button
              onClick={() => window.location.href = '/map?role=mahasiswa'}
              style={btnStyle('#1a0d2e', '#a78bfa')}
            >
              🗺️ Chaser World Map
            </button>

            <button
              onClick={() => window.location.href = '/map?chapter=module-education-1-bab-1&role=mahasiswa'}
              style={btnStyle('#1a0d2e', '#c084fc')}
            >
              ⚔️ Test Chapter Map (Education)
            </button>
          </section>

          {/* Actions */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ color: '#888', marginBottom: '2px' }}>── ACTIONS ──</div>

            <button onClick={handleResetStore} style={btnStyle('#1c1c3a', '#a78bfa')}>
              🔄 Reset User Store
            </button>
            <button onClick={handleClearAllStorage} style={btnStyle('#1c1c3a', '#f87171')}>
              🗑 Clear ALL pathtrick Storage
            </button>
            <button onClick={handleForceLogout} style={btnStyle('#1c1c3a', '#fbbf24')}>
              🚪 Reset + Logout
            </button>
            <button
              onClick={() => window.location.href = '/select-role'}
              style={btnStyle('#1c1c3a', '#34d399')}
            >
              ↩ Go to Select Role
            </button>
            <button
              onClick={() => window.location.href = '/'}
              style={btnStyle('#1c1c3a', '#60a5fa')}
            >
              🏠 Go to Landing
            </button>
            <button
              onClick={() => {
                setTestLoading(true);
                setTimeout(() => setTestLoading(false), 5000);
              }}
              style={btnStyle('#1c1c3a', '#c084fc')}
            >
              ⏳ Test Loading Screen
            </button>
            <button
              onClick={() => {
                const store = useUserStore.getState();
                store.triggerLevelUp();
              }}
              style={btnStyle('#1c1c3a', '#f59e0b')}
            >
              ⭐ CHEAT: Trigger Level Up
            </button>
          </section>
        </div>
      )}
    </div>
    {testLoading && (
      <div style={{ position: 'fixed', inset: 0, zIndex: 9999999 }}>
        <GameLoadingScreen statusText="Test Loading (Auto-close 5s)..." />
      </div>
    )}
    </>
  );
}

function btnStyle(bg: string, color: string): React.CSSProperties {
  return {
    background: bg,
    color,
    border: `2px solid ${color}`,
    padding: '6px 8px',
    cursor: 'pointer',
    fontSize: '8px',
    fontFamily: '"Press Start 2P", monospace',
    textAlign: 'left',
    boxShadow: '2px 2px 0 rgba(0,0,0,0.5)',
    width: '100%',
  };
}
