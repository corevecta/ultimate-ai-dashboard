import { Suspense } from 'react'
import { DashboardShell } from '../../components/layout/dashboard-shell'
import { JobsHeader } from '../../components/jobs/jobs-header'
import { JobQueue } from '../../components/jobs/job-queue'
import { JobStats } from '../../components/jobs/job-stats'
import { LoadingState } from '../../components/ui/loading-state'

export default function JobsPage() {
  return (
    <DashboardShell>
      <div className="min-h-screen">
        {/* Animated background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-transparent to-yellow-900/20" />
          <div className="absolute top-1/3 left-1/2 w-[500px] h-[500px] bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
          <div className="absolute bottom-1/2 right-1/3 w-[500px] h-[500px] bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000" />
        </div>

        <div className="relative z-10 p-8">
          <Suspense fallback={<LoadingState />}>
            <JobsHeader />
          </Suspense>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Stats */}
            <div className="lg:col-span-1">
              <Suspense fallback={<LoadingState />}>
                <JobStats />
              </Suspense>
            </div>

            {/* Job queue */}
            <div className="lg:col-span-3">
              <Suspense fallback={<LoadingState />}>
                <JobQueue />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}