import { Suspense } from 'react'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { SettingsHeader } from '@/components/settings/settings-header'
import { SettingsSidebar } from '@/components/settings/settings-sidebar'
import { GeneralSettings } from '@/components/settings/general-settings'
import { LoadingState } from '@/components/ui/loading-state'

export default function SettingsPage() {
  return (
    <DashboardShell>
      <div className="min-h-screen">
        {/* Animated background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-transparent to-gray-900/50" />
          <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-gray-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
          <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] bg-slate-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000" />
        </div>

        <div className="relative z-10 p-8">
          <Suspense fallback={<LoadingState />}>
            <SettingsHeader />
          </Suspense>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Suspense fallback={<LoadingState />}>
                <SettingsSidebar />
              </Suspense>
            </div>

            {/* Settings content */}
            <div className="lg:col-span-3">
              <Suspense fallback={<LoadingState />}>
                <GeneralSettings />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}