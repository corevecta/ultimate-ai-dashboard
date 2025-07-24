'use client'

import { motion } from 'framer-motion'
import { 
  Globe, 
  ShoppingCart, 
  Gamepad2, 
  Briefcase, 
  Heart, 
  GraduationCap,
  Rocket,
  Smartphone
} from 'lucide-react'
import { useState } from 'react'

const categories = [
  { id: 'all', name: 'All Templates', icon: Rocket, count: 156, color: 'from-purple-500 to-pink-600' },
  { id: 'web', name: 'Web Apps', icon: Globe, count: 42, color: 'from-blue-500 to-cyan-600' },
  { id: 'ecommerce', name: 'E-Commerce', icon: ShoppingCart, count: 28, color: 'from-orange-500 to-red-600' },
  { id: 'mobile', name: 'Mobile', icon: Smartphone, count: 24, color: 'from-green-500 to-emerald-600' },
  { id: 'games', name: 'Games', icon: Gamepad2, count: 18, color: 'from-purple-500 to-indigo-600' },
  { id: 'business', name: 'Business', icon: Briefcase, count: 22, color: 'from-yellow-500 to-orange-600' },
  { id: 'health', name: 'Healthcare', icon: Heart, count: 12, color: 'from-red-500 to-pink-600' },
  { id: 'education', name: 'Education', icon: GraduationCap, count: 10, color: 'from-indigo-500 to-purple-600' }
]

export function TemplateCategories() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
      {categories.map((category, index) => (
        <motion.button
          key={category.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelectedCategory(category.id)}
          className={`relative group p-4 rounded-xl transition-all ${
            selectedCategory === category.id
              ? 'bg-white/10 border-white/20'
              : 'bg-white/5 border-white/10 hover:bg-white/10'
          } border`}
        >
          {/* Glow effect */}
          {selectedCategory === category.id && (
            <div className={`absolute -inset-1 bg-gradient-to-r ${category.color} rounded-xl blur-lg opacity-30`} />
          )}
          
          <div className="relative flex flex-col items-center gap-2">
            <div className={`p-3 rounded-lg bg-gradient-to-br ${category.color} opacity-80`}>
              <category.icon className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-medium text-white">{category.name}</span>
            <span className="text-xs text-gray-400">{category.count}</span>
          </div>
        </motion.button>
      ))}
    </div>
  )
}