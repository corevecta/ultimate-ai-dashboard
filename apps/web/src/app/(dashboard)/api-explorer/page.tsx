import { DashboardShell } from '../../../../components/layout/dashboard-shell';
import { APIExplorer } from '../../../components/api/api-explorer';

export default function APIExplorerPage() {
  return (
    <DashboardShell>
      <APIExplorer />
    </DashboardShell>
  );
}