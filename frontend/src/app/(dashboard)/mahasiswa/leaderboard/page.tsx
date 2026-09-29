'use client';

import React from 'react';
import RelicsAndTreasures from '@/components/ui/RelicsAndTreasures';
import OnChainCertificates from '@/components/ui/OnChainCertificates';
import { useTranslation } from '@/hooks/useTranslation';

export default function LeaderboardPage() {
  const { t } = useTranslation();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Header Khusus Mahasiswa Leaderboard / Skill Badges */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h2 style={{ fontFamily: '"Press Start 2P"', fontSize: '1.5rem', color: '#fff', textShadow: '2px 2px 0 #3b261b' }}>
          {t('mahasiswa.leaderboard.title')}
        </h2>
        <p style={{ fontFamily: '"Pixelify Sans", sans-serif', fontSize: '1.2rem', color: '#d4d4d8', lineHeight: '1.6', maxWidth: '800px' }}>
          {t('mahasiswa.leaderboard.subtitle')}
        </p>
      </div>

      <OnChainCertificates hideHeader={true} />

      <div id="relics" style={{ scrollMarginTop: '80px' }}>
        <RelicsAndTreasures hideHeader={false} statsLabel={t('mahasiswa.leaderboard.badgesUnlocked')} />
      </div>
    </div>
  );
}
