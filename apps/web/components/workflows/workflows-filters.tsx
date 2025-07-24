'use client'

import { motion } from 'framer-motion'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { 
  Calendar,
  Tag,
  Activity,
  Sparkles,
  RotateCcw,
  GitBranch,
  Clock,
  Zap
} from 'lucide-react'

export function WorkflowsFilters() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-white/10 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          Workflow Filters
        </h3>

        {/* Status Filter */}
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Status
            </Label>
            <div className="space-y-2 mt-2">
              {[
                { id: 'queued', label: 'Queued', color: 'text-gray-400' },
                { id: 'running', label: 'Running', color: 'text-blue-400' },
                { id: 'completed', label: 'Completed', color: 'text-green-400' },
                { id: 'failed', label: 'Failed', color: 'text-red-400' },
                { id: 'paused', label: 'Paused', color: 'text-yellow-400' }
              ].map((status) => (
                <div key={status.id} className="flex items-center space-x-2">
                  <Checkbox id={status.id} className="border-white/20" />
                  <label
                    htmlFor={status.id}
                    className={`text-sm cursor-pointer hover:text-white transition-colors ${status.color}`}
                  >
                    {status.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Workflow Type */}
          <div className="pt-4 border-t border-white/10">
            <Label className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
              <GitBranch className="h-4 w-4" />
              Workflow Type
            </Label>
            <div className="space-y-2 mt-2">
              {[
                'Full Stack',
                'Frontend',
                'Backend',
                'Mobile',
                'AI Service',
                'API',
                'Documentation',
                'Deployment'
              ].map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox id={type} className="border-white/20" />
                  <label
                    htmlFor={type}
                    className="text-sm text-gray-300 cursor-pointer hover:text-white transition-colors"
                  >
                    {type}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="pt-4 border-t border-white/10">
            <Label className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Date Range
            </Label>
            <RadioGroup defaultValue="all" className="space-y-2 mt-2">
              {[
                { value: 'all', label: 'All time' },
                { value: 'today', label: 'Today' },
                { value: 'week', label: 'This week' },
                { value: 'month', label: 'This month' },
                { value: 'custom', label: 'Custom range' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <label
                    htmlFor={option.value}
                    className="text-sm text-gray-300 cursor-pointer hover:text-white transition-colors"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Phases */}
          <div className="pt-4 border-t border-white/10">
            <Label className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Current Phase
            </Label>
            <div className="space-y-2 mt-2">
              {[
                'Idea Expansion',
                'Market Analysis',
                'UI/UX Design',
                'Implementation',
                'Security Audit',
                'QA Testing',
                'Deployment'
              ].map((phase) => (
                <div key={phase} className="flex items-center space-x-2">
                  <Checkbox id={phase} className="border-white/20" />
                  <label
                    htmlFor={phase}
                    className="text-sm text-gray-300 cursor-pointer hover:text-white transition-colors"
                  >
                    {phase}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Duration Range */}
          <div className="pt-4 border-t border-white/10">
            <Label className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Duration (minutes)
            </Label>
            <div className="px-2 mt-4">
              <Slider 
                defaultValue={[60]} 
                max={300} 
                step={10}
                className="cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>0m</span>
                <span>5h</span>
              </div>
            </div>
          </div>

          {/* Token Usage */}
          <div className="pt-4 border-t border-white/10">
            <Label className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Token Usage
            </Label>
            <div className="px-2 mt-4">
              <Slider 
                defaultValue={[50]} 
                max={1000} 
                step={10}
                className="cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>0k</span>
                <span>1M</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-6 pt-6 border-t border-white/10">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-white/10 hover:bg-white/5"
          >
            <RotateCcw className="mr-2 h-3 w-3" />
            Reset
          </Button>
          <Button
            size="sm"
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </motion.div>
  )
}