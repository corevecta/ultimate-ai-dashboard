import React from 'react'
import { motion } from 'framer-motion'
import { Variant, Size, BaseComponentProps } from '../types'
import { cn } from '../utils/cn'

interface ButtonProps extends BaseComponentProps, React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
  animate?: boolean
}

const variantStyles: Record<Variant, string> = {
  primary: 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-transparent',
  secondary: 'bg-gray-800 hover:bg-gray-700 text-white border-gray-700',
  danger: 'bg-red-600 hover:bg-red-700 text-white border-transparent',
  warning: 'bg-yellow-600 hover:bg-yellow-700 text-white border-transparent',
  success: 'bg-green-600 hover:bg-green-700 text-white border-transparent',
  info: 'bg-blue-600 hover:bg-blue-700 text-white border-transparent',
  ghost: 'bg-transparent hover:bg-white/10 text-gray-300 hover:text-white border-transparent',
  outline: 'bg-transparent hover:bg-white/5 text-gray-300 hover:text-white border-white/20 hover:border-white/40'
}

const sizeStyles: Record<Size, string> = {
  xs: 'text-xs px-2 py-1 h-6',
  sm: 'text-sm px-3 py-1.5 h-8',
  md: 'text-sm px-4 py-2 h-10',
  lg: 'text-base px-6 py-3 h-12',
  xl: 'text-lg px-8 py-4 h-14'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'primary',
    size = 'md',
    loading = false,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    animate = true,
    className,
    children,
    disabled,
    ...props
  }, ref) => {
    const buttonClasses = cn(
      'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 border',
      'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      variantStyles[variant],
      sizeStyles[size],
      fullWidth && 'w-full',
      className
    )

    const content = (
      <>
        {loading && (
          <svg 
            className="animate-spin h-4 w-4" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!loading && icon && iconPosition === 'left' && icon}
        {children}
        {!loading && icon && iconPosition === 'right' && icon}
      </>
    )

    if (animate && !disabled) {
      return (
        <motion.button
          ref={ref}
          className={buttonClasses}
          disabled={disabled || loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.1 }}
          onClick={props.onClick}
          onMouseDown={props.onMouseDown}
          onMouseUp={props.onMouseUp}
          onMouseEnter={props.onMouseEnter}
          onMouseLeave={props.onMouseLeave}
          type={props.type}
        >
          {content}
        </motion.button>
      )
    }

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || loading}
        {...props}
      >
        {content}
      </button>
    )
  }
)

Button.displayName = 'Button'