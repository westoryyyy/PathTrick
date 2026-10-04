'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SkillsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/chaser-skills');
  }, [router]);

  return null;
}
