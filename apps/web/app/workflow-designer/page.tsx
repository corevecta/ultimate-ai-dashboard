import { DashboardShell } from '@/components/layout/dashboard-shell';
import { VisualWorkflowDesigner } from '@/components/workflow/visual-workflow-designer';

export default function WorkflowDesignerPage() {
  return (
    <DashboardShell>
      <div className="h-[calc(100vh-4rem)]">
        <VisualWorkflowDesigner />
      </div>
    </DashboardShell>
  );
}