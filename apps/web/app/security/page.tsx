'use client';

import React from 'react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import EnhancedSecurityDashboard from '@/components/security/enhanced-security-dashboard';

export default function SecurityPage() {
  return (
    <DashboardShell>
      <EnhancedSecurityDashboard />
    </DashboardShell>
  );
}