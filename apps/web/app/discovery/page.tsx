import { DashboardShell } from '@/components/layout/dashboard-shell';
import { FeatureDiscoveryDashboard } from '@/src/components/discovery/feature-discovery-dashboard';

export default function DiscoveryPage() {
  return (
    <DashboardShell>
      <FeatureDiscoveryDashboard />
    </DashboardShell>
  );
}