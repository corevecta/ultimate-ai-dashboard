'use client'

import { motion } from 'framer-motion'
import { Cpu, HardDrive, Activity, Wifi } from 'lucide-react'

const metrics = [
  {
    label: 'CPU Usage',
    value: 68,
    max: 100,
    unit: '%',
    icon: Cpu,
    color: 'from-blue-500 to-cyan-600',
    status: 'normal'
  },
  {
    label: 'Memory',
    value: 4.2,
    max: 8,
    unit: 'GB',
    icon: HardDrive,
    color: 'from-purple-500 to-pink-600',
    status: 'normal'
  },
  {
    label: 'API Latency',
    value: 124,
    max: 500,
    unit: 'ms',
    icon: Activity,
    color: 'from-green-500 to-emerald-600',
    status: 'good'
  },
  {
    label: 'Network I/O',
    value: 892,
    max: 1000,
    unit: 'MB/s',
    icon: Wifi,
    color: 'from-orange-500 to-red-600',
    status: 'warning'
  }
]

export function PerformanceMetrics() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">System Performance</h3>
      
      <div className="space-y-4">
        {metrics.map((metric, index) => {
          const percentage = (metric.value / metric.max) * 100
          const Icon = metric.icon
          
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-white/5 to-white/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative p-6 rounded-xl bg-gray-900/80 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${metric.color} opacity-20`}>
                      <Icon className={`w-5 h-5 bg-gradient-to-br ${metric.color} bg-clip-text text-transparent`} />
                    </div>
                    <span className="text-sm text-gray-400">{metric.label}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-white">{metric.value}</span>
                    <span className="text-sm text-gray-500 ml-1">{metric.unit}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    className={`absolute inset-y-0 left-0 bg-gradient-to-r ${metric.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                  />
                </div>

                {/* Status indicator */}
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {metric.value} / {metric.max} {metric.unit}
                  </span>
                  <span className={`text-xs font-medium ${
                    metric.status === 'good' ? 'text-green-400' :
                    metric.status === 'warning' ? 'text-yellow-400' :
                    'text-gray-400'
                  }`}>
                    {metric.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}