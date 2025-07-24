'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Book,
  ChevronRight,
  ChevronLeft,
  Search,
  Copy,
  Check,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Printer,
  Moon,
  Sun,
  ZoomIn,
  ZoomOut,
  Menu,
  Hash,
  Clock,
  User,
  Edit,
  MessageSquare
} from 'lucide-react'
import { Button } from '@ultimate-ai/shared-ui'

interface DocViewerProps {
  isOpen: boolean
  onClose: () => void
  doc?: {
    id: string
    title: string
    category: string
    content?: string
    author?: string
    lastUpdated?: string
    readTime?: string
    views?: number
    likes?: number
  }
}

export function DocViewer({ isOpen, onClose, doc }: DocViewerProps) {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [fontSize, setFontSize] = useState(16)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [showToc, setShowToc] = useState(true)
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null)

  // Mock table of contents
  const tableOfContents = [
    { id: 'introduction', title: 'Introduction', level: 1 },
    { id: 'getting-started', title: 'Getting Started', level: 1 },
    { id: 'prerequisites', title: 'Prerequisites', level: 2 },
    { id: 'installation', title: 'Installation', level: 2 },
    { id: 'configuration', title: 'Configuration', level: 1 },
    { id: 'basic-config', title: 'Basic Configuration', level: 2 },
    { id: 'advanced-config', title: 'Advanced Configuration', level: 2 },
    { id: 'api-reference', title: 'API Reference', level: 1 },
    { id: 'examples', title: 'Examples', level: 1 },
    { id: 'troubleshooting', title: 'Troubleshooting', level: 1 }
  ]

  // Mock related docs
  const relatedDocs = [
    { title: 'Quick Start Guide', category: 'Getting Started' },
    { title: 'API Authentication', category: 'API Reference' },
    { title: 'Best Practices', category: 'Guides' }
  ]

  const handleCopyCode = async (code: string) => {
    await navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: doc?.title,
        text: `Check out this documentation: ${doc?.title}`,
        url: window.location.href
      })
    }
  }

  if (!isOpen || !doc) return null

  // Mock content with various elements
  const mockContent = `
# ${doc.title}

## Introduction

Welcome to the comprehensive guide for ${doc.title}. This documentation will help you understand and implement all the features effectively.

## Getting Started

To begin using this feature, you'll need to understand the basic concepts and requirements.

### Prerequisites

Before you start, make sure you have:
- Node.js v16 or higher
- npm or yarn package manager
- Basic understanding of JavaScript/TypeScript

### Installation

\`\`\`bash
npm install @ultimate-ai/core
# or
yarn add @ultimate-ai/core
\`\`\`

## Configuration

### Basic Configuration

Here's a simple configuration example:

\`\`\`javascript
const config = {
  apiKey: 'your-api-key',
  endpoint: 'https://api.example.com',
  timeout: 5000,
  retries: 3
};
\`\`\`

### Advanced Configuration

For more complex setups, you can use advanced configuration options:

\`\`\`typescript
interface AdvancedConfig {
  apiKey: string;
  endpoint: string;
  timeout?: number;
  retries?: number;
  middleware?: Middleware[];
  errorHandler?: (error: Error) => void;
}

const advancedConfig: AdvancedConfig = {
  apiKey: process.env.API_KEY,
  endpoint: process.env.API_ENDPOINT,
  timeout: 10000,
  retries: 5,
  middleware: [authMiddleware, loggingMiddleware],
  errorHandler: (error) => {
    console.error('API Error:', error);
    // Custom error handling logic
  }
};
\`\`\`

## API Reference

### Core Methods

#### initialize(config)
Initializes the service with the provided configuration.

**Parameters:**
- \`config\` (Object): Configuration object

**Returns:**
- \`Promise<void>\`: Resolves when initialization is complete

#### process(data)
Processes the input data according to the configured rules.

**Parameters:**
- \`data\` (Any): Input data to process

**Returns:**
- \`Promise<Result>\`: Processing result

## Examples

### Example 1: Basic Usage

\`\`\`javascript
import { Client } from '@ultimate-ai/core';

const client = new Client({
  apiKey: 'your-api-key'
});

async function main() {
  try {
    const result = await client.process({
      input: 'Hello, World!',
      options: { format: 'json' }
    });
    console.log(result);
  } catch (error) {
    console.error('Error:', error);
  }
}
\`\`\`

### Example 2: Advanced Implementation

\`\`\`typescript
import { Client, Middleware } from '@ultimate-ai/core';

// Custom middleware
const customMiddleware: Middleware = async (req, next) => {
  console.log('Request:', req);
  const response = await next(req);
  console.log('Response:', response);
  return response;
};

const client = new Client({
  apiKey: 'your-api-key',
  middleware: [customMiddleware]
});

// Batch processing
async function batchProcess(items: string[]) {
  const results = await Promise.all(
    items.map(item => client.process({ input: item }))
  );
  return results;
}
\`\`\`

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Verify your API key is correct
   - Check if the key has the necessary permissions

2. **Timeout Errors**
   - Increase the timeout value in configuration
   - Check your network connection

3. **Rate Limiting**
   - Implement exponential backoff
   - Use batch processing for multiple requests

### Getting Help

If you encounter issues not covered here, you can:
- Check our [GitHub Issues](https://github.com/example/repo/issues)
- Join our [Discord Community](https://discord.gg/example)
- Contact support at support@example.com
  `

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className={`relative w-full max-w-6xl ml-auto h-full ${
            isDarkMode ? 'bg-gray-900' : 'bg-white'
          } shadow-2xl`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`sticky top-0 z-10 border-b ${
            isDarkMode ? 'bg-gray-900/95 border-white/10' : 'bg-white/95 border-gray-200'
          } backdrop-blur-sm`}>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={onClose}
                  className={`p-2 rounded-lg hover:bg-white/10 ${
                    isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  } transition-colors`}
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2 text-sm">
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{doc.category}</span>
                  <ChevronRight className="w-4 h-4" />
                  <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>{doc.title}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowToc(!showToc)}
                  className={`p-2 rounded-lg hover:bg-white/10 ${
                    isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  } transition-colors lg:hidden`}
                >
                  <Menu className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                  className={`p-2 rounded-lg hover:bg-white/10 ${
                    isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  } transition-colors`}
                >
                  <ZoomOut className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                  className={`p-2 rounded-lg hover:bg-white/10 ${
                    isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  } transition-colors`}
                >
                  <ZoomIn className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`p-2 rounded-lg hover:bg-white/10 ${
                    isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  } transition-colors`}
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                <button
                  onClick={handlePrint}
                  className={`p-2 rounded-lg hover:bg-white/10 ${
                    isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  } transition-colors`}
                >
                  <Printer className="w-5 h-5" />
                </button>
                <button
                  onClick={handleShare}
                  className={`p-2 rounded-lg hover:bg-white/10 ${
                    isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  } transition-colors`}
                >
                  <Share2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`p-2 rounded-lg hover:bg-white/10 ${
                    isBookmarked
                      ? 'text-purple-400'
                      : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  } transition-colors`}
                >
                  {isBookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex h-[calc(100%-4rem)]">
            {/* Table of Contents */}
            <AnimatePresence>
              {showToc && (
                <motion.aside
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 280, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className={`border-r ${
                    isDarkMode ? 'border-white/10' : 'border-gray-200'
                  } overflow-y-auto hidden lg:block`}
                >
                  <div className="p-4">
                    <h3 className={`font-semibold mb-4 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>Table of Contents</h3>
                    <nav className="space-y-1">
                      {tableOfContents.map((item) => (
                        <a
                          key={item.id}
                          href={`#${item.id}`}
                          className={`block py-2 hover:text-purple-400 transition-colors ${
                            item.level === 1 ? 'font-medium' : 'pl-4 text-sm'
                          } ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                        >
                          {item.title}
                        </a>
                      ))}
                    </nav>
                  </div>
                </motion.aside>
              )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto">
              <article className="max-w-4xl mx-auto p-8" style={{ fontSize: `${fontSize}px` }}>
                {/* Article Meta */}
                <div className={`flex items-center gap-4 mb-8 text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{doc.author || 'System'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{doc.readTime || '5 min read'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Book className="w-4 h-4" />
                    <span>{doc.views || 0} views</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{doc.likes || 0} likes</span>
                  </div>
                </div>

                {/* Content (would be rendered from markdown/MDX in real implementation) */}
                <div className={`prose prose-lg max-w-none ${
                  isDarkMode ? 'prose-invert' : ''
                }`}>
                  {/* This is mock content - in real implementation, you'd render markdown/MDX here */}
                  <div dangerouslySetInnerHTML={{ __html: mockContent.replace(/\n/g, '<br />') }} />
                </div>

                {/* Article Actions */}
                <div className={`mt-12 pt-8 border-t ${
                  isDarkMode ? 'border-white/10' : 'border-gray-200'
                }`}>
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <p className={`text-lg font-medium mb-2 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>Was this helpful?</p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setUserVote('up')}
                          className={`p-2 rounded-lg border transition-all ${
                            userVote === 'up'
                              ? 'bg-green-500/20 border-green-500/30 text-green-400'
                              : isDarkMode
                              ? 'border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                              : 'border-gray-300 text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                          }`}
                        >
                          <ThumbsUp className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setUserVote('down')}
                          className={`p-2 rounded-lg border transition-all ${
                            userVote === 'down'
                              ? 'bg-red-500/20 border-red-500/30 text-red-400'
                              : isDarkMode
                              ? 'border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                              : 'border-gray-300 text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                          }`}
                        >
                          <ThumbsDown className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                        Edit this page
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="w-4 h-4" />
                        Feedback
                      </Button>
                    </div>
                  </div>

                  {/* Related Articles */}
                  <div>
                    <h3 className={`text-lg font-semibold mb-4 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>Related Articles</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {relatedDocs.map((related, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border cursor-pointer transition-all ${
                            isDarkMode
                              ? 'bg-white/5 border-white/10 hover:bg-white/10'
                              : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          <p className={`font-medium mb-1 ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>{related.title}</p>
                          <p className={`text-sm ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>{related.category}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            </div>

            {/* Right Sidebar - Navigation */}
            <aside className={`w-64 border-l ${
              isDarkMode ? 'border-white/10' : 'border-gray-200'
            } p-4 hidden xl:block`}>
              <div className="sticky top-20">
                <h3 className={`font-semibold mb-4 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>On this page</h3>
                <div className={`space-y-3 text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <a href="#introduction" className="block hover:text-purple-400">Introduction</a>
                  <a href="#getting-started" className="block hover:text-purple-400">Getting Started</a>
                  <a href="#configuration" className="block hover:text-purple-400">Configuration</a>
                  <a href="#api-reference" className="block hover:text-purple-400">API Reference</a>
                  <a href="#examples" className="block hover:text-purple-400">Examples</a>
                  <a href="#troubleshooting" className="block hover:text-purple-400">Troubleshooting</a>
                </div>

                <div className={`mt-8 p-4 rounded-lg ${
                  isDarkMode ? 'bg-white/5' : 'bg-gray-100'
                }`}>
                  <p className={`text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>Need help?</p>
                  <p className={`text-sm mb-3 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>Contact our support team for assistance.</p>
                  <Button size="sm" className="w-full">
                    <MessageSquare className="w-4 h-4" />
                    Get Support
                  </Button>
                </div>
              </div>
            </aside>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}