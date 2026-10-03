'use client';

import React from 'react';
import styles from './page.module.css';
import RelicsAndTreasures from '@/components/ui/RelicsAndTreasures';
import OnChainCertificates from '@/components/ui/OnChainCertificates';
import { useTranslation } from '@/hooks/useTranslation';

export default function CertificateHubPage() {
  return (
    <div className={styles.container}>
      <div>
        <h2 className={styles.headerTitle}>{t('common.relicsTitle')}</h2>
        <p className={styles.headerDesc}>
          {t('common.relicsDesc')}
        </p>
      </div>

      <OnChainCertificates hideHeader={true} />
      
      <RelicsAndTreasures hideHeader={false} />
    </div>
  );
}
