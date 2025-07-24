import { DashboardShell } from '@/components/layout/dashboard-shell';
import { AgentManagementDashboard } from '@/components/agents/agent-management-dashboard';

export default function AgentsPage() {
  return (
    <DashboardShell>
      <AgentManagementDashboard />
    </DashboardShell>
  );
}