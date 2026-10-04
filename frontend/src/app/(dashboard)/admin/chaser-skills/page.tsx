'use client';

import CourseManager from '@/components/admin/CourseManager';

export default function ChaserSkillsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <CourseManager audience="chaser" />
    </div>
  );
}
