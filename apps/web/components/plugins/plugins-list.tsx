'use client'

import { motion } from 'framer-motion'
import { 
  Puzzle, 
  Star, 
  Download,
  Settings,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Activity,
  Database,
  Cpu,
  BarChart3,
  Link2,
  Zap,
  Shield,
  Globe
} from 'lucide-react'
import { useState } from 'react'
import { PluginDetailsDialog } from './plugin-details-dialog'

const pluginCategories = {
  data: { icon: Database, color: 'from-green-500 to-emerald-600' },
  ai: { icon: Cpu, color: 'from-blue-500 to-cyan-600' },
  integration: { icon: Link2, color: 'from-purple-500 to-pink-600' },
  analytics: { icon: BarChart3, color: 'from-orange-500 to-red-600' },
  utility: { icon: Zap, color: 'from-indigo-500 to-purple-600' }
}

const plugins = [
  {
    id: 'data-transformer-pro',
    name: 'Data Transformer Pro',
    category: 'data',
    version: '2.4.1',
    author: 'DataTech Labs',
    description: 'Advanced data transformation and processing pipeline',
    status: 'active',
    rating: 4.9,
    downloads: 3420,
    size: '12.4MB',
    features: ['CSV/JSON Processing', 'Data Validation', 'Schema Mapping', 'Batch Processing'],
    lastUpdated: '2 days ago'
  },
  {
    id: 'gpt-4-connector',
    name: 'GPT-4 Connector',
    category: 'ai',
    version: '1.8.0',
    author: 'AI Solutions Inc',
    description: 'Seamless integration with OpenAI GPT-4 models',
    status: 'active',
    rating: 4.8,
    downloads: 5230,
    size: '8.2MB',
    features: ['Model Selection', 'Token Management', 'Response Caching', 'Error Handling'],
    lastUpdated: '1 week ago'
  },
  {
    id: 'slack-integration',
    name: 'Slack Integration',
    category: 'integration',
    version: '3.2.0',
    author: 'CollabTools',
    description: 'Connect your AI workflows with Slack workspaces',
    status: 'update-available',
    rating: 4.7,
    downloads: 2890,
    size: '6.8MB',
    features: ['Real-time Notifications', 'Command Interface', 'File Sharing', 'Thread Management'],
    lastUpdated: '3 weeks ago'
  },
  {
    id: 'analytics-dashboard',
    name: 'Analytics Dashboard',
    category: 'analytics',
    version: '2.0.1',
    author: 'MetricsMaster',
    description: 'Comprehensive analytics and reporting suite',
    status: 'active',
    rating: 4.6,
    downloads: 1850,
    size: '15.6MB',
    features: ['Custom Reports', 'Real-time Metrics', 'Data Visualization', 'Export Options'],
    lastUpdated: '5 days ago'
  },
  {
    id: 'api-rate-limiter',
    name: 'API Rate Limiter',
    category: 'utility',
    version: '1.2.3',
    author: 'DevTools Pro',
    description: 'Intelligent API rate limiting and quota management',
    status: 'active',
    rating: 4.5,
    downloads: 980,
    size: '3.2MB',
    features: ['Dynamic Limits', 'Quota Tracking', 'Alert System', 'Performance Optimization'],
    lastUpdated: '2 weeks ago'
  }
]

export function PluginsList() {
  const [expandedPlugin, setExpandedPlugin] = useState<string | null>(null)
  const [selectedPlugin, setSelectedPlugin] = useState<any>(null)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400'
      case 'update-available': return 'text-yellow-400'
      case 'inactive': return 'text-gray-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active'
      case 'update-available': return 'Update Available'
      case 'inactive': return 'Inactive'
      default: return status
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Installed Plugins</h3>
        <div className="flex items-center gap-4">
          <button className="text-sm text-gray-400 hover:text-white transition-colors">
            Sort by: Recently Updated
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {plugins.map((plugin, index) => {
          const PluginIcon = pluginCategories[plugin.category as keyof typeof pluginCategories].icon
          const gradientColor = pluginCategories[plugin.category as keyof typeof pluginCategories].color
          
          return (
            <motion.div
              key={plugin.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              {/* Glow effect */}
              <div
                className={`absolute -inset-1 bg-gradient-to-r ${gradientColor} rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity`}
              />
              
              {/* Card */}
              <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-white/20 transition-all overflow-hidden">
                {/* Main content */}
                <div className="p-6">
                  <div 
                    className="flex items-start justify-between mb-4 cursor-pointer"
                    onClick={() => {
                      setSelectedPlugin(plugin)
                      setDetailsDialogOpen(true)
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${gradientColor} opacity-20`}>
                        <PluginIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-white">{plugin.name}</h4>
                        <p className="text-sm text-gray-400 mt-1">{plugin.description}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-sm text-gray-500">v{plugin.version}</span>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-500">by {plugin.author}</span>
                          <span className="text-sm text-gray-500">•</span>
                          <span className={`text-sm ${getStatusColor(plugin.status)}`}>
                            {getStatusText(plugin.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {plugin.status === 'update-available' && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-1.5 rounded-lg bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-sm hover:bg-yellow-500/30 transition-all"
                        >
                          Update
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        <Settings className="w-5 h-5 text-gray-400" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        <Trash2 className="w-5 h-5 text-gray-400" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {plugin.features.map((feature) => (
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
                        <Star className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-400">Rating</span>
                      </div>
                      <p className="text-lg font-semibold text-white">{plugin.rating}</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Download className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-400">Downloads</span>
                      </div>
                      <p className="text-lg font-semibold text-white">{plugin.downloads.toLocaleString()}</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Database className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-400">Size</span>
                      </div>
                      <p className="text-lg font-semibold text-white">{plugin.size}</p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Activity className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-400">Updated</span>
                      </div>
                      <p className="text-lg font-semibold text-white">{plugin.lastUpdated}</p>
                    </div>
                  </div>

                  {/* Expand button */}
                  <motion.button
                    onClick={() => setExpandedPlugin(expandedPlugin === plugin.id ? null : plugin.id)}
                    className="mt-4 w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-gray-300 hover:text-white transition-all"
                  >
                    {expandedPlugin === plugin.id ? 'Show Less' : 'Show More'}
                  </motion.button>
                </div>

                {/* Expanded content */}
                {expandedPlugin === plugin.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-white/10 p-6 bg-black/20"
                  >
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h5 className="text-sm font-medium text-gray-400 mb-3">Plugin Details</h5>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Shield className="w-4 h-4 text-green-400" />
                            <span className="text-gray-300">Verified Publisher</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Globe className="w-4 h-4 text-blue-400" />
                            <span className="text-gray-300">Compatible with all regions</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                            <span className="text-gray-300">Auto-updates enabled</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-medium text-gray-400 mb-3">Resource Usage</h5>
                        <div className="space-y-3">
                          {[
                            { name: 'CPU Usage', value: 15 },
                            { name: 'Memory', value: 28 },
                            { name: 'Network', value: 42 }
                          ].map((metric) => (
                            <div key={metric.name} className="space-y-1">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400">{metric.name}</span>
                                <span className="text-white">{metric.value}%</span>
                              </div>
                              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                <motion.div
                                  className={`h-full bg-gradient-to-r ${gradientColor}`}
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
          )
        })}
      </div>

      {/* Plugin Details Dialog */}
      <PluginDetailsDialog 
        isOpen={detailsDialogOpen}
        onClose={() => {
          setDetailsDialogOpen(false)
          setSelectedPlugin(null)
        }}
        plugin={selectedPlugin}
      />
    </div>
  )
}