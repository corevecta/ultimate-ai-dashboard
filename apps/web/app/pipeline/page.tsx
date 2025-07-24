import { Suspense } from 'react'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { PipelineHeader } from '@/components/pipeline/pipeline-header'
import { PipelineBuilder } from '@/components/pipeline/pipeline-builder'
import { PipelineStats } from '@/components/pipeline/pipeline-stats'
import { LoadingState } from '@/components/ui/loading-state'

export default function PipelinePage() {
  return (
    <DashboardShell>
      <div className="min-h-screen">
        {/* Animated background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-transparent to-purple-900/20" />
          <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
          <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000" />
        </div>

        <div className="relative z-10 p-8 space-y-8">
          <Suspense fallback={<LoadingState />}>
            <PipelineHeader />
          </Suspense>

          <Suspense fallback={<LoadingState />}>
            <PipelineStats />
          </Suspense>

          <Suspense fallback={<LoadingState />}>
            <PipelineBuilder />
          </Suspense>
        </div>
      </div>
    </DashboardShell>
  )
}