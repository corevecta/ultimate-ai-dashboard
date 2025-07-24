import React from 'react'
import { ChevronRight } from 'lucide-react'
import { BaseComponentProps } from '../types'
import { cn } from '../utils/cn'

interface BreadcrumbItem {
  label: string
  href?: string
  onClick?: () => void
}

interface BreadcrumbProps extends BaseComponentProps {
  items: BreadcrumbItem[]
  separator?: React.ReactNode
}

export function Breadcrumb({ items, separator, className }: BreadcrumbProps) {
  const defaultSeparator = <ChevronRight className="w-4 h-4 text-gray-500" />

  return (
    <nav className={cn('flex items-center space-x-2', className)}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <span className="flex items-center">
              {separator || defaultSeparator}
            </span>
          )}
          
          {item.href || item.onClick ? (
            <a
              href={item.href}
              onClick={item.onClick}
              className={cn(
                'text-sm transition-colors',
                index === items.length - 1
                  ? 'text-white font-medium'
                  : 'text-gray-400 hover:text-white'
              )}
            >
              {item.label}
            </a>
          ) : (
            <span
              className={cn(
                'text-sm',
                index === items.length - 1
                  ? 'text-white font-medium'
                  : 'text-gray-400'
              )}
            >
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}