'use client'

import { motion } from 'framer-motion'
import { 
  Rocket,
  Code2,
  Puzzle,
  Shield,
  Database,
  Cpu,
  Globe,
  Settings
} from 'lucide-react'

const categories = [
  {
    id: 'getting-started',
    name: 'Getting Started',
    icon: Rocket,
    count: 12,
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 'api-reference',
    name: 'API Reference',
    icon: Code2,
    count: 45,
    color: 'from-blue-500 to-cyan-600'
  },
  {
    id: 'plugins',
    name: 'Plugins',
    icon: Puzzle,
    count: 28,
    color: 'from-purple-500 to-pink-600'
  },
  {
    id: 'security',
    name: 'Security',
    icon: Shield,
    count: 8,
    color: 'from-red-500 to-orange-600'
  },
  {
    id: 'database',
    name: 'Database',
    icon: Database,
    count: 15,
    color: 'from-indigo-500 to-purple-600'
  },
  {
    id: 'ai-models',
    name: 'AI Models',
    icon: Cpu,
    count: 22,
    color: 'from-yellow-500 to-orange-600'
  },
  {
    id: 'deployment',
    name: 'Deployment',
    icon: Globe,
    count: 18,
    color: 'from-teal-500 to-cyan-600'
  },
  {
    id: 'configuration',
    name: 'Configuration',
    icon: Settings,
    count: 10,
    color: 'from-gray-500 to-gray-600'
  }
]

export function DocsCategories() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white mb-4">Categories</h3>
      
      {categories.map((category, index) => (
        <motion.button
          key={category.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ x: 4 }}
          className="w-full group"
        >
          <div className="relative p-4 rounded-xl bg-gray-900/80 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${category.color} opacity-20`}>
                  <category.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-white">{category.name}</span>
              </div>
              <span className="text-xs text-gray-400">{category.count}</span>
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  )
}