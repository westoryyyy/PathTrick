'use client';

import React from 'react';
import styles from './page.module.css';
import RelicsAndTreasures from '@/components/ui/RelicsAndTreasures';
import OnChainCertificates from '@/components/ui/OnChainCertificates';

export default function CertificateHubPage() {
  return (
    <div className={styles.container}>
      <div style={{ marginBottom: '32px' }}>
        <h2 className={styles.headerTitle}>RELICS & TREASURES (WEB3 VAULT)</h2>
        <p className={styles.headerDesc}>
          Koleksi eksklusif Soulbound Token (SBT) sebagai bukti nyata pencapaianmu. Semua sertifikat di bawah ini terenkripsi dan abadi di dalam Blockchain.
        </p>
      </div>

      <OnChainCertificates hideHeader={true} />
      
      <RelicsAndTreasures hideHeader={false} />
    </div>
  );
}
