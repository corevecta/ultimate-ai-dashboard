import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { MetricData, BaseComponentProps } from '../types'
import { cn } from '../utils/cn'

interface MetricCardProps extends BaseComponentProps {
  metric: MetricData
  variant?: 'default' | 'glass' | 'gradient'
  showTrend?: boolean
  animate?: boolean
}

export function MetricCard({ 
  metric, 
  variant = 'glass', 
  showTrend = true,
  animate = true,
  className,
  ...props 
}: MetricCardProps) {
  const getTrendIcon = () => {
    if (!metric.changeType) return <Minus className="w-4 h-4" />
    if (metric.changeType === 'increase') return <TrendingUp className="w-4 h-4" />
    if (metric.changeType === 'decrease') return <TrendingDown className="w-4 h-4" />
    return <Minus className="w-4 h-4" />
  }

  const getTrendColor = () => {
    if (!metric.changeType) return 'text-gray-400'
    if (metric.changeType === 'increase') return 'text-green-500'
    if (metric.changeType === 'decrease') return 'text-red-500'
    return 'text-gray-400'
  }

  const cardClasses = cn(
    'relative p-6 rounded-xl transition-all duration-300',
    {
      'bg-white/10 backdrop-blur-xl border border-white/10 hover:border-white/20': variant === 'glass',
      'bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/20': variant === 'gradient',
      'bg-gray-900 border border-gray-800': variant === 'default'
    },
    className
  )

  const content = (
    <>
      {/* Background effects */}
      {variant === 'glass' && (
        <div className="absolute inset-0 rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          {metric.icon && (
            <div className={cn(
              "p-3 rounded-xl",
              metric.color ? `bg-gradient-to-br ${metric.color} bg-opacity-20` : 'bg-white/10'
            )}>
              {metric.icon}
            </div>
          )}
          
          {showTrend && metric.change && (
            <div className={cn("flex items-center gap-1", getTrendColor())}>
              {getTrendIcon()}
              <span className="text-sm font-medium">{metric.change}{metric.unit}</span>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-1">{metric.label}</h3>
          <p className="text-3xl font-bold text-white">
            {metric.value}{metric.unit}
          </p>
        </div>

        {/* Sparkline */}
        {metric.trend && metric.trend.length > 0 && (
          <div className="mt-4 h-12 flex items-end gap-1">
            {metric.trend.map((value, i) => (
              <motion.div
                key={i}
                className={cn(
                  "flex-1 rounded-t",
                  metric.color ? `bg-gradient-to-t ${metric.color}` : 'bg-blue-500'
                )}
                initial={animate ? { height: 0 } : { height: `${value}%` }}
                animate={{ height: `${value}%` }}
                transition={{ delay: animate ? i * 0.02 : 0 }}
                style={{ opacity: 0.6 }}
              />
            ))}
          </div>
        )}
      </div>
    </>
  )

  if (animate) {
    return (
      <motion.div
        className={cardClasses}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
        {...props}
      >
        {content}
      </motion.div>
    )
  }

  return (
    <div className={cardClasses} {...props}>
      {content}
    </div>
  )
}