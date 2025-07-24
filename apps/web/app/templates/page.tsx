import { Suspense } from 'react'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { TemplatesHeader } from '@/components/templates/templates-header'
import { TemplatesGrid } from '@/components/templates/templates-grid'
import { TemplateCategories } from '@/components/templates/template-categories'
import { LoadingState } from '@/components/ui/loading-state'

export default function TemplatesPage() {
  return (
    <DashboardShell>
      <div className="min-h-screen">
        {/* Animated background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-transparent to-teal-900/20" />
          <div className="absolute top-1/2 left-1/3 w-[600px] h-[600px] bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
          <div className="absolute bottom-1/3 right-1/3 w-[600px] h-[600px] bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000" />
        </div>

        <div className="relative z-10 p-8">
          <Suspense fallback={<LoadingState />}>
            <TemplatesHeader />
          </Suspense>

          <div className="mt-8">
            <Suspense fallback={<LoadingState />}>
              <TemplateCategories />
            </Suspense>
          </div>

          <div className="mt-8">
            <Suspense fallback={<LoadingState />}>
              <TemplatesGrid />
            </Suspense>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}