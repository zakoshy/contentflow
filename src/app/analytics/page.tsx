import { Header } from '@/components/layout/Header';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <AnalyticsDashboard />
      </main>
    </div>
  );
}
