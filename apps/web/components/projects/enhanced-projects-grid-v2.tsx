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
  BarChart3,
  Zap,
  Eye,
  Edit,
  Trash2,
  Copy,
  Download,
  History,
  FileText,
  FileX,
  RefreshCw
} from 'lucide-react'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import debounce from 'lodash/debounce'
import dynamic from 'next/dynamic'
import { MarkdownContent } from '@/components/ui/markdown-content'

// Dynamically import the pipeline executor to avoid SSR issues
const PipelineExecutor = dynamic(
  () => import('@/components/projects/pipeline-executor'),
  { ssr: false }
)
import Step0DialogV3 from './step0-dialog-v3'

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
    // Web
    'web-app': Globe,
    'static-site': Globe,
    'pwa-app': Smartphone,
    // Extensions
    'chrome-extension': Chrome,
    'firefox-extension': Chrome,
    'safari-extension': Chrome,
    'edge-extension': Chrome,
    'browser-extension': Chrome,
    // Desktop
    'electron-app': Package,
    'desktop-app': Package,
    'tauri-app': Package,
    // Mobile
    'mobile-app': Smartphone,
    'react-native-app': Smartphone,
    'flutter-app': Smartphone,
    'expo-app': Smartphone,
    // Dev Tools
    'vscode-extension': FileCode,
    'intellij-plugin': FileCode,
    'vim-plugin': Terminal,
    'sublime-package': FileCode,
    'cursor-extension': FileCode,
    'emacs-package': FileCode,
    // Backend
    'api-service': Globe,
    'microservice': Globe,
    'serverless-function': Globe,
    'webhook-service': Globe,
    // CLI
    'cli-tool': Terminal,
    'npm-package': Package,
    'github-action': Terminal,
    'shell-script': Terminal,
    // Integrations
    'notion-integration': Puzzle,
    'obsidian-plugin': Puzzle,
    'figma-plugin': Puzzle,
    'wordpress-plugin': Puzzle,
    'shopify-app': Globe,
    'woocommerce-plugin': Globe,
    // Chat
    'discord-bot': Smartphone,
    'slack-app': Smartphone,
    'telegram-bot': Smartphone,
    'teams-app': Smartphone,
    // AI
    'ai-agent': FileCode,
    'gpt-plugin': FileCode,
    'claude-plugin': FileCode,
    'ml-model': FileCode,
    // Specialized
    'game': Zap,
    'health-tool': Package,
    'education-tool': Package,
    'jupyter-notebook': FileCode,
    'tradingview-script': FileCode,
    'metamask-snap': Puzzle,
    'zapier-app': Zap,
    'airtable-extension': Puzzle,
    'tiktok-effect': Sparkles,
    'instagram-filter': Sparkles,
    'youtube-plugin': Puzzle,
    'salesforce-app': Globe,
    'atlassian-app': Puzzle,
    'observable-notebook': FileCode,
    'replit-app': FileCode,
    'glitch-app': FileCode,
    'codepen-demo': FileCode,
    'arduino-project': Package,
    'steam-app': Zap,
    'smart-contract': Puzzle,
    'ipfs-app': Globe
  }
  // Extract base type for icon mapping
  const baseType = type.split('-').slice(0, 2).join('-')
  return iconMap[baseType] || iconMap[type] || FileCode
}

export function EnhancedProjectsGridV2() {
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
  const [showStep0Dialog, setShowStep0Dialog] = useState(false)
  
  // Pipeline executor states
  const [showPipelineExecutor, setShowPipelineExecutor] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  
  // Modal states for project actions
  const [showProjectDetails, setShowProjectDetails] = useState(false)
  const [showEditProject, setShowEditProject] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null)
  
  // File viewer modal states
  const [showFileViewer, setShowFileViewer] = useState(false)
  const [fileToView, setFileToView] = useState<{ 
    title: string; 
    content: string; 
    type: string;
    projectId?: string;
    hasSpecification?: boolean;
    isMissing?: boolean;
  } | null>(null)
  const [loadingFile, setLoadingFile] = useState(false)
  const [regeneratingRequirements, setRegeneratingRequirements] = useState(false)

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

  async function runPipeline(project: Project) {
    setSelectedProject(project)
    setShowPipelineExecutor(true)
  }

  const handleStep0Submit = async (data: any) => {
    try {
      console.log('Creating project with enhanced Step 0 data:', data)
      
      // The data now includes enhanced business context and generated requirements
      const response = await fetch('/api/projects/step0', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          type: data.type,
          description: data.description,
          requirements: data.requirements,  // Full markdown requirements from orchestrator
          // Include metadata for project creation
          metadata: {
            targetAudience: data.targetAudience,
            industry: data.industry,
            geography: data.geography,
            budget: data.budget,
            timeline: data.timeline,
            priorities: data.priorities,
            compliance: data.compliance,
            competitors: data.competitors,
            monetization: data.monetization
          }
        })
      })
      
      if (response.ok) {
        const result = await response.json()
        setShowStep0Dialog(false)
        
        // Show success notification with next steps
        console.log('Project created:', result)
        console.log('Pipeline workflow:', result.pipeline)
        console.log('Next steps:', result.nextSteps)
        
        // Create a workflow entry to track pipeline execution
        await fetch('/api/workflows', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectId: result.projectId,
            name: `Pipeline: ${data.name}`,
            description: 'AI-Enhanced Pipeline execution for Steps 1-8',
            type: 'pipeline-execution',
            status: 'active',
            metadata: {
              currentStep: 1,
              totalSteps: 8,
              specification: result.specification
            }
          })
        })
        
        // Refresh projects list
        debouncedFetch({
          page: page.toString(),
          limit: pageSize.toString(),
          search: searchQuery,
          type: selectedType === 'all' ? '' : selectedType,
          status: selectedStatus,
          hasFeatures,
          hasMarket,
          sortBy,
          sortOrder
        })
      }
    } catch (error) {
      console.error('Failed to create project:', error)
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
  
  // Project action handlers
  const handleViewDetails = (project: Project) => {
    setSelectedProject(project)
    setShowProjectDetails(true)
  }
  
  const handleEditProject = (project: Project) => {
    setSelectedProject(project)
    setShowEditProject(true)
  }
  
  const handleDeleteProject = (project: Project) => {
    setProjectToDelete(project)
    setShowDeleteConfirm(true)
  }
  
  const handleCloneProject = async (project: Project) => {
    try {
      const response = await fetch('/api/projects/clone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: project.id })
      })
      
      if (response.ok) {
        // Refresh the projects list
        const params = {
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
      }
    } catch (error) {
      console.error('Failed to clone project:', error)
    }
  }
  
  const handleExportProject = async (project: Project) => {
    try {
      const response = await fetch(`/api/projects/${project.id}/export`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${project.name.replace(/\s+/g, '-')}-export.json`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Failed to export project:', error)
    }
  }
  
  const handleViewHistory = (project: Project) => {
    setSelectedProject(project)
    // TODO: Show pipeline history modal
    console.log('View history for:', project.name)
  }
  
  const handleRegenerateRequirements = async (projectId: string) => {
    try {
      setRegeneratingRequirements(true)
      
      const response = await fetch(`/api/projects/${projectId}/regenerate-requirements`, {
        method: 'POST'
      })
      
      if (response.ok) {
        const data = await response.json()
        
        // Poll for job completion
        const pollInterval = setInterval(async () => {
          const jobResponse = await fetch(`/api/jobs/regenerate-requirements/${data.jobId}/status`)
          
          if (jobResponse.ok) {
            const jobData = await jobResponse.json()
            
            if (jobData.status === 'completed') {
              clearInterval(pollInterval)
              setRegeneratingRequirements(false)
              
              // Reload the requirements file
              if (fileToView && fileToView.projectId === projectId) {
                handleViewFile(
                  projects.find(p => p.id === projectId)!, 
                  'requirements'
                )
              }
            } else if (jobData.status === 'failed') {
              clearInterval(pollInterval)
              setRegeneratingRequirements(false)
              console.error('Requirements regeneration failed')
            }
          }
        }, 2000)
        
        // Set a timeout to stop polling after 5 minutes
        setTimeout(() => {
          clearInterval(pollInterval)
          setRegeneratingRequirements(false)
        }, 300000)
      }
    } catch (error) {
      console.error('Failed to regenerate requirements:', error)
      setRegeneratingRequirements(false)
    }
  }
  
  const handleViewFile = async (project: Project, fileType: 'specification' | 'features' | 'market' | 'requirements') => {
    try {
      setLoadingFile(true)
      setShowFileViewer(true)
      
      // Determine the file path and title based on type
      let filePath = ''
      let title = ''
      
      switch (fileType) {
        case 'specification':
          filePath = `${project.id}/specification.yaml`
          title = 'Specification File'
          break
        case 'features':
          filePath = `${project.id}/features.md`
          title = 'Features List'
          break
        case 'market':
          filePath = `${project.id}/market-analysis.md`
          title = 'Market Analysis'
          break
        case 'requirements':
          filePath = `${project.id}/requirements.md`
          title = 'Project Requirements'
          break
      }
      
      // Fetch the file content
      const response = await fetch(`/api/projects/${project.id}/files?path=${encodeURIComponent(filePath)}`)
      
      if (response.ok) {
        const data = await response.json()
        setFileToView({
          title,
          content: data.content || 'File not found',
          type: fileType,
          projectId: project.id,
          hasSpecification: project.hasSpecification
        })
      } else {
        // For requirements, check if we can regenerate from specification
        if (fileType === 'requirements' && project.hasSpecification) {
          setFileToView({
            title,
            content: '',
            type: fileType,
            projectId: project.id,
            hasSpecification: true,
            isMissing: true
          })
        } else {
          // Fallback to mock data for demonstration
          let mockContent = ''
          
          switch (fileType) {
            case 'specification':
              mockContent = `# ${project.name} Specification\n\nProject Type: ${project.type}\n\n## Overview\n${project.description}\n\n## Technical Specification\n\`\`\`yaml\nname: ${project.name}\ntype: ${project.type}\nversion: 1.0.0\nstatus: active\n\`\`\``
              break
            case 'features':
              mockContent = `# Features for ${project.name}\n\n## Core Features (${project.features?.core || 0})\n- User authentication\n- Dashboard interface\n- Data visualization\n- API integration\n\n## Advanced Features (${project.features?.advanced || 0})\n- AI-powered insights\n- Real-time collaboration\n- Advanced analytics\n- Custom plugins`
              break
            case 'market':
              mockContent = `# Market Analysis: ${project.name}\n\n## Market Size\n- **TAM**: ${project.market?.tam || '$10B'}\n- **SAM**: ${project.market?.sam || '$2B'}\n\n## Target Audience\n- Developers\n- Small businesses\n- Enterprise clients\n\n## Competition\n- Competitor A: 30% market share\n- Competitor B: 25% market share\n- Our opportunity: 15-20%`
              break
            case 'requirements':
              mockContent = `# Requirements: ${project.name}\n\n## Functional Requirements\n- Must support multiple users\n- Real-time data synchronization\n- Mobile responsive design\n\n## Non-Functional Requirements\n- 99.9% uptime\n- Response time < 200ms\n- Support 10k concurrent users`
              break
          }
          
          setFileToView({
            title,
            content: mockContent,
            type: fileType,
            projectId: project.id,
            hasSpecification: project.hasSpecification
          })
        }
      }
    } catch (error) {
      console.error('Failed to fetch file:', error)
      setFileToView({
        title: 'Error',
        content: 'Failed to load file content',
        type: fileType
      })
    } finally {
      setLoadingFile(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Step 0 Dialog */}
      <Step0DialogV3 
        open={showStep0Dialog}
        onOpenChange={setShowStep0Dialog}
        onSubmit={handleStep0Submit}
      />

      {/* Header with New Project Button */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            AI Projects & Workflows
          </h2>
          <p className="text-gray-400 mt-1">Browse existing projects or view active pipeline executions</p>
        </div>
        <Button
          onClick={() => setShowStep0Dialog(true)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          New AI Project
        </Button>
      </div>

      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-purple-400 text-sm">Total Projects</div>
              <div className="text-3xl font-bold text-white mt-1">{stats.total.toLocaleString()}</div>
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
              <div className="text-blue-400 text-sm">With Specifications</div>
              <div className="text-3xl font-bold text-white mt-1">{stats.withSpecification.toLocaleString()}</div>
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
              <div className="text-green-400 text-sm">Market Enhanced</div>
              <div className="text-3xl font-bold text-white mt-1">{stats.withMarketEnhanced.toLocaleString()}</div>
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
              <SelectContent className="bg-gray-900 border-white/10 z-50">
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
              <SelectContent className="bg-gray-900 border-white/10 z-50">
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
                      <SelectContent className="bg-gray-900 border-white/10 z-50">
                        {statusOptions.map(option => (
                          <SelectItem key={option.value} value={option.value || 'all'}>
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
                      setHasFeatures(value === 'any' ? '' : value)
                      setPage(1)
                    }}>
                      <SelectTrigger className="bg-gray-800/50 border-white/10">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-white/10 z-50">
                        <SelectItem value="any">Any</SelectItem>
                        <SelectItem value="yes">Has Features</SelectItem>
                        <SelectItem value="no">No Features</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Market Analysis Filter */}
                  <div className="space-y-2">
                    <Label>Market Analysis</Label>
                    <Select value={hasMarket} onValueChange={(value) => {
                      setHasMarket(value === 'any' ? '' : value)
                      setPage(1)
                    }}>
                      <SelectTrigger className="bg-gray-800/50 border-white/10">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-white/10 z-50">
                        <SelectItem value="any">Any</SelectItem>
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
                      <SelectContent className="bg-gray-900 border-white/10 z-50">
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
              <div className="text-purple-400">
                {selectedProjects.size} project{selectedProjects.size !== 1 ? 's' : ''} selected
              </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(pageSize)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-900/50 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                      <DropdownMenuContent align="end" className="bg-gray-900 border-white/10 z-50 w-56">
                        <DropdownMenuItem 
                          onSelect={() => handleViewDetails(project)}
                          className="text-gray-300 hover:text-white hover:bg-white/10 cursor-pointer"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onSelect={() => handleEditProject(project)}
                          className="text-gray-300 hover:text-white hover:bg-white/10 cursor-pointer"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Project
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onSelect={() => handleCloneProject(project)}
                          className="text-gray-300 hover:text-white hover:bg-white/10 cursor-pointer"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Clone Project
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onSelect={() => handleExportProject(project)}
                          className="text-gray-300 hover:text-white hover:bg-white/10 cursor-pointer"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Export Configuration
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onSelect={() => handleViewHistory(project)}
                          className="text-gray-300 hover:text-white hover:bg-white/10 cursor-pointer"
                        >
                          <History className="w-4 h-4 mr-2" />
                          View History
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onSelect={() => handleDeleteProject(project)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white line-clamp-1">{project.name}</h3>
                      <div className="text-sm text-gray-400">{project.type.replace(/-/g, ' ')}</div>
                    </div>

                    <div className="text-sm text-gray-400 line-clamp-2">{project.description}</div>

                    {/* Features & Market - Clickable Badges */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Always show requirements badge if project exists (Step 0 complete) */}
                      <Badge 
                        variant="secondary" 
                        className="bg-gray-500/20 text-gray-400 border-gray-500/30 cursor-pointer hover:bg-gray-500/30 transition-colors"
                        onClick={() => handleViewFile(project, 'requirements')}
                      >
                        <FileText className="w-3 h-3 mr-1" />
                        Requirements
                      </Badge>
                      {project.hasSpecification && (
                        <Badge 
                          variant="secondary" 
                          className="bg-blue-500/20 text-blue-400 border-blue-500/30 cursor-pointer hover:bg-blue-500/30 transition-colors"
                          onClick={() => handleViewFile(project, 'specification')}
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Specification Ready
                        </Badge>
                      )}
                      {project.hasMarketEnhanced && (
                        <Badge 
                          variant="secondary" 
                          className="bg-green-500/20 text-green-400 border-green-500/30 cursor-pointer hover:bg-green-500/30 transition-colors"
                          onClick={() => handleViewFile(project, 'market')}
                        >
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Market Enhanced
                        </Badge>
                      )}
                      {project.features && (project.features.core > 0 || project.features.advanced > 0) && (
                        <Badge 
                          variant="secondary" 
                          className="bg-purple-500/20 text-purple-400 border-purple-500/30 cursor-pointer hover:bg-purple-500/30 transition-colors"
                          onClick={() => handleViewFile(project, 'features')}
                        >
                          <Sparkles className="w-3 h-3 mr-1" />
                          {project.features.core + project.features.advanced} features
                        </Badge>
                      )}
                      {project.market && project.market.tam && (
                        <Badge 
                          variant="secondary" 
                          className="bg-orange-500/20 text-orange-400 border-orange-500/30 cursor-pointer hover:bg-orange-500/30 transition-colors"
                          onClick={() => handleViewFile(project, 'market')}
                        >
                          <BarChart3 className="w-3 h-3 mr-1" />
                          TAM: {project.market.tam}
                        </Badge>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="pt-2">
                      <Button
                        size="sm"
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                        onClick={() => runPipeline(project)}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Run Pipeline
                      </Button>
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
                  key="first-page"
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
                  key={`page-${pageNum}-${i}`}
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
                  key="last-page"
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
      
      {/* Pipeline Executor Modal */}
      {showPipelineExecutor && selectedProject && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <PipelineExecutor
                projectId={selectedProject.id}
                projectName={selectedProject.name}
                projectType={selectedProject.type}
                onClose={() => {
                  setShowPipelineExecutor(false)
                  setSelectedProject(null)
                }}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && projectToDelete && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-white mb-4">Delete Project</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete "{projectToDelete.name}"? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setProjectToDelete(null)
                }}
                className="border-white/10 hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={async () => {
                  try {
                    const response = await fetch(`/api/projects/${projectToDelete.id}`, {
                      method: 'DELETE'
                    })
                    if (response.ok) {
                      // Refresh the projects list
                      const params = {
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
                    }
                  } catch (error) {
                    console.error('Failed to delete project:', error)
                  } finally {
                    setShowDeleteConfirm(false)
                    setProjectToDelete(null)
                  }
                }}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete Project
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Project Details Modal */}
      {showProjectDetails && selectedProject && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-semibold text-white">Project Details</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowProjectDetails(false)
                  setSelectedProject(null)
                }}
                className="hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1">Name</h4>
                <p className="text-white">{selectedProject.name}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1">Type</h4>
                <p className="text-white">{selectedProject.type.replace(/-/g, ' ')}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1">Description</h4>
                <p className="text-white">{selectedProject.description}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1">Status</h4>
                <div className="flex gap-2 mt-2">
                  {selectedProject.hasSpecification && (
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Specification Ready
                    </Badge>
                  )}
                  {selectedProject.hasMarketEnhanced && (
                    <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Market Enhanced
                    </Badge>
                  )}
                </div>
              </div>
              
              {selectedProject.features && (selectedProject.features.core > 0 || selectedProject.features.advanced > 0) && (
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-1">Features</h4>
                  <p className="text-white">
                    {selectedProject.features.core} core features, {selectedProject.features.advanced} advanced features
                  </p>
                </div>
              )}
              
              {selectedProject.market && (
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-1">Market Analysis</h4>
                  <div className="space-y-2">
                    {selectedProject.market.tam && (
                      <p className="text-white">TAM: {selectedProject.market.tam}</p>
                    )}
                    {selectedProject.market.sam && (
                      <p className="text-white">SAM: {selectedProject.market.sam}</p>
                    )}
                  </div>
                </div>
              )}
              
              <div className="pt-4 flex gap-3">
                <Button
                  onClick={() => {
                    setShowProjectDetails(false)
                    runPipeline(selectedProject)
                  }}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Run Pipeline
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowProjectDetails(false)
                    handleEditProject(selectedProject)
                  }}
                  className="border-white/10 hover:bg-white/10"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Project
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* File Viewer Modal */}
      {showFileViewer && fileToView && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-semibold text-white">{fileToView.title}</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowFileViewer(false)
                  setFileToView(null)
                }}
                className="hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {loadingFile ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-gray-400">Loading file content...</div>
              </div>
            ) : fileToView.isMissing && fileToView.type === 'requirements' ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8">
                <div className="text-center space-y-4">
                  <FileX className="w-16 h-16 text-gray-500 mx-auto" />
                  <h3 className="text-xl font-semibold text-white">Requirements File Missing</h3>
                  <p className="text-gray-400 max-w-md">
                    The requirements file for this project is missing. Since this project has a specification file, 
                    we can regenerate the requirements by reverse-engineering from the specification.
                  </p>
                  <p className="text-sm text-gray-500">
                    This will create requirements with the same quality as the periodic table project or better.
                  </p>
                  <Button
                    onClick={() => handleRegenerateRequirements(fileToView.projectId!)}
                    disabled={regeneratingRequirements}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    {regeneratingRequirements ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Regenerating Requirements...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Regenerate Requirements from Specification
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto">
                {fileToView.type === 'specification' ? (
                  <pre className="bg-gray-800/50 rounded-lg p-4 text-sm text-gray-300 whitespace-pre-wrap font-mono">
                    {fileToView.content}
                  </pre>
                ) : (
                  <div className="prose prose-invert max-w-none">
                    <MarkdownContent content={fileToView.content} />
                  </div>
                )}
              </div>
            )}
            
            <div className="mt-4 flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  // Copy to clipboard
                  navigator.clipboard.writeText(fileToView.content)
                }}
                className="border-white/10 hover:bg-white/10"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  // Download file
                  const blob = new Blob([fileToView.content], { type: 'text/plain' })
                  const url = window.URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `${fileToView.type}.${fileToView.type === 'specification' ? 'yaml' : 'md'}`
                  document.body.appendChild(a)
                  a.click()
                  window.URL.revokeObjectURL(url)
                  document.body.removeChild(a)
                }}
                className="border-white/10 hover:bg-white/10"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}