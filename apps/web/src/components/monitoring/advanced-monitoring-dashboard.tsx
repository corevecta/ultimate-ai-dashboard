'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Clock,
  Cpu,
  Database,
  HardDrive,
  Network,
  RefreshCw,
  Server,
  Zap,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  XCircle,
  GitBranch,
  Layers,
  Timer,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
  Cell,
} from 'recharts';

// Mock data for distributed tracing
const traceData = [
  {
    id: 'trace-001',
    service: 'API Gateway',
    operation: 'POST /api/generate',
    duration: 1234,
    timestamp: '2024-01-20 10:30:45',
    status: 'success',
    spans: [
      { service: 'API Gateway', start: 0, duration: 45, status: 'success' },
      { service: 'Auth Service', start: 45, duration: 120, status: 'success' },
      { service: 'Orchestrator', start: 165, duration: 850, status: 'success' },
      { service: 'AI Agent', start: 1015, duration: 180, status: 'success' },
      { service: 'Database', start: 1195, duration: 39, status: 'success' },
    ],
  },
  {
    id: 'trace-002',
    service: 'Workflow Engine',
    operation: 'Execute Pipeline',
    duration: 3456,
    timestamp: '2024-01-20 10:32:12',
    status: 'error',
    spans: [
      { service: 'Workflow Engine', start: 0, duration: 67, status: 'success' },
      { service: 'Task Queue', start: 67, duration: 234, status: 'success' },
      { service: 'Code Analyzer', start: 301, duration: 1890, status: 'success' },
      { service: 'Security Scanner', start: 2191, duration: 1200, status: 'error' },
      { service: 'Error Handler', start: 3391, duration: 65, status: 'success' },
    ],
  },
];

// Mock metrics data
const metricsData = {
  system: [
    { time: '10:00', cpu: 45, memory: 62, disk: 78, network: 23 },
    { time: '10:05', cpu: 52, memory: 64, disk: 78, network: 31 },
    { time: '10:10', cpu: 48, memory: 61, disk: 79, network: 28 },
    { time: '10:15', cpu: 71, memory: 68, disk: 79, network: 45 },
    { time: '10:20', cpu: 65, memory: 70, disk: 80, network: 38 },
    { time: '10:25', cpu: 58, memory: 67, disk: 80, network: 32 },
    { time: '10:30', cpu: 49, memory: 63, disk: 81, network: 26 },
  ],
  application: [
    { time: '10:00', requests: 120, errors: 2, latency: 234, throughput: 89 },
    { time: '10:05', requests: 145, errors: 3, latency: 256, throughput: 92 },
    { time: '10:10', requests: 132, errors: 1, latency: 221, throughput: 88 },
    { time: '10:15', requests: 189, errors: 5, latency: 312, throughput: 95 },
    { time: '10:20', requests: 167, errors: 4, latency: 289, throughput: 91 },
    { time: '10:25', requests: 154, errors: 2, latency: 245, throughput: 90 },
    { time: '10:30', requests: 138, errors: 1, latency: 238, throughput: 87 },
  ],
  services: [
    { name: 'API Gateway', health: 98, requests: 4523, errors: 12, avgLatency: 45 },
    { name: 'Orchestrator', health: 95, requests: 3876, errors: 34, avgLatency: 234 },
    { name: 'AI Agents', health: 92, requests: 2341, errors: 56, avgLatency: 1234 },
    { name: 'Database', health: 99, requests: 8765, errors: 3, avgLatency: 12 },
    { name: 'Cache', health: 100, requests: 12456, errors: 0, avgLatency: 2 },
    { name: 'Queue', health: 94, requests: 5432, errors: 23, avgLatency: 67 },
  ],
};

// Mock log entries
const logEntries = [
  { timestamp: '10:30:45', level: 'INFO', service: 'API Gateway', message: 'Request processed successfully', requestId: 'req-123' },
  { timestamp: '10:30:44', level: 'ERROR', service: 'Security Scanner', message: 'Failed to scan repository: timeout', requestId: 'req-122' },
  { timestamp: '10:30:43', level: 'WARN', service: 'Cache', message: 'Cache hit rate below threshold: 78%', requestId: null },
  { timestamp: '10:30:42', level: 'INFO', service: 'Orchestrator', message: 'Pipeline execution started', requestId: 'req-121' },
  { timestamp: '10:30:41', level: 'DEBUG', service: 'AI Agent', message: 'Model inference completed in 234ms', requestId: 'req-120' },
];

export const AdvancedMonitoringDashboard: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('1h');
  const [selectedService, setSelectedService] = useState('all');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [selectedTrace, setSelectedTrace] = useState<typeof traceData[0] | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'ERROR':
        return 'text-red-600 bg-red-50';
      case 'WARN':
        return 'text-yellow-600 bg-yellow-50';
      case 'INFO':
        return 'text-blue-600 bg-blue-50';
      case 'DEBUG':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Advanced Monitoring</h2>
          <p className="text-muted-foreground">Real-time system observability and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15m">Last 15m</SelectItem>
              <SelectItem value="1h">Last 1h</SelectItem>
              <SelectItem value="6h">Last 6h</SelectItem>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7d</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant={autoRefresh ? "default" : "outline"}
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            Auto Refresh
          </Button>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">96.5%</div>
            <div className="flex items-center text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              +2.3% from last hour
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Services</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23 / 24</div>
            <div className="flex items-center text-sm">
              <Badge variant="destructive" className="text-xs">1 Down</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0.23%</div>
            <div className="flex items-center text-sm text-muted-foreground">
              <TrendingDown className="h-4 w-4 text-green-600 mr-1" />
              -0.05% from baseline
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">234ms</div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Badge variant="secondary" className="text-xs">Normal</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Monitoring Tabs */}
      <Tabs defaultValue="metrics" className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full max-w-2xl">
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="tracing">Tracing</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>System Resources</CardTitle>
                <CardDescription>CPU, Memory, Disk, and Network usage</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={metricsData.system}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="cpu" stroke="#3b82f6" strokeWidth={2} name="CPU %" />
                    <Line type="monotone" dataKey="memory" stroke="#10b981" strokeWidth={2} name="Memory %" />
                    <Line type="monotone" dataKey="disk" stroke="#f59e0b" strokeWidth={2} name="Disk %" />
                    <Line type="monotone" dataKey="network" stroke="#8b5cf6" strokeWidth={2} name="Network Mbps" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Application Metrics</CardTitle>
                <CardDescription>Requests, errors, and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={metricsData.application}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="requests" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Requests/min" />
                    <Area type="monotone" dataKey="errors" stackId="2" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} name="Errors/min" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Distribution</CardTitle>
              <CardDescription>Request latency distribution across services</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" dataKey="avgLatency" name="Latency (ms)" />
                  <YAxis type="number" dataKey="requests" name="Requests" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter name="Services" data={metricsData.services} fill="#3b82f6">
                    {metricsData.services.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.health > 95 ? '#10b981' : entry.health > 90 ? '#f59e0b' : '#ef4444'} />
                    ))}
                  </Scatter>
                  <ReferenceLine x={250} stroke="#ef4444" strokeDasharray="5 5" label="SLA Limit" />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tracing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Distributed Traces</CardTitle>
              <CardDescription>End-to-end request tracing across services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {traceData.map((trace) => (
                  <div
                    key={trace.id}
                    className="border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => setSelectedTrace(trace)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(trace.status)}
                        <div>
                          <p className="font-medium">{trace.operation}</p>
                          <p className="text-sm text-muted-foreground">{trace.service}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{trace.duration}ms</p>
                        <p className="text-sm text-muted-foreground">{trace.timestamp}</p>
                      </div>
                    </div>
                    <div className="relative h-6">
                      {trace.spans.map((span, index) => {
                        const width = (span.duration / trace.duration) * 100;
                        const left = (span.start / trace.duration) * 100;
                        return (
                          <div
                            key={index}
                            className="absolute h-full rounded"
                            style={{
                              left: `${left}%`,
                              width: `${width}%`,
                              backgroundColor: span.status === 'error' ? '#ef4444' : '#3b82f6',
                              opacity: 0.8,
                            }}
                            title={`${span.service}: ${span.duration}ms`}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {selectedTrace && (
            <Card>
              <CardHeader>
                <CardTitle>Trace Details: {selectedTrace.id}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedTrace.spans.map((span, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${span.status === 'error' ? 'bg-red-500' : 'bg-green-500'}`} />
                        <div>
                          <p className="font-medium">{span.service}</p>
                          <p className="text-sm text-muted-foreground">Start: {span.start}ms</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{span.duration}ms</p>
                        <Badge variant={span.status === 'error' ? 'destructive' : 'default'}>
                          {span.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>System Logs</CardTitle>
                  <CardDescription>Real-time log aggregation from all services</CardDescription>
                </div>
                <Select value={selectedService} onValueChange={setSelectedService}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Services</SelectItem>
                    <SelectItem value="api-gateway">API Gateway</SelectItem>
                    <SelectItem value="orchestrator">Orchestrator</SelectItem>
                    <SelectItem value="ai-agents">AI Agents</SelectItem>
                    <SelectItem value="database">Database</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {logEntries.map((log, index) => (
                  <div key={index} className="flex items-start gap-3 py-2 border-b last:border-0">
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{log.timestamp}</span>
                    <Badge className={`text-xs ${getLogLevelColor(log.level)}`}>{log.level}</Badge>
                    <div className="flex-1">
                      <span className="text-sm font-medium">{log.service}: </span>
                      <span className="text-sm">{log.message}</span>
                      {log.requestId && (
                        <span className="text-xs text-muted-foreground ml-2">({log.requestId})</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {metricsData.services.map((service) => (
              <Card key={service.name}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{service.name}</CardTitle>
                    <Badge variant={service.health > 95 ? 'default' : service.health > 90 ? 'secondary' : 'destructive'}>
                      {service.health}% Health
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Requests</span>
                      <span className="font-medium">{service.requests.toLocaleString()}/min</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Errors</span>
                      <span className="font-medium text-red-600">{service.errors}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Avg Latency</span>
                      <span className="font-medium">{service.avgLatency}ms</span>
                    </div>
                  </div>
                  <Progress value={service.health} className="h-2" />
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Activity className="h-4 w-4 mr-1" />
                      Details
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Restart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">High Memory Usage on Orchestrator Service</p>
                  <p className="text-sm text-muted-foreground">Memory usage has exceeded 85% threshold</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">Investigate</Button>
                  <Button size="sm" variant="outline">Dismiss</Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Alert Rules</CardTitle>
              <CardDescription>Configured monitoring alerts and thresholds</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'CPU Usage > 80%', status: 'active', severity: 'warning', lastTriggered: '2 hours ago' },
                  { name: 'Error Rate > 1%', status: 'active', severity: 'critical', lastTriggered: 'Never' },
                  { name: 'Response Time > 500ms', status: 'active', severity: 'warning', lastTriggered: '1 day ago' },
                  { name: 'Service Down', status: 'active', severity: 'critical', lastTriggered: '3 days ago' },
                  { name: 'Disk Usage > 90%', status: 'inactive', severity: 'warning', lastTriggered: '1 week ago' },
                ].map((rule, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium">{rule.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={rule.severity === 'critical' ? 'destructive' : 'secondary'}>
                          {rule.severity}
                        </Badge>
                        <span className="text-sm text-muted-foreground">Last triggered: {rule.lastTriggered}</span>
                      </div>
                    </div>
                    <Button size="sm" variant={rule.status === 'active' ? 'default' : 'outline'}>
                      {rule.status === 'active' ? 'Active' : 'Inactive'}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};