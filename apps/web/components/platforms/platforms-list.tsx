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
  DollarSign
} from 'lucide-react'
import { useState } from 'react'

const platforms = [
  {
    id: 'aws',
    name: 'Amazon Web Services',
    logo: '🔶',
    status: 'connected',
    region: 'us-east-1',
    services: ['EC2', 'S3', 'Lambda', 'RDS'],
    projects: 67,
    cost: '$1,450/mo',
    health: 99.99,
    gradient: 'from-orange-500 to-yellow-600'
  },
  {
    id: 'gcp',
    name: 'Google Cloud Platform',
    logo: '🔷',
    status: 'connected',
    region: 'us-central1',
    services: ['Compute Engine', 'Storage', 'Cloud Run', 'BigQuery'],
    projects: 45,
    cost: '$980/mo',
    health: 99.98,
    gradient: 'from-blue-500 to-cyan-600'
  },
  {
    id: 'azure',
    name: 'Microsoft Azure',
    logo: '🟦',
    status: 'connected',
    region: 'eastus',
    services: ['VMs', 'Blob Storage', 'Functions', 'SQL Database'],
    projects: 32,
    cost: '$720/mo',
    health: 99.97,
    gradient: 'from-purple-500 to-indigo-600'
  },
  {
    id: 'vercel',
    name: 'Vercel',
    logo: '▲',
    status: 'connected',
    region: 'Global',
    services: ['Edge Functions', 'Hosting', 'Analytics'],
    projects: 12,
    cost: '$90/mo',
    health: 100,
    gradient: 'from-gray-600 to-gray-800'
  }
]

export function PlatformsList() {
  const [expandedPlatform, setExpandedPlatform] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Connected Platforms</h3>
      
      <div className="space-y-4">
        {platforms.map((platform, index) => (
          <motion.div
            key={platform.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative group"
          >
            {/* Glow effect */}
            <div
              className={`absolute -inset-1 bg-gradient-to-r ${platform.gradient} rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity`}
            />
            
            {/* Card */}
            <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-white/20 transition-all overflow-hidden">
              {/* Main content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{platform.logo}</div>
                    <div>
                      <h4 className="text-xl font-semibold text-white">{platform.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-sm text-gray-400">Connected</span>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-400">{platform.region}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
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
                      <ExternalLink className="w-5 h-5 text-gray-400" />
                    </motion.button>
                  </div>
                </div>

                {/* Services */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {platform.services.map((service) => (
                    <span
                      key={service}
                      className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300"
                    >
                      {service}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Database className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-400">Projects</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{platform.projects}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-400">Monthly Cost</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{platform.cost}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Activity className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-400">Health</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{platform.health}%</p>
                  </div>
                </div>

                {/* Expand button */}
                <motion.button
                  onClick={() => setExpandedPlatform(expandedPlatform === platform.id ? null : platform.id)}
                  className="mt-4 w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-gray-300 hover:text-white transition-all"
                >
                  {expandedPlatform === platform.id ? 'Show Less' : 'Show More'}
                </motion.button>
              </div>

              {/* Expanded content */}
              {expandedPlatform === platform.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-white/10 p-6 bg-black/20"
                >
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h5 className="text-sm font-medium text-gray-400 mb-3">Recent Activity</h5>
                      <div className="space-y-2">
                        {['Deployed project-123', 'Updated security rules', 'Scaled instances'].map((activity) => (
                          <div key={activity} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                            <span className="text-gray-300">{activity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium text-gray-400 mb-3">Resource Usage</h5>
                      <div className="space-y-3">
                        {[
                          { name: 'CPU', usage: 68 },
                          { name: 'Memory', usage: 72 },
                          { name: 'Storage', usage: 45 }
                        ].map((resource) => (
                          <div key={resource.name} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-400">{resource.name}</span>
                              <span className="text-white">{resource.usage}%</span>
                            </div>
                            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                              <motion.div
                                className={`h-full bg-gradient-to-r ${platform.gradient}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${resource.usage}%` }}
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
    </div>
  )
}