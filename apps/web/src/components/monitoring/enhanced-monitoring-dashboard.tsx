'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
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
  Brain,
  Sparkles,
  Shield,
  Globe,
  Gauge,
  Flame,
  Waves,
  Eye,
  Bell,
  Settings,
  Maximize2,
  Minimize2,
  Info,
  Download,
  Share2,
  Filter,
  Calendar,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Loader2,
  Radio,
  Wifi,
  WifiOff,
  Cloud,
  CloudOff,
  Heart,
  HeartOff,
  Power,
  PowerOff,
  MemoryStick,
  HardDriveIcon,
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
  RadarChart,
  Radar,
  PieChart,
  Pie,
  RadialBarChart,
  RadialBar,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
  Cell,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Brush,
  ComposedChart,
} from 'recharts';

// Generate mock real-time data
const generateRealTimeData = () => {
  const now = new Date();
  const data = [];
  for (let i = 59; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 1000);
    data.push({
      time: time.toLocaleTimeString(),
      cpu: Math.random() * 30 + 40 + Math.sin(i / 10) * 20,
      memory: Math.random() * 20 + 50 + Math.cos(i / 8) * 15,
      network: Math.random() * 40 + 30,
      disk: 70 + Math.random() * 10,
      requests: Math.floor(Math.random() * 50 + 100),
      errors: Math.floor(Math.random() * 5),
      latency: Math.random() * 100 + 150,
      throughput: Math.random() * 30 + 70,
    });
  }
  return data;
};

// Heatmap data for activity patterns
const generateHeatmapData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const data: any[] = [];
  
  days.forEach((day, dayIndex) => {
    hours.forEach((hour) => {
      data.push({
        day,
        hour,
        value: Math.random() * 100,
        dayIndex,
      });
    });
  });
  
  return data;
};

// System health gauge data
const systemHealthData = [
  { name: 'CPU', value: 75, fill: '#3b82f6' },
  { name: 'Memory', value: 82, fill: '#10b981' },
  { name: 'Disk', value: 65, fill: '#f59e0b' },
  { name: 'Network', value: 90, fill: '#8b5cf6' },
];

// Service radar chart data
const servicePerformanceData = [
  { metric: 'Availability', A: 98, B: 95, fullMark: 100 },
  { metric: 'Response Time', A: 85, B: 90, fullMark: 100 },
  { metric: 'Error Rate', A: 95, B: 88, fullMark: 100 },
  { metric: 'Throughput', A: 92, B: 85, fullMark: 100 },
  { metric: 'Efficiency', A: 88, B: 92, fullMark: 100 },
  { metric: 'Reliability', A: 96, B: 94, fullMark: 100 },
];

// AI Insights data
const aiInsights = [
  {
    id: 1,
    type: 'prediction',
    severity: 'warning',
    title: 'CPU Spike Predicted',
    description: 'Based on historical patterns, CPU usage likely to exceed 90% in the next 2 hours',
    confidence: 87,
    timestamp: '2 min ago',
  },
  {
    id: 2,
    type: 'anomaly',
    severity: 'info',
    title: 'Unusual Traffic Pattern',
    description: 'Detected 23% increase in API requests from European region',
    confidence: 92,
    timestamp: '15 min ago',
  },
  {
    id: 3,
    type: 'optimization',
    severity: 'success',
    title: 'Resource Optimization Available',
    description: 'Can reduce memory usage by 15% by optimizing cache configuration',
    confidence: 95,
    timestamp: '1 hour ago',
  },
];

// Alert types and their styles
const alertStyles = {
  critical: { bg: 'bg-red-500/20', border: 'border-red-500/50', icon: XCircle, color: 'text-red-500' },
  warning: { bg: 'bg-yellow-500/20', border: 'border-yellow-500/50', icon: AlertTriangle, color: 'text-yellow-500' },
  info: { bg: 'bg-blue-500/20', border: 'border-blue-500/50', icon: Info, color: 'text-blue-500' },
  success: { bg: 'bg-green-500/20', border: 'border-green-500/50', icon: CheckCircle, color: 'text-green-500' },
};

export const EnhancedMonitoringDashboard: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('1h');
  const [selectedService, setSelectedService] = useState('all');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [realTimeData, setRealTimeData] = useState(generateRealTimeData());
  const [heatmapData] = useState(generateHeatmapData());
  const [activeTab, setActiveTab] = useState('overview');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [thresholdCpu, setThresholdCpu] = useState([80]);
  const [thresholdMemory, setThresholdMemory] = useState([85]);

  // Real-time data updates
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      setRealTimeData(prev => {
        const newData = [...prev.slice(1)];
        const lastItem = prev[prev.length - 1];
        const now = new Date();
        newData.push({
          time: now.toLocaleTimeString(),
          cpu: Math.random() * 30 + 40 + Math.sin(Date.now() / 1000 / 10) * 20,
          memory: Math.random() * 20 + 50 + Math.cos(Date.now() / 1000 / 8) * 15,
          network: Math.random() * 40 + 30,
          disk: 70 + Math.random() * 10,
          requests: Math.floor(Math.random() * 50 + 100),
          errors: Math.floor(Math.random() * 5),
          latency: Math.random() * 100 + 150,
          throughput: Math.random() * 30 + 70,
        });
        return newData;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const currentMetrics = realTimeData[realTimeData.length - 1];

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 backdrop-blur-sm border rounded-lg p-3 shadow-xl">
          <p className="text-sm font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Animated background blobs
  const BackgroundBlobs = () => (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, -100, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      <motion.div
        className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"
        animate={{
          x: [0, -100, 0],
          y: [0, 100, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 w-60 h-60 bg-green-500/20 rounded-full blur-3xl"
        animate={{
          x: [-30, 30, -30],
          y: [-30, 30, -30],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
    </div>
  );

  return (
    <div className="relative overflow-hidden">
      <BackgroundBlobs />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6 relative z-10"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              System Monitoring
            </h2>
            <p className="text-muted-foreground mt-1">Real-time observability and AI-powered insights</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-2 flex-wrap"
          >
            <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
              <SelectTrigger className="w-32 bg-background/50 backdrop-blur-sm border-white/10">
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
              variant="outline"
              size="icon"
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className="bg-background/50 backdrop-blur-sm border-white/10"
            >
              {notificationsEnabled ? <Bell className="h-4 w-4" /> : <Bell className="h-4 w-4 text-muted-foreground" />}
            </Button>
            
            <Button
              variant={autoRefresh ? "default" : "outline"}
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={autoRefresh ? "bg-gradient-to-r from-purple-600 to-blue-600" : "bg-background/50 backdrop-blur-sm border-white/10"}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
              Live
            </Button>
          </motion.div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: 'System Health',
              value: '98.5%',
              trend: '+2.3%',
              trendUp: true,
              icon: Heart,
              color: 'from-green-500 to-emerald-500',
              glow: 'shadow-green-500/25',
            },
            {
              title: 'Active Services',
              value: '23/24',
              trend: '1 Down',
              trendUp: false,
              icon: Server,
              color: 'from-blue-500 to-cyan-500',
              glow: 'shadow-blue-500/25',
            },
            {
              title: 'Error Rate',
              value: '0.23%',
              trend: '-0.05%',
              trendUp: true,
              icon: AlertTriangle,
              color: 'from-yellow-500 to-orange-500',
              glow: 'shadow-yellow-500/25',
            },
            {
              title: 'Response Time',
              value: '234ms',
              trend: 'Normal',
              trendUp: null,
              icon: Timer,
              color: 'from-purple-500 to-pink-500',
              glow: 'shadow-purple-500/25',
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 1) }}
              whileHover={{ scale: 1.02 }}
              className="relative group"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity ${stat.glow} shadow-2xl`} />
              <Card className="relative bg-background/50 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <div className={`p-2 bg-gradient-to-r ${stat.color} rounded-lg`}>
                    <stat.icon className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center text-sm mt-1">
                    {stat.trendUp !== null && (
                      stat.trendUp ? (
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                      )
                    )}
                    <span className={stat.trendUp ? 'text-green-500' : stat.trendUp === false ? 'text-red-500' : 'text-muted-foreground'}>
                      {stat.trend}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-6 w-full bg-background/50 backdrop-blur-sm border border-white/10">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="metrics" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
              Metrics
            </TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
              Performance
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
              Activity
            </TabsTrigger>
            <TabsTrigger value="insights" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
              AI Insights
            </TabsTrigger>
            <TabsTrigger value="alerts" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
              Alerts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Real-time Line Chart */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="bg-background/50 backdrop-blur-sm border-white/10">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Real-time System Metrics</CardTitle>
                        <CardDescription>Live performance monitoring</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-sm text-muted-foreground">Live</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={realTimeData}>
                        <defs>
                          <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="time" stroke="#888" />
                        <YAxis stroke="#888" />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="cpu"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 8 }}
                          name="CPU %"
                        />
                        <Line
                          type="monotone"
                          dataKey="memory"
                          stroke="#10b981"
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 8 }}
                          name="Memory %"
                        />
                        <ReferenceLine y={thresholdCpu[0]} stroke="#ef4444" strokeDasharray="5 5" />
                        <ReferenceLine y={thresholdMemory[0]} stroke="#f59e0b" strokeDasharray="5 5" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>

              {/* System Health Gauges */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-background/50 backdrop-blur-sm border-white/10">
                  <CardHeader>
                    <CardTitle>Resource Utilization</CardTitle>
                    <CardDescription>Current system resource usage</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="90%" data={systemHealthData}>
                        <defs>
                          {systemHealthData.map((entry, index) => (
                            <linearGradient key={index} id={`gradient-${index}`} x1="0" y1="0" x2="1" y2="1">
                              <stop offset="0%" stopColor={entry.fill} stopOpacity={0.8} />
                              <stop offset="100%" stopColor={entry.fill} stopOpacity={0.3} />
                            </linearGradient>
                          ))}
                        </defs>
                        <RadialBar
                          dataKey="value"
                          cornerRadius={10}
                          fill="url(#gradient-0)"
                        >
                          {systemHealthData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={`url(#gradient-${index})`} />
                          ))}
                        </RadialBar>
                        <Legend />
                        <Tooltip />
                      </RadialBarChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      {systemHealthData.map((item) => (
                        <div key={item.name} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{item.name}</span>
                          <div className="flex items-center gap-2">
                            <Progress value={item.value} className="w-20 h-2" />
                            <span className="text-sm font-bold">{item.value}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Service Performance Radar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-background/50 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle>Service Performance Comparison</CardTitle>
                  <CardDescription>Multi-dimensional service analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <RadarChart data={servicePerformanceData}>
                      <defs>
                        <linearGradient id="gradientA" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
                          <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.1} />
                        </linearGradient>
                        <linearGradient id="gradientB" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#ec4899" stopOpacity={0.8} />
                          <stop offset="100%" stopColor="#ec4899" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <PolarGrid stroke="#333" />
                      <PolarAngleAxis dataKey="metric" stroke="#888" />
                      <PolarRadiusAxis stroke="#888" />
                      <Radar name="Service A" dataKey="A" stroke="#8b5cf6" fill="url(#gradientA)" strokeWidth={2} />
                      <Radar name="Service B" dataKey="B" stroke="#ec4899" fill="url(#gradientB)" strokeWidth={2} />
                      <Legend />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Area Chart for System Performance */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="bg-background/50 backdrop-blur-sm border-white/10">
                  <CardHeader>
                    <CardTitle>System Performance Trends</CardTitle>
                    <CardDescription>Historical performance data</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                      <AreaChart data={realTimeData}>
                        <defs>
                          <linearGradient id="colorNetwork" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorDisk" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="time" stroke="#888" />
                        <YAxis stroke="#888" />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="network"
                          stackId="1"
                          stroke="#f59e0b"
                          fill="url(#colorNetwork)"
                          name="Network Mbps"
                        />
                        <Area
                          type="monotone"
                          dataKey="disk"
                          stackId="2"
                          stroke="#ef4444"
                          fill="url(#colorDisk)"
                          name="Disk %"
                        />
                        <Brush dataKey="time" height={30} stroke="#666" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Bar Chart for Error Rates */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-background/50 backdrop-blur-sm border-white/10">
                  <CardHeader>
                    <CardTitle>Request & Error Analysis</CardTitle>
                    <CardDescription>Request volume and error distribution</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                      <ComposedChart data={realTimeData}>
                        <defs>
                          <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="time" stroke="#888" />
                        <YAxis yAxisId="left" stroke="#888" />
                        <YAxis yAxisId="right" orientation="right" stroke="#888" />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar yAxisId="left" dataKey="requests" fill="url(#colorRequests)" name="Requests/min" />
                        <Line yAxisId="right" type="monotone" dataKey="errors" stroke="#ef4444" strokeWidth={3} name="Errors" />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Thresholds Configuration */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-background/50 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle>Alert Thresholds</CardTitle>
                  <CardDescription>Configure monitoring alert thresholds</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">CPU Usage Alert Threshold</label>
                      <span className="text-sm font-bold">{thresholdCpu[0]}%</span>
                    </div>
                    <Slider
                      value={thresholdCpu}
                      onValueChange={setThresholdCpu}
                      max={100}
                      step={5}
                      className="[&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-blue-500 [&_[role=slider]]:to-purple-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Memory Usage Alert Threshold</label>
                      <span className="text-sm font-bold">{thresholdMemory[0]}%</span>
                    </div>
                    <Slider
                      value={thresholdMemory}
                      onValueChange={setThresholdMemory}
                      max={100}
                      step={5}
                      className="[&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-green-500 [&_[role=slider]]:to-emerald-500"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            {/* Latency Distribution */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-background/50 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle>Latency Distribution</CardTitle>
                  <CardDescription>Response time percentiles</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                      { percentile: 'P50', value: 120, fill: '#10b981' },
                      { percentile: 'P75', value: 180, fill: '#3b82f6' },
                      { percentile: 'P90', value: 250, fill: '#f59e0b' },
                      { percentile: 'P95', value: 350, fill: '#ef4444' },
                      { percentile: 'P99', value: 500, fill: '#dc2626' },
                    ]}>
                      <defs>
                        {['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#dc2626'].map((color, index) => (
                          <linearGradient key={index} id={`perf-gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={color} stopOpacity={0.8} />
                            <stop offset="100%" stopColor={color} stopOpacity={0.3} />
                          </linearGradient>
                        ))}
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="percentile" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="value" name="Latency (ms)">
                        {[0, 1, 2, 3, 4].map((index) => (
                          <Cell key={`cell-${index}`} fill={`url(#perf-gradient-${index})`} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Throughput Analysis */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-background/50 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle>Throughput Analysis</CardTitle>
                  <CardDescription>Request processing capacity</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={realTimeData}>
                      <defs>
                        <linearGradient id="colorThroughput" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="time" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="throughput"
                        stroke="#8b5cf6"
                        fill="url(#colorThroughput)"
                        strokeWidth={2}
                        name="Throughput %"
                      />
                      <Line
                        type="monotone"
                        dataKey="latency"
                        stroke="#ec4899"
                        strokeWidth={2}
                        dot={false}
                        name="Latency ms"
                        yAxisId="right"
                      />
                      <YAxis yAxisId="right" orientation="right" stroke="#888" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            {/* Activity Heatmap */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-background/50 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle>Activity Heatmap</CardTitle>
                  <CardDescription>System activity patterns by day and hour</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-25 gap-1">
                    <div className="col-span-1"></div>
                    {Array.from({ length: 24 }, (_, i) => (
                      <div key={i} className="text-xs text-center text-muted-foreground">
                        {i}
                      </div>
                    ))}
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, dayIndex) => (
                      <React.Fragment key={day}>
                        <div className="text-xs text-right pr-2 text-muted-foreground">{day}</div>
                        {Array.from({ length: 24 }, (_, hour) => {
                          const value = heatmapData.find(d => d.dayIndex === dayIndex && d.hour === hour)?.value || 0;
                          const intensity = value / 100;
                          return (
                            <motion.div
                              key={`${day}-${hour}`}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: (dayIndex * 24 + hour) * 0.001 }}
                              className="aspect-square rounded-sm cursor-pointer relative group"
                              style={{
                                backgroundColor: `rgba(139, 92, 246, ${intensity})`,
                                boxShadow: intensity > 0.5 ? `0 0 10px rgba(139, 92, 246, ${intensity})` : undefined,
                              }}
                            >
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="bg-background/95 backdrop-blur-sm rounded px-2 py-1 text-xs">
                                  {Math.round(value)}%
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </React.Fragment>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Live Activity Feed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-background/50 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle>Live Activity Feed</CardTitle>
                  <CardDescription>Real-time system events</CardDescription>
                </CardHeader>
                <CardContent>
                  <AnimatePresence>
                    {[
                      { id: 1, type: 'request', message: 'API request from 192.168.1.100', time: 'Just now', icon: Globe },
                      { id: 2, type: 'deployment', message: 'Service deployed to production', time: '2 min ago', icon: Rocket },
                      { id: 3, type: 'alert', message: 'CPU usage spike detected', time: '5 min ago', icon: AlertTriangle },
                      { id: 4, type: 'success', message: 'Database backup completed', time: '10 min ago', icon: Database },
                      { id: 5, type: 'info', message: 'Cache cleared successfully', time: '15 min ago', icon: RefreshCw },
                    ].map((event, index) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3 py-3 border-b last:border-0"
                      >
                        <div className="p-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg">
                          <event.icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{event.message}</p>
                          <p className="text-xs text-muted-foreground">{event.time}</p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            {/* AI Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {aiInsights.map((insight, index) => (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`bg-background/50 backdrop-blur-sm border-white/10 ${alertStyles[insight.severity as keyof typeof alertStyles].border}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${alertStyles[insight.severity as keyof typeof alertStyles].bg}`}>
                            <Brain className={`h-5 w-5 ${alertStyles[insight.severity as keyof typeof alertStyles].color}`} />
                          </div>
                          <div>
                            <CardTitle className="text-base">{insight.title}</CardTitle>
                            <p className="text-xs text-muted-foreground mt-1">{insight.timestamp}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="ml-2">
                          {insight.confidence}% confidence
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{insight.description}</p>
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Apply Fix
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* AI Predictions */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-background/50 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>AI Performance Predictions</CardTitle>
                      <CardDescription>Next 24 hours forecast</CardDescription>
                    </div>
                    <Badge variant="outline" className="gap-1">
                      <Sparkles className="h-3 w-3" />
                      AI-Powered
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={[
                      { time: '00:00', actual: 45, predicted: 48, confidence: 85 },
                      { time: '04:00', actual: 38, predicted: 42, confidence: 90 },
                      { time: '08:00', actual: 62, predicted: 65, confidence: 88 },
                      { time: '12:00', actual: 75, predicted: 78, confidence: 92 },
                      { time: '16:00', actual: 68, predicted: null, confidence: 87 },
                      { time: '20:00', actual: null, predicted: 55, confidence: 85 },
                      { time: '24:00', actual: null, predicted: 42, confidence: 82 },
                    ]}>
                      <defs>
                        <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="time" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="actual"
                        stroke="#3b82f6"
                        fill="url(#colorActual)"
                        strokeWidth={2}
                        name="Actual"
                      />
                      <Area
                        type="monotone"
                        dataKey="predicted"
                        stroke="#8b5cf6"
                        fill="url(#colorPredicted)"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="Predicted"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            {/* Active Alerts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Alert className="border-red-500/50 bg-red-500/10">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Critical: Database Connection Pool Exhausted</p>
                      <p className="text-sm text-muted-foreground mt-1">Connection pool has reached maximum capacity</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        Investigate
                      </Button>
                      <Button size="sm" variant="outline">
                        <XCircle className="h-4 w-4 mr-1" />
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            </motion.div>

            {/* Alert Configuration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-background/50 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle>Alert Rules</CardTitle>
                  <CardDescription>Configure monitoring alerts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: 'High CPU Usage', condition: 'CPU > 80%', enabled: true, severity: 'warning' },
                      { name: 'Memory Pressure', condition: 'Memory > 85%', enabled: true, severity: 'critical' },
                      { name: 'Disk Space Low', condition: 'Disk > 90%', enabled: false, severity: 'warning' },
                      { name: 'Error Rate Spike', condition: 'Errors > 1%', enabled: true, severity: 'critical' },
                      { name: 'Response Time SLA', condition: 'P95 > 500ms', enabled: true, severity: 'warning' },
                    ].map((rule, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between py-3 border-b last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <Switch checked={rule.enabled} />
                          <div>
                            <p className="font-medium">{rule.name}</p>
                            <p className="text-sm text-muted-foreground">{rule.condition}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={rule.severity === 'critical' ? 'destructive' : 'secondary'}>
                            {rule.severity}
                          </Badge>
                          <Button size="sm" variant="ghost">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Notification Settings */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-background/50 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle>Notification Channels</CardTitle>
                  <CardDescription>Configure how you receive alerts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { channel: 'Email', icon: Mail, enabled: true, config: 'team@company.com' },
                    { channel: 'Slack', icon: MessageSquare, enabled: true, config: '#alerts-channel' },
                    { channel: 'PagerDuty', icon: Phone, enabled: false, config: 'Not configured' },
                    { channel: 'Webhook', icon: Globe, enabled: true, config: 'https://api.company.com/webhooks' },
                  ].map((channel, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg">
                          <channel.icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">{channel.channel}</p>
                          <p className="text-sm text-muted-foreground">{channel.config}</p>
                        </div>
                      </div>
                      <Switch checked={channel.enabled} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

// Add missing imports
import { Mail, MessageSquare, Phone, Rocket } from 'lucide-react';