import { DashboardShell } from '../../../../../components/layout/dashboard-shell';
import { DistributedTracingViewer } from '../../../../components/tracing/distributed-tracing-viewer';

export default function TracingPage() {
  return (
    <DashboardShell>
      <DistributedTracingViewer />
    </DashboardShell>
  );
}