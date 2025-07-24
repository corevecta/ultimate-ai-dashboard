'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Treemap,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import {
  Shield,
  AlertTriangle,
  Lock,
  UserCheck,
  FileCheck,
  Activity,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Eye,
  ShieldCheck,
  ShieldAlert,
  Users,
  Key,
  FileWarning,
  Zap,
  Brain,
  Bug,
  AlertOctagon,
  Globe,
  Fingerprint,
  Clock,
} from 'lucide-react';

// Sample data for various charts
const threatTimelineData = [
  { time: '00:00', threats: 12, blocked: 10, critical: 2 },
  { time: '04:00', threats: 18, blocked: 15, critical: 3 },
  { time: '08:00', threats: 45, blocked: 42, critical: 3 },
  { time: '12:00', threats: 38, blocked: 35, critical: 3 },
  { time: '16:00', threats: 52, blocked: 48, critical: 4 },
  { time: '20:00', threats: 28, blocked: 26, critical: 2 },
  { time: '24:00', threats: 15, blocked: 14, critical: 1 },
];

const attackVectorData = [
  { vector: 'DDoS', value: 35, color: '#FF6B6B' },
  { vector: 'Phishing', value: 28, color: '#4ECDC4' },
  { vector: 'Malware', value: 20, color: '#45B7D1' },
  { vector: 'SQL Injection', value: 12, color: '#96CEB4' },
  { vector: 'XSS', value: 5, color: '#FFEAA7' },
];

const radarData = [
  { subject: 'Network', A: 85, B: 65, fullMark: 100 },
  { subject: 'Application', A: 78, B: 82, fullMark: 100 },
  { subject: 'Data', A: 92, B: 75, fullMark: 100 },
  { subject: 'Identity', A: 88, B: 68, fullMark: 100 },
  { subject: 'Device', A: 76, B: 85, fullMark: 100 },
  { subject: 'Cloud', A: 95, B: 88, fullMark: 100 },
];

const vulnerabilityHeatmap = [
  { day: 'Mon', hour: '00-06', value: 10 },
  { day: 'Mon', hour: '06-12', value: 25 },
  { day: 'Mon', hour: '12-18', value: 45 },
  { day: 'Mon', hour: '18-24', value: 20 },
  { day: 'Tue', hour: '00-06', value: 8 },
  { day: 'Tue', hour: '06-12', value: 30 },
  { day: 'Tue', hour: '12-18', value: 50 },
  { day: 'Tue', hour: '18-24', value: 18 },
  { day: 'Wed', hour: '00-06', value: 12 },
  { day: 'Wed', hour: '06-12', value: 35 },
  { day: 'Wed', hour: '12-18', value: 48 },
  { day: 'Wed', hour: '18-24', value: 22 },
  { day: 'Thu', hour: '00-06', value: 15 },
  { day: 'Thu', hour: '06-12', value: 28 },
  { day: 'Thu', hour: '12-18', value: 42 },
  { day: 'Thu', hour: '18-24', value: 25 },
  { day: 'Fri', hour: '00-06', value: 5 },
  { day: 'Fri', hour: '06-12', value: 20 },
  { day: 'Fri', hour: '12-18', value: 38 },
  { day: 'Fri', hour: '18-24', value: 15 },
];

const incidentsTreemapData = [
  { name: 'Critical', size: 2400, fill: '#FF4757' },
  { name: 'High', size: 1800, fill: '#FF6348' },
  { name: 'Medium', size: 3200, fill: '#FFA502' },
  { name: 'Low', size: 4500, fill: '#2ED573' },
  { name: 'Info', size: 2800, fill: '#1E90FF' },
];

const complianceData = [
  { standard: 'GDPR', compliance: 95, target: 100 },
  { standard: 'SOC 2', compliance: 88, target: 100 },
  { standard: 'ISO 27001', compliance: 92, target: 100 },
  { standard: 'HIPAA', compliance: 85, target: 100 },
  { standard: 'PCI DSS', compliance: 90, target: 100 },
];

const accessControlMatrix = [
  { role: 'Admin', resource: 'Database', access: 'Full' },
  { role: 'Admin', resource: 'API', access: 'Full' },
  { role: 'Admin', resource: 'Files', access: 'Full' },
  { role: 'User', resource: 'Database', access: 'Read' },
  { role: 'User', resource: 'API', access: 'Limited' },
  { role: 'User', resource: 'Files', access: 'Read' },
  { role: 'Guest', resource: 'Database', access: 'None' },
  { role: 'Guest', resource: 'API', access: 'Public' },
  { role: 'Guest', resource: 'Files', access: 'None' },
];

const securityAlerts = [
  {
    id: 1,
    type: 'critical',
    message: 'Multiple failed login attempts detected from IP 192.168.1.100',
    time: '2 minutes ago',
    icon: ShieldAlert,
  },
  {
    id: 2,
    type: 'warning',
    message: 'Unusual API access pattern detected',
    time: '15 minutes ago',
    icon: AlertTriangle,
  },
  {
    id: 3,
    type: 'info',
    message: 'Security patch successfully applied to 12 servers',
    time: '1 hour ago',
    icon: CheckCircle,
  },
];

const aiInsights = [
  {
    id: 1,
    title: 'Anomaly Detection',
    description: 'AI detected unusual traffic patterns from Eastern Europe region',
    severity: 'high',
    recommendation: 'Consider implementing geo-blocking for high-risk regions',
  },
  {
    id: 2,
    title: 'Vulnerability Prediction',
    description: 'Machine learning models predict 78% chance of SQL injection attempts in the next 48 hours',
    severity: 'medium',
    recommendation: 'Review and strengthen database input validation',
  },
  {
    id: 3,
    title: 'Access Pattern Analysis',
    description: 'AI identified potential insider threat based on access patterns',
    severity: 'critical',
    recommendation: 'Review user permissions and enable enhanced monitoring',
  },
];

const tabs = ['Overview', 'Threats', 'Vulnerabilities', 'Access', 'Compliance', 'Incidents'];

export default function EnhancedSecurityDashboard() {
  const [activeTab, setActiveTab] = useState('Overview');

  const renderGauge = (value: number, label: string, color: string) => (
    <div className="relative w-40 h-40">
      <svg className="transform -rotate-90 w-40 h-40">
        <circle
          cx="80"
          cy="80"
          r="70"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="12"
          fill="none"
        />
        <circle
          cx="80"
          cy="80"
          r="70"
          stroke={color}
          strokeWidth="12"
          fill="none"
          strokeDasharray={`${(value / 100) * 440} 440`}
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-white">{value}%</span>
        <span className="text-sm text-white/70">{label}</span>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'Overview':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Security Score Gauges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6"
            >
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Scores
              </h3>
              <div className="flex flex-wrap justify-around gap-4">
                {renderGauge(92, 'Overall', '#4ECDC4')}
                {renderGauge(88, 'Network', '#45B7D1')}
                {renderGauge(95, 'Data', '#96CEB4')}
              </div>
            </motion.div>

            {/* Threat Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6"
            >
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Threat Activity Timeline
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={threatTimelineData}>
                  <defs>
                    <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF6B6B" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#FF6B6B" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="colorBlocked" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4ECDC4" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#4ECDC4" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="time" stroke="#fff" />
                  <YAxis stroke="#fff" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="threats"
                    stroke="#FF6B6B"
                    fillOpacity={1}
                    fill="url(#colorThreats)"
                  />
                  <Area
                    type="monotone"
                    dataKey="blocked"
                    stroke="#4ECDC4"
                    fillOpacity={1}
                    fill="url(#colorBlocked)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Attack Vectors */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6"
            >
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Attack Vector Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={attackVectorData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {attackVectorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Security Radar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-6"
            >
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Security Coverage Analysis
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.2)" />
                  <PolarAngleAxis dataKey="subject" stroke="#fff" />
                  <PolarRadiusAxis stroke="#fff" />
                  <Radar
                    name="Current"
                    dataKey="A"
                    stroke="#4ECDC4"
                    fill="#4ECDC4"
                    fillOpacity={0.6}
                  />
                  <Radar
                    name="Target"
                    dataKey="B"
                    stroke="#FF6B6B"
                    fill="#FF6B6B"
                    fillOpacity={0.6}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        );

      case 'Threats':
        return (
          <div className="space-y-6">
            {/* Real-time Alerts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6"
            >
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Real-time Security Alerts
              </h3>
              <div className="space-y-3">
                {securityAlerts.map((alert) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-4 rounded-lg border flex items-start gap-3 relative overflow-hidden ${
                      alert.type === 'critical'
                        ? 'bg-red-500/10 border-red-500/30'
                        : alert.type === 'warning'
                        ? 'bg-yellow-500/10 border-yellow-500/30'
                        : 'bg-blue-500/10 border-blue-500/30'
                    }`}
                  >
                    {alert.type === 'critical' && (
                      <div className="absolute inset-0 bg-red-500/20 animate-pulse" />
                    )}
                    <alert.icon
                      className={`w-5 h-5 mt-0.5 ${
                        alert.type === 'critical'
                          ? 'text-red-500'
                          : alert.type === 'warning'
                          ? 'text-yellow-500'
                          : 'text-blue-500'
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-white">{alert.message}</p>
                      <p className="text-sm text-white/50 mt-1">{alert.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* AI Insights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6"
            >
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5" />
                AI-Powered Security Insights
              </h3>
              <div className="grid gap-4">
                {aiInsights.map((insight) => (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 rounded-lg bg-white/5 border border-white/10"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-white">{insight.title}</h4>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          insight.severity === 'critical'
                            ? 'bg-red-500/20 text-red-400'
                            : insight.severity === 'high'
                            ? 'bg-orange-500/20 text-orange-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {insight.severity}
                      </span>
                    </div>
                    <p className="text-white/70 text-sm mb-3">{insight.description}</p>
                    <div className="p-3 rounded bg-blue-500/10 border border-blue-500/20">
                      <p className="text-sm text-blue-300 flex items-start gap-2">
                        <ShieldCheck className="w-4 h-4 mt-0.5" />
                        <span>{insight.recommendation}</span>
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Real-time Threat Monitoring */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6"
            >
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Real-time Threat Monitoring
                <span className="ml-auto text-xs bg-red-500 text-white px-2 py-1 rounded-full animate-pulse">
                  LIVE
                </span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white/70">Active Threats</span>
                    <TrendingUp className="w-4 h-4 text-red-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">247</div>
                  <div className="text-xs text-red-400">+12% from last hour</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white/70">Blocked Attacks</span>
                    <ShieldCheck className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">98.7%</div>
                  <div className="text-xs text-green-400">Above target</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white/70">Response Time</span>
                    <Clock className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">1.2s</div>
                  <div className="text-xs text-yellow-400">-0.3s improvement</div>
                </div>
              </div>
            </motion.div>
          </div>
        );

      case 'Vulnerabilities':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Vulnerability Heatmap */}
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <FileWarning className="w-5 h-5" />
                Vulnerability Heatmap
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {vulnerabilityHeatmap.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.01 }}
                    className="relative group"
                  >
                    <div
                      className="h-20 rounded flex items-center justify-center text-xs font-medium transition-all cursor-pointer hover:scale-110"
                      style={{
                        backgroundColor: `rgba(255, 107, 107, ${item.value / 50})`,
                        boxShadow: item.value > 40 ? '0 0 20px rgba(255, 107, 107, 0.5)' : 'none',
                      }}
                    >
                      {item.value}
                    </div>
                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {item.day} {item.hour}: {item.value} vulnerabilities
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-4 text-sm text-white/70">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-red-500/20"></div>
                  <span>Low Risk</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-red-500/50"></div>
                  <span>Medium Risk</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-red-500/80"></div>
                  <span>High Risk</span>
                </div>
              </div>
            </div>

            {/* Vulnerability Details */}
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Bug className="w-5 h-5" />
                Vulnerability Scanner Results
              </h3>
              <div className="space-y-3">
                {[
                  { name: 'SQL Injection in login endpoint', severity: 'Critical', age: '2 days', status: 'Open' },
                  { name: 'Outdated SSL certificate', severity: 'High', age: '5 days', status: 'In Progress' },
                  { name: 'Weak password policy', severity: 'Medium', age: '10 days', status: 'Open' },
                  { name: 'Missing security headers', severity: 'Low', age: '15 days', status: 'Fixed' }
                ].map((vuln, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${
                        vuln.severity === 'Critical' ? 'bg-red-500' :
                        vuln.severity === 'High' ? 'bg-orange-500' :
                        vuln.severity === 'Medium' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`} />
                      <div>
                        <div className="font-medium text-white">{vuln.name}</div>
                        <div className="text-sm text-gray-400">Discovered {vuln.age} ago</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        vuln.status === 'Fixed' ? 'bg-green-500/20 text-green-400' :
                        vuln.status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {vuln.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 'Access':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Access Control Matrix */}
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Key className="w-5 h-5" />
                Access Control Matrix
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left p-3 text-white/70">Role</th>
                      <th className="text-left p-3 text-white/70">Resource</th>
                      <th className="text-left p-3 text-white/70">Access Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accessControlMatrix.map((item, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-white/5 hover:bg-white/5"
                      >
                        <td className="p-3 text-white">{item.role}</td>
                        <td className="p-3 text-white/80">{item.resource}</td>
                        <td className="p-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs ${
                              item.access === 'Full'
                                ? 'bg-green-500/20 text-green-400'
                                : item.access === 'Limited' || item.access === 'Read'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : item.access === 'Public'
                                ? 'bg-blue-500/20 text-blue-400'
                                : 'bg-red-500/20 text-red-400'
                            }`}
                          >
                            {item.access}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* User Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-card p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Active Users
                </h3>
                <div className="space-y-3">
                  {[
                    { user: 'admin@company.com', status: 'Active', lastAccess: '2 minutes ago', risk: 'Low' },
                    { user: 'developer@company.com', status: 'Active', lastAccess: '15 minutes ago', risk: 'Medium' },
                    { user: 'analyst@company.com', status: 'Idle', lastAccess: '1 hour ago', risk: 'Low' },
                    { user: 'guest@external.com', status: 'Restricted', lastAccess: '3 hours ago', risk: 'High' },
                  ].map((user, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                    >
                      <div>
                        <div className="text-sm font-medium text-white">{user.user}</div>
                        <div className="text-xs text-gray-400">{user.lastAccess}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          user.status === 'Active' ? 'bg-green-500/20 text-green-400' :
                          user.status === 'Idle' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {user.status}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          user.risk === 'Low' ? 'bg-blue-500/20 text-blue-400' :
                          user.risk === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {user.risk} Risk
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Fingerprint className="w-5 h-5" />
                  Authentication Methods
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'MFA', value: 65, color: '#4ECDC4' },
                        { name: 'SSO', value: 25, color: '#45B7D1' },
                        { name: 'Password', value: 10, color: '#FF6B6B' },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {[
                        { name: 'MFA', value: 65, color: '#4ECDC4' },
                        { name: 'SSO', value: 25, color: '#45B7D1' },
                        { name: 'Password', value: 10, color: '#FF6B6B' },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        );

      case 'Compliance':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Compliance Status */}
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <FileCheck className="w-5 h-5" />
                Compliance Status Indicators
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {complianceData.map((item, index) => (
                  <motion.div
                    key={item.standard}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 rounded-lg p-4 text-center"
                  >
                    <h4 className="text-lg font-semibold text-white mb-2">{item.standard}</h4>
                    <div className="relative w-24 h-24 mx-auto mb-2">
                      <svg className="w-24 h-24 transform -rotate-90">
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="rgba(255,255,255,0.1)"
                          strokeWidth="8"
                          fill="none"
                        />
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke={item.compliance >= 90 ? '#10B981' : item.compliance >= 80 ? '#F59E0B' : '#EF4444'}
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 40}`}
                          strokeDashoffset={`${2 * Math.PI * 40 * (1 - item.compliance / 100)}`}
                          className="transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">{item.compliance}%</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Compliance Details */}
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Compliance Requirements</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={complianceData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis type="number" stroke="#fff" domain={[0, 100]} />
                  <YAxis type="category" dataKey="standard" stroke="#fff" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="compliance" fill="#4ECDC4" radius={[0, 8, 8, 0]}>
                    {complianceData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.compliance >= 90 ? '#2ED573' : entry.compliance >= 80 ? '#FFA502' : '#FF4757'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        );

      case 'Incidents':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Incidents Treemap */}
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Security Incidents by Severity
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <Treemap
                  data={incidentsTreemapData}
                  dataKey="size"
                  aspectRatio={4 / 3}
                  stroke="#fff"
                  fill="#8884d8"
                >
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '8px',
                    }}
                  />
                </Treemap>
              </ResponsiveContainer>
              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                {incidentsTreemapData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: item.fill }}></div>
                    <span className="text-white/70">{item.name}: {item.size}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Incidents */}
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <AlertOctagon className="w-5 h-5" />
                Recent Security Incidents
              </h3>
              <div className="space-y-3">
                {[
                  { id: 'INC-001', title: 'Brute force attack detected', severity: 'Critical', time: '10 minutes ago', status: 'Active' },
                  { id: 'INC-002', title: 'Unauthorized access attempt', severity: 'High', time: '1 hour ago', status: 'Resolved' },
                  { id: 'INC-003', title: 'Suspicious file upload', severity: 'Medium', time: '3 hours ago', status: 'Investigating' },
                  { id: 'INC-004', title: 'API rate limit exceeded', severity: 'Low', time: '5 hours ago', status: 'Resolved' },
                ].map((incident, index) => (
                  <motion.div
                    key={incident.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-sm font-mono text-gray-400">{incident.id}</span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            incident.severity === 'Critical' ? 'bg-red-500/20 text-red-400' :
                            incident.severity === 'High' ? 'bg-orange-500/20 text-orange-400' :
                            incident.severity === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-blue-500/20 text-blue-400'
                          }`}>
                            {incident.severity}
                          </span>
                        </div>
                        <h4 className="font-medium text-white">{incident.title}</h4>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-400">{incident.time}</div>
                        <span className={`inline-block mt-1 px-2 py-1 rounded text-xs ${
                          incident.status === 'Active' ? 'bg-red-500/20 text-red-400' :
                          incident.status === 'Investigating' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {incident.status}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900" />
        
        {/* Floating Blobs */}
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-20"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-20"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500 rounded-full filter blur-3xl opacity-20"
          animate={{
            x: [-200, 200, -200],
            y: [-200, 200, -200],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Shield className="w-12 h-12" />
            Security Command Center
          </h1>
          <p className="text-white/70">AI-Powered Threat Detection and Prevention</p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab
                  ? 'bg-white/20 text-white shadow-lg backdrop-blur-md'
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              {tab}
            </button>
          ))}
        </motion.div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      <style jsx global>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        }
      `}</style>
    </div>
  );
}