import Dashboard from '@/components/ui/Dashboard';

export const metadata = {
  title: 'Dashboard SMA | PATHTRICK',
  description: 'Post-RIASEC Dashboard for SMA Role',
};

export default function SMADashboardPage() {
  return (
    <div className="min-h-screen w-full">
      <Dashboard />
    </div>
  );
}
