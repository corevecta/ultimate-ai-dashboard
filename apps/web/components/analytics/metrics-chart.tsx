'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { useState, useEffect } from 'react'

// Generate smooth data points
const generateData = () => {
  const points = 24
  const data = []
  let value = 50
  
  for (let i = 0; i < points; i++) {
    value += (Math.random() - 0.5) * 10
    value = Math.max(10, Math.min(90, value))
    data.push({
      time: `${i}:00`,
      pipeline: Math.floor(value + Math.random() * 20),
      api: Math.floor(value + Math.random() * 15 - 5),
      jobs: Math.floor(value + Math.random() * 25 - 10),
      errors: Math.floor(Math.random() * 10)
    })
  }
  return data
}

const metrics = [
  { key: 'pipeline', label: 'Pipeline Runs', color: 'from-blue-500 to-cyan-500', value: '2,847', change: 12.5 },
  { key: 'api', label: 'API Calls', color: 'from-purple-500 to-pink-500', value: '18.2K', change: -3.2 },
  { key: 'jobs', label: 'Jobs Processed', color: 'from-green-500 to-emerald-500', value: '9,421', change: 8.7 },
  { key: 'errors', label: 'Error Rate', color: 'from-red-500 to-orange-500', value: '0.12%', change: 0 }
]

export function MetricsChart() {
  const [data] = useState(generateData())
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null)
  const [selectedMetrics, setSelectedMetrics] = useState(['pipeline', 'api', 'jobs'])

  const toggleMetric = (key: string) => {
    setSelectedMetrics(prev => 
      prev.includes(key) 
        ? prev.filter(k => k !== key)
        : [...prev, key]
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="relative p-8 rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-white/10"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/5" />
      </div>

      {/* Header */}
      <div className="relative z-10 mb-8">
        <h3 className="text-2xl font-bold text-white mb-6">Performance Overview</h3>
        
        {/* Metric toggles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) => {
            const isSelected = selectedMetrics.includes(metric.key)
            return (
              <motion.button
                key={metric.key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleMetric(metric.key)}
                className={`relative p-4 rounded-xl border transition-all ${
                  isSelected 
                    ? 'bg-white/10 border-white/20' 
                    : 'bg-white/5 border-white/10 opacity-60'
                }`}
              >
                {isSelected && (
                  <div className={`absolute -inset-1 bg-gradient-to-r ${metric.color} rounded-xl blur-lg opacity-30`} />
                )}
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400">{metric.label}</span>
                    <div className="flex items-center gap-1">
                      {metric.change > 0 ? (
                        <TrendingUp className="w-3 h-3 text-green-400" />
                      ) : metric.change < 0 ? (
                        <TrendingDown className="w-3 h-3 text-red-400" />
                      ) : (
                        <Minus className="w-3 h-3 text-gray-400" />
                      )}
                      <span className={`text-xs font-medium ${
                        metric.change > 0 ? 'text-green-400' : 
                        metric.change < 0 ? 'text-red-400' : 'text-gray-400'
                      }`}>
                        {Math.abs(metric.change)}%
                      </span>
                    </div>
                  </div>
                  <p className="text-xl font-bold text-white">{metric.value}</p>
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-64">
        <svg className="w-full h-full" viewBox="0 0 800 200">
          {/* Grid lines */}
          {[0, 50, 100, 150, 200].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="800"
              y2={y}
              stroke="rgba(255,255,255,0.05)"
              strokeDasharray="4 4"
            />
          ))}

          {/* Data lines */}
          {metrics.filter(m => selectedMetrics.includes(m.key)).map((metric) => {
            const points = data.map((d, i) => {
              const x = (i / (data.length - 1)) * 800
              const value = d[metric.key as keyof typeof d] as number
              const y = 200 - (value / 100) * 180
              return `${x},${y}`
            }).join(' ')

            return (
              <g key={metric.key}>
                {/* Area fill */}
                <defs>
                  <linearGradient id={`gradient-${metric.key}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" className={`text-${metric.color.split(' ')[1].replace('to-', '')}`} stopOpacity="0.3" />
                    <stop offset="100%" className={`text-${metric.color.split(' ')[1].replace('to-', '')}`} stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d={`M ${points} L 800,200 L 0,200 Z`}
                  fill={`url(#gradient-${metric.key})`}
                  opacity="0.3"
                />

                {/* Line */}
                <polyline
                  points={points}
                  fill="none"
                  stroke={`url(#line-gradient-${metric.key})`}
                  strokeWidth="2"
                  className="filter drop-shadow-lg"
                />
                <defs>
                  <linearGradient id={`line-gradient-${metric.key}`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" className={`text-${metric.color.split(' ')[1].replace('from-', '')}`} />
                    <stop offset="100%" className={`text-${metric.color.split(' ')[1].replace('to-', '')}`} />
                  </linearGradient>
                </defs>

                {/* Data points */}
                {data.map((d, i) => {
                  const x = (i / (data.length - 1)) * 800
                  const value = d[metric.key as keyof typeof d] as number
              const y = 200 - (value / 100) * 180
                  
                  return (
                    <motion.circle
                      key={i}
                      cx={x}
                      cy={y}
                      r="4"
                      fill="white"
                      opacity={hoveredPoint === i ? 1 : 0}
                      initial={{ scale: 0 }}
                      animate={{ scale: hoveredPoint === i ? 1.5 : 1 }}
                      onMouseEnter={() => setHoveredPoint(i)}
                      onMouseLeave={() => setHoveredPoint(null)}
                      className="cursor-pointer"
                    />
                  )
                })}
              </g>
            )
          })}
        </svg>

        {/* Hover tooltip */}
        {hoveredPoint !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 p-3 rounded-lg bg-gray-800 border border-white/20 shadow-xl"
          >
            <p className="text-sm font-medium text-white mb-1">{data[hoveredPoint].time}</p>
            {metrics.filter(m => selectedMetrics.includes(m.key)).map((metric) => (
              <div key={metric.key} className="flex items-center gap-2 text-xs">
                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${metric.color}`} />
                <span className="text-gray-400">{metric.label}:</span>
                <span className="text-white font-medium">
                  {data[hoveredPoint][metric.key as keyof typeof data[0]]}
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}