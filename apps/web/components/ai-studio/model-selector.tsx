'use client'

import { motion } from 'framer-motion'
import { Bot, Zap, Gauge, DollarSign, ChevronDown } from 'lucide-react'
import { useState } from 'react'

const models = [
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
    speed: 'Fast',
    cost: '$0.01/1K',
    capabilities: ['128K context', 'Vision', 'Function calling'],
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    speed: 'Medium',
    cost: '$0.015/1K',
    capabilities: ['200K context', 'Advanced reasoning'],
    color: 'from-purple-500 to-pink-600'
  },
  {
    id: 'gemini-ultra',
    name: 'Gemini Ultra',
    provider: 'Google',
    speed: 'Fast',
    cost: '$0.008/1K',
    capabilities: ['Multi-modal', 'Code generation'],
    color: 'from-blue-500 to-cyan-600'
  }
]

export function ModelSelector() {
  const [selectedModel, setSelectedModel] = useState(models[0])
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <h3 className="text-lg font-semibold text-white mb-4">Select Model</h3>
      
      {/* Current selection */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${selectedModel.color}`}>
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h4 className="text-xl font-semibold text-white">{selectedModel.name}</h4>
              <p className="text-sm text-gray-400">{selectedModel.provider}</p>
            </div>
          </div>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-gray-300">{selectedModel.speed}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-500" />
            <span className="text-sm text-gray-300">{selectedModel.cost}</span>
          </div>
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-300">{selectedModel.capabilities[0]}</span>
          </div>
        </div>
      </motion.button>

      {/* Dropdown */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 mt-2 p-2 rounded-2xl bg-gray-900/95 backdrop-blur-xl border border-white/10 shadow-2xl z-50"
        >
          {models.map((model) => (
            <motion.button
              key={model.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSelectedModel(model)
                setIsOpen(false)
              }}
              className={`w-full p-4 rounded-xl hover:bg-white/5 transition-all ${
                selectedModel.id === model.id ? 'bg-white/10' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${model.color} opacity-80`}>
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <h5 className="font-medium text-white">{model.name}</h5>
                    <p className="text-xs text-gray-400">{model.provider}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-300">{model.cost}</p>
                  <p className="text-xs text-gray-500">{model.speed}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}