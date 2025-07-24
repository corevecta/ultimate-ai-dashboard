'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Input } from '../ui/input';
import { Alert, AlertDescription } from '../ui/alert';
import {
  Search,
  Eye,
  EyeOff,
  Star,
  Lock,
  Unlock,
  Zap,
  Code,
  Shield,
  Brain,
  GitBranch,
  Database,
  Network,
  Package,
  Settings,
  Terminal,
  Cloud,
  FileCode,
  Layers,
  Activity,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowRight,
  Sparkles,
  Cpu,
  HardDrive,
  Server,
  Workflow,
  ClipboardList,
  FileSearch,
  Gauge,
  Bot,
  Webhook,
  Filter,
} from 'lucide-react';

// Comprehensive backend feature inventory
const backendFeatures = {
  'Core Orchestration': {
    icon: Cpu,
    coverage: 25,
    features: [
      { name: 'Enhanced Orchestrator V2', status: 'hidden', description: 'DAG workflow engine with n8n integration', apiEndpoint: '/api/v2/orchestrator', complexity: 'high' },
      { name: 'Plugin Architecture', status: 'hidden', description: 'Dynamic plugin loading and management', apiEndpoint: '/api/plugins', complexity: 'medium' },
      { name: 'Distributed Task Execution', status: 'hidden', description: 'Redis-based distributed queue system', apiEndpoint: '/api/tasks', complexity: 'high' },
      { name: 'MCP Integrations', status: 'hidden', description: 'Model Context Protocol server management', apiEndpoint: '/api/mcp', complexity: 'medium' },
      { name: 'Platform Registry', status: 'partial', description: '50+ platform templates and configurations', apiEndpoint: '/api/platforms', complexity: 'low' },
      { name: 'Brand Guidelines Engine', status: 'hidden', description: 'Automated brand compliance checking', apiEndpoint: '/api/brand', complexity: 'medium' },
      { name: 'Prompt Engine', status: 'hidden', description: 'Dynamic prompt generation and optimization', apiEndpoint: '/api/prompts', complexity: 'medium' },
      { name: 'GitHub Integration', status: 'partial', description: 'Full repository and PR management', apiEndpoint: '/api/github', complexity: 'medium' },
      { name: 'CI/CD Pipeline Integration', status: 'hidden', description: 'Automated deployment pipelines', apiEndpoint: '/api/cicd', complexity: 'high' },
    ],
  },
  'AI Agent System': {
    icon: Brain,
    coverage: 10,
    features: [
      { name: 'Code Review Agent', status: 'partial', description: 'Automated code quality analysis', apiEndpoint: '/api/agents/code-review', complexity: 'medium' },
      { name: 'Security Audit Agent', status: 'partial', description: 'Vulnerability scanning and fixes', apiEndpoint: '/api/agents/security', complexity: 'high' },
      { name: 'QA Agent', status: 'partial', description: 'Quality assurance automation', apiEndpoint: '/api/agents/qa', complexity: 'medium' },
      { name: 'Test Generation Agent', status: 'partial', description: 'Automatic test suite creation', apiEndpoint: '/api/agents/test-gen', complexity: 'medium' },
      { name: 'UI/UX Designer AI', status: 'hidden', description: 'Design system generation', apiEndpoint: '/api/agents/uiux', complexity: 'high' },
      { name: 'Documentation Generator', status: 'hidden', description: 'Automatic docs creation', apiEndpoint: '/api/agents/docs', complexity: 'low' },
      { name: 'Deployment Architect AI', status: 'hidden', description: 'Infrastructure planning', apiEndpoint: '/api/agents/deployment', complexity: 'high' },
      { name: 'Performance Optimizer AI', status: 'hidden', description: 'Code optimization suggestions', apiEndpoint: '/api/agents/performance', complexity: 'medium' },
      { name: 'Accessibility Checker AI', status: 'hidden', description: 'A11y compliance validation', apiEndpoint: '/api/agents/a11y', complexity: 'medium' },
      { name: 'Data Architect AI', status: 'hidden', description: 'Database schema design', apiEndpoint: '/api/agents/data', complexity: 'high' },
      { name: 'API Designer AI', status: 'hidden', description: 'REST/GraphQL API generation', apiEndpoint: '/api/agents/api-design', complexity: 'medium' },
      { name: 'Cost Optimizer AI', status: 'hidden', description: 'Cloud cost optimization', apiEndpoint: '/api/agents/cost', complexity: 'medium' },
      { name: 'Monitoring Setup AI', status: 'hidden', description: 'Observability configuration', apiEndpoint: '/api/agents/monitoring', complexity: 'medium' },
      { name: 'Migration Assistant AI', status: 'hidden', description: 'Legacy code migration', apiEndpoint: '/api/agents/migration', complexity: 'high' },
    ],
  },
  'Workflow & Pipeline': {
    icon: GitBranch,
    coverage: 15,
    features: [
      { name: 'Visual Pipeline Designer', status: 'partial', description: 'Drag-drop pipeline creation', apiEndpoint: '/api/pipelines/designer', complexity: 'medium' },
      { name: 'DAG Execution Engine', status: 'hidden', description: 'Directed acyclic graph processing', apiEndpoint: '/api/workflow/dag', complexity: 'high' },
      { name: 'Conditional Branching', status: 'hidden', description: 'Dynamic workflow paths', apiEndpoint: '/api/workflow/conditions', complexity: 'medium' },
      { name: 'Parallel Execution', status: 'hidden', description: 'Concurrent task processing', apiEndpoint: '/api/workflow/parallel', complexity: 'medium' },
      { name: 'Checkpoint/Resume', status: 'hidden', description: 'Workflow state persistence', apiEndpoint: '/api/workflow/checkpoint', complexity: 'high' },
      { name: 'Workflow Templates', status: 'hidden', description: 'Reusable workflow patterns', apiEndpoint: '/api/workflow/templates', complexity: 'low' },
      { name: 'n8n Integration', status: 'hidden', description: 'External workflow connector', apiEndpoint: '/api/workflow/n8n', complexity: 'medium' },
      { name: 'Event Triggers', status: 'hidden', description: 'Event-driven workflows', apiEndpoint: '/api/workflow/triggers', complexity: 'medium' },
      { name: 'Workflow Versioning', status: 'hidden', description: 'Version control for workflows', apiEndpoint: '/api/workflow/versions', complexity: 'medium' },
      { name: 'Workflow Analytics', status: 'hidden', description: 'Performance insights', apiEndpoint: '/api/workflow/analytics', complexity: 'medium' },
    ],
  },
  'Learning & Intelligence': {
    icon: Sparkles,
    coverage: 20,
    features: [
      { name: 'Learning Feedback Loop', status: 'partial', description: 'Continuous improvement system', apiEndpoint: '/api/learning/feedback', complexity: 'high' },
      { name: 'Pattern Detection', status: 'hidden', description: 'Success pattern identification', apiEndpoint: '/api/learning/patterns', complexity: 'high' },
      { name: 'Prompt Improvement', status: 'hidden', description: 'Automatic prompt optimization', apiEndpoint: '/api/learning/prompts', complexity: 'medium' },
      { name: 'Quality Prediction', status: 'partial', description: 'ML-based quality scoring', apiEndpoint: '/api/learning/quality', complexity: 'medium' },
      { name: 'Template Evolution', status: 'hidden', description: 'Self-improving templates', apiEndpoint: '/api/learning/templates', complexity: 'high' },
      { name: 'Performance Analysis', status: 'hidden', description: 'Deep performance insights', apiEndpoint: '/api/learning/performance', complexity: 'medium' },
      { name: 'Error Pattern Learning', status: 'hidden', description: 'Error prevention system', apiEndpoint: '/api/learning/errors', complexity: 'high' },
      { name: 'Success Metrics Tracking', status: 'hidden', description: 'KPI monitoring', apiEndpoint: '/api/learning/metrics', complexity: 'low' },
      { name: 'A/B Testing Framework', status: 'hidden', description: 'Experimentation platform', apiEndpoint: '/api/learning/experiments', complexity: 'medium' },
      { name: 'Model Fine-tuning', status: 'hidden', description: 'Custom model training', apiEndpoint: '/api/learning/finetuning', complexity: 'high' },
    ],
  },
  'Advanced Features': {
    icon: Zap,
    coverage: 5,
    features: [
      { name: 'Smart Cache', status: 'partial', description: 'Intelligent caching system', apiEndpoint: '/api/cache', complexity: 'medium' },
      { name: 'Context-Aware Retry', status: 'hidden', description: 'Smart retry strategies', apiEndpoint: '/api/retry', complexity: 'medium' },
      { name: 'Error Recovery', status: 'hidden', description: 'Multi-strategy recovery', apiEndpoint: '/api/recovery', complexity: 'high' },
      { name: 'Checkpoint Manager', status: 'hidden', description: 'State persistence system', apiEndpoint: '/api/checkpoint', complexity: 'medium' },
      { name: 'Resource Optimization', status: 'hidden', description: 'Resource usage optimizer', apiEndpoint: '/api/optimization', complexity: 'high' },
      { name: 'Auto-scaling', status: 'hidden', description: 'Dynamic resource scaling', apiEndpoint: '/api/autoscale', complexity: 'high' },
      { name: 'Load Balancing', status: 'hidden', description: 'Request distribution', apiEndpoint: '/api/loadbalance', complexity: 'medium' },
      { name: 'Circuit Breaker', status: 'hidden', description: 'Fault tolerance system', apiEndpoint: '/api/circuitbreaker', complexity: 'medium' },
      { name: 'Rate Limiting', status: 'hidden', description: 'API rate control', apiEndpoint: '/api/ratelimit', complexity: 'low' },
      { name: 'Request Deduplication', status: 'hidden', description: 'Duplicate request prevention', apiEndpoint: '/api/dedup', complexity: 'medium' },
    ],
  },
  'Observability': {
    icon: Activity,
    coverage: 30,
    features: [
      { name: 'Distributed Tracing', status: 'partial', description: 'End-to-end request tracing', apiEndpoint: '/api/tracing', complexity: 'high' },
      { name: 'Metrics Collection', status: 'partial', description: 'Prometheus-compatible metrics', apiEndpoint: '/api/metrics', complexity: 'medium' },
      { name: 'Custom Dashboards', status: 'hidden', description: 'Metric visualization builder', apiEndpoint: '/api/dashboards', complexity: 'medium' },
      { name: 'Alert Management', status: 'partial', description: 'Alerting rules engine', apiEndpoint: '/api/alerts', complexity: 'medium' },
      { name: 'Log Aggregation', status: 'partial', description: 'Centralized logging', apiEndpoint: '/api/logs', complexity: 'medium' },
      { name: 'Performance Profiling', status: 'hidden', description: 'Deep performance analysis', apiEndpoint: '/api/profiling', complexity: 'high' },
      { name: 'Service Map', status: 'hidden', description: 'Service dependency visualization', apiEndpoint: '/api/servicemap', complexity: 'medium' },
      { name: 'SLO/SLA Tracking', status: 'hidden', description: 'Service level monitoring', apiEndpoint: '/api/slo', complexity: 'medium' },
      { name: 'Anomaly Detection', status: 'hidden', description: 'ML-based anomaly detection', apiEndpoint: '/api/anomalies', complexity: 'high' },
      { name: 'Capacity Planning', status: 'hidden', description: 'Resource forecasting', apiEndpoint: '/api/capacity', complexity: 'high' },
    ],
  },
  'Integration Systems': {
    icon: Network,
    coverage: 15,
    features: [
      { name: 'API Gateway', status: 'hidden', description: 'Unified API management', apiEndpoint: '/api/gateway', complexity: 'high' },
      { name: 'WebSocket Support', status: 'hidden', description: 'Real-time communication', apiEndpoint: '/api/websocket', complexity: 'medium' },
      { name: 'GraphQL API', status: 'hidden', description: 'GraphQL endpoint', apiEndpoint: '/api/graphql', complexity: 'medium' },
      { name: 'Webhook Management', status: 'hidden', description: 'Webhook configuration', apiEndpoint: '/api/webhooks', complexity: 'medium' },
      { name: 'Event Bus', status: 'hidden', description: 'Event-driven architecture', apiEndpoint: '/api/events', complexity: 'high' },
      { name: 'Message Queue', status: 'hidden', description: 'Async messaging system', apiEndpoint: '/api/queue', complexity: 'medium' },
      { name: 'External API Connectors', status: 'hidden', description: '3rd party integrations', apiEndpoint: '/api/connectors', complexity: 'medium' },
      { name: 'OAuth2 Provider', status: 'hidden', description: 'Authentication server', apiEndpoint: '/api/oauth', complexity: 'high' },
      { name: 'SAML Integration', status: 'hidden', description: 'Enterprise SSO', apiEndpoint: '/api/saml', complexity: 'high' },
      { name: 'API Versioning', status: 'hidden', description: 'Version management', apiEndpoint: '/api/versions', complexity: 'medium' },
    ],
  },
  'Security & Compliance': {
    icon: Shield,
    coverage: 10,
    features: [
      { name: 'Security Scanner', status: 'partial', description: 'Vulnerability detection', apiEndpoint: '/api/security/scan', complexity: 'high' },
      { name: 'Compliance Checker', status: 'hidden', description: 'Regulatory compliance', apiEndpoint: '/api/compliance', complexity: 'high' },
      { name: 'Secret Management', status: 'hidden', description: 'Secure secret storage', apiEndpoint: '/api/secrets', complexity: 'medium' },
      { name: 'Audit Logging', status: 'hidden', description: 'Security audit trail', apiEndpoint: '/api/audit', complexity: 'medium' },
      { name: 'RBAC System', status: 'hidden', description: 'Role-based access control', apiEndpoint: '/api/rbac', complexity: 'high' },
      { name: 'Data Encryption', status: 'hidden', description: 'At-rest & in-transit encryption', apiEndpoint: '/api/encryption', complexity: 'medium' },
      { name: 'API Security', status: 'hidden', description: 'API protection layer', apiEndpoint: '/api/security/api', complexity: 'medium' },
      { name: 'Threat Detection', status: 'hidden', description: 'Real-time threat monitoring', apiEndpoint: '/api/threats', complexity: 'high' },
      { name: 'Compliance Reports', status: 'hidden', description: 'Automated reporting', apiEndpoint: '/api/reports', complexity: 'low' },
      { name: 'Zero Trust Architecture', status: 'hidden', description: 'Zero trust implementation', apiEndpoint: '/api/zerotrust', complexity: 'high' },
    ],
  },
  'Deployment & Infrastructure': {
    icon: Cloud,
    coverage: 20,
    features: [
      { name: 'Multi-Cloud Deploy', status: 'partial', description: 'Deploy to any cloud', apiEndpoint: '/api/deploy/cloud', complexity: 'high' },
      { name: 'Kubernetes Support', status: 'hidden', description: 'K8s deployment', apiEndpoint: '/api/deploy/k8s', complexity: 'high' },
      { name: 'Docker Generation', status: 'hidden', description: 'Container creation', apiEndpoint: '/api/deploy/docker', complexity: 'medium' },
      { name: 'CI/CD Templates', status: 'hidden', description: 'Pipeline templates', apiEndpoint: '/api/deploy/cicd', complexity: 'medium' },
      { name: 'Environment Management', status: 'hidden', description: 'Multi-env support', apiEndpoint: '/api/deploy/env', complexity: 'medium' },
      { name: 'Blue-Green Deploy', status: 'hidden', description: 'Zero-downtime deploys', apiEndpoint: '/api/deploy/bluegreen', complexity: 'high' },
      { name: 'Canary Releases', status: 'hidden', description: 'Gradual rollouts', apiEndpoint: '/api/deploy/canary', complexity: 'high' },
      { name: 'Rollback System', status: 'hidden', description: 'Instant rollbacks', apiEndpoint: '/api/deploy/rollback', complexity: 'medium' },
      { name: 'Infrastructure as Code', status: 'hidden', description: 'IaC generation', apiEndpoint: '/api/deploy/iac', complexity: 'high' },
      { name: 'Cost Estimation', status: 'hidden', description: 'Deployment cost prediction', apiEndpoint: '/api/deploy/cost', complexity: 'medium' },
    ],
  },
  'Data & Storage': {
    icon: Database,
    coverage: 5,
    features: [
      { name: 'Database Migrations', status: 'hidden', description: 'Schema migration system', apiEndpoint: '/api/data/migrations', complexity: 'medium' },
      { name: 'Backup Management', status: 'hidden', description: 'Automated backups', apiEndpoint: '/api/data/backup', complexity: 'medium' },
      { name: 'Data Replication', status: 'hidden', description: 'Multi-region replication', apiEndpoint: '/api/data/replication', complexity: 'high' },
      { name: 'Cache Management', status: 'partial', description: 'Redis cache control', apiEndpoint: '/api/data/cache', complexity: 'medium' },
      { name: 'Data Archival', status: 'hidden', description: 'Long-term storage', apiEndpoint: '/api/data/archive', complexity: 'medium' },
      { name: 'ETL Pipelines', status: 'hidden', description: 'Data transformation', apiEndpoint: '/api/data/etl', complexity: 'high' },
      { name: 'Data Validation', status: 'hidden', description: 'Schema validation', apiEndpoint: '/api/data/validation', complexity: 'medium' },
      { name: 'Query Optimization', status: 'hidden', description: 'Performance tuning', apiEndpoint: '/api/data/optimize', complexity: 'high' },
      { name: 'Data Privacy', status: 'hidden', description: 'PII management', apiEndpoint: '/api/data/privacy', complexity: 'high' },
      { name: 'Data Analytics', status: 'hidden', description: 'Analytics engine', apiEndpoint: '/api/data/analytics', complexity: 'high' },
    ],
  },
};

export const FeatureDiscoveryDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'exposed' | 'partial' | 'hidden'>('all');
  const [filterComplexity, setFilterComplexity] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  // Calculate overall coverage
  const totalFeatures = Object.values(backendFeatures).reduce((sum, cat) => sum + cat.features.length, 0);
  const exposedFeatures = Object.values(backendFeatures).reduce(
    (sum, cat) => sum + cat.features.filter(f => f.status === 'exposed').length,
    0
  );
  const partialFeatures = Object.values(backendFeatures).reduce(
    (sum, cat) => sum + cat.features.filter(f => f.status === 'partial').length,
    0
  );
  const hiddenFeatures = Object.values(backendFeatures).reduce(
    (sum, cat) => sum + cat.features.filter(f => f.status === 'hidden').length,
    0
  );
  const overallCoverage = Math.round(((exposedFeatures + partialFeatures * 0.5) / totalFeatures) * 100);

  // Filter features
  const filteredCategories = Object.entries(backendFeatures).filter(([category, data]) => {
    if (selectedCategory && category !== selectedCategory) return false;
    
    const hasMatchingFeatures = data.features.some(feature => {
      const matchesSearch = feature.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           feature.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || feature.status === filterStatus;
      const matchesComplexity = filterComplexity === 'all' || feature.complexity === filterComplexity;
      
      return matchesSearch && matchesStatus && matchesComplexity;
    });
    
    return hasMatchingFeatures;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'exposed':
        return 'text-green-600 bg-green-50';
      case 'partial':
        return 'text-yellow-600 bg-yellow-50';
      case 'hidden':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low':
        return 'text-blue-600';
      case 'medium':
        return 'text-orange-600';
      case 'high':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold">Feature Discovery Dashboard</h2>
        <p className="text-muted-foreground">
          Comprehensive view of all backend capabilities and their UI exposure status
        </p>
      </div>

      {/* Overall Progress */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-medium">
              Current UI Coverage: {overallCoverage}% of backend features exposed
            </p>
            <Progress value={overallCoverage} className="h-3" />
            <div className="flex gap-4 text-sm">
              <span className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-600" />
                {exposedFeatures} Fully Exposed
              </span>
              <span className="flex items-center gap-1">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                {partialFeatures} Partially Exposed
              </span>
              <span className="flex items-center gap-1">
                <XCircle className="h-4 w-4 text-red-600" />
                {hiddenFeatures} Hidden
              </span>
              <span className="text-muted-foreground">
                Total: {totalFeatures} features
              </span>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search features..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('all')}
          >
            All
          </Button>
          <Button
            variant={filterStatus === 'exposed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('exposed')}
          >
            <Eye className="h-4 w-4 mr-1" />
            Exposed
          </Button>
          <Button
            variant={filterStatus === 'partial' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('partial')}
          >
            <Eye className="h-4 w-4 mr-1" />
            Partial
          </Button>
          <Button
            variant={filterStatus === 'hidden' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('hidden')}
          >
            <EyeOff className="h-4 w-4 mr-1" />
            Hidden
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterComplexity === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterComplexity('all')}
          >
            All Complexity
          </Button>
          <Button
            variant={filterComplexity === 'low' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterComplexity('low')}
          >
            Low
          </Button>
          <Button
            variant={filterComplexity === 'medium' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterComplexity('medium')}
          >
            Medium
          </Button>
          <Button
            variant={filterComplexity === 'high' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterComplexity('high')}
          >
            High
          </Button>
        </div>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(backendFeatures).map(([category, data]) => {
          const Icon = data.icon;
          const categoryExposed = data.features.filter(f => f.status === 'exposed').length;
          const categoryPartial = data.features.filter(f => f.status === 'partial').length;
          const categoryTotal = data.features.length;
          const categoryCoverage = Math.round(((categoryExposed + categoryPartial * 0.5) / categoryTotal) * 100);

          return (
            <Card
              key={category}
              className={`cursor-pointer transition-all ${
                selectedCategory === category ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{category}</CardTitle>
                      <CardDescription>
                        {categoryTotal} features • {categoryCoverage}% exposed
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-lg">
                    {categoryCoverage}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Progress value={categoryCoverage} className="h-2 mb-4" />
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-green-600">{categoryExposed}</div>
                    <div className="text-xs text-muted-foreground">Exposed</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-yellow-600">{categoryPartial}</div>
                    <div className="text-xs text-muted-foreground">Partial</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-red-600">
                      {categoryTotal - categoryExposed - categoryPartial}
                    </div>
                    <div className="text-xs text-muted-foreground">Hidden</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Feature List */}
      <Tabs defaultValue="list" className="mt-6">
        <TabsList>
          <TabsTrigger value="list">Feature List</TabsTrigger>
          <TabsTrigger value="roadmap">Implementation Roadmap</TabsTrigger>
          <TabsTrigger value="api">API Endpoints</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {filteredCategories.map(([category, data]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {React.createElement(data.icon, { className: "h-5 w-5" })}
                  {category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {data.features
                    .filter(feature => {
                      const matchesSearch = feature.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                           feature.description.toLowerCase().includes(searchQuery.toLowerCase());
                      const matchesStatus = filterStatus === 'all' || feature.status === filterStatus;
                      const matchesComplexity = filterComplexity === 'all' || feature.complexity === filterComplexity;
                      return matchesSearch && matchesStatus && matchesComplexity;
                    })
                    .map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{feature.name}</h4>
                            <Badge className={`text-xs ${getStatusColor(feature.status)}`}>
                              {feature.status}
                            </Badge>
                            <Badge variant="outline" className={`text-xs ${getComplexityColor(feature.complexity)}`}>
                              {feature.complexity}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
                          <code className="text-xs text-muted-foreground mt-1 block">
                            {feature.apiEndpoint}
                          </code>
                        </div>
                        <div className="flex gap-2">
                          {feature.status === 'hidden' && (
                            <Button size="sm" variant="outline">
                              <Unlock className="h-4 w-4 mr-1" />
                              Expose
                            </Button>
                          )}
                          {feature.status === 'partial' && (
                            <Button size="sm" variant="outline">
                              <ArrowRight className="h-4 w-4 mr-1" />
                              Complete
                            </Button>
                          )}
                          {feature.status === 'exposed' && (
                            <Button size="sm" variant="secondary">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              View UI
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="roadmap" className="space-y-4">
          <Alert>
            <Sparkles className="h-4 w-4" />
            <AlertDescription>
              Implementation roadmap to achieve 100% backend coverage in the UI
            </AlertDescription>
          </Alert>
          
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Phase 1: Critical Features (Week 1-2)</CardTitle>
                <CardDescription>Expose high-impact features with existing UI patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(backendFeatures)
                    .flatMap(([cat, data]) => 
                      data.features
                        .filter(f => f.status === 'hidden' && f.complexity === 'low')
                        .map(f => ({ ...f, category: cat }))
                    )
                    .slice(0, 10)
                    .map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{feature.name}</span>
                        <span className="text-muted-foreground">({feature.category})</span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Phase 2: Complex Features (Week 3-4)</CardTitle>
                <CardDescription>Build specialized UIs for complex backend features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(backendFeatures)
                    .flatMap(([cat, data]) => 
                      data.features
                        .filter(f => f.status === 'hidden' && f.complexity === 'medium')
                        .map(f => ({ ...f, category: cat }))
                    )
                    .slice(0, 10)
                    .map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{feature.name}</span>
                        <span className="text-muted-foreground">({feature.category})</span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Phase 3: Advanced Features (Week 5-6)</CardTitle>
                <CardDescription>Implement sophisticated UIs for advanced capabilities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(backendFeatures)
                    .flatMap(([cat, data]) => 
                      data.features
                        .filter(f => f.status === 'hidden' && f.complexity === 'high')
                        .map(f => ({ ...f, category: cat }))
                    )
                    .slice(0, 10)
                    .map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Zap className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{feature.name}</span>
                        <span className="text-muted-foreground">({feature.category})</span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Endpoint Coverage</CardTitle>
              <CardDescription>All backend API endpoints and their UI integration status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 font-mono text-sm">
                {Object.entries(backendFeatures)
                  .flatMap(([cat, data]) => data.features)
                  .sort((a, b) => a.apiEndpoint.localeCompare(b.apiEndpoint))
                  .map((feature, index) => (
                    <div key={index} className="flex items-center justify-between py-1">
                      <code className="text-primary">{feature.apiEndpoint}</code>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{feature.name}</span>
                        <Badge className={`text-xs ${getStatusColor(feature.status)}`}>
                          {feature.status}
                        </Badge>
                      </div>
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