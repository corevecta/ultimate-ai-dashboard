'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  AlertTriangle, 
  AlertCircle,
  Info,
  XCircle,
  Clock,
  User,
  Globe,
  Server,
  Code,
  Copy,
  ExternalLink,
  CheckCircle,
  FileText,
  Bug,
  MessageSquare,
  Flag,
  Archive,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Hash,
  Calendar,
  Monitor,
  Smartphone,
  Layers,
  Database,
  Send
} from 'lucide-react'
import { Button } from '@ultimate-ai/shared-ui'

interface ErrorDetailsDialogProps {
  isOpen: boolean
  onClose: () => void
  error?: {
    id: string
    message: string
    code: string
    severity: 'critical' | 'error' | 'warning' | 'info'
    timestamp: string
    occurrences: number
    affectedUsers: number
    source: string
    stackTrace?: string
    resolved?: boolean
  }
}

const severityConfig = {
  critical: { 
    icon: XCircle, 
    color: 'text-red-400 bg-red-500/20 border-red-500/30',
    bgColor: 'from-red-500/20 to-red-600/20',
    label: 'Critical'
  },
  error: { 
    icon: AlertCircle, 
    color: 'text-orange-400 bg-orange-500/20 border-orange-500/30',
    bgColor: 'from-orange-500/20 to-orange-600/20',
    label: 'Error'
  },
  warning: { 
    icon: AlertTriangle, 
    color: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30',
    bgColor: 'from-yellow-500/20 to-yellow-600/20',
    label: 'Warning'
  },
  info: { 
    icon: Info, 
    color: 'text-blue-400 bg-blue-500/20 border-blue-500/30',
    bgColor: 'from-blue-500/20 to-blue-600/20',
    label: 'Info'
  }
}

export function ErrorDetailsDialog({ isOpen, onClose, error }: ErrorDetailsDialogProps) {
  const [activeTab, setActiveTab] = useState('details')
  const [showFullStack, setShowFullStack] = useState(false)
  const [comment, setComment] = useState('')
  const [expandedSections, setExpandedSections] = useState({
    request: true,
    environment: false,
    breadcrumbs: false,
    relatedErrors: false
  })

  if (!isOpen || !error) return null

  const severity = severityConfig[error.severity]
  const SeverityIcon = severity.icon

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const tabs = [
    { id: 'details', label: 'Details', icon: FileText },
    { id: 'context', label: 'Context', icon: Globe },
    { id: 'activity', label: 'Activity', icon: MessageSquare },
    { id: 'similar', label: 'Similar Errors', icon: Layers }
  ]

  // Mock data for demonstration
  const requestData = {
    method: 'POST',
    url: '/api/v1/projects/create',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      'X-Request-ID': 'req_abc123xyz'
    },
    body: {
      name: 'New Project',
      type: 'web-app',
      framework: 'react'
    }
  }

  const environmentData = {
    node_version: '18.17.0',
    environment: 'production',
    hostname: 'api-server-01',
    memory_usage: '2.4GB / 8GB',
    cpu_usage: '45%'
  }

  const breadcrumbs = [
    { time: '10:23:45', event: 'User clicked "Create Project"', type: 'user' },
    { time: '10:23:45', event: 'POST /api/v1/projects/create', type: 'http' },
    { time: '10:23:46', event: 'Database connection established', type: 'database' },
    { time: '10:23:47', event: 'Validation error: missing required field', type: 'error' }
  ]

  const relatedErrors = [
    { id: 'err_123', message: 'Database connection timeout', occurrences: 15, time: '2 hours ago' },
    { id: 'err_124', message: 'Invalid project configuration', occurrences: 8, time: '3 hours ago' }
  ]

  const activities = [
    { user: 'John Doe', action: 'marked as investigating', time: '30 minutes ago' },
    { user: 'System', action: 'auto-grouped 5 similar errors', time: '1 hour ago' },
    { user: 'Jane Smith', action: 'added comment', time: '2 hours ago', comment: 'This seems to be related to the recent deployment' }
  ]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-5xl max-h-[90vh] bg-gray-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`bg-gradient-to-r ${severity.bgColor} border-b border-white/10`}>
            <div className="flex items-start justify-between p-6">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${severity.color}`}>
                  <SeverityIcon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-bold text-white">{error.message}</h2>
                    {error.resolved && (
                      <span className="px-2 py-1 text-xs rounded-lg bg-green-500/20 text-green-400 border border-green-500/30">
                        Resolved
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Hash className="w-4 h-4" />
                      {error.code}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {error.timestamp}
                    </span>
                    <span className="flex items-center gap-1">
                      <RefreshCw className="w-4 h-4" />
                      {error.occurrences} occurrences
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {error.affectedUsers} users affected
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-black/20">
            <div className="flex items-center gap-2">
              {!error.resolved && (
                <>
                  <Button size="sm" variant="outline">
                    <CheckCircle className="w-4 h-4" />
                    Mark Resolved
                  </Button>
                  <Button size="sm" variant="outline">
                    <Bug className="w-4 h-4" />
                    Create Issue
                  </Button>
                  <Button size="sm" variant="outline">
                    <Flag className="w-4 h-4" />
                    Flag for Review
                  </Button>
                </>
              )}
              {error.resolved && (
                <Button size="sm" variant="outline">
                  <Archive className="w-4 h-4" />
                  Reopen
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline">
                <Copy className="w-4 h-4" />
                Copy Error ID
              </Button>
              <Button size="sm" variant="outline">
                <ExternalLink className="w-4 h-4" />
                View in Logs
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-2 bg-black/20 border-b border-white/10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white/10 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 280px)' }}>
            {/* Details Tab */}
            {activeTab === 'details' && (
              <div className="p-6 space-y-6">
                {/* Stack Trace */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Stack Trace</h3>
                  <div className="bg-black/40 rounded-lg border border-white/10 p-4">
                    <pre className="text-sm text-gray-300 overflow-x-auto">
                      <code>
                        {showFullStack ? error.stackTrace : error.stackTrace?.split('\n').slice(0, 5).join('\n')}
                      </code>
                    </pre>
                    {error.stackTrace && error.stackTrace.split('\n').length > 5 && (
                      <button
                        onClick={() => setShowFullStack(!showFullStack)}
                        className="mt-3 text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
                      >
                        {showFullStack ? (
                          <>Show Less <ChevronDown className="w-4 h-4" /></>
                        ) : (
                          <>Show More <ChevronRight className="w-4 h-4" /></>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Source Location */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Source Location</h3>
                  <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                    <Code className="w-5 h-5 text-gray-400" />
                    <code className="text-sm text-gray-300">{error.source}</code>
                    <Button size="sm" variant="outline" className="ml-auto">
                      <ExternalLink className="w-4 h-4" />
                      Open in Editor
                    </Button>
                  </div>
                </div>

                {/* Error Metadata */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Metadata</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="text-sm text-gray-400 mb-1">First Seen</div>
                      <div className="text-white">Oct 23, 2025 10:23:47 AM</div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="text-sm text-gray-400 mb-1">Last Seen</div>
                      <div className="text-white">{error.timestamp}</div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="text-sm text-gray-400 mb-1">Error Rate</div>
                      <div className="text-white">0.12% of requests</div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="text-sm text-gray-400 mb-1">Platform</div>
                      <div className="flex items-center gap-2 text-white">
                        <Monitor className="w-4 h-4" />
                        Web (85%)
                        <Smartphone className="w-4 h-4 ml-2" />
                        Mobile (15%)
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Context Tab */}
            {activeTab === 'context' && (
              <div className="p-6 space-y-6">
                {/* Request Data */}
                <div>
                  <button
                    onClick={() => toggleSection('request')}
                    className="flex items-center gap-2 text-lg font-semibold text-white mb-3 hover:text-purple-400"
                  >
                    {expandedSections.request ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    Request Data
                  </button>
                  {expandedSections.request && (
                    <div className="bg-black/40 rounded-lg border border-white/10 p-4 space-y-4">
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Method & URL</div>
                        <code className="text-sm text-gray-300">
                          {requestData.method} {requestData.url}
                        </code>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400 mb-2">Headers</div>
                        <pre className="text-sm text-gray-300 overflow-x-auto">
                          <code>{JSON.stringify(requestData.headers, null, 2)}</code>
                        </pre>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400 mb-2">Body</div>
                        <pre className="text-sm text-gray-300 overflow-x-auto">
                          <code>{JSON.stringify(requestData.body, null, 2)}</code>
                        </pre>
                      </div>
                    </div>
                  )}
                </div>

                {/* Environment */}
                <div>
                  <button
                    onClick={() => toggleSection('environment')}
                    className="flex items-center gap-2 text-lg font-semibold text-white mb-3 hover:text-purple-400"
                  >
                    {expandedSections.environment ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    Environment
                  </button>
                  {expandedSections.environment && (
                    <div className="bg-black/40 rounded-lg border border-white/10 p-4">
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(environmentData).map(([key, value]) => (
                          <div key={key}>
                            <div className="text-sm text-gray-400 mb-1">{key.replace(/_/g, ' ').toUpperCase()}</div>
                            <div className="text-white">{value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Breadcrumbs */}
                <div>
                  <button
                    onClick={() => toggleSection('breadcrumbs')}
                    className="flex items-center gap-2 text-lg font-semibold text-white mb-3 hover:text-purple-400"
                  >
                    {expandedSections.breadcrumbs ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    Breadcrumbs
                  </button>
                  {expandedSections.breadcrumbs && (
                    <div className="space-y-2">
                      {breadcrumbs.map((crumb, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                          <span className="text-xs text-gray-500">{crumb.time}</span>
                          <div className={`w-2 h-2 rounded-full ${
                            crumb.type === 'error' ? 'bg-red-500' : 
                            crumb.type === 'user' ? 'bg-blue-500' : 
                            crumb.type === 'database' ? 'bg-green-500' : 
                            'bg-gray-500'
                          }`} />
                          <span className="text-sm text-gray-300">{crumb.event}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <div className="p-6 space-y-6">
                {/* Add Comment */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Add Comment</h3>
                  <div className="space-y-3">
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Add a comment about this error..."
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                      rows={3}
                    />
                    <Button disabled={!comment.trim()}>
                      <Send className="w-4 h-4" />
                      Post Comment
                    </Button>
                  </div>
                </div>

                {/* Activity Log */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Activity Log</h3>
                  <div className="space-y-3">
                    {activities.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                          <User className="w-4 h-4 text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-white">{activity.user}</span>
                            <span className="text-sm text-gray-400">{activity.action}</span>
                          </div>
                          <div className="text-xs text-gray-500">{activity.time}</div>
                          {activity.comment && (
                            <div className="mt-2 p-2 bg-black/30 rounded text-sm text-gray-300">
                              {activity.comment}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Similar Errors Tab */}
            {activeTab === 'similar' && (
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Similar Errors</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Errors that share similar characteristics or patterns
                  </p>
                  <div className="space-y-3">
                    {relatedErrors.map((relError) => (
                      <div key={relError.id} className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 cursor-pointer transition-all">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-medium text-white mb-1">{relError.message}</div>
                            <div className="flex items-center gap-3 text-sm text-gray-400">
                              <span>#{relError.id}</span>
                              <span>{relError.occurrences} occurrences</span>
                              <span>{relError.time}</span>
                            </div>
                          </div>
                          <ExternalLink className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Related Errors */}
                <div>
                  <button
                    onClick={() => toggleSection('relatedErrors')}
                    className="flex items-center gap-2 text-lg font-semibold text-white mb-3 hover:text-purple-400"
                  >
                    {expandedSections.relatedErrors ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    Potentially Related Issues
                  </button>
                  {expandedSections.relatedErrors && (
                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-orange-300 mb-2">
                            This error might be related to a recent deployment (v2.4.0) that introduced changes to the project creation API.
                          </p>
                          <Button size="sm" variant="outline">
                            View Deployment
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}