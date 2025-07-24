'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Plus, 
  Search, 
  Filter,
  Grid3x3,
  List,
  Upload,
  Rocket,
  GitBranch,
  Zap
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface WorkflowStats {
  total: number;
  running: number;
  completed: number;
  failed: number;
  successRate: number;
  avgDuration: number;
}

export function WorkflowsHeader() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [stats, setStats] = useState<WorkflowStats>({
    total: 0,
    running: 0,
    completed: 0,
    failed: 0,
    successRate: 0,
    avgDuration: 0
  })

  useEffect(() => {
    fetchWorkflowStats()
  }, [])

  async function fetchWorkflowStats() {
    try {
      const response = await fetch('/api/workflows')
      if (response.ok) {
        const workflows = await response.json()
        
        const stats: WorkflowStats = {
          total: workflows.length,
          running: workflows.filter((w: any) => w.status === 'running').length,
          completed: workflows.filter((w: any) => w.status === 'completed').length,
          failed: workflows.filter((w: any) => w.status === 'failed').length,
          successRate: 0,
          avgDuration: 0
        }
        
        // Calculate success rate
        const finished = stats.completed + stats.failed
        if (finished > 0) {
          stats.successRate = (stats.completed / finished) * 100
        }
        
        // Calculate average duration
        const durations = workflows
          .filter((w: any) => w.metrics?.totalDuration)
          .map((w: any) => w.metrics.totalDuration)
        
        if (durations.length > 0) {
          stats.avgDuration = durations.reduce((a: number, b: number) => a + b, 0) / durations.length
        }
        
        setStats(stats)
      }
    } catch (error) {
      console.error('Failed to fetch workflow stats:', error)
    }
  }

  function formatDuration(ms: number): string {
    if (ms === 0) return '0s'
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    
    if (hours > 0) return `${hours}h ${minutes % 60}m`
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`
    return `${seconds}s`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            AI Workflows
          </h1>
          <p className="text-gray-400 mt-2">
            Manage and monitor your AI code generation pipelines
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="border-white/10 hover:bg-white/5"
          >
            <Upload className="mr-2 h-4 w-4" />
            Import Template
          </Button>
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            New Workflow
          </Button>
        </div>
      </div>

      {/* Search and filters bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search workflows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-900/50 border-white/10 focus:border-purple-500/50"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="border-white/10 hover:bg-white/5"
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>

          <div className="flex items-center gap-1 bg-gray-900/50 rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'bg-white/10' : ''}
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'bg-white/10' : ''}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-white/10 p-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
              <GitBranch className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Workflows</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
              <p className="text-xs text-green-500 mt-1">
                {stats.running} running
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-white/10 p-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20">
              <Rocket className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-white">{stats.completed}</p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.failed} failed
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-white/10 p-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20">
              <Zap className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Success Rate</p>
              <p className="text-2xl font-bold text-white">
                {stats.successRate.toFixed(1)}%
              </p>
              <p className="text-xs text-green-500 mt-1">
                {stats.successRate > 90 ? '↑ Excellent' : stats.successRate > 70 ? '→ Good' : '↓ Needs improvement'}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-white/10 p-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500/20 to-red-500/20">
              <Zap className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Avg Duration</p>
              <p className="text-2xl font-bold text-white">
                {formatDuration(stats.avgDuration)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Per workflow</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}