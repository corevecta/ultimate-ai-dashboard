'use client'

import { motion } from 'framer-motion'
import { 
  GitBranch, 
  Package, 
  Truck, 
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight
} from 'lucide-react'
import { useEffect, useState } from 'react'

const stages = [
  { id: 'source', name: 'Source', icon: GitBranch, status: 'success', duration: '12s' },
  { id: 'build', name: 'Build', icon: Package, status: 'success', duration: '45s' },
  { id: 'test', name: 'Test', icon: CheckCircle2, status: 'running', progress: 65 },
  { id: 'deploy', name: 'Deploy', icon: Truck, status: 'pending' }
]

const statusConfig = {
  pending: { color: 'text-gray-400', bg: 'bg-gray-800', glow: '' },
  running: { color: 'text-blue-500', bg: 'bg-blue-500/20', glow: 'shadow-blue-500/50' },
  success: { color: 'text-green-500', bg: 'bg-green-500/20', glow: 'shadow-green-500/50' },
  error: { color: 'text-red-500', bg: 'bg-red-500/20', glow: 'shadow-red-500/50' }
}

export function DeploymentsPipeline() {
  const [animateProgress, setAnimateProgress] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      const runningStage = stages.find(s => s.status === 'running')
      if (runningStage && runningStage.progress !== undefined) {
        runningStage.progress = Math.min(runningStage.progress + 2, 100)
      }
    }, 200)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="relative p-8 rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-white/10"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-semibold text-white">Current Deployment</h3>
          <p className="text-sm text-gray-400 mt-1">main → production</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/30">
          <Clock className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-blue-400">Running - 1m 23s</span>
        </div>
      </div>

      {/* Pipeline stages */}
      <div className="relative">
        {/* Connection line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-800 -translate-y-1/2" />
        
        <div className="relative grid grid-cols-4 gap-8">
          {stages.map((stage, index) => {
            const config = statusConfig[stage.status as keyof typeof statusConfig]
            const Icon = stage.icon

            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {/* Connection arrow */}
                {index < stages.length - 1 && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 -translate-x-4 z-10">
                    <ArrowRight className={`w-5 h-5 ${
                      stage.status === 'success' ? 'text-green-500' : 'text-gray-600'
                    }`} />
                  </div>
                )}

                {/* Stage card */}
                <div
                  className={`relative p-6 rounded-xl ${config.bg} ${
                    stage.status !== 'pending' ? `shadow-lg ${config.glow}` : ''
                  } border border-white/10 bg-gray-900/80 backdrop-blur-sm`}
                >
                  {/* Icon */}
                  <div className="flex items-center justify-center mb-3">
                    <Icon className={`w-8 h-8 ${config.color}`} />
                  </div>

                  {/* Name */}
                  <h4 className="text-sm font-medium text-white text-center mb-2">{stage.name}</h4>

                  {/* Status */}
                  <div className="text-center">
                    {stage.status === 'success' && (
                      <span className="text-xs text-green-400">{stage.duration}</span>
                    )}
                    {stage.status === 'running' && stage.progress && (
                      <div className="space-y-2">
                        <span className="text-xs text-blue-400">{stage.progress}%</span>
                        <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${stage.progress}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      </div>
                    )}
                    {stage.status === 'pending' && (
                      <span className="text-xs text-gray-500">Waiting</span>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Log preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 p-4 rounded-lg bg-black/50 border border-white/10"
      >
        <div className="font-mono text-xs text-gray-400 space-y-1">
          <div>
            <span className="text-green-400">[Source]</span> Cloning repository...
          </div>
          <div>
            <span className="text-green-400">[Build]</span> Installing dependencies...
          </div>
          <div>
            <span className="text-green-400">[Build]</span> Building application...
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-400">[Test]</span> Running test suite...
            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}