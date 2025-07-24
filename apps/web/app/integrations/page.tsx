'use client';

import React from 'react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import EnhancedIntegrationsDashboard from '@/components/integrations/enhanced-integrations-dashboard';

export default function IntegrationsPage() {
  return (
    <DashboardShell>
      <EnhancedIntegrationsDashboard />
    </DashboardShell>
  );
}