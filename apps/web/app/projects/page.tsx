import { Suspense } from 'react'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { ProjectsHeader } from '@/components/projects/projects-header'
import { ProjectsGrid } from '@/components/projects/projects-grid'
import { ProjectsFilters } from '@/components/projects/projects-filters'
import { LoadingState } from '@/components/ui/loading-state'

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
          <Suspense fallback={<LoadingState />}>
            <ProjectsHeader />
          </Suspense>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters sidebar */}
            <div className="lg:col-span-1">
              <Suspense fallback={<LoadingState />}>
                <ProjectsFilters />
              </Suspense>
            </div>

            {/* Projects grid */}
            <div className="lg:col-span-3">
              <Suspense fallback={<LoadingState />}>
                <ProjectsGrid />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}