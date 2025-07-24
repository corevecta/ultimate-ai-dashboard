'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCw, Download, Bell } from 'lucide-react'
import { ErrorConfigDialog } from './error-config-dialog'

export function ErrorsHeader() {
  const [configDialogOpen, setConfigDialogOpen] = useState(false)
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-red-500 to-orange-600 shadow-lg shadow-red-500/25">
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">Error Logs</h1>
            <p className="text-gray-400 mt-1">Monitor and manage system errors and exceptions</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
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
            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
          >
            <Download className="w-5 h-5 text-gray-400" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setConfigDialogOpen(true)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-orange-600 text-white font-medium shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all flex items-center gap-2"
          >
            <Bell className="w-5 h-5" />
            Configure Alerts
          </motion.button>
        </div>
      </motion.div>

      {/* Status bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20"
      >
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-400" />
          <span className="text-sm text-gray-300">3 critical errors in the last hour</span>
        </div>
        <span className="text-xs text-gray-500">Auto-refresh enabled</span>
      </motion.div>

      {/* Configuration Dialog */}
      <ErrorConfigDialog 
        isOpen={configDialogOpen}
        onClose={() => setConfigDialogOpen(false)}
      />
    </div>
  )
}