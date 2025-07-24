'use client'

import { motion } from 'framer-motion'
import { 
  Globe, 
  Shield, 
  Zap, 
  Database,
  Settings,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Activity,
  Code2,
  RefreshCw
} from 'lucide-react'
import { useState } from 'react'
import { MCPServerConfigDialog } from './mcp-server-config-dialog'

const servers = [
  {
    id: 'api-gateway',
    name: 'API Gateway Server',
    type: 'REST API',
    status: 'active',
    endpoint: 'https://api.example.com',
    version: 'v2.4.1',
    requests: '2.4M/day',
    latency: '45ms',
    uptime: 99.99,
    gradient: 'from-cyan-500 to-blue-600',
    features: ['Authentication', 'Rate Limiting', 'Caching', 'Analytics']
  },
  {
    id: 'graphql-server',
    name: 'GraphQL Server',
    type: 'GraphQL',
    status: 'active',
    endpoint: 'https://graphql.example.com',
    version: 'v1.8.3',
    requests: '1.2M/day',
    latency: '68ms',
    uptime: 99.97,
    gradient: 'from-purple-500 to-pink-600',
    features: ['Subscriptions', 'Schema Stitching', 'Query Batching', 'Persisted Queries']
  },
  {
    id: 'websocket-server',
    name: 'WebSocket Server',
    type: 'WebSocket',
    status: 'active',
    endpoint: 'wss://ws.example.com',
    version: 'v3.0.2',
    requests: '500K/day',
    latency: '12ms',
    uptime: 99.95,
    gradient: 'from-green-500 to-emerald-600',
    features: ['Real-time Updates', 'Binary Support', 'Connection Pooling', 'Auto-reconnect']
  },
  {
    id: 'grpc-server',
    name: 'gRPC Server',
    type: 'gRPC',
    status: 'maintenance',
    endpoint: 'grpc.example.com:50051',
    version: 'v2.1.0',
    requests: '300K/day',
    latency: '28ms',
    uptime: 99.90,
    gradient: 'from-orange-500 to-red-600',
    features: ['Streaming', 'Protocol Buffers', 'Service Mesh', 'Load Balancing']
  }
]

export function MCPServersList() {
  const [expandedServer, setExpandedServer] = useState<string | null>(null)
  const [editingServer, setEditingServer] = useState<any>(null)
  const [configDialogOpen, setConfigDialogOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">MCP Servers</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Auto-refresh</span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
          >
            <RefreshCw className="w-4 h-4 text-gray-400" />
          </motion.button>
        </div>
      </div>
      
      <div className="space-y-4">
        {servers.map((server, index) => (
          <motion.div
            key={server.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative group"
          >
            {/* Glow effect */}
            <div
              className={`absolute -inset-1 bg-gradient-to-r ${server.gradient} rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity`}
            />
            
            {/* Card */}
            <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-white/20 transition-all overflow-hidden">
              {/* Main content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${server.gradient} opacity-20`}>
                      <Code2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-white">{server.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <div className={`w-2 h-2 rounded-full ${
                          server.status === 'active' ? 'bg-green-500' : 
                          server.status === 'maintenance' ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
                        <span className="text-sm text-gray-400 capitalize">{server.status}</span>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-400">{server.type}</span>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-400">{server.version}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setEditingServer(server)
                        setConfigDialogOpen(true)
                      }}
                      className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <Settings className="w-5 h-5 text-gray-400" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <ExternalLink className="w-5 h-5 text-gray-400" />
                    </motion.button>
                  </div>
                </div>

                {/* Endpoint */}
                <div className="mb-4 p-3 rounded-lg bg-black/30 border border-white/5">
                  <code className="text-sm text-gray-300">{server.endpoint}</code>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {server.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-400">Requests</span>
                    </div>
                    <p className="text-lg font-semibold text-white">{server.requests}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Activity className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-400">Latency</span>
                    </div>
                    <p className="text-lg font-semibold text-white">{server.latency}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Shield className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-400">Uptime</span>
                    </div>
                    <p className="text-lg font-semibold text-white">{server.uptime}%</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Database className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-400">Memory</span>
                    </div>
                    <p className="text-lg font-semibold text-white">2.4GB</p>
                  </div>
                </div>

                {/* Expand button */}
                <motion.button
                  onClick={() => setExpandedServer(expandedServer === server.id ? null : server.id)}
                  className="mt-4 w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-gray-300 hover:text-white transition-all"
                >
                  {expandedServer === server.id ? 'Show Less' : 'Show More'}
                </motion.button>
              </div>

              {/* Expanded content */}
              {expandedServer === server.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-white/10 p-6 bg-black/20"
                >
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h5 className="text-sm font-medium text-gray-400 mb-3">Recent Events</h5>
                      <div className="space-y-2">
                        {[
                          { event: 'Configuration updated', status: 'success' },
                          { event: 'Health check passed', status: 'success' },
                          { event: 'Rate limit adjusted', status: 'warning' }
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            {item.status === 'success' ? (
                              <CheckCircle2 className="w-4 h-4 text-green-400" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-yellow-400" />
                            )}
                            <span className="text-gray-300">{item.event}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium text-gray-400 mb-3">Performance Metrics</h5>
                      <div className="space-y-3">
                        {[
                          { name: 'CPU Usage', value: 35 },
                          { name: 'Memory Usage', value: 58 },
                          { name: 'Network I/O', value: 42 }
                        ].map((metric) => (
                          <div key={metric.name} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-400">{metric.name}</span>
                              <span className="text-white">{metric.value}%</span>
                            </div>
                            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                              <motion.div
                                className={`h-full bg-gradient-to-r ${server.gradient}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${metric.value}%` }}
                                transition={{ duration: 0.5 }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Configuration Dialog */}
      <MCPServerConfigDialog 
        isOpen={configDialogOpen}
        onClose={() => {
          setConfigDialogOpen(false)
          setEditingServer(null)
        }}
        server={editingServer}
      />
    </div>
  )
}