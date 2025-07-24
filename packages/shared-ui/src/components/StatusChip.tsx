import React from 'react'
import { motion } from 'framer-motion'
import { Status, Size, BaseComponentProps } from '../types'
import { cn } from '../utils/cn'

interface StatusChipProps extends BaseComponentProps {
  status: Status
  label?: string
  size?: Size
  animate?: boolean
  showDot?: boolean
}

const statusStyles: Record<Status, { bg: string; text: string; dot: string }> = {
  success: {
    bg: 'bg-green-500/20 border-green-500/30',
    text: 'text-green-400',
    dot: 'bg-green-500'
  },
  error: {
    bg: 'bg-red-500/20 border-red-500/30',
    text: 'text-red-400',
    dot: 'bg-red-500'
  },
  warning: {
    bg: 'bg-yellow-500/20 border-yellow-500/30',
    text: 'text-yellow-400',
    dot: 'bg-yellow-500'
  },
  info: {
    bg: 'bg-blue-500/20 border-blue-500/30',
    text: 'text-blue-400',
    dot: 'bg-blue-500'
  },
  pending: {
    bg: 'bg-orange-500/20 border-orange-500/30',
    text: 'text-orange-400',
    dot: 'bg-orange-500'
  },
  active: {
    bg: 'bg-purple-500/20 border-purple-500/30',
    text: 'text-purple-400',
    dot: 'bg-purple-500'
  },
  inactive: {
    bg: 'bg-gray-500/20 border-gray-500/30',
    text: 'text-gray-400',
    dot: 'bg-gray-500'
  }
}

const sizeStyles: Record<Size, string> = {
  xs: 'text-xs px-2 py-0.5',
  sm: 'text-sm px-2.5 py-1',
  md: 'text-sm px-3 py-1.5',
  lg: 'text-base px-4 py-2',
  xl: 'text-lg px-5 py-2.5'
}

export function StatusChip({
  status,
  label,
  size = 'sm',
  animate = true,
  showDot = true,
  className,
  ...props
}: StatusChipProps) {
  const styles = statusStyles[status]
  const displayLabel = label || status.charAt(0).toUpperCase() + status.slice(1)

  const chipContent = (
    <>
      {showDot && (
        <span className="relative">
          <span className={cn(
            "block w-2 h-2 rounded-full",
            styles.dot
          )} />
          {status === 'active' && animate && (
            <span className={cn(
              "absolute inset-0 block w-2 h-2 rounded-full animate-ping",
              styles.dot
            )} />
          )}
        </span>
      )}
      <span>{displayLabel}</span>
    </>
  )

  const chipClasses = cn(
    "inline-flex items-center gap-2 rounded-full border font-medium transition-all",
    styles.bg,
    styles.text,
    sizeStyles[size],
    className
  )

  if (animate) {
    return (
      <motion.span
        className={chipClasses}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {chipContent}
      </motion.span>
    )
  }

  return (
    <span className={chipClasses} {...props}>
      {chipContent}
    </span>
  )
}