'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  RadarChart,
  Radar,
  Treemap,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';
import {
  Server,
  Network,
  Database,
  HardDrive,
  Box,
  Activity,
  Cpu,
  MemoryStick,
  Wifi,
  Cloud,
  Shield,
  AlertCircle,
  CheckCircle,
  XCircle,
  Zap,
  GitBranch,
  Layers,
  BarChart3,
} from 'lucide-react';

// Sample data for various charts
const serverHealthData = [
  { server: 'Web-01', cpu: 45, memory: 67, disk: 23, status: 'healthy' },
  { server: 'Web-02', cpu: 78, memory: 82, disk: 45, status: 'warning' },
  { server: 'API-01', cpu: 34, memory: 45, disk: 67, status: 'healthy' },
  { server: 'API-02', cpu: 89, memory: 91, disk: 78, status: 'critical' },
  { server: 'DB-01', cpu: 56, memory: 72, disk: 84, status: 'warning' },
  { server: 'Cache-01', cpu: 23, memory: 34, disk: 12, status: 'healthy' },
];

const networkTrafficData = [
  { time: '00:00', inbound: 120, outbound: 80 },
  { time: '04:00', inbound: 98, outbound: 65 },
  { time: '08:00', inbound: 186, outbound: 145 },
  { time: '12:00', inbound: 289, outbound: 234 },
  { time: '16:00', inbound: 245, outbound: 198 },
  { time: '20:00', inbound: 178, outbound: 142 },
];

const containerData = [
  { name: 'Frontend', value: 12, status: 'running' },
  { name: 'Backend', value: 8, status: 'running' },
  { name: 'Database', value: 4, status: 'running' },
  { name: 'Cache', value: 6, status: 'running' },
  { name: 'Queue', value: 3, status: 'stopped' },
];

const storageData = [
  { name: 'SSD', total: 1000, used: 678 },
  { name: 'HDD', total: 5000, used: 3456 },
  { name: 'Object Storage', total: 10000, used: 7234 },
  { name: 'Backup', total: 8000, used: 5678 },
];

const serviceMetrics = [
  { metric: 'Uptime', value: 99.9 },
  { metric: 'Response Time', value: 87 },
  { metric: 'Throughput', value: 92 },
  { metric: 'Error Rate', value: 15 },
  { metric: 'Availability', value: 95 },
  { metric: 'Performance', value: 88 },
];

const databaseConnections = [
  { db: 'PostgreSQL', active: 45, idle: 15, max: 100 },
  { db: 'Redis', active: 78, idle: 22, max: 150 },
  { db: 'MongoDB', active: 34, idle: 16, max: 80 },
  { db: 'Elasticsearch', active: 56, idle: 24, max: 120 },
];

const tabs = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'servers', label: 'Servers', icon: Server },
  { id: 'network', label: 'Network', icon: Network },
  { id: 'storage', label: 'Storage', icon: HardDrive },
  { id: 'containers', label: 'Containers', icon: Box },
  { id: 'databases', label: 'Databases', icon: Database },
];

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

export default function EnhancedInfrastructureDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'running':
        return '#10b981';
      case 'warning':
        return '#f59e0b';
      case 'critical':
      case 'stopped':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const renderGauge = (value: number, label: string, color: string) => (
    <div className="relative w-32 h-32">
      <svg className="transform -rotate-90 w-32 h-32">
        <circle
          cx="64"
          cy="64"
          r="56"
          stroke="currentColor"
          strokeWidth="12"
          fill="none"
          className="text-gray-700"
        />
        <circle
          cx="64"
          cy="64"
          r="56"
          stroke={color}
          strokeWidth="12"
          fill="none"
          strokeDasharray={`${(value / 100) * 351.86} 351.86`}
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-white">{value}%</span>
        <span className="text-xs text-gray-400">{label}</span>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Server Health Heatmap */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-span-1 lg:col-span-2 backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Server className="w-5 h-5" />
                Server Health Matrix
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {serverHealthData.map((server, index) => (
                  <motion.div
                    key={server.server}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative p-4 rounded-xl border border-white/10"
                    style={{
                      background: `linear-gradient(135deg, ${getStatusColor(
                        server.status
                      )}20 0%, transparent 100%)`,
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-white">{server.server}</span>
                      <div
                        className="w-2 h-2 rounded-full animate-pulse"
                        style={{ backgroundColor: getStatusColor(server.status) }}
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-gray-400">CPU: {server.cpu}%</div>
                      <div className="text-xs text-gray-400">MEM: {server.memory}%</div>
                      <div className="text-xs text-gray-400">DISK: {server.disk}%</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Resource Gauges */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Cpu className="w-5 h-5" />
                Resource Utilization
              </h3>
              <div className="flex flex-wrap justify-around gap-4">
                {renderGauge(73, 'CPU', '#3b82f6')}
                {renderGauge(86, 'Memory', '#8b5cf6')}
                {renderGauge(54, 'Storage', '#10b981')}
              </div>
            </motion.div>

            {/* Network Traffic */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-span-1 lg:col-span-2 backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Network className="w-5 h-5" />
                Network Traffic
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={networkTrafficData}>
                  <defs>
                    <linearGradient id="inboundGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="outboundGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(17, 24, 39, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="inbound"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#inboundGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="outbound"
                    stroke="#8b5cf6"
                    fillOpacity={1}
                    fill="url(#outboundGradient)"
                  />
                  <Legend />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Container Status */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Box className="w-5 h-5" />
                Container Status
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={containerData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {containerData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={getStatusColor(entry.status)}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(17, 24, 39, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {containerData.map((container, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getStatusColor(container.status) }}
                      />
                      <span className="text-sm text-gray-300">{container.name}</span>
                    </div>
                    <span className="text-sm text-gray-400">{container.value} pods</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        );

      case 'servers':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Server Performance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Server Performance</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={serverHealthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="server" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(17, 24, 39, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="cpu" fill="#3b82f6" />
                  <Bar dataKey="memory" fill="#8b5cf6" />
                  <Bar dataKey="disk" fill="#10b981" />
                  <Legend />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Service Metrics Radar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Service Metrics</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={serviceMetrics}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis dataKey="metric" stroke="#9ca3af" />
                  <PolarRadiusAxis stroke="#9ca3af" />
                  <Radar
                    name="Performance"
                    dataKey="value"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.6}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(17, 24, 39, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Server List */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="col-span-1 lg:col-span-2 backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Server Details</h3>
              <div className="space-y-3">
                {serverHealthData.map((server, index) => (
                  <motion.div
                    key={server.server}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Server className="w-5 h-5 text-gray-400" />
                        <div>
                          <h4 className="font-medium text-white">{server.server}</h4>
                          <p className="text-sm text-gray-400">Region: US-East-1</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-400">CPU</p>
                          <p className="font-medium text-white">{server.cpu}%</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-400">Memory</p>
                          <p className="font-medium text-white">{server.memory}%</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-400">Disk</p>
                          <p className="font-medium text-white">{server.disk}%</p>
                        </div>
                        <div
                          className="w-3 h-3 rounded-full animate-pulse"
                          style={{ backgroundColor: getStatusColor(server.status) }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        );

      case 'network':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Network Topology */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="col-span-1 lg:col-span-2 backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Network Topology</h3>
              <div className="relative h-96">
                {/* Central Load Balancer */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl"
                >
                  <Cloud className="w-12 h-12 text-white" />
                </motion.div>

                {/* Connected Nodes */}
                {[
                  { icon: Server, label: 'Web Servers', angle: 0, color: 'from-green-500 to-emerald-600' },
                  { icon: Database, label: 'Databases', angle: 72, color: 'from-purple-500 to-pink-600' },
                  { icon: Shield, label: 'Firewall', angle: 144, color: 'from-red-500 to-orange-600' },
                  { icon: Layers, label: 'Cache Layer', angle: 216, color: 'from-yellow-500 to-amber-600' },
                  { icon: GitBranch, label: 'API Gateway', angle: 288, color: 'from-cyan-500 to-blue-600' },
                ].map((node, index) => {
                  const x = Math.cos((node.angle * Math.PI) / 180) * 150;
                  const y = Math.sin((node.angle * Math.PI) / 180) * 150;

                  return (
                    <motion.div
                      key={node.label}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="absolute top-1/2 left-1/2"
                      style={{
                        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                      }}
                    >
                      <div className={`w-16 h-16 bg-gradient-to-br ${node.color} rounded-xl flex items-center justify-center shadow-lg`}>
                        <node.icon className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-xs text-gray-400 text-center mt-2">{node.label}</p>
                      {/* Connection Line */}
                      <svg
                        className="absolute top-8 left-8"
                        style={{
                          width: `${Math.abs(x)}px`,
                          height: `${Math.abs(y)}px`,
                          transform: `translate(${x < 0 ? x : 0}px, ${y < 0 ? y : 0}px)`,
                        }}
                      >
                        <line
                          x1={x < 0 ? Math.abs(x) : 0}
                          y1={y < 0 ? Math.abs(y) : 0}
                          x2={x < 0 ? 0 : x}
                          y2={y < 0 ? 0 : y}
                          stroke="url(#gradient)"
                          strokeWidth="2"
                          strokeDasharray="5,5"
                          className="animate-pulse"
                        />
                        <defs>
                          <linearGradient id="gradient">
                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.5" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Traffic Flow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Traffic Flow</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={networkTrafficData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(17, 24, 39, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="inbound"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="outbound"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ fill: '#8b5cf6' }}
                  />
                  <Legend />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Network Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Network Statistics</h3>
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Bandwidth Usage</span>
                    <span className="text-sm font-medium text-white">2.4 TB / 5 TB</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: '48%' }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-white/5">
                    <Wifi className="w-4 h-4 text-gray-400 mb-1" />
                    <p className="text-xs text-gray-400">Latency</p>
                    <p className="text-lg font-semibold text-white">12ms</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5">
                    <Activity className="w-4 h-4 text-gray-400 mb-1" />
                    <p className="text-xs text-gray-400">Packet Loss</p>
                    <p className="text-lg font-semibold text-white">0.02%</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5">
                    <Zap className="w-4 h-4 text-gray-400 mb-1" />
                    <p className="text-xs text-gray-400">Throughput</p>
                    <p className="text-lg font-semibold text-white">850 Mbps</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5">
                    <Shield className="w-4 h-4 text-gray-400 mb-1" />
                    <p className="text-xs text-gray-400">Security Events</p>
                    <p className="text-lg font-semibold text-white">3</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        );

      case 'storage':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Storage Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Storage Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <Treemap
                  data={storageData.map(item => ({
                    name: item.name,
                    size: item.used,
                    fill: COLORS[Math.floor(Math.random() * COLORS.length)],
                  }))}
                  dataKey="size"
                  stroke="#fff"
                  fill="#8884d8"
                >
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(17, 24, 39, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                    }}
                  />
                </Treemap>
              </ResponsiveContainer>
            </motion.div>

            {/* Storage Usage */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Storage Usage</h3>
              <div className="space-y-4">
                {storageData.map((storage, index) => (
                  <div key={storage.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white">{storage.name}</span>
                      <span className="text-sm text-gray-400">
                        {storage.used} GB / {storage.total} GB
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(storage.used / storage.total) * 100}%` }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Storage Performance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-span-1 lg:col-span-2 backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-xl font-semibold text-white mb-4">I/O Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/20 to-transparent border border-blue-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Read Speed</span>
                    <Activity className="w-4 h-4 text-blue-400" />
                  </div>
                  <p className="text-2xl font-bold text-white">540 MB/s</p>
                  <p className="text-xs text-gray-400 mt-1">+12% from last hour</p>
                </div>
                <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/20 to-transparent border border-purple-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Write Speed</span>
                    <Activity className="w-4 h-4 text-purple-400" />
                  </div>
                  <p className="text-2xl font-bold text-white">380 MB/s</p>
                  <p className="text-xs text-gray-400 mt-1">-5% from last hour</p>
                </div>
                <div className="p-4 rounded-lg bg-gradient-to-br from-green-500/20 to-transparent border border-green-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">IOPS</span>
                    <Zap className="w-4 h-4 text-green-400" />
                  </div>
                  <p className="text-2xl font-bold text-white">125K</p>
                  <p className="text-xs text-gray-400 mt-1">Normal range</p>
                </div>
              </div>
            </motion.div>
          </div>
        );

      case 'containers':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Container Grid */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="col-span-1 lg:col-span-2 xl:col-span-3 backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Container/Pod Status</h3>
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {Array.from({ length: 24 }).map((_, index) => {
                  const status = index % 8 === 0 ? 'stopped' : index % 12 === 0 ? 'warning' : 'running';
                  return (
                    <motion.div
                      key={index}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.02 }}
                      whileHover={{ scale: 1.1 }}
                      className="relative group"
                    >
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center cursor-pointer transition-all"
                        style={{
                          backgroundColor: `${getStatusColor(status)}20`,
                          borderColor: getStatusColor(status),
                          borderWidth: '2px',
                        }}
                      >
                        <Box className="w-6 h-6" style={{ color: getStatusColor(status) }} />
                      </div>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Pod-{index + 1}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Container Resources */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Container Resources</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={containerData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis type="number" stroke="#9ca3af" />
                  <YAxis dataKey="name" type="category" stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(17, 24, 39, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="value" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Container Health */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Health Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-sm text-white">Healthy</span>
                  </div>
                  <span className="text-lg font-semibold text-white">28</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                    <span className="text-sm text-white">Warning</span>
                  </div>
                  <span className="text-lg font-semibold text-white">4</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-400" />
                    <span className="text-sm text-white">Critical</span>
                  </div>
                  <span className="text-lg font-semibold text-white">1</span>
                </div>
              </div>
            </motion.div>

            {/* Deployment Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Recent Deployments</h3>
              <div className="space-y-3">
                {['Frontend v2.1.0', 'Backend v3.0.2', 'Database Migration', 'Cache Update'].map(
                  (deployment, index) => (
                    <motion.div
                      key={deployment}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <span className="text-sm text-gray-300">{deployment}</span>
                      <span className="text-xs text-gray-500">
                        {index === 0 ? '2 hours ago' : index === 1 ? '5 hours ago' : index === 2 ? '1 day ago' : '3 days ago'}
                      </span>
                    </motion.div>
                  )
                )}
              </div>
            </motion.div>
          </div>
        );

      case 'databases':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Database Connections */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Connection Pools</h3>
              <div className="space-y-4">
                {databaseConnections.map((db, index) => (
                  <div key={db.db} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white flex items-center gap-2">
                        <Database className="w-4 h-4" />
                        {db.db}
                      </span>
                      <span className="text-xs text-gray-400">
                        {db.active + db.idle}/{db.max} connections
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(db.active / db.max) * 100}%` }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="h-2 bg-green-500 rounded-l"
                      />
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(db.idle / db.max) * 100}%` }}
                        transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                        className="h-2 bg-yellow-500"
                      />
                      <div
                        className="h-2 bg-gray-700 rounded-r"
                        style={{
                          width: `${((db.max - db.active - db.idle) / db.max) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded" />
                  <span className="text-gray-400">Active</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-yellow-500 rounded" />
                  <span className="text-gray-400">Idle</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-gray-700 rounded" />
                  <span className="text-gray-400">Available</span>
                </div>
              </div>
            </motion.div>

            {/* Query Performance */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Query Performance</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart
                  data={[
                    { time: '00:00', queries: 1200, latency: 12 },
                    { time: '04:00', queries: 800, latency: 8 },
                    { time: '08:00', queries: 2100, latency: 18 },
                    { time: '12:00', queries: 3200, latency: 25 },
                    { time: '16:00', queries: 2800, latency: 22 },
                    { time: '20:00', queries: 1800, latency: 15 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9ca3af" />
                  <YAxis yAxisId="left" stroke="#9ca3af" />
                  <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(17, 24, 39, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="queries"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Queries/min"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="latency"
                    stroke="#ef4444"
                    strokeWidth={2}
                    name="Latency (ms)"
                  />
                  <Legend />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Database Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-span-1 lg:col-span-2 backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Database Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/20 to-transparent border border-blue-500/20">
                  <p className="text-sm text-gray-400 mb-1">Total Queries</p>
                  <p className="text-2xl font-bold text-white">2.8M</p>
                  <p className="text-xs text-blue-400 mt-1">Today</p>
                </div>
                <div className="p-4 rounded-lg bg-gradient-to-br from-green-500/20 to-transparent border border-green-500/20">
                  <p className="text-sm text-gray-400 mb-1">Cache Hit Rate</p>
                  <p className="text-2xl font-bold text-white">94.2%</p>
                  <p className="text-xs text-green-400 mt-1">Excellent</p>
                </div>
                <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/20 to-transparent border border-purple-500/20">
                  <p className="text-sm text-gray-400 mb-1">Avg Response</p>
                  <p className="text-2xl font-bold text-white">18ms</p>
                  <p className="text-xs text-purple-400 mt-1">Normal</p>
                </div>
                <div className="p-4 rounded-lg bg-gradient-to-br from-yellow-500/20 to-transparent border border-yellow-500/20">
                  <p className="text-sm text-gray-400 mb-1">Active Sessions</p>
                  <p className="text-2xl font-bold text-white">342</p>
                  <p className="text-xs text-yellow-400 mt-1">Live</p>
                </div>
              </div>
            </motion.div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20" />
        {/* Floating Blobs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-white mb-2">Infrastructure Dashboard</h1>
            <p className="text-gray-400">Monitor and manage your infrastructure in real-time</p>
          </motion.div>

          {/* Status Bar */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <div className="backdrop-blur-xl bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">System Status</p>
                  <p className="text-lg font-semibold text-white">Operational</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </div>
            <div className="backdrop-blur-xl bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Active Servers</p>
                  <p className="text-lg font-semibold text-white">24/28</p>
                </div>
                <Server className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            <div className="backdrop-blur-xl bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Network Load</p>
                  <p className="text-lg font-semibold text-white">68%</p>
                </div>
                <Activity className="w-8 h-8 text-purple-400" />
              </div>
            </div>
            <div className="backdrop-blur-xl bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Alerts</p>
                  <p className="text-lg font-semibold text-white">3</p>
                </div>
                <AlertCircle className="w-8 h-8 text-yellow-400" />
              </div>
            </div>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-wrap gap-2 mb-8"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-white/10 text-white border border-white/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </motion.div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>

          {/* AI Insights Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10"
          >
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              AI Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20">
                <h4 className="font-medium text-white mb-2">Performance Optimization</h4>
                <p className="text-sm text-gray-400">
                  API-02 server showing high CPU usage. Consider scaling horizontally or optimizing database queries.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20">
                <h4 className="font-medium text-white mb-2">Cost Savings</h4>
                <p className="text-sm text-gray-400">
                  Identified 3 underutilized servers. Consolidating workloads could save $1,200/month.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20">
                <h4 className="font-medium text-white mb-2">Security Alert</h4>
                <p className="text-sm text-gray-400">
                  Unusual network traffic pattern detected on Web-02. Recommend security audit.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}