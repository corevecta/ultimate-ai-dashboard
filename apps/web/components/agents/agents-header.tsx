'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bot, Plus, RefreshCw, Sparkles } from 'lucide-react'
import { AgentConfigDialog } from './agent-config-dialog'

export function AgentsHeader() {
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
          <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-500/25">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">AI Agents</h1>
            <p className="text-gray-400 mt-1">Manage and monitor your autonomous AI agents</p>
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
            onClick={() => setConfigDialogOpen(true)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-medium shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Agent
          </motion.button>
        </div>
      </motion.div>

      {/* Status bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <span className="text-sm text-gray-300">8 agents running autonomously</span>
        </div>
        <span className="text-xs text-gray-500">Last activity: 2 minutes ago</span>
      </motion.div>

      {/* Configuration Dialog */}
      <AgentConfigDialog 
        isOpen={configDialogOpen}
        onClose={() => setConfigDialogOpen(false)}
      />
    </div>
  )
}