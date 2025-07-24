import { DashboardShell } from '../../../../components/layout/dashboard-shell';
import { AdvancedMonitoringDashboard } from '../../../components/monitoring/advanced-monitoring-dashboard';

export default function MonitoringPage() {
  return (
    <DashboardShell>
      <AdvancedMonitoringDashboard />
    </DashboardShell>
  );
}