import { Suspense } from 'react'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { ErrorsHeader } from '@/components/errors/errors-header'
import { ErrorsList } from '@/components/errors/errors-list'
import { ErrorsStats } from '@/components/errors/errors-stats'
import { LoadingState } from '@/components/ui/loading-state'

export default function ErrorsPage() {
  return (
    <DashboardShell>
      <div className="min-h-screen">
        {/* Animated background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-transparent to-orange-900/20" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
          <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000" />
        </div>

        <div className="relative z-10 p-8 space-y-8">
          <Suspense fallback={<LoadingState />}>
            <ErrorsHeader />
          </Suspense>

          <Suspense fallback={<LoadingState />}>
            <ErrorsStats />
          </Suspense>

          <Suspense fallback={<LoadingState />}>
            <ErrorsList />
          </Suspense>
        </div>
      </div>
    </DashboardShell>
  )
}