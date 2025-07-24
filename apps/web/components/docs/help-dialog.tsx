'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  HelpCircle,
  MessageSquare,
  Book,
  Video,
  Phone,
  Mail,
  Search,
  ChevronRight,
  ExternalLink,
  Zap,
  Bug,
  Settings,
  Shield,
  Users,
  Lightbulb,
  Clock,
  CheckCircle,
  Send,
  Paperclip,
  AlertCircle,
  Star
} from 'lucide-react'
import { Button } from '@ultimate-ai/shared-ui'

interface HelpDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function HelpDialog({ isOpen, onClose }: HelpDialogProps) {
  const [activeTab, setActiveTab] = useState('help')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
    email: '',
    priority: 'normal'
  })
  const [attachments, setAttachments] = useState<File[]>([])

  const helpCategories = [
    { 
      id: 'getting-started',
      title: 'Getting Started',
      icon: Zap,
      color: 'from-green-500 to-emerald-600',
      articles: [
        'Quick Start Guide',
        'Installation & Setup',
        'First Project Tutorial',
        'Basic Configuration'
      ]
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: Bug,
      color: 'from-red-500 to-orange-600',
      articles: [
        'Common Errors & Solutions',
        'Debugging Tips',
        'Performance Issues',
        'Connection Problems'
      ]
    },
    {
      id: 'api-docs',
      title: 'API Documentation',
      icon: Book,
      color: 'from-blue-500 to-cyan-600',
      articles: [
        'API Reference',
        'Authentication Guide',
        'Rate Limits',
        'Webhooks & Events'
      ]
    },
    {
      id: 'features',
      title: 'Features & Guides',
      icon: Lightbulb,
      color: 'from-purple-500 to-pink-600',
      articles: [
        'AI Agent Configuration',
        'Pipeline Builder Guide',
        'Plugin Development',
        'Advanced Features'
      ]
    },
    {
      id: 'security',
      title: 'Security & Privacy',
      icon: Shield,
      color: 'from-indigo-500 to-purple-600',
      articles: [
        'Security Best Practices',
        'Data Privacy Policy',
        'Access Control',
        'Compliance Guide'
      ]
    },
    {
      id: 'account',
      title: 'Account & Billing',
      icon: Settings,
      color: 'from-gray-500 to-gray-600',
      articles: [
        'Account Management',
        'Billing & Subscriptions',
        'Team Management',
        'API Keys & Tokens'
      ]
    }
  ]

  const faqItems = [
    {
      question: 'How do I create my first AI agent?',
      answer: 'Navigate to the Agents page and click "Create Agent". Follow the setup wizard to configure your agent\'s model, capabilities, and permissions.'
    },
    {
      question: 'What are the API rate limits?',
      answer: 'Free tier: 100 requests/hour. Pro: 1,000 requests/hour. Enterprise: Custom limits. You can view your current usage in the Analytics dashboard.'
    },
    {
      question: 'How do I integrate with external services?',
      answer: 'Use our Plugin marketplace to find pre-built integrations, or develop custom plugins using our SDK. Check the Plugin Development Guide for details.'
    },
    {
      question: 'Can I export my data?',
      answer: 'Yes, you can export all your data from Settings > Data Management. We support JSON, CSV, and SQL dump formats.'
    },
    {
      question: 'How is my data secured?',
      answer: 'We use AES-256 encryption for data at rest and TLS 1.3 for data in transit. All API keys are hashed and we follow SOC 2 compliance standards.'
    }
  ]

  const supportChannels = [
    {
      title: 'Documentation',
      description: 'Browse our comprehensive docs',
      icon: Book,
      action: 'View Docs',
      available: true
    },
    {
      title: 'Video Tutorials',
      description: 'Watch step-by-step guides',
      icon: Video,
      action: 'Watch Videos',
      available: true
    },
    {
      title: 'Live Chat',
      description: 'Chat with our support team',
      icon: MessageSquare,
      action: 'Start Chat',
      available: true,
      status: 'Online'
    },
    {
      title: 'Email Support',
      description: 'Get help via email',
      icon: Mail,
      action: 'Send Email',
      available: true,
      responseTime: '< 24 hours'
    },
    {
      title: 'Phone Support',
      description: 'Talk to a specialist',
      icon: Phone,
      action: 'Call Now',
      available: false,
      note: 'Business hours only'
    },
    {
      title: 'Community Forum',
      description: 'Connect with other users',
      icon: Users,
      action: 'Visit Forum',
      available: true
    }
  ]

  const handleFileUpload = (files: FileList) => {
    const newFiles = Array.from(files).filter(file => file.size <= 10 * 1024 * 1024) // 10MB limit
    setAttachments([...attachments, ...newFiles])
  }

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index))
  }

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Submitting support ticket:', { ...contactForm, attachments })
    // Reset form
    setContactForm({ subject: '', message: '', email: '', priority: 'normal' })
    setAttachments([])
  }

  if (!isOpen) return null

  const tabs = [
    { id: 'help', label: 'Help Center', icon: HelpCircle },
    { id: 'faq', label: 'FAQ', icon: MessageSquare },
    { id: 'contact', label: 'Contact Support', icon: Mail }
  ]

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
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 border-b border-white/10 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <HelpCircle className="w-8 h-8" />
                  Help & Support
                </h2>
                <p className="text-gray-400 mt-1">Get help, browse docs, or contact our support team</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="mt-6 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for help articles, guides, or FAQs..."
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              />
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
          <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(90vh - 280px)' }}>
            {/* Help Center Tab */}
            {activeTab === 'help' && (
              <div className="space-y-6">
                {/* Quick Access */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Quick Access</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {supportChannels.map((channel, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-4 rounded-lg border ${
                          channel.available
                            ? 'bg-white/5 border-white/10 hover:bg-white/10 cursor-pointer'
                            : 'bg-white/5 border-white/5 opacity-50 cursor-not-allowed'
                        } transition-all`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <channel.icon className="w-6 h-6 text-purple-400" />
                          {channel.status && (
                            <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400">
                              {channel.status}
                            </span>
                          )}
                        </div>
                        <h4 className="font-medium text-white mb-1">{channel.title}</h4>
                        <p className="text-sm text-gray-400 mb-3">{channel.description}</p>
                        {channel.responseTime && (
                          <p className="text-xs text-gray-500 mb-3">Response time: {channel.responseTime}</p>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline" 
                          disabled={!channel.available}
                          className="w-full"
                        >
                          {channel.action}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Help Categories */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Browse Help Topics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {helpCategories.map((category) => (
                      <motion.div
                        key={category.id}
                        whileHover={{ scale: 1.02 }}
                        className="relative group cursor-pointer"
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        <div className={`absolute -inset-1 bg-gradient-to-r ${category.color} rounded-lg blur-sm opacity-25 group-hover:opacity-40 transition-opacity`} />
                        <div className="relative p-6 bg-gray-900 rounded-lg border border-white/10">
                          <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-lg bg-gradient-to-r ${category.color} opacity-20`}>
                              <category.icon className="w-6 h-6 text-white" />
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                          </div>
                          <h4 className="text-lg font-semibold text-white mb-2">{category.title}</h4>
                          <ul className="space-y-1">
                            {category.articles.slice(0, 3).map((article, index) => (
                              <li key={index} className="text-sm text-gray-400 flex items-center gap-2">
                                <span className="w-1 h-1 bg-gray-600 rounded-full" />
                                {article}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* FAQ Tab */}
            {activeTab === 'faq' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Frequently Asked Questions</h3>
                  <div className="space-y-4">
                    {faqItems.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-6 bg-white/5 rounded-lg border border-white/10"
                      >
                        <h4 className="text-lg font-medium text-white mb-3 flex items-start gap-3">
                          <HelpCircle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                          {item.question}
                        </h4>
                        <p className="text-gray-400 ml-8">{item.answer}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-400 mb-1">Can't find what you're looking for?</p>
                      <p className="text-sm text-blue-300 opacity-80">
                        Try searching above or contact our support team for personalized help.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Contact Support Tab */}
            {activeTab === 'contact' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <h3 className="text-lg font-semibold text-white mb-4">Submit a Support Ticket</h3>
                    <form onSubmit={handleSubmitTicket} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                          placeholder="your@email.com"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Subject
                        </label>
                        <input
                          type="text"
                          value={contactForm.subject}
                          onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                          placeholder="Brief description of your issue"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Priority
                        </label>
                        <select
                          value={contactForm.priority}
                          onChange={(e) => setContactForm({ ...contactForm, priority: e.target.value })}
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
                        >
                          <option value="low">Low - General question</option>
                          <option value="normal">Normal - Some impact on work</option>
                          <option value="high">High - Significant impact</option>
                          <option value="urgent">Urgent - Critical issue</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Message
                        </label>
                        <textarea
                          value={contactForm.message}
                          onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                          placeholder="Please describe your issue in detail..."
                          rows={6}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Attachments (Optional)
                        </label>
                        <div className="relative">
                          <input
                            type="file"
                            multiple
                            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                            className="hidden"
                            id="file-upload"
                            accept="image/*,.pdf,.txt,.log"
                          />
                          <label
                            htmlFor="file-upload"
                            className="flex items-center justify-center gap-2 p-4 bg-white/5 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:bg-white/10 hover:border-purple-500 transition-all"
                          >
                            <Paperclip className="w-5 h-5 text-gray-400" />
                            <span className="text-sm text-gray-400">
                              Drop files here or click to upload (Max 10MB)
                            </span>
                          </label>
                        </div>
                        {attachments.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {attachments.map((file, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded">
                                <span className="text-sm text-gray-300 truncate">{file.name}</span>
                                <button
                                  type="button"
                                  onClick={() => removeAttachment(index)}
                                  className="text-red-400 hover:text-red-300"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <Button type="submit" className="w-full">
                        <Send className="w-4 h-4" />
                        Submit Ticket
                      </Button>
                    </form>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-purple-400" />
                        Response Times
                      </h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center justify-between">
                          <span className="text-gray-400">Low Priority</span>
                          <span className="text-white">48-72 hours</span>
                        </li>
                        <li className="flex items-center justify-between">
                          <span className="text-gray-400">Normal Priority</span>
                          <span className="text-white">24-48 hours</span>
                        </li>
                        <li className="flex items-center justify-between">
                          <span className="text-gray-400">High Priority</span>
                          <span className="text-white">4-8 hours</span>
                        </li>
                        <li className="flex items-center justify-between">
                          <span className="text-gray-400">Urgent Priority</span>
                          <span className="text-white">&lt; 2 hours</span>
                        </li>
                      </ul>
                    </div>

                    <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                      <h4 className="font-medium text-purple-400 mb-2 flex items-center gap-2">
                        <Star className="w-5 h-5" />
                        Pro Tip
                      </h4>
                      <p className="text-sm text-purple-300 opacity-80">
                        Include screenshots, error logs, and steps to reproduce the issue for faster resolution.
                      </p>
                    </div>

                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <h4 className="font-medium text-green-400 mb-2 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        System Status
                      </h4>
                      <p className="text-sm text-green-300 opacity-80">
                        All systems operational
                      </p>
                      <a href="#" className="text-sm text-green-400 hover:text-green-300 flex items-center gap-1 mt-2">
                        View status page
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}