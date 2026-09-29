import Dashboard from '@/components/ui/Dashboard';

export const metadata = {
  title: 'Dashboard SMA | PATHTRICK',
  description: 'Post-RIASEC Dashboard for SMA Role',
};

import { Suspense } from 'react';

export default function SMADashboardPage() {
  return (
    <div className="min-h-screen w-full">
      <Suspense fallback={<div style={{ fontFamily: '"Press Start 2P"', padding: '24px', color: '#fbbf24' }}>LOADING DASHBOARD...</div>}>
        <Dashboard />
      </Suspense>
    </div>
  );
}
