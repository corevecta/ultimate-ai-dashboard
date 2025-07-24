'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, Bug, Clock, TrendingDown } from 'lucide-react'

const stats = [
  {
    label: 'Total Errors',
    value: '247',
    change: '-18',
    icon: AlertTriangle,
    color: 'from-red-500 to-orange-600'
  },
  {
    label: 'Critical Issues',
    value: '3',
    change: '-2',
    icon: Bug,
    color: 'from-red-600 to-red-700'
  },
  {
    label: 'Avg Resolution',
    value: '1.2h',
    change: '-0.3h',
    icon: Clock,
    color: 'from-blue-500 to-cyan-600'
  },
  {
    label: 'Error Rate',
    value: '0.12%',
    change: '-0.04%',
    icon: TrendingDown,
    color: 'from-green-500 to-emerald-600'
  }
]

export function ErrorsStats() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Error Metrics</h3>
      
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
                <span className={`text-sm ${stat.change.startsWith('-') ? 'text-green-400' : 'text-red-400'}`}>
                  {stat.change}
                </span>
              </div>
              
              <h4 className="text-2xl font-bold text-white mb-1">{stat.value}</h4>
              <p className="text-sm text-gray-400">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Error Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 rounded-xl bg-gray-900/80 backdrop-blur-xl border border-white/10"
      >
        <h4 className="text-lg font-semibold text-white mb-4">Error Distribution</h4>
        
        <div className="space-y-3">
          {[
            { name: 'API Errors', count: 89, percentage: 36, color: 'from-red-500 to-orange-500', severity: 'high' },
            { name: 'Database Errors', count: 67, percentage: 27, color: 'from-purple-500 to-pink-500', severity: 'critical' },
            { name: 'Network Timeouts', count: 45, percentage: 18, color: 'from-blue-500 to-cyan-500', severity: 'medium' },
            { name: 'Validation Errors', count: 32, percentage: 13, color: 'from-yellow-500 to-orange-500', severity: 'low' },
            { name: 'Other', count: 14, percentage: 6, color: 'from-gray-500 to-gray-600', severity: 'low' }
          ].map((category, index) => (
            <div key={category.name} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">{category.name}</span>
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    category.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                    category.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                    category.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {category.severity}
                  </span>
                </div>
                <span className="text-white font-medium">{category.count} errors</span>
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