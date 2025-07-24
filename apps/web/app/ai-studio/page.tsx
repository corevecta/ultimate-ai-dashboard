import { Suspense } from 'react'
import { DashboardShell } from '../../components/layout/dashboard-shell'
import { AiStudioHeader } from '../../components/ai-studio/ai-studio-header'
import { ModelSelector } from '../../components/ai-studio/model-selector'
import { PromptEditor } from '../../components/ai-studio/prompt-editor'
import { OutputViewer } from '../../components/ai-studio/output-viewer'
import { LoadingState } from '../../components/ui/loading-state'

export default function AiStudioPage() {
  return (
    <DashboardShell>
      <div className="min-h-screen">
        {/* Animated background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-transparent to-purple-900/20" />
          <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
          <div className="absolute bottom-1/3 left-1/4 w-[500px] h-[500px] bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000" />
        </div>

        <div className="relative z-10 p-8">
          <Suspense fallback={<LoadingState />}>
            <AiStudioHeader />
          </Suspense>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left side - Input */}
            <div className="space-y-6">
              <Suspense fallback={<LoadingState />}>
                <ModelSelector />
              </Suspense>
              <Suspense fallback={<LoadingState />}>
                <PromptEditor />
              </Suspense>
            </div>

            {/* Right side - Output */}
            <div>
              <Suspense fallback={<LoadingState />}>
                <OutputViewer />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}