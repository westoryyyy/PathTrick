'use client';

import { Suspense } from 'react';
import MahasiswaLearningProgress from '@/components/learning/MahasiswaLearningProgress';
import { PixelSkeletonRows } from '@/components/ui/PixelSkeleton';

export default function LearningMissionPage() {
  return (
    <Suspense fallback={<div style={{ marginTop: '50px' }}><PixelSkeletonRows count={4} /></div>}>
      <MahasiswaLearningProgress />
    </Suspense>
  );
}
