import { forwardRef, InputHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-xl glass px-3 py-2 text-sm text-white placeholder:text-gray-400',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'transition-all duration-200',
          'hover:bg-white/10',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }