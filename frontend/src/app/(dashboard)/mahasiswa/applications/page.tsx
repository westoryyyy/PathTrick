'use client';

import Link from 'next/link';
import styles from '@/components/ui/Dashboard.module.css';
import { useTranslation } from '@/hooks/useTranslation';

export default function ApplicationsPage() {
  const { t } = useTranslation();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* ── Header ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h1 style={{ fontFamily: '"Press Start 2P"', fontSize: '1.5rem', color: '#fff', textShadow: '2px 2px 0 #3b261b' }}>
          {t('mahasiswa.applications.title')}
        </h1>
        <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.8rem', color: '#d4d4d8', lineHeight: '1.6' }}>
          {t('mahasiswa.applications.subtitle')}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className={styles.retroCard} style={{ borderColor: '#047857', boxShadow: '0 0 15px rgba(4,120,87,0.3)' }}>
          <div className={styles.cardHeader} style={{ background: '#064e3b' }}>
            <span className={styles.cardTitle}>{t('mahasiswa.applications.applicationSuccessful')}</span>
          </div>
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ fontFamily: '"Press Start 2P"', fontSize: '1rem', color: '#34d399' }}>Junior Web Developer @ Tokopedia</h2>
            <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.7rem', color: '#d4d4d8', lineHeight: '1.8' }}>
              Your verified skills (React, Git Basics) were successfully packaged as a Zero-Knowledge Proof and submitted securely.
              The recruiter can cryptographically verify your qualifications without seeing your personal data yet.
            </p>
            <div style={{ marginTop: '16px', padding: '16px', background: 'rgba(0,0,0,0.3)', border: '2px dashed #047857' }}>
              <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.6rem', color: '#fbbf24' }}>{t('mahasiswa.applications.statusUnderReview')}</span>
            </div>
          </div>
        </div>
      </div>

      <Link href="/mahasiswa/career-hub" style={{
        marginTop: '32px',
        display: 'inline-block',
        padding: '16px 24px',
        fontFamily: '"Press Start 2P"',
        fontSize: '0.8rem',
        color: '#fff',
        background: '#b45309',
        border: '2px solid #78350f',
        boxShadow: '4px 4px 0 #78350f',
        cursor: 'pointer',
        textAlign: 'center',
        textDecoration: 'none',
        alignSelf: 'flex-start'
      }}>
        {t('mahasiswa.applications.backToCareerHub')}
      </Link>
    </div>
  );
}
