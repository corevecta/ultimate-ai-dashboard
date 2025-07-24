'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'
import {
  Sparkles,
  CheckCircle,
  Loader2,
  FileText,
  Rocket,
  AlertCircle,
  Globe,
  Building2,
  Users,
  Code2,
  DollarSign,
  Clock,
  Shield,
  Target,
  Zap
} from 'lucide-react'
import { projectTypes } from '@/lib/project-types'

interface Step0DialogV3Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: EnhancedProjectFormData) => void
}

interface EnhancedProjectFormData {
  // Basic info
  name: string
  type: string
  description: string
  
  // Business context
  targetAudience: string
  industry: string
  geography: string[]
  
  // Constraints
  budget: string
  timeline: string
  
  // Optional
  competitors?: string
  monetization?: string
  priorities?: string[]
  compliance?: string[]
  
  // Generated
  requirements?: string
  jobId?: string
  validation?: {
    isValid: boolean
    coverage: number
    warnings: string[]
  }
}

const industries = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'E-commerce',
  'Entertainment',
  'Travel',
  'Real Estate',
  'Manufacturing',
  'Retail',
  'Transportation',
  'Energy',
  'Agriculture',
  'Non-profit',
  'Government',
  'Other'
]

const geographies = [
  { id: 'global', name: 'Global', emoji: '🌍' },
  { id: 'us', name: 'United States', emoji: '🇺🇸' },
  { id: 'eu', name: 'European Union', emoji: '🇪🇺' },
  { id: 'uk', name: 'United Kingdom', emoji: '🇬🇧' },
  { id: 'asia', name: 'Asia Pacific', emoji: '🌏' },
  { id: 'latam', name: 'Latin America', emoji: '🌎' },
  { id: 'africa', name: 'Africa', emoji: '🌍' },
  { id: 'mena', name: 'Middle East', emoji: '🌐' }
]

const priorities = [
  { id: 'performance', name: 'Performance', icon: Zap },
  { id: 'security', name: 'Security', icon: Shield },
  { id: 'ux', name: 'User Experience', icon: Users },
  { id: 'scalability', name: 'Scalability', icon: Target },
  { id: 'cost', name: 'Cost Efficiency', icon: DollarSign }
]

const complianceOptions = [
  'GDPR (EU Privacy)',
  'HIPAA (Healthcare)',
  'PCI-DSS (Payments)',
  'SOC 2',
  'ISO 27001',
  'CCPA (California)',
  'FERPA (Education)',
  'FedRAMP (Government)',
  'None Required'
]

export default function Step0DialogV3({ open, onOpenChange, onSubmit }: Step0DialogV3Props) {
  const [step, setStep] = useState<'basic' | 'context' | 'review'>('basic')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [pollInterval, setPollInterval] = useState<NodeJS.Timer | null>(null)
  const [formData, setFormData] = useState<EnhancedProjectFormData>({
    name: '',
    type: 'web-app',
    description: '',
    targetAudience: 'consumers',
    industry: 'Technology',
    geography: ['global'],
    budget: 'mvp',
    timeline: '3months',
    priorities: ['ux', 'performance']
  })

  const selectedType = projectTypes.find(t => t.id === formData.type)
  const categories = Array.from(new Set(projectTypes.map(t => t.category)))

  const handleNext = () => {
    if (step === 'basic') {
      if (!formData.name || !formData.description || formData.description.split(' ').length < 5) {
        setError('Please provide a project name and at least 2-3 lines of description')
        return
      }
      setError('')
      setStep('context')
    }
  }

  const handleGenerateRequirements = async () => {
    setLoading(true)
    setError('')

    try {
      // Call the orchestrator which will use LLM to generate requirements
      const response = await fetch('/api/orchestrator/step0', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Failed to generate requirements')
      }

      const data = await response.json()
      
      // If we got a job ID, start polling for results
      if (data.jobId && !data.requirements) {
        setFormData({ ...formData, jobId: data.jobId })
        startPolling(data.jobId)
      } else {
        // Direct response (fallback mode)
        setFormData({ 
          ...formData, 
          requirements: data.requirements,
          jobId: data.jobId,
          validation: data.validation
        })
        setStep('review')
        setLoading(false)
      }
    } catch (err: any) {
      console.error('Error generating requirements:', err)
      setError(err.message || 'Failed to generate requirements. Please try again.')
      setLoading(false)
    }
  }

  const startPolling = (jobId: string) => {
    // Poll every 2 seconds
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/orchestrator/step0?jobId=${jobId}`)
        if (!response.ok) {
          throw new Error('Failed to check job status')
        }
        
        const data = await response.json()
        
        if (data.status === 'completed') {
          clearInterval(interval)
          setPollInterval(null)
          setFormData({
            ...formData,
            requirements: data.requirements,
            jobId: jobId,
            validation: data.validation
          })
          setLoading(false)
          setStep('review')
        } else if (data.status === 'failed') {
          clearInterval(interval)
          setPollInterval(null)
          setError(data.error || 'Generation failed')
          setLoading(false)
        }
        // Continue polling if status is pending or processing
      } catch (err: any) {
        console.error('Polling error:', err)
        clearInterval(interval)
        setPollInterval(null)
        setError('Failed to check generation status')
        setLoading(false)
      }
    }, 2000)
    
    setPollInterval(interval)
  }

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval)
      }
    }
  }, [pollInterval])

  const handleCreateProject = async () => {
    if (!formData.requirements) return

    setLoading(true)
    try {
      await onSubmit(formData)
      onOpenChange(false)
    } catch (err: any) {
      setError(err.message || 'Failed to create project')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFormData({
      name: '',
      type: 'web-app',
      description: '',
      targetAudience: 'consumers',
      industry: 'Technology',
      geography: ['global'],
      budget: 'mvp',
      timeline: '3months',
      priorities: ['ux', 'performance']
    })
    setStep('basic')
    setError('')
  }

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) handleReset()
      onOpenChange(open)
    }}>
      <DialogContent className="max-w-4xl bg-gray-900 text-white border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Create AI-Powered Project
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {step === 'basic' && 'Tell us about your project idea'}
            {step === 'context' && 'Provide business context for better AI generation'}
            {step === 'review' && 'Review AI-generated comprehensive requirements'}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 py-4">
          <div className={cn(
            "w-32 h-1 rounded-full transition-all",
            step === 'basic' ? "bg-blue-500" : "bg-green-500"
          )} />
          <div className={cn(
            "w-32 h-1 rounded-full transition-all",
            step === 'context' ? "bg-blue-500" : step === 'review' ? "bg-green-500" : "bg-gray-700"
          )} />
          <div className={cn(
            "w-32 h-1 rounded-full transition-all",
            step === 'review' ? "bg-blue-500" : "bg-gray-700"
          )} />
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Basic Info */}
          {step === 'basic' && (
            <motion.div
              key="basic"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 py-6"
            >
              {/* Project Name */}
              <div>
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                  id="project-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="My Awesome Project"
                  className="mt-2 bg-gray-800 border-gray-700"
                />
              </div>

              {/* Project Type */}
              <div>
                <Label>Project Type</Label>
                <div className="mt-2 space-y-3">
                  {/* Category Selector */}
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Badge
                        key={category}
                        variant="outline"
                        className={cn(
                          "cursor-pointer transition-all",
                          projectTypes.find(t => t.id === formData.type)?.category === category
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "border-gray-600 text-gray-400 hover:border-gray-500"
                        )}
                        onClick={() => {
                          const firstInCategory = projectTypes.find(t => t.category === category)
                          if (firstInCategory) {
                            setFormData({ ...formData, type: firstInCategory.id })
                          }
                        }}
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>

                  {/* Type Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {projectTypes
                      .filter(t => t.category === selectedType?.category)
                      .map((type) => {
                        const Icon = type.icon
                        return (
                          <button
                            key={type.id}
                            onClick={() => setFormData({ ...formData, type: type.id })}
                            className={cn(
                              "p-3 rounded-lg border transition-all text-left",
                              formData.type === type.id
                                ? "bg-blue-600 border-blue-600"
                                : "bg-gray-800 border-gray-700 hover:border-gray-600"
                            )}
                          >
                            <Icon className="w-5 h-5 mb-1" />
                            <div className="text-sm font-medium">{type.name}</div>
                            <div className="text-xs text-gray-400 mt-1">{type.description}</div>
                          </button>
                        )
                      })}
                  </div>
                </div>
              </div>

              {/* Project Description */}
              <div>
                <Label htmlFor="description">
                  Project Idea
                  <span className="text-xs text-gray-400 ml-2">(2-3 lines)</span>
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your project idea in 2-3 lines. What problem does it solve? Who is it for?"
                  className="mt-2 bg-gray-800 border-gray-700 min-h-[100px]"
                  rows={4}
                />
                <p className="text-xs text-gray-400 mt-2">
                  Example: "I want to create an interactive periodic table web app that works offline. 
                  It should have a modern UI with all element details and educational features for chemistry students."
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}
            </motion.div>
          )}

          {/* Step 2: Business Context */}
          {step === 'context' && (
            <motion.div
              key="context"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 py-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Target Audience */}
                <div>
                  <Label>Target Audience</Label>
                  <RadioGroup
                    value={formData.targetAudience}
                    onValueChange={(value) => setFormData({ ...formData, targetAudience: value })}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="consumers" id="consumers" />
                      <Label htmlFor="consumers" className="font-normal cursor-pointer">
                        <Users className="w-4 h-4 inline mr-1" />
                        Consumers (B2C)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="businesses" id="businesses" />
                      <Label htmlFor="businesses" className="font-normal cursor-pointer">
                        <Building2 className="w-4 h-4 inline mr-1" />
                        Businesses (B2B)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="developers" id="developers" />
                      <Label htmlFor="developers" className="font-normal cursor-pointer">
                        <Code2 className="w-4 h-4 inline mr-1" />
                        Developers
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="enterprises" id="enterprises" />
                      <Label htmlFor="enterprises" className="font-normal cursor-pointer">
                        <Building2 className="w-4 h-4 inline mr-1" />
                        Enterprises
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Industry */}
                <div>
                  <Label>Industry/Domain</Label>
                  <Select
                    value={formData.industry}
                    onValueChange={(value) => setFormData({ ...formData, industry: value })}
                  >
                    <SelectTrigger className="mt-2 bg-gray-800 border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700">
                      {industries.map(industry => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Budget */}
                <div>
                  <Label>Budget Range</Label>
                  <RadioGroup
                    value={formData.budget}
                    onValueChange={(value) => setFormData({ ...formData, budget: value })}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mvp" id="mvp" />
                      <Label htmlFor="mvp" className="font-normal cursor-pointer">
                        MVP (&lt;$10k)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="small" id="small" />
                      <Label htmlFor="small" className="font-normal cursor-pointer">
                        Small ($10-50k)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medium" id="medium" />
                      <Label htmlFor="medium" className="font-normal cursor-pointer">
                        Medium ($50-200k)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="enterprise" id="enterprise" />
                      <Label htmlFor="enterprise" className="font-normal cursor-pointer">
                        Enterprise ($200k+)
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Timeline */}
                <div>
                  <Label>Timeline</Label>
                  <RadioGroup
                    value={formData.timeline}
                    onValueChange={(value) => setFormData({ ...formData, timeline: value })}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1month" id="1month" />
                      <Label htmlFor="1month" className="font-normal cursor-pointer">
                        1 Month
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="3months" id="3months" />
                      <Label htmlFor="3months" className="font-normal cursor-pointer">
                        3 Months
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="6months" id="6months" />
                      <Label htmlFor="6months" className="font-normal cursor-pointer">
                        6 Months
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ongoing" id="ongoing" />
                      <Label htmlFor="ongoing" className="font-normal cursor-pointer">
                        Ongoing
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {/* Geography */}
              <div>
                <Label>Target Geography</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {geographies.map(geo => (
                    <Badge
                      key={geo.id}
                      variant="outline"
                      className={cn(
                        "cursor-pointer transition-all",
                        formData.geography.includes(geo.id)
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "border-gray-600 text-gray-400 hover:border-gray-500"
                      )}
                      onClick={() => {
                        const newGeo = formData.geography.includes(geo.id)
                          ? formData.geography.filter(g => g !== geo.id)
                          : [...formData.geography, geo.id]
                        setFormData({ ...formData, geography: newGeo.length ? newGeo : ['global'] })
                      }}
                    >
                      {geo.emoji} {geo.name}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Priorities */}
              <div>
                <Label>Key Priorities</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {priorities.map(priority => {
                    const Icon = priority.icon
                    return (
                      <Badge
                        key={priority.id}
                        variant="outline"
                        className={cn(
                          "cursor-pointer transition-all",
                          formData.priorities?.includes(priority.id)
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "border-gray-600 text-gray-400 hover:border-gray-500"
                        )}
                        onClick={() => {
                          const newPriorities = formData.priorities?.includes(priority.id)
                            ? formData.priorities.filter(p => p !== priority.id)
                            : [...(formData.priorities || []), priority.id]
                          setFormData({ ...formData, priorities: newPriorities })
                        }}
                      >
                        <Icon className="w-3 h-3 mr-1" />
                        {priority.name}
                      </Badge>
                    )
                  })}
                </div>
              </div>

              {/* Competitors (Optional) */}
              <div>
                <Label htmlFor="competitors">
                  Similar Products
                  <span className="text-xs text-gray-400 ml-2">(Optional)</span>
                </Label>
                <Input
                  id="competitors"
                  value={formData.competitors || ''}
                  onChange={(e) => setFormData({ ...formData, competitors: e.target.value })}
                  placeholder="e.g., Similar to Notion but for developers"
                  className="mt-2 bg-gray-800 border-gray-700"
                />
              </div>

              {/* Monetization Model (Optional) */}
              <div>
                <Label htmlFor="monetization">
                  Monetization Model
                  <span className="text-xs text-gray-400 ml-2">(Optional)</span>
                </Label>
                <Select
                  value={formData.monetization || ''}
                  onValueChange={(value) => setFormData({ ...formData, monetization: value })}
                >
                  <SelectTrigger id="monetization" className="mt-2 bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Select monetization model" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    <SelectItem value="freemium">Freemium</SelectItem>
                    <SelectItem value="subscription">Subscription (SaaS)</SelectItem>
                    <SelectItem value="one-time">One-time Purchase</SelectItem>
                    <SelectItem value="marketplace">Marketplace/Commission</SelectItem>
                    <SelectItem value="advertising">Advertising</SelectItem>
                    <SelectItem value="b2b-licensing">B2B Licensing</SelectItem>
                    <SelectItem value="usage-based">Usage-based Pricing</SelectItem>
                    <SelectItem value="enterprise">Enterprise Sales</SelectItem>
                    <SelectItem value="donation">Donation/Sponsorship</SelectItem>
                    <SelectItem value="open-source">Open Source</SelectItem>
                    <SelectItem value="hybrid">Hybrid Model</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-400 mt-1">
                  How will this project generate revenue?
                </p>
              </div>
            </motion.div>
          )}

          {/* Step 3: Review */}
          {step === 'review' && (
            <motion.div
              key="review"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="py-6"
            >
              <div className="mb-4 p-4 bg-gray-800 rounded-lg border border-gray-700" data-testid="generated-requirements">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-400" />
                    Generated Requirements
                  </h3>
                  <div className="flex items-center gap-2">
                    {formData.validation && (
                      <Badge 
                        variant="outline" 
                        className={cn(
                          formData.validation.isValid 
                            ? "text-green-400 border-green-400" 
                            : "text-yellow-400 border-yellow-400"
                        )}
                      >
                        Coverage: {formData.validation.coverage.toFixed(0)}%
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      AI Generated
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mb-2">
                  Comprehensive requirements based on your project details and business context
                </p>
                {formData.jobId && (
                  <p className="text-xs text-gray-500">
                    Job ID: {formData.jobId}
                  </p>
                )}
                {formData.validation?.warnings && formData.validation.warnings.length > 0 && (
                  <div className="mt-2 text-xs text-yellow-400">
                    <p className="font-semibold mb-1">Suggestions for improvement:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {formData.validation.warnings.slice(0, 3).map((warning, idx) => (
                        <li key={idx}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <ScrollArea className="h-[400px] rounded-lg border border-gray-700 bg-gray-800 p-6" data-testid="requirements-content">
                <pre className="whitespace-pre-wrap text-sm text-gray-300 font-mono">
                  {formData.requirements || 'Generating requirements...'}
                </pre>
              </ScrollArea>

              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm mt-4">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <DialogFooter>
          {step === 'basic' && (
            <>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="bg-gray-800 border-gray-700 hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Next: Business Context
              </Button>
            </>
          )}
          
          {step === 'context' && (
            <>
              <Button
                variant="outline"
                onClick={() => setStep('basic')}
                disabled={loading}
                className="bg-gray-800 border-gray-700 hover:bg-gray-700"
              >
                Back
              </Button>
              <Button
                onClick={handleGenerateRequirements}
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {formData.jobId ? 'Processing...' : 'Generating Requirements...'}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Requirements
                  </>
                )}
              </Button>
            </>
          )}
          
          {step === 'review' && (
            <>
              <Button
                variant="outline"
                onClick={() => setStep('context')}
                disabled={loading}
                className="bg-gray-800 border-gray-700 hover:bg-gray-700"
              >
                Back to Edit
              </Button>
              <Button
                onClick={handleCreateProject}
                disabled={loading}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Project...
                  </>
                ) : (
                  <>
                    <Rocket className="w-4 h-4 mr-2" />
                    Create Project
                  </>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}