'use client'

import { motion } from 'framer-motion'
import { 
  User, 
  Shield, 
  Bell, 
  Palette, 
  Database,
  Key,
  Globe,
  Cpu,
  Activity
} from 'lucide-react'
import { useState } from 'react'

const settingsCategories = [
  { id: 'general', name: 'General', icon: User, color: 'from-blue-500 to-cyan-600' },
  { id: 'security', name: 'Security', icon: Shield, color: 'from-green-500 to-emerald-600' },
  { id: 'notifications', name: 'Notifications', icon: Bell, color: 'from-purple-500 to-pink-600' },
  { id: 'appearance', name: 'Appearance', icon: Palette, color: 'from-orange-500 to-red-600' },
  { id: 'database', name: 'Database', icon: Database, color: 'from-indigo-500 to-purple-600' },
  { id: 'api', name: 'API Keys', icon: Key, color: 'from-yellow-500 to-amber-600' },
  { id: 'integrations', name: 'Integrations', icon: Globe, color: 'from-teal-500 to-cyan-600' },
  { id: 'performance', name: 'Performance', icon: Cpu, color: 'from-pink-500 to-rose-600' },
  { id: 'monitoring', name: 'Monitoring', icon: Activity, color: 'from-gray-500 to-slate-600' }
]

export function SettingsSidebar() {
  const [selectedCategory, setSelectedCategory] = useState('general')

  return (
    <div className="space-y-2">
      {settingsCategories.map((category, index) => {
        const Icon = category.icon
        const isSelected = selectedCategory === category.id

        return (
          <motion.button
            key={category.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedCategory(category.id)}
            className={`relative w-full group ${isSelected ? '' : ''}`}
          >
            {/* Glow effect */}
            {isSelected && (
              <div className={`absolute -inset-1 bg-gradient-to-r ${category.color} rounded-xl blur-lg opacity-30`} />
            )}
            
            <div className={`relative flex items-center gap-3 p-4 rounded-xl transition-all ${
              isSelected 
                ? 'bg-white/10 border border-white/20' 
                : 'bg-white/5 border border-white/10 hover:bg-white/10'
            }`}>
              <div className={`p-2 rounded-lg bg-gradient-to-br ${category.color} opacity-80`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <span className={`text-sm font-medium ${
                isSelected ? 'text-white' : 'text-gray-400'
              }`}>
                {category.name}
              </span>
              
              {isSelected && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-white to-white/50 rounded-full"
                />
              )}
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}