'use client'

import { motion } from 'framer-motion'
import { Activity, Clock, Zap, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react'

const stats = [
  {
    label: 'Total Executions',
    value: '2,847',
    change: '+12%',
    icon: Activity,
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'from-blue-500/10 to-indigo-500/10',
    borderColor: 'border-blue-500/20',
  },
  {
    label: 'Average Runtime',
    value: '3.2s',
    change: '-18%',
    icon: Clock,
    color: 'from-purple-500 to-pink-600',
    bgColor: 'from-purple-500/10 to-pink-500/10',
    borderColor: 'border-purple-500/20',
  },
  {
    label: 'Success Rate',
    value: '98.5%',
    change: '+2.3%',
    icon: CheckCircle,
    color: 'from-emerald-500 to-teal-600',
    bgColor: 'from-emerald-500/10 to-teal-500/10',
    borderColor: 'border-emerald-500/20',
  },
  {
    label: 'Processing Speed',
    value: '1.2M/day',
    change: '+25%',
    icon: Zap,
    color: 'from-orange-500 to-red-600',
    bgColor: 'from-orange-500/10 to-red-500/10',
    borderColor: 'border-orange-500/20',
  },
]

export function PipelineStats() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ scale: 1.02 }}
            className={`relative p-6 rounded-2xl bg-gradient-to-br ${stat.bgColor} border ${stat.borderColor} backdrop-blur-sm`}
          >
            {/* Background pattern */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-grid-pattern opacity-5" />
            </div>

            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className={`w-4 h-4 ${stat.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`} />
                  <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                    {stat.change}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>

              {/* Activity indicator */}
              <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '70%' }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                  className={`h-full bg-gradient-to-r ${stat.color}`}
                />
              </div>
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}