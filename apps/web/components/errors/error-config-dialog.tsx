'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Bell, 
  Filter,
  Mail,
  MessageSquare,
  Webhook,
  Shield,
  Zap,
  AlertTriangle,
  Settings,
  Plus,
  Trash2,
  Save,
  TestTube,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react'
import { Button } from '@ultimate-ai/shared-ui'

interface ErrorConfigDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function ErrorConfigDialog({ isOpen, onClose }: ErrorConfigDialogProps) {
  const [activeTab, setActiveTab] = useState('alerts')
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<{
    success: boolean
    message: string
  } | null>(null)

  const [alertConfig, setAlertConfig] = useState({
    enableAlerts: true,
    criticalThreshold: 5,
    errorThreshold: 20,
    warningThreshold: 50,
    timeWindow: 60, // minutes
    channels: {
      email: true,
      slack: true,
      webhook: false,
      pagerduty: false
    },
    emailRecipients: ['team@example.com'],
    slackWebhook: '',
    customWebhook: '',
    pagerdutyKey: ''
  })

  const [filterConfig, setFilterConfig] = useState({
    autoGroup: true,
    groupingRules: [
      { field: 'message', similarity: 90 },
      { field: 'stackTrace', similarity: 80 }
    ],
    ignorePatterns: [
      'HealthCheck',
      'Ping',
      '/favicon.ico'
    ],
    retentionDays: 30,
    samplingRate: 100
  })

  const [newEmail, setNewEmail] = useState('')
  const [newPattern, setNewPattern] = useState('')

  const handleTestAlerts = async () => {
    setTesting(true)
    setTestResult(null)

    // Simulate test
    await new Promise(resolve => setTimeout(resolve, 2000))

    const success = Math.random() > 0.3
    setTestResult({
      success,
      message: success 
        ? 'Alert configuration tested successfully! A test notification has been sent.'
        : 'Alert test failed. Please check your configuration.'
    })
    setTesting(false)
  }

  const handleAddEmail = () => {
    if (newEmail && !alertConfig.emailRecipients.includes(newEmail)) {
      setAlertConfig({
        ...alertConfig,
        emailRecipients: [...alertConfig.emailRecipients, newEmail]
      })
      setNewEmail('')
    }
  }

  const handleRemoveEmail = (email: string) => {
    setAlertConfig({
      ...alertConfig,
      emailRecipients: alertConfig.emailRecipients.filter(e => e !== email)
    })
  }

  const handleAddPattern = () => {
    if (newPattern && !filterConfig.ignorePatterns.includes(newPattern)) {
      setFilterConfig({
        ...filterConfig,
        ignorePatterns: [...filterConfig.ignorePatterns, newPattern]
      })
      setNewPattern('')
    }
  }

  const handleRemovePattern = (pattern: string) => {
    setFilterConfig({
      ...filterConfig,
      ignorePatterns: filterConfig.ignorePatterns.filter(p => p !== pattern)
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Saving configuration:', { alertConfig, filterConfig })
    onClose()
  }

  const tabs = [
    { id: 'alerts', label: 'Alert Rules', icon: Bell },
    { id: 'channels', label: 'Notification Channels', icon: MessageSquare },
    { id: 'filters', label: 'Filters & Grouping', icon: Filter },
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
          className="relative w-full max-w-3xl bg-gray-900 rounded-2xl border border-white/10 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h2 className="text-2xl font-bold text-white">Error Tracking Configuration</h2>
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
            {/* Alert Rules Tab */}
            {activeTab === 'alerts' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="enableAlerts"
                    checked={alertConfig.enableAlerts}
                    onChange={(e) => setAlertConfig({ ...alertConfig, enableAlerts: e.target.checked })}
                    className="w-4 h-4 rounded border-white/10 bg-white/5 text-purple-500 focus:ring-purple-500"
                  />
                  <label htmlFor="enableAlerts" className="text-sm text-gray-300">
                    Enable automatic error alerts
                  </label>
                </div>

                {alertConfig.enableAlerts && (
                  <>
                    <div>
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                        <AlertTriangle className="w-5 h-5 text-purple-400" />
                        Alert Thresholds
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Critical Errors
                            <span className="ml-2 text-xs text-gray-500">
                              Alert when {alertConfig.criticalThreshold} critical errors occur
                            </span>
                          </label>
                          <input
                            type="number"
                            value={alertConfig.criticalThreshold}
                            onChange={(e) => setAlertConfig({ ...alertConfig, criticalThreshold: parseInt(e.target.value) })}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
                            min="1"
                            max="100"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Regular Errors
                            <span className="ml-2 text-xs text-gray-500">
                              Alert when {alertConfig.errorThreshold} errors occur
                            </span>
                          </label>
                          <input
                            type="number"
                            value={alertConfig.errorThreshold}
                            onChange={(e) => setAlertConfig({ ...alertConfig, errorThreshold: parseInt(e.target.value) })}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
                            min="1"
                            max="1000"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Warnings
                            <span className="ml-2 text-xs text-gray-500">
                              Alert when {alertConfig.warningThreshold} warnings occur
                            </span>
                          </label>
                          <input
                            type="number"
                            value={alertConfig.warningThreshold}
                            onChange={(e) => setAlertConfig({ ...alertConfig, warningThreshold: parseInt(e.target.value) })}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
                            min="1"
                            max="10000"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Time Window (minutes)
                            <span className="ml-2 text-xs text-gray-500">
                              Count errors within this time period
                            </span>
                          </label>
                          <select
                            value={alertConfig.timeWindow}
                            onChange={(e) => setAlertConfig({ ...alertConfig, timeWindow: parseInt(e.target.value) })}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
                          >
                            <option value="5">5 minutes</option>
                            <option value="15">15 minutes</option>
                            <option value="30">30 minutes</option>
                            <option value="60">1 hour</option>
                            <option value="360">6 hours</option>
                            <option value="1440">24 hours</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Zap className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-300">
                          <p className="font-medium mb-1">Smart Alerting</p>
                          <p className="opacity-80">
                            Alerts are automatically deduplicated and grouped to prevent notification fatigue. 
                            Similar errors within the time window are consolidated into a single alert.
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Notification Channels Tab */}
            {activeTab === 'channels' && (
              <div className="space-y-6">
                {/* Email */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <input
                      type="checkbox"
                      id="emailChannel"
                      checked={alertConfig.channels.email}
                      onChange={(e) => setAlertConfig({ 
                        ...alertConfig, 
                        channels: { ...alertConfig.channels, email: e.target.checked }
                      })}
                      className="w-4 h-4 rounded border-white/10 bg-white/5 text-purple-500 focus:ring-purple-500"
                    />
                    <label htmlFor="emailChannel" className="flex items-center gap-2 text-sm text-gray-300">
                      <Mail className="w-4 h-4" />
                      Email Notifications
                    </label>
                  </div>

                  {alertConfig.channels.email && (
                    <div className="ml-7 space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="email"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddEmail())}
                          className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                          placeholder="Add email address..."
                        />
                        <Button
                          type="button"
                          onClick={handleAddEmail}
                          disabled={!newEmail}
                        >
                          <Plus className="w-4 h-4" />
                          Add
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {alertConfig.emailRecipients.map((email) => (
                          <div key={email} className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="flex-1 text-sm text-gray-300">{email}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveEmail(email)}
                              className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Slack */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <input
                      type="checkbox"
                      id="slackChannel"
                      checked={alertConfig.channels.slack}
                      onChange={(e) => setAlertConfig({ 
                        ...alertConfig, 
                        channels: { ...alertConfig.channels, slack: e.target.checked }
                      })}
                      className="w-4 h-4 rounded border-white/10 bg-white/5 text-purple-500 focus:ring-purple-500"
                    />
                    <label htmlFor="slackChannel" className="flex items-center gap-2 text-sm text-gray-300">
                      <MessageSquare className="w-4 h-4" />
                      Slack Notifications
                    </label>
                  </div>

                  {alertConfig.channels.slack && (
                    <div className="ml-7">
                      <input
                        type="url"
                        value={alertConfig.slackWebhook}
                        onChange={(e) => setAlertConfig({ ...alertConfig, slackWebhook: e.target.value })}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                        placeholder="https://hooks.slack.com/services/..."
                      />
                      <p className="mt-2 text-xs text-gray-500">
                        Enter your Slack webhook URL to receive notifications
                      </p>
                    </div>
                  )}
                </div>

                {/* Webhook */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <input
                      type="checkbox"
                      id="webhookChannel"
                      checked={alertConfig.channels.webhook}
                      onChange={(e) => setAlertConfig({ 
                        ...alertConfig, 
                        channels: { ...alertConfig.channels, webhook: e.target.checked }
                      })}
                      className="w-4 h-4 rounded border-white/10 bg-white/5 text-purple-500 focus:ring-purple-500"
                    />
                    <label htmlFor="webhookChannel" className="flex items-center gap-2 text-sm text-gray-300">
                      <Webhook className="w-4 h-4" />
                      Custom Webhook
                    </label>
                  </div>

                  {alertConfig.channels.webhook && (
                    <div className="ml-7">
                      <input
                        type="url"
                        value={alertConfig.customWebhook}
                        onChange={(e) => setAlertConfig({ ...alertConfig, customWebhook: e.target.value })}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                        placeholder="https://api.example.com/webhook"
                      />
                      <p className="mt-2 text-xs text-gray-500">
                        POST requests will be sent with error details in JSON format
                      </p>
                    </div>
                  )}
                </div>

                {/* PagerDuty */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <input
                      type="checkbox"
                      id="pagerdutyChannel"
                      checked={alertConfig.channels.pagerduty}
                      onChange={(e) => setAlertConfig({ 
                        ...alertConfig, 
                        channels: { ...alertConfig.channels, pagerduty: e.target.checked }
                      })}
                      className="w-4 h-4 rounded border-white/10 bg-white/5 text-purple-500 focus:ring-purple-500"
                    />
                    <label htmlFor="pagerdutyChannel" className="flex items-center gap-2 text-sm text-gray-300">
                      <Shield className="w-4 h-4" />
                      PagerDuty Integration
                    </label>
                  </div>

                  {alertConfig.channels.pagerduty && (
                    <div className="ml-7">
                      <input
                        type="text"
                        value={alertConfig.pagerdutyKey}
                        onChange={(e) => setAlertConfig({ ...alertConfig, pagerdutyKey: e.target.value })}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                        placeholder="Integration Key"
                      />
                      <p className="mt-2 text-xs text-gray-500">
                        Enter your PagerDuty Events API v2 integration key
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Filters & Grouping Tab */}
            {activeTab === 'filters' && (
              <div className="space-y-6">
                {/* Auto Grouping */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <input
                      type="checkbox"
                      id="autoGroup"
                      checked={filterConfig.autoGroup}
                      onChange={(e) => setFilterConfig({ ...filterConfig, autoGroup: e.target.checked })}
                      className="w-4 h-4 rounded border-white/10 bg-white/5 text-purple-500 focus:ring-purple-500"
                    />
                    <label htmlFor="autoGroup" className="text-sm text-gray-300">
                      Automatically group similar errors
                    </label>
                  </div>

                  {filterConfig.autoGroup && (
                    <div className="ml-7 space-y-3">
                      <p className="text-sm text-gray-400">
                        Errors are grouped based on similarity thresholds:
                      </p>
                      <div className="space-y-2">
                        {filterConfig.groupingRules.map((rule, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <span className="text-sm text-gray-300 w-24">{rule.field}:</span>
                            <input
                              type="range"
                              min="50"
                              max="100"
                              value={rule.similarity}
                              onChange={(e) => {
                                const newRules = [...filterConfig.groupingRules]
                                newRules[index].similarity = parseInt(e.target.value)
                                setFilterConfig({ ...filterConfig, groupingRules: newRules })
                              }}
                              className="flex-1"
                            />
                            <span className="text-sm text-gray-400 w-12">{rule.similarity}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Ignore Patterns */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Ignore Patterns</h3>
                  <p className="text-sm text-gray-400 mb-3">
                    Errors matching these patterns will not trigger alerts
                  </p>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newPattern}
                        onChange={(e) => setNewPattern(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddPattern())}
                        className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                        placeholder="Add pattern to ignore..."
                      />
                      <Button
                        type="button"
                        onClick={handleAddPattern}
                        disabled={!newPattern}
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {filterConfig.ignorePatterns.map((pattern) => (
                        <div key={pattern} className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
                          <code className="flex-1 text-sm text-gray-300">{pattern}</code>
                          <button
                            type="button"
                            onClick={() => handleRemovePattern(pattern)}
                            className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Advanced Tab */}
            {activeTab === 'advanced' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Error Retention Period
                  </label>
                  <select
                    value={filterConfig.retentionDays}
                    onChange={(e) => setFilterConfig({ ...filterConfig, retentionDays: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="7">7 days</option>
                    <option value="14">14 days</option>
                    <option value="30">30 days</option>
                    <option value="60">60 days</option>
                    <option value="90">90 days</option>
                    <option value="365">1 year</option>
                  </select>
                  <p className="mt-2 text-xs text-gray-500">
                    Errors older than this will be automatically deleted
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Sampling Rate
                    <span className="ml-2 text-xs text-gray-500">{filterConfig.samplingRate}%</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={filterConfig.samplingRate}
                    onChange={(e) => setFilterConfig({ ...filterConfig, samplingRate: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    For high-volume applications, you can sample a percentage of errors to reduce overhead
                  </p>
                </div>

                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-yellow-300">
                      <p className="font-medium mb-1">Performance Impact</p>
                      <p className="opacity-80">
                        Reducing sampling rate may cause you to miss important errors. 
                        Consider using ignore patterns instead for known non-critical errors.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Test Configuration */}
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
                  onClick={handleTestAlerts}
                  disabled={testing}
                >
                  {testing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <TestTube className="w-4 h-4" />
                      Send Test Alert
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
                    <p className="text-sm">{testResult.message}</p>
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
              <Button type="submit">
                <Save className="w-4 h-4" />
                Save Configuration
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}