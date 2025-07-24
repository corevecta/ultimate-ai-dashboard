'use client'

import { motion, AnimatePresence } from 'framer-motion'
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
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  SortAsc,
  SortDesc,
  X,
  Sparkles,
  TrendingUp,
  BarChart3
} from 'lucide-react'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'
import debounce from 'lodash/debounce'

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

const pageSizeOptions = [12, 24, 48, 96]

const sortOptions = [
  { value: 'name', label: 'Name' },
  { value: 'type', label: 'Type' },
  { value: 'status', label: 'Status' },
  { value: 'features', label: 'Features Count' },
  { value: 'date', label: 'Created Date' }
]

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'specification-ready', label: 'Specification Ready' },
  { value: 'market-enhanced', label: 'Market Enhanced' },
  { value: 'pending', label: 'Pending' }
]

function getProjectIcon(type: string) {
  const iconMap: Record<string, any> = {
    'web-app': Globe,
    'mobile-app': Smartphone,
    'chrome-extension': Chrome,
    'plugin': Puzzle,
    'cli-tool': Terminal,
    'package': Package
  }
  return iconMap[type] || FileCode
}

export function EnhancedProjectsGrid() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(24)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [hasFeatures, setHasFeatures] = useState('')
  const [hasMarket, setHasMarket] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [projectTypes, setProjectTypes] = useState<string[]>([])
  const [stats, setStats] = useState({ total: 0, withSpecification: 0, withMarketEnhanced: 0 })
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set())

  // Debounced search function
  const debouncedFetch = useCallback(
    debounce(async (params: Record<string, string>) => {
      try {
        setLoading(true)
        const queryParams = new URLSearchParams(params)
        const response = await fetch(`/api/projects?${queryParams}`)
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
    }, 300),
    []
  )

  useEffect(() => {
    const params: Record<string, string> = {
      page: page.toString(),
      limit: pageSize.toString(),
      search: searchQuery,
      type: selectedType === 'all' ? '' : selectedType,
      status: selectedStatus,
      hasFeatures,
      hasMarket,
      sortBy,
      sortOrder
    }
    
    debouncedFetch(params)
  }, [page, pageSize, searchQuery, selectedType, selectedStatus, hasFeatures, hasMarket, sortBy, sortOrder])

  const toggleProjectSelection = (projectId: string) => {
    const newSelection = new Set(selectedProjects)
    if (newSelection.has(projectId)) {
      newSelection.delete(projectId)
    } else {
      newSelection.add(projectId)
    }
    setSelectedProjects(newSelection)
  }

  const selectAllProjects = () => {
    if (selectedProjects.size === projects.length) {
      setSelectedProjects(new Set())
    } else {
      setSelectedProjects(new Set(projects.map(p => p.id)))
    }
  }

  async function runPipeline(projectId: string) {
    try {
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
        // TODO: Show success notification and redirect to workflow detail
        console.log('Pipeline started:', workflow)
      }
    } catch (error) {
      console.error('Failed to start pipeline:', error)
    }
  }

  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (searchQuery) count++
    if (selectedType !== 'all') count++
    if (selectedStatus) count++
    if (hasFeatures) count++
    if (hasMarket) count++
    return count
  }, [searchQuery, selectedType, selectedStatus, hasFeatures, hasMarket])

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-400 text-sm">Total Projects</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.total.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-xl bg-purple-500/20">
              <Package className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 backdrop-blur-xl rounded-2xl border border-blue-500/20 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-400 text-sm">With Specifications</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.withSpecification.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/20">
              <CheckCircle className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-900/20 to-green-800/20 backdrop-blur-xl rounded-2xl border border-green-500/20 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-400 text-sm">Market Enhanced</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.withMarketEnhanced.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-xl bg-green-500/20">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search by name, description, type, or ID..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setPage(1)
                }}
                className="pl-10 bg-gray-900/50 border-white/10 focus:border-purple-500/50"
              />
            </div>
          </div>

          {/* Basic Filters */}
          <div className="flex gap-3">
            <Select value={selectedType} onValueChange={(value) => {
              setSelectedType(value)
              setPage(1)
            }}>
              <SelectTrigger className="w-[180px] bg-gray-900/50 border-white/10">
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

            <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
              <SelectTrigger className="w-[180px] bg-gray-900/50 border-white/10">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="bg-gray-900/50 border-white/10"
            >
              {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
            </Button>

            <Button
              variant="outline"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={cn(
                "bg-gray-900/50 border-white/10",
                activeFiltersCount > 2 && "border-purple-500/50 text-purple-400"
              )}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {activeFiltersCount > 2 && (
                <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-purple-500/20 text-purple-400 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showAdvancedFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Status Filter */}
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={selectedStatus} onValueChange={(value) => {
                      setSelectedStatus(value)
                      setPage(1)
                    }}>
                      <SelectTrigger className="bg-gray-800/50 border-white/10">
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Features Filter */}
                  <div className="space-y-2">
                    <Label>Features</Label>
                    <Select value={hasFeatures} onValueChange={(value) => {
                      setHasFeatures(value)
                      setPage(1)
                    }}>
                      <SelectTrigger className="bg-gray-800/50 border-white/10">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Any</SelectItem>
                        <SelectItem value="yes">Has Features</SelectItem>
                        <SelectItem value="no">No Features</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Market Analysis Filter */}
                  <div className="space-y-2">
                    <Label>Market Analysis</Label>
                    <Select value={hasMarket} onValueChange={(value) => {
                      setHasMarket(value)
                      setPage(1)
                    }}>
                      <SelectTrigger className="bg-gray-800/50 border-white/10">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Any</SelectItem>
                        <SelectItem value="yes">Has Market Data</SelectItem>
                        <SelectItem value="no">No Market Data</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Page Size */}
                  <div className="space-y-2">
                    <Label>Items per page</Label>
                    <Select value={pageSize.toString()} onValueChange={(value) => {
                      setPageSize(parseInt(value))
                      setPage(1)
                    }}>
                      <SelectTrigger className="bg-gray-800/50 border-white/10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {pageSizeOptions.map(size => (
                          <SelectItem key={size} value={size.toString()}>
                            {size} items
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Clear Filters */}
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedType('all')
                      setSelectedStatus('')
                      setHasFeatures('')
                      setHasMarket('')
                      setSortBy('name')
                      setSortOrder('asc')
                      setPage(1)
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear all filters
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {selectedProjects.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-purple-900/20 backdrop-blur-xl rounded-xl border border-purple-500/20 p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <p className="text-purple-400">
                {selectedProjects.size} project{selectedProjects.size !== 1 ? 's' : ''} selected
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={selectAllProjects}
                className="text-purple-400 hover:text-purple-300"
              >
                {selectedProjects.size === projects.length ? 'Deselect all' : 'Select all'}
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="border-purple-500/50 text-purple-400 hover:bg-purple-500/20"
                onClick={() => {
                  // TODO: Implement bulk pipeline run
                  console.log('Running pipeline for:', Array.from(selectedProjects))
                }}
              >
                <Play className="h-4 w-4 mr-2" />
                Run Pipeline ({selectedProjects.size})
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedProjects(new Set())}
                className="text-gray-400"
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-testid="projects-grid">
          {[...Array(pageSize)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-900/50 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-testid="projects-grid">
          {projects.map((project, index) => {
            const Icon = getProjectIcon(project.type)
            const isSelected = selectedProjects.has(project.id)
            
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                className="relative group"
              >
                <div className={cn(
                  "absolute -inset-1 bg-gradient-to-r rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500",
                  isSelected 
                    ? "from-purple-500/40 to-blue-500/40 opacity-100" 
                    : "from-purple-500/20 to-blue-500/20"
                )} />
                
                <div className={cn(
                  "relative h-full bg-gray-900/80 backdrop-blur-xl rounded-2xl border p-6 transition-all duration-300",
                  isSelected 
                    ? "border-purple-500/50 bg-purple-900/20" 
                    : "border-white/10 hover:border-white/20"
                )}>
                  {/* Selection Checkbox */}
                  <div className="absolute top-4 left-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleProjectSelection(project.id)}
                      className="w-4 h-4 rounded border-gray-600 text-purple-600 focus:ring-purple-500 focus:ring-offset-0 bg-gray-800"
                    />
                  </div>

                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 pl-6">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit Project</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-400">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white line-clamp-1">{project.name}</h3>
                      <p className="text-sm text-gray-400">{project.type.replace(/-/g, ' ')}</p>
                    </div>

                    <p className="text-sm text-gray-400 line-clamp-2">{project.description}</p>

                    {/* Features & Market */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {project.hasSpecification && (
                        <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Specification Ready
                        </Badge>
                      )}
                      {project.hasMarketEnhanced && (
                        <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Market Enhanced
                        </Badge>
                      )}
                      {project.features && (project.features.core > 0 || project.features.advanced > 0) && (
                        <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                          <Sparkles className="w-3 h-3 mr-1" />
                          {project.features.core + project.features.advanced} features
                        </Badge>
                      )}
                      {project.market && project.market.tam && (
                        <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                          <BarChart3 className="w-3 h-3 mr-1" />
                          TAM: {project.market.tam}
                        </Badge>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="pt-2">
                      {project.hasSpecification ? (
                        <Button
                          size="sm"
                          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                          onClick={() => runPipeline(project.id)}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Run Pipeline
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full border-white/10"
                          disabled
                        >
                          <Clock className="w-4 h-4 mr-2" />
                          Pending Specification
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-400">
          Showing {Math.min((page - 1) * pageSize + 1, stats.total)} to {Math.min(page * pageSize, stats.total)} of {stats.total} projects
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="bg-gray-900/50 border-white/10"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            {/* Show first page */}
            {page > 3 && (
              <>
                <Button
                  variant={page === 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPage(1)}
                  className={page === 1 ? "" : "bg-gray-900/50 border-white/10"}
                >
                  1
                </Button>
                {page > 4 && <span className="text-gray-400">...</span>}
              </>
            )}

            {/* Show pages around current page */}
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              const pageNum = Math.max(1, Math.min(page - 2 + i, totalPages - 4 + i))
              if (pageNum < 1 || pageNum > totalPages) return null
              if (Math.abs(pageNum - page) > 2) return null
              
              return (
                <Button
                  key={pageNum}
                  variant={page === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPage(pageNum)}
                  className={page === pageNum ? "" : "bg-gray-900/50 border-white/10"}
                >
                  {pageNum}
                </Button>
              )
            })}

            {/* Show last page */}
            {page < totalPages - 2 && (
              <>
                {page < totalPages - 3 && <span className="text-gray-400">...</span>}
                <Button
                  variant={page === totalPages ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPage(totalPages)}
                  className={page === totalPages ? "" : "bg-gray-900/50 border-white/10"}
                >
                  {totalPages}
                </Button>
              </>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="bg-gray-900/50 border-white/10"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  )
}