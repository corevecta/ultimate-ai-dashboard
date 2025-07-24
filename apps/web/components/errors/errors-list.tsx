'use client'

import { motion } from 'framer-motion'
import { 
  AlertTriangle,
  Bug,
  Clock,
  Code2,
  Server,
  Database,
  Globe,
  Shield,
  ChevronRight,
  Copy,
  ExternalLink
} from 'lucide-react'
import { useState } from 'react'
import { ErrorDetailsDialog } from './error-details-dialog'

const errorTypes = {
  api: { icon: Globe, color: 'from-red-500 to-orange-600' },
  database: { icon: Database, color: 'from-purple-500 to-pink-600' },
  network: { icon: Server, color: 'from-blue-500 to-cyan-600' },
  validation: { icon: Shield, color: 'from-yellow-500 to-orange-600' },
  system: { icon: Bug, color: 'from-gray-500 to-gray-600' }
}

const errors = [
  {
    id: 'err-001',
    type: 'api',
    severity: 'critical',
    message: 'Failed to connect to authentication service',
    code: 'AUTH_SERVICE_UNAVAILABLE',
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    source: '/api/auth/login',
    stack: `Error: Connection refused
    at AuthService.connect (/api/auth/service.js:42:11)
    at async handleLogin (/api/auth/login.js:18:5)
    at async handler (/api/middleware/auth.js:12:3)`,
    occurrences: 42,
    affected: 156
  },
  {
    id: 'err-002',
    type: 'database',
    severity: 'high',
    message: 'Database connection pool exhausted',
    code: 'DB_POOL_EXHAUSTED',
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    source: '/services/database/pool.js',
    stack: `Error: No available connections in pool
    at Pool.acquire (/services/database/pool.js:78:15)
    at async executeQuery (/services/database/query.js:23:19)`,
    occurrences: 18,
    affected: 89
  },
  {
    id: 'err-003',
    type: 'network',
    severity: 'medium',
    message: 'Request timeout to external API',
    code: 'EXTERNAL_API_TIMEOUT',
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
    source: '/services/external/weather-api.js',
    stack: `Error: Request timeout after 30000ms
    at Timeout._onTimeout (/services/external/client.js:112:16)
    at listOnTimeout (internal/timers.js:549:17)`,
    occurrences: 7,
    affected: 23
  },
  {
    id: 'err-004',
    type: 'validation',
    severity: 'low',
    message: 'Invalid input format for user registration',
    code: 'VALIDATION_ERROR',
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    source: '/api/users/register',
    stack: `ValidationError: Email format is invalid
    at validateEmail (/utils/validators.js:34:11)
    at validateUserInput (/api/users/validation.js:56:5)`,
    occurrences: 124,
    affected: 124
  },
  {
    id: 'err-005',
    type: 'system',
    severity: 'medium',
    message: 'Memory usage exceeded threshold',
    code: 'MEMORY_THRESHOLD_EXCEEDED',
    timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
    source: '/monitoring/memory-check.js',
    stack: `Warning: Memory usage at 92% of limit
    at checkMemory (/monitoring/memory-check.js:23:9)
    at Interval.runCheck (/monitoring/scheduler.js:45:5)`,
    occurrences: 3,
    affected: 0
  }
]

export function ErrorsList() {
  const [expandedError, setExpandedError] = useState<string | null>(null)
  const [selectedError, setSelectedError] = useState<any>(null)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    
    if (minutes < 60) return `${minutes} minutes ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} hours ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Recent Errors</h3>
        <div className="flex items-center gap-4">
          <select className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300 focus:outline-none focus:border-white/20">
            <option>All Severities</option>
            <option>Critical</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
          <select className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300 focus:outline-none focus:border-white/20">
            <option>Last Hour</option>
            <option>Last 24 Hours</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
          </select>
        </div>
      </div>
      
      <div className="space-y-4">
        {errors.map((error, index) => {
          const ErrorIcon = errorTypes[error.type as keyof typeof errorTypes].icon
          const gradientColor = errorTypes[error.type as keyof typeof errorTypes].color
          
          return (
            <motion.div
              key={error.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              {/* Glow effect for critical errors */}
              {error.severity === 'critical' && (
                <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl blur-lg opacity-30 animate-pulse" />
              )}
              
              {/* Card */}
              <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-white/20 transition-all overflow-hidden">
                {/* Main content */}
                <div className="p-6">
                  <div 
                    className="flex items-start justify-between mb-4 cursor-pointer"
                    onClick={() => {
                      setSelectedError(error)
                      setDetailsDialogOpen(true)
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${gradientColor} opacity-20`}>
                        <ErrorIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-white">{error.message}</h4>
                          <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getSeverityColor(error.severity)}`}>
                            {error.severity.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="font-mono">{error.code}</span>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatTimestamp(error.timestamp)}</span>
                          </div>
                          <span>•</span>
                          <span>{error.occurrences} occurrences</span>
                          {error.affected > 0 && (
                            <>
                              <span>•</span>
                              <span className="text-orange-400">{error.affected} users affected</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <motion.button
                      onClick={() => setExpandedError(expandedError === error.id ? null : error.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${
                        expandedError === error.id ? 'rotate-90' : ''
                      }`} />
                    </motion.button>
                  </div>

                  {/* Source */}
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-black/30 border border-white/5">
                    <Code2 className="w-4 h-4 text-gray-400" />
                    <code className="text-sm text-gray-300">{error.source}</code>
                  </div>
                </div>

                {/* Expanded content */}
                {expandedError === error.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-white/10 p-6 bg-black/20"
                  >
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="text-sm font-medium text-gray-400">Stack Trace</h5>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                          >
                            <Copy className="w-4 h-4 text-gray-400" />
                          </motion.button>
                        </div>
                        <pre className="p-4 rounded-lg bg-black/50 border border-white/5 text-xs text-gray-300 overflow-x-auto">
                          {error.stack}
                        </pre>
                      </div>

                      <div className="flex items-center gap-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-gray-300 hover:text-white transition-all flex items-center gap-2"
                        >
                          <ExternalLink className="w-4 h-4" />
                          View in Logs
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-gray-300 hover:text-white transition-all"
                        >
                          Create Issue
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-sm text-red-400 hover:text-red-300 transition-all"
                        >
                          Mark as Resolved
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Error Details Dialog */}
      <ErrorDetailsDialog 
        isOpen={detailsDialogOpen}
        onClose={() => {
          setDetailsDialogOpen(false)
          setSelectedError(null)
        }}
        error={selectedError ? {
          ...selectedError,
          affectedUsers: selectedError.affected,
          stackTrace: selectedError.stack
        } : undefined}
      />
    </div>
  )
}