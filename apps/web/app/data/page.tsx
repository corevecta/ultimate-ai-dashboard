'use client';

import React from 'react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import EnhancedDataDashboard from '@/components/data/enhanced-data-dashboard';

export default function DataPage() {
  return (
    <DashboardShell>
      <EnhancedDataDashboard />
    </DashboardShell>
  );
}