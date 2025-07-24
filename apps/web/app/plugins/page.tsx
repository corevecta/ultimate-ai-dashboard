import { Suspense } from 'react'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { PluginsHeader } from '@/components/plugins/plugins-header'
import { PluginsList } from '@/components/plugins/plugins-list'
import { PluginsStats } from '@/components/plugins/plugins-stats'
import { LoadingState } from '@/components/ui/loading-state'

export default function PluginsPage() {
  return (
    <DashboardShell>
      <div className="min-h-screen">
        {/* Animated background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-transparent to-emerald-900/20" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
          <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000" />
        </div>

        <div className="relative z-10 p-8 space-y-8">
          <Suspense fallback={<LoadingState />}>
            <PluginsHeader />
          </Suspense>

          <Suspense fallback={<LoadingState />}>
            <PluginsStats />
          </Suspense>

          <Suspense fallback={<LoadingState />}>
            <PluginsList />
          </Suspense>
        </div>
      </div>
    </DashboardShell>
  )
}