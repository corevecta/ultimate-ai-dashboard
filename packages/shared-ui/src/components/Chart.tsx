import React from 'react'
import { BaseComponentProps } from '../types'
import { cn } from '../utils/cn'

interface ChartProps extends BaseComponentProps {
  type: 'line' | 'bar' | 'pie' | 'area'
  data: any
  options?: any
  height?: number | string
}

export function Chart({ type, data, options, height = 300, className }: ChartProps) {
  // This is a placeholder component
  // In a real implementation, you would use a charting library like recharts or chart.js
  
  return (
    <div
      className={cn(
        'flex items-center justify-center bg-gray-900/50 rounded-lg border border-white/10',
        className
      )}
      style={{ height }}
    >
      <div className="text-center">
        <p className="text-gray-400 mb-2">Chart Component</p>
        <p className="text-sm text-gray-500">Type: {type}</p>
      </div>
    </div>
  )
}