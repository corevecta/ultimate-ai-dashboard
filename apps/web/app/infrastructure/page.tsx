'use client';

import React from 'react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import EnhancedInfrastructureDashboard from '@/components/infrastructure/enhanced-infrastructure-dashboard';

export default function InfrastructurePage() {
  return (
    <DashboardShell>
      <EnhancedInfrastructureDashboard />
    </DashboardShell>
  );
}