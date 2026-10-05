'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

/**
 * Fallback: muncul hanya saat user belum punya hasil asesmen (tidak ada match data),
 * mis. user refresh / tekan tombol kembali sebelum asesmen selesai.
 */
export default function StartAssessmentButton({ role }: { role: 'dreamer' | 'chaser' }) {
  const router = useRouter();

  const handleStart = async () => {
    const { useOnboardingStore } = await import('@/store/useOnboardingStore');
    const store = useOnboardingStore.getState();
    store.setRole(role, store.savedPrivyUserId ?? undefined);
    if (role === 'dreamer') {
      useOnboardingStore.setState({ selectedRole: 'dreamer', onboardingCompleted: false });
    } else {
      useOnboardingStore.setState({
        chaserAssessment: {
          cvFile: null,
          cvFileName: '',
          cvExtractionStatus: 'idle',
          cvExtractedData: null,
          cvText: '',
          portfolioFile: null,
          portfolioFileName: '',
          portfolioText: '',
          workInterests: [],
          preferredGICS: [],
        },
        onboardingCompleted: false,
      });
    }
    router.push('/assessment');
  };

  return (
    <button
      id="start-assessment-btn"
      onClick={handleStart}
      style={{ alignSelf: 'flex-start', padding: '12px 20px', background: '#fbbf24', color: '#3b261b', fontFamily: '"Press Start 2P"', fontSize: '0.75rem', border: '3px solid #3b261b', boxShadow: '4px 4px 0 #3b261b', cursor: 'pointer' }}
    >
      MULAI ASESMEN
    </button>
  );
}
