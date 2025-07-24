import { Suspense } from 'react'
import { DashboardShell } from '../../components/layout/dashboard-shell'
import { AnalyticsHeader } from '../../components/analytics/analytics-header'
import { MetricsChart } from '../../components/analytics/metrics-chart'
import { PerformanceMetrics } from '../../components/analytics/performance-metrics'
import { UsageHeatmap } from '../../components/analytics/usage-heatmap'
import { LoadingState } from '../../components/ui/loading-state'

export default function AnalyticsPage() {
  return (
    <DashboardShell>
      <div className="min-h-screen">
        {/* Animated background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-900/20 via-transparent to-purple-900/20" />
          <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
          <div className="absolute bottom-1/4 right-1/2 w-[600px] h-[600px] bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000" />
        </div>

        <div className="relative z-10 p-8">
          <Suspense fallback={<LoadingState />}>
            <AnalyticsHeader />
          </Suspense>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main chart */}
            <div className="lg:col-span-2">
              <Suspense fallback={<LoadingState />}>
                <MetricsChart />
              </Suspense>
            </div>

            {/* Performance metrics */}
            <div className="lg:col-span-1">
              <Suspense fallback={<LoadingState />}>
                <PerformanceMetrics />
              </Suspense>
            </div>
          </div>

          {/* Usage heatmap */}
          <div className="mt-8">
            <Suspense fallback={<LoadingState />}>
              <UsageHeatmap />
            </Suspense>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}