import { Suspense } from 'react'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { DocsHeader } from '@/components/docs/docs-header'
import { DocsList } from '@/components/docs/docs-list'
import { DocsCategories } from '@/components/docs/docs-categories'
import { LoadingState } from '@/components/ui/loading-state'

export default function DocsPage() {
  return (
    <DashboardShell>
      <div className="min-h-screen">
        {/* Animated background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-transparent to-purple-900/20" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
          <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000" />
        </div>

        <div className="relative z-10 p-8 space-y-8">
          <Suspense fallback={<LoadingState />}>
            <DocsHeader />
          </Suspense>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <Suspense fallback={<LoadingState />}>
                <DocsCategories />
              </Suspense>
            </div>
            
            <div className="lg:col-span-3">
              <Suspense fallback={<LoadingState />}>
                <DocsList />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}