'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Book, Search, Plus, Bookmark, HelpCircle } from 'lucide-react'
import { HelpDialog } from './help-dialog'

export function DocsHeader() {
  const [helpDialogOpen, setHelpDialogOpen] = useState(false)
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25">
            <Book className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">Documentation</h1>
            <p className="text-gray-400 mt-1">Explore guides, tutorials, and API references</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setHelpDialogOpen(true)}
            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
          >
            <HelpCircle className="w-5 h-5 text-gray-400" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
          >
            <Bookmark className="w-5 h-5 text-gray-400" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Contribute
          </motion.button>
        </div>
      </motion.div>

      {/* Search bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative"
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search documentation..."
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-900/80 backdrop-blur-xl border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-white/20 transition-all"
        />
      </motion.div>

      {/* Help Dialog */}
      <HelpDialog 
        isOpen={helpDialogOpen}
        onClose={() => setHelpDialogOpen(false)}
      />
    </div>
  )
}