'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from '@/hooks/use-toast';
import {
  Search,
  Send,
  Copy,
  ChevronDown,
  ChevronRight,
  Code,
  Terminal,
  FileJson,
  Globe,
  Shield,
  Zap,
  Database,
  GitBranch,
  Brain,
  Activity,
  Rocket,
  Network,
  Settings,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  Download,
  Upload,
  Sparkles,
} from 'lucide-react';

// Comprehensive API documentation
const apiCategories = {
  'Core APIs': {
    icon: Code,
    endpoints: [
      {
        method: 'GET',
        path: '/api/v2/orchestrator/status',
        description: 'Get orchestrator status and health',
        auth: false,
        params: [],
        response: {
          status: 'healthy',
          version: '2.0.0',
          uptime: 86400,
          activeWorkflows: 12,
        },
      },
      {
        method: 'POST',
        path: '/api/v2/orchestrator/workflow',
        description: 'Create a new workflow',
        auth: true,
        params: [
          { name: 'name', type: 'string', required: true, description: 'Workflow name' },
          { name: 'steps', type: 'array', required: true, description: 'Workflow steps' },
          { name: 'config', type: 'object', required: false, description: 'Workflow configuration' },
        ],
        response: {
          id: 'wf_123',
          status: 'created',
          createdAt: '2024-01-20T10:00:00Z',
        },
      },
      {
        method: 'GET',
        path: '/api/v2/orchestrator/workflow/:id',
        description: 'Get workflow details',
        auth: true,
        params: [
          { name: 'id', type: 'string', required: true, description: 'Workflow ID' },
        ],
        response: {
          id: 'wf_123',
          name: 'My Workflow',
          status: 'running',
          steps: [],
        },
      },
    ],
  },
  'AI Agents': {
    icon: Brain,
    endpoints: [
      {
        method: 'GET',
        path: '/api/agents',
        description: 'List all AI agents',
        auth: true,
        params: [],
        response: [
          { id: 'agent_1', name: 'Code Review Agent', status: 'active' },
          { id: 'agent_2', name: 'Security Agent', status: 'active' },
        ],
      },
      {
        method: 'POST',
        path: '/api/agents/:id/execute',
        description: 'Execute an AI agent task',
        auth: true,
        params: [
          { name: 'id', type: 'string', required: true, description: 'Agent ID' },
          { name: 'input', type: 'object', required: true, description: 'Task input' },
          { name: 'config', type: 'object', required: false, description: 'Execution config' },
        ],
        response: {
          taskId: 'task_123',
          status: 'queued',
          estimatedTime: 30,
        },
      },
      {
        method: 'GET',
        path: '/api/agents/:id/metrics',
        description: 'Get agent performance metrics',
        auth: true,
        params: [
          { name: 'id', type: 'string', required: true, description: 'Agent ID' },
          { name: 'timeRange', type: 'string', required: false, description: 'Time range (1h, 24h, 7d)' },
        ],
        response: {
          successRate: 0.96,
          avgResponseTime: 2.5,
          tasksCompleted: 1234,
        },
      },
    ],
  },
  'Learning & Intelligence': {
    icon: Sparkles,
    endpoints: [
      {
        method: 'GET',
        path: '/api/learning/insights',
        description: 'Get learning system insights',
        auth: true,
        params: [],
        response: {
          learningRate: 0.028,
          patternsDetected: 256,
          improvements: [],
        },
      },
      {
        method: 'POST',
        path: '/api/learning/feedback',
        description: 'Submit learning feedback',
        auth: true,
        params: [
          { name: 'type', type: 'string', required: true, description: 'Feedback type' },
          { name: 'data', type: 'object', required: true, description: 'Feedback data' },
        ],
        response: {
          accepted: true,
          impact: 'medium',
        },
      },
    ],
  },
  'Monitoring & Observability': {
    icon: Activity,
    endpoints: [
      {
        method: 'GET',
        path: '/api/metrics',
        description: 'Get Prometheus metrics',
        auth: false,
        params: [],
        response: '# HELP api_requests_total Total API requests\n# TYPE api_requests_total counter\napi_requests_total{method="GET",status="200"} 12345',
      },
      {
        method: 'GET',
        path: '/api/tracing/:traceId',
        description: 'Get distributed trace details',
        auth: true,
        params: [
          { name: 'traceId', type: 'string', required: true, description: 'Trace ID' },
        ],
        response: {
          traceId: 'trace_123',
          spans: [],
          duration: 1234,
        },
      },
    ],
  },
  'Security': {
    icon: Shield,
    endpoints: [
      {
        method: 'POST',
        path: '/api/security/scan',
        description: 'Run security scan',
        auth: true,
        params: [
          { name: 'target', type: 'string', required: true, description: 'Scan target' },
          { name: 'depth', type: 'string', required: false, description: 'Scan depth' },
        ],
        response: {
          scanId: 'scan_123',
          vulnerabilities: [],
          status: 'running',
        },
      },
    ],
  },
  'Deployment': {
    icon: Rocket,
    endpoints: [
      {
        method: 'POST',
        path: '/api/deploy',
        description: 'Deploy application',
        auth: true,
        params: [
          { name: 'projectId', type: 'string', required: true, description: 'Project ID' },
          { name: 'environment', type: 'string', required: true, description: 'Target environment' },
          { name: 'platform', type: 'string', required: true, description: 'Deployment platform' },
        ],
        response: {
          deploymentId: 'deploy_123',
          status: 'initiated',
          url: 'https://myapp.vercel.app',
        },
      },
    ],
  },
};

export const APIExplorer: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Core APIs');
  const [selectedEndpoint, setSelectedEndpoint] = useState<any>(null);
  const [method, setMethod] = useState<string>('GET');
  const [url, setUrl] = useState<string>('');
  const [headers, setHeaders] = useState<string>('{\n  "Content-Type": "application/json"\n}');
  const [body, setBody] = useState<string>('{\n  \n}');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const executeRequest = async () => {
    setLoading(true);
    setResponse(null);

    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (selectedEndpoint) {
        setResponse({
          status: 200,
          statusText: 'OK',
          headers: {
            'Content-Type': 'application/json',
            'X-Response-Time': '123ms',
          },
          data: selectedEndpoint.response,
        });
      } else {
        setResponse({
          status: 404,
          statusText: 'Not Found',
          data: { error: 'Endpoint not found' },
        });
      }
    } catch (error) {
      setResponse({
        status: 500,
        statusText: 'Internal Server Error',
        data: { error: 'Request failed' },
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard',
      description: 'The content has been copied to your clipboard.',
    });
  };

  const generateCode = (language: string) => {
    if (!selectedEndpoint) return '';

    switch (language) {
      case 'curl':
        return `curl -X ${selectedEndpoint.method} \\
  ${selectedEndpoint.auth ? '-H "Authorization: Bearer YOUR_TOKEN" \\' : ''}
  -H "Content-Type: application/json" \\
  ${selectedEndpoint.method !== 'GET' ? `-d '${body}' \\` : ''}
  http://localhost:3000${selectedEndpoint.path}`;

      case 'javascript':
        return `const response = await fetch('http://localhost:3000${selectedEndpoint.path}', {
  method: '${selectedEndpoint.method}',
  headers: ${headers},
  ${selectedEndpoint.method !== 'GET' ? `body: JSON.stringify(${body})` : ''}
});

const data = await response.json();
console.log(data);`;

      case 'python':
        return `import requests

response = requests.${selectedEndpoint.method.toLowerCase()}(
    'http://localhost:3000${selectedEndpoint.path}',
    ${selectedEndpoint.auth ? "headers={'Authorization': 'Bearer YOUR_TOKEN'}," : ''}
    ${selectedEndpoint.method !== 'GET' ? `json=${body}` : ''}
)

print(response.json())`;

      default:
        return '';
    }
  };

  const filteredEndpoints = Object.entries(apiCategories).reduce((acc, [category, data]) => {
    const filtered = data.endpoints.filter(endpoint =>
      endpoint.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      endpoint.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    if (filtered.length > 0) {
      acc[category] = { ...data, endpoints: filtered };
    }
    
    return acc;
  }, {} as typeof apiCategories);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold">API Explorer</h2>
        <p className="text-muted-foreground">
          Interactive API documentation and testing interface
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>API Endpoints</CardTitle>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search endpoints..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                {Object.entries(filteredEndpoints).map(([category, data]) => {
                  const Icon = data.icon;
                  return (
                    <Collapsible
                      key={category}
                      open={selectedCategory === category}
                      onOpenChange={() => setSelectedCategory(category)}
                    >
                      <CollapsibleTrigger className="flex items-center gap-2 w-full p-2 hover:bg-muted rounded-lg">
                        <Icon className="h-4 w-4" />
                        <span className="font-medium flex-1 text-left">{category}</span>
                        {selectedCategory === category ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pl-6 space-y-1 mt-1">
                        {data.endpoints.map((endpoint, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setSelectedEndpoint(endpoint);
                              setMethod(endpoint.method);
                              setUrl(`http://localhost:3000${endpoint.path}`);
                            }}
                            className={`w-full text-left p-2 rounded-lg hover:bg-muted transition-colors ${
                              selectedEndpoint === endpoint ? 'bg-muted' : ''
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  endpoint.method === 'GET' ? 'default' :
                                  endpoint.method === 'POST' ? 'secondary' :
                                  endpoint.method === 'PUT' ? 'outline' :
                                  'destructive'
                                }
                                className="text-xs"
                              >
                                {endpoint.method}
                              </Badge>
                              <span className="text-sm truncate">{endpoint.path}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {endpoint.description}
                            </p>
                          </button>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  );
                })}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Request Builder */}
          <Card>
            <CardHeader>
              <CardTitle>Request</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Select value={method} onValueChange={setMethod}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter URL..."
                  className="flex-1"
                />
                <Button onClick={executeRequest} disabled={loading}>
                  {loading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  Send
                </Button>
              </div>

              {selectedEndpoint && (
                <div className="space-y-4">
                  {/* Authentication */}
                  {selectedEndpoint.auth && (
                    <Alert>
                      <Shield className="h-4 w-4" />
                      <AlertDescription>
                        This endpoint requires authentication. Include a Bearer token in the Authorization header.
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Parameters */}
                  {selectedEndpoint.params.length > 0 && (
                    <div>
                      <Label>Parameters</Label>
                      <div className="mt-2 space-y-2">
                        {selectedEndpoint.params.map((param: any, index: number) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <Badge variant={param.required ? 'default' : 'outline'}>
                              {param.required ? 'Required' : 'Optional'}
                            </Badge>
                            <code className="font-mono">{param.name}</code>
                            <span className="text-muted-foreground">({param.type})</span>
                            <span className="text-muted-foreground">- {param.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Headers */}
                  <Tabs defaultValue="headers">
                    <TabsList>
                      <TabsTrigger value="headers">Headers</TabsTrigger>
                      <TabsTrigger value="body">Body</TabsTrigger>
                    </TabsList>
                    <TabsContent value="headers">
                      <Textarea
                        value={headers}
                        onChange={(e) => setHeaders(e.target.value)}
                        className="font-mono text-sm h-32"
                        placeholder="Enter headers as JSON..."
                      />
                    </TabsContent>
                    <TabsContent value="body">
                      <Textarea
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        className="font-mono text-sm h-32"
                        placeholder="Enter request body as JSON..."
                        disabled={method === 'GET'}
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Response */}
          {response && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Response</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        response.status >= 200 && response.status < 300 ? 'default' :
                        response.status >= 400 && response.status < 500 ? 'secondary' :
                        'destructive'
                      }
                    >
                      {response.status} {response.statusText}
                    </Badge>
                    {response.headers?.['X-Response-Time'] && (
                      <Badge variant="outline">
                        <Clock className="h-3 w-3 mr-1" />
                        {response.headers['X-Response-Time']}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="body">
                  <TabsList>
                    <TabsTrigger value="body">Body</TabsTrigger>
                    <TabsTrigger value="headers">Headers</TabsTrigger>
                    <TabsTrigger value="raw">Raw</TabsTrigger>
                  </TabsList>
                  <TabsContent value="body">
                    <div className="relative">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(JSON.stringify(response.data, null, 2))}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-96">
                        <code className="text-sm">
                          {JSON.stringify(response.data, null, 2)}
                        </code>
                      </pre>
                    </div>
                  </TabsContent>
                  <TabsContent value="headers">
                    <pre className="bg-muted p-4 rounded-lg overflow-auto">
                      <code className="text-sm">
                        {JSON.stringify(response.headers, null, 2)}
                      </code>
                    </pre>
                  </TabsContent>
                  <TabsContent value="raw">
                    <pre className="bg-muted p-4 rounded-lg overflow-auto">
                      <code className="text-sm">
                        {JSON.stringify(response, null, 2)}
                      </code>
                    </pre>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}

          {/* Code Generation */}
          {selectedEndpoint && (
            <Card>
              <CardHeader>
                <CardTitle>Code Examples</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="curl">
                  <TabsList>
                    <TabsTrigger value="curl">cURL</TabsTrigger>
                    <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                    <TabsTrigger value="python">Python</TabsTrigger>
                  </TabsList>
                  <TabsContent value="curl">
                    <div className="relative">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(generateCode('curl'))}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <pre className="bg-muted p-4 rounded-lg overflow-auto">
                        <code className="text-sm">{generateCode('curl')}</code>
                      </pre>
                    </div>
                  </TabsContent>
                  <TabsContent value="javascript">
                    <div className="relative">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(generateCode('javascript'))}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <pre className="bg-muted p-4 rounded-lg overflow-auto">
                        <code className="text-sm">{generateCode('javascript')}</code>
                      </pre>
                    </div>
                  </TabsContent>
                  <TabsContent value="python">
                    <div className="relative">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(generateCode('python'))}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <pre className="bg-muted p-4 rounded-lg overflow-auto">
                        <code className="text-sm">{generateCode('python')}</code>
                      </pre>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};