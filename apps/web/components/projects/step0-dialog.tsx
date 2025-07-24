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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import {
  Globe,
  Smartphone,
  Chrome,
  Puzzle,
  Terminal,
  Package,
  Server,
  Cloud,
  Bot,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Brain,
  Cpu,
  Code,
  Zap,
  TrendingUp,
  Users,
  Target,
  DollarSign,
  Info,
  AlertCircle,
  Loader2,
  Check,
  X
} from 'lucide-react'

interface Step0DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: ProjectFormData) => void
}

interface ProjectFormData {
  name: string
  type: string
  description: string
  industry?: string
  targetAudience?: string
  competitors?: string
  budget?: string
  timeline?: string
  additionalContext?: string
  features?: string[]
  techPreferences?: string[]
  aiAnalysis?: {
    marketFit?: number
    feasibility?: number
    innovation?: number
    recommendations?: string[]
  }
}

const projectTypes = [
  // Web Applications
  { id: 'web-app', name: 'Web App', icon: Globe, description: 'Full-stack web application', category: 'Web' },
  { id: 'static-site', name: 'Static Site', icon: Globe, description: 'Static website/landing page', category: 'Web' },
  { id: 'pwa-app', name: 'Progressive Web App', icon: Smartphone, description: 'Offline-capable web app', category: 'Web' },
  
  // Browser Extensions
  { id: 'chrome-extension', name: 'Chrome Extension', icon: Chrome, description: 'Chrome browser extension', category: 'Extensions' },
  { id: 'firefox-extension', name: 'Firefox Extension', icon: Chrome, description: 'Firefox browser addon', category: 'Extensions' },
  { id: 'safari-extension', name: 'Safari Extension', icon: Chrome, description: 'Safari browser extension', category: 'Extensions' },
  { id: 'edge-extension', name: 'Edge Extension', icon: Chrome, description: 'Microsoft Edge extension', category: 'Extensions' },
  { id: 'browser-extension', name: 'Browser Extension', icon: Chrome, description: 'Cross-browser extension', category: 'Extensions' },
  
  // Desktop Applications
  { id: 'electron-app', name: 'Electron App', icon: Cpu, description: 'Cross-platform desktop app', category: 'Desktop' },
  { id: 'desktop-app', name: 'Native Desktop App', icon: Package, description: 'OS-specific desktop app', category: 'Desktop' },
  { id: 'tauri-app', name: 'Tauri App', icon: Cpu, description: 'Rust-based desktop app', category: 'Desktop' },
  
  // Mobile Applications
  { id: 'mobile-app', name: 'Mobile App', icon: Smartphone, description: 'iOS/Android native app', category: 'Mobile' },
  { id: 'react-native-app', name: 'React Native App', icon: Smartphone, description: 'Cross-platform mobile app', category: 'Mobile' },
  { id: 'flutter-app', name: 'Flutter App', icon: Smartphone, description: 'Dart-based mobile app', category: 'Mobile' },
  { id: 'expo-app', name: 'Expo App', icon: Smartphone, description: 'Expo-powered mobile app', category: 'Mobile' },
  
  // Developer Tools
  { id: 'vscode-extension', name: 'VS Code Extension', icon: Code, description: 'Visual Studio Code extension', category: 'Dev Tools' },
  { id: 'intellij-plugin', name: 'IntelliJ Plugin', icon: Code, description: 'JetBrains IDE plugin', category: 'Dev Tools' },
  { id: 'vim-plugin', name: 'Vim Plugin', icon: Terminal, description: 'Vim editor plugin', category: 'Dev Tools' },
  { id: 'sublime-package', name: 'Sublime Package', icon: Code, description: 'Sublime Text package', category: 'Dev Tools' },
  { id: 'cursor-extension', name: 'Cursor Extension', icon: Code, description: 'Cursor AI IDE extension', category: 'Dev Tools' },
  
  // API & Backend Services
  { id: 'api-service', name: 'API Service', icon: Server, description: 'RESTful/GraphQL API', category: 'Backend' },
  { id: 'microservice', name: 'Microservice', icon: Server, description: 'Containerized service', category: 'Backend' },
  { id: 'serverless-function', name: 'Serverless Function', icon: Cloud, description: 'Cloud function/Lambda', category: 'Backend' },
  { id: 'webhook-service', name: 'Webhook Service', icon: Server, description: 'Event-driven service', category: 'Backend' },
  
  // CLI & Automation
  { id: 'cli-tool', name: 'CLI Tool', icon: Terminal, description: 'Command line interface', category: 'CLI' },
  { id: 'npm-package', name: 'NPM Package', icon: Package, description: 'JavaScript/TypeScript library', category: 'CLI' },
  { id: 'github-action', name: 'GitHub Action', icon: Terminal, description: 'CI/CD automation', category: 'CLI' },
  { id: 'shell-script', name: 'Shell Script', icon: Terminal, description: 'Bash/Zsh automation', category: 'CLI' },
  
  // Integrations & Plugins
  { id: 'notion-integration', name: 'Notion Integration', icon: Puzzle, description: 'Notion workspace app', category: 'Integrations' },
  { id: 'obsidian-plugin', name: 'Obsidian Plugin', icon: Puzzle, description: 'Note-taking plugin', category: 'Integrations' },
  { id: 'figma-plugin', name: 'Figma Plugin', icon: Puzzle, description: 'Design tool plugin', category: 'Integrations' },
  { id: 'wordpress-plugin', name: 'WordPress Plugin', icon: Puzzle, description: 'CMS plugin', category: 'Integrations' },
  { id: 'shopify-app', name: 'Shopify App', icon: ShoppingBag, description: 'E-commerce app', category: 'Integrations' },
  
  // Chat & Messaging
  { id: 'discord-bot', name: 'Discord Bot', icon: Bot, description: 'Discord chat bot', category: 'Chat' },
  { id: 'slack-app', name: 'Slack App', icon: Bot, description: 'Slack workspace app', category: 'Chat' },
  { id: 'telegram-bot', name: 'Telegram Bot', icon: Bot, description: 'Telegram messenger bot', category: 'Chat' },
  { id: 'teams-app', name: 'Teams App', icon: Bot, description: 'Microsoft Teams app', category: 'Chat' },
  
  // AI & ML
  { id: 'ai-agent', name: 'AI Agent', icon: Brain, description: 'Autonomous AI assistant', category: 'AI' },
  { id: 'gpt-plugin', name: 'GPT Plugin', icon: Brain, description: 'OpenAI ChatGPT plugin', category: 'AI' },
  { id: 'claude-plugin', name: 'Claude Plugin', icon: Brain, description: 'Anthropic Claude plugin', category: 'AI' },
  { id: 'ml-model', name: 'ML Model', icon: Brain, description: 'Machine learning model', category: 'AI' },
  
  // Specialized
  { id: 'game', name: 'Game', icon: Zap, description: 'Browser or desktop game', category: 'Specialized' },
  { id: 'jupyter-notebook', name: 'Jupyter Notebook', icon: Code, description: 'Data science notebook', category: 'Specialized' },
  { id: 'tradingview-script', name: 'TradingView Script', icon: TrendingUp, description: 'Pine Script indicator', category: 'Specialized' },
  { id: 'metamask-snap', name: 'MetaMask Snap', icon: Puzzle, description: 'Web3 wallet plugin', category: 'Specialized' },
  { id: 'zapier-app', name: 'Zapier App', icon: Zap, description: 'Automation integration', category: 'Specialized' },
  { id: 'airtable-extension', name: 'Airtable Extension', icon: Puzzle, description: 'Database extension', category: 'Specialized' },
  { id: 'health-tool', name: 'Health Tool', icon: Target, description: 'Healthcare application', category: 'Specialized' },
  { id: 'education-tool', name: 'Education Tool', icon: Users, description: 'Learning platform', category: 'Specialized' },
  { id: 'tiktok-effect', name: 'TikTok Effect', icon: Sparkles, description: 'AR filter for TikTok', category: 'Specialized' },
  { id: 'instagram-filter', name: 'Instagram Filter', icon: Sparkles, description: 'AR filter for Instagram', category: 'Specialized' },
  { id: 'youtube-plugin', name: 'YouTube Plugin', icon: Puzzle, description: 'YouTube Studio extension', category: 'Specialized' },
  { id: 'salesforce-app', name: 'Salesforce App', icon: Cloud, description: 'Lightning Web Component', category: 'Specialized' },
  { id: 'atlassian-app', name: 'Atlassian App', icon: Puzzle, description: 'Jira/Confluence app', category: 'Specialized' },
  { id: 'emacs-package', name: 'Emacs Package', icon: Code, description: 'Emacs editor package', category: 'Specialized' },
  { id: 'observable-notebook', name: 'Observable', icon: Code, description: 'Interactive data notebook', category: 'Specialized' },
  { id: 'replit-app', name: 'Replit App', icon: Code, description: 'Collaborative coding app', category: 'Specialized' },
  { id: 'glitch-app', name: 'Glitch App', icon: Code, description: 'Web remix platform', category: 'Specialized' },
  { id: 'codepen-demo', name: 'CodePen Demo', icon: Code, description: 'Frontend playground', category: 'Specialized' },
  { id: 'arduino-project', name: 'Arduino Project', icon: Cpu, description: 'IoT/embedded system', category: 'Specialized' },
  { id: 'steam-app', name: 'Steam App', icon: Zap, description: 'Steam platform game', category: 'Specialized' },
  { id: 'smart-contract', name: 'Smart Contract', icon: Puzzle, description: 'Blockchain contract', category: 'Specialized' },
  { id: 'ipfs-app', name: 'IPFS App', icon: Globe, description: 'Decentralized web app', category: 'Specialized' },
  { id: 'woocommerce-plugin', name: 'WooCommerce Plugin', icon: ShoppingBag, description: 'E-commerce plugin', category: 'Specialized' }
]

const industries = [
  'Technology', 'Healthcare', 'Finance', 'Education', 'E-commerce',
  'Entertainment', 'Real Estate', 'Transportation', 'Agriculture',
  'Manufacturing', 'Retail', 'Hospitality', 'Energy', 'Other'
]

const budgetRanges = [
  { id: 'mvp', label: 'MVP ($5k-$15k)', value: '5000-15000' },
  { id: 'small', label: 'Small ($15k-$50k)', value: '15000-50000' },
  { id: 'medium', label: 'Medium ($50k-$150k)', value: '50000-150000' },
  { id: 'large', label: 'Large ($150k+)', value: '150000+' }
]

const timelines = [
  { id: '1month', label: '1 Month', value: '1' },
  { id: '3months', label: '3 Months', value: '3' },
  { id: '6months', label: '6 Months', value: '6' },
  { id: 'flexible', label: 'Flexible', value: 'flexible' }
]

export function Step0Dialog({ open, onOpenChange, onSubmit }: Step0DialogProps) {
  const [step, setStep] = useState(1)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    type: '',
    description: '',
    industry: '',
    targetAudience: '',
    competitors: '',
    budget: '',
    timeline: '',
    additionalContext: '',
    features: [],
    techPreferences: []
  })

  const totalSteps = 5

  const updateFormData = (data: Partial<ProjectFormData>) => {
    setFormData(prev => ({ ...prev, ...data }))
  }

  const handleNext = async () => {
    if (step === 1) {
      // Trigger AI analysis after basic info
      setIsAnalyzing(true)
      await performAIAnalysis()
      setIsAnalyzing(false)
    }
    
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      onSubmit(formData)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const performAIAnalysis = async () => {
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Mock AI analysis results
    updateFormData({
      aiAnalysis: {
        marketFit: 85,
        feasibility: 92,
        innovation: 78,
        recommendations: [
          'Consider implementing real-time collaboration features',
          'Focus on mobile-first design for better user engagement',
          'Integrate AI-powered analytics from the start',
          'Plan for scalability with microservices architecture'
        ]
      }
    })
  }

  const handleEnhanceDescription = async () => {
    if (!formData.description || !formData.type) return
    
    setIsEnhancing(true)
    try {
      const response = await fetch('/api/ai/enhance-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: formData.description,
          projectType: formData.type,
          industry: formData.industry
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        updateFormData({ description: data.enhanced })
        
        // Show enhancement feedback (you could add a toast notification here)
        console.log('Enhancement complete:', data.improvements)
      } else {
        console.error('Failed to enhance description')
      }
    } catch (error) {
      console.error('Error enhancing description:', error)
    } finally {
      setIsEnhancing(false)
    }
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.name && formData.type && formData.description
      case 2:
        return formData.industry && formData.targetAudience
      case 3:
        return formData.budget && formData.timeline
      default:
        return true
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-gray-900 border-white/10">
        <DialogHeader className="pb-0">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Create AI-Powered Project
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Let AI transform your idea into a production-ready application
          </DialogDescription>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="py-4">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={cn(
                  "flex items-center",
                  i < 5 && "flex-1"
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all",
                    i < step
                      ? "bg-green-500 text-white"
                      : i === step
                      ? "bg-blue-500 text-white"
                      : "bg-gray-700 text-gray-400"
                  )}
                >
                  {i < step ? <Check className="w-5 h-5" /> : i}
                </div>
                {i < 5 && (
                  <div
                    className={cn(
                      "h-1 flex-1 mx-2 transition-all",
                      i < step ? "bg-green-500" : "bg-gray-700"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>Basic Info</span>
            <span>Context</span>
            <span>Planning</span>
            <span>Features</span>
            <span>Review</span>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto py-6" style={{ maxHeight: 'calc(90vh - 300px)' }}>
          <AnimatePresence mode="wait">
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <Label htmlFor="project-name">Project Name</Label>
                  <Input
                    id="project-name"
                    value={formData.name}
                    onChange={(e) => updateFormData({ name: e.target.value })}
                    placeholder="Enter your project name"
                    className="mt-2 bg-gray-800 border-gray-700"
                  />
                  <p className="text-xs text-gray-400 mt-1">Choose a memorable name for your project</p>
                </div>

                <div>
                  <Label>Project Type</Label>
                  <Tabs defaultValue="Web" className="mt-2">
                    <TabsList className="grid grid-cols-5 lg:grid-cols-10 gap-1 h-auto p-1 bg-gray-800">
                      {Array.from(new Set(projectTypes.map(t => t.category))).map((category) => (
                        <TabsTrigger
                          key={category}
                          value={category}
                          className="text-xs px-2 py-1 data-[state=active]:bg-blue-600"
                        >
                          {category}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {Array.from(new Set(projectTypes.map(t => t.category))).map((category) => (
                      <TabsContent key={category} value={category} className="mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {projectTypes
                            .filter(type => type.category === category)
                            .map((type) => {
                              const Icon = type.icon
                              return (
                                <button
                                  key={type.id}
                                  onClick={() => updateFormData({ type: type.id })}
                                  className={cn(
                                    "p-4 rounded-lg border-2 transition-all text-left",
                                    formData.type === type.id
                                      ? "border-blue-500 bg-blue-500/10"
                                      : "border-gray-700 hover:border-gray-600"
                                  )}
                                >
                                  <Icon className="w-6 h-6 mb-2 text-blue-400" />
                                  <div className="font-medium text-sm">{type.name}</div>
                                  <div className="text-xs text-gray-400 mt-1">{type.description}</div>
                                </button>
                              )
                            })}
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>

                <div>
                  <Label htmlFor="description">Project Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => updateFormData({ description: e.target.value })}
                    placeholder="Describe your project idea in detail. What problem does it solve?"
                    className="mt-2 bg-gray-800 border-gray-700 min-h-[120px]"
                  />
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-400">{formData.description.length} / 1000 characters</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                      disabled={!formData.description || !formData.type || isEnhancing}
                      onClick={handleEnhanceDescription}
                    >
                      {isEnhancing ? (
                        <>
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                          Enhancing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3 mr-1" />
                          AI Enhance
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Business Context */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {isAnalyzing ? (
                  <div className="text-center py-12">
                    <Brain className="w-16 h-16 mx-auto mb-4 text-blue-400 animate-pulse" />
                    <h3 className="text-lg font-semibold mb-2">AI is analyzing your project...</h3>
                    <p className="text-gray-400 mb-4">Evaluating market fit, technical requirements, and potential challenges</p>
                    <Progress value={66} className="w-64 mx-auto" />
                  </div>
                ) : (
                  <>
                    {formData.aiAnalysis && (
                      <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-4 mb-6">
                        <h4 className="font-semibold mb-3 flex items-center">
                          <Brain className="w-5 h-5 mr-2 text-blue-400" />
                          AI Analysis Results
                        </h4>
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div>
                            <div className="text-sm text-gray-400">Market Fit</div>
                            <div className="text-2xl font-bold text-green-400">{formData.aiAnalysis.marketFit}%</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-400">Feasibility</div>
                            <div className="text-2xl font-bold text-blue-400">{formData.aiAnalysis.feasibility}%</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-400">Innovation</div>
                            <div className="text-2xl font-bold text-purple-400">{formData.aiAnalysis.innovation}%</div>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400 mb-2">Key Recommendations:</div>
                          <ul className="space-y-1">
                            {formData.aiAnalysis.recommendations?.map((rec, i) => (
                              <li key={i} className="text-sm flex items-start">
                                <CheckCircle className="w-4 h-4 mr-2 text-green-400 flex-shrink-0 mt-0.5" />
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    <div>
                      <Label htmlFor="industry">Industry</Label>
                      <select
                        id="industry"
                        value={formData.industry}
                        onChange={(e) => updateFormData({ industry: e.target.value })}
                        className="w-full mt-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md"
                      >
                        <option value="">Select an industry</option>
                        {industries.map(industry => (
                          <option key={industry} value={industry}>{industry}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="target-audience">Target Audience</Label>
                      <Textarea
                        id="target-audience"
                        value={formData.targetAudience}
                        onChange={(e) => updateFormData({ targetAudience: e.target.value })}
                        placeholder="Describe your target users and their needs"
                        className="mt-2 bg-gray-800 border-gray-700"
                      />
                    </div>

                    <div>
                      <Label htmlFor="competitors">Competitors (Optional)</Label>
                      <Input
                        id="competitors"
                        value={formData.competitors}
                        onChange={(e) => updateFormData({ competitors: e.target.value })}
                        placeholder="List any known competitors"
                        className="mt-2 bg-gray-800 border-gray-700"
                      />
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* Step 3: Budget & Timeline */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <Label>Budget Range</Label>
                  <RadioGroup
                    value={formData.budget}
                    onValueChange={(value) => updateFormData({ budget: value })}
                    className="mt-2"
                  >
                    {budgetRanges.map((range) => (
                      <div key={range.id} className="flex items-center space-x-2 mb-3">
                        <RadioGroupItem value={range.value} id={range.id} />
                        <Label
                          htmlFor={range.id}
                          className="font-normal cursor-pointer flex-1 p-3 rounded-lg border border-gray-700 hover:border-gray-600"
                        >
                          <div className="flex items-center justify-between">
                            <span>{range.label}</span>
                            <DollarSign className="w-4 h-4 text-gray-400" />
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label>Timeline</Label>
                  <RadioGroup
                    value={formData.timeline}
                    onValueChange={(value) => updateFormData({ timeline: value })}
                    className="mt-2"
                  >
                    {timelines.map((timeline) => (
                      <div key={timeline.id} className="flex items-center space-x-2 mb-3">
                        <RadioGroupItem value={timeline.value} id={timeline.id} />
                        <Label
                          htmlFor={timeline.id}
                          className="font-normal cursor-pointer flex-1 p-3 rounded-lg border border-gray-700 hover:border-gray-600"
                        >
                          {timeline.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="additional-context">Additional Context (Optional)</Label>
                  <Textarea
                    id="additional-context"
                    value={formData.additionalContext}
                    onChange={(e) => updateFormData({ additionalContext: e.target.value })}
                    placeholder="Any specific requirements, constraints, or preferences?"
                    className="mt-2 bg-gray-800 border-gray-700"
                  />
                </div>
              </motion.div>
            )}

            {/* Step 4: AI-Recommended Features */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="font-semibold mb-4">AI-Recommended Features</h3>
                  <div className="space-y-3">
                    {/* Mock feature recommendations */}
                    {[
                      { name: 'User Authentication', description: 'Secure login and registration system', essential: true },
                      { name: 'Real-time Updates', description: 'Live data synchronization across users', essential: true },
                      { name: 'Analytics Dashboard', description: 'Comprehensive data visualization', essential: false },
                      { name: 'Payment Integration', description: 'Stripe/PayPal payment processing', essential: false },
                      { name: 'AI-Powered Search', description: 'Smart search with natural language', essential: false },
                      { name: 'Mobile App', description: 'Native iOS and Android apps', essential: false }
                    ].map((feature) => (
                      <label
                        key={feature.name}
                        className="flex items-start space-x-3 p-4 rounded-lg border border-gray-700 hover:border-gray-600 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.features?.includes(feature.name) || false}
                          onChange={(e) => {
                            if (e.target.checked) {
                              updateFormData({ features: [...(formData.features || []), feature.name] })
                            } else {
                              updateFormData({ features: formData.features?.filter(f => f !== feature.name) })
                            }
                          }}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{feature.name}</span>
                            {feature.essential && (
                              <Badge variant="secondary" className="text-xs">Essential</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-400 mt-1">{feature.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Technology Preferences</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      'React/Next.js', 'Vue.js', 'Angular', 'Node.js',
                      'Python/Django', 'Ruby on Rails', 'PostgreSQL', 'MongoDB'
                    ].map((tech) => (
                      <label
                        key={tech}
                        className="flex items-center space-x-2 p-3 rounded-lg border border-gray-700 hover:border-gray-600 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.techPreferences?.includes(tech) || false}
                          onChange={(e) => {
                            if (e.target.checked) {
                              updateFormData({ techPreferences: [...(formData.techPreferences || []), tech] })
                            } else {
                              updateFormData({ techPreferences: formData.techPreferences?.filter(t => t !== tech) })
                            }
                          }}
                        />
                        <span>{tech}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 5: Review & Launch */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <Zap className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
                  <h3 className="text-xl font-semibold mb-2">Ready to Launch AI Pipeline!</h3>
                  <p className="text-gray-400">Review your project configuration before starting the 8-step AI pipeline</p>
                </div>

                <div className="bg-gray-800 rounded-lg p-6 space-y-4">
                  <div>
                    <div className="text-sm text-gray-400">Project Name</div>
                    <div className="font-semibold">{formData.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Type</div>
                    <div className="font-semibold">
                      {projectTypes.find(t => t.id === formData.type)?.name}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Description</div>
                    <div className="text-sm">{formData.description}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Industry</div>
                    <div className="font-semibold">{formData.industry}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Budget</div>
                    <div className="font-semibold">
                      {budgetRanges.find(b => b.value === formData.budget)?.label}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Timeline</div>
                    <div className="font-semibold">
                      {timelines.find(t => t.value === formData.timeline)?.label}
                    </div>
                  </div>
                  {formData.features && formData.features.length > 0 && (
                    <div>
                      <div className="text-sm text-gray-400 mb-2">Selected Features</div>
                      <div className="flex flex-wrap gap-2">
                        {formData.features.map((feature) => (
                          <Badge key={feature} variant="secondary">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-4">
                  <div className="flex items-start">
                    <Info className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium mb-2">What happens after you click "Create Project"?</p>
                      <div className="space-y-3">
                        <div className="pl-4 border-l-2 border-gray-500/30">
                          <p className="font-medium text-gray-400">Step 0: Requirements File (Now)</p>
                          <ul className="space-y-1 text-gray-400 text-xs mt-1">
                            <li>• Creates requirements.md with your inputs</li>
                            <li>• Prepares project for AI pipeline</li>
                          </ul>
                        </div>
                        <div className="pl-4 border-l-2 border-blue-500/30">
                          <p className="font-medium text-blue-400">Step 1-3: Analysis & Planning (30 mins)</p>
                          <ul className="space-y-1 text-gray-400 text-xs mt-1">
                            <li>• AI generates 10+ project variations from requirements</li>
                            <li>• Converts requirements.md to specification.yaml</li>
                            <li>• Market analysis & competitive research</li>
                            <li>• Technical specification generation</li>
                          </ul>
                        </div>
                        <div className="pl-4 border-l-2 border-purple-500/30">
                          <p className="font-medium text-purple-400">Step 4-6: Development (2-3 hours)</p>
                          <ul className="space-y-1 text-gray-400 text-xs mt-1">
                            <li>• Complete codebase generation</li>
                            <li>• Automated testing suite</li>
                            <li>• Code quality & security checks</li>
                          </ul>
                        </div>
                        <div className="pl-4 border-l-2 border-green-500/30">
                          <p className="font-medium text-green-400">Step 7-8: Deployment (30 mins)</p>
                          <ul className="space-y-1 text-gray-400 text-xs mt-1">
                            <li>• Documentation generation</li>
                            <li>• Automated deployment to cloud</li>
                            <li>• Live URL with your application</li>
                          </ul>
                        </div>
                      </div>
                      <p className="text-yellow-400 text-xs mt-3 font-medium">
                        ⏱️ Total time: 2-4 hours for a production-ready application
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <DialogFooter className="border-t border-gray-800 pt-4">
          <div className="flex justify-between w-full">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
              className="border-gray-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className={cn(
                step === totalSteps && "bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              )}
            >
              {step === totalSteps ? (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Create Project
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}