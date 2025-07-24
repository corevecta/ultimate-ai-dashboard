import React from 'react'
import { motion } from 'framer-motion'
import { BaseComponentProps } from '../types'
import { cn } from '../utils/cn'

interface ProgressBarProps extends BaseComponentProps {
  value: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'gradient' | 'striped'
  color?: string
  showLabel?: boolean
  label?: string
  animate?: boolean
}

const sizeStyles = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3'
}

const variantStyles = {
  default: 'bg-purple-500',
  gradient: 'bg-gradient-to-r from-purple-500 to-blue-500',
  striped: 'bg-gradient-to-r from-purple-500 to-blue-500 bg-stripes'
}

export function ProgressBar({
  value,
  max = 100,
  size = 'md',
  variant = 'default',
  color,
  showLabel = false,
  label,
  animate = true,
  className
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  
  return (
    <div className={cn('w-full', className)}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">{label || 'Progress'}</span>
          <span className="text-sm font-medium text-white">{percentage.toFixed(0)}%</span>
        </div>
      )}
      
      <div className={cn(
        'w-full bg-gray-800 rounded-full overflow-hidden',
        sizeStyles[size]
      )}>
        <motion.div
          className={cn(
            'h-full rounded-full transition-all duration-300',
            color || variantStyles[variant],
            variant === 'striped' && 'animate-stripes'
          )}
          initial={animate ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}