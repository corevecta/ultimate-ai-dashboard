'use client'

import { useState } from 'react'
import { 
  Button, 
  Card, 
  MetricCard, 
  StatusChip, 
  LoadingState, 
  ProgressBar,
  Alert,
  Tabs,
  Modal,
  Grid,
  Breadcrumb
} from '@ultimate-ai/shared-ui'
import { Activity, Zap, Users, TrendingUp } from 'lucide-react'
import { DashboardShell } from '@/components/layout/dashboard-shell'

export default function SharedUIDemoPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const metrics = [
    {
      label: 'Total Users',
      value: '12,847',
      change: '+12.5%',
      changeType: 'increase' as const,
      icon: <Users className="w-6 h-6 text-white" />,
      color: 'from-blue-500 to-cyan-500',
      trend: [30, 40, 35, 50, 49, 60, 70, 91, 85, 90]
    },
    {
      label: 'Performance',
      value: '98.2%',
      change: '+2.1%',
      changeType: 'increase' as const,
      icon: <Activity className="w-6 h-6 text-white" />,
      color: 'from-emerald-500 to-green-500',
      trend: [85, 87, 88, 90, 92, 94, 95, 96, 97, 98]
    }
  ]

  const tabItems = [
    {
      id: 'overview',
      label: 'Overview',
      content: <div>Overview content</div>
    },
    {
      id: 'details',
      label: 'Details',
      content: <div>Details content</div>
    },
    {
      id: 'settings',
      label: 'Settings',
      content: <div>Settings content</div>
    }
  ]

  return (
    <DashboardShell>
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Shared UI Components</h1>
          <p className="text-gray-400">Unified component library for all dashboards</p>
        </div>

        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Components' },
            { label: 'Shared UI Demo' }
          ]}
        />

        {/* Buttons Section */}
        <Card>
          <h2 className="text-2xl font-semibold text-white mb-4">Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="success">Success</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="warning">Warning</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="outline">Outline</Button>
            <Button loading>Loading</Button>
          </div>
        </Card>

        {/* Status Chips */}
        <Card>
          <h2 className="text-2xl font-semibold text-white mb-4">Status Chips</h2>
          <div className="flex flex-wrap gap-4">
            <StatusChip status="success" />
            <StatusChip status="error" />
            <StatusChip status="warning" />
            <StatusChip status="info" />
            <StatusChip status="pending" />
            <StatusChip status="active" />
            <StatusChip status="inactive" />
          </div>
        </Card>

        {/* Metric Cards */}
        <div>
          <h2 className="text-2xl font-semibold text-white mb-4">Metric Cards</h2>
          <Grid cols={{ sm: 1, md: 2, lg: 4 }}>
            {metrics.map((metric) => (
              <MetricCard key={metric.label} metric={metric} />
            ))}
          </Grid>
        </div>

        {/* Progress Bars */}
        <Card>
          <h2 className="text-2xl font-semibold text-white mb-4">Progress Bars</h2>
          <div className="space-y-4">
            <ProgressBar value={75} label="Upload Progress" showLabel />
            <ProgressBar value={45} variant="gradient" label="Processing" showLabel />
            <ProgressBar value={90} variant="striped" label="Completion" showLabel />
          </div>
        </Card>

        {/* Alerts */}
        <Card>
          <h2 className="text-2xl font-semibold text-white mb-4">Alerts</h2>
          <div className="space-y-4">
            <Alert 
              type="success" 
              title="Success!" 
              description="Your operation completed successfully." 
              dismissible 
            />
            <Alert 
              type="error" 
              title="Error" 
              description="Something went wrong. Please try again." 
            />
            <Alert 
              type="warning" 
              title="Warning" 
              description="This action cannot be undone." 
            />
            <Alert 
              type="info" 
              title="Information" 
              description="Here's something you should know." 
            />
          </div>
        </Card>

        {/* Tabs */}
        <Card>
          <h2 className="text-2xl font-semibold text-white mb-4">Tabs</h2>
          <Tabs tabs={tabItems} variant="default" />
          <div className="mt-8">
            <Tabs tabs={tabItems} variant="pills" />
          </div>
        </Card>

        {/* Loading States */}
        <Card>
          <h2 className="text-2xl font-semibold text-white mb-4">Loading States</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <LoadingState variant="spinner" size="sm" text="Loading..." />
            <LoadingState variant="dots" size="md" text="Processing..." />
            <LoadingState variant="pulse" size="lg" text="Please wait..." />
            <LoadingState variant="skeleton" />
          </div>
        </Card>

        {/* Modal Demo */}
        <Card>
          <h2 className="text-2xl font-semibold text-white mb-4">Modal</h2>
          <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Example Modal"
            size="md"
          >
            <p className="text-gray-300">
              This is an example modal using the shared UI component library.
            </p>
            <div className="mt-4 flex gap-2">
              <Button variant="primary" onClick={() => setIsModalOpen(false)}>
                Confirm
              </Button>
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </Modal>
        </Card>
      </div>
    </DashboardShell>
  )
}