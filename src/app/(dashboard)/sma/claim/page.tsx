'use client';

import React from 'react';
import CertificateMinter from '@/components/ui/CertificateMinter';
import styles from '../certificate/page.module.css';

export default function ClaimCertificateDemoPage() {
  return (
    <div className={styles.container}>
      <div style={{ marginBottom: '32px' }}>
        <h2 className={styles.headerTitle}>KLAIM SERTIFIKAT (DEMO)</h2>
        <p className={styles.headerDesc}>
          Selamat! Kamu berhasil menaklukkan Boss Modul 1. 
          Silakan klaim Sertifikat Web3 (SBT) kamu di bawah ini.
        </p>
      </div>

      {/* Di sini kita pasang Minter-nya dan kasih courseId = 1 secara hardcode untuk testing */}
      <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <CertificateMinter courseId={1} />
      </div>
    </div>
  );
}
