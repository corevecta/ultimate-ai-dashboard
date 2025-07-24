'use client'

import { motion } from 'framer-motion'
import { Sparkles, Save, Play, Code, FileText } from 'lucide-react'
import { useState } from 'react'

export function PromptEditor() {
  const [prompt, setPrompt] = useState('')
  const [mode, setMode] = useState<'chat' | 'code'>('chat')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Prompt</h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white/5 rounded-lg p-1">
            <button
              onClick={() => setMode('chat')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                mode === 'chat' 
                  ? 'bg-white/10 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMode('code')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                mode === 'code' 
                  ? 'bg-white/10 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Code className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity" />
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={mode === 'chat' ? "Ask me anything..." : "// Write your code here..."}
            className="w-full h-64 p-6 rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-white/10 focus:border-white/20 text-white placeholder-gray-500 resize-none focus:outline-none transition-all"
            style={{ fontFamily: mode === 'code' ? 'monospace' : 'inherit' }}
          />
          
          {/* Character count */}
          <div className="absolute bottom-4 right-4 text-xs text-gray-500">
            {prompt.length} characters
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Enhance
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save
          </motion.button>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all flex items-center gap-2"
        >
          <Play className="w-4 h-4" />
          Generate
        </motion.button>
      </div>
    </motion.div>
  )
}