import { Suspense } from 'react'
import { DashboardShell } from '../components/layout/dashboard-shell'
import { MetricsOverview } from '../components/dashboard/metrics-overview'
import { PipelineVisualization } from '../components/dashboard/pipeline-visualization'
import { ActivityFeed } from '../components/dashboard/activity-feed'
import { AgentPerformance } from '../components/dashboard/agent-performance'
import { SystemStatus } from '../components/dashboard/system-status'
import { AIInsights } from '../components/dashboard/ai-insights'
import { TokenUsage } from '../components/dashboard/token-usage'
import { LoadingState } from '../components/ui/loading-state'

export default function DashboardPage() {
  return (
    <DashboardShell>
      <div className="space-y-8 p-8">
        {/* Header with gradient text */}
        <div className="relative">
          <h1 className="text-5xl font-bold text-gradient mb-2">
            AI Orchestrator Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Real-time monitoring and control of your AI pipeline
          </p>
          
          {/* Live status indicator */}
          <div className="absolute top-0 right-0 flex items-center gap-2">
            <div className="relative">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping" />
            </div>
            <span className="text-sm text-muted-foreground">Live</span>
          </div>
        </div>

        {/* Metrics Overview */}
        <Suspense fallback={<LoadingState />}>
          <MetricsOverview />
        </Suspense>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pipeline Visualization - Takes 2 columns */}
          <div className="lg:col-span-2">
            <Suspense fallback={<LoadingState />}>
              <PipelineVisualization />
            </Suspense>
          </div>

          {/* System Status - 1 column */}
          <div>
            <Suspense fallback={<LoadingState />}>
              <SystemStatus />
            </Suspense>
          </div>
        </div>

        {/* Agent Performance and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Agent Performance */}
          <Suspense fallback={<LoadingState />}>
            <AgentPerformance />
          </Suspense>

          {/* Activity Feed */}
          <Suspense fallback={<LoadingState />}>
            <ActivityFeed />
          </Suspense>
        </div>

        {/* AI Insights Section */}
        <Suspense fallback={<LoadingState />}>
          <AIInsights />
        </Suspense>

        {/* Token Usage Section */}
        <Suspense fallback={<LoadingState />}>
          <TokenUsage />
        </Suspense>
      </div>
    </DashboardShell>
  )
}