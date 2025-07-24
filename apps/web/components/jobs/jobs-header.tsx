'use client'

import { motion } from 'framer-motion'
import { Layers, Plus, Pause, Play, Filter } from 'lucide-react'
import { useState } from 'react'

export function JobsHeader() {
  const [isPaused, setIsPaused] = useState(false)

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600 shadow-lg shadow-amber-500/25">
            <Layers className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">Job Queue</h1>
            <p className="text-gray-400 mt-1">Manage and monitor background jobs</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsPaused(!isPaused)}
            className={`p-3 rounded-xl ${
              isPaused ? 'bg-red-500/20 border-red-500/30' : 'bg-green-500/20 border-green-500/30'
            } border transition-all`}
          >
            {isPaused ? (
              <Play className="w-5 h-5 text-green-400" />
            ) : (
              <Pause className="w-5 h-5 text-red-400" />
            )}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
          >
            <Filter className="w-5 h-5 text-gray-400" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-white font-medium shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Job
          </motion.button>
        </div>
      </motion.div>

      {/* Live status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping" />
          </div>
          <span className="text-sm text-gray-300">Queue is processing</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-400">Active workers:</span>
          <span className="text-white font-medium">8/10</span>
        </div>
      </motion.div>
    </div>
  )
}