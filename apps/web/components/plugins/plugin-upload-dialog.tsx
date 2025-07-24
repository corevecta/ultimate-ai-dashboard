'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Upload, 
  FileCode,
  Package,
  CheckCircle,
  AlertCircle,
  Info,
  Code,
  Shield,
  Zap,
  GitBranch,
  FileText,
  Image,
  Plus,
  Trash2,
  Loader2,
  Link,
  Tag,
  DollarSign,
  Users,
  Github
} from 'lucide-react'
import { Button } from '@ultimate-ai/shared-ui'

interface PluginUploadDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function PluginUploadDialog({ isOpen, onClose }: PluginUploadDialogProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [uploading, setUploading] = useState(false)
  const [validating, setValidating] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    version: '1.0.0',
    category: '',
    author: '',
    authorEmail: '',
    website: '',
    repository: '',
    license: 'MIT',
    price: 'free',
    priceAmount: '',
    tags: [] as string[],
    features: [] as string[],
    requirements: [] as string[],
    permissions: [] as string[]
  })

  const [files, setFiles] = useState({
    plugin: null as File | null,
    icon: null as File | null,
    screenshots: [] as File[],
    documentation: null as File | null
  })

  const [validation, setValidation] = useState({
    passed: false,
    errors: [] as string[],
    warnings: [] as string[]
  })

  const [newTag, setNewTag] = useState('')
  const [newFeature, setNewFeature] = useState('')
  const [newRequirement, setNewRequirement] = useState('')

  const categories = [
    'AI & Machine Learning',
    'Data Processing',
    'Integration',
    'Development Tools',
    'Analytics',
    'Security',
    'Productivity',
    'Utility'
  ]

  const licenses = [
    'MIT',
    'Apache 2.0',
    'GPL v3',
    'BSD 3-Clause',
    'ISC',
    'Proprietary'
  ]

  const permissions = [
    { key: 'filesystem', label: 'File System Access', description: 'Read/write files' },
    { key: 'network', label: 'Network Access', description: 'Make HTTP requests' },
    { key: 'database', label: 'Database Access', description: 'Query databases' },
    { key: 'system', label: 'System Information', description: 'Access system metrics' },
    { key: 'process', label: 'Process Management', description: 'Spawn processes' },
    { key: 'environment', label: 'Environment Variables', description: 'Read env vars' }
  ]

  const steps = [
    { number: 1, title: 'Basic Information', icon: FileText },
    { number: 2, title: 'Technical Details', icon: Code },
    { number: 3, title: 'Upload Files', icon: Upload },
    { number: 4, title: 'Review & Submit', icon: CheckCircle }
  ]

  const handleFileUpload = (type: 'plugin' | 'icon' | 'documentation', file: File) => {
    setFiles({ ...files, [type]: file })
  }

  const handleScreenshotUpload = (file: File) => {
    if (files.screenshots.length < 5) {
      setFiles({ ...files, screenshots: [...files.screenshots, file] })
    }
  }

  const removeScreenshot = (index: number) => {
    setFiles({
      ...files,
      screenshots: files.screenshots.filter((_, i) => i !== index)
    })
  }

  const handleAddTag = () => {
    if (newTag && formData.tags.length < 5 && !formData.tags.includes(newTag)) {
      setFormData({ ...formData, tags: [...formData.tags, newTag] })
      setNewTag('')
    }
  }

  const handleAddFeature = () => {
    if (newFeature && !formData.features.includes(newFeature)) {
      setFormData({ ...formData, features: [...formData.features, newFeature] })
      setNewFeature('')
    }
  }

  const handleAddRequirement = () => {
    if (newRequirement && !formData.requirements.includes(newRequirement)) {
      setFormData({ ...formData, requirements: [...formData.requirements, newRequirement] })
      setNewRequirement('')
    }
  }

  const handleValidate = async () => {
    setValidating(true)
    // Simulate validation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const errors = []
    const warnings = []
    
    if (!files.plugin) errors.push('Plugin file is required')
    if (!files.icon) warnings.push('Icon is recommended for better visibility')
    if (files.screenshots.length === 0) warnings.push('Screenshots help users understand your plugin')
    if (formData.features.length === 0) errors.push('At least one feature must be specified')
    
    setValidation({
      passed: errors.length === 0,
      errors,
      warnings
    })
    setValidating(false)
  }

  const handleSubmit = async () => {
    setUploading(true)
    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 3000))
    setUploading(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-gray-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-600/20 border-b border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Submit Plugin</h2>
                <p className="text-gray-400 mt-1">Share your plugin with the community</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center gap-3 ${
                    currentStep >= step.number ? 'text-white' : 'text-gray-500'
                  }`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                      currentStep > step.number
                        ? 'bg-green-500 border-green-500'
                        : currentStep === step.number
                        ? 'bg-purple-500 border-purple-500'
                        : 'bg-transparent border-gray-600'
                    }`}>
                      {currentStep > step.number ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <step.icon className="w-5 h-5" />
                      )}
                    </div>
                    <span className="font-medium">{step.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-full mx-4 h-0.5 ${
                      currentStep > step.number ? 'bg-green-500' : 'bg-gray-700'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(90vh - 240px)' }}>
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Plugin Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                      placeholder="My Awesome Plugin"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Version <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.version}
                      onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                      placeholder="1.0.0"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                    placeholder="Describe what your plugin does..."
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Author Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Author Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.authorEmail}
                      onChange={(e) => setFormData({ ...formData, authorEmail: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Website
                    </label>
                    <div className="relative">
                      <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Repository
                    </label>
                    <div className="relative">
                      <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="url"
                        value={formData.repository}
                        onChange={(e) => setFormData({ ...formData, repository: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                        placeholder="https://github.com/user/repo"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tags (up to 5)
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                      placeholder="Add a tag..."
                      disabled={formData.tags.length >= 5}
                    />
                    <Button
                      type="button"
                      onClick={handleAddTag}
                      disabled={!newTag || formData.tags.length >= 5}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm flex items-center gap-2"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                        <button
                          type="button"
                          onClick={() => setFormData({
                            ...formData,
                            tags: formData.tags.filter((_, i) => i !== index)
                          })}
                          className="hover:text-red-400"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Technical Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      License <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={formData.license}
                      onChange={(e) => setFormData({ ...formData, license: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    >
                      {licenses.map(license => (
                        <option key={license} value={license}>{license}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Pricing Model <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="free">Free</option>
                      <option value="paid">One-time Purchase</option>
                      <option value="subscription">Subscription</option>
                      <option value="freemium">Freemium</option>
                    </select>
                  </div>
                </div>

                {formData.price !== 'free' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Price
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={formData.priceAmount}
                        onChange={(e) => setFormData({ ...formData, priceAmount: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                        placeholder={formData.price === 'subscription' ? "9.99/month" : "49.99"}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Key Features <span className="text-red-400">*</span>
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                      className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                      placeholder="Add a key feature..."
                    />
                    <Button
                      type="button"
                      onClick={handleAddFeature}
                      disabled={!newFeature}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
                        <Zap className="w-4 h-4 text-green-400" />
                        <span className="flex-1 text-sm text-gray-300">{feature}</span>
                        <button
                          type="button"
                          onClick={() => setFormData({
                            ...formData,
                            features: formData.features.filter((_, i) => i !== index)
                          })}
                          className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    System Requirements
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newRequirement}
                      onChange={(e) => setNewRequirement(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRequirement())}
                      className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                      placeholder="e.g., Node.js v16+"
                    />
                    <Button
                      type="button"
                      onClick={handleAddRequirement}
                      disabled={!newRequirement}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {formData.requirements.map((req, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
                        <Info className="w-4 h-4 text-blue-400" />
                        <span className="flex-1 text-sm text-gray-300">{req}</span>
                        <button
                          type="button"
                          onClick={() => setFormData({
                            ...formData,
                            requirements: formData.requirements.filter((_, i) => i !== index)
                          })}
                          className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-4">
                    Required Permissions
                  </label>
                  <div className="space-y-3">
                    {permissions.map((perm) => (
                      <label key={perm.key} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10 cursor-pointer hover:bg-white/10">
                        <input
                          type="checkbox"
                          checked={formData.permissions.includes(perm.key)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ ...formData, permissions: [...formData.permissions, perm.key] })
                            } else {
                              setFormData({ ...formData, permissions: formData.permissions.filter(p => p !== perm.key) })
                            }
                          }}
                          className="w-4 h-4 rounded border-white/10 bg-white/5 text-purple-500 focus:ring-purple-500"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-white">{perm.label}</div>
                          <div className="text-sm text-gray-400">{perm.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Upload Files */}
            {currentStep === 3 && (
              <div className="space-y-6">
                {/* Plugin File */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Plugin File <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".zip,.tar.gz"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload('plugin', e.target.files[0])}
                      className="hidden"
                      id="plugin-upload"
                    />
                    <label
                      htmlFor="plugin-upload"
                      className="flex items-center justify-center gap-3 p-8 bg-white/5 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:bg-white/10 hover:border-purple-500 transition-all"
                    >
                      {files.plugin ? (
                        <>
                          <Package className="w-8 h-8 text-green-400" />
                          <div className="text-left">
                            <p className="font-medium text-white">{files.plugin.name}</p>
                            <p className="text-sm text-gray-400">{(files.plugin.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-gray-400" />
                          <div className="text-left">
                            <p className="font-medium text-white">Upload plugin package</p>
                            <p className="text-sm text-gray-400">ZIP or TAR.GZ, max 50MB</p>
                          </div>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                {/* Icon */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Plugin Icon
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload('icon', e.target.files[0])}
                      className="hidden"
                      id="icon-upload"
                    />
                    <label
                      htmlFor="icon-upload"
                      className="flex items-center justify-center gap-3 p-8 bg-white/5 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:bg-white/10 hover:border-purple-500 transition-all"
                    >
                      {files.icon ? (
                        <>
                          <Image className="w-8 h-8 text-green-400" />
                          <div className="text-left">
                            <p className="font-medium text-white">{files.icon.name}</p>
                            <p className="text-sm text-gray-400">Icon uploaded</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <Image className="w-8 h-8 text-gray-400" />
                          <div className="text-left">
                            <p className="font-medium text-white">Upload icon</p>
                            <p className="text-sm text-gray-400">PNG or SVG, 512x512px recommended</p>
                          </div>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                {/* Screenshots */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Screenshots (up to 5)
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {files.screenshots.map((screenshot, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-video bg-white/5 rounded-lg border border-white/10 overflow-hidden">
                          <img
                            src={URL.createObjectURL(screenshot)}
                            alt={`Screenshot ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeScreenshot(index)}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    ))}
                    {files.screenshots.length < 5 && (
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => e.target.files?.[0] && handleScreenshotUpload(e.target.files[0])}
                          className="hidden"
                          id="screenshot-upload"
                        />
                        <label
                          htmlFor="screenshot-upload"
                          className="aspect-video flex items-center justify-center bg-white/5 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:bg-white/10 hover:border-purple-500 transition-all"
                        >
                          <div className="text-center">
                            <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-400">Add screenshot</p>
                          </div>
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Documentation */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Documentation
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".md,.pdf,.txt"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload('documentation', e.target.files[0])}
                      className="hidden"
                      id="docs-upload"
                    />
                    <label
                      htmlFor="docs-upload"
                      className="flex items-center justify-center gap-3 p-8 bg-white/5 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:bg-white/10 hover:border-purple-500 transition-all"
                    >
                      {files.documentation ? (
                        <>
                          <FileText className="w-8 h-8 text-green-400" />
                          <div className="text-left">
                            <p className="font-medium text-white">{files.documentation.name}</p>
                            <p className="text-sm text-gray-400">Documentation uploaded</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <FileText className="w-8 h-8 text-gray-400" />
                          <div className="text-left">
                            <p className="font-medium text-white">Upload documentation</p>
                            <p className="text-sm text-gray-400">Markdown, PDF, or TXT</p>
                          </div>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review & Submit */}
            {currentStep === 4 && (
              <div className="space-y-6">
                {validating ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="w-12 h-12 text-purple-400 animate-spin mb-4" />
                    <p className="text-gray-400">Validating plugin...</p>
                  </div>
                ) : validation.passed ? (
                  <>
                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-green-400 mb-1">Validation Passed!</p>
                          <p className="text-sm text-green-300 opacity-80">
                            Your plugin meets all requirements and is ready for submission.
                          </p>
                        </div>
                      </div>
                    </div>

                    {validation.warnings.length > 0 && (
                      <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-yellow-400 mb-2">Warnings</p>
                            <ul className="space-y-1">
                              {validation.warnings.map((warning, index) => (
                                <li key={index} className="text-sm text-yellow-300 opacity-80">• {warning}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Plugin Summary</h3>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-white/5 rounded-lg">
                            <div className="text-sm text-gray-400">Name</div>
                            <div className="font-medium text-white">{formData.name}</div>
                          </div>
                          <div className="p-3 bg-white/5 rounded-lg">
                            <div className="text-sm text-gray-400">Version</div>
                            <div className="font-medium text-white">{formData.version}</div>
                          </div>
                          <div className="p-3 bg-white/5 rounded-lg">
                            <div className="text-sm text-gray-400">Category</div>
                            <div className="font-medium text-white">{formData.category}</div>
                          </div>
                          <div className="p-3 bg-white/5 rounded-lg">
                            <div className="text-sm text-gray-400">License</div>
                            <div className="font-medium text-white">{formData.license}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-300">
                          <p className="font-medium mb-1">What happens next?</p>
                          <ul className="space-y-1 opacity-80">
                            <li>• Your plugin will be reviewed by our team</li>
                            <li>• You'll receive an email within 2-3 business days</li>
                            <li>• Once approved, your plugin will be live in the marketplace</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-red-400 mb-2">Validation Failed</p>
                        <ul className="space-y-1">
                          {validation.errors.map((error, index) => (
                            <li key={index} className="text-sm text-red-300 opacity-80">• {error}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-white/10 p-6 bg-black/20">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
              >
                Previous
              </Button>

              <div className="flex items-center gap-3">
                {currentStep < 4 && (
                  <Button
                    onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
                    disabled={
                      (currentStep === 1 && (!formData.name || !formData.description || !formData.category || !formData.author || !formData.authorEmail)) ||
                      (currentStep === 2 && formData.features.length === 0) ||
                      (currentStep === 3 && !files.plugin)
                    }
                  >
                    Next
                  </Button>
                )}

                {currentStep === 3 && (
                  <Button
                    onClick={handleValidate}
                    disabled={!files.plugin || validating}
                  >
                    {validating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Validating...
                      </>
                    ) : (
                      'Validate & Continue'
                    )}
                  </Button>
                )}

                {currentStep === 4 && validation.passed && (
                  <Button
                    onClick={handleSubmit}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Submit Plugin
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}