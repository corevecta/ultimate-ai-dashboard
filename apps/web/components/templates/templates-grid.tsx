'use client'

import { motion } from 'framer-motion'
import { 
  Star, 
  Download, 
  Eye, 
  Clock,
  Code2,
  Layers,
  Zap
} from 'lucide-react'
import { useState } from 'react'

const templates = [
  {
    id: '1',
    name: 'Modern SaaS Dashboard',
    description: 'Full-featured SaaS dashboard with authentication, billing, and analytics',
    category: 'web',
    image: '/api/placeholder/400/200',
    stars: 1240,
    downloads: 8500,
    views: 25000,
    tech: ['Next.js', 'TypeScript', 'Tailwind', 'Prisma'],
    gradient: 'from-blue-500 to-purple-600',
    featured: true
  },
  {
    id: '2',
    name: 'E-Commerce Marketplace',
    description: 'Multi-vendor marketplace with payment processing and inventory management',
    category: 'ecommerce',
    image: '/api/placeholder/400/200',
    stars: 980,
    downloads: 6200,
    views: 18000,
    tech: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    gradient: 'from-orange-500 to-red-600'
  },
  {
    id: '3',
    name: 'AI Chat Application',
    description: 'Real-time chat app with AI-powered features and voice/video calls',
    category: 'web',
    image: '/api/placeholder/400/200',
    stars: 1560,
    downloads: 9800,
    views: 32000,
    tech: ['React Native', 'WebRTC', 'Socket.io', 'OpenAI'],
    gradient: 'from-green-500 to-emerald-600',
    featured: true
  },
  {
    id: '4',
    name: 'Healthcare Portal',
    description: 'Patient management system with appointment scheduling and telemedicine',
    category: 'health',
    image: '/api/placeholder/400/200',
    stars: 720,
    downloads: 4500,
    views: 12000,
    tech: ['Vue.js', 'Express', 'PostgreSQL', 'Docker'],
    gradient: 'from-red-500 to-pink-600'
  }
]

export function TemplatesGrid() {
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template, index) => (
        <motion.div
          key={template.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onMouseEnter={() => setHoveredTemplate(template.id)}
          onMouseLeave={() => setHoveredTemplate(null)}
          className="relative group"
        >
          {/* Featured badge */}
          {template.featured && (
            <div className="absolute -top-2 -right-2 z-10">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-md" />
                <div className="relative px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full">
                  <span className="text-xs font-bold text-white">FEATURED</span>
                </div>
              </motion.div>
            </div>
          )}

          {/* Card */}
          <div className="relative h-full bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-all">
            {/* Image with overlay */}
            <div className="relative h-48 overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-br ${template.gradient} opacity-80`} />
              <div className="absolute inset-0 bg-black/20" />
              
              {/* Tech stack icons */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                {template.tech.slice(0, 3).map((tech, i) => (
                  <div
                    key={tech}
                    className="px-2 py-1 rounded-md bg-black/50 backdrop-blur-sm border border-white/20"
                  >
                    <span className="text-xs text-white/90">{tech}</span>
                  </div>
                ))}
                {template.tech.length > 3 && (
                  <div className="px-2 py-1 rounded-md bg-black/50 backdrop-blur-sm border border-white/20">
                    <span className="text-xs text-white/90">+{template.tech.length - 3}</span>
                  </div>
                )}
              </div>

              {/* Hover preview button */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredTemplate === template.id ? 1 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white font-medium flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </motion.button>
              </motion.div>
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-2">{template.name}</h3>
              <p className="text-sm text-gray-400 mb-4 line-clamp-2">{template.description}</p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-300">{template.stars.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Download className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-300">{template.downloads.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-300">{template.views.toLocaleString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  Use Template
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                >
                  <Code2 className="w-4 h-4 text-gray-400" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}