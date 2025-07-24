'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FileText,
  Clock,
  Eye,
  Heart,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Star
} from 'lucide-react'
import { DocViewer } from './doc-viewer'

const documents = [
  {
    id: 'doc-001',
    title: 'Quick Start Guide',
    description: 'Get up and running with our platform in under 5 minutes',
    category: 'Getting Started',
    readTime: '5 min',
    views: 12420,
    likes: 892,
    featured: true,
    updated: '2 days ago',
    tags: ['beginner', 'setup', 'tutorial']
  },
  {
    id: 'doc-002',
    title: 'API Authentication',
    description: 'Learn how to authenticate your API requests using JWT tokens',
    category: 'API Reference',
    readTime: '8 min',
    views: 8234,
    likes: 567,
    featured: true,
    updated: '1 week ago',
    tags: ['api', 'authentication', 'security']
  },
  {
    id: 'doc-003',
    title: 'Building Your First Plugin',
    description: 'Step-by-step guide to creating and publishing your first plugin',
    category: 'Plugins',
    readTime: '15 min',
    views: 6789,
    likes: 423,
    featured: false,
    updated: '3 days ago',
    tags: ['plugins', 'development', 'tutorial']
  },
  {
    id: 'doc-004',
    title: 'Database Best Practices',
    description: 'Optimize your database queries and schema design for better performance',
    category: 'Database',
    readTime: '12 min',
    views: 5432,
    likes: 321,
    featured: false,
    updated: '5 days ago',
    tags: ['database', 'performance', 'optimization']
  },
  {
    id: 'doc-005',
    title: 'AI Model Integration',
    description: 'Integrate state-of-the-art AI models into your applications',
    category: 'AI Models',
    readTime: '20 min',
    views: 9876,
    likes: 654,
    featured: true,
    updated: '1 day ago',
    tags: ['ai', 'machine-learning', 'integration']
  },
  {
    id: 'doc-006',
    title: 'Deployment Strategies',
    description: 'Best practices for deploying your applications to production',
    category: 'Deployment',
    readTime: '10 min',
    views: 4321,
    likes: 234,
    featured: false,
    updated: '1 week ago',
    tags: ['deployment', 'devops', 'production']
  }
]

export function DocsList() {
  const [selectedDoc, setSelectedDoc] = useState<any>(null)
  const [docViewerOpen, setDocViewerOpen] = useState(false)

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Getting Started': 'from-green-500 to-emerald-600',
      'API Reference': 'from-blue-500 to-cyan-600',
      'Plugins': 'from-purple-500 to-pink-600',
      'Database': 'from-indigo-500 to-purple-600',
      'AI Models': 'from-yellow-500 to-orange-600',
      'Deployment': 'from-teal-500 to-cyan-600'
    }
    return colors[category] || 'from-gray-500 to-gray-600'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Popular Articles</h3>
        <div className="flex items-center gap-4">
          <button className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            Trending
          </button>
          <button className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1">
            <Clock className="w-4 h-4" />
            Recent
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {documents.map((doc, index) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative group"
          >
            {/* Featured badge */}
            {doc.featured && (
              <div className="absolute -top-2 -right-2 z-10">
                <div className="p-2 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 shadow-lg">
                  <Star className="w-4 h-4 text-white" />
                </div>
              </div>
            )}
            
            {/* Card */}
            <motion.div
              whileHover={{ y: -4 }}
              onClick={() => {
                setSelectedDoc(doc)
                setDocViewerOpen(true)
              }}
              className="h-full bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-white/20 transition-all overflow-hidden cursor-pointer"
            >
              {/* Category bar */}
              <div className={`h-1 bg-gradient-to-r ${getCategoryColor(doc.category)}`} />
              
              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-gray-400">{doc.category}</span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-400">{doc.readTime} read</span>
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2">{doc.title}</h4>
                    <p className="text-sm text-gray-400 line-clamp-2">{doc.description}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <ExternalLink className="w-5 h-5 text-gray-400" />
                  </motion.button>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {doc.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-gray-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-sm text-gray-400">
                      <Eye className="w-4 h-4" />
                      <span>{doc.views.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-400">
                      <Heart className="w-4 h-4" />
                      <span>{doc.likes}</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">Updated {doc.updated}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Load more button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex justify-center mt-8"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-all flex items-center gap-2"
        >
          Load More Articles
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </motion.div>

      {/* Doc Viewer */}
      <DocViewer 
        isOpen={docViewerOpen}
        onClose={() => {
          setDocViewerOpen(false)
          setSelectedDoc(null)
        }}
        doc={selectedDoc}
      />
    </div>
  )
}