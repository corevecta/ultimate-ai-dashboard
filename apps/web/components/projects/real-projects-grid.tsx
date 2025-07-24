'use client'

import { motion } from 'framer-motion'
import { 
  FileCode, 
  Globe, 
  Smartphone,
  Chrome,
  Puzzle,
  Terminal,
  Package,
  MoreVertical,
  Play,
  CheckCircle,
  Clock,
  Search,
  Filter
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Project {
  id: string
  name: string
  type: string
  description: string
  status: string
  hasSpecification: boolean
  hasMarketEnhanced: boolean
  createdAt?: string
  features?: {
    core: number
    advanced: number
  }
  market?: {
    tam?: string
    sam?: string
  }
}

interface ProjectsResponse {
  projects: Project[]
  total: number
  page: number
  limit: number
  totalPages: number
  projectTypes: string[]
  stats: {
    total: number
    withSpecification: number
    withMarketEnhanced: number
  }
}

const typeIcons: Record<string, any> = {
  'chrome-extension': Chrome,
  'web-app': Globe,
  'mobile-app': Smartphone,
  'vscode-extension': FileCode,
  'api': Terminal,
  'cli-tool': Terminal,
  'desktop-app': Package,
  'wordpress-plugin': Puzzle,
  'firefox-extension': Globe,
  'edge-extension': Globe,
}

const getProjectIcon = (type: string) => {
  return typeIcons[type] || Package
}

export function RealProjectsGrid() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [projectTypes, setProjectTypes] = useState<string[]>([])
  const [stats, setStats] = useState({ total: 0, withSpecification: 0, withMarketEnhanced: 0 })

  useEffect(() => {
    fetchProjects()
  }, [page, searchQuery, selectedType])

  async function fetchProjects() {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        search: searchQuery,
        type: selectedType === 'all' ? '' : selectedType
      })
      
      const response = await fetch(`/api/projects?${params}`)
      if (response.ok) {
        const data: ProjectsResponse = await response.json()
        setProjects(data.projects)
        setTotalPages(data.totalPages)
        setProjectTypes(data.projectTypes)
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    } finally {
      setLoading(false)
    }
  }

  async function runPipeline(projectId: string) {
    try {
      // Create a workflow to run this project through the pipeline
      const response = await fetch('/api/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: projectId,
          name: `Generate ${projectId}`,
          description: `Run pipeline steps 2-8 for ${projectId}`,
          type: 'pipeline-execution'
        })
      })
      
      if (response.ok) {
        const workflow = await response.json()
        // Execute the workflow
        await fetch(`/api/workflows/${workflow.id}/execute`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({})
        })
        
        // Redirect to workflows page to see progress
        window.location.href = '/workflows'
      }
    } catch (error) {
      console.error('Failed to run pipeline:', error)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-900/50 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-white/10 p-4">
          <div className="text-sm text-gray-400">Total Projects</div>
          <div className="text-2xl font-bold text-white">{stats.total.toLocaleString()}</div>
        </div>
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-white/10 p-4">
          <div className="text-sm text-gray-400">With Specifications</div>
          <div className="text-2xl font-bold text-green-400">{stats.withSpecification.toLocaleString()}</div>
        </div>
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-white/10 p-4">
          <div className="text-sm text-gray-400">Market Enhanced</div>
          <div className="text-2xl font-bold text-purple-400">{stats.withMarketEnhanced.toLocaleString()}</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setPage(1)
              }}
              className="pl-10 bg-gray-900/50 border-white/10 focus:border-purple-500/50"
            />
          </div>
        </div>
        <Select value={selectedType} onValueChange={(value) => {
          setSelectedType(value)
          setPage(1)
        }}>
          <SelectTrigger className="w-[200px] bg-gray-900/50 border-white/10">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {projectTypes.map(type => (
              <SelectItem key={type} value={type}>
                {type.replace(/-/g, ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => {
          const Icon = getProjectIcon(project.type)
          
          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative h-full bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white truncate">{project.name}</h3>
                      <p className="text-xs text-gray-400">{project.type.replace(/-/g, ' ')}</p>
                    </div>
                  </div>
                  <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">{project.description}</p>

                {/* Status */}
                <div className="flex items-center gap-2 mb-4">
                  {project.hasSpecification ? (
                    <div className="flex items-center gap-1 text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-xs">Specification Ready</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs">Pending</span>
                    </div>
                  )}
                  {project.hasMarketEnhanced && (
                    <div className="text-xs text-purple-400">Market Enhanced</div>
                  )}
                </div>

                {/* Features */}
                {project.features && (
                  <div className="grid grid-cols-2 gap-2 mb-4 text-center">
                    <div className="bg-gray-800/50 rounded-lg p-2">
                      <p className="text-xs text-gray-400">Core Features</p>
                      <p className="text-sm font-medium text-white">{project.features.core}</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-2">
                      <p className="text-xs text-gray-400">Advanced</p>
                      <p className="text-sm font-medium text-white">{project.features.advanced}</p>
                    </div>
                  </div>
                )}

                {/* Market Data */}
                {project.market?.tam && (
                  <div className="text-xs text-gray-500 mb-4">
                    TAM: {project.market.tam}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <span className="text-xs text-gray-400">{project.id}</span>
                  {project.hasSpecification && (
                    <Button
                      size="sm"
                      onClick={() => runPipeline(project.id)}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      <Play className="w-3 h-3 mr-1" />
                      Run Pipeline
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="border-white/10 hover:bg-white/5"
          >
            Previous
          </Button>
          <span className="text-sm text-gray-400">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="border-white/10 hover:bg-white/5"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}