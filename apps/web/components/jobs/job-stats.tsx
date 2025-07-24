'use client'

import { motion } from 'framer-motion'
import { 
  Layers, 
  CheckCircle2, 
  XCircle, 
  Clock,
  TrendingUp,
  Activity
} from 'lucide-react'

const stats = [
  {
    label: 'Total Jobs',
    value: '1,247',
    change: '+124',
    icon: Layers,
    color: 'from-amber-500 to-yellow-600'
  },
  {
    label: 'Completed',
    value: '1,102',
    percentage: 88.4,
    icon: CheckCircle2,
    color: 'from-green-500 to-emerald-600'
  },
  {
    label: 'Failed',
    value: '45',
    percentage: 3.6,
    icon: XCircle,
    color: 'from-red-500 to-pink-600'
  },
  {
    label: 'Avg Duration',
    value: '2.4s',
    change: '-0.3s',
    icon: Clock,
    color: 'from-blue-500 to-cyan-600'
  }
]

export function JobStats() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Statistics</h3>
      
      <div className="space-y-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-white/5 to-white/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative p-6 rounded-xl bg-gray-900/80 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} opacity-20`}>
                  <stat.icon className={`w-6 h-6 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} />
                </div>
                {stat.change && (
                  <span className={`text-sm font-medium ${
                    stat.change.startsWith('+') ? 'text-green-400' : 'text-blue-400'
                  }`}>
                    {stat.change}
                  </span>
                )}
                {stat.percentage && (
                  <span className="text-sm text-gray-400">{stat.percentage}%</span>
                )}
              </div>
              
              <h4 className="text-2xl font-bold text-white mb-1">{stat.value}</h4>
              <p className="text-sm text-gray-400">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Real-time activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 rounded-xl bg-gray-900/80 backdrop-blur-xl border border-white/10"
      >
        <div className="flex items-center gap-3 mb-4">
          <Activity className="w-5 h-5 text-amber-400" />
          <h4 className="text-lg font-semibold text-white">Live Activity</h4>
        </div>
        
        <div className="space-y-3">
          {[
            { type: 'Processing', count: 8, color: 'bg-blue-500' },
            { type: 'Queued', count: 24, color: 'bg-gray-500' },
            { type: 'Scheduled', count: 156, color: 'bg-purple-500' }
          ].map((activity, index) => (
            <div key={activity.type} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">{activity.type}</span>
                <span className="text-white font-medium">{activity.count}</span>
              </div>
              <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className={`absolute inset-y-0 left-0 ${activity.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${(activity.count / 200) * 100}%` }}
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