'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles,
  Bug,
  Code,
  Database,
  Send,
  Copy,
  Check,
  Loader2,
  FileCode,
  MessageSquare,
  Zap,
  Shield,
  Wand2,
  BookOpen,
  GitBranch,
  Terminal
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  context?: {
    code?: string;
    file?: string;
    language?: string;
  };
}

interface AIAssistantTabProps {
  selectedFile?: {
    path: string;
    content: string;
    language: string;
  };
  onCodeUpdate?: (code: string) => void;
}

export function AIAssistantTab({ selectedFile, onCodeUpdate }: AIAssistantTabProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm Claude, your AI coding assistant. I can help you understand code, find bugs, suggest improvements, and generate tests. Select a file and ask me anything!",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  const quickActions = [
    {
      icon: Sparkles,
      label: 'Explain Code',
      prompt: 'Explain what this code does in simple terms',
      color: 'text-blue-500'
    },
    {
      icon: Bug,
      label: 'Find Bugs',
      prompt: 'Analyze this code for potential bugs and issues',
      color: 'text-red-500'
    },
    {
      icon: Code,
      label: 'Refactor',
      prompt: 'Suggest how to refactor this code for better readability and performance',
      color: 'text-purple-500'
    },
    {
      icon: Database,
      label: 'Generate Tests',
      prompt: 'Generate comprehensive unit tests for this code',
      color: 'text-green-500'
    },
    {
      icon: Shield,
      label: 'Security Check',
      prompt: 'Check this code for security vulnerabilities',
      color: 'text-yellow-500'
    },
    {
      icon: Zap,
      label: 'Performance',
      prompt: 'Analyze performance and suggest optimizations',
      color: 'text-orange-500'
    },
    {
      icon: BookOpen,
      label: 'Documentation',
      prompt: 'Generate comprehensive documentation for this code',
      color: 'text-indigo-500'
    },
    {
      icon: GitBranch,
      label: 'Best Practices',
      prompt: 'Review this code against best practices and conventions',
      color: 'text-pink-500'
    }
  ];

  const handleQuickAction = (prompt: string) => {
    if (!selectedFile) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Please select a file first to analyze.',
        timestamp: new Date()
      }]);
      return;
    }

    const fullPrompt = `${prompt}\n\nFile: ${selectedFile.path}\nLanguage: ${selectedFile.language}\n\nCode:\n\`\`\`${selectedFile.language}\n${selectedFile.content}\n\`\`\``;
    handleSendMessage(fullPrompt);
  };

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
      context: selectedFile ? {
        code: selectedFile.content,
        file: selectedFile.path,
        language: selectedFile.language
      } : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response (in production, this would call your AI API)
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateMockResponse(text, selectedFile),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const generateMockResponse = (prompt: string, file?: typeof selectedFile): string => {
    if (!file) {
      return "I'd be happy to help! Please select a file from the code explorer so I can analyze it for you.";
    }

    // Mock responses based on prompt content
    if (prompt.toLowerCase().includes('explain')) {
      return `This ${file.language} code in \`${file.path}\` appears to be a component that:

1. **Purpose**: Implements core functionality for the application
2. **Key Features**: 
   - Handles state management
   - Provides user interaction
   - Manages data flow
3. **Structure**: Uses modern ${file.language} patterns and best practices

The code is well-organized and follows standard conventions. Would you like me to explain any specific part in more detail?`;
    }

    if (prompt.toLowerCase().includes('bug')) {
      return `I've analyzed the code in \`${file.path}\` and found a few potential issues:

🐛 **Potential Bugs:**
1. **Missing Error Handling**: Consider adding try-catch blocks for async operations
2. **State Updates**: Ensure state updates are properly batched
3. **Memory Leaks**: Add cleanup in useEffect returns

📝 **Recommendations:**
- Add input validation
- Implement proper error boundaries
- Consider edge cases for user inputs

Would you like me to show you how to fix any of these issues?`;
    }

    if (prompt.toLowerCase().includes('test')) {
      return `Here are comprehensive tests for \`${file.path}\`:

\`\`\`${file.language}
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

describe('Component Tests', () => {
  it('should render correctly', () => {
    render(<Component />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('should handle user interactions', async () => {
    render(<Component />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    // Add assertions
  });

  it('should handle edge cases', () => {
    // Test edge cases
  });
});
\`\`\`

Would you like me to generate more specific tests for particular functions?`;
    }

    if (prompt.toLowerCase().includes('refactor')) {
      return `Here's a refactored version of your code with improvements:

**Suggested Refactoring:**
1. **Extract Custom Hooks**: Separate logic into reusable hooks
2. **Component Composition**: Break down into smaller components
3. **Performance**: Add memoization where beneficial
4. **Type Safety**: Strengthen TypeScript types

\`\`\`${file.language}
// Example refactored code
const useCustomLogic = () => {
  // Extracted logic
};

const OptimizedComponent = memo(() => {
  const { data, handlers } = useCustomLogic();
  return <div>{/* Simplified JSX */}</div>;
});
\`\`\`

Would you like me to refactor a specific section?`;
    }

    return `I've analyzed your ${file.language} code in \`${file.path}\`. The code structure looks good overall. Here are some insights:

- **Code Quality**: Well-structured and readable
- **Patterns**: Follows modern ${file.language} conventions
- **Suggestions**: Consider adding more comments for complex logic

Is there anything specific you'd like me to help you with?`;
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const extractCodeBlocks = (content: string) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const blocks: Array<{ language: string; code: string }> = [];
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      blocks.push({
        language: match[1] || 'plaintext',
        code: match[2].trim()
      });
    }

    return blocks;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Quick Actions */}
      <div className="p-4 border-b border-white/10">
        <div className="grid grid-cols-4 gap-2">
          {quickActions.map((action) => (
            <Button
              key={action.label}
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction(action.prompt)}
              disabled={!selectedFile || isLoading}
              className="h-auto py-3 flex flex-col gap-2 hover:bg-white/5"
            >
              <action.icon className={`h-5 w-5 ${action.color}`} />
              <span className="text-xs">{action.label}</span>
            </Button>
          ))}
        </div>
        {selectedFile && (
          <div className="mt-3 flex items-center gap-2">
            <FileCode className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-400">Analyzing: {selectedFile.path}</span>
            <Badge variant="outline" className="text-xs">
              {selectedFile.language}
            </Badge>
          </div>
        )}
      </div>

      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-blue-500/20 border border-blue-500/30'
                    : 'bg-gray-800/50 border border-white/10'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    {message.role === 'user' ? (
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <MessageSquare className="h-4 w-4 text-blue-400" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <Sparkles className="h-4 w-4 text-purple-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-gray-400">
                        {message.role === 'user' ? 'You' : 'Claude'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                    
                    {/* Code blocks with copy functionality */}
                    {message.role === 'assistant' && extractCodeBlocks(message.content).map((block, idx) => (
                      <Card key={idx} className="mt-3 bg-black/30 border-white/10">
                        <CardContent className="p-3">
                          <div className="flex justify-between items-center mb-2">
                            <Badge variant="outline" className="text-xs">
                              {block.language}
                            </Badge>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleCopy(block.code, `${message.id}-${idx}`)}
                              className="h-6 px-2"
                            >
                              {copiedId === `${message.id}-${idx}` ? (
                                <Check className="h-3 w-3 text-green-400" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                          <pre className="text-xs overflow-x-auto">
                            <code>{block.code}</code>
                          </pre>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-800/50 border border-white/10 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin text-purple-400" />
                  <span className="text-sm text-gray-400">Claude is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <Textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder={selectedFile ? "Ask about this code..." : "Select a file to start analyzing..."}
            className="flex-1 min-h-[80px] bg-gray-800/50 border-white/10 resize-none"
            disabled={isLoading}
          />
          <div className="flex flex-col gap-2">
            <Button
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || isLoading}
              className="h-full"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setMessages([messages[0]])}
              title="Clear chat"
            >
              <Terminal className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}