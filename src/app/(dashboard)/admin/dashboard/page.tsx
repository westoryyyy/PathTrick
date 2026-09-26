'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';

const px = { fontFamily: '"Pixelify Sans", sans-serif' } as React.CSSProperties;

const STATS = [
  { label: 'Total Users', value: '1,284', img: '/NPC University Student.png', color: '#3b82f6', border: '#1d4ed8' },
  { label: 'Courses', value: '32', img: '/Journall.png', color: '#f59e0b', border: '#b45309' },
  { label: 'Beasiswa', value: '18', img: '/Gold Ticket.png', color: '#10b981', border: '#065f46' },
  { label: 'Lowongan', value: '47', img: '/Compass.png', color: '#8b5cf6', border: '#5b21b6' },
];

const QUICK_LINKS = [
  { href: '/admin/universities', label: 'Manajemen Universitas', img: '/Compass.png', desc: 'Tambah, edit, hapus data kampus & jurusan' },
  { href: '/admin/scholarships', label: 'Manajemen Beasiswa', img: '/Gold Ticket.png', desc: 'Kelola info beasiswa & deadline pendaftaran' },
  { href: '/admin/jobs', label: 'Lowongan Kerja', img: '/Blade.png', desc: 'Posting & kelola peluang karir mahasiswa' },
  { href: '/admin/courses', label: 'Manajemen Course', img: '/Journall.png', desc: 'Buat & edit materi belajar & kuis' },
  { href: '/admin/users', label: 'Data Pengguna', img: '/NPC University Student.png', desc: 'Monitor progres & data seluruh user' },
];

const RECENT_ACTIVITY = [
  { time: '5 menit lalu', action: 'Beasiswa LPDP 2026 ditambahkan', type: 'add' },
  { time: '1 jam lalu', action: 'Course "React Advanced" diperbarui', type: 'edit' },
  { time: '3 jam lalu', action: 'Lowongan Backend Developer dihapus', type: 'delete' },
  { time: '1 hari lalu', action: '12 user baru mendaftar', type: 'info' },
];

const typeColor: Record<string, string> = { add: '#10b981', edit: '#f59e0b', delete: '#ef4444', info: '#3b82f6' };
const typeLabel: Record<string, string> = { add: '+', edit: '~', delete: 'x', info: 'i' };

export default function AdminDashboardPage() {
  return (
    <div className={styles.page}>

      {/* ── Header ── */}
      <div className={styles.pageHeader}>
        <div className={styles.pageTitleWrap}>
          <Image src="/NPC Admin.png" alt="" width={72} height={72} style={{ imageRendering: 'pixelated' }} />
          <div>
            <h1 className={styles.pageTitle}>Selamat Datang, Admin!</h1>
            <p className={styles.pageSubtitle}>Kelola konten, pengguna, dan data rekomendasi PathTrick dari panel ini.</p>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className={styles.statsGrid}>
        {STATS.map((stat) => (
          <div key={stat.label} className={styles.statCard} style={{ borderColor: stat.border }}>
            <div className={styles.statIcon} style={{ background: `${stat.color}22`, border: `3px solid ${stat.color}` }}>
              <Image src={stat.img} alt="" width={28} height={28} style={{ imageRendering: 'pixelated', objectFit: 'contain', width: '28px', height: '28px' }} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue} style={{ color: stat.color }}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.mainGrid}>

        {/* ── Quick Links ── */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>Aksi Cepat</span>
          </div>
          <div className={styles.quickLinksGrid}>
            {QUICK_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={styles.quickCard}>
                <Image src={link.img} alt="" width={22} height={22} style={{ imageRendering: 'pixelated', flexShrink: 0 }} />
                <div>
                  <div className={styles.quickLabel}>{link.label}</div>
                  <div className={styles.quickDesc}>{link.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Recent Activity ── */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>Aktivitas Terbaru</span>
          </div>
          <div className={styles.activityList}>
            {RECENT_ACTIVITY.map((act, i) => (
              <div key={i} className={styles.activityItem}>
                <div className={styles.activityDot} style={{ background: typeColor[act.type], color: '#fff' }}>
                  {typeLabel[act.type]}
                </div>
                <div className={styles.activityContent}>
                  <span className={styles.activityAction}>{act.action}</span>
                  <span className={styles.activityTime}>{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
