import {
  LayoutDashboard,
  FolderOpen,
  Layers,
  Cpu,
  Package,
  GitBranch,
  Brain,
  Activity,
  Shield,
  TestTube,
  FileText,
  Palette,
  Rocket,
  BarChart3,
  Settings,
  HelpCircle,
  Sparkles,
  Network,
  Puzzle,
  Code,
  Bug,
  Cloud,
  Container,
  DollarSign,
  ArrowRight,
  Search,
  Server,
  FileCode,
  TrendingUp,
  Bell,
  AlertCircle,
  CheckCircle,
  Lock,
  Users,
  AlertTriangle,
  Database,
  Save,
  Copy,
  Zap,
  Link,
  Globe,
  Webhook,
  RefreshCw,
  Gauge,
  Filter,
  Eye,
} from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon: any;
  description?: string;
  badge?: string;
  children?: NavItem[];
}

export const navigationItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
    description: 'Overview and system status',
  },
  {
    title: 'Projects',
    href: '/projects',
    icon: FolderOpen,
    description: 'Manage AI projects',
  },
  // Core Orchestration
  {
    title: 'Orchestrator',
    href: '/orchestrator',
    icon: Cpu,
    description: 'Enhanced Orchestrator V2',
    badge: 'New',
    children: [
      { title: 'DAG Engine', href: '/orchestrator/dag', icon: GitBranch },
      { title: 'Task Queue', href: '/orchestrator/tasks', icon: Layers },
      { title: 'Brand Guidelines', href: '/orchestrator/brand', icon: Palette },
      { title: 'Prompt Engine', href: '/orchestrator/prompts', icon: Code },
    ],
  },
  {
    title: 'Workflow Designer',
    href: '/workflow-designer',
    icon: GitBranch,
    description: 'Visual workflow creation',
    children: [
      { title: 'Templates', href: '/workflow-designer/templates', icon: FileText },
      { title: 'Event Triggers', href: '/workflow-designer/triggers', icon: Zap },
      { title: 'Versioning', href: '/workflow-designer/versions', icon: GitBranch },
      { title: 'Analytics', href: '/workflow-designer/analytics', icon: BarChart3 },
    ],
  },
  {
    title: 'AI Agents',
    href: '/agents',
    icon: Brain,
    description: 'Manage AI agents',
    children: [
      { title: 'All Agents', href: '/agents', icon: Brain },
      { title: 'UI/UX Designer', href: '/agents/designer', icon: Palette },
      { title: 'Doc Generator', href: '/agents/docs', icon: FileText },
      { title: 'Performance AI', href: '/agents/performance', icon: Zap },
      { title: 'Data Architect', href: '/agents/data', icon: Database },
      { title: 'API Designer', href: '/agents/api', icon: Code },
      { title: 'Cost Optimizer', href: '/agents/cost', icon: DollarSign },
      { title: 'Migration AI', href: '/agents/migration', icon: ArrowRight },
    ],
  },
  {
    title: 'Plugins',
    href: '/plugins',
    icon: Puzzle,
    description: 'Plugin marketplace',
  },
  {
    title: 'Learning Lab',
    href: '/learning-lab',
    icon: Brain,
    description: 'AI learning evolution',
    children: [
      { title: 'Pattern Detection', href: '/learning-lab/patterns', icon: Search },
      { title: 'A/B Testing', href: '/learning-lab/experiments', icon: TestTube },
      { title: 'Model Tuning', href: '/learning-lab/tuning', icon: Settings },
      { title: 'Error Learning', href: '/learning-lab/errors', icon: Bug },
    ],
  },
  // Infrastructure & Deployment
  {
    title: 'Deployments',
    href: '/deployments',
    icon: Rocket,
    description: 'Deploy applications',
    children: [
      { title: 'Multi-Cloud', href: '/deployments', icon: Cloud },
      { title: 'Kubernetes', href: '/deployments/k8s', icon: Container },
      { title: 'Docker', href: '/deployments/docker', icon: Package },
      { title: 'CI/CD', href: '/deployments/cicd', icon: GitBranch },
      { title: 'Environments', href: '/deployments/environments', icon: Layers },
    ],
  },
  {
    title: 'Infrastructure',
    href: '/infrastructure',
    icon: Server,
    description: 'Infrastructure as Code',
    badge: 'New',
    children: [
      { title: 'IaC Templates', href: '/infrastructure/iac', icon: FileCode },
      { title: 'Cost Estimation', href: '/infrastructure/cost', icon: DollarSign },
      { title: 'Auto-scaling', href: '/infrastructure/scaling', icon: TrendingUp },
      { title: 'Load Balancer', href: '/infrastructure/loadbalancer', icon: Network },
    ],
  },
  // Monitoring & Observability
  {
    title: 'Monitoring',
    href: '/monitoring',
    icon: Activity,
    description: 'Advanced monitoring',
    children: [
      { title: 'Dashboard', href: '/monitoring', icon: Activity },
      { title: 'Tracing', href: '/monitoring/tracing', icon: GitBranch },
      { title: 'Metrics', href: '/monitoring/metrics', icon: BarChart3 },
      { title: 'Alerts', href: '/monitoring/alerts', icon: Bell },
      { title: 'Service Map', href: '/monitoring/service-map', icon: Network },
      { title: 'Profiling', href: '/monitoring/profiling', icon: Cpu },
      { title: 'SLO/SLA', href: '/monitoring/slo', icon: Shield },
      { title: 'Anomalies', href: '/monitoring/anomalies', icon: AlertCircle },
    ],
  },
  {
    title: 'Logs',
    href: '/logs',
    icon: FileText,
    description: 'Log aggregation',
    badge: 'New',
  },
  // Security & Compliance
  {
    title: 'Security',
    href: '/security',
    icon: Shield,
    description: 'Security & compliance',
    badge: 'New',
    children: [
      { title: 'Scanner', href: '/security/scanner', icon: Search },
      { title: 'Compliance', href: '/security/compliance', icon: CheckCircle },
      { title: 'Secrets', href: '/security/secrets', icon: Lock },
      { title: 'Audit Log', href: '/security/audit', icon: FileText },
      { title: 'RBAC', href: '/security/rbac', icon: Users },
      { title: 'Threats', href: '/security/threats', icon: AlertTriangle },
    ],
  },
  // Data Management
  {
    title: 'Data',
    href: '/data',
    icon: Database,
    description: 'Data management',
    badge: 'New',
    children: [
      { title: 'Migrations', href: '/data/migrations', icon: ArrowRight },
      { title: 'Backups', href: '/data/backups', icon: Save },
      { title: 'Replication', href: '/data/replication', icon: Copy },
      { title: 'ETL Pipelines', href: '/data/etl', icon: GitBranch },
      { title: 'Cache', href: '/data/cache', icon: Zap },
      { title: 'Privacy', href: '/data/privacy', icon: Lock },
    ],
  },
  // Integration
  {
    title: 'Integrations',
    href: '/integrations',
    icon: Link,
    description: 'External integrations',
    badge: 'New',
    children: [
      { title: 'API Gateway', href: '/integrations/gateway', icon: Globe },
      { title: 'Webhooks', href: '/integrations/webhooks', icon: Webhook },
      { title: 'GraphQL', href: '/integrations/graphql', icon: Code },
      { title: 'Event Bus', href: '/integrations/events', icon: Zap },
      { title: 'Message Queue', href: '/integrations/queue', icon: Layers },
      { title: 'OAuth/SAML', href: '/integrations/auth', icon: Lock },
    ],
  },
  // Advanced Features
  {
    title: 'Advanced',
    href: '/advanced',
    icon: Zap,
    description: 'Advanced features',
    badge: 'New',
    children: [
      { title: 'Smart Cache', href: '/advanced/cache', icon: Zap },
      { title: 'Retry System', href: '/advanced/retry', icon: RefreshCw },
      { title: 'Circuit Breaker', href: '/advanced/circuit-breaker', icon: Shield },
      { title: 'Rate Limiting', href: '/advanced/rate-limit', icon: Gauge },
      { title: 'Deduplication', href: '/advanced/dedup', icon: Filter },
    ],
  },
  // Other existing pages
  {
    title: 'Visual Intelligence',
    href: '/visual-intelligence',
    icon: Eye,
    description: 'Live code preview and exploration',
    badge: 'New',
  },
  {
    title: 'AI Studio',
    href: '/ai-studio',
    icon: Sparkles,
    description: 'Interactive AI development',
  },
  {
    title: 'API Explorer',
    href: '/api-explorer',
    icon: Code,
    description: 'Interactive API documentation',
  },
  {
    title: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    description: 'Performance analytics',
  },
  {
    title: 'Jobs',
    href: '/jobs',
    icon: Package,
    description: 'Job queue management',
  },
  {
    title: 'MCP Servers',
    href: '/mcp-servers',
    icon: Cpu,
    description: 'Model Context Protocol',
  },
  {
    title: 'Feature Discovery',
    href: '/discovery',
    icon: Sparkles,
    description: 'Backend feature coverage',
  },
  {
    title: 'Backend Features',
    href: '/backend-features',
    icon: Network,
    description: 'Complete backend ecosystem',
  },
  {
    title: 'Documentation',
    href: '/docs',
    icon: HelpCircle,
    description: 'Help and guides',
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
    description: 'System configuration',
  },
];

export const getNavItemByHref = (href: string): NavItem | undefined => {
  return navigationItems.find(item => item.href === href);
};

export const isNavItemActive = (itemHref: string, currentPath: string): boolean => {
  if (itemHref === '/') {
    return currentPath === '/';
  }
  return currentPath.startsWith(itemHref);
};