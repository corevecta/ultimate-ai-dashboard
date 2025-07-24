'use client'

import { motion } from 'framer-motion'
import { Copy, Download, Maximize2, RefreshCw } from 'lucide-react'
import { useState } from 'react'

export function OutputViewer() {
  const [isStreaming, setIsStreaming] = useState(true)
  const sampleOutput = `Here's a comprehensive analysis of your request:

## Key Insights
1. **Performance Optimization**: The current implementation shows significant room for improvement in terms of execution speed and resource utilization.

2. **Architecture Patterns**: Consider implementing a microservices architecture with proper service boundaries and API gateways.

3. **Scalability Concerns**: The system should be designed to handle 10x current load with horizontal scaling capabilities.

## Recommended Approach
\`\`\`javascript
// Example implementation
class OptimizedService {
  constructor() {
    this.cache = new Map();
    this.rateLimiter = new RateLimiter();
  }
  
  async process(data) {
    // Check cache first
    if (this.cache.has(data.id)) {
      return this.cache.get(data.id);
    }
    
    // Process with rate limiting
    await this.rateLimiter.acquire();
    const result = await this.performOperation(data);
    
    // Cache result
    this.cache.set(data.id, result);
    return result;
  }
}
\`\`\`

## Next Steps
- Implement caching layer with Redis
- Add comprehensive monitoring
- Set up automated testing pipeline`

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Output</h3>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <Copy className="w-4 h-4 text-gray-400" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <Download className="w-4 h-4 text-gray-400" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <Maximize2 className="w-4 h-4 text-gray-400" />
          </motion.button>
        </div>
      </div>

      {/* Output container */}
      <div className="relative group h-[calc(100%-3rem)]">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity" />
        <div className="relative h-full rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-white/10 overflow-hidden">
          {/* Streaming indicator */}
          {isStreaming && (
            <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/30">
              <RefreshCw className="w-3 h-3 text-indigo-400 animate-spin" />
              <span className="text-xs text-indigo-400">Generating...</span>
            </div>
          )}

          {/* Content */}
          <div className="h-full overflow-y-auto p-6">
            <div className="prose prose-invert max-w-none">
              {sampleOutput.split('\n').map((line, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                >
                  {line.startsWith('##') ? (
                    <h2 className="text-xl font-bold text-white mt-6 mb-3">{line.replace('## ', '')}</h2>
                  ) : line.startsWith('```') ? (
                    <pre className="bg-black/50 rounded-lg p-4 my-4 overflow-x-auto">
                      <code className="text-sm text-gray-300">{line.replace('```javascript', '').replace('```', '')}</code>
                    </pre>
                  ) : line.startsWith('-') ? (
                    <li className="text-gray-300 ml-4">{line.replace('- ', '')}</li>
                  ) : line.trim() !== '' ? (
                    <p className="text-gray-300 leading-relaxed">{line}</p>
                  ) : null}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}