'use client';

import React from 'react';
import styles from './page.module.css';
import RelicsAndTreasures from '@/components/ui/RelicsAndTreasures';
import OnChainCertificates from '@/components/ui/OnChainCertificates';

export default function CertificateHubPage() {
  return (
    <div className={styles.container}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h2 className={styles.headerTitle}>RELICS & TREASURES (WEB3 VAULT)</h2>
        <p className={styles.headerDesc}>
          Lihat dan verifikasi sertifikat On-Chain (SBT) yang berhasil kamu dapatkan setelah menaklukkan Boss Modul.
        </p>
      </div>

      <OnChainCertificates hideHeader={true} />
      
      <RelicsAndTreasures hideHeader={false} />
    </div>
  );
}
