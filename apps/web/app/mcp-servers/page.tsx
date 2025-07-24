import { Suspense } from 'react'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { MCPServersHeader } from '@/components/mcp-servers/mcp-servers-header'
import { MCPServersList } from '@/components/mcp-servers/mcp-servers-list'
import { MCPServersStats } from '@/components/mcp-servers/mcp-servers-stats'
import { LoadingState } from '@/components/ui/loading-state'

export default function MCPServersPage() {
  return (
    <DashboardShell>
      <div className="min-h-screen">
        {/* Animated background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-transparent to-blue-900/20" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
          <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000" />
        </div>

        <div className="relative z-10 p-8 space-y-8">
          <Suspense fallback={<LoadingState />}>
            <MCPServersHeader />
          </Suspense>

          <Suspense fallback={<LoadingState />}>
            <MCPServersStats />
          </Suspense>

          <Suspense fallback={<LoadingState />}>
            <MCPServersList />
          </Suspense>
        </div>
      </div>
    </DashboardShell>
  )
}