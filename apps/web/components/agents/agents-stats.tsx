'use client'

import { motion } from 'framer-motion'
import { Bot, Zap, Brain, TrendingUp } from 'lucide-react'

const stats = [
  {
    label: 'Active Agents',
    value: '24',
    change: '+6',
    icon: Bot,
    color: 'from-purple-500 to-pink-600'
  },
  {
    label: 'Tasks Completed',
    value: '1,842',
    change: '+124',
    icon: Zap,
    color: 'from-blue-500 to-cyan-600'
  },
  {
    label: 'Avg Intelligence',
    value: '94%',
    change: '+2%',
    icon: Brain,
    color: 'from-green-500 to-emerald-600'
  },
  {
    label: 'Success Rate',
    value: '98.5%',
    change: '+0.5%',
    icon: TrendingUp,
    color: 'from-orange-500 to-red-600'
  }
]

export function AgentsStats() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Agent Performance</h3>
      
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

      {/* Agent Types Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 rounded-xl bg-gray-900/80 backdrop-blur-xl border border-white/10"
      >
        <h4 className="text-lg font-semibold text-white mb-4">Agent Types</h4>
        
        <div className="space-y-3">
          {[
            { name: 'Research Agents', count: 8, percentage: 33, color: 'from-purple-500 to-pink-500' },
            { name: 'Code Assistants', count: 6, percentage: 25, color: 'from-blue-500 to-cyan-500' },
            { name: 'Data Analysts', count: 5, percentage: 21, color: 'from-green-500 to-emerald-500' },
            { name: 'Workflow Automation', count: 3, percentage: 13, color: 'from-orange-500 to-red-500' },
            { name: 'Customer Support', count: 2, percentage: 8, color: 'from-indigo-500 to-purple-500' }
          ].map((type, index) => (
            <div key={type.name} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">{type.name}</span>
                <span className="text-white font-medium">{type.count} agents</span>
              </div>
              <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className={`absolute inset-y-0 left-0 bg-gradient-to-r ${type.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${type.percentage}%` }}
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