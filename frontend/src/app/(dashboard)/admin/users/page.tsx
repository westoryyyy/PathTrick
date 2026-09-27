'use client';

interface User {
  id: string; name: string; email: string; role: string; level: number; xp: number; wallet: string;
}

const MOCK_USERS: User[] = [
  { id: '1', name: 'Grace Yoelanda', email: 'grace@email.com', role: 'MAHASISWA', level: 5, xp: 2400, wallet: '0xA3EF...8eb4' },
  { id: '2', name: 'Andi Pratama', email: 'andi@email.com', role: 'SMA', level: 3, xp: 980, wallet: '0x1B2C...f03a' },
  { id: '3', name: 'Siti Rahayu', email: 'siti@email.com', role: 'MAHASISWA', level: 8, xp: 5100, wallet: '0x9D4A...22ce' },
  { id: '4', name: 'Budi Santoso', email: 'budi@email.com', role: 'SMA', level: 1, xp: 200, wallet: '—' },
  { id: '5', name: 'Dewi Lestari', email: 'dewi@email.com', role: 'MAHASISWA', level: 12, xp: 9800, wallet: '0xF7E2...b81d' },
];

const roleColor: Record<string, string> = { MAHASISWA: '#1d4ed8', SMA: '#7c3aed' };
const roleBorder: Record<string, string> = { MAHASISWA: '#60a5fa', SMA: '#a78bfa' };

export default function UsersPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ background: 'rgba(139,26,26,0.15)', border: '3px solid #5a3a29', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '4px 4px 0 rgba(0,0,0,0.5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '1.5rem' }}>👥</span>
          <div>
            <h1 style={{ fontFamily: '"Pixelify Sans"', fontSize: "1.3rem", color: '#fbbf24', margin: 0, textShadow: '2px 2px 0 #000' }}>DATA PENGGUNA</h1>
            <p style={{ fontFamily: '"Pixelify Sans"', fontSize: "0.85rem", color: 'rgba(255,255,255,0.5)', margin: '4px 0 0' }}>Read-only monitoring — {MOCK_USERS.length} users terdaftar</p>
          </div>
        </div>
        <div style={{ fontFamily: '"Pixelify Sans"', fontSize: "0.9rem", color: '#fbbf24', background: 'rgba(139,26,26,0.3)', border: '2px solid #5a3a29', padding: '8px 14px' }}>
          ⚠ READ ONLY
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'flex', gap: '12px' }}>
        {[
          { label: 'Total Users', value: MOCK_USERS.length, color: '#3b82f6' },
          { label: 'Mahasiswa', value: MOCK_USERS.filter(u => u.role === 'MAHASISWA').length, color: '#7c3aed' },
          { label: 'SMA', value: MOCK_USERS.filter(u => u.role === 'SMA').length, color: '#1d4ed8' },
          { label: 'Has Wallet', value: MOCK_USERS.filter(u => u.wallet !== '—').length, color: '#10b981' },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, background: '#3b1f0a', border: `2px solid ${s.color}`, padding: '12px 16px', boxShadow: '3px 3px 0 rgba(0,0,0,0.5)' }}>
            <div style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace', fontSize: "1.8rem", fontWeight: "bold", color: s.color, marginBottom: '4px' }}>{s.value}</div>
            <div style={{ fontFamily: '"Pixelify Sans"', fontSize: "0.8rem", color: 'rgba(255,255,255,0.5)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: '#3b1f0a', border: '3px solid #5a3a29', boxShadow: '4px 4px 0 rgba(0,0,0,0.5)', overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(139,26,26,0.4)', borderBottom: '3px solid #5a3a29' }}>
              {['Nama', 'Email', 'Role', 'Level', 'XP', 'Wallet Address'].map(col => (
                <th key={col} style={{ fontFamily: '"Pixelify Sans"', fontSize: "0.9rem", color: '#fbbf24', padding: '12px 16px', textAlign: 'left', whiteSpace: 'nowrap' }}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_USERS.map((user, i) => (
              <tr key={user.id} style={{ borderBottom: '1px solid rgba(139,26,26,0.3)', background: i % 2 === 0 ? 'transparent' : 'rgba(139,26,26,0.07)' }}>
                <td style={{ fontFamily: '"Pixelify Sans"', fontSize: "0.9rem", color: '#fff', padding: '12px 16px' }}>{user.name}</td>
                <td style={{ fontFamily: '"Pixelify Sans"', fontSize: "0.9rem", color: 'rgba(255,255,255,0.6)', padding: '12px 16px' }}>{user.email}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ fontFamily: '"Pixelify Sans"', fontSize: "0.9rem", background: roleColor[user.role], border: `1px solid ${roleBorder[user.role]}`, color: '#fff', padding: '3px 8px' }}>{user.role}</span>
                </td>
                <td style={{ fontFamily: '"Pixelify Sans"', fontSize: "0.9rem", color: '#fbbf24', padding: '12px 16px' }}>Lv.{user.level}</td>
                <td style={{ fontFamily: '"Pixelify Sans"', fontSize: "0.9rem", color: '#10b981', padding: '12px 16px' }}>{user.xp.toLocaleString()} XP</td>
                <td style={{ fontFamily: 'monospace', fontSize: "0.9rem", color: user.wallet === '—' ? 'rgba(255,255,255,0.3)' : '#a78bfa', padding: '12px 16px' }}>{user.wallet}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
