'use client';
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/config/pathtrick';
import { getAuthHeaders } from '@/hooks/useAuthSync';

interface User {
  id: string; name: string; email: string; role: string; xp: number; walletAddress: string;
}

const roleColor: Record<string, string> = { MAHASISWA: '#1d4ed8', SMA: '#7c3aed', ADMIN: '#dc2626', THE_DREAMER: '#059669', THE_CHASER: '#b45309' };
const roleBorder: Record<string, string> = { MAHASISWA: '#60a5fa', SMA: '#a78bfa', ADMIN: '#fca5a5', THE_DREAMER: '#6ee7b7', THE_CHASER: '#fcd34d' };

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/admin/users`, { headers: getAuthHeaders(), cache: 'no-store' })
      .then(r => r.json())
      .then((d: any) => {
        if (d && Array.isArray(d.users)) {
          setUsers(d.users.map((u: any) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role?.name || 'USER',
            xp: u.gamification?.xp || 0,
            walletAddress: u.walletAddress
          })));
        } else {
          setUsers([]);
        }
      })
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, [refreshKey]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ background: 'rgba(139,26,26,0.15)', border: '3px solid #5a3a29', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '4px 4px 0 rgba(0,0,0,0.5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '1.5rem' }}>👥</span>
          <div>
            <h1 style={{ fontFamily: '"Pixelify Sans"', fontSize: "1.3rem", color: '#fbbf24', margin: 0, textShadow: '2px 2px 0 #000' }}>DATA PENGGUNA</h1>
            <p style={{ fontFamily: '"Pixelify Sans"', fontSize: "0.85rem", color: 'rgba(255,255,255,0.5)', margin: '4px 0 0' }}>Read-only monitoring — {loading ? '…' : users.length} users terdaftar</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={() => setRefreshKey(k => k + 1)}
            disabled={loading}
            style={{ fontFamily: '"Pixelify Sans"', fontSize: "0.8rem", color: '#fbbf24', background: 'rgba(59,31,10,0.8)', border: '2px solid #5a3a29', padding: '8px 14px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}
          >
            {loading ? '⏳ Loading...' : '🔄 Refresh'}
          </button>
          <div style={{ fontFamily: '"Pixelify Sans"', fontSize: "0.9rem", color: '#fbbf24', background: 'rgba(139,26,26,0.3)', border: '2px solid #5a3a29', padding: '8px 14px' }}>
            ⚠ READ ONLY
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'flex', gap: '12px' }}>
        {[
          { label: 'Total Users', value: users.length, color: '#3b82f6' },
          { label: 'Has Wallet', value: users.filter(u => u.walletAddress && u.walletAddress !== '—').length, color: '#10b981' },
          { label: 'Total XP', value: users.reduce((acc, u) => acc + (u.xp || 0), 0).toLocaleString(), color: '#f59e0b' },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, background: '#3b1f0a', border: `2px solid ${s.color}`, padding: '12px 16px', boxShadow: '3px 3px 0 rgba(0,0,0,0.5)' }}>
            <div style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace', fontSize: "1.8rem", fontWeight: "bold", color: s.color, marginBottom: '4px' }}>{loading ? '…' : s.value}</div>
            <div style={{ fontFamily: '"Pixelify Sans"', fontSize: "0.8rem", color: 'rgba(255,255,255,0.5)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: '#3b1f0a', border: '3px solid #5a3a29', boxShadow: '4px 4px 0 rgba(0,0,0,0.5)', overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(139,26,26,0.4)', borderBottom: '3px solid #5a3a29' }}>
              {['Nama', 'Email', 'Role', 'XP', 'Wallet Address'].map(col => (
                <th key={col} style={{ fontFamily: '"Pixelify Sans"', fontSize: "0.9rem", color: '#fbbf24', padding: '12px 16px', textAlign: 'left', whiteSpace: 'nowrap' }}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '40px', fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '24px', height: '24px', border: '3px solid #fbbf24', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    Sedang memuat data...
                  </div>
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontFamily: '"Pixelify Sans"' }}>Tidak ada user ditemukan</td></tr>
            ) : users.map((user, i) => (
              <tr key={user.id} style={{ borderBottom: '1px solid rgba(139,26,26,0.3)', background: i % 2 === 0 ? 'transparent' : 'rgba(139,26,26,0.07)' }}>
                <td style={{ fontFamily: '"Pixelify Sans"', fontSize: "0.9rem", color: '#fff', padding: '12px 16px' }}>{user.name || '—'}</td>
                <td style={{ fontFamily: '"Pixelify Sans"', fontSize: "0.9rem", color: 'rgba(255,255,255,0.6)', padding: '12px 16px' }}>{user.email}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ fontFamily: '"Pixelify Sans"', fontSize: "0.9rem", background: roleColor[user.role] ?? '#374151', border: `1px solid ${roleBorder[user.role] ?? '#6b7280'}`, color: '#fff', padding: '3px 8px' }}>{user.role}</span>
                </td>
                <td style={{ fontFamily: '"Pixelify Sans"', fontSize: "0.9rem", color: '#10b981', padding: '12px 16px' }}>{(user.xp ?? 0).toLocaleString()} XP</td>
                <td style={{ fontFamily: 'monospace', fontSize: "0.9rem", color: !user.walletAddress ? 'rgba(255,255,255,0.3)' : '#a78bfa', padding: '12px 16px' }}>{user.walletAddress || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
