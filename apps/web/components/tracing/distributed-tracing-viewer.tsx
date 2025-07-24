'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/hooks/use-toast';
import {
  Activity,
  Search,
  Filter,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowRight,
  ArrowDown,
  Database,
  Server,
  Globe,
  Cpu,
  Network,
  Zap,
  Bug,
  BarChart,
  TrendingUp,
  TrendingDown,
  Layers,
  GitBranch,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Eye,
  EyeOff,
  RefreshCw,
  Download,
  Share2,
  Maximize2,
  Minimize2,
} from 'lucide-react';

// Mock trace data
const mockTraces = [
  {
    traceId: 'trace_001',
    service: 'api-gateway',
    operation: 'POST /api/v2/orchestrator/workflow',
    startTime: '2024-01-20T10:30:00Z',
    duration: 2450,
    status: 'success',
    spans: [
      {
        spanId: 'span_001_1',
        service: 'api-gateway',
        operation: 'HTTP Request',
        startTime: 0,
        duration: 150,
        status: 'success',
        tags: { method: 'POST', path: '/api/v2/orchestrator/workflow' },
        children: [
          {
            spanId: 'span_001_2',
            service: 'auth-service',
            operation: 'Validate Token',
            startTime: 20,
            duration: 45,
            status: 'success',
            tags: { userId: 'user_123' },
          },
          {
            spanId: 'span_001_3',
            service: 'orchestrator',
            operation: 'Create Workflow',
            startTime: 70,
            duration: 2200,
            status: 'success',
            tags: { workflowId: 'wf_456' },
            children: [
              {
                spanId: 'span_001_4',
                service: 'database',
                operation: 'Insert Workflow',
                startTime: 100,
                duration: 150,
                status: 'success',
                tags: { query: 'INSERT INTO workflows...', rows: 1 },
              },
              {
                spanId: 'span_001_5',
                service: 'queue',
                operation: 'Publish Event',
                startTime: 260,
                duration: 80,
                status: 'success',
                tags: { event: 'workflow.created', queue: 'events' },
              },
              {
                spanId: 'span_001_6',
                service: 'ai-agent',
                operation: 'Process Workflow',
                startTime: 350,
                duration: 1800,
                status: 'success',
                tags: { agent: 'code-review', model: 'gpt-4' },
                children: [
                  {
                    spanId: 'span_001_7',
                    service: 'ai-service',
                    operation: 'Generate Analysis',
                    startTime: 400,
                    duration: 1500,
                    status: 'success',
                    tags: { tokens: 2500, temperature: 0.7 },
                  },
                  {
                    spanId: 'span_001_8',
                    service: 'cache',
                    operation: 'Store Result',
                    startTime: 1920,
                    duration: 30,
                    status: 'success',
                    tags: { key: 'analysis_789', ttl: 3600 },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    traceId: 'trace_002',
    service: 'deployment-service',
    operation: 'Deploy Application',
    startTime: '2024-01-20T10:35:00Z',
    duration: 5200,
    status: 'error',
    error: 'Deployment failed: Container image not found',
    spans: [
      {
        spanId: 'span_002_1',
        service: 'deployment-service',
        operation: 'Deploy Request',
        startTime: 0,
        duration: 5200,
        status: 'error',
        tags: { projectId: 'proj_123', environment: 'staging' },
        children: [
          {
            spanId: 'span_002_2',
            service: 'container-registry',
            operation: 'Pull Image',
            startTime: 50,
            duration: 3000,
            status: 'error',
            error: 'Image not found: myapp:v2.0',
            tags: { registry: 'docker.io', image: 'myapp:v2.0' },
          },
          {
            spanId: 'span_002_3',
            service: 'notification-service',
            operation: 'Send Alert',
            startTime: 3100,
            duration: 200,
            status: 'success',
            tags: { channel: 'slack', severity: 'high' },
          },
        ],
      },
    ],
  },
];

// Service dependencies
const serviceDependencies = [
  { source: 'api-gateway', target: 'auth-service' },
  { source: 'api-gateway', target: 'orchestrator' },
  { source: 'orchestrator', target: 'database' },
  { source: 'orchestrator', target: 'queue' },
  { source: 'orchestrator', target: 'ai-agent' },
  { source: 'ai-agent', target: 'ai-service' },
  { source: 'ai-agent', target: 'cache' },
  { source: 'deployment-service', target: 'container-registry' },
  { source: 'deployment-service', target: 'notification-service' },
  { source: 'notification-service', target: 'slack' },
  { source: 'notification-service', target: 'email' },
];

export const DistributedTracingViewer: React.FC = () => {
  const [selectedTrace, setSelectedTrace] = useState(mockTraces[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterService, setFilterService] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [timeRange, setTimeRange] = useState('1h');
  const [viewMode, setViewMode] = useState<'timeline' | 'waterfall' | 'graph'>('waterfall');
  const [expandedSpans, setExpandedSpans] = useState<Set<string>>(new Set());

  const toggleSpanExpansion = (spanId: string) => {
    const newExpanded = new Set(expandedSpans);
    if (newExpanded.has(spanId)) {
      newExpanded.delete(spanId);
    } else {
      newExpanded.add(spanId);
    }
    setExpandedSpans(newExpanded);
  };

  const renderSpan = (span: any, depth: number = 0, parentStartTime: number = 0) => {
    const absoluteStartTime = parentStartTime + span.startTime;
    const isExpanded = expandedSpans.has(span.spanId);
    const hasChildren = span.children && span.children.length > 0;
    const leftOffset = (absoluteStartTime / selectedTrace.duration) * 100;
    const width = (span.duration / selectedTrace.duration) * 100;

    return (
      <div key={span.spanId} className="relative">
        <div className="flex items-center py-2 hover:bg-muted/50 transition-colors">
          {/* Service and Operation */}
          <div className="flex items-center gap-2 min-w-[300px]" style={{ paddingLeft: `${depth * 20}px` }}>
            {hasChildren && (
              <button
                onClick={() => toggleSpanExpansion(span.spanId)}
                className="p-0.5 hover:bg-muted rounded"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            )}
            {!hasChildren && <div className="w-5" />}
            <div className="flex items-center gap-2">
              {getServiceIcon(span.service)}
              <div>
                <div className="font-medium text-sm">{span.service}</div>
                <div className="text-xs text-muted-foreground">{span.operation}</div>
              </div>
            </div>
          </div>

          {/* Timeline Bar */}
          <div className="flex-1 relative h-6">
            <div className="absolute inset-0 bg-muted rounded" />
            <div
              className={`absolute top-0 h-full rounded ${
                span.status === 'error' ? 'bg-red-500' : 'bg-primary'
              }`}
              style={{ left: `${leftOffset}%`, width: `${width}%` }}
            >
              <div className="absolute inset-0 flex items-center justify-center text-xs text-white">
                {span.duration}ms
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="ml-4 flex items-center gap-2">
            {span.status === 'success' ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
            <Badge variant={span.status === 'error' ? 'destructive' : 'default'} className="text-xs">
              {span.status}
            </Badge>
          </div>
        </div>

        {/* Span Details */}
        {isExpanded && (
          <div className="ml-12 mb-2 p-3 bg-muted/30 rounded-lg text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-muted-foreground">Span ID:</span>
                <span className="ml-2 font-mono">{span.spanId}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Duration:</span>
                <span className="ml-2">{span.duration}ms</span>
              </div>
              {span.error && (
                <div className="col-span-2">
                  <span className="text-muted-foreground">Error:</span>
                  <span className="ml-2 text-red-600">{span.error}</span>
                </div>
              )}
              {span.tags && (
                <div className="col-span-2">
                  <span className="text-muted-foreground">Tags:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {Object.entries(span.tags).map(([key, value]) => (
                      <Badge key={key} variant="outline" className="text-xs">
                        {key}: {String(value)}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Render Children */}
        {isExpanded && hasChildren && (
          <div>
            {span.children.map((child: any) => 
              renderSpan(child, depth + 1, absoluteStartTime)
            )}
          </div>
        )}
      </div>
    );
  };

  const getServiceIcon = (service: string) => {
    const icons: { [key: string]: any } = {
      'api-gateway': Globe,
      'auth-service': Shield,
      'orchestrator': Cpu,
      'database': Database,
      'queue': Network,
      'ai-agent': Brain,
      'ai-service': Sparkles,
      'cache': HardDrive,
      'deployment-service': Rocket,
      'container-registry': Container,
      'notification-service': Bell,
    };
    const Icon = icons[service] || Server;
    return <Icon className="h-4 w-4" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'warning':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold">Distributed Tracing</h2>
        <p className="text-muted-foreground">
          Visualize and analyze request flow across your microservices
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <Label htmlFor="search" className="sr-only">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by trace ID, service, or operation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterService} onValueChange={setFilterService}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Services" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                <SelectItem value="api-gateway">API Gateway</SelectItem>
                <SelectItem value="orchestrator">Orchestrator</SelectItem>
                <SelectItem value="ai-agent">AI Agent</SelectItem>
                <SelectItem value="database">Database</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
              </SelectContent>
            </Select>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5m">Last 5 minutes</SelectItem>
                <SelectItem value="15m">Last 15 minutes</SelectItem>
                <SelectItem value="1h">Last hour</SelectItem>
                <SelectItem value="24h">Last 24 hours</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Trace List */}
        <div className="lg:col-span-1">
          <Card className="h-[600px]">
            <CardHeader>
              <CardTitle className="text-lg">Recent Traces</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[520px]">
                <div className="p-4 space-y-2">
                  {mockTraces.map((trace) => (
                    <button
                      key={trace.traceId}
                      onClick={() => setSelectedTrace(trace)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        selectedTrace.traceId === trace.traceId
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="font-medium text-sm">{trace.operation}</div>
                        <div className="text-xs text-muted-foreground">
                          {trace.service} • {trace.duration}ms
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={trace.status === 'error' ? 'destructive' : 'default'}
                            className="text-xs"
                          >
                            {trace.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(trace.startTime).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Trace Details */}
        <div className="lg:col-span-3">
          <Card className="h-[600px]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{selectedTrace.operation}</CardTitle>
                  <CardDescription>
                    Trace ID: {selectedTrace.traceId} • Duration: {selectedTrace.duration}ms
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={viewMode} onValueChange={(v: any) => setViewMode(v)}>
                <TabsList>
                  <TabsTrigger value="waterfall">Waterfall</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="graph">Service Graph</TabsTrigger>
                </TabsList>

                <TabsContent value="waterfall" className="mt-4">
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-1">
                      {selectedTrace.spans.map((span) => renderSpan(span))}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="timeline" className="mt-4">
                  <div className="space-y-4">
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Timeline view shows the chronological sequence of operations
                      </AlertDescription>
                    </Alert>
                    <div className="relative h-[350px] border rounded-lg p-4">
                      {/* Timeline implementation would go here */}
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        Timeline visualization coming soon
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="graph" className="mt-4">
                  <div className="space-y-4">
                    <Alert>
                      <Network className="h-4 w-4" />
                      <AlertDescription>
                        Service graph shows the dependencies between your microservices
                      </AlertDescription>
                    </Alert>
                    <div className="relative h-[350px] border rounded-lg p-4">
                      {/* Service graph implementation would go here */}
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        Service dependency graph coming soon
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Trace Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Spans</p>
                <p className="text-2xl font-bold">
                  {selectedTrace.spans.reduce((count, span) => 
                    count + 1 + (span.children?.length || 0), 0
                  )}
                </p>
              </div>
              <Layers className="h-8 w-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Services Involved</p>
                <p className="text-2xl font-bold">
                  {new Set(
                    selectedTrace.spans.flatMap((span: any) => 
                      [span.service, ...(span.children?.map((c: any) => c.service) || [])]
                    )
                  ).size}
                </p>
              </div>
              <Network className="h-8 w-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Error Rate</p>
                <p className="text-2xl font-bold text-red-600">
                  {selectedTrace.status === 'error' ? '100%' : '0%'}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Latency</p>
                <p className="text-2xl font-bold">
                  {Math.round(selectedTrace.duration / 
                    selectedTrace.spans.reduce((count, span) => 
                      count + 1 + (span.children?.length || 0), 0
                    )
                  )}ms
                </p>
              </div>
              <Clock className="h-8 w-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Add missing imports
import { Shield, Brain, Sparkles, Rocket, Container, Bell, HardDrive } from 'lucide-react';