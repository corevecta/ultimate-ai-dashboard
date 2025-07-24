import React from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { BaseComponentProps } from '../types'
import { cn } from '../utils/cn'

interface LoadingStateProps extends BaseComponentProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton'
  fullScreen?: boolean
}

const sizeMap = {
  sm: { icon: 16, text: 'text-sm' },
  md: { icon: 24, text: 'text-base' },
  lg: { icon: 32, text: 'text-lg' }
}

export function LoadingState({
  size = 'md',
  text = 'Loading...',
  variant = 'spinner',
  fullScreen = false,
  className
}: LoadingStateProps) {
  const containerClasses = cn(
    'flex flex-col items-center justify-center gap-3',
    fullScreen && 'fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50',
    !fullScreen && 'p-8',
    className
  )

  const renderLoader = () => {
    switch (variant) {
      case 'spinner':
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Loader2 className={cn('text-purple-500', `w-${sizeMap[size].icon} h-${sizeMap[size].icon}`)} />
          </motion.div>
        )
      
      case 'dots':
        return (
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className={cn(
                  'rounded-full bg-purple-500',
                  size === 'sm' && 'w-2 h-2',
                  size === 'md' && 'w-3 h-3',
                  size === 'lg' && 'w-4 h-4'
                )}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        )
      
      case 'pulse':
        return (
          <div className="relative">
            <motion.div
              className={cn(
                'rounded-full bg-purple-500/20',
                size === 'sm' && 'w-12 h-12',
                size === 'md' && 'w-16 h-16',
                size === 'lg' && 'w-20 h-20'
              )}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.2, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
            />
            <motion.div
              className={cn(
                'absolute inset-0 rounded-full bg-purple-500',
                size === 'sm' && 'w-12 h-12',
                size === 'md' && 'w-16 h-16',
                size === 'lg' && 'w-20 h-20'
              )}
              animate={{
                scale: [0.8, 1, 0.8],
                opacity: [1, 0.5, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
            />
          </div>
        )
      
      case 'skeleton':
        return (
          <div className="w-full max-w-md space-y-4">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="h-4 bg-gray-800 rounded"
                animate={{
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.1
                }}
                style={{
                  width: `${100 - i * 20}%`
                }}
              />
            ))}
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className={containerClasses}>
      {renderLoader()}
      {text && variant !== 'skeleton' && (
        <p className={cn('text-gray-400', sizeMap[size].text)}>{text}</p>
      )}
    </div>
  )
}