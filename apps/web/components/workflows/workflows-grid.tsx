'use client'

import { motion } from 'framer-motion'
import { 
  GitBranch, 
  Clock, 
  MoreVertical,
  Play,
  CheckCircle,
  XCircle,
  AlertCircle,
  Zap,
  Code,
  Shield,
  Globe,
  Smartphone,
  Brain,
  Activity,
  FileText,
  Package
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

interface WorkflowPhase {
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  duration?: number;
  progress?: number;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'paused';
  type: string;
  progress: number;
  currentPhase?: string;
  failedPhase?: string;
  error?: string;
  phases: WorkflowPhase[];
  metrics: {
    totalDuration: number;
    tokensUsed: number;
    filesGenerated: number;
    successRate: number;
  };
  createdAt: string;
  completedAt?: string;
  failedAt?: string;
}

const typeIcons: Record<string, any> = {
  'full-stack': Globe,
  'frontend': Code,
  'backend': Shield,
  'mobile': Smartphone,
  'ai-service': Brain,
  'api': Activity,
  'documentation': FileText,
  'deployment': Package,
}

const statusConfig = {
  queued: { 
    color: 'text-gray-400', 
    bg: 'bg-gray-500', 
    icon: Clock,
    label: 'Queued'
  },
  running: { 
    color: 'text-blue-400', 
    bg: 'bg-blue-500', 
    icon: Activity,
    label: 'Running'
  },
  completed: { 
    color: 'text-green-400', 
    bg: 'bg-green-500', 
    icon: CheckCircle,
    label: 'Completed'
  },
  failed: { 
    color: 'text-red-400', 
    bg: 'bg-red-500', 
    icon: XCircle,
    label: 'Failed'
  },
  paused: { 
    color: 'text-yellow-400', 
    bg: 'bg-yellow-500', 
    icon: AlertCircle,
    label: 'Paused'
  }
}

const phaseColors: Record<string, string> = {
  'Idea Expansion': 'from-purple-500 to-pink-500',
  'Market Analysis': 'from-blue-500 to-cyan-500',
  'UI/UX Design': 'from-green-500 to-emerald-500',
  'Implementation': 'from-orange-500 to-red-500',
  'Security Audit': 'from-yellow-500 to-amber-500',
  'QA Testing': 'from-indigo-500 to-purple-500',
  'Deployment': 'from-teal-500 to-green-500',
}

export function WorkflowsGrid() {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [loading, setLoading] = useState(true)
  const [hoveredWorkflow, setHoveredWorkflow] = useState<string | null>(null)

  useEffect(() => {
    fetchWorkflows()
    const interval = setInterval(fetchWorkflows, 5000) // Update every 5s
    return () => clearInterval(interval)
  }, [])

  async function fetchWorkflows() {
    try {
      const response = await fetch('/api/workflows')
      if (response.ok) {
        const data = await response.json()
        setWorkflows(data)
      }
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch workflows:', error)
      setLoading(false)
    }
  }

  async function executeWorkflow(workflowId: string) {
    try {
      const response = await fetch(`/api/workflows/${workflowId}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      })
      
      if (response.ok) {
        // Refresh workflows
        fetchWorkflows()
      }
    } catch (error) {
      console.error('Failed to execute workflow:', error)
    }
  }

  function formatDuration(ms: number): string {
    if (!ms || ms === 0) return '0s'
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    
    if (hours > 0) return `${hours}h ${minutes % 60}m`
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`
    return `${seconds}s`
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    
    return date.toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-64 bg-gray-900/50 rounded-2xl animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {workflows.map((workflow, index) => {
        const TypeIcon = typeIcons[workflow.type] || GitBranch
        const statusInfo = statusConfig[workflow.status]
        const StatusIcon = statusInfo.icon
        
        return (
          <motion.div
            key={workflow.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onMouseEnter={() => setHoveredWorkflow(workflow.id)}
            onMouseLeave={() => setHoveredWorkflow(null)}
            className="relative group"
          >
            {/* Glow effect */}
            <div
              className={`absolute -inset-1 bg-gradient-to-r ${
                phaseColors[workflow.currentPhase || 'Implementation']
              } rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500`}
            />

            {/* Card */}
            <div className="relative h-full bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${
                    phaseColors[workflow.currentPhase || 'Implementation']
                  } bg-opacity-20`}>
                    <TypeIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{workflow.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <StatusIcon className={`w-4 h-4 ${statusInfo.color}`} />
                      <span className={`text-xs ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                      {workflow.currentPhase && (
                        <>
                          <span className="text-gray-600">•</span>
                          <span className="text-xs text-gray-400">
                            {workflow.currentPhase}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-400 mb-4">{workflow.description}</p>

              {/* Error message if failed */}
              {workflow.error && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30">
                  <p className="text-xs text-red-400">{workflow.error}</p>
                </div>
              )}

              {/* Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-400">Overall Progress</span>
                  <span className="text-white font-medium">{workflow.progress}%</span>
                </div>
                <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    className={`absolute inset-y-0 left-0 bg-gradient-to-r ${
                      workflow.status === 'failed' 
                        ? 'from-red-500 to-pink-500'
                        : phaseColors[workflow.currentPhase || 'Implementation']
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${workflow.progress}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>
              </div>

              {/* Phases */}
              <div className="mb-4">
                <div className="flex items-center gap-1">
                  {workflow.phases.map((phase, i) => (
                    <div
                      key={i}
                      className={`flex-1 h-1 rounded-full ${
                        phase.status === 'completed' ? 'bg-green-500' :
                        phase.status === 'running' ? 'bg-blue-500' :
                        phase.status === 'failed' ? 'bg-red-500' :
                        phase.status === 'skipped' ? 'bg-gray-700' :
                        'bg-gray-800'
                      }`}
                      title={`${phase.name}: ${phase.status}`}
                    />
                  ))}
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-4 gap-2 mb-4 text-center">
                <div>
                  <Clock className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                  <p className="text-xs font-medium text-white">
                    {formatDuration(workflow.metrics.totalDuration)}
                  </p>
                  <p className="text-xs text-gray-500">Duration</p>
                </div>
                <div>
                  <Zap className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                  <p className="text-xs font-medium text-white">
                    {(workflow.metrics.tokensUsed / 1000).toFixed(0)}k
                  </p>
                  <p className="text-xs text-gray-500">Tokens</p>
                </div>
                <div>
                  <FileText className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                  <p className="text-xs font-medium text-white">
                    {workflow.metrics.filesGenerated}
                  </p>
                  <p className="text-xs text-gray-500">Files</p>
                </div>
                <div>
                  <Activity className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                  <p className="text-xs font-medium text-white">
                    {workflow.metrics.successRate}%
                  </p>
                  <p className="text-xs text-gray-500">Success</p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <span className="text-sm text-gray-400">
                  Created {formatDate(workflow.createdAt)}
                </span>
                {workflow.status === 'queued' && (
                  <Button
                    size="sm"
                    onClick={() => executeWorkflow(workflow.id)}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                  >
                    <Play className="w-3 h-3 mr-1" />
                    Execute
                  </Button>
                )}
                {workflow.status === 'failed' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => executeWorkflow(workflow.id)}
                    className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                  >
                    <Play className="w-3 h-3 mr-1" />
                    Retry
                  </Button>
                )}
              </div>

              {/* Hover effect */}
              <motion.div
                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 pointer-events-none"
                animate={{ opacity: hoveredWorkflow === workflow.id ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}