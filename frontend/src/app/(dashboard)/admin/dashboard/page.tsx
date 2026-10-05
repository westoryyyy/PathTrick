'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import styles from './page.module.css';
import { API_BASE_URL } from '@/config/pathtrick';
import { getAuthHeaders } from '@/hooks/useAuthSync';

interface Stats {
  users: number;
  courses: number;
  scholarships: number;
  jobs: number;
}

const QUICK_LINKS = [
  { href: '/admin/universities', label: 'Manajemen Universitas', img: '/Compass.png', desc: 'Tambah, edit, hapus data kampus & jurusan' },
  { href: '/admin/scholarships', label: 'Manajemen Beasiswa', img: '/Gold Ticket.png', desc: 'Kelola info beasiswa & deadline pendaftaran' },
  { href: '/admin/jobs', label: 'Lowongan Kerja', img: '/Blade.png', desc: 'Posting & kelola peluang karir mahasiswa' },
  { href: '/admin/courses', label: 'Manajemen Course', img: '/Journall.png', desc: 'Buat & edit materi belajar & kuis' },
  { href: '/admin/users', label: 'Data Pengguna', img: '/NPC University Student.png', desc: 'Monitor progres & data seluruh user' },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/admin/stats`, { headers: getAuthHeaders() })
      .then(r => r.json())
      .then((data: Stats) => setStats(data))
      .catch(() => {/* non-critical */})
      .finally(() => setLoading(false));
  }, []);

  const STAT_CARDS = [
    { label: 'Total Users', value: stats?.users ?? 0, img: '/NPC University Student.png', color: '#3b82f6', border: '#1d4ed8' },
    { label: 'Courses', value: stats?.courses ?? 0, img: '/Journall.png', color: '#f59e0b', border: '#b45309' },
    { label: 'Beasiswa', value: stats?.scholarships ?? 0, img: '/Gold Ticket.png', color: '#10b981', border: '#065f46' },
    { label: 'Lowongan', value: stats?.jobs ?? 0, img: '/Compass.png', color: '#8b5cf6', border: '#5b21b6' },
  ];

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
        {STAT_CARDS.map((stat) => (
          <div key={stat.label} className={styles.statCard} style={{ borderColor: stat.border }}>
            <div className={styles.statIcon} style={{ background: `${stat.color}22`, border: `3px solid ${stat.color}` }}>
              <Image src={stat.img} alt="" width={28} height={28} style={{ imageRendering: 'pixelated', objectFit: 'contain', width: '28px', height: 28 }} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue} style={{ color: stat.color }}>
                {loading ? '…' : stat.value.toLocaleString()}
              </span>
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
                <Image src={link.img} alt="" width={22} height={22} style={{ imageRendering: 'pixelated', flexShrink: 0, height: 22 }} />
                <div>
                  <div className={styles.quickLabel}>{link.label}</div>
                  <div className={styles.quickDesc}>{link.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Recent Activity: no audit log table in DB — unsupported ── */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>Aktivitas Terbaru</span>
          </div>
          <div className={styles.activityList}>
            <div style={{ padding: '24px 16px', textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontFamily: '"Pixelify Sans", sans-serif', fontSize: '0.85rem' }}>
              Log aktivitas belum tersedia (fitur audit log belum diimplementasikan).
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}



