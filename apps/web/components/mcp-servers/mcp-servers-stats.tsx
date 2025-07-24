'use client'

import { motion } from 'framer-motion'
import { Server, Activity, Cpu, Clock } from 'lucide-react'

const stats = [
  {
    label: 'Active Servers',
    value: '12',
    change: '+3',
    icon: Server,
    color: 'from-cyan-500 to-blue-600'
  },
  {
    label: 'Uptime',
    value: '99.95%',
    change: '+0.05%',
    icon: Activity,
    color: 'from-green-500 to-emerald-600'
  },
  {
    label: 'CPU Usage',
    value: '42%',
    change: '-8%',
    icon: Cpu,
    color: 'from-purple-500 to-pink-600'
  },
  {
    label: 'Response Time',
    value: '124ms',
    change: '-12ms',
    icon: Clock,
    color: 'from-orange-500 to-red-600'
  }
]

export function MCPServersStats() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Server Metrics</h3>
      
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

      {/* Protocol Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 rounded-xl bg-gray-900/80 backdrop-blur-xl border border-white/10"
      >
        <h4 className="text-lg font-semibold text-white mb-4">Protocol Distribution</h4>
        
        <div className="space-y-3">
          {[
            { name: 'REST API', percentage: 45, color: 'from-cyan-500 to-blue-500' },
            { name: 'GraphQL', percentage: 30, color: 'from-purple-500 to-pink-500' },
            { name: 'WebSocket', percentage: 15, color: 'from-green-500 to-emerald-500' },
            { name: 'gRPC', percentage: 10, color: 'from-orange-500 to-red-500' }
          ].map((protocol, index) => (
            <div key={protocol.name} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">{protocol.name}</span>
                <span className="text-white font-medium">{protocol.percentage}%</span>
              </div>
              <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className={`absolute inset-y-0 left-0 bg-gradient-to-r ${protocol.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${protocol.percentage}%` }}
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