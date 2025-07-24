import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { TabItem, BaseComponentProps } from '../types'
import { cn } from '../utils/cn'

interface TabsProps extends BaseComponentProps {
  tabs: TabItem[]
  defaultTab?: string
  onChange?: (tabId: string) => void
  variant?: 'default' | 'pills' | 'underline'
}

const variantStyles = {
  default: {
    list: 'border-b border-white/10',
    tab: 'px-4 py-2 -mb-px border-b-2 transition-all',
    active: 'border-purple-500 text-white',
    inactive: 'border-transparent text-gray-400 hover:text-gray-300'
  },
  pills: {
    list: 'bg-gray-900/50 p-1 rounded-lg',
    tab: 'px-4 py-2 rounded-md transition-all',
    active: 'bg-purple-600 text-white',
    inactive: 'text-gray-400 hover:text-white hover:bg-white/10'
  },
  underline: {
    list: '',
    tab: 'px-4 py-2 relative transition-all',
    active: 'text-white',
    inactive: 'text-gray-400 hover:text-gray-300'
  }
}

export function Tabs({ tabs, defaultTab, onChange, variant = 'default', className }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)
  const styles = variantStyles[variant]

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId)
    onChange?.(tabId)
  }

  const activeTabData = tabs.find(tab => tab.id === activeTab)

  return (
    <div className={className}>
      <div className={cn('flex items-center gap-1', styles.list)}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            disabled={tab.disabled}
            className={cn(
              styles.tab,
              activeTab === tab.id ? styles.active : styles.inactive,
              tab.disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
            
            {variant === 'underline' && activeTab === tab.id && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"
                layoutId="underline"
              />
            )}
          </button>
        ))}
      </div>

      {activeTabData?.content && (
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-6"
        >
          {activeTabData.content}
        </motion.div>
      )}
    </div>
  )
}