'use client';

import React from 'react';
import RelicsAndTreasures from '@/components/ui/RelicsAndTreasures';
import OnChainCertificates from '@/components/ui/OnChainCertificates';

export default function LeaderboardPage() {
  return (
    <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header Khusus Mahasiswa Leaderboard / Skill Badges */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px' }}>
        <h2 style={{ fontFamily: '"Press Start 2P"', fontSize: '1.5rem', color: '#fff', textShadow: '2px 2px 0 #3b261b' }}>
          SKILL BADGES & CERTIFICATES
        </h2>
        <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.8rem', color: '#d4d4d8', lineHeight: '1.6' }}>
          Tunjukkan keahlianmu kepada dunia! Kumpulkan badge ini dengan menyelesaikan modul dan jadikan portofolio Web3 kamu semakin bersinar untuk memikat para rekruter dan kampus idaman.
        </p>
      </div>

      <OnChainCertificates hideHeader={true} />

      <RelicsAndTreasures hideHeader={false} statsLabel="BADGES UNLOCKED" />
    </div>
  );
}
