'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
  PieChart,
  Pie,
  RadialBarChart,
  RadialBar,
} from 'recharts';
import {
  Activity,
  Zap,
  GitBranch,
  Package,
  Shield,
  Network,
  Cpu,
  Timer,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertCircle,
  Clock,
  Server,
  Database,
  Cloud,
  Lock,
  Unlock,
  Layers,
} from 'lucide-react';

// Performance data for charts
const performanceData = [
  { time: '00:00', workflows: 120, tasks: 450, latency: 23 },
  { time: '04:00', workflows: 98, tasks: 320, latency: 28 },
  { time: '08:00', workflows: 186, tasks: 680, latency: 19 },
  { time: '12:00', workflows: 234, tasks: 890, latency: 15 },
  { time: '16:00', workflows: 290, tasks: 1200, latency: 12 },
  { time: '20:00', workflows: 210, tasks: 780, latency: 18 },
  { time: '24:00', workflows: 156, tasks: 520, latency: 22 },
];

// Resource utilization data
const resourceData = [
  { name: 'CPU', value: 68, max: 100, color: '#8b5cf6' },
  { name: 'Memory', value: 45, max: 100, color: '#3b82f6' },
  { name: 'Network', value: 82, max: 100, color: '#10b981' },
  { name: 'Storage', value: 35, max: 100, color: '#f59e0b' },
];

// Task distribution data
const taskDistribution = [
  { name: 'Data Processing', value: 35, color: '#8b5cf6' },
  { name: 'API Calls', value: 25, color: '#3b82f6' },
  { name: 'File Operations', value: 20, color: '#10b981' },
  { name: 'AI Inference', value: 15, color: '#f59e0b' },
  { name: 'Other', value: 5, color: '#ef4444' },
];

// Success rate data
const successRateData = [
  { subject: 'Reliability', A: 98, fullMark: 100 },
  { subject: 'Performance', A: 92, fullMark: 100 },
  { subject: 'Scalability', A: 88, fullMark: 100 },
  { subject: 'Efficiency', A: 95, fullMark: 100 },
  { subject: 'Availability', A: 99.9, fullMark: 100 },
];

// Orchestrator features with enhanced metrics
const orchestratorFeatures = [
  {
    title: 'DAG Workflow Engine',
    description: 'Enhanced Orchestrator V2 with directed acyclic graph execution',
    href: '/orchestrator/dag',
    status: 'active',
    icon: GitBranch,
    metrics: { workflows: 1234, executions: 45678, successRate: 98.5, latency: 15 },
    color: 'from-purple-500 to-pink-500',
    glow: 'purple',
    chartData: [65, 72, 78, 82, 88, 92, 95, 98],
  },
  {
    title: 'Distributed Task Queue',
    description: 'Redis-based distributed task execution system',
    href: '/orchestrator/tasks',
    status: 'active',
    icon: Network,
    metrics: { pending: 234, processing: 12, completed: 98765, throughput: 1250 },
    color: 'from-blue-500 to-cyan-500',
    glow: 'blue',
    chartData: [45, 52, 48, 62, 68, 72, 78, 82],
  },
  {
    title: 'Brand Guidelines Engine',
    description: 'Automated brand compliance checking and enforcement',
    href: '/orchestrator/brand',
    status: 'beta',
    icon: Shield,
    metrics: { rules: 156, violations: 23, compliance: 94.2, automated: 89 },
    color: 'from-green-500 to-emerald-500',
    glow: 'green',
    chartData: [88, 90, 89, 92, 94, 93, 94, 94],
  },
  {
    title: 'Dynamic Prompt Engine',
    description: 'Intelligent prompt generation and optimization',
    href: '/orchestrator/prompts',
    status: 'active',
    icon: Zap,
    metrics: { templates: 789, optimizations: 2345, improvement: 23.4, usage: 92 },
    color: 'from-yellow-500 to-orange-500',
    glow: 'yellow',
    chartData: [72, 75, 78, 82, 85, 88, 90, 92],
  },
  {
    title: 'Plugin Architecture',
    description: 'Dynamic plugin loading and management system',
    href: '/plugins',
    status: 'active',
    icon: Package,
    metrics: { installed: 45, active: 38, community: 234, downloads: 12567 },
    color: 'from-indigo-500 to-purple-500',
    glow: 'indigo',
    chartData: [32, 38, 42, 48, 52, 58, 62, 68],
  },
  {
    title: 'CI/CD Pipeline Engine',
    description: 'Automated deployment pipeline orchestration',
    href: '/deployments/cicd',
    status: 'active',
    icon: Cpu,
    metrics: { pipelines: 123, deployments: 4567, success: 96.8, rollbacks: 3 },
    color: 'from-red-500 to-pink-500',
    glow: 'red',
    chartData: [85, 88, 90, 92, 94, 95, 96, 97],
  },
];

// Animated number component
const AnimatedNumber = ({ value, suffix = '' }: { value: number; suffix?: string }) => {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {value.toLocaleString()}{suffix}
    </motion.span>
  );
};

export default function EnhancedOrchestratorPage() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [selectedTab, setSelectedTab] = useState('overview');

  return (
    <DashboardShell>
      <div className="relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000" />
          <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000" />
        </div>

        <div className="relative z-10 p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Enhanced Orchestrator V2
            </h1>
            <p className="text-xl text-gray-400">
              The intelligent backbone of your AI platform - orchestrating complex workflows with precision and scale
            </p>
          </motion.div>

          {/* Key Metrics with enhanced visuals */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Total Workflows', value: 12456, change: '+23%', icon: GitBranch, color: 'from-purple-500 to-pink-500' },
              { label: 'Active Tasks', value: 1234, change: 'Live', icon: Activity, color: 'from-blue-500 to-cyan-500' },
              { label: 'Success Rate', value: 98.7, change: '+2.3%', icon: CheckCircle, color: 'from-green-500 to-emerald-500', suffix: '%' },
              { label: 'Avg Latency', value: 2.3, change: '-15%', icon: Timer, color: 'from-yellow-500 to-orange-500', suffix: 's' },
            ].map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <div className={`absolute -inset-1 bg-gradient-to-r ${metric.color} rounded-2xl blur-lg opacity-30 group-hover:opacity-60 transition-opacity`} />
                <Card className="relative bg-gray-900/90 border-gray-800 backdrop-blur-xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <metric.icon className="h-8 w-8 text-gray-400" />
                      <Badge
                        variant={metric.change.includes('+') ? 'default' : metric.change === 'Live' ? 'secondary' : 'outline'}
                        className="text-xs"
                      >
                        {metric.change}
                      </Badge>
                    </div>
                    <h3 className="text-sm font-medium text-gray-400 mb-1">{metric.label}</h3>
                    <p className="text-3xl font-bold">
                      <AnimatedNumber value={metric.value} suffix={metric.suffix} />
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Main Content Tabs */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
            <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto bg-gray-900/50 backdrop-blur-xl">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="insights">AI Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Features Grid with enhanced visuals */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orchestratorFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    onMouseEnter={() => setHoveredFeature(index)}
                    onMouseLeave={() => setHoveredFeature(null)}
                  >
                    <Link href={feature.href}>
                      <div className="relative group cursor-pointer">
                        <div
                          className={`absolute -inset-1 bg-gradient-to-r ${feature.color} rounded-2xl blur-lg opacity-30 group-hover:opacity-60 transition-all duration-500`}
                        />
                        <Card className="relative h-full bg-gray-900/90 border-gray-800 backdrop-blur-xl overflow-hidden">
                          <CardHeader>
                            <div className="flex items-start justify-between mb-2">
                              <feature.icon className="h-10 w-10 text-gray-400" />
                              <Badge
                                variant={feature.status === 'active' ? 'default' : feature.status === 'beta' ? 'secondary' : 'outline'}
                              >
                                {feature.status}
                              </Badge>
                            </div>
                            <CardTitle className="text-xl">{feature.title}</CardTitle>
                            <CardDescription>{feature.description}</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {/* Mini sparkline chart */}
                            <div className="h-16">
                              <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={feature.chartData.map((value, i) => ({ value, index: i }))}>
                                  <defs>
                                    <linearGradient id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor={feature.color.includes('purple') ? '#8b5cf6' : feature.color.includes('blue') ? '#3b82f6' : feature.color.includes('green') ? '#10b981' : feature.color.includes('yellow') ? '#f59e0b' : feature.color.includes('indigo') ? '#6366f1' : '#ef4444'} stopOpacity={0.8} />
                                      <stop offset="95%" stopColor={feature.color.includes('purple') ? '#8b5cf6' : feature.color.includes('blue') ? '#3b82f6' : feature.color.includes('green') ? '#10b981' : feature.color.includes('yellow') ? '#f59e0b' : feature.color.includes('indigo') ? '#6366f1' : '#ef4444'} stopOpacity={0} />
                                    </linearGradient>
                                  </defs>
                                  <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke={feature.color.includes('purple') ? '#8b5cf6' : feature.color.includes('blue') ? '#3b82f6' : feature.color.includes('green') ? '#10b981' : feature.color.includes('yellow') ? '#f59e0b' : feature.color.includes('indigo') ? '#6366f1' : '#ef4444'}
                                    fillOpacity={1}
                                    fill={`url(#gradient-${index})`}
                                  />
                                </AreaChart>
                              </ResponsiveContainer>
                            </div>

                            {/* Metrics */}
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              {Object.entries(feature.metrics).slice(0, 4).map(([key, value]) => (
                                <div key={key} className="flex justify-between">
                                  <span className="text-gray-500 capitalize">{key}:</span>
                                  <span className="font-medium">
                                    {typeof value === 'number' && value > 100
                                      ? value.toLocaleString()
                                      : value}
                                    {key.includes('Rate') || key.includes('compliance') ? '%' : ''}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Performance Chart */}
                <Card className="bg-gray-900/90 border-gray-800 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                    <CardDescription>Real-time system performance over the last 24 hours</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={performanceData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="time" stroke="#9ca3af" />
                          <YAxis stroke="#9ca3af" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#1f2937',
                              border: '1px solid #374151',
                              borderRadius: '8px',
                            }}
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="workflows"
                            stroke="#8b5cf6"
                            strokeWidth={2}
                            dot={false}
                          />
                          <Line
                            type="monotone"
                            dataKey="tasks"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            dot={false}
                          />
                          <Line
                            type="monotone"
                            dataKey="latency"
                            stroke="#10b981"
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Success Rate Radar */}
                <Card className="bg-gray-900/90 border-gray-800 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle>System Reliability</CardTitle>
                    <CardDescription>Key performance indicators</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={successRateData}>
                          <PolarGrid stroke="#374151" />
                          <PolarAngleAxis dataKey="subject" stroke="#9ca3af" />
                          <PolarRadiusAxis stroke="#374151" />
                          <Radar
                            name="Performance"
                            dataKey="A"
                            stroke="#8b5cf6"
                            fill="#8b5cf6"
                            fillOpacity={0.6}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#1f2937',
                              border: '1px solid #374151',
                              borderRadius: '8px',
                            }}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="resources" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Resource Utilization */}
                <Card className="bg-gray-900/90 border-gray-800 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle>Resource Utilization</CardTitle>
                    <CardDescription>Current system resource usage</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {resourceData.map((resource) => (
                        <div key={resource.name} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">{resource.name}</span>
                            <span className="font-medium">{resource.value}%</span>
                          </div>
                          <div className="relative">
                            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${resource.value}%` }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className="h-full rounded-full"
                                style={{
                                  background: `linear-gradient(to right, ${resource.color}, ${resource.color}dd)`,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Task Distribution */}
                <Card className="bg-gray-900/90 border-gray-800 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle>Task Distribution</CardTitle>
                    <CardDescription>Breakdown of task types</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={taskDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={(entry) => `${entry.name}: ${entry.value}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {taskDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#1f2937',
                              border: '1px solid #374151',
                              borderRadius: '8px',
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="insights" className="space-y-6">
              <Card className="bg-gray-900/90 border-gray-800 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle>AI-Powered Insights</CardTitle>
                  <CardDescription>Machine learning analysis of your orchestration patterns</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <h4 className="font-medium flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        Optimization Opportunities
                      </h4>
                      <p className="text-sm text-gray-400">
                        Workflow parallelization could improve throughput by 34%
                      </p>
                      <Progress value={34} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                        Anomaly Detection
                      </h4>
                      <p className="text-sm text-gray-400">
                        Unusual spike in retry rates detected at 14:30 UTC
                      </p>
                      <Badge variant="secondary">Investigating</Badge>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-500" />
                        Predictive Scaling
                      </h4>
                      <p className="text-sm text-gray-400">
                        Expected 45% traffic increase in next 2 hours
                      </p>
                      <Badge variant="outline">Auto-scaling ready</Badge>
                    </div>
                  </div>

                  <div className="border-t border-gray-800 pt-6">
                    <h4 className="font-medium mb-4">Recommended Actions</h4>
                    <div className="space-y-3">
                      {[
                        { action: 'Enable adaptive retry logic for API tasks', impact: 'High', savings: '23% fewer failures' },
                        { action: 'Implement caching for frequently accessed data', impact: 'Medium', savings: '15ms latency reduction' },
                        { action: 'Upgrade Redis cluster for better throughput', impact: 'High', savings: '2x processing speed' },
                      ].map((recommendation, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="font-medium">{recommendation.action}</p>
                            <p className="text-sm text-gray-400">{recommendation.savings}</p>
                          </div>
                          <Badge variant={recommendation.impact === 'High' ? 'default' : 'secondary'}>
                            {recommendation.impact} Impact
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardShell>
  );
}