'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { 
  Rocket, 
  CheckCircle2, 
  XCircle, 
  Clock,
  GitBranch,
  User,
  Calendar,
  TrendingUp,
  AlertTriangle,
  MoreVertical,
  ExternalLink,
  RotateCcw
} from 'lucide-react'
import { useState } from 'react'

const deployments = [
  {
    id: '1',
    commit: 'feat: Add AI-powered recommendations',
    branch: 'main',
    environment: 'production',
    status: 'success',
    author: 'Sarah Chen',
    timestamp: '5 minutes ago',
    duration: '2m 34s',
    metrics: { builds: 12, tests: 248, coverage: 94 }
  },
  {
    id: '2',
    commit: 'fix: Memory leak in data processing',
    branch: 'hotfix/memory-leak',
    environment: 'staging',
    status: 'running',
    author: 'Alex Rivera',
    timestamp: '12 minutes ago',
    duration: '1m 12s',
    progress: 45
  },
  {
    id: '3',
    commit: 'chore: Update dependencies',
    branch: 'feature/upgrade',
    environment: 'development',
    status: 'failed',
    author: 'Jamie Kim',
    timestamp: '1 hour ago',
    duration: '3m 45s',
    error: 'Build failed: Module not found'
  }
]

const statusConfig = {
  success: {
    icon: CheckCircle2,
    color: 'text-green-500',
    bg: 'bg-green-500/20',
    label: 'Deployed'
  },
  running: {
    icon: Clock,
    color: 'text-blue-500',
    bg: 'bg-blue-500/20',
    label: 'Deploying'
  },
  failed: {
    icon: XCircle,
    color: 'text-red-500',
    bg: 'bg-red-500/20',
    label: 'Failed'
  }
}

const envColors = {
  production: 'from-red-500 to-orange-600',
  staging: 'from-yellow-500 to-amber-600',
  development: 'from-blue-500 to-cyan-600'
}

export function DeploymentsList() {
  const [expandedDeployment, setExpandedDeployment] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Recent Deployments</h3>
      
      <div className="space-y-4">
        {deployments.map((deployment, index) => {
          const status = statusConfig[deployment.status as keyof typeof statusConfig]
          const StatusIcon = status.icon

          return (
            <motion.div
              key={deployment.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              {/* Glow effect for active deployment */}
              {deployment.status === 'running' && (
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl blur-lg opacity-30 animate-pulse" />
              )}
              
              {/* Card */}
              <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-white/20 transition-all overflow-hidden">
                {/* Main content */}
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Header */}
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`p-2 rounded-lg ${status.bg}`}>
                          <StatusIcon className={`w-5 h-5 ${status.color}`} />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-lg font-medium text-white">{deployment.commit}</h4>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r ${
                              envColors[deployment.environment as keyof typeof envColors]
                            } text-white`}>
                              {deployment.environment}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <div className="flex items-center gap-1">
                              <GitBranch className="w-4 h-4" />
                              <span>{deployment.branch}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              <span>{deployment.author}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{deployment.timestamp}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Progress or metrics */}
                      {deployment.status === 'running' && deployment.progress && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-gray-400">Progress</span>
                            <span className="text-white font-medium">{deployment.progress}%</span>
                          </div>
                          <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
                            <motion.div
                              className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-cyan-600"
                              initial={{ width: 0 }}
                              animate={{ width: `${deployment.progress}%` }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                        </div>
                      )}

                      {deployment.status === 'success' && deployment.metrics && (
                        <div className="grid grid-cols-3 gap-4">
                          <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="w-4 h-4 text-green-400" />
                              <div>
                                <p className="text-xs text-gray-400">Builds</p>
                                <p className="text-sm font-medium text-white">{deployment.metrics.builds}</p>
                              </div>
                            </div>
                          </div>
                          <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-blue-400" />
                              <div>
                                <p className="text-xs text-gray-400">Tests</p>
                                <p className="text-sm font-medium text-white">{deployment.metrics.tests}</p>
                              </div>
                            </div>
                          </div>
                          <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                            <div className="flex items-center gap-2">
                              <div className="relative w-4 h-4">
                                <svg className="w-4 h-4 -rotate-90">
                                  <circle
                                    cx="8"
                                    cy="8"
                                    r="6"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    className="text-gray-700"
                                  />
                                  <circle
                                    cx="8"
                                    cy="8"
                                    r="6"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeDasharray={`${deployment.metrics.coverage * 0.377} 100`}
                                    className="text-purple-400"
                                  />
                                </svg>
                              </div>
                              <div>
                                <p className="text-xs text-gray-400">Coverage</p>
                                <p className="text-sm font-medium text-white">{deployment.metrics.coverage}%</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {deployment.status === 'failed' && deployment.error && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5" />
                            <p className="text-sm text-red-400">{deployment.error}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 ml-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </motion.button>
                      {deployment.status === 'failed' && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                        >
                          <RotateCcw className="w-4 h-4 text-gray-400" />
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setExpandedDeployment(
                          expandedDeployment === deployment.id ? null : deployment.id
                        )}
                        className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Expanded details */}
                <AnimatePresence>
                  {expandedDeployment === deployment.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-white/10 bg-black/20"
                    >
                      <div className="p-6">
                        <div className="font-mono text-xs text-gray-400 space-y-1">
                          <div>[2024-01-15 14:32:45] Starting deployment...</div>
                          <div>[2024-01-15 14:32:47] Building Docker image...</div>
                          <div>[2024-01-15 14:33:12] Running tests...</div>
                          <div>[2024-01-15 14:33:45] Deploying to {deployment.environment}...</div>
                          <div className={status.color}>[2024-01-15 14:34:19] Deployment {deployment.status}</div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}