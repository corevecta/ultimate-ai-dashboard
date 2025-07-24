'use client'

import { motion } from 'framer-motion'
import { GitBranch, Save, Upload, Download, Play, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function PipelineHeader() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25">
            <GitBranch className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">Visual Pipeline Builder</h1>
            <p className="text-gray-400 mt-1">Build and manage AI pipelines with visual node editor</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
            title="Load Pipeline"
          >
            <Upload className="w-5 h-5 text-gray-400 group-hover:text-white" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
            title="Save Pipeline"
          >
            <Save className="w-5 h-5 text-gray-400 group-hover:text-white" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
            title="Export Pipeline"
          >
            <Download className="w-5 h-5 text-gray-400 group-hover:text-white" />
          </motion.button>
          <div className="w-px h-8 bg-white/10 mx-2" />
          <Button
            variant="primary"
            size="default"
            className="shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
          >
            <Play className="w-4 h-4 mr-2" />
            Run Pipeline
          </Button>
          <Button variant="outline" size="default">
            <Plus className="w-4 h-4 mr-2" />
            New Pipeline
          </Button>
        </div>
      </motion.div>

      {/* Pipeline Info Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20"
      >
        <div className="flex items-center gap-6">
          <div>
            <span className="text-xs text-gray-500">Pipeline Name</span>
            <p className="text-sm font-medium text-white">Customer Sentiment Analysis</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div>
            <span className="text-xs text-gray-500">Last Modified</span>
            <p className="text-sm font-medium text-gray-300">2 hours ago</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div>
            <span className="text-xs text-gray-500">Status</span>
            <p className="text-sm font-medium text-emerald-400 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              Ready
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span>12 nodes</span>
          <span>•</span>
          <span>8 connections</span>
          <span>•</span>
          <span>v2.1.0</span>
        </div>
      </motion.div>
    </div>
  )
}