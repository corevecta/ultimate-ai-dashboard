'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { 
  GitBranch, 
  Play, 
  Pause, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Cpu,
  Layers,
  Zap,
  AlertCircle
} from 'lucide-react'

interface PipelineNode {
  id: string
  name: string
  status: 'idle' | 'running' | 'success' | 'error'
  duration?: number
  progress?: number
}

const nodes: PipelineNode[] = [
  { id: '1', name: 'Idea Expansion', status: 'success', duration: 2.3 },
  { id: '2', name: 'Market Analysis', status: 'success', duration: 5.1 },
  { id: '3', name: 'UI/UX Design', status: 'running', progress: 65 },
  { id: '4', name: 'Implementation', status: 'idle' },
  { id: '5', name: 'Security Audit', status: 'idle' },
  { id: '6', name: 'QA Testing', status: 'idle' },
  { id: '7', name: 'Deployment', status: 'idle' },
  { id: '8', name: 'Monitoring', status: 'idle' }
]

const statusConfig = {
  idle: { icon: Clock, color: 'text-gray-400', bg: 'bg-gray-800', glow: '' },
  running: { icon: Play, color: 'text-blue-500', bg: 'bg-blue-500/20', glow: 'shadow-blue-500/50' },
  success: { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/20', glow: 'shadow-green-500/50' },
  error: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/20', glow: 'shadow-red-500/50' }
}

export function PipelineVisualization() {
  const [activeNode, setActiveNode] = useState<string | null>(null)
  const [animateFlow, setAnimateFlow] = useState(true)
  const [pipelineNodes, setPipelineNodes] = useState<PipelineNode[]>(nodes)
  const [isConnected, setIsConnected] = useState(false)
  const [connectionAttempts, setConnectionAttempts] = useState(0)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Connect to WebSocket for real-time updates
    connectWebSocket()
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [])

  function connectWebSocket() {
    // In development, go straight to simulation to avoid console errors
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      simulatePipeline()
      return
    }
    
    // In production, attempt WebSocket connection with retries
    if (connectionAttempts >= 3) {
      simulatePipeline()
      return
    }
    
    try {
      createWebSocket()
    } catch (err) {
      // Fallback to simulation if WebSocket fails
      simulatePipeline()
    }
  }
  
  function createWebSocket() {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000';
    const ws = new WebSocket(wsUrl)
    
    ws.onopen = () => {
      setIsConnected(true)
      setConnectionAttempts(0) // Reset on successful connection
      // Subscribe to workflow updates
      ws.send(JSON.stringify({ type: 'subscribe', channel: 'workflow:progress' }))
    }
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.type === 'workflow:progress') {
          updatePipelineFromWorkflow(data.payload)
        }
      } catch (err) {
        console.error('WebSocket message error:', err)
      }
    }
    
    ws.onclose = () => {
      setIsConnected(false)
      setConnectionAttempts(prev => prev + 1)
      // Reconnect with exponential backoff
      const delay = Math.min(5000 * Math.pow(2, connectionAttempts), 30000)
      reconnectTimeoutRef.current = setTimeout(connectWebSocket, delay)
    }
    
    ws.onerror = () => {
      // WebSocket errors are expected when backend is not running
      // No need to log them as they're handled by showing "Simulated Mode"
      setIsConnected(false)
    }
    
    wsRef.current = ws
  }
  
  function updatePipelineFromWorkflow(workflowData: any) {
    // Map workflow data to pipeline nodes
    setPipelineNodes(prevNodes => {
      return prevNodes.map(node => {
        const phase = workflowData.phases?.find((p: any) => 
          p.name.toLowerCase().includes(node.name.toLowerCase())
        )
        
        if (phase) {
          return {
            ...node,
            status: phase.status === 'completed' ? 'success' : 
                   phase.status === 'running' ? 'running' : 
                   phase.status === 'failed' ? 'error' : 'idle',
            progress: phase.progress || 0,
            duration: phase.duration ? phase.duration / 1000 : undefined
          }
        }
        return node
      })
    })
  }
  
  function simulatePipeline() {
    // Fallback simulation if WebSocket is not available
    const interval = setInterval(() => {
      setPipelineNodes(prevNodes => {
        const updatedNodes = [...prevNodes]
        const runningNode = updatedNodes.find(n => n.status === 'running')
        if (runningNode && runningNode.progress !== undefined) {
          runningNode.progress = Math.min(runningNode.progress + 5, 100)
          if (runningNode.progress >= 100) {
            runningNode.status = 'success'
            runningNode.progress = undefined
            // Start next node
            const currentIndex = updatedNodes.indexOf(runningNode)
            if (currentIndex < updatedNodes.length - 1) {
              const nextNode = updatedNodes[currentIndex + 1]
              if (nextNode.status === 'idle') {
                nextNode.status = 'running'
                nextNode.progress = 0
              }
            }
          }
        }
        return updatedNodes
      })
    }, 500)
    
    return () => clearInterval(interval)
  }

  return (
    <div className="relative h-full bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/10 p-8 overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Header */}
      <div className="relative z-10 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 bg-opacity-20">
              <GitBranch className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Pipeline Status</h2>
              <p className="text-sm text-gray-400">Real-time execution flow</p>
            </div>
          </div>
          <button
            onClick={() => setAnimateFlow(!animateFlow)}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            {animateFlow ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Connection Status */}
      {!isConnected && (
        <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 rounded-lg bg-yellow-500/20 border border-yellow-500/30">
          <AlertCircle className="w-4 h-4 text-yellow-500" />
          <span className="text-xs text-yellow-500">Simulated Mode</span>
        </div>
      )}

      {/* Pipeline nodes */}
      <div className="relative grid grid-cols-4 gap-6">
        {pipelineNodes.map((node, index) => {
          const config = statusConfig[node.status]
          const Icon = config.icon

          return (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onMouseEnter={() => setActiveNode(node.id)}
              onMouseLeave={() => setActiveNode(null)}
              className="relative"
            >
              {/* Connection line */}
              {index < nodes.length - 1 && (
                <svg className="absolute left-full top-1/2 -translate-y-1/2 w-6 h-0.5 z-0">
                  <line
                    x1="0"
                    y1="0"
                    x2="24"
                    y2="0"
                    stroke="url(#gradient)"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    className={animateFlow && node.status === 'success' ? 'animate-flow' : ''}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
              )}

              {/* Node */}
              <motion.div
                className={`relative p-4 rounded-xl border ${config.bg} ${
                  node.status !== 'idle' ? `shadow-lg ${config.glow}` : ''
                } border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Status icon */}
                <div className="flex items-center justify-between mb-3">
                  <Icon className={`w-5 h-5 ${config.color}`} />
                  {node.duration && (
                    <span className="text-xs text-gray-400">{node.duration}s</span>
                  )}
                </div>

                {/* Name */}
                <h3 className="text-sm font-medium text-white mb-2">{node.name}</h3>

                {/* Progress bar */}
                {node.status === 'running' && node.progress && (
                  <div className="relative h-1 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-purple-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${node.progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                )}

                {/* Hover tooltip */}
                <AnimatePresence>
                  {activeNode === node.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 bg-gray-800 rounded-lg shadow-xl z-50"
                    >
                      <p className="text-xs text-gray-300 whitespace-nowrap">
                        Step {index + 1} of {nodes.length}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )
        })}
      </div>

      {/* Stats */}
      <div className="relative z-10 mt-8 grid grid-cols-3 gap-4">
        {[
          { label: 'Total Duration', value: '15.2s', icon: Clock },
          { label: 'Success Rate', value: '98.5%', icon: CheckCircle2 },
          { label: 'Avg Load', value: '45%', icon: Cpu }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="p-4 rounded-lg bg-white/5 border border-white/10"
          >
            <div className="flex items-center gap-3">
              <stat.icon className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">{stat.label}</p>
                <p className="text-lg font-semibold text-white">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <style jsx>{`
        @keyframes flow {
          0% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: -8;
          }
        }
        .animate-flow {
          animation: flow 1s linear infinite;
        }
      `}</style>
    </div>
  )
}