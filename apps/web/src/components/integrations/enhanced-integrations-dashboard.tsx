'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  Treemap, CartesianGrid, XAxis, YAxis, Tooltip, Legend,
  ResponsiveContainer, Cell, ComposedChart, Sankey
} from 'recharts';
import {
  Activity, Wifi, WifiOff, Zap, AlertCircle, CheckCircle,
  Server, Database, Cloud, Settings, RefreshCw, TrendingUp,
  Clock, ExternalLink, Shield, GitBranch, Terminal, Cpu,
  Network, Lock, Unlock, AlertTriangle, ChevronRight, Globe,
  Code, Webhook, Gauge, GitPullRequest, FileJson
} from 'lucide-react';

// Tab definitions
const TABS = ['Overview', 'APIs', 'Webhooks', 'Services', 'Sync', 'Settings'];

// Color palette
const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

// Sample data
const apiEndpointData = [
  { endpoint: '/api/users', status: 'healthy', latency: 23, requests: 12345, errors: 12 },
  { endpoint: '/api/products', status: 'healthy', latency: 45, requests: 8923, errors: 3 },
  { endpoint: '/api/orders', status: 'warning', latency: 123, requests: 5634, errors: 89 },
  { endpoint: '/api/payments', status: 'healthy', latency: 67, requests: 3421, errors: 1 },
  { endpoint: '/api/analytics', status: 'error', latency: 234, requests: 2341, errors: 234 },
  { endpoint: '/api/notifications', status: 'healthy', latency: 12, requests: 18234, errors: 23 },
];

const webhookActivityData = [
  { time: '00:00', success: 1234, failed: 12 },
  { time: '04:00', success: 2345, failed: 23 },
  { time: '08:00', success: 4567, failed: 45 },
  { time: '12:00', success: 5678, failed: 56 },
  { time: '16:00', success: 4321, failed: 67 },
  { time: '20:00', success: 3210, failed: 34 },
];

const integrationHealthData = [
  { name: 'Stripe', value: 98 },
  { name: 'AWS', value: 99.9 },
  { name: 'MongoDB', value: 95 },
  { name: 'Redis', value: 97 },
  { name: 'Elasticsearch', value: 94 },
];

const apiUsageTreemapData = [
  { name: 'Authentication', size: 4500, category: 'core' },
  { name: 'User Management', size: 3200, category: 'core' },
  { name: 'Product Catalog', size: 2800, category: 'business' },
  { name: 'Order Processing', size: 2400, category: 'business' },
  { name: 'Analytics', size: 1900, category: 'analytics' },
  { name: 'Reporting', size: 1600, category: 'analytics' },
  { name: 'Notifications', size: 1400, category: 'communication' },
  { name: 'Webhooks', size: 1200, category: 'communication' },
];

const rateLimitData = [
  { api: 'Users API', limit: 1000, used: 823, percentage: 82.3 },
  { api: 'Products API', limit: 2000, used: 1234, percentage: 61.7 },
  { api: 'Orders API', limit: 1500, used: 1456, percentage: 97.1 },
  { api: 'Analytics API', limit: 500, used: 234, percentage: 46.8 },
];

const syncFlowData = [
  { source: 'CRM', target: 'Database', status: 'active', records: 12345 },
  { source: 'Database', target: 'Cache', status: 'active', records: 8923 },
  { source: 'API', target: 'Webhook', status: 'warning', records: 5634 },
  { source: 'Queue', target: 'Processor', status: 'active', records: 3421 },
];

const thirdPartyServices = [
  { name: 'Stripe Payment', status: 'operational', uptime: 99.99, region: 'us-east-1' },
  { name: 'AWS S3', status: 'operational', uptime: 99.95, region: 'us-west-2' },
  { name: 'SendGrid', status: 'degraded', uptime: 98.5, region: 'global' },
  { name: 'Twilio', status: 'operational', uptime: 99.9, region: 'us-central' },
  { name: 'MongoDB Atlas', status: 'maintenance', uptime: 99.7, region: 'eu-west-1' },
  { name: 'Cloudflare', status: 'operational', uptime: 99.99, region: 'global' },
];

export default function EnhancedIntegrationsDashboard() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [liveConnections, setLiveConnections] = useState(456);
  const [pulseAnimation, setPulseAnimation] = useState(true);

  // Simulate live connection updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveConnections(prev => prev + Math.floor(Math.random() * 10 - 5));
      setPulseAnimation(true);
      setTimeout(() => setPulseAnimation(false), 1000);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const renderOverviewTab = () => (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        >
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-8 h-8 text-purple-400" />
            <span className={`w-3 h-3 rounded-full ${pulseAnimation ? 'animate-pulse' : ''} bg-green-400`} />
          </div>
          <h3 className="text-white/60 text-sm">Live Connections</h3>
          <p className="text-3xl font-bold text-white mt-2">{liveConnections}</p>
          <p className="text-green-400 text-sm mt-2">+12% from last hour</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        >
          <div className="flex items-center justify-between mb-4">
            <Zap className="w-8 h-8 text-yellow-400" />
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <h3 className="text-white/60 text-sm">API Calls Today</h3>
          <p className="text-3xl font-bold text-white mt-2">12.5M</p>
          <p className="text-yellow-400 text-sm mt-2">99.97% success rate</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        >
          <div className="flex items-center justify-between mb-4">
            <Shield className="w-8 h-8 text-green-400" />
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
          <h3 className="text-white/60 text-sm">Security Status</h3>
          <p className="text-3xl font-bold text-white mt-2">Secure</p>
          <p className="text-green-400 text-sm mt-2">All systems operational</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        >
          <div className="flex items-center justify-between mb-4">
            <Database className="w-8 h-8 text-blue-400" />
            <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />
          </div>
          <h3 className="text-white/60 text-sm">Data Synced</h3>
          <p className="text-3xl font-bold text-white mt-2">2.3TB</p>
          <p className="text-blue-400 text-sm mt-2">Last sync: 2 min ago</p>
        </motion.div>
      </div>

      {/* Integration Health Gauges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
      >
        <h3 className="text-xl font-semibold text-white mb-6">Integration Health</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {integrationHealthData.map((integration, index) => (
            <div key={index} className="text-center">
              <div className="relative w-24 h-24 mx-auto">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="36"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="8"
                    fill="none"
                  />
                  <motion.circle
                    cx="48"
                    cy="48"
                    r="36"
                    stroke={integration.value > 95 ? '#10b981' : integration.value > 90 ? '#f59e0b' : '#ef4444'}
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(integration.value / 100) * 226} 226`}
                    initial={{ strokeDasharray: '0 226' }}
                    animate={{ strokeDasharray: `${(integration.value / 100) * 226} 226` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{integration.value}%</span>
                </div>
              </div>
              <p className="text-white/80 mt-3 text-sm">{integration.name}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">AI-Powered Insights</h3>
          <Cpu className="w-6 h-6 text-purple-400" />
        </div>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
            <div>
              <p className="text-white font-medium">Orders API experiencing higher latency</p>
              <p className="text-white/60 text-sm mt-1">
                Recommendation: Scale up the orders service pods to handle increased load
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <TrendingUp className="w-5 h-5 text-green-400 mt-0.5" />
            <div>
              <p className="text-white font-medium">Authentication API usage increased by 45%</p>
              <p className="text-white/60 text-sm mt-1">
                Pattern detected: New user registrations spike every Tuesday
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <p className="text-white font-medium">Security recommendation</p>
              <p className="text-white/60 text-sm mt-1">
                Enable rate limiting on Analytics API to prevent potential abuse
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const renderAPIsTab = () => (
    <div className="space-y-8">
      {/* API Endpoint Status Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
      >
        <h3 className="text-xl font-semibold text-white mb-6">API Endpoint Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {apiEndpointData.map((endpoint, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white/5 rounded-xl p-4 border border-white/10"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-white font-medium">{endpoint.endpoint}</h4>
                <span className={`w-3 h-3 rounded-full ${
                  endpoint.status === 'healthy' ? 'bg-green-400' :
                  endpoint.status === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
                } ${endpoint.status === 'healthy' ? 'animate-pulse' : ''}`} />
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-white/60">Latency</p>
                  <p className="text-white font-medium">{endpoint.latency}ms</p>
                </div>
                <div>
                  <p className="text-white/60">Requests</p>
                  <p className="text-white font-medium">{endpoint.requests.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-white/60">Errors</p>
                  <p className={`font-medium ${endpoint.errors > 50 ? 'text-red-400' : 'text-white'}`}>
                    {endpoint.errors}
                  </p>
                </div>
                <div>
                  <p className="text-white/60">Success Rate</p>
                  <p className="text-white font-medium">
                    {((1 - endpoint.errors / endpoint.requests) * 100).toFixed(2)}%
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* API Usage Treemap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
      >
        <h3 className="text-xl font-semibold text-white mb-6">API Usage Distribution</h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <Treemap
              data={apiUsageTreemapData}
              dataKey="size"
              aspectRatio={4 / 3}
              stroke="#fff"
              fill="#8884d8"
            >
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-gray-800 p-3 rounded-lg shadow-lg">
                        <p className="text-white font-medium">{payload[0].payload.name}</p>
                        <p className="text-white/80 text-sm">
                          Requests: {payload[0].value?.toLocaleString()}
                        </p>
                        <p className="text-white/60 text-xs">
                          Category: {payload[0].payload.category}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </Treemap>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Rate Limit Indicators */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
      >
        <h3 className="text-xl font-semibold text-white mb-6">Rate Limit Status</h3>
        <div className="space-y-4">
          {rateLimitData.map((api, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">{api.api}</span>
                <span className="text-white/60 text-sm">
                  {api.used} / {api.limit} requests
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <motion.div
                  className={`h-full ${
                    api.percentage > 90 ? 'bg-red-500' :
                    api.percentage > 70 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${api.percentage}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  const renderWebhooksTab = () => (
    <div className="space-y-8">
      {/* Webhook Activity Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
      >
        <h3 className="text-xl font-semibold text-white mb-6">Webhook Activity (24h)</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={webhookActivityData}>
              <defs>
                <linearGradient id="successGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="failedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="time" stroke="rgba(255,255,255,0.6)" />
              <YAxis stroke="rgba(255,255,255,0.6)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(31, 41, 55, 0.8)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                }}
              />
              <Area
                type="monotone"
                dataKey="success"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#successGradient)"
              />
              <Area
                type="monotone"
                dataKey="failed"
                stroke="#ef4444"
                fillOpacity={1}
                fill="url(#failedGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Recent Webhook Events */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
      >
        <h3 className="text-xl font-semibold text-white mb-6">Recent Webhook Events</h3>
        <div className="space-y-3">
          {[
            { event: 'order.created', status: 'delivered', time: '2 min ago', endpoint: 'https://api.example.com/webhooks/orders' },
            { event: 'payment.processed', status: 'delivered', time: '5 min ago', endpoint: 'https://api.example.com/webhooks/payments' },
            { event: 'user.updated', status: 'failed', time: '12 min ago', endpoint: 'https://api.example.com/webhooks/users' },
            { event: 'inventory.low', status: 'delivered', time: '15 min ago', endpoint: 'https://api.example.com/webhooks/inventory' },
            { event: 'subscription.renewed', status: 'pending', time: '18 min ago', endpoint: 'https://api.example.com/webhooks/subscriptions' },
          ].map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white/5 rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-2 h-2 rounded-full ${
                  event.status === 'delivered' ? 'bg-green-400' :
                  event.status === 'pending' ? 'bg-yellow-400' : 'bg-red-400'
                }`} />
                <div>
                  <p className="text-white font-medium">{event.event}</p>
                  <p className="text-white/60 text-sm">{event.endpoint}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-medium ${
                  event.status === 'delivered' ? 'text-green-400' :
                  event.status === 'pending' ? 'text-yellow-400' : 'text-red-400'
                }`}>{event.status}</p>
                <p className="text-white/60 text-xs">{event.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  const renderServicesTab = () => (
    <div className="space-y-8">
      {/* Third-party Service Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
      >
        <h3 className="text-xl font-semibold text-white mb-6">Third-party Service Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {thirdPartyServices.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white/5 rounded-xl p-6 border border-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Cloud className="w-6 h-6 text-blue-400" />
                  <h4 className="text-white font-medium">{service.name}</h4>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  service.status === 'operational' ? 'bg-green-500/20 text-green-400' :
                  service.status === 'degraded' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {service.status}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-white/60">Uptime</p>
                  <p className="text-white font-medium">{service.uptime}%</p>
                </div>
                <div>
                  <p className="text-white/60">Region</p>
                  <p className="text-white font-medium">{service.region}</p>
                </div>
                <div>
                  <p className="text-white/60">Status</p>
                  <p className={`font-medium ${
                    service.status === 'operational' ? 'text-green-400' :
                    service.status === 'degraded' ? 'text-yellow-400' : 'text-blue-400'
                  }`}>
                    {service.status === 'operational' ? 'All Systems Go' :
                     service.status === 'degraded' ? 'Degraded' : 'Maintenance'}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Service Dependencies Graph */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
      >
        <h3 className="text-xl font-semibold text-white mb-6">Service Dependencies</h3>
        <div className="relative h-96 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Central API */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-purple-500/20 rounded-full flex items-center justify-center border-2 border-purple-500"
              >
                <Server className="w-8 h-8 text-purple-400" />
              </motion.div>
              
              {/* Connected Services */}
              {[
                { icon: Database, color: 'blue', label: 'Database', x: -150, y: -100 },
                { icon: Cloud, color: 'green', label: 'Cloud Storage', x: 150, y: -100 },
                { icon: Shield, color: 'yellow', label: 'Auth Service', x: -150, y: 100 },
                { icon: Terminal, color: 'red', label: 'Queue Service', x: 150, y: 100 },
                { icon: Network, color: 'indigo', label: 'CDN', x: 0, y: -150 },
              ].map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  className="absolute"
                  style={{ left: `calc(50% + ${service.x}px)`, top: `calc(50% + ${service.y}px)` }}
                >
                  <div className={`w-16 h-16 bg-${service.color}-500/20 rounded-full flex items-center justify-center border border-${service.color}-500 transform -translate-x-1/2 -translate-y-1/2`}>
                    <service.icon className={`w-6 h-6 text-${service.color}-400`} />
                  </div>
                  <p className="text-white/80 text-xs text-center mt-2">{service.label}</p>
                  {/* Connection Lines */}
                  <svg className="absolute inset-0 pointer-events-none" style={{ width: '200%', height: '200%', left: '-50%', top: '-50%' }}>
                    <motion.line
                      x1="50%"
                      y1="50%"
                      x2={`calc(50% - ${service.x}px)`}
                      y2={`calc(50% - ${service.y}px)`}
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                    />
                  </svg>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const renderSyncTab = () => (
    <div className="space-y-8">
      {/* Data Sync Flow Diagram */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
      >
        <h3 className="text-xl font-semibold text-white mb-6">Data Sync Flow</h3>
        <div className="space-y-4">
          {syncFlowData.map((flow, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-500/20 p-3 rounded-lg">
                    <Database className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-medium">{flow.source}</span>
                    <ChevronRight className="w-4 h-4 text-white/40" />
                    <span className="text-white font-medium">{flow.target}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    flow.status === 'active' ? 'bg-green-500/20 text-green-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {flow.status}
                  </span>
                  <span className="text-white/60 text-sm">
                    {flow.records.toLocaleString()} records/min
                  </span>
                </div>
              </div>
              <div className="mt-3 w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Sync Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
      >
        <h3 className="text-xl font-semibold text-white mb-6">Sync Performance</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={[
                { time: '00:00', throughput: 1234, latency: 23, errors: 2 },
                { time: '04:00', throughput: 2345, latency: 34, errors: 5 },
                { time: '08:00', throughput: 4567, latency: 45, errors: 8 },
                { time: '12:00', throughput: 5678, latency: 56, errors: 3 },
                { time: '16:00', throughput: 4321, latency: 67, errors: 12 },
                { time: '20:00', throughput: 3210, latency: 34, errors: 4 },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="time" stroke="rgba(255,255,255,0.6)" />
              <YAxis yAxisId="left" stroke="rgba(255,255,255,0.6)" />
              <YAxis yAxisId="right" orientation="right" stroke="rgba(255,255,255,0.6)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(31, 41, 55, 0.8)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                }}
              />
              <Bar yAxisId="left" dataKey="throughput" fill="#8b5cf6" />
              <Line yAxisId="right" type="monotone" dataKey="latency" stroke="#10b981" />
              <Line yAxisId="right" type="monotone" dataKey="errors" stroke="#ef4444" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Data Sync Flow Sankey Diagram */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
      >
        <h3 className="text-xl font-semibold text-white mb-6">Data Flow Volume</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <Sankey
              data={{
                nodes: [
                  { name: 'Application' },
                  { name: 'Database' },
                  { name: 'Cache' },
                  { name: 'API' },
                  { name: 'Webhook' },
                  { name: 'Queue' }
                ],
                links: [
                  { source: 0, target: 1, value: 10 },
                  { source: 0, target: 2, value: 5 },
                  { source: 0, target: 3, value: 8 },
                  { source: 3, target: 4, value: 4 },
                  { source: 3, target: 5, value: 4 },
                  { source: 1, target: 2, value: 6 }
                ]
              }}
              link={{ stroke: '#8b5cf6' }}
            >
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(31, 41, 55, 0.8)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                }}
              />
            </Sankey>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
      >
        <h3 className="text-xl font-semibold text-white mb-6">Integration Settings</h3>
        <div className="space-y-6">
          {/* API Configuration */}
          <div>
            <h4 className="text-white font-medium mb-4">API Configuration</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white/80">Enable Rate Limiting</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/80">API Key Rotation</span>
                <button className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors">
                  Rotate Keys
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/80">CORS Settings</span>
                <button className="px-4 py-2 bg-white/10 text-white/80 rounded-lg hover:bg-white/20 transition-colors">
                  Configure
                </button>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div>
            <h4 className="text-white font-medium mb-4">Security</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Lock className="w-5 h-5 text-green-400" />
                  <span className="text-white/80">SSL/TLS Encryption</span>
                </div>
                <span className="text-green-400 text-sm">Enabled</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-blue-400" />
                  <span className="text-white/80">OAuth 2.0</span>
                </div>
                <span className="text-blue-400 text-sm">Configured</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  <span className="text-white/80">IP Whitelisting</span>
                </div>
                <button className="px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-colors">
                  Setup
                </button>
              </div>
            </div>
          </div>

          {/* Webhook Configuration */}
          <div>
            <h4 className="text-white font-medium mb-4">Webhook Configuration</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white/80">Retry Failed Webhooks</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/80">Max Retry Attempts</span>
                <select className="bg-white/10 text-white px-3 py-1 rounded-lg border border-white/20">
                  <option>3 attempts</option>
                  <option>5 attempts</option>
                  <option>10 attempts</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/80">Webhook Secret</span>
                <button className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors">
                  Regenerate
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'Overview':
        return renderOverviewTab();
      case 'APIs':
        return renderAPIsTab();
      case 'Webhooks':
        return renderWebhooksTab();
      case 'Services':
        return renderServicesTab();
      case 'Sync':
        return renderSyncTab();
      case 'Settings':
        return renderSettingsTab();
      default:
        return renderOverviewTab();
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900" />
        <motion.div
          className="absolute -top-48 -left-48 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 -right-48 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-48 left-1/2 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Integration Platform</h1>
          <p className="text-lg text-white/60">
            Connect, monitor, and manage all your integrations in one place
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex space-x-1 bg-white/10 backdrop-blur-lg rounded-xl p-1">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  px-6 py-3 rounded-lg font-medium transition-all duration-200
                  ${activeTab === tab
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                {tab}
              </button>
            ))}
          </div>
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
      </div>
    </div>
  );
}