'use client'

import { motion } from 'framer-motion'
import { Server, Activity, DollarSign, TrendingUp } from 'lucide-react'

const stats = [
  {
    label: 'Active Deployments',
    value: '156',
    change: '+12',
    icon: Server,
    color: 'from-blue-500 to-cyan-600'
  },
  {
    label: 'Uptime',
    value: '99.98%',
    change: '+0.02%',
    icon: Activity,
    color: 'from-green-500 to-emerald-600'
  },
  {
    label: 'Monthly Cost',
    value: '$3,240',
    change: '-8%',
    icon: DollarSign,
    color: 'from-purple-500 to-pink-600'
  },
  {
    label: 'Traffic',
    value: '2.4M',
    change: '+18%',
    icon: TrendingUp,
    color: 'from-orange-500 to-red-600'
  }
]

export function PlatformStats() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Overview</h3>
      
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
                <span className="text-sm text-green-400">{stat.change}</span>
              </div>
              
              <h4 className="text-2xl font-bold text-white mb-1">{stat.value}</h4>
              <p className="text-sm text-gray-400">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Distribution chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 rounded-xl bg-gray-900/80 backdrop-blur-xl border border-white/10"
      >
        <h4 className="text-lg font-semibold text-white mb-4">Resource Distribution</h4>
        
        <div className="space-y-3">
          {[
            { name: 'AWS', percentage: 45, color: 'from-orange-500 to-yellow-500' },
            { name: 'Google Cloud', percentage: 30, color: 'from-blue-500 to-cyan-500' },
            { name: 'Azure', percentage: 20, color: 'from-purple-500 to-pink-500' },
            { name: 'Vercel', percentage: 5, color: 'from-green-500 to-emerald-500' }
          ].map((platform, index) => (
            <div key={platform.name} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">{platform.name}</span>
                <span className="text-white font-medium">{platform.percentage}%</span>
              </div>
              <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className={`absolute inset-y-0 left-0 bg-gradient-to-r ${platform.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${platform.percentage}%` }}
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