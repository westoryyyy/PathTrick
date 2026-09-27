'use client';

import { Suspense } from 'react';
import MahasiswaLearningProgress from '@/components/learning/MahasiswaLearningProgress';

export default function LearningMissionPage() {
  return (
    <Suspense fallback={<div style={{ fontFamily: '"Press Start 2P"', color: '#fbbf24', textAlign: 'center', marginTop: '50px' }}>LOADING MISSION DATA...</div>}>
      <MahasiswaLearningProgress />
    </Suspense>
  );
}
