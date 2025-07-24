'use client'

import { motion, Reorder, useDragControls } from 'framer-motion'
import { 
  Clock, 
  Play, 
  CheckCircle2, 
  XCircle,
  AlertCircle,
  GripVertical,
  MoreVertical,
  RefreshCw,
  Trash2,
  Zap
} from 'lucide-react'
import { useState } from 'react'

const jobTypes = {
  'data-processing': { icon: '📊', color: 'from-blue-500 to-cyan-600' },
  'email-send': { icon: '📧', color: 'from-purple-500 to-pink-600' },
  'report-generation': { icon: '📈', color: 'from-green-500 to-emerald-600' },
  'backup': { icon: '💾', color: 'from-orange-500 to-red-600' },
  'sync': { icon: '🔄', color: 'from-indigo-500 to-purple-600' }
}

const initialJobs = [
  {
    id: '1',
    type: 'data-processing',
    name: 'Process Analytics Data',
    status: 'running',
    priority: 'high',
    progress: 65,
    attempts: 1,
    createdAt: '2 min ago',
    eta: '3 min'
  },
  {
    id: '2',
    type: 'email-send',
    name: 'Send Weekly Newsletter',
    status: 'queued',
    priority: 'medium',
    attempts: 0,
    createdAt: '5 min ago',
    eta: '8 min'
  },
  {
    id: '3',
    type: 'report-generation',
    name: 'Generate Monthly Report',
    status: 'queued',
    priority: 'low',
    attempts: 0,
    createdAt: '10 min ago',
    eta: '15 min'
  },
  {
    id: '4',
    type: 'backup',
    name: 'Database Backup',
    status: 'failed',
    priority: 'high',
    attempts: 3,
    createdAt: '30 min ago',
    error: 'Connection timeout'
  },
  {
    id: '5',
    type: 'sync',
    name: 'Sync User Data',
    status: 'completed',
    priority: 'medium',
    attempts: 1,
    createdAt: '1 hour ago',
    completedAt: '45 min ago'
  }
]

const statusConfig = {
  queued: { icon: Clock, color: 'text-gray-400', bg: 'bg-gray-800' },
  running: { icon: Play, color: 'text-blue-500', bg: 'bg-blue-500/20' },
  completed: { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/20' },
  failed: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/20' }
}

const priorityConfig = {
  high: { color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' },
  medium: { color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30' },
  low: { color: 'text-gray-400', bg: 'bg-gray-500/20', border: 'border-gray-500/30' }
}

export function JobQueue() {
  const [jobs, setJobs] = useState(initialJobs)
  const [expandedJob, setExpandedJob] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Active Jobs</h3>
      
      <Reorder.Group axis="y" values={jobs} onReorder={setJobs} className="space-y-4">
        {jobs.map((job, index) => {
          const dragControls = useDragControls()
          const status = statusConfig[job.status as keyof typeof statusConfig]
          const priority = priorityConfig[job.priority as keyof typeof priorityConfig]
          const jobType = jobTypes[job.type as keyof typeof jobTypes]
          const StatusIcon = status.icon

          return (
            <Reorder.Item
              key={job.id}
              value={job}
              dragControls={dragControls}
              dragListener={false}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative group"
            >
              {/* Glow effect for running jobs */}
              {job.status === 'running' && (
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl blur-lg opacity-20 animate-pulse" />
              )}
              
              {/* Card */}
              <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-white/20 transition-all overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center gap-4">
                    {/* Drag handle */}
                    <button
                      onPointerDown={(e) => dragControls.start(e)}
                      className="p-2 rounded-lg hover:bg-white/5 cursor-grab active:cursor-grabbing transition-colors"
                    >
                      <GripVertical className="w-5 h-5 text-gray-500" />
                    </button>

                    {/* Job icon */}
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${jobType.color} opacity-20`}>
                      <span className="text-2xl">{jobType.icon}</span>
                    </div>

                    {/* Job details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="text-lg font-medium text-white">{job.name}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priority.bg} ${priority.border} ${priority.color} border`}>
                          {job.priority}
                        </span>
                        {job.attempts > 1 && (
                          <span className="px-2 py-0.5 rounded-full text-xs bg-orange-500/20 text-orange-400 border border-orange-500/30">
                            Retry {job.attempts}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <StatusIcon className={`w-4 h-4 ${status.color}`} />
                          <span>{job.status}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{job.createdAt}</span>
                        </div>
                        {job.eta && job.status !== 'completed' && job.status !== 'failed' && (
                          <div className="flex items-center gap-1">
                            <Zap className="w-4 h-4" />
                            <span>ETA: {job.eta}</span>
                          </div>
                        )}
                      </div>

                      {/* Progress bar for running jobs */}
                      {job.status === 'running' && job.progress && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-gray-400">Progress</span>
                            <span className="text-white font-medium">{job.progress}%</span>
                          </div>
                          <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
                            <motion.div
                              className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-cyan-600"
                              initial={{ width: 0 }}
                              animate={{ width: `${job.progress}%` }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Error message for failed jobs */}
                      {job.status === 'failed' && job.error && (
                        <div className="mt-3 p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-red-400 mt-0.5" />
                            <p className="text-sm text-red-400">{job.error}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {job.status === 'failed' && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                        >
                          <RefreshCw className="w-4 h-4 text-gray-400" />
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-gray-400" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                        className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Expanded details */}
                {expandedJob === job.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-white/10 bg-black/20 p-6"
                  >
                    <div className="grid grid-cols-2 gap-6 text-sm">
                      <div>
                        <h5 className="font-medium text-gray-400 mb-2">Job Details</h5>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Job ID:</span>
                            <span className="text-gray-300 font-mono">{job.id}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Type:</span>
                            <span className="text-gray-300">{job.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Queue:</span>
                            <span className="text-gray-300">default</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-400 mb-2">Metadata</h5>
                        <div className="p-3 rounded-lg bg-gray-800/50 font-mono text-xs text-gray-400">
                          {JSON.stringify({ userId: '12345', batch: 'weekly' }, null, 2)}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </Reorder.Item>
          )
        })}
      </Reorder.Group>
    </div>
  )
}