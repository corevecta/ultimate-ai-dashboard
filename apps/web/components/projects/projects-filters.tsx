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
  Users,
  Activity,
  Sparkles,
  RotateCcw
} from 'lucide-react'

export function ProjectsFilters() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-white/10 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          Filters
        </h3>

        {/* Status Filter */}
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Status
            </Label>
            <div className="space-y-2 mt-2">
              {['Active', 'Completed', 'Paused', 'Failed'].map((status) => (
                <div key={status} className="flex items-center space-x-2">
                  <Checkbox id={status} className="border-white/20" />
                  <label
                    htmlFor={status}
                    className="text-sm text-gray-300 cursor-pointer hover:text-white transition-colors"
                  >
                    {status}
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

          {/* Tags */}
          <div className="pt-4 border-t border-white/10">
            <Label className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Tags
            </Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {['ml-model', 'data-pipeline', 'api', 'frontend', 'backend', 'experiment'].map((tag) => (
                <button
                  key={tag}
                  className="px-3 py-1 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-full border border-white/10 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Team Members */}
          <div className="pt-4 border-t border-white/10">
            <Label className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Team Members
            </Label>
            <div className="space-y-2 mt-2">
              {['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams'].map((member) => (
                <div key={member} className="flex items-center space-x-2">
                  <Checkbox id={member} className="border-white/20" />
                  <label
                    htmlFor={member}
                    className="text-sm text-gray-300 cursor-pointer hover:text-white transition-colors"
                  >
                    {member}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Range */}
          <div className="pt-4 border-t border-white/10">
            <Label className="text-sm font-medium text-gray-300 mb-3">
              Success Rate
            </Label>
            <div className="px-2 mt-4">
              <Slider 
                defaultValue={[80]} 
                max={100} 
                step={5}
                className="cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>0%</span>
                <span>100%</span>
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
            Apply
          </Button>
        </div>
      </div>
    </motion.div>
  )
}