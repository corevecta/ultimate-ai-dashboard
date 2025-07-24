'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Server, 
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
  Settings
} from 'lucide-react'
import { Button } from '@ultimate-ai/shared-ui'

interface MCPServerConfigDialogProps {
  isOpen: boolean
  onClose: () => void
  server?: {
    id: string
    name: string
    endpoint: string
    type: string
    auth?: {
      type: string
      credentials?: any
    }
  }
}

export function MCPServerConfigDialog({ isOpen, onClose, server }: MCPServerConfigDialogProps) {
  const [formData, setFormData] = useState({
    name: server?.name || '',
    endpoint: server?.endpoint || '',
    type: server?.type || 'rest',
    authType: server?.auth?.type || 'none',
    apiKey: '',
    username: '',
    password: '',
    token: '',
    description: '',
    enableHealthCheck: true,
    healthCheckInterval: 30,
    timeout: 5000,
    retryAttempts: 3
  })

  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<{
    success: boolean
    message: string
    details?: any
  } | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)

  const serverTypes = [
    { value: 'rest', label: 'REST API', icon: Globe },
    { value: 'graphql', label: 'GraphQL', icon: Zap },
    { value: 'websocket', label: 'WebSocket', icon: Server },
    { value: 'grpc', label: 'gRPC', icon: Shield }
  ]

  const authTypes = [
    { value: 'none', label: 'No Authentication' },
    { value: 'api-key', label: 'API Key' },
    { value: 'bearer', label: 'Bearer Token' },
    { value: 'basic', label: 'Basic Auth' },
    { value: 'oauth2', label: 'OAuth 2.0' }
  ]

  const handleTestConnection = async () => {
    setTesting(true)
    setTestResult(null)

    // Simulate connection test
    await new Promise(resolve => setTimeout(resolve, 2000))

    const success = Math.random() > 0.3
    setTestResult({
      success,
      message: success 
        ? 'Connection successful! Server is responding correctly.'
        : 'Connection failed. Please check your configuration.',
      details: success ? {
        latency: Math.floor(Math.random() * 100) + 20,
        version: '2.1.0',
        capabilities: ['streaming', 'batch', 'async']
      } : {
        error: 'ECONNREFUSED',
        code: 'CONNECTION_ERROR'
      }
    })
    setTesting(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Submitting server config:', formData)
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
          className="relative w-full max-w-2xl bg-gray-900 rounded-2xl border border-white/10 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h2 className="text-2xl font-bold text-white">
              {server ? 'Edit MCP Server' : 'Add MCP Server'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Server className="w-5 h-5 text-purple-400" />
                Basic Information
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Server Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  placeholder="My MCP Server"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Endpoint URL
                </label>
                <input
                  type="url"
                  value={formData.endpoint}
                  onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  placeholder="https://api.example.com/mcp"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Server Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {serverTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, type: type.value })}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                        formData.type === type.value
                          ? 'bg-purple-500/20 border-purple-500 text-white'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      <type.icon className="w-5 h-5" />
                      <span>{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  placeholder="Brief description of this server's purpose..."
                  rows={3}
                />
              </div>
            </div>

            {/* Authentication */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-purple-400" />
                Authentication
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Authentication Type
                </label>
                <select
                  value={formData.authType}
                  onChange={(e) => setFormData({ ...formData, authType: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
                >
                  {authTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dynamic auth fields based on type */}
              {formData.authType === 'api-key' && (
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
              )}

              {formData.authType === 'basic' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                      placeholder="username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-4 py-2 pr-12 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {formData.authType === 'bearer' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Bearer Token
                  </label>
                  <input
                    type="text"
                    value={formData.token}
                    onChange={(e) => setFormData({ ...formData, token: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                    placeholder="eyJhbGc..."
                  />
                </div>
              )}
            </div>

            {/* Advanced Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-400" />
                Advanced Settings
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Timeout (ms)
                  </label>
                  <input
                    type="number"
                    value={formData.timeout}
                    onChange={(e) => setFormData({ ...formData, timeout: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                    min="1000"
                    max="60000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Retry Attempts
                  </label>
                  <input
                    type="number"
                    value={formData.retryAttempts}
                    onChange={(e) => setFormData({ ...formData, retryAttempts: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                    min="0"
                    max="10"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="healthCheck"
                  checked={formData.enableHealthCheck}
                  onChange={(e) => setFormData({ ...formData, enableHealthCheck: e.target.checked })}
                  className="w-4 h-4 rounded border-white/10 bg-white/5 text-purple-500 focus:ring-purple-500"
                />
                <label htmlFor="healthCheck" className="text-sm text-gray-300">
                  Enable automatic health checks
                </label>
              </div>

              {formData.enableHealthCheck && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Health Check Interval (seconds)
                  </label>
                  <input
                    type="number"
                    value={formData.healthCheckInterval}
                    onChange={(e) => setFormData({ ...formData, healthCheckInterval: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                    min="10"
                    max="300"
                  />
                </div>
              )}
            </div>

            {/* Connection Test */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <TestTube className="w-5 h-5 text-purple-400" />
                  Connection Test
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleTestConnection}
                  disabled={!formData.endpoint || testing}
                >
                  {testing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <TestTube className="w-4 h-4" />
                      Test Connection
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
                              <p>Latency: {testResult.details.latency}ms</p>
                              <p>Version: {testResult.details.version}</p>
                              <p>Capabilities: {testResult.details.capabilities.join(', ')}</p>
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

            {/* Info Box */}
            <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-300">
                <p className="font-medium mb-1">Model Context Protocol (MCP)</p>
                <p className="opacity-80">
                  MCP servers enable AI models to access external tools and data sources. 
                  Ensure your server implements the MCP specification for optimal compatibility.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!formData.name || !formData.endpoint}
              >
                {server ? 'Update Server' : 'Add Server'}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}