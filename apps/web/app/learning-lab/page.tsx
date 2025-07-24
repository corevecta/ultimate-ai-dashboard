import { DashboardShell } from '@/components/layout/dashboard-shell';
import { LearningEvolutionLab } from '@/components/learning/learning-evolution-lab';

export default function LearningLabPage() {
  return (
    <DashboardShell>
      <LearningEvolutionLab />
    </DashboardShell>
  );
}