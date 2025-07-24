import React from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react'
import { Status, BaseComponentProps } from '../types'
import { cn } from '../utils/cn'

interface AlertProps extends BaseComponentProps {
  type?: Extract<Status, 'success' | 'error' | 'warning' | 'info'>
  title?: string
  description?: string
  icon?: React.ReactNode
  dismissible?: boolean
  onDismiss?: () => void
  animate?: boolean
}

const alertStyles = {
  success: {
    bg: 'bg-green-500/10 border-green-500/30',
    icon: 'text-green-500',
    title: 'text-green-400',
    description: 'text-green-300/80'
  },
  error: {
    bg: 'bg-red-500/10 border-red-500/30',
    icon: 'text-red-500',
    title: 'text-red-400',
    description: 'text-red-300/80'
  },
  warning: {
    bg: 'bg-yellow-500/10 border-yellow-500/30',
    icon: 'text-yellow-500',
    title: 'text-yellow-400',
    description: 'text-yellow-300/80'
  },
  info: {
    bg: 'bg-blue-500/10 border-blue-500/30',
    icon: 'text-blue-500',
    title: 'text-blue-400',
    description: 'text-blue-300/80'
  }
}

const defaultIcons = {
  success: <CheckCircle className="w-5 h-5" />,
  error: <XCircle className="w-5 h-5" />,
  warning: <AlertCircle className="w-5 h-5" />,
  info: <Info className="w-5 h-5" />
}

export function Alert({
  type = 'info',
  title,
  description,
  icon,
  dismissible = false,
  onDismiss,
  animate = true,
  className,
  ...props
}: AlertProps) {
  const styles = alertStyles[type]
  const defaultIcon = defaultIcons[type]

  const content = (
    <div className="flex gap-3">
      <div className={cn('flex-shrink-0', styles.icon)}>
        {icon || defaultIcon}
      </div>
      
      <div className="flex-1">
        {title && (
          <h3 className={cn('font-medium mb-1', styles.title)}>
            {title}
          </h3>
        )}
        {description && (
          <p className={cn('text-sm', styles.description)}>
            {description}
          </p>
        )}
      </div>

      {dismissible && (
        <button
          onClick={onDismiss}
          className={cn(
            'flex-shrink-0 p-1 rounded-lg transition-colors',
            'hover:bg-white/10',
            styles.icon
          )}
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )

  const alertClasses = cn(
    'relative p-4 rounded-lg border backdrop-blur-sm',
    styles.bg,
    className
  )

  if (animate) {
    return (
      <motion.div
        className={alertClasses}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.3 }}
        {...props}
      >
        {content}
      </motion.div>
    )
  }

  return (
    <div className={alertClasses} {...props}>
      {content}
    </div>
  )
}