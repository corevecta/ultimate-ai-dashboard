'use client'

import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Cpu, 
  Zap, 
  Globe,
  BarChart3,
  Users
} from 'lucide-react'
import { useState, useEffect } from 'react'

const metrics = [
  {
    label: 'Pipeline Runs',
    value: '12,847',
    change: '+12.5%',
    trend: 'up',
    icon: Activity,
    color: 'from-blue-500 to-cyan-500',
    glow: 'blue',
    sparkline: [30, 40, 35, 50, 49, 60, 70, 91, 85, 90]
  },
  {
    label: 'Success Rate',
    value: '98.2%',
    change: '+2.1%',
    trend: 'up',
    icon: BarChart3,
    color: 'from-emerald-500 to-green-500',
    glow: 'emerald',
    sparkline: [85, 87, 88, 90, 92, 94, 95, 96, 97, 98]
  },
  {
    label: 'Avg Duration',
    value: '4.2s',
    change: '-0.8s',
    trend: 'down',
    icon: Zap,
    color: 'from-purple-500 to-pink-500',
    glow: 'purple',
    sparkline: [50, 48, 45, 43, 42, 42, 41, 40, 38, 35]
  },
  {
    label: 'Active Users',
    value: '3,421',
    change: '+8.3%',
    trend: 'up',
    icon: Users,
    color: 'from-orange-500 to-red-500',
    glow: 'orange',
    sparkline: [20, 25, 30, 35, 32, 38, 42, 45, 48, 52]
  }
]

export function MetricsOverview() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          className="relative group"
        >
          {/* Glow effect */}
          <div
            className={`absolute -inset-1 bg-gradient-to-r ${metric.color} rounded-2xl blur-lg opacity-30 group-hover:opacity-60 transition-opacity duration-500`}
          />
          
          {/* Card */}
          <div className="relative h-full bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300">
            {/* Background pattern */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
              <svg className="absolute inset-0 w-full h-full opacity-5">
                <pattern id={`pattern-${index}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="10" cy="10" r="1" fill="currentColor" />
                </pattern>
                <rect width="100%" height="100%" fill={`url(#pattern-${index})`} />
              </svg>
            </div>

            {/* Content */}
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${metric.color} bg-opacity-20`}>
                  <metric.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1">
                  {metric.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-green-500" />
                  )}
                  <span className={`text-sm font-medium ${
                    metric.trend === 'up' ? 'text-green-500' : 'text-green-500'
                  }`}>
                    {metric.change}
                  </span>
                </div>
              </div>

              {/* Value */}
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-400 mb-1">{metric.label}</h3>
                <p className="text-3xl font-bold text-white">{metric.value}</p>
              </div>

              {/* Sparkline */}
              <div className="h-12 flex items-end gap-1">
                {metric.sparkline.map((value, i) => (
                  <motion.div
                    key={i}
                    className={`flex-1 bg-gradient-to-t ${metric.color} rounded-t opacity-60`}
                    initial={{ height: 0 }}
                    animate={{ height: `${value}%` }}
                    transition={{ delay: index * 0.1 + i * 0.02 }}
                  />
                ))}
              </div>
            </div>

            {/* Hover effect */}
            <motion.div
              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent opacity-0"
              animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  )
}