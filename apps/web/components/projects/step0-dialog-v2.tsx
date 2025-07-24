'use client'

import { useState } from 'react'
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
import { cn } from '@/lib/utils'
import {
  Sparkles,
  CheckCircle,
  Loader2,
  FileText,
  Rocket,
  AlertCircle
} from 'lucide-react'
import { projectTypes } from '@/lib/project-types'

interface Step0DialogV2Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: ProjectFormData) => void
}

interface ProjectFormData {
  name: string
  type: string
  description: string
  requirements?: string
}

// projectTypes is now imported from @/lib/project-types

export default function Step0DialogV2({ open, onOpenChange, onSubmit }: Step0DialogV2Props) {
  const [step, setStep] = useState<'input' | 'review'>('input')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    type: 'web-app',
    description: ''
  })

  const selectedType = projectTypes.find(t => t.id === formData.type)
  const categories = Array.from(new Set(projectTypes.map(t => t.category)))

  const handleGenerateRequirements = async () => {
    if (!formData.name || !formData.description || formData.description.split(' ').length < 5) {
      setError('Please provide a project name and at least 2-3 lines of description')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Call Step 0 V2 of the actual pipeline via the backend
      const response = await fetch('/api/pipeline/step0/v2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          type: formData.type,
          description: formData.description
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate requirements')
      }

      const data = await response.json()
      setFormData({ ...formData, requirements: data.requirements })
      setStep('review')
    } catch (err: any) {
      console.error('Error generating requirements:', err)
      setError(err.message || 'Failed to generate requirements. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProject = async () => {
    if (!formData.requirements) return

    setLoading(true)
    try {
      // Create the project with generated requirements
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
      description: ''
    })
    setStep('input')
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
            {step === 'input' 
              ? 'Describe your project idea in 2-3 lines. Our AI will generate comprehensive requirements.'
              : 'Review the AI-generated requirements for your project'
            }
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {step === 'input' ? (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
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
                  Project Description
                  <span className="text-xs text-gray-400 ml-2">(2-3 lines minimum)</span>
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your project idea in 2-3 lines. What problem does it solve? Who is it for? What makes it unique?"
                  className="mt-2 bg-gray-800 border-gray-700 min-h-[100px]"
                  rows={4}
                />
                <p className="text-xs text-gray-400 mt-2">
                  Example: "I want to create an interactive periodic table web app that works offline. It should have a modern, 
                  stunning UI with all element details, proper color coding, and educational features for chemistry students."
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="review"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="py-6"
            >
              <div className="mb-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-400" />
                    Generated Requirements
                  </h3>
                  <Badge variant="outline" className="text-green-400 border-green-400">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    AI Generated
                  </Badge>
                </div>
                <p className="text-sm text-gray-400">
                  Review the comprehensive requirements generated by our AI orchestrator
                </p>
              </div>

              <ScrollArea className="h-[400px] rounded-lg border border-gray-700 bg-gray-800 p-6">
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
          {step === 'input' ? (
            <>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="bg-gray-800 border-gray-700 hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleGenerateRequirements}
                disabled={loading || !formData.name || !formData.description}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating Requirements...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Requirements
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => setStep('input')}
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