'use client'

import { motion } from 'framer-motion'
import { Calendar, TrendingUp } from 'lucide-react'

// Generate heatmap data
const generateHeatmapData = () => {
  const data: Array<{day: string, hour: number, value: number, dayIndex: number}> = []
  const hours = Array.from({ length: 24 }, (_, i) => i)
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  
  days.forEach((day, dayIndex) => {
    hours.forEach((hour) => {
      data.push({
        day,
        hour,
        value: Math.floor(Math.random() * 100),
        dayIndex
      })
    })
  })
  
  return data
}

const heatmapData = generateHeatmapData()

const getColorIntensity = (value: number) => {
  if (value === 0) return 'bg-gray-800'
  if (value < 20) return 'bg-purple-900/30'
  if (value < 40) return 'bg-purple-700/40'
  if (value < 60) return 'bg-purple-600/50'
  if (value < 80) return 'bg-purple-500/60'
  return 'bg-purple-400/70'
}

export function UsageHeatmap() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="relative p-8 rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-white/10"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Usage Patterns</h3>
          <p className="text-sm text-gray-400">Activity heatmap for the past week</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/30">
          <TrendingUp className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-purple-400">Peak: Weekdays 2-4 PM</span>
        </div>
      </div>

      {/* Heatmap */}
      <div className="relative">
        {/* Hour labels */}
        <div className="absolute -top-6 left-12 right-0 flex justify-between text-xs text-gray-500">
          {[0, 6, 12, 18, 23].map((hour) => (
            <span key={hour}>{hour}:00</span>
          ))}
        </div>

        {/* Day labels */}
        <div className="absolute -left-12 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <span key={day} className="h-6 flex items-center">{day}</span>
          ))}
        </div>

        {/* Heatmap grid */}
        <div className="grid grid-rows-7 gap-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, dayIndex) => (
            <div key={day} className="grid grid-cols-24 gap-1">
              {Array.from({ length: 24 }, (_, hour) => {
                const dataPoint = heatmapData.find(
                  d => d.dayIndex === dayIndex && d.hour === hour
                )
                const value = dataPoint?.value || 0
                
                return (
                  <motion.div
                    key={`${day}-${hour}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      delay: (dayIndex * 24 + hour) * 0.001,
                      duration: 0.3
                    }}
                    whileHover={{ scale: 1.2 }}
                    className="relative group"
                  >
                    <div
                      className={`w-full h-6 rounded ${getColorIntensity(value)} transition-all cursor-pointer`}
                    />
                    
                    {/* Tooltip */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 rounded-lg bg-gray-800 border border-white/20 shadow-xl z-50 pointer-events-none whitespace-nowrap"
                    >
                      <p className="text-xs text-white font-medium">{day} {hour}:00</p>
                      <p className="text-xs text-gray-400">{value} activities</p>
                    </motion.div>
                  </motion.div>
                )
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <span className="text-xs text-gray-500">Less</span>
          <div className="flex items-center gap-1">
            {[0, 20, 40, 60, 80].map((value) => (
              <div
                key={value}
                className={`w-4 h-4 rounded ${getColorIntensity(value)}`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">More</span>
        </div>
      </div>
    </motion.div>
  )
}