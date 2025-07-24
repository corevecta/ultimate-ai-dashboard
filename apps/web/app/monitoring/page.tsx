import { DashboardShell } from '@/components/layout/dashboard-shell';
import { EnhancedMonitoringDashboard } from '@/components/monitoring/enhanced-monitoring-dashboard';

export default function MonitoringPage() {
  return (
    <DashboardShell>
      <EnhancedMonitoringDashboard />
    </DashboardShell>
  );
}