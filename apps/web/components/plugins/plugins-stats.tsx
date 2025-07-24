'use client'

import { motion } from 'framer-motion'
import { Puzzle, Download, Star, TrendingUp } from 'lucide-react'

const stats = [
  {
    label: 'Installed Plugins',
    value: '36',
    change: '+4',
    icon: Puzzle,
    color: 'from-green-500 to-emerald-600'
  },
  {
    label: 'Total Downloads',
    value: '12.4K',
    change: '+842',
    icon: Download,
    color: 'from-blue-500 to-cyan-600'
  },
  {
    label: 'Avg Rating',
    value: '4.8',
    change: '+0.2',
    icon: Star,
    color: 'from-yellow-500 to-orange-600'
  },
  {
    label: 'Usage Growth',
    value: '28%',
    change: '+8%',
    icon: TrendingUp,
    color: 'from-purple-500 to-pink-600'
  }
]

export function PluginsStats() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Plugin Metrics</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-white/5 to-white/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative p-6 rounded-xl bg-gray-900/80 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} opacity-20`}>
                  <stat.icon className={`w-6 h-6 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} />
                </div>
                <span className={`text-sm ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                  {stat.change}
                </span>
              </div>
              
              <h4 className="text-2xl font-bold text-white mb-1">{stat.value}</h4>
              <p className="text-sm text-gray-400">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Plugin Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 rounded-xl bg-gray-900/80 backdrop-blur-xl border border-white/10"
      >
        <h4 className="text-lg font-semibold text-white mb-4">Plugin Categories</h4>
        
        <div className="space-y-3">
          {[
            { name: 'Data Processing', count: 12, percentage: 33, color: 'from-green-500 to-emerald-500' },
            { name: 'AI Models', count: 8, percentage: 22, color: 'from-blue-500 to-cyan-500' },
            { name: 'Integrations', count: 7, percentage: 19, color: 'from-purple-500 to-pink-500' },
            { name: 'Analytics', count: 5, percentage: 14, color: 'from-orange-500 to-red-500' },
            { name: 'Utilities', count: 4, percentage: 12, color: 'from-indigo-500 to-purple-500' }
          ].map((category, index) => (
            <div key={category.name} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">{category.name}</span>
                <span className="text-white font-medium">{category.count} plugins</span>
              </div>
              <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className={`absolute inset-y-0 left-0 bg-gradient-to-r ${category.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${category.percentage}%` }}
                  transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}