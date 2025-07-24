'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Bot, 
  Brain, 
  Zap, 
  Shield, 
  Globe, 
  Key,
  TestTube,
  CheckCircle,
  XCircle,
  Loader2,
  Info,
  Copy,
  Eye,
  EyeOff,
  Settings,
  FileCode,
  Clock,
  Gauge,
  Database,
  Sparkles,
  AlertCircle,
  Plus,
  Trash2,
  MessageSquare,
  BarChart3,
  Search
} from 'lucide-react'
import { Button } from '@ultimate-ai/shared-ui'

interface AgentConfigDialogProps {
  isOpen: boolean
  onClose: () => void
  agent?: {
    id: string
    name: string
    type: string
    model: string
    description?: string
    systemPrompt?: string
    capabilities?: string[]
  }
}

const agentTypes = [
  { value: 'conversational', label: 'Conversational', icon: MessageSquare, description: 'Natural language interactions' },
  { value: 'analytical', label: 'Analytical', icon: BarChart3, description: 'Data analysis and insights' },
  { value: 'creative', label: 'Creative', icon: Sparkles, description: 'Content generation and creativity' },
  { value: 'coding', label: 'Coding', icon: FileCode, description: 'Code generation and review' },
  { value: 'research', label: 'Research', icon: Search, description: 'Information gathering and synthesis' },
  { value: 'automation', label: 'Automation', icon: Zap, description: 'Task automation and workflows' }
]

const aiModels = [
  { value: 'gpt-4', label: 'GPT-4', provider: 'OpenAI' },
  { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo', provider: 'OpenAI' },
  { value: 'claude-3-opus', label: 'Claude 3 Opus', provider: 'Anthropic' },
  { value: 'claude-3-sonnet', label: 'Claude 3 Sonnet', provider: 'Anthropic' },
  { value: 'gemini-pro', label: 'Gemini Pro', provider: 'Google' },
  { value: 'llama-2-70b', label: 'Llama 2 70B', provider: 'Meta' }
]

export function AgentConfigDialog({ isOpen, onClose, agent }: AgentConfigDialogProps) {
  const [formData, setFormData] = useState({
    name: agent?.name || '',
    type: agent?.type || 'conversational',
    model: agent?.model || 'gpt-4',
    description: agent?.description || '',
    systemPrompt: agent?.systemPrompt || '',
    temperature: 0.7,
    maxTokens: 2048,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
    capabilities: agent?.capabilities || [],
    apiKey: '',
    memorySize: 1000,
    rateLimit: 60,
    autoSave: true,
    logging: true,
    webhookUrl: '',
    scheduleEnabled: false,
    schedulePattern: ''
  })

  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<{
    success: boolean
    message: string
    details?: any
  } | null>(null)
  const [showApiKey, setShowApiKey] = useState(false)
  const [newCapability, setNewCapability] = useState('')
  const [activeTab, setActiveTab] = useState('basic')

  const handleTestAgent = async () => {
    setTesting(true)
    setTestResult(null)

    // Simulate agent test
    await new Promise(resolve => setTimeout(resolve, 2000))

    const success = Math.random() > 0.2
    setTestResult({
      success,
      message: success 
        ? 'Agent configuration is valid and ready to deploy!'
        : 'Agent configuration failed validation. Please check your settings.',
      details: success ? {
        modelAvailable: true,
        apiKeyValid: true,
        promptTokens: 150,
        estimatedCost: '$0.0045'
      } : {
        error: 'Invalid API key or model not available',
        code: 'AUTH_ERROR'
      }
    })
    setTesting(false)
  }

  const handleAddCapability = () => {
    if (newCapability.trim()) {
      setFormData({
        ...formData,
        capabilities: [...formData.capabilities, newCapability.trim()]
      })
      setNewCapability('')
    }
  }

  const handleRemoveCapability = (index: number) => {
    setFormData({
      ...formData,
      capabilities: formData.capabilities.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Submitting agent config:', formData)
    onClose()
  }

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: Bot },
    { id: 'model', label: 'Model Config', icon: Brain },
    { id: 'capabilities', label: 'Capabilities', icon: Zap },
    { id: 'advanced', label: 'Advanced', icon: Settings }
  ]

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
          className="relative w-full max-w-4xl bg-gray-900 rounded-2xl border border-white/10 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h2 className="text-2xl font-bold text-white">
              {agent ? 'Edit Agent' : 'Create New Agent'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-2 bg-black/20 border-b border-white/10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            {/* Basic Info Tab */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Agent Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                    placeholder="My AI Assistant"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Agent Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {agentTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, type: type.value })}
                        className={`flex items-start gap-3 p-4 rounded-lg border transition-all ${
                          formData.type === type.value
                            ? 'bg-purple-500/20 border-purple-500 text-white'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                        }`}
                      >
                        <type.icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <div className="text-left">
                          <div className="font-medium">{type.label}</div>
                          <div className="text-xs mt-0.5 opacity-70">{type.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                    placeholder="Describe what this agent does..."
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    System Prompt
                  </label>
                  <textarea
                    value={formData.systemPrompt}
                    onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 font-mono text-sm"
                    placeholder="You are a helpful AI assistant..."
                    rows={6}
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Define the agent's behavior, personality, and constraints
                  </p>
                </div>
              </div>
            )}

            {/* Model Configuration Tab */}
            {activeTab === 'model' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    AI Model
                  </label>
                  <select
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    {aiModels.map((model) => (
                      <option key={model.value} value={model.value}>
                        {model.label} ({model.provider})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    API Key
                  </label>
                  <div className="relative">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={formData.apiKey}
                      onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                      className="w-full px-4 py-2 pr-20 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                      placeholder="sk-..."
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                      <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-white"
                      >
                        {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(formData.apiKey)}
                        className="p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-white"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Temperature
                      <span className="ml-2 text-xs text-gray-500">{formData.temperature}</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={formData.temperature}
                      onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Focused</span>
                      <span>Creative</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Max Tokens
                    </label>
                    <input
                      type="number"
                      value={formData.maxTokens}
                      onChange={(e) => setFormData({ ...formData, maxTokens: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
                      min="1"
                      max="32000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Top P
                      <span className="ml-2 text-xs text-gray-500">{formData.topP}</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={formData.topP}
                      onChange={(e) => setFormData({ ...formData, topP: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Memory Size (messages)
                    </label>
                    <input
                      type="number"
                      value={formData.memorySize}
                      onChange={(e) => setFormData({ ...formData, memorySize: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
                      min="0"
                      max="10000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Frequency Penalty
                      <span className="ml-2 text-xs text-gray-500">{formData.frequencyPenalty}</span>
                    </label>
                    <input
                      type="range"
                      min="-2"
                      max="2"
                      step="0.1"
                      value={formData.frequencyPenalty}
                      onChange={(e) => setFormData({ ...formData, frequencyPenalty: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Presence Penalty
                      <span className="ml-2 text-xs text-gray-500">{formData.presencePenalty}</span>
                    </label>
                    <input
                      type="range"
                      min="-2"
                      max="2"
                      step="0.1"
                      value={formData.presencePenalty}
                      onChange={(e) => setFormData({ ...formData, presencePenalty: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Capabilities Tab */}
            {activeTab === 'capabilities' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Agent Capabilities
                  </label>
                  <p className="text-sm text-gray-500 mb-4">
                    Define what this agent can do. These capabilities will be shown to users.
                  </p>

                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={newCapability}
                      onChange={(e) => setNewCapability(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCapability())}
                      className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                      placeholder="Add a capability..."
                    />
                    <Button
                      type="button"
                      onClick={handleAddCapability}
                      disabled={!newCapability.trim()}
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {formData.capabilities.map((capability, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 p-3 bg-white/5 border border-white/10 rounded-lg"
                      >
                        <Zap className="w-4 h-4 text-purple-400" />
                        <span className="flex-1 text-sm text-gray-300">{capability}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCapability(index)}
                          className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </div>

                  {formData.capabilities.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No capabilities added yet
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-4">Suggested Capabilities</h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Answer questions',
                      'Generate content',
                      'Analyze data',
                      'Write code',
                      'Translate languages',
                      'Summarize text',
                      'Extract information',
                      'Create reports'
                    ].map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => {
                          if (!formData.capabilities.includes(suggestion)) {
                            setFormData({
                              ...formData,
                              capabilities: [...formData.capabilities, suggestion]
                            })
                          }
                        }}
                        className="px-3 py-1 text-xs rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-all"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Advanced Tab */}
            {activeTab === 'advanced' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                    <Gauge className="w-5 h-5 text-purple-400" />
                    Rate Limiting
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Requests per minute
                      </label>
                      <input
                        type="number"
                        value={formData.rateLimit}
                        onChange={(e) => setFormData({ ...formData, rateLimit: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
                        min="1"
                        max="1000"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                    <Clock className="w-5 h-5 text-purple-400" />
                    Scheduling
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="scheduleEnabled"
                        checked={formData.scheduleEnabled}
                        onChange={(e) => setFormData({ ...formData, scheduleEnabled: e.target.checked })}
                        className="w-4 h-4 rounded border-white/10 bg-white/5 text-purple-500 focus:ring-purple-500"
                      />
                      <label htmlFor="scheduleEnabled" className="text-sm text-gray-300">
                        Enable scheduled tasks
                      </label>
                    </div>

                    {formData.scheduleEnabled && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Cron Pattern
                        </label>
                        <input
                          type="text"
                          value={formData.schedulePattern}
                          onChange={(e) => setFormData({ ...formData, schedulePattern: e.target.value })}
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 font-mono"
                          placeholder="0 */6 * * *"
                        />
                        <p className="mt-2 text-xs text-gray-500">
                          Use cron syntax (e.g., "0 */6 * * *" for every 6 hours)
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                    <Globe className="w-5 h-5 text-purple-400" />
                    Webhooks
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Webhook URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={formData.webhookUrl}
                      onChange={(e) => setFormData({ ...formData, webhookUrl: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                      placeholder="https://api.example.com/webhook"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      Receive notifications about agent events
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                    <Database className="w-5 h-5 text-purple-400" />
                    Data & Logging
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="autoSave"
                        checked={formData.autoSave}
                        onChange={(e) => setFormData({ ...formData, autoSave: e.target.checked })}
                        className="w-4 h-4 rounded border-white/10 bg-white/5 text-purple-500 focus:ring-purple-500"
                      />
                      <label htmlFor="autoSave" className="text-sm text-gray-300">
                        Auto-save conversations
                      </label>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="logging"
                        checked={formData.logging}
                        onChange={(e) => setFormData({ ...formData, logging: e.target.checked })}
                        className="w-4 h-4 rounded border-white/10 bg-white/5 text-purple-500 focus:ring-purple-500"
                      />
                      <label htmlFor="logging" className="text-sm text-gray-300">
                        Enable detailed logging
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Test Section */}
            <div className="mt-8 pt-6 border-t border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <TestTube className="w-5 h-5 text-purple-400" />
                  Test Configuration
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleTestAgent}
                  disabled={!formData.name || !formData.model || testing}
                >
                  {testing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <TestTube className="w-4 h-4" />
                      Test Agent
                    </>
                  )}
                </Button>
              </div>

              {testResult && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg border ${
                    testResult.success
                      ? 'bg-green-500/10 border-green-500/20 text-green-400'
                      : 'bg-red-500/10 border-red-500/20 text-red-400'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {testResult.success ? (
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 space-y-2">
                      <p className="font-medium">{testResult.message}</p>
                      {testResult.details && (
                        <div className="text-sm opacity-80">
                          {testResult.success ? (
                            <>
                              <p>Model: Available ✓</p>
                              <p>API Key: Valid ✓</p>
                              <p>Prompt tokens: {testResult.details.promptTokens}</p>
                              <p>Estimated cost: {testResult.details.estimatedCost}</p>
                            </>
                          ) : (
                            <>
                              <p>Error: {testResult.details.error}</p>
                              <p>Code: {testResult.details.code}</p>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!formData.name || !formData.model}
              >
                {agent ? 'Update Agent' : 'Create Agent'}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}