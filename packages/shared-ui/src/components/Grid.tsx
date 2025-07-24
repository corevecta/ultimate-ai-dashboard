import React from 'react'
import { BaseComponentProps } from '../types'
import { cn } from '../utils/cn'

interface GridProps extends BaseComponentProps, React.HTMLAttributes<HTMLDivElement> {
  cols?: number | { sm?: number; md?: number; lg?: number; xl?: number }
  gap?: 'sm' | 'md' | 'lg' | 'xl'
}

const gapStyles = {
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8'
}

export function Grid({ cols = 1, gap = 'md', className, children, ...props }: GridProps) {
  const getColsClass = () => {
    if (typeof cols === 'number') {
      return `grid-cols-${cols}`
    }
    
    const classes = ['grid-cols-1']
    if (cols.sm) classes.push(`sm:grid-cols-${cols.sm}`)
    if (cols.md) classes.push(`md:grid-cols-${cols.md}`)
    if (cols.lg) classes.push(`lg:grid-cols-${cols.lg}`)
    if (cols.xl) classes.push(`xl:grid-cols-${cols.xl}`)
    
    return classes.join(' ')
  }

  return (
    <div
      className={cn('grid', getColsClass(), gapStyles[gap], className)}
      {...props}
    >
      {children}
    </div>
  )
}