import { Suspense } from 'react'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { PlatformsHeader } from '@/components/platforms/platforms-header'
import { PlatformsList } from '@/components/platforms/platforms-list'
import { PlatformStats } from '@/components/platforms/platform-stats'
import { LoadingState } from '@/components/ui/loading-state'

export default function PlatformsPage() {
  return (
    <DashboardShell>
      <div className="min-h-screen">
        {/* Animated background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 via-transparent to-red-900/20" />
          <div className="absolute top-1/4 left-1/2 w-[500px] h-[500px] bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
          <div className="absolute bottom-1/2 right-1/4 w-[500px] h-[500px] bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000" />
        </div>

        <div className="relative z-10 p-8">
          <Suspense fallback={<LoadingState />}>
            <PlatformsHeader />
          </Suspense>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Stats */}
            <div className="lg:col-span-1">
              <Suspense fallback={<LoadingState />}>
                <PlatformStats />
              </Suspense>
            </div>

            {/* Platforms list */}
            <div className="lg:col-span-2">
              <Suspense fallback={<LoadingState />}>
                <PlatformsList />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}