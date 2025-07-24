import { Suspense } from 'react'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { WorkflowsHeader } from '@/components/workflows/workflows-header'
import { WorkflowsGrid } from '@/components/workflows/workflows-grid'
import { WorkflowsFilters } from '@/components/workflows/workflows-filters'
import { EnhancedProjectsGridV2 } from '@/components/projects/enhanced-projects-grid-v2'
import { LoadingState } from '@/components/ui/loading-state'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GitBranch, FolderOpen } from 'lucide-react'

export default function ProjectsPage() {
  return (
    <DashboardShell>
      <div className="min-h-screen">
        {/* Animated background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000" />
        </div>

        <div className="relative z-10 p-8">
          <Tabs defaultValue="projects" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  AI Projects & Workflows 
                </h1>
                <p className="text-gray-400 mt-2">
                  Browse existing projects or view active pipeline executions
                </p>
              </div>
              <TabsList className="bg-gray-900/50 border border-white/10">
                <TabsTrigger value="projects" className="data-[state=active]:bg-white/10">
                  <FolderOpen className="w-4 h-4 mr-2" />
                  Projects (2,265+)
                </TabsTrigger>
                <TabsTrigger value="workflows" className="data-[state=active]:bg-white/10">
                  <GitBranch className="w-4 h-4 mr-2" />
                  Workflows
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="projects" className="space-y-6">
              <Suspense fallback={<LoadingState />}>
                <EnhancedProjectsGridV2 />
              </Suspense>
            </TabsContent>

            <TabsContent value="workflows" className="space-y-6">
              <Suspense fallback={<LoadingState />}>
                <WorkflowsHeader />
              </Suspense>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Filters sidebar */}
                <div className="lg:col-span-1">
                  <Suspense fallback={<LoadingState />}>
                    <WorkflowsFilters />
                  </Suspense>
                </div>

                {/* Workflows grid */}
                <div className="lg:col-span-3">
                  <Suspense fallback={<LoadingState />}>
                    <WorkflowsGrid />
                  </Suspense>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardShell>
  )
}