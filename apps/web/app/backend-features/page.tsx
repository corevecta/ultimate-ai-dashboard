import React from 'react'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import EnhancedBackendFeaturesDashboard from '@/components/backend-features/enhanced-backend-features-dashboard'

export default function BackendFeaturesPage() {
  return (
    <DashboardShell>
      <EnhancedBackendFeaturesDashboard />
    </DashboardShell>
  )
}