'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Treemap,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  RadialBarChart,
  RadialBar,
  ComposedChart,
  ScatterChart,
  Scatter,
} from 'recharts';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Code,
  Database,
  GitBranch,
  Globe,
  Layers,
  Monitor,
  Package,
  Server,
  Settings,
  Shield,
  Sparkles,
  TrendingUp,
  Zap,
  Brain,
  Network,
  BarChart3,
  Cpu,
  HardDrive,
  RefreshCw,
  Terminal,
  Container,
  MessageSquare,
  Lock,
  Cloud,
} from 'lucide-react';

// Mock data generation for all features
const generateMockData = () => {
  // Feature coverage heatmap data
  const heatmapData = [];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const features = ['Auth', 'API', 'DB', 'Cache', 'Queue', 'Storage', 'Email', 'Search', 'Analytics'];
  
  for (let d = 0; d < days.length; d++) {
    for (let f = 0; f < features.length; f++) {
      heatmapData.push({
        day: days[d],
        feature: features[f],
        value: Math.floor(Math.random() * 100),
        x: d,
        y: f,
      });
    }
  }

  // API endpoint performance
  const apiPerformance = [
    { endpoint: '/api/v1/users', avgTime: 45, requests: 12000, errors: 12, method: 'GET' },
    { endpoint: '/api/v1/products', avgTime: 78, requests: 8900, errors: 5, method: 'GET' },
    { endpoint: '/api/v1/orders', avgTime: 120, requests: 6500, errors: 8, method: 'POST' },
    { endpoint: '/api/v1/analytics', avgTime: 230, requests: 3400, errors: 2, method: 'GET' },
    { endpoint: '/api/v1/auth/login', avgTime: 34, requests: 21000, errors: 15, method: 'POST' },
    { endpoint: '/api/v1/search', avgTime: 156, requests: 9800, errors: 18, method: 'GET' },
    { endpoint: '/api/v1/payments', avgTime: 245, requests: 2300, errors: 3, method: 'POST' },
  ];

  // Service dependency graph data
  const serviceDependencies = [
    { subject: 'API Gateway', A: 120, B: 110, fullMark: 150 },
    { subject: 'Auth Service', A: 98, B: 130, fullMark: 150 },
    { subject: 'Database', A: 86, B: 130, fullMark: 150 },
    { subject: 'Cache Layer', A: 99, B: 100, fullMark: 150 },
    { subject: 'Queue System', A: 85, B: 90, fullMark: 150 },
    { subject: 'Storage', A: 65, B: 85, fullMark: 150 },
  ];

  // Feature adoption treemap
  const featureAdoption = [
    {
      name: 'Authentication',
      children: [
        { name: 'OAuth', size: 3938, color: '#10b981' },
        { name: 'JWT', size: 3812, color: '#3b82f6' },
        { name: '2FA', size: 2714, color: '#8b5cf6' },
        { name: 'SSO', size: 1743, color: '#ec4899' },
        { name: 'Biometric', size: 892, color: '#f59e0b' },
      ],
    },
    {
      name: 'APIs',
      children: [
        { name: 'REST', size: 5731, color: '#10b981' },
        { name: 'GraphQL', size: 3534, color: '#3b82f6' },
        { name: 'WebSocket', size: 2517, color: '#8b5cf6' },
        { name: 'gRPC', size: 1983, color: '#ec4899' },
        { name: 'Webhooks', size: 1245, color: '#f59e0b' },
      ],
    },
    {
      name: 'Storage',
      children: [
        { name: 'PostgreSQL', size: 8833, color: '#10b981' },
        { name: 'Redis', size: 4116, color: '#3b82f6' },
        { name: 'S3', size: 3623, color: '#8b5cf6' },
        { name: 'MongoDB', size: 2743, color: '#ec4899' },
        { name: 'Elasticsearch', size: 1892, color: '#f59e0b' },
      ],
    },
    {
      name: 'Infrastructure',
      children: [
        { name: 'Kubernetes', size: 6234, color: '#10b981' },
        { name: 'Docker', size: 5123, color: '#3b82f6' },
        { name: 'Terraform', size: 3456, color: '#8b5cf6' },
        { name: 'CI/CD', size: 2891, color: '#ec4899' },
      ],
    },
  ];

  // Real-time usage stats
  const realtimeStats = Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    requests: Math.floor(Math.random() * 1000) + 500,
    errors: Math.floor(Math.random() * 50),
    latency: Math.floor(Math.random() * 100) + 20,
    throughput: Math.floor(Math.random() * 800) + 400,
  }));

  // Service health data
  const serviceHealth = [
    { name: 'API Gateway', value: 98, fill: '#10b981', cpu: 45, memory: 62 },
    { name: 'Auth Service', value: 95, fill: '#3b82f6', cpu: 38, memory: 55 },
    { name: 'Database', value: 92, fill: '#8b5cf6', cpu: 68, memory: 72 },
    { name: 'Cache', value: 99, fill: '#ec4899', cpu: 35, memory: 42 },
    { name: 'Queue', value: 88, fill: '#f59e0b', cpu: 55, memory: 65 },
    { name: 'Storage', value: 94, fill: '#14b8a6', cpu: 42, memory: 58 },
  ];

  // Feature flags
  const featureFlags = [
    { name: 'New Auth Flow', status: 'active', rollout: 100, environment: 'production' },
    { name: 'GraphQL API', status: 'active', rollout: 75, environment: 'production' },
    { name: 'Real-time Sync', status: 'testing', rollout: 25, environment: 'staging' },
    { name: 'AI Recommendations', status: 'inactive', rollout: 0, environment: 'development' },
    { name: 'Advanced Analytics', status: 'active', rollout: 90, environment: 'production' },
    { name: 'Multi-region Support', status: 'testing', rollout: 40, environment: 'staging' },
    { name: 'Async Processing', status: 'active', rollout: 100, environment: 'production' },
    { name: 'New Cache Strategy', status: 'testing', rollout: 15, environment: 'staging' },
  ];

  // Performance metrics
  const performanceMetrics = [
    { metric: 'CPU Usage', current: 45, target: 60, trend: 'up', unit: '%' },
    { metric: 'Memory Usage', current: 62, target: 70, trend: 'stable', unit: '%' },
    { metric: 'Disk I/O', current: 38, target: 50, trend: 'down', unit: '%' },
    { metric: 'Network Latency', current: 12, target: 20, trend: 'up', unit: 'ms' },
    { metric: 'Cache Hit Rate', current: 92, target: 85, trend: 'stable', unit: '%' },
    { metric: 'Query Time', current: 25, target: 30, trend: 'down', unit: 'ms' },
  ];

  // Backend service monitoring data
  const serviceMonitoring = [
    { service: 'Auth Service', uptime: 99.9, responseTime: 45, errorRate: 0.1, requests: 12450 },
    { service: 'User Service', uptime: 99.8, responseTime: 38, errorRate: 0.2, requests: 10230 },
    { service: 'Product Service', uptime: 99.95, responseTime: 42, errorRate: 0.05, requests: 8920 },
    { service: 'Order Service', uptime: 99.5, responseTime: 68, errorRate: 0.5, requests: 6540 },
    { service: 'Payment Service', uptime: 99.99, responseTime: 55, errorRate: 0.01, requests: 3280 },
    { service: 'Notification Service', uptime: 99.7, responseTime: 35, errorRate: 0.3, requests: 15670 },
  ];

  // Configuration data
  const configData = {
    environment: [
      { key: 'NODE_ENV', value: 'production', encrypted: false },
      { key: 'API_VERSION', value: 'v2.3.1', encrypted: false },
      { key: 'CLUSTER_MODE', value: 'enabled', encrypted: false },
      { key: 'LOG_LEVEL', value: 'info', encrypted: false },
      { key: 'RATE_LIMIT', value: '1000 req/min', encrypted: false },
    ],
    database: [
      { key: 'DB_TYPE', value: 'PostgreSQL', encrypted: false },
      { key: 'CONNECTION_POOL', value: '100', encrypted: false },
      { key: 'REPLICATION', value: 'master-slave', encrypted: false },
      { key: 'BACKUP_SCHEDULE', value: 'daily', encrypted: false },
      { key: 'DB_PASSWORD', value: '••••••••', encrypted: true },
    ],
    security: [
      { key: 'SSL_ENABLED', value: 'true', encrypted: false },
      { key: 'JWT_EXPIRY', value: '24h', encrypted: false },
      { key: 'CORS_ORIGIN', value: '*.app.com', encrypted: false },
      { key: 'API_KEY', value: '••••••••', encrypted: true },
      { key: 'ENCRYPTION_METHOD', value: 'AES-256', encrypted: false },
    ],
    monitoring: [
      { key: 'APM_PROVIDER', value: 'DataDog', encrypted: false },
      { key: 'METRICS_INTERVAL', value: '30s', encrypted: false },
      { key: 'ERROR_TRACKING', value: 'Sentry', encrypted: false },
      { key: 'ALERTS_ENABLED', value: 'true', encrypted: false },
      { key: 'LOG_AGGREGATION', value: 'ELK Stack', encrypted: false },
    ],
  };

  return {
    heatmapData,
    apiPerformance,
    serviceDependencies,
    featureAdoption,
    realtimeStats,
    serviceHealth,
    featureFlags,
    performanceMetrics,
    serviceMonitoring,
    configData,
  };
};

const EnhancedBackendFeaturesDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState(generateMockData());
  const [selectedMetric, setSelectedMetric] = useState('requests');

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateMockData());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Custom tooltip for heatmap
  const HeatmapTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/80 backdrop-blur-sm p-2 rounded-lg border border-white/20">
          <p className="text-white text-sm">
            {payload[0].payload.feature} on {payload[0].payload.day}
          </p>
          <p className="text-emerald-400 font-semibold">
            Coverage: {payload[0].value}%
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom treemap content
  const CustomTreemapContent = (props: any) => {
    const { x, y, width, height, name, value, color } = props;
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: color || '#8b5cf6',
            stroke: '#fff',
            strokeWidth: 2,
            strokeOpacity: 1,
          }}
        />
        {width > 50 && height > 30 && (
          <>
            <text
              x={x + width / 2}
              y={y + height / 2 - 7}
              textAnchor="middle"
              fill="#fff"
              fontSize={12}
              fontWeight="600"
            >
              {name}
            </text>
            <text
              x={x + width / 2}
              y={y + height / 2 + 7}
              textAnchor="middle"
              fill="#fff"
              fontSize={10}
            >
              {value}
            </text>
          </>
        )}
      </g>
    );
  };

  // Colors for charts
  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#ef4444', '#14b8a6', '#6366f1'];

  return (
    <div className="relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />
        
        {/* Floating blobs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 150, 0],
            y: [0, -150, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Backend Features Dashboard
              </h1>
              <p className="text-gray-300">
                Real-time monitoring and insights for your backend services
              </p>
            </div>
            <Button className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20">
              <Brain className="mr-2 h-4 w-4" />
              AI Insights
            </Button>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-6 bg-white/10 backdrop-blur-sm border border-white/20 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white/20">
              <BarChart3 className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="services" className="data-[state=active]:bg-white/20">
              <Server className="mr-2 h-4 w-4" />
              Services
            </TabsTrigger>
            <TabsTrigger value="features" className="data-[state=active]:bg-white/20">
              <Package className="mr-2 h-4 w-4" />
              Features
            </TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-white/20">
              <Zap className="mr-2 h-4 w-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="dependencies" className="data-[state=active]:bg-white/20">
              <Network className="mr-2 h-4 w-4" />
              Dependencies
            </TabsTrigger>
            <TabsTrigger value="config" className="data-[state=active]:bg-white/20">
              <Settings className="mr-2 h-4 w-4" />
              Config
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { icon: Activity, label: 'Total Requests', value: '2.4M', change: '+12%', color: 'text-emerald-400' },
                { icon: Server, label: 'Active Services', value: '24', change: '+2', color: 'text-blue-400' },
                { icon: CheckCircle, label: 'Uptime', value: '99.9%', change: '+0.1%', color: 'text-green-400' },
                { icon: Clock, label: 'Avg Response', value: '45ms', change: '-8ms', color: 'text-yellow-400' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-300">
                        {stat.label}
                      </CardTitle>
                      <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">{stat.value}</div>
                      <p className="text-xs text-emerald-400">{stat.change}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Real-time Usage Chart */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Real-time Backend Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={data.realtimeStats}>
                      <defs>
                        <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorThroughput" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="time" stroke="#9ca3af" />
                      <YAxis yAxisId="left" stroke="#9ca3af" />
                      <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '8px',
                        }}
                      />
                      <Legend />
                      <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="requests"
                        stroke="#10b981"
                        fillOpacity={1}
                        fill="url(#colorRequests)"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="latency"
                        stroke="#f59e0b"
                        strokeWidth={2}
                      />
                      <Bar yAxisId="left" dataKey="errors" fill="#ef4444" opacity={0.8} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Service Health Gauges */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Service Health Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RadialBarChart
                        cx="50%"
                        cy="50%"
                        innerRadius="10%"
                        outerRadius="80%"
                        barSize={10}
                        data={data.serviceHealth}
                      >
                        <RadialBar
                          background
                          dataKey="value"
                        />
                        <Legend
                          iconSize={10}
                          layout="horizontal"
                          verticalAlign="bottom"
                          wrapperStyle={{
                            paddingTop: '20px',
                          }}
                        />
                        <Tooltip />
                      </RadialBarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Backend Service Monitoring */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Service Monitoring</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {data.serviceMonitoring.slice(0, 5).map((service, index) => (
                        <motion.div
                          key={service.service}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white/5 rounded-lg p-3"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-white">{service.service}</span>
                            <Badge
                              className={
                                service.uptime >= 99.9
                                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                                  : service.uptime >= 99.5
                                  ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                                  : 'bg-red-500/20 text-red-400 border-red-500/50'
                              }
                            >
                              {service.uptime}% Uptime
                            </Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div>
                              <span className="text-gray-400">Response</span>
                              <div className="text-white">{service.responseTime}ms</div>
                            </div>
                            <div>
                              <span className="text-gray-400">Errors</span>
                              <div className="text-white">{service.errorRate}%</div>
                            </div>
                            <div>
                              <span className="text-gray-400">Requests</span>
                              <div className="text-white">{service.requests.toLocaleString()}</div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            {/* API Endpoint Performance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">API Endpoint Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <ComposedChart data={data.apiPerformance} margin={{ left: 20, right: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="endpoint" stroke="#9ca3af" angle={-45} textAnchor="end" height={100} />
                      <YAxis yAxisId="left" stroke="#9ca3af" />
                      <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '8px',
                        }}
                      />
                      <Legend />
                      <Bar yAxisId="left" dataKey="requests" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                      <Line yAxisId="right" type="monotone" dataKey="avgTime" stroke="#f59e0b" strokeWidth={2} />
                      <Scatter yAxisId="right" dataKey="errors" fill="#ef4444" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Service Dependency Graph */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Service Dependencies</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={data.serviceDependencies}>
                      <PolarGrid stroke="#374151" />
                      <PolarAngleAxis dataKey="subject" stroke="#9ca3af" />
                      <PolarRadiusAxis stroke="#9ca3af" />
                      <Radar
                        name="Current Load"
                        dataKey="A"
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.6}
                      />
                      <Radar
                        name="Max Capacity"
                        dataKey="B"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.6}
                      />
                      <Legend />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Service Health Matrix */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Service Resource Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.serviceHealth.map((service, index) => (
                      <motion.div
                        key={service.name}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/5 rounded-lg p-4 border border-white/10"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-white font-medium">{service.name}</h4>
                          <Server className="h-5 w-5 text-gray-400" />
                        </div>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-400">CPU Usage</span>
                              <span className="text-white">{service.cpu}%</span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-2">
                              <motion.div
                                className={`h-2 rounded-full ${
                                  service.cpu > 70 ? 'bg-red-500' :
                                  service.cpu > 50 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                                initial={{ width: 0 }}
                                animate={{ width: `${service.cpu}%` }}
                                transition={{ duration: 1, delay: index * 0.1 }}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-400">Memory Usage</span>
                              <span className="text-white">{service.memory}%</span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-2">
                              <motion.div
                                className={`h-2 rounded-full ${
                                  service.memory > 70 ? 'bg-red-500' :
                                  service.memory > 50 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                                initial={{ width: 0 }}
                                animate={{ width: `${service.memory}%` }}
                                transition={{ duration: 1, delay: index * 0.1 + 0.2 }}
                              />
                            </div>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Health Score</span>
                            <span className={`font-medium ${
                              service.value >= 95 ? 'text-green-400' :
                              service.value >= 90 ? 'text-yellow-400' : 'text-red-400'
                            }`}>
                              {service.value}%
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-6">
            {/* Feature Coverage Heatmap */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Feature Coverage Heatmap</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-8 gap-1">
                    <div></div>
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                      <div key={day} className="text-xs text-gray-400 text-center">
                        {day}
                      </div>
                    ))}
                    {['Auth', 'API', 'DB', 'Cache', 'Queue', 'Storage', 'Email', 'Search', 'Analytics'].map(
                      (feature, fIndex) => (
                        <React.Fragment key={feature}>
                          <div className="text-xs text-gray-400 text-right pr-2">
                            {feature}
                          </div>
                          {[0, 1, 2, 3, 4, 5, 6].map((dIndex) => {
                            const item = data.heatmapData.find(
                              (d) => d.x === dIndex && d.y === fIndex
                            );
                            const opacity = item ? item.value / 100 : 0;
                            return (
                              <motion.div
                                key={`${fIndex}-${dIndex}`}
                                className="aspect-square rounded-sm cursor-pointer relative group"
                                style={{
                                  backgroundColor: `rgba(16, 185, 129, ${opacity})`,
                                }}
                                whileHover={{ scale: 1.1 }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: (fIndex * 7 + dIndex) * 0.01 }}
                              >
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <span className="text-xs text-white font-semibold">
                                    {item?.value}%
                                  </span>
                                </div>
                              </motion.div>
                            );
                          })}
                        </React.Fragment>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Feature Adoption Treemap */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Feature Adoption</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <Treemap
                      data={data.featureAdoption}
                      dataKey="size"
                      aspectRatio={4 / 3}
                      stroke="#fff"
                      fill="#8b5cf6"
                      content={<CustomTreemapContent />}
                    >
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '8px',
                        }}
                      />
                    </Treemap>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Feature Flags Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Feature Flags Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {data.featureFlags.map((flag, index) => (
                      <motion.div
                        key={flag.name}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white/5 rounded-lg p-4 border border-white/10"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-white font-medium text-sm">{flag.name}</h4>
                          <Badge
                            variant={
                              flag.status === 'active'
                                ? 'default'
                                : flag.status === 'testing'
                                ? 'secondary'
                                : 'destructive'
                            }
                            className={
                              flag.status === 'active'
                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                                : flag.status === 'testing'
                                ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                                : 'bg-red-500/20 text-red-400 border-red-500/50'
                            }
                          >
                            {flag.status}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-400">Environment</span>
                            <span className="text-white">{flag.environment}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-400">Rollout</span>
                            <span className="text-white">{flag.rollout}%</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                            <motion.div
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${flag.rollout}%` }}
                              transition={{ duration: 1, delay: index * 0.05 }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Real-time Feature Usage Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Real-time Feature Usage Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis type="number" dataKey="x" name="Time" stroke="#9ca3af" />
                      <YAxis type="number" dataKey="y" name="Usage" stroke="#9ca3af" />
                      <Tooltip
                        cursor={{ strokeDasharray: '3 3' }}
                        contentStyle={{
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '8px',
                        }}
                      />
                      <Scatter
                        name="Feature Usage"
                        data={Array.from({ length: 50 }, () => ({
                          x: Math.floor(Math.random() * 24),
                          y: Math.floor(Math.random() * 100),
                        }))}
                        fill="#8b5cf6"
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            {/* Performance Optimization Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">
                    Performance Optimization Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.performanceMetrics.map((metric, index) => (
                      <motion.div
                        key={metric.metric}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-medium">
                              {metric.metric}
                            </span>
                            {metric.trend === 'up' && (
                              <TrendingUp className="h-4 w-4 text-emerald-400" />
                            )}
                            {metric.trend === 'down' && (
                              <TrendingUp className="h-4 w-4 text-red-400 rotate-180" />
                            )}
                          </div>
                          <span className="text-white">
                            {metric.current}{metric.unit} / {metric.target}{metric.unit}
                          </span>
                        </div>
                        <div className="relative w-full bg-white/10 rounded-full h-3">
                          <motion.div
                            className="absolute top-0 left-0 h-3 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${(metric.current / metric.target) * 100}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                          />
                          <div
                            className="absolute top-0 h-3 w-0.5 bg-white/50"
                            style={{ left: '100%' }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Performance Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Response Time Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart
                        data={Array.from({ length: 10 }, (_, i) => ({
                          range: `${i * 10}-${(i + 1) * 10}ms`,
                          count: Math.floor(Math.random() * 1000) + 100,
                        }))}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="range" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '8px',
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="count"
                          stroke="#8b5cf6"
                          fill="#8b5cf6"
                          fillOpacity={0.6}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Resource Utilization Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart
                        data={Array.from({ length: 12 }, (_, i) => ({
                          time: `${i * 2}:00`,
                          cpu: Math.floor(Math.random() * 30) + 40,
                          memory: Math.floor(Math.random() * 20) + 50,
                          disk: Math.floor(Math.random() * 15) + 30,
                        }))}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="time" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '8px',
                          }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="cpu" stroke="#10b981" strokeWidth={2} />
                        <Line type="monotone" dataKey="memory" stroke="#3b82f6" strokeWidth={2} />
                        <Line type="monotone" dataKey="disk" stroke="#f59e0b" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* AI Optimization Insights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-yellow-400" />
                    AI-Powered Backend Optimization Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        title: 'Database Query Optimization',
                        description:
                          'Detected N+1 queries in user service. Implementing eager loading could reduce response time by 45%.',
                        impact: 'High',
                        action: 'Implement eager loading',
                        icon: Database,
                        color: 'text-blue-400',
                      },
                      {
                        title: 'Cache Strategy Enhancement',
                        description:
                          'Analytics endpoint has 23% cache hit rate. Adjusting TTL and implementing smart invalidation could improve to 85%.',
                        impact: 'Medium',
                        action: 'Optimize cache strategy',
                        icon: RefreshCw,
                        color: 'text-green-400',
                      },
                      {
                        title: 'API Rate Limiting',
                        description:
                          'Unusual traffic patterns detected. Implementing dynamic rate limiting could prevent 95% of abuse attempts.',
                        impact: 'High',
                        action: 'Enable rate limiting',
                        icon: Shield,
                        color: 'text-red-400',
                      },
                      {
                        title: 'Service Scaling Recommendation',
                        description:
                          'Order service reaching capacity during peak hours. Auto-scaling with 2 additional instances recommended.',
                        impact: 'High',
                        action: 'Configure auto-scaling',
                        icon: Server,
                        color: 'text-purple-400',
                      },
                    ].map((insight, index) => (
                      <motion.div
                        key={insight.title}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/5 rounded-lg p-4 border border-white/10"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <insight.icon className={`h-5 w-5 ${insight.color}`} />
                            <h4 className="text-white font-medium">{insight.title}</h4>
                          </div>
                          <Badge
                            className={
                              insight.impact === 'High'
                                ? 'bg-red-500/20 text-red-400 border-red-500/50'
                                : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                            }
                          >
                            {insight.impact} Impact
                          </Badge>
                        </div>
                        <p className="text-gray-300 text-sm mb-3">
                          {insight.description}
                        </p>
                        <Button
                          size="sm"
                          className="bg-white/10 hover:bg-white/20 border-white/20"
                        >
                          {insight.action}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Dependencies Tab */}
          <TabsContent value="dependencies" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Service Dependency Map</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[500px] flex items-center justify-center">
                    <div className="relative w-full h-full">
                      {/* Central API Gateway */}
                      <motion.div
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="bg-gradient-to-br from-blue-500 to-purple-500 w-32 h-32 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/50">
                          <div className="text-center">
                            <Globe className="h-10 w-10 text-white mx-auto" />
                            <span className="text-xs text-white mt-1">API Gateway</span>
                          </div>
                        </div>
                      </motion.div>

                      {/* Surrounding Services */}
                      {[
                        { icon: Shield, label: 'Auth', angle: 0, color: 'from-emerald-500 to-teal-500' },
                        { icon: Database, label: 'Database', angle: 60, color: 'from-orange-500 to-red-500' },
                        { icon: Layers, label: 'Cache', angle: 120, color: 'from-pink-500 to-rose-500' },
                        { icon: GitBranch, label: 'Queue', angle: 180, color: 'from-indigo-500 to-blue-500' },
                        { icon: Package, label: 'Storage', angle: 240, color: 'from-yellow-500 to-amber-500' },
                        { icon: Monitor, label: 'Monitor', angle: 300, color: 'from-purple-500 to-indigo-500' },
                      ].map((service, index) => {
                        const radius = 200;
                        const x = radius * Math.cos((service.angle * Math.PI) / 180);
                        const y = radius * Math.sin((service.angle * Math.PI) / 180);
                        
                        return (
                          <motion.div
                            key={service.label}
                            className="absolute top-1/2 left-1/2"
                            style={{
                              transform: `translate(${x - 40}px, ${y - 40}px)`,
                            }}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                          >
                            <div className={`bg-gradient-to-br ${service.color} w-20 h-20 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform`}>
                              <div className="text-center">
                                <service.icon className="h-8 w-8 text-white mx-auto" />
                                <span className="text-xs text-white mt-1">{service.label}</span>
                              </div>
                            </div>
                            {/* Connection Line */}
                            <motion.svg
                              className="absolute top-10 left-10 -z-10"
                              width={Math.abs(x)}
                              height={Math.abs(y)}
                              style={{
                                left: x < 0 ? 'auto' : '50%',
                                right: x < 0 ? '50%' : 'auto',
                                top: y < 0 ? 'auto' : '50%',
                                bottom: y < 0 ? '50%' : 'auto',
                              }}
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                            >
                              <motion.line
                                x1="0"
                                y1="0"
                                x2={-x}
                                y2={-y}
                                stroke="rgba(255, 255, 255, 0.2)"
                                strokeWidth="2"
                                strokeDasharray="5 5"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                              />
                            </motion.svg>
                          </motion.div>
                        );
                      })}

                      {/* Additional Service Connections */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        {/* Inter-service connections */}
                        <motion.path
                          d="M 350 200 Q 450 250 350 300"
                          stroke="rgba(255, 255, 255, 0.1)"
                          strokeWidth="2"
                          fill="none"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ delay: 1.5, duration: 1 }}
                        />
                        <motion.path
                          d="M 150 200 Q 50 250 150 300"
                          stroke="rgba(255, 255, 255, 0.1)"
                          strokeWidth="2"
                          fill="none"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ delay: 1.6, duration: 1 }}
                        />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Dependency Health Matrix */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Service Dependency Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/20">
                          <th className="text-left py-3 px-4 text-gray-400">Service</th>
                          <th className="text-center py-3 px-4 text-gray-400">Auth</th>
                          <th className="text-center py-3 px-4 text-gray-400">Database</th>
                          <th className="text-center py-3 px-4 text-gray-400">Cache</th>
                          <th className="text-center py-3 px-4 text-gray-400">Queue</th>
                          <th className="text-center py-3 px-4 text-gray-400">Storage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {['User Service', 'Product Service', 'Order Service', 'Payment Service'].map((service, sIndex) => (
                          <motion.tr
                            key={service}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: sIndex * 0.1 }}
                            className="border-b border-white/10"
                          >
                            <td className="py-3 px-4 text-white">{service}</td>
                            {['Auth', 'Database', 'Cache', 'Queue', 'Storage'].map((dep, dIndex) => {
                              const health = Math.floor(Math.random() * 20) + 80;
                              return (
                                <td key={dep} className="py-3 px-4 text-center">
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: sIndex * 0.1 + dIndex * 0.05 }}
                                    className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${
                                      health >= 95 ? 'bg-green-500/20 text-green-400' :
                                      health >= 90 ? 'bg-yellow-500/20 text-yellow-400' :
                                      'bg-red-500/20 text-red-400'
                                    }`}
                                  >
                                    {health}%
                                  </motion.div>
                                </td>
                              );
                            })}
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Config Tab */}
          <TabsContent value="config" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Backend Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(data.configData).map(([section, items], sectionIndex) => (
                      <motion.div
                        key={section}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: sectionIndex * 0.1 }}
                        className="bg-white/5 rounded-lg p-4 border border-white/10"
                      >
                        <h3 className="text-white font-semibold mb-4 capitalize flex items-center gap-2">
                          {section === 'environment' && <Cloud className="h-5 w-5 text-blue-400" />}
                          {section === 'database' && <Database className="h-5 w-5 text-green-400" />}
                          {section === 'security' && <Lock className="h-5 w-5 text-red-400" />}
                          {section === 'monitoring' && <Activity className="h-5 w-5 text-purple-400" />}
                          {section}
                        </h3>
                        <div className="space-y-2">
                          {items.map((item, itemIndex) => (
                            <motion.div
                              key={item.key}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                delay: sectionIndex * 0.1 + itemIndex * 0.05,
                              }}
                              className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                            >
                              <span className="text-gray-400 text-sm">{item.key}</span>
                              <span className="text-white text-sm font-mono flex items-center gap-2">
                                {item.value}
                                {item.encrypted && (
                                  <Lock className="h-3 w-3 text-gray-400" />
                                )}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Configuration Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Configuration Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button className="bg-blue-500/20 hover:bg-blue-500/30 border-blue-500/50 text-blue-400">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Reload Config
                    </Button>
                    <Button className="bg-green-500/20 hover:bg-green-500/30 border-green-500/50 text-green-400">
                      <Package className="mr-2 h-4 w-4" />
                      Export Config
                    </Button>
                    <Button className="bg-purple-500/20 hover:bg-purple-500/30 border-purple-500/50 text-purple-400">
                      <Shield className="mr-2 h-4 w-4" />
                      Validate Config
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EnhancedBackendFeaturesDashboard;