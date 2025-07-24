import React from 'react'
import { BaseComponentProps } from '../types'
import { cn } from '../utils/cn'

interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface SelectProps extends BaseComponentProps, Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  options: SelectOption[]
  placeholder?: string
  error?: boolean
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, placeholder, error, className, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          'w-full px-3 py-2 bg-gray-900/50 backdrop-blur-sm border rounded-lg',
          'text-white placeholder-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent',
          'transition-all duration-200',
          error ? 'border-red-500' : 'border-white/10 hover:border-white/20',
          className
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
            className="bg-gray-900"
          >
            {option.label}
          </option>
        ))}
      </select>
    )
  }
)

Select.displayName = 'Select'