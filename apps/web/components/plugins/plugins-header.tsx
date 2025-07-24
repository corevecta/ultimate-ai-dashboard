'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Puzzle, Plus, RefreshCw, CheckCircle2, Upload } from 'lucide-react'
import { PluginUploadDialog } from './plugin-upload-dialog'

export function PluginsHeader() {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/25">
            <Puzzle className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">Plugins</h1>
            <p className="text-gray-400 mt-1">Extend your AI capabilities with powerful plugins</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setUploadDialogOpen(true)}
            className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-2"
          >
            <Upload className="w-5 h-5 text-gray-400" />
            Submit Plugin
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
          >
            <RefreshCw className="w-5 h-5 text-gray-400" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Install Plugin
          </motion.button>
        </div>
      </motion.div>

      {/* Status bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20"
      >
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-400" />
          <span className="text-sm text-gray-300">All plugins up to date</span>
        </div>
        <span className="text-xs text-gray-500">Last check: 1 hour ago</span>
      </motion.div>

      {/* Upload Dialog */}
      <PluginUploadDialog 
        isOpen={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
      />
    </div>
  )
}