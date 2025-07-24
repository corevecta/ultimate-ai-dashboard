'use client'

import { motion } from 'framer-motion'
import { 
  Folder, 
  GitBranch, 
  Clock, 
  Users, 
  MoreVertical,
  Star,
  TrendingUp,
  Zap,
  Shield,
  Globe,
  Cpu,
  BarChart3
} from 'lucide-react'
import { useState } from 'react'

const projects = [
  {
    id: '1',
    name: 'E-Commerce Platform',
    description: 'Next-gen shopping experience with AI recommendations',
    status: 'active',
    progress: 75,
    team: 4,
    lastUpdated: '2 hours ago',
    icon: Globe,
    color: 'from-blue-500 to-cyan-500',
    metrics: { commits: 234, issues: 12, stars: 45 }
  },
  {
    id: '2',
    name: 'Analytics Dashboard',
    description: 'Real-time data visualization and insights',
    status: 'active',
    progress: 90,
    team: 3,
    lastUpdated: '5 hours ago',
    icon: BarChart3,
    color: 'from-purple-500 to-pink-500',
    metrics: { commits: 567, issues: 8, stars: 89 }
  },
  {
    id: '3',
    name: 'Security Suite',
    description: 'Enterprise-grade security monitoring system',
    status: 'paused',
    progress: 45,
    team: 5,
    lastUpdated: '1 day ago',
    icon: Shield,
    color: 'from-green-500 to-emerald-500',
    metrics: { commits: 123, issues: 23, stars: 34 }
  },
  {
    id: '4',
    name: 'AI Assistant',
    description: 'Intelligent automation for daily tasks',
    status: 'active',
    progress: 60,
    team: 6,
    lastUpdated: '3 hours ago',
    icon: Cpu,
    color: 'from-orange-500 to-red-500',
    metrics: { commits: 890, issues: 15, stars: 156 }
  }
]

const statusColors: Record<string, string> = {
  active: 'bg-green-500',
  paused: 'bg-yellow-500',
  completed: 'bg-blue-500'
}

export function ProjectsGrid() {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onMouseEnter={() => setHoveredProject(project.id)}
          onMouseLeave={() => setHoveredProject(null)}
          className="relative group"
        >
          {/* Glow effect */}
          <div
            className={`absolute -inset-1 bg-gradient-to-r ${project.color} rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500`}
          />

          {/* Card */}
          <div className="relative h-full bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${project.color} bg-opacity-20`}>
                  <project.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-2 h-2 rounded-full ${statusColors[project.status]}`} />
                    <span className="text-xs text-gray-400 capitalize">{project.status}</span>
                  </div>
                </div>
              </div>
              <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-400 mb-6">{project.description}</p>

            {/* Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-400">Progress</span>
                <span className="text-white font-medium">{project.progress}%</span>
              </div>
              <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className={`absolute inset-y-0 left-0 bg-gradient-to-r ${project.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${project.progress}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                />
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <GitBranch className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                <p className="text-sm font-medium text-white">{project.metrics.commits}</p>
                <p className="text-xs text-gray-400">Commits</p>
              </div>
              <div className="text-center">
                <TrendingUp className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                <p className="text-sm font-medium text-white">{project.metrics.issues}</p>
                <p className="text-xs text-gray-400">Issues</p>
              </div>
              <div className="text-center">
                <Star className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                <p className="text-sm font-medium text-white">{project.metrics.stars}</p>
                <p className="text-xs text-gray-400">Stars</p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">{project.team} members</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">{project.lastUpdated}</span>
              </div>
            </div>

            {/* Hover effect */}
            <motion.div
              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 pointer-events-none"
              animate={{ opacity: hoveredProject === project.id ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  )
}