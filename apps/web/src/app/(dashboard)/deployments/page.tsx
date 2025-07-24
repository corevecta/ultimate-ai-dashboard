import { DashboardShell } from '@/components/layout/dashboard-shell';
import { DeploymentCenter } from '@/components/deployment/deployment-center';

export default function DeploymentsPage() {
  return (
    <DashboardShell>
      <DeploymentCenter />
    </DashboardShell>
  );
}