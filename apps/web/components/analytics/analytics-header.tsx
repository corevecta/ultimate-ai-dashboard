'use client'

import { motion } from 'framer-motion'
import { BarChart3, Download, Calendar, Filter } from 'lucide-react'
import { useState } from 'react'

const timeRanges = [
  { id: '24h', label: '24 Hours' },
  { id: '7d', label: '7 Days' },
  { id: '30d', label: '30 Days' },
  { id: '90d', label: '90 Days' }
]

export function AnalyticsHeader() {
  const [selectedRange, setSelectedRange] = useState('7d')

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 shadow-lg shadow-pink-500/25">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">Analytics</h1>
            <p className="text-gray-400 mt-1">Comprehensive insights and metrics</p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transition-all flex items-center gap-2"
        >
          <Download className="w-5 h-5" />
          Export Report
        </motion.button>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-between"
      >
        {/* Time range selector */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-white/5 border border-white/10">
          {timeRanges.map((range) => (
            <button
              key={range.id}
              onClick={() => setSelectedRange(range.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedRange === range.id
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-2"
          >
            <Calendar className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-400">Custom Range</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
          >
            <Filter className="w-5 h-5 text-gray-400" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}