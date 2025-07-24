'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Puzzle, 
  Download,
  Star,
  Users,
  Calendar,
  Code,
  Shield,
  Zap,
  Settings,
  Trash2,
  RefreshCw,
  ExternalLink,
  GitBranch,
  FileText,
  CheckCircle,
  AlertTriangle,
  Info,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Share2,
  Heart,
  ChevronRight,
  Terminal,
  Lock,
  Unlock
} from 'lucide-react'
import { Button, ProgressBar } from '@ultimate-ai/shared-ui'

interface PluginDetailsDialogProps {
  isOpen: boolean
  onClose: () => void
  plugin?: {
    id: string
    name: string
    description: string
    version: string
    author: string
    category: string
    status: 'active' | 'inactive' | 'update-available'
    rating: number
    downloads: number
    size: string
    lastUpdated: string
    features?: string[]
  }
}

export function PluginDetailsDialog({ isOpen, onClose, plugin }: PluginDetailsDialogProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [installing, setInstalling] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [userRating, setUserRating] = useState(0)
  const [reviewText, setReviewText] = useState('')

  if (!isOpen || !plugin) return null

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'permissions', label: 'Permissions', icon: Shield },
    { id: 'changelog', label: 'Changelog', icon: GitBranch },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  // Mock data
  const permissions = [
    { name: 'File System Access', description: 'Read and write files in project directory', level: 'high', granted: true },
    { name: 'Network Access', description: 'Make HTTP requests to external services', level: 'medium', granted: true },
    { name: 'Database Access', description: 'Query and modify database records', level: 'high', granted: false },
    { name: 'System Information', description: 'Access system metrics and information', level: 'low', granted: true }
  ]

  const changelog = [
    { version: '2.1.0', date: '2025-07-20', changes: ['Added support for TypeScript 5.0', 'Improved performance by 30%', 'Fixed memory leak issue'] },
    { version: '2.0.0', date: '2025-07-10', changes: ['Complete rewrite with new architecture', 'Added real-time collaboration', 'New UI with dark mode'] },
    { version: '1.5.2', date: '2025-06-25', changes: ['Bug fixes and stability improvements'] }
  ]

  const reviews = [
    { user: 'JohnDev', rating: 5, date: '2 days ago', text: 'Excellent plugin! Saved me hours of work. The AI suggestions are spot on.', helpful: 24, notHelpful: 2 },
    { user: 'CodeMaster', rating: 4, date: '1 week ago', text: 'Great functionality but could use better documentation. Overall very useful.', helpful: 15, notHelpful: 1 },
    { user: 'DevOps_Pro', rating: 5, date: '2 weeks ago', text: 'This is a must-have for any serious developer. Integration is seamless!', helpful: 32, notHelpful: 0 }
  ]

  const relatedPlugins = [
    { name: 'Code Assistant Pro', category: 'AI', rating: 4.9 },
    { name: 'Smart Debugger', category: 'Development', rating: 4.7 },
    { name: 'API Tester', category: 'Integration', rating: 4.6 }
  ]

  const handleInstall = async () => {
    setInstalling(true)
    await new Promise(resolve => setTimeout(resolve, 3000))
    setInstalling(false)
  }

  const handleUpdate = async () => {
    setUpdating(true)
    await new Promise(resolve => setTimeout(resolve, 3000))
    setUpdating(false)
  }

  const getPermissionIcon = (level: string) => {
    switch (level) {
      case 'high': return AlertTriangle
      case 'medium': return Info
      case 'low': return CheckCircle
      default: return Info
    }
  }

  const getPermissionColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-400 bg-red-500/20 border-red-500/30'
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/30'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

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
          className="relative w-full max-w-5xl max-h-[90vh] bg-gray-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-600/20 border-b border-white/10">
            <div className="flex items-start justify-between p-6">
              <div className="flex items-start gap-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                  <Puzzle className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-1">{plugin.name}</h2>
                  <p className="text-gray-400 mb-3">{plugin.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-400">v{plugin.version}</span>
                    <span className="text-gray-400">by {plugin.author}</span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(plugin.rating)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-600'
                          }`}
                        />
                      ))}
                      <span className="text-gray-400 ml-1">{plugin.rating}</span>
                    </div>
                    <span className="text-gray-400 flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      {plugin.downloads.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="px-6 pb-4 flex items-center gap-3">
              {plugin.status === 'inactive' && (
                <Button onClick={handleInstall} disabled={installing}>
                  {installing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Installing...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Install Plugin
                    </>
                  )}
                </Button>
              )}
              {plugin.status === 'update-available' && (
                <Button onClick={handleUpdate} disabled={updating}>
                  {updating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      Update to v2.2.0
                    </>
                  )}
                </Button>
              )}
              {plugin.status === 'active' && (
                <>
                  <Button variant="outline">
                    <Settings className="w-4 h-4" />
                    Configure
                  </Button>
                  <Button variant="outline">
                    <Shield className="w-4 h-4" />
                    Disable
                  </Button>
                </>
              )}
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Heart className="w-4 h-4" />
                Save
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-2 bg-black/20 border-b border-white/10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white/10 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 320px)' }}>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="p-6 space-y-6">
                {/* Features */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Key Features</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {plugin.features?.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                        <Zap className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Screenshots */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Screenshots</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="aspect-video bg-white/5 rounded-lg border border-white/10 overflow-hidden">
                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                          <Code className="w-8 h-8" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technical Details */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Technical Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="text-sm text-gray-400 mb-1">Size</div>
                      <div className="text-white">{plugin.size}</div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="text-sm text-gray-400 mb-1">Last Updated</div>
                      <div className="text-white">{plugin.lastUpdated}</div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="text-sm text-gray-400 mb-1">Category</div>
                      <div className="text-white capitalize">{plugin.category}</div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="text-sm text-gray-400 mb-1">License</div>
                      <div className="text-white">MIT</div>
                    </div>
                  </div>
                </div>

                {/* Related Plugins */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Related Plugins</h3>
                  <div className="space-y-3">
                    {relatedPlugins.map((related, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 cursor-pointer transition-all">
                        <div>
                          <div className="font-medium text-white">{related.name}</div>
                          <div className="text-sm text-gray-400">{related.category}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-sm text-gray-400">{related.rating}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Permissions Tab */}
            {activeTab === 'permissions' && (
              <div className="p-6 space-y-6">
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-yellow-300">
                      <p className="font-medium mb-1">Permission Review Required</p>
                      <p className="opacity-80">
                        This plugin requires access to sensitive system resources. Review and grant only the permissions you're comfortable with.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {permissions.map((permission, index) => {
                    const PermIcon = getPermissionIcon(permission.level)
                    return (
                      <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${getPermissionColor(permission.level)}`}>
                              <PermIcon className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="font-medium text-white mb-1">{permission.name}</div>
                              <div className="text-sm text-gray-400">{permission.description}</div>
                            </div>
                          </div>
                          <button
                            className={`p-2 rounded-lg transition-all ${
                              permission.granted
                                ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                            }`}
                          >
                            {permission.granted ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-300">
                      <p className="font-medium mb-1">Sandboxed Execution</p>
                      <p className="opacity-80">
                        All plugins run in a secure sandbox environment. They cannot access resources outside their granted permissions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Changelog Tab */}
            {activeTab === 'changelog' && (
              <div className="p-6 space-y-6">
                {changelog.map((version, index) => (
                  <div key={index} className="relative">
                    {index < changelog.length - 1 && (
                      <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-white/10" />
                    )}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                        <GitBranch className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-white">Version {version.version}</h4>
                          <span className="text-sm text-gray-400">{version.date}</span>
                        </div>
                        <ul className="space-y-1">
                          {version.changes.map((change, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                              <span className="text-green-400 mt-0.5">•</span>
                              {change}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="p-6 space-y-6">
                {/* Write Review */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Write a Review</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">Your Rating:</span>
                      {[...Array(5)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setUserRating(i + 1)}
                          className="p-1"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              i < userRating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-600 hover:text-gray-400'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Share your experience with this plugin..."
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                      rows={4}
                    />
                    <Button disabled={!userRating || !reviewText.trim()}>
                      Post Review
                    </Button>
                  </div>
                </div>

                {/* Reviews List */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">User Reviews</h3>
                  <div className="space-y-4">
                    {reviews.map((review, index) => (
                      <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-3">
                              <span className="font-medium text-white">{review.user}</span>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3 h-3 ${
                                      i < review.rating
                                        ? 'text-yellow-400 fill-yellow-400'
                                        : 'text-gray-600'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-500">{review.date}</span>
                            </div>
                          </div>
                          <button className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white">
                            <Flag className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-300 mb-3">{review.text}</p>
                        <div className="flex items-center gap-4">
                          <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-green-400">
                            <ThumbsUp className="w-4 h-4" />
                            {review.helpful}
                          </button>
                          <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400">
                            <ThumbsDown className="w-4 h-4" />
                            {review.notHelpful}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Plugin Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                      <div>
                        <div className="font-medium text-white">Auto-update</div>
                        <div className="text-sm text-gray-400">Automatically install updates when available</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                      <div>
                        <div className="font-medium text-white">Run on startup</div>
                        <div className="text-sm text-gray-400">Start plugin automatically when the app launches</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                      <div>
                        <div className="font-medium text-white">Collect usage analytics</div>
                        <div className="text-sm text-gray-400">Help improve this plugin by sharing anonymous usage data</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Resource Limits</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm text-gray-400">Max CPU Usage</label>
                        <span className="text-sm text-white">50%</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        defaultValue="50"
                        className="w-full"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm text-gray-400">Max Memory Usage</label>
                        <span className="text-sm text-white">512MB</span>
                      </div>
                      <input
                        type="range"
                        min="128"
                        max="2048"
                        defaultValue="512"
                        step="128"
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <Button variant="outline" className="text-red-400 border-red-500/30 hover:bg-red-500/20">
                    <Trash2 className="w-4 h-4" />
                    Uninstall Plugin
                  </Button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}