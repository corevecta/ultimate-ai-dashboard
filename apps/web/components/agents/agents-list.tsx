'use client'

import { motion } from 'framer-motion'
import { 
  Bot, 
  Brain, 
  Zap, 
  Settings,
  Play,
  Pause,
  CheckCircle2,
  AlertCircle,
  Activity,
  Code2,
  FileSearch,
  BarChart3,
  MessageSquare,
  Workflow
} from 'lucide-react'
import { useState } from 'react'
import { AgentConfigDialog } from './agent-config-dialog'

const agentTypes = {
  research: { icon: FileSearch, color: 'from-purple-500 to-pink-600' },
  code: { icon: Code2, color: 'from-blue-500 to-cyan-600' },
  data: { icon: BarChart3, color: 'from-green-500 to-emerald-600' },
  workflow: { icon: Workflow, color: 'from-orange-500 to-red-600' },
  support: { icon: MessageSquare, color: 'from-indigo-500 to-purple-600' }
}

const agents = [
  {
    id: 'research-alpha',
    name: 'Research Alpha',
    type: 'research',
    status: 'active',
    description: 'Advanced research and information gathering agent',
    model: 'GPT-4 Turbo',
    tasksCompleted: 342,
    successRate: 97.5,
    currentTask: 'Analyzing market trends for Q1 2024',
    memory: '2.1GB',
    capabilities: ['Web Search', 'Document Analysis', 'Report Generation', 'Fact Checking']
  },
  {
    id: 'codeassist-pro',
    name: 'CodeAssist Pro',
    type: 'code',
    status: 'active',
    description: 'Intelligent code generation and debugging assistant',
    model: 'Claude 3 Opus',
    tasksCompleted: 567,
    successRate: 98.2,
    currentTask: 'Refactoring authentication module',
    memory: '1.8GB',
    capabilities: ['Code Generation', 'Bug Detection', 'Refactoring', 'Documentation']
  },
  {
    id: 'data-insights',
    name: 'Data Insights',
    type: 'data',
    status: 'active',
    description: 'Data analysis and visualization specialist',
    model: 'GPT-4',
    tasksCompleted: 189,
    successRate: 96.8,
    currentTask: 'Processing sales data visualization',
    memory: '3.2GB',
    capabilities: ['Data Analysis', 'Visualization', 'Predictive Analytics', 'Report Generation']
  },
  {
    id: 'workflow-master',
    name: 'Workflow Master',
    type: 'workflow',
    status: 'paused',
    description: 'Business process automation expert',
    model: 'Claude 3 Sonnet',
    tasksCompleted: 123,
    successRate: 99.1,
    currentTask: 'Idle',
    memory: '1.2GB',
    capabilities: ['Process Automation', 'Task Scheduling', 'Integration', 'Monitoring']
  },
  {
    id: 'support-genius',
    name: 'Support Genius',
    type: 'support',
    status: 'active',
    description: 'Customer support and interaction specialist',
    model: 'GPT-3.5 Turbo',
    tasksCompleted: 892,
    successRate: 94.3,
    currentTask: 'Handling customer inquiries',
    memory: '0.8GB',
    capabilities: ['Chat Support', 'Ticket Management', 'FAQ Generation', 'Sentiment Analysis']
  }
]

export function AgentsList() {
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null)
  const [editingAgent, setEditingAgent] = useState<any>(null)
  const [configDialogOpen, setConfigDialogOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">AI Agents</h3>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">
            {agents.filter(a => a.status === 'active').length} active, {agents.filter(a => a.status === 'paused').length} paused
          </span>
        </div>
      </div>
      
      <div className="space-y-4">
        {agents.map((agent, index) => {
          const AgentIcon = agentTypes[agent.type as keyof typeof agentTypes].icon
          const gradientColor = agentTypes[agent.type as keyof typeof agentTypes].color
          
          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              {/* Glow effect */}
              <div
                className={`absolute -inset-1 bg-gradient-to-r ${gradientColor} rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity`}
              />
              
              {/* Card */}
              <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-white/20 transition-all overflow-hidden">
                {/* Main content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${gradientColor} opacity-20`}>
                        <AgentIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-white">{agent.name}</h4>
                        <p className="text-sm text-gray-400 mt-1">{agent.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className={`w-2 h-2 rounded-full ${
                            agent.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
                          }`} />
                          <span className="text-sm text-gray-400 capitalize">{agent.status}</span>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-400">{agent.model}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        {agent.status === 'active' ? (
                          <Pause className="w-5 h-5 text-gray-400" />
                        ) : (
                          <Play className="w-5 h-5 text-gray-400" />
                        )}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setEditingAgent(agent)
                          setConfigDialogOpen(true)
                        }}
                        className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        <Settings className="w-5 h-5 text-gray-400" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Current Task */}
                  {agent.status === 'active' && (
                    <div className="mb-4 p-3 rounded-lg bg-black/30 border border-white/5">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-green-400 animate-pulse" />
                        <span className="text-sm text-gray-300">{agent.currentTask}</span>
                      </div>
                    </div>
                  )}

                  {/* Capabilities */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {agent.capabilities.map((capability) => (
                      <span
                        key={capability}
                        className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300"
                      >
                        {capability}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Zap className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-400">Tasks</span>
                      </div>
                      <p className="text-lg font-semibold text-white">{agent.tasksCompleted}</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle2 className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-400">Success</span>
                      </div>
                      <p className="text-lg font-semibold text-white">{agent.successRate}%</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Brain className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-400">Memory</span>
                      </div>
                      <p className="text-lg font-semibold text-white">{agent.memory}</p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Activity className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-400">Health</span>
                      </div>
                      <p className="text-lg font-semibold text-white">100%</p>
                    </div>
                  </div>

                  {/* Expand button */}
                  <motion.button
                    onClick={() => setExpandedAgent(expandedAgent === agent.id ? null : agent.id)}
                    className="mt-4 w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-gray-300 hover:text-white transition-all"
                  >
                    {expandedAgent === agent.id ? 'Show Less' : 'Show More'}
                  </motion.button>
                </div>

                {/* Expanded content */}
                {expandedAgent === agent.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-white/10 p-6 bg-black/20"
                  >
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h5 className="text-sm font-medium text-gray-400 mb-3">Recent Tasks</h5>
                        <div className="space-y-2">
                          {[
                            { task: 'Generated weekly report', status: 'success' },
                            { task: 'Analyzed customer feedback', status: 'success' },
                            { task: 'Updated knowledge base', status: 'success' }
                          ].map((item, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                              <CheckCircle2 className="w-4 h-4 text-green-400" />
                              <span className="text-gray-300">{item.task}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-medium text-gray-400 mb-3">Resource Usage</h5>
                        <div className="space-y-3">
                          {[
                            { name: 'CPU Usage', value: 42 },
                            { name: 'Memory Usage', value: 68 },
                            { name: 'API Calls', value: 35 }
                          ].map((metric) => (
                            <div key={metric.name} className="space-y-1">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400">{metric.name}</span>
                                <span className="text-white">{metric.value}%</span>
                              </div>
                              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                <motion.div
                                  className={`h-full bg-gradient-to-r ${gradientColor}`}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${metric.value}%` }}
                                  transition={{ duration: 0.5 }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Configuration Dialog */}
      <AgentConfigDialog 
        isOpen={configDialogOpen}
        onClose={() => {
          setConfigDialogOpen(false)
          setEditingAgent(null)
        }}
        agent={editingAgent}
      />
    </div>
  )
}