'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import {
  Code,
  Shield,
  TestTube,
  FileText,
  Palette,
  Rocket,
  Bug,
  Activity,
  Settings,
  Play,
  Pause,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  Cpu,
  BarChart3,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface Agent {
  id: string;
  name: string;
  type: string;
  icon: React.ComponentType<any>;
  status: 'active' | 'inactive' | 'error' | 'processing';
  health: number;
  tasksCompleted: number;
  avgResponseTime: number;
  successRate: number;
  lastActive: string;
  config: {
    model: string;
    temperature: number;
    maxTokens: number;
    retryAttempts: number;
    timeout: number;
  };
}

const agents: Agent[] = [
  {
    id: 'code-review',
    name: 'Code Review Agent',
    type: 'LLMCodeReviewAgent',
    icon: Code,
    status: 'active',
    health: 98,
    tasksCompleted: 1234,
    avgResponseTime: 2.5,
    successRate: 96.5,
    lastActive: '2 minutes ago',
    config: {
      model: 'gpt-4',
      temperature: 0.3,
      maxTokens: 4000,
      retryAttempts: 3,
      timeout: 30,
    },
  },
  {
    id: 'security-audit',
    name: 'Security Audit Agent',
    type: 'LLMSecurityAuditAgent',
    icon: Shield,
    status: 'active',
    health: 100,
    tasksCompleted: 876,
    avgResponseTime: 4.2,
    successRate: 99.2,
    lastActive: '5 minutes ago',
    config: {
      model: 'gpt-4',
      temperature: 0.1,
      maxTokens: 6000,
      retryAttempts: 5,
      timeout: 60,
    },
  },
  {
    id: 'test-gen',
    name: 'Test Generation Agent',
    type: 'LLMTestGenAgent',
    icon: TestTube,
    status: 'processing',
    health: 92,
    tasksCompleted: 2341,
    avgResponseTime: 3.8,
    successRate: 94.3,
    lastActive: 'Now',
    config: {
      model: 'gpt-4',
      temperature: 0.5,
      maxTokens: 8000,
      retryAttempts: 3,
      timeout: 45,
    },
  },
  {
    id: 'docs-gen',
    name: 'Documentation Generator',
    type: 'DocsGenerator',
    icon: FileText,
    status: 'active',
    health: 95,
    tasksCompleted: 567,
    avgResponseTime: 2.1,
    successRate: 98.7,
    lastActive: '10 minutes ago',
    config: {
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      maxTokens: 4000,
      retryAttempts: 2,
      timeout: 30,
    },
  },
  {
    id: 'ui-ux',
    name: 'UI/UX Designer AI',
    type: 'UIUXDesignerAI',
    icon: Palette,
    status: 'inactive',
    health: 88,
    tasksCompleted: 432,
    avgResponseTime: 5.6,
    successRate: 91.2,
    lastActive: '2 hours ago',
    config: {
      model: 'gpt-4-vision',
      temperature: 0.8,
      maxTokens: 4000,
      retryAttempts: 2,
      timeout: 60,
    },
  },
  {
    id: 'deployment',
    name: 'Deployment Architect',
    type: 'DeploymentArchitectAI',
    icon: Rocket,
    status: 'active',
    health: 97,
    tasksCompleted: 234,
    avgResponseTime: 3.2,
    successRate: 97.8,
    lastActive: '15 minutes ago',
    config: {
      model: 'gpt-4',
      temperature: 0.2,
      maxTokens: 6000,
      retryAttempts: 4,
      timeout: 45,
    },
  },
  {
    id: 'qa-agent',
    name: 'QA Agent',
    type: 'LLMQAAgent',
    icon: Bug,
    status: 'error',
    health: 65,
    tasksCompleted: 789,
    avgResponseTime: 6.2,
    successRate: 88.4,
    lastActive: '1 hour ago',
    config: {
      model: 'gpt-4',
      temperature: 0.4,
      maxTokens: 5000,
      retryAttempts: 3,
      timeout: 40,
    },
  },
];

// Mock performance data
const performanceData = [
  { time: '00:00', tasks: 45, responseTime: 2.3, successRate: 95 },
  { time: '04:00', tasks: 32, responseTime: 2.8, successRate: 92 },
  { time: '08:00', tasks: 78, responseTime: 3.1, successRate: 94 },
  { time: '12:00', tasks: 120, responseTime: 4.2, successRate: 91 },
  { time: '16:00', tasks: 95, responseTime: 3.5, successRate: 93 },
  { time: '20:00', tasks: 67, responseTime: 2.9, successRate: 96 },
  { time: '24:00', tasks: 52, responseTime: 2.4, successRate: 97 },
];

const taskDistribution = [
  { name: 'Code Review', value: 30, color: '#3b82f6' },
  { name: 'Security', value: 20, color: '#ef4444' },
  { name: 'Testing', value: 25, color: '#10b981' },
  { name: 'Documentation', value: 15, color: '#f59e0b' },
  { name: 'UI/UX', value: 5, color: '#8b5cf6' },
  { name: 'Deployment', value: 5, color: '#6366f1' },
];

export const AgentManagementDashboard: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<Agent>(agents[0]);
  const [agentStates, setAgentStates] = useState<Record<string, boolean>>(
    agents.reduce((acc, agent) => ({ ...acc, [agent.id]: agent.status === 'active' }), {})
  );

  const toggleAgent = (agentId: string) => {
    setAgentStates((prev) => ({ ...prev, [agentId]: !prev[agentId] }));
  };

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'active':
        return 'text-green-600';
      case 'inactive':
        return 'text-gray-400';
      case 'error':
        return 'text-red-600';
      case 'processing':
        return 'text-blue-600';
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 90) return 'text-green-600';
    if (health >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {agents.filter((a) => a.status === 'active' || a.status === 'processing').length} / {agents.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((agents.filter((a) => a.status === 'active' || a.status === 'processing').length / agents.length) * 100)}% operational
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {agents.reduce((sum, agent) => sum + agent.tasksCompleted, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">+12% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(agents.reduce((sum, agent) => sum + agent.avgResponseTime, 0) / agents.length).toFixed(1)}s
            </div>
            <p className="text-xs text-muted-foreground">-0.3s from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(agents.reduce((sum, agent) => sum + agent.successRate, 0) / agents.length).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">+2.1% improvement</p>
          </CardContent>
        </Card>
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => {
          const Icon = agent.icon;
          return (
            <Card
              key={agent.id}
              className={`cursor-pointer transition-all ${
                selectedAgent.id === agent.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedAgent(agent)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-primary/10 ${getStatusColor(agent.status)}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{agent.name}</CardTitle>
                      <CardDescription className="text-xs">{agent.type}</CardDescription>
                    </div>
                  </div>
                  <Switch
                    checked={agentStates[agent.id]}
                    onCheckedChange={() => toggleAgent(agent.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Health</span>
                  <div className="flex items-center gap-2">
                    <Progress value={agent.health} className="w-20 h-2" />
                    <span className={`font-medium ${getHealthColor(agent.health)}`}>{agent.health}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Tasks</span>
                  <span className="font-medium">{agent.tasksCompleted.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Response</span>
                  <span className="font-medium">{agent.avgResponseTime}s</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Success</span>
                  <span className="font-medium">{agent.successRate}%</span>
                </div>
                <div className="pt-2 flex items-center justify-between">
                  <Badge variant={agent.status === 'active' ? 'default' : agent.status === 'error' ? 'destructive' : 'secondary'}>
                    {agent.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{agent.lastActive}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed View */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="logs">Logs & History</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Task Processing Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="tasks" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Response Time Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="responseTime" stroke="#ef4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Task Distribution by Agent Type</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
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
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Agent Configuration: {selectedAgent.name}</CardTitle>
              <CardDescription>Adjust the settings for optimal performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>AI Model</Label>
                  <Select defaultValue={selectedAgent.config.model}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4">GPT-4</SelectItem>
                      <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                      <SelectItem value="claude-2">Claude 2</SelectItem>
                      <SelectItem value="gpt-4-vision">GPT-4 Vision</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Max Tokens</Label>
                  <Input type="number" defaultValue={selectedAgent.config.maxTokens} />
                </div>

                <div className="space-y-2">
                  <Label>Temperature: {selectedAgent.config.temperature}</Label>
                  <Slider
                    defaultValue={[selectedAgent.config.temperature]}
                    max={1}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Timeout (seconds)</Label>
                  <Input type="number" defaultValue={selectedAgent.config.timeout} />
                </div>

                <div className="space-y-2">
                  <Label>Retry Attempts</Label>
                  <Input type="number" defaultValue={selectedAgent.config.retryAttempts} />
                </div>

                <div className="space-y-2">
                  <Label>Priority Level</Label>
                  <Select defaultValue="normal">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button>Save Configuration</Button>
                <Button variant="outline">Reset to Defaults</Button>
                <Button variant="outline" className="ml-auto">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Restart Agent
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { time: '2 minutes ago', action: 'Completed code review for PR #1234', status: 'success' },
                  { time: '5 minutes ago', action: 'Started security audit on module auth', status: 'processing' },
                  { time: '10 minutes ago', action: 'Generated 45 unit tests for user service', status: 'success' },
                  { time: '15 minutes ago', action: 'Failed to connect to API endpoint', status: 'error' },
                  { time: '20 minutes ago', action: 'Updated documentation for API v2', status: 'success' },
                ].map((log, index) => (
                  <div key={index} className="flex items-center gap-4 py-2 border-b last:border-0">
                    <div className="flex-shrink-0">
                      {log.status === 'success' && <CheckCircle className="h-5 w-5 text-green-600" />}
                      {log.status === 'error' && <AlertCircle className="h-5 w-5 text-red-600" />}
                      {log.status === 'processing' && <Clock className="h-5 w-5 text-blue-600 animate-pulse" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{log.action}</p>
                      <p className="text-xs text-muted-foreground">{log.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Resource Usage</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>CPU Usage</span>
                    <span>45%</span>
                  </div>
                  <Progress value={45} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Memory Usage</span>
                    <span>62%</span>
                  </div>
                  <Progress value={62} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>API Calls</span>
                    <span>8,234 / 10,000</span>
                  </div>
                  <Progress value={82} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Today</span>
                    <span className="font-medium">$12.45</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">This Week</span>
                    <span className="font-medium">$78.32</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">This Month</span>
                    <span className="font-medium">$342.18</span>
                  </div>
                  <div className="pt-3 border-t">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Projected Monthly</span>
                      <span className="font-bold text-lg">$410.50</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};