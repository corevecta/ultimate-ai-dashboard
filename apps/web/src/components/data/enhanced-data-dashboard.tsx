'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie,
  RadarChart, Radar, Treemap, RadialBarChart, RadialBar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Cell, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts'
import {
  Database, GitBranch, Activity, Zap, Server, Shield,
  TrendingUp, AlertCircle, CheckCircle, Clock, Cpu,
  HardDrive, Network, BarChart3, Layers, Workflow,
  BrainCircuit, Sparkles, FlaskConical, Gauge
} from 'lucide-react'

// Types
interface TabItem {
  id: string
  label: string
  icon: React.ReactNode
}

interface DataPoint {
  name: string
  value: number
  category?: string
  status?: string
}

interface PipelineNode {
  id: string
  name: string
  status: 'running' | 'completed' | 'failed' | 'pending'
  duration?: number
  data?: number
}

// Mock data generators
const generateTimeSeriesData = (points: number = 24) => {
  return Array.from({ length: points }, (_, i) => ({
    time: `${i}:00`,
    ingestion: Math.floor(Math.random() * 1000) + 500,
    processing: Math.floor(Math.random() * 800) + 300,
    storage: Math.floor(Math.random() * 600) + 200,
    queries: Math.floor(Math.random() * 400) + 100
  }))
}

const generateDatabaseMetrics = () => [
  { name: 'PostgreSQL', cpu: 65, memory: 78, connections: 145, queries: 2340 },
  { name: 'MongoDB', cpu: 45, memory: 56, connections: 89, queries: 1567 },
  { name: 'Redis', cpu: 25, memory: 32, connections: 234, queries: 5678 },
  { name: 'Elasticsearch', cpu: 72, memory: 85, connections: 67, queries: 890 }
]

const generateDataQuality = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`)
  const data: any[] = []
  
  days.forEach((day, dayIndex) => {
    hours.forEach((hour, hourIndex) => {
      data.push({
        day: dayIndex,
        hour: hourIndex,
        value: Math.floor(Math.random() * 100),
        dayName: day,
        hourName: hour
      })
    })
  })
  
  return data
}

const generateStorageData = () => [
  { name: 'Raw Data', size: 2400, children: [
    { name: 'Logs', size: 800 },
    { name: 'Events', size: 600 },
    { name: 'Metrics', size: 1000 }
  ]},
  { name: 'Processed', size: 1800, children: [
    { name: 'Aggregated', size: 900 },
    { name: 'Filtered', size: 500 },
    { name: 'Transformed', size: 400 }
  ]},
  { name: 'Archives', size: 1200, children: [
    { name: 'Cold Storage', size: 800 },
    { name: 'Backups', size: 400 }
  ]},
  { name: 'Cache', size: 600 }
]

const generatePipelineData = (): PipelineNode[] => [
  { id: '1', name: 'Data Ingestion', status: 'completed', duration: 120, data: 1250 },
  { id: '2', name: 'Validation', status: 'completed', duration: 45, data: 1230 },
  { id: '3', name: 'Transformation', status: 'running', duration: 180, data: 1100 },
  { id: '4', name: 'Enrichment', status: 'pending', data: 0 },
  { id: '5', name: 'Storage', status: 'pending', data: 0 }
]

const COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#6366F1', '#14B8A6']

const tabs: TabItem[] = [
  { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
  { id: 'pipelines', label: 'Pipelines', icon: <Workflow className="w-4 h-4" /> },
  { id: 'databases', label: 'Databases', icon: <Database className="w-4 h-4" /> },
  { id: 'quality', label: 'Quality', icon: <Shield className="w-4 h-4" /> },
  { id: 'lineage', label: 'Lineage', icon: <GitBranch className="w-4 h-4" /> },
  { id: 'analytics', label: 'Analytics', icon: <BrainCircuit className="w-4 h-4" /> }
]

export default function EnhancedDataDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [timeSeriesData, setTimeSeriesData] = useState(generateTimeSeriesData())
  const [streamingData, setStreamingData] = useState<number[]>([])
  const [pipelineNodes, setPipelineNodes] = useState(generatePipelineData())

  // Simulate real-time data streaming
  useEffect(() => {
    const interval = setInterval(() => {
      setStreamingData(prev => {
        const newData = [...prev, Math.floor(Math.random() * 100) + 50]
        return newData.slice(-20)
      })
      
      // Update time series data
      setTimeSeriesData(prev => {
        const newPoint = {
          time: new Date().toLocaleTimeString(),
          ingestion: Math.floor(Math.random() * 1000) + 500,
          processing: Math.floor(Math.random() * 800) + 300,
          storage: Math.floor(Math.random() * 600) + 200,
          queries: Math.floor(Math.random() * 400) + 100
        }
        return [...prev.slice(1), newPoint]
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const renderOverview = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Data Flow Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
      >
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-purple-400" />
          Data Flow Metrics
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={timeSeriesData}>
            <defs>
              <linearGradient id="colorIngestion" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorProcessing" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="time" stroke="#ffffff80" />
            <YAxis stroke="#ffffff80" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0,0,0,0.8)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px'
              }}
            />
            <Area
              type="monotone"
              dataKey="ingestion"
              stroke="#8B5CF6"
              fillOpacity={1}
              fill="url(#colorIngestion)"
            />
            <Area
              type="monotone"
              dataKey="processing"
              stroke="#3B82F6"
              fillOpacity={1}
              fill="url(#colorProcessing)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Storage Utilization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
      >
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <HardDrive className="w-5 h-5 text-blue-400" />
          Storage Utilization
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <Treemap
            data={generateStorageData()}
            dataKey="size"
            aspectRatio={4/3}
            stroke="#fff"
            fill="#8B5CF6"
          >
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0,0,0,0.8)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px'
              }}
            />
          </Treemap>
        </ResponsiveContainer>
      </motion.div>

      {/* Real-time Streaming */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
      >
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          Real-time Data Stream
        </h3>
        <div className="h-[100px] relative overflow-hidden">
          <div className="absolute inset-0 flex items-end justify-between gap-1">
            {streamingData.map((value, index) => (
              <motion.div
                key={index}
                initial={{ height: 0 }}
                animate={{ height: `${value}%` }}
                exit={{ height: 0 }}
                className="flex-1 bg-gradient-to-t from-purple-600 to-pink-600 rounded-t"
              />
            ))}
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-gray-400">Throughput</span>
          <span className="text-2xl font-bold">
            {streamingData[streamingData.length - 1] || 0} MB/s
          </span>
        </div>
      </motion.div>

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
      >
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-pink-400" />
          AI-Powered Insights
        </h3>
        <div className="space-y-3">
          <div className="p-3 bg-purple-500/20 rounded-lg border border-purple-500/30">
            <p className="text-sm">🎯 Data ingestion peak detected at 14:00-16:00. Consider scaling resources.</p>
          </div>
          <div className="p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
            <p className="text-sm">⚡ Query performance improved by 23% after index optimization.</p>
          </div>
          <div className="p-3 bg-green-500/20 rounded-lg border border-green-500/30">
            <p className="text-sm">✨ 98.5% data quality score - exceeding target by 3.5%.</p>
          </div>
        </div>
      </motion.div>
    </div>
  )

  const renderPipelines = () => (
    <div className="space-y-6">
      {/* Pipeline Flow Diagram */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
      >
        <h3 className="text-xl font-semibold mb-6">Data Pipeline Flow</h3>
        <div className="relative">
          <div className="flex items-center justify-between">
            {pipelineNodes.map((node, index) => (
              <React.Fragment key={node.id}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <div className={`
                    w-32 h-32 rounded-xl flex flex-col items-center justify-center
                    ${node.status === 'completed' ? 'bg-green-500/20 border-green-500/50' : ''}
                    ${node.status === 'running' ? 'bg-blue-500/20 border-blue-500/50' : ''}
                    ${node.status === 'failed' ? 'bg-red-500/20 border-red-500/50' : ''}
                    ${node.status === 'pending' ? 'bg-gray-500/20 border-gray-500/50' : ''}
                    border-2 backdrop-blur-sm
                  `}>
                    <div className="text-center">
                      <p className="text-sm font-medium">{node.name}</p>
                      {node.data && node.data > 0 && (
                        <p className="text-xs text-gray-400 mt-1">{node.data} records</p>
                      )}
                      {node.duration && (
                        <p className="text-xs text-gray-400">{node.duration}s</p>
                      )}
                    </div>
                    {node.status === 'running' && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-2 -right-2"
                      >
                        <Activity className="w-6 h-6 text-blue-400" />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
                {index < pipelineNodes.length - 1 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: index * 0.1 + 0.1 }}
                    className="flex-1 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 origin-left"
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ETL Job Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
      >
        <h3 className="text-xl font-semibold mb-4">ETL Job Timeline</h3>
        <div className="space-y-3">
          {['Data Import Job', 'Transform Job', 'Validation Job', 'Export Job'].map((job, index) => (
            <div key={job} className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{job}</span>
                <span className="text-xs text-gray-400">
                  {index === 1 ? 'Running' : index < 1 ? 'Completed' : 'Scheduled'}
                </span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: index === 1 ? '60%' : index < 1 ? '100%' : '0%' }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                  className={`h-full rounded-full ${
                    index === 1 ? 'bg-blue-500' : index < 1 ? 'bg-green-500' : 'bg-gray-600'
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )

  const renderDatabases = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Database Performance Gauges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
      >
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Gauge className="w-5 h-5 text-purple-400" />
          Performance Metrics
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {generateDatabaseMetrics().map((db, index) => (
            <div key={db.name} className="text-center">
              <h4 className="text-sm font-medium mb-2">{db.name}</h4>
              <ResponsiveContainer width="100%" height={120}>
                <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="90%" data={[
                  { name: 'CPU', value: db.cpu, fill: COLORS[index * 2] },
                  { name: 'Memory', value: db.memory, fill: COLORS[index * 2 + 1] }
                ]}>
                  <RadialBar dataKey="value" cornerRadius={10} />
                  <Tooltip />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-2 text-xs">
                <span>CPU: {db.cpu}%</span>
                <span>Mem: {db.memory}%</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Query Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
      >
        <h3 className="text-xl font-semibold mb-4">Query Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={[
            { query: 'SELECT users', time: 23, count: 1234 },
            { query: 'JOIN orders', time: 45, count: 856 },
            { query: 'AGG sales', time: 67, count: 432 },
            { query: 'UPDATE inv', time: 12, count: 2341 },
            { query: 'DELETE old', time: 34, count: 123 }
          ]}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="query" stroke="#ffffff80" />
            <YAxis stroke="#ffffff80" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0,0,0,0.8)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="time" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Connection Pool Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 lg:col-span-2"
      >
        <h3 className="text-xl font-semibold mb-4">Connection Pool Status</h3>
        <div className="grid grid-cols-4 gap-4">
          {generateDatabaseMetrics().map((db) => (
            <div key={db.name} className="text-center">
              <h4 className="text-sm font-medium mb-3">{db.name}</h4>
              <div className="relative w-24 h-24 mx-auto">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="36"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-gray-700"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="36"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(db.connections / 300) * 226} 226`}
                    className="text-purple-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold">{db.connections}</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2">Active Connections</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )

  const renderQuality = () => (
    <div className="space-y-6">
      {/* Data Quality Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
      >
        <h3 className="text-xl font-semibold mb-4">Data Quality Heatmap</h3>
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-25 gap-1">
              <div className="col-span-1"></div>
              {Array.from({ length: 24 }, (_, i) => (
                <div key={i} className="text-xs text-center text-gray-400">
                  {i}
                </div>
              ))}
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, dayIndex) => (
                <React.Fragment key={day}>
                  <div className="text-xs text-gray-400 pr-2">{day}</div>
                  {Array.from({ length: 24 }, (_, hourIndex) => {
                    const quality = Math.floor(Math.random() * 100)
                    const opacity = quality / 100
                    return (
                      <motion.div
                        key={`${dayIndex}-${hourIndex}`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: (dayIndex * 24 + hourIndex) * 0.001 }}
                        className="aspect-square rounded"
                        style={{
                          backgroundColor: quality > 80 ? `rgba(16, 185, 129, ${opacity})` :
                                         quality > 60 ? `rgba(251, 191, 36, ${opacity})` :
                                         `rgba(239, 68, 68, ${opacity})`
                        }}
                        title={`${day} ${hourIndex}:00 - Quality: ${quality}%`}
                      />
                    )
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Excellent (80-100%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span>Good (60-80%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>Poor (&lt;60%)</span>
          </div>
        </div>
      </motion.div>

      {/* Data Validation Results */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
      >
        <h3 className="text-xl font-semibold mb-4">Validation Results</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-500/20 rounded-lg p-4 border border-green-500/30">
            <CheckCircle className="w-8 h-8 text-green-400 mb-2" />
            <p className="text-2xl font-bold">94.2%</p>
            <p className="text-sm text-gray-400">Schema Compliance</p>
          </div>
          <div className="bg-yellow-500/20 rounded-lg p-4 border border-yellow-500/30">
            <AlertCircle className="w-8 h-8 text-yellow-400 mb-2" />
            <p className="text-2xl font-bold">5.3%</p>
            <p className="text-sm text-gray-400">Data Anomalies</p>
          </div>
          <div className="bg-purple-500/20 rounded-lg p-4 border border-purple-500/30">
            <Shield className="w-8 h-8 text-purple-400 mb-2" />
            <p className="text-2xl font-bold">99.8%</p>
            <p className="text-sm text-gray-400">Integrity Score</p>
          </div>
        </div>
      </motion.div>
    </div>
  )

  const renderLineage = () => (
    <div className="space-y-6">
      {/* Data Lineage Graph */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
      >
        <h3 className="text-xl font-semibold mb-6">Data Lineage Graph</h3>
        <div className="relative h-[400px]">
          <svg className="w-full h-full">
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill="#8B5CF6"
                />
              </marker>
            </defs>
            
            {/* Connections */}
            <line x1="100" y1="100" x2="300" y2="100" stroke="#8B5CF6" strokeWidth="2" markerEnd="url(#arrowhead)" />
            <line x1="400" y1="100" x2="600" y2="100" stroke="#8B5CF6" strokeWidth="2" markerEnd="url(#arrowhead)" />
            <line x1="300" y1="200" x2="400" y2="100" stroke="#3B82F6" strokeWidth="2" markerEnd="url(#arrowhead)" />
            <line x1="400" y1="100" x2="500" y2="200" stroke="#10B981" strokeWidth="2" markerEnd="url(#arrowhead)" />
            <line x1="700" y1="100" x2="800" y2="200" stroke="#F59E0B" strokeWidth="2" markerEnd="url(#arrowhead)" />
            
            {/* Nodes */}
            <g transform="translate(50, 50)">
              <rect width="100" height="100" rx="10" fill="#8B5CF6" fillOpacity="0.2" stroke="#8B5CF6" strokeWidth="2" />
              <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="14">
                Source DB
              </text>
            </g>
            
            <g transform="translate(250, 50)">
              <rect width="100" height="100" rx="10" fill="#3B82F6" fillOpacity="0.2" stroke="#3B82F6" strokeWidth="2" />
              <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="14">
                ETL Process
              </text>
            </g>
            
            <g transform="translate(450, 50)">
              <rect width="100" height="100" rx="10" fill="#10B981" fillOpacity="0.2" stroke="#10B981" strokeWidth="2" />
              <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="14">
                Transform
              </text>
            </g>
            
            <g transform="translate(650, 50)">
              <rect width="100" height="100" rx="10" fill="#F59E0B" fillOpacity="0.2" stroke="#F59E0B" strokeWidth="2" />
              <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="14">
                Data Lake
              </text>
            </g>
            
            <g transform="translate(250, 150)">
              <rect width="100" height="100" rx="10" fill="#EC4899" fillOpacity="0.2" stroke="#EC4899" strokeWidth="2" />
              <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="14">
                API Feed
              </text>
            </g>
            
            <g transform="translate(450, 150)">
              <rect width="100" height="100" rx="10" fill="#6366F1" fillOpacity="0.2" stroke="#6366F1" strokeWidth="2" />
              <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="14">
                Analytics
              </text>
            </g>
            
            <g transform="translate(750, 150)">
              <rect width="100" height="100" rx="10" fill="#14B8A6" fillOpacity="0.2" stroke="#14B8A6" strokeWidth="2" />
              <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="14">
                Dashboard
              </text>
            </g>
          </svg>
        </div>
      </motion.div>

      {/* Impact Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
      >
        <h3 className="text-xl font-semibold mb-4">Impact Analysis</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-purple-500/20 rounded-lg">
            <div>
              <p className="font-medium">Customer Table Update</p>
              <p className="text-sm text-gray-400">12 downstream dependencies</p>
            </div>
            <span className="text-purple-400">High Impact</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-blue-500/20 rounded-lg">
            <div>
              <p className="font-medium">Product Catalog Refresh</p>
              <p className="text-sm text-gray-400">5 downstream dependencies</p>
            </div>
            <span className="text-blue-400">Medium Impact</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-500/20 rounded-lg">
            <div>
              <p className="font-medium">Log Archive Process</p>
              <p className="text-sm text-gray-400">2 downstream dependencies</p>
            </div>
            <span className="text-green-400">Low Impact</span>
          </div>
        </div>
      </motion.div>
    </div>
  )

  const renderAnalytics = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Predictive Analytics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
      >
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-400" />
          Predictive Analytics
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={[
            { time: 'Jan', actual: 4000, predicted: 4100 },
            { time: 'Feb', actual: 3000, predicted: 3200 },
            { time: 'Mar', actual: 5000, predicted: 4900 },
            { time: 'Apr', actual: 2780, predicted: 2800 },
            { time: 'May', actual: 5890, predicted: 5900 },
            { time: 'Jun', predicted: 6200 },
            { time: 'Jul', predicted: 6800 },
            { time: 'Aug', predicted: 7200 }
          ]}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="time" stroke="#ffffff80" />
            <YAxis stroke="#ffffff80" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0,0,0,0.8)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="actual" stroke="#10B981" strokeWidth={2} />
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#8B5CF6"
              strokeWidth={2}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Data Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
      >
        <h3 className="text-xl font-semibold mb-4">Data Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={[
                { name: 'Structured', value: 45 },
                { name: 'Semi-structured', value: 30 },
                { name: 'Unstructured', value: 25 }
              ]}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {COLORS.map((color, index) => (
                <Cell key={`cell-${index}`} fill={color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>

      {/* AI Optimization Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 lg:col-span-2"
      >
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-purple-400" />
          AI Optimization Recommendations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <FlaskConical className="w-4 h-4" />
              Query Optimization
            </h4>
            <p className="text-sm text-gray-300 mb-3">
              Implement query caching for top 20 frequently accessed datasets
            </p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-400">+45% Performance</span>
              <button className="px-3 py-1 bg-purple-500/30 rounded-lg hover:bg-purple-500/40 transition-colors">
                Apply
              </button>
            </div>
          </div>
          
          <div className="p-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg border border-blue-500/30">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              Resource Scaling
            </h4>
            <p className="text-sm text-gray-300 mb-3">
              Auto-scale compute resources during peak hours (2PM-5PM)
            </p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-400">-30% Cost</span>
              <button className="px-3 py-1 bg-blue-500/30 rounded-lg hover:bg-blue-500/40 transition-colors">
                Configure
              </button>
            </div>
          </div>
          
          <div className="p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg border border-green-500/30">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Network className="w-4 h-4" />
              Data Partitioning
            </h4>
            <p className="text-sm text-gray-300 mb-3">
              Partition large tables by date for faster time-based queries
            </p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-400">+60% Speed</span>
              <button className="px-3 py-1 bg-green-500/30 rounded-lg hover:bg-green-500/40 transition-colors">
                Implement
              </button>
            </div>
          </div>
          
          <div className="p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-500/30">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <HardDrive className="w-4 h-4" />
              Compression Strategy
            </h4>
            <p className="text-sm text-gray-300 mb-3">
              Enable columnar compression for analytical workloads
            </p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-yellow-400">-40% Storage</span>
              <button className="px-3 py-1 bg-yellow-500/30 rounded-lg hover:bg-yellow-500/40 transition-colors">
                Enable
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview()
      case 'pipelines':
        return renderPipelines()
      case 'databases':
        return renderDatabases()
      case 'quality':
        return renderQuality()
      case 'lineage':
        return renderLineage()
      case 'analytics':
        return renderAnalytics()
      default:
        return renderOverview()
    }
  }

  return (
    <div className="relative overflow-hidden text-white">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900" />
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
          className="absolute -top-48 -left-48 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-48 -right-48 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Data Intelligence Dashboard
          </h1>
          <p className="text-gray-400">Real-time insights and analytics for your data infrastructure</p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2 p-2 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all
                  ${activeTab === tab.id 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25' 
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                {tab.icon}
                {tab.label}
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
  )
}