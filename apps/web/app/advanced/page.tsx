'use client';

import React from 'react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { EnhancedAdvancedDashboard } from '@/components/advanced/enhanced-advanced-dashboard';

export default function AdvancedPage() {
  return (
    <DashboardShell>
      <EnhancedAdvancedDashboard />
    </DashboardShell>
  );
}