'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useOnboardingStore } from '@/store/useOnboardingStore';
import AssessmentWizard from '@/components/assessment/AssessmentWizard';
import styles from './page.module.css';

export default function AssessmentPage() {
  const router = useRouter();
  const role = useOnboardingStore((s) => s.selectedRole);

  // Redirect if no role selected
  useEffect(() => {
    if (!role) {
      router.replace('/select-role');
    }
  }, [role, router]);

  if (!role) return null;

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <Image src="/PathTrick.png" alt="PathTrick" width={200} height={50} className={styles.logoImg} priority />
        <span className={styles.roleBadge}>
          {role === 'sma' ? '🌟 The Dreamer' : '🔥 The Chaser'}
        </span>
      </div>

      {/* Main Wizard */}
      <div className={styles.container}>
        <AssessmentWizard />
      </div>
    </div>
  );
}

