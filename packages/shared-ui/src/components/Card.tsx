import React from 'react'
import { motion } from 'framer-motion'
import { BaseComponentProps } from '../types'
import { cn } from '../utils/cn'

interface CardProps extends BaseComponentProps, React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'gradient' | 'bordered'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  animate?: boolean
  glow?: boolean
  glowColor?: string
}

const variantStyles = {
  default: 'bg-gray-900 border-gray-800',
  glass: 'bg-white/10 backdrop-blur-xl border-white/10 hover:border-white/20',
  gradient: 'bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-500/20',
  bordered: 'bg-transparent border-white/20'
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-10'
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ 
    variant = 'glass',
    padding = 'md',
    animate = true,
    glow = false,
    glowColor = 'from-purple-500 to-blue-500',
    className,
    children,
    ...props
  }, ref) => {
    const cardClasses = cn(
      'relative rounded-xl border transition-all duration-300',
      variantStyles[variant],
      paddingStyles[padding],
      className
    )

    const content = (
      <>
        {/* Glow effect */}
        {glow && (
          <div
            className={cn(
              "absolute -inset-1 bg-gradient-to-r rounded-xl blur-lg opacity-30 group-hover:opacity-60 transition-opacity duration-500",
              glowColor
            )}
          />
        )}

        {/* Background pattern for glass variant */}
        {variant === 'glass' && (
          <div className="absolute inset-0 rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
          </div>
        )}

        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </>
    )

    if (animate) {
      return (
        <motion.div
          ref={ref}
          className={cn(cardClasses, glow && 'group')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -2 }}
          transition={{ duration: 0.3 }}
          onClick={props.onClick}
          onMouseEnter={props.onMouseEnter}
          onMouseLeave={props.onMouseLeave}
          style={props.style}
        >
          {content}
        </motion.div>
      )
    }

    return (
      <div ref={ref} className={cn(cardClasses, glow && 'group')} {...props}>
        {content}
      </div>
    )
  }
)

Card.displayName = 'Card'