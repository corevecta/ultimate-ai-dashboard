'use client'

import { motion } from 'framer-motion'
import { Settings, Save, RotateCcw } from 'lucide-react'

export function SettingsHeader() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-600 to-slate-700 shadow-lg shadow-gray-600/25">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">Settings</h1>
            <p className="text-gray-400 mt-1">Configure your dashboard preferences</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
          >
            <RotateCcw className="w-5 h-5 text-gray-400" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-gray-600 to-slate-700 text-white font-medium shadow-lg shadow-gray-600/25 hover:shadow-gray-600/40 transition-all flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            Save Changes
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}