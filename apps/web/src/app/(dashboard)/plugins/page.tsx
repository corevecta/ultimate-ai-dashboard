import { DashboardShell } from '@/components/layout/dashboard-shell';
import { PluginMarketplace } from '@/components/plugins/plugin-marketplace';

export default function PluginsPage() {
  return (
    <DashboardShell>
      <PluginMarketplace />
    </DashboardShell>
  );
}