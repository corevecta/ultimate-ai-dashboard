'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Brain,
  Send,
  Sparkles,
  Code,
  FileText,
  Bug,
  TestTube,
  Shield,
  Lightbulb,
  X,
  Wand2,
  MessageSquare,
  Copy,
  Check,
  RefreshCw,
  GitBranch,
  Zap,
  BookOpen,
  Search,
  Terminal,
  Settings
} from 'lucide-react';
import * as monaco from 'monaco-editor';

interface ClaudeAIAssistantProps {
  editor: monaco.editor.IStandaloneCodeEditor | null;
  monaco: typeof monaco | null;
  onClose: () => void;
}

interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'code' | 'explanation' | 'suggestion' | 'error';
  codeSnippet?: string;
}

export function ClaudeAIAssistant({ editor, monaco, onClose }: ClaudeAIAssistantProps) {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m Claude, your AI coding assistant. I can help you with code completion, explanations, refactoring, bug detection, test generation, and more. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [activeTab, setActiveTab] = useState('chat');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Quick actions for common tasks
  const quickActions = [
    { icon: <Lightbulb className="h-4 w-4" />, label: 'Explain Code', action: 'explain' },
    { icon: <Wand2 className="h-4 w-4" />, label: 'Refactor', action: 'refactor' },
    { icon: <Bug className="h-4 w-4" />, label: 'Find Bugs', action: 'debug' },
    { icon: <TestTube className="h-4 w-4" />, label: 'Generate Tests', action: 'test' },
    { icon: <Shield className="h-4 w-4" />, label: 'Security Check', action: 'security' },
    { icon: <BookOpen className="h-4 w-4" />, label: 'Add Docs', action: 'document' }
  ];

  // Get selected text from editor
  useEffect(() => {
    if (!editor) return;
    
    const updateSelection = () => {
      const selection = editor.getSelection();
      if (selection && !selection.isEmpty()) {
        const text = editor.getModel()?.getValueInRange(selection);
        setSelectedText(text || '');
      }
    };
    
    const disposable = editor.onDidChangeCursorSelection(updateSelection);
    updateSelection();
    
    return () => disposable.dispose();
  }, [editor]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleQuickAction = async (action: string) => {
    if (!selectedText && !editor?.getValue()) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Please select some code or have code in the editor to perform this action.',
        timestamp: new Date(),
        type: 'error'
      }]);
      return;
    }

    const code = selectedText || editor?.getValue() || '';
    let prompt = '';

    switch (action) {
      case 'explain':
        prompt = `Please explain this code in detail:\n\n${code}`;
        break;
      case 'refactor':
        prompt = `Please suggest refactoring improvements for this code:\n\n${code}`;
        break;
      case 'debug':
        prompt = `Please analyze this code for potential bugs and issues:\n\n${code}`;
        break;
      case 'test':
        prompt = `Please generate comprehensive unit tests for this code:\n\n${code}`;
        break;
      case 'security':
        prompt = `Please perform a security analysis on this code:\n\n${code}`;
        break;
      case 'document':
        prompt = `Please add comprehensive documentation comments to this code:\n\n${code}`;
        break;
    }

    await sendMessage(prompt);
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate Claude API response
    setTimeout(() => {
      const assistantMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateAIResponse(content),
        timestamp: new Date(),
        type: detectResponseType(content),
        codeSnippet: extractCodeFromResponse(content)
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const generateAIResponse = (prompt: string): string => {
    // Simulate intelligent responses based on the prompt
    if (prompt.toLowerCase().includes('explain')) {
      return `I'll explain this code for you:

This code appears to be a React component that:
1. Manages state using the useState hook
2. Renders a user interface with conditional logic
3. Handles user interactions through event handlers

The key concepts used are:
- **Component Lifecycle**: The useEffect hook manages side effects
- **State Management**: Local state tracks user interactions
- **Event Handling**: Click and change events update the UI

Would you like me to explain any specific part in more detail?`;
    }
    
    if (prompt.toLowerCase().includes('refactor')) {
      return `Here are my refactoring suggestions:

1. **Extract Custom Hook**: Move state logic to a custom hook for reusability
2. **Memoize Expensive Computations**: Use useMemo for performance
3. **Split Large Components**: Break down into smaller, focused components
4. **Add Type Safety**: Include TypeScript interfaces for props

\`\`\`typescript
// Refactored version
const useCustomState = () => {
  const [state, setState] = useState(initialState);
  // ... logic here
  return { state, setState };
};
\`\`\``;
    }
    
    if (prompt.toLowerCase().includes('test')) {
      return `Here's a comprehensive test suite:

\`\`\`typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Component } from './Component';

describe('Component', () => {
  it('should render correctly', () => {
    render(<Component />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
  
  it('should handle user interactions', () => {
    render(<Component />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Updated Text')).toBeInTheDocument();
  });
});
\`\`\``;
    }
    
    return `I understand you're asking about: "${prompt}". Let me help you with that...

Based on the context, I can provide code suggestions, explanations, or improvements. Please let me know what specific aspect you'd like me to focus on.`;
  };

  const detectResponseType = (content: string): AIMessage['type'] => {
    if (content.toLowerCase().includes('bug') || content.toLowerCase().includes('error')) return 'error';
    if (content.toLowerCase().includes('explain')) return 'explanation';
    if (content.toLowerCase().includes('test')) return 'code';
    return 'suggestion';
  };

  const extractCodeFromResponse = (content: string): string | undefined => {
    const codeMatch = content.match(/```[\s\S]*?```/);
    return codeMatch ? codeMatch[0] : undefined;
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const insertCode = (code: string) => {
    if (!editor) return;
    
    const selection = editor.getSelection();
    const id = { major: 1, minor: 1 };
    const text = code.replace(/```\w*\n?|\n?```/g, '');
    const op = {
      identifier: id,
      range: selection!,
      text: text,
      forceMoveMarkers: true
    };
    
    editor.executeEdits('ai-assistant', [op]);
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      <CardHeader className="border-b border-white/10 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-500" />
            Claude AI Assistant
          </CardTitle>
          <Button
            size="sm"
            variant="ghost"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="w-full rounded-none border-b border-white/10">
            <TabsTrigger value="chat" className="flex-1">
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="tools" className="flex-1">
              <Sparkles className="h-4 w-4 mr-2" />
              Tools
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat" className="flex-1 flex flex-col p-0 m-0">
            {/* Quick Actions */}
            <div className="p-3 border-b border-white/10">
              <div className="grid grid-cols-3 gap-2">
                {quickActions.map((action) => (
                  <Button
                    key={action.action}
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs border-white/10 hover:bg-white/5"
                    onClick={() => handleQuickAction(action.action)}
                  >
                    {action.icon}
                    <span className="ml-1">{action.label}</span>
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg p-3 ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-800 text-gray-100'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      
                      {message.codeSnippet && (
                        <div className="mt-2 relative">
                          <pre className="bg-gray-900 p-3 rounded text-xs overflow-x-auto">
                            <code>{message.codeSnippet}</code>
                          </pre>
                          <div className="absolute top-2 right-2 flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0"
                              onClick={() => copyToClipboard(message.codeSnippet!, message.id)}
                            >
                              {copiedId === message.id ? (
                                <Check className="h-3 w-3 text-green-400" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0"
                              onClick={() => insertCode(message.codeSnippet!)}
                            >
                              <Code className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      <p className="text-xs text-gray-400 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-800 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
                        <span className="text-sm text-gray-400">Claude is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            {/* Input */}
            <div className="p-4 border-t border-white/10">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage(input);
                }}
                className="flex gap-2"
              >
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Claude anything about your code..."
                  className="flex-1 min-h-[60px] bg-gray-800 border-white/10"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage(input);
                    }
                  }}
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={!input.trim() || isLoading}
                  className="self-end"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </TabsContent>
          
          <TabsContent value="tools" className="p-4">
            <div className="space-y-4">
              <Card className="border-white/10 bg-gray-800/50">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    AI-Powered Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-white/10"
                    onClick={() => sendMessage('Generate a complete function based on this comment')}
                  >
                    <Code className="h-4 w-4 mr-2" />
                    Natural Language to Code
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-white/10"
                    onClick={() => sendMessage('Optimize this code for performance')}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Performance Optimization
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-white/10"
                    onClick={() => sendMessage('Convert this code to TypeScript')}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Code Translation
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-white/10"
                    onClick={() => sendMessage('Generate API documentation')}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    API Documentation
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="border-white/10 bg-gray-800/50">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Settings className="h-4 w-4 text-gray-400" />
                    AI Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Auto-complete</span>
                    <Badge variant="outline" className="text-xs">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Inline suggestions</span>
                    <Badge variant="outline" className="text-xs">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Context awareness</span>
                    <Badge variant="outline" className="text-xs">Full Project</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </div>
  );
}