'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  FileText,
  Copy,
  Download,
  Maximize2,
  Code,
  Terminal as TerminalIcon,
  GitBranch,
  Users,
  Command,
  Settings,
  Sparkles,
  Brain,
  Bug,
  Shield,
  TestTube,
  FileCode,
  Search,
  Play,
  Square,
  RefreshCw,
  Save,
  FolderOpen,
  X,
  Plus,
  Minimize2,
  Columns,
  Eye,
  EyeOff,
  Zap,
  Activity,
  Package,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { ClaudeAIAssistant } from './claude-ai-assistant';
import { TerminalComponent } from './terminal-component';
import { GitIntegration } from './git-integration';
import { CollaborationProvider } from './collaboration-provider';
import { CommandPalette } from './command-palette';
import { FileExplorer } from './file-explorer';
import { LivePreview } from './live-preview';
import { PerformanceMonitor } from './performance-monitor';
import { LSPClient } from './lsp-client';
import { CodeFormatter } from './code-formatter';
import { SecurityScanner } from './security-scanner';
import { TestGenerator } from './test-generator';
import { DependencyVisualizer } from './dependency-visualizer';

interface EnhancedMonacoEditorProps {
  projectId: string;
  className?: string;
  onSave?: (content: string) => void;
}

interface EditorTab {
  id: string;
  name: string;
  path: string;
  content: string;
  language: string;
  isDirty: boolean;
}

export function EnhancedMonacoEditor({ 
  projectId, 
  className,
  onSave
}: EnhancedMonacoEditorProps) {
  const [tabs, setTabs] = useState<EditorTab[]>([
    {
      id: '1',
      name: 'App.tsx',
      path: '/src/App.tsx',
      content: `import React from 'react';

function App() {
  return (
    <div className="app">
      <h1>Hello Ultimate AI Dashboard!</h1>
    </div>
  );
}

export default App;`,
      language: 'typescript',
      isDirty: false
    }
  ]);
  
  const [activeTabId, setActiveTabId] = useState('1');
  const [showTerminal, setShowTerminal] = useState(false);
  const [showGitPanel, setShowGitPanel] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showFileExplorer, setShowFileExplorer] = useState(true);
  const [showLivePreview, setShowLivePreview] = useState(false);
  const [splitView, setSplitView] = useState<'none' | 'vertical' | 'horizontal'>('none');
  const [collaborators, setCollaborators] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const lspClientRef = useRef<LSPClient | null>(null);
  
  const activeTab = tabs.find(tab => tab.id === activeTabId);

  // Initialize LSP Client
  useEffect(() => {
    if (monacoRef.current) {
      lspClientRef.current = new LSPClient(monacoRef.current);
      lspClientRef.current.initialize();
    }
    
    return () => {
      lspClientRef.current?.dispose();
    };
  }, []);

  // Command Palette keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        setShowCommandPalette(true);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleEditorChange = useCallback((value: string | undefined) => {
    if (value !== undefined && activeTab) {
      setTabs(prev => prev.map(tab => 
        tab.id === activeTab.id 
          ? { ...tab, content: value, isDirty: true }
          : tab
      ));
    }
  }, [activeTab]);

  const handleSave = useCallback(() => {
    if (activeTab && activeTab.isDirty) {
      onSave?.(activeTab.content);
      setTabs(prev => prev.map(tab => 
        tab.id === activeTab.id 
          ? { ...tab, isDirty: false }
          : tab
      ));
    }
  }, [activeTab, onSave]);

  const handleCloseTab = useCallback((tabId: string) => {
    setTabs(prev => {
      const newTabs = prev.filter(tab => tab.id !== tabId);
      if (activeTabId === tabId && newTabs.length > 0) {
        setActiveTabId(newTabs[0].id);
      }
      return newTabs;
    });
  }, [activeTabId]);

  const handleFileSelect = useCallback((file: { path: string; content: string; language: string }) => {
    const existingTab = tabs.find(tab => tab.path === file.path);
    
    if (existingTab) {
      setActiveTabId(existingTab.id);
    } else {
      const newTab: EditorTab = {
        id: Date.now().toString(),
        name: file.path.split('/').pop() || 'untitled',
        path: file.path,
        content: file.content,
        language: file.language,
        isDirty: false
      };
      setTabs(prev => [...prev, newTab]);
      setActiveTabId(newTab.id);
    }
  }, [tabs]);

  const editorOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
    minimap: { enabled: true },
    fontSize: 14,
    lineNumbers: 'on',
    roundedSelection: false,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    formatOnType: true,
    formatOnPaste: true,
    wordWrap: 'on',
    folding: true,
    bracketPairColorization: { enabled: true },
    suggestSelection: 'first',
    quickSuggestions: {
      other: true,
      comments: true,
      strings: true
    },
    parameterHints: { enabled: true },
    suggest: {
      showKeywords: true,
      showSnippets: true,
      showClasses: true,
      showFunctions: true,
      showColors: true,
      showFiles: true,
      showReferences: true,
      showFolders: true,
      showVariables: true,
      showWords: true
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`${className} ${isFullscreen ? 'fixed inset-0 z-50 bg-gray-900' : ''}`}>
      <Card className="border-white/10 bg-gray-900/90 backdrop-blur-sm h-full">
        <CardHeader className="border-b border-white/10 p-0">
          {/* Editor Toolbar */}
          <div className="flex items-center justify-between px-4 py-2 bg-gray-950/50">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={showFileExplorer ? 'default' : 'ghost'}
                onClick={() => setShowFileExplorer(!showFileExplorer)}
                className="h-7 px-2"
              >
                <FolderOpen className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant={showAIAssistant ? 'default' : 'ghost'}
                onClick={() => setShowAIAssistant(!showAIAssistant)}
                className="h-7 px-2"
              >
                <Brain className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant={showGitPanel ? 'default' : 'ghost'}
                onClick={() => setShowGitPanel(!showGitPanel)}
                className="h-7 px-2"
              >
                <GitBranch className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant={showTerminal ? 'default' : 'ghost'}
                onClick={() => setShowTerminal(!showTerminal)}
                className="h-7 px-2"
              >
                <TerminalIcon className="h-3 w-3" />
              </Button>
              <div className="h-6 w-px bg-white/10 mx-1" />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowCommandPalette(true)}
                className="h-7 px-2"
              >
                <Command className="h-3 w-3 mr-1" />
                <span className="text-xs">Cmd+Shift+P</span>
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              {collaborators.length > 0 && (
                <div className="flex items-center gap-1 mr-2">
                  <Users className="h-3 w-3 text-green-400" />
                  <span className="text-xs text-green-400">{collaborators.length} online</span>
                </div>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowLivePreview(!showLivePreview)}
                className="h-7 px-2"
              >
                {showLivePreview ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSplitView(splitView === 'none' ? 'vertical' : 'none')}
                className="h-7 px-2"
              >
                <Columns className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={toggleFullscreen}
                className="h-7 px-2"
              >
                {isFullscreen ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
              </Button>
            </div>
          </div>
          
          {/* File Tabs */}
          <div className="flex items-center gap-1 px-2 py-1 bg-gray-800/50 overflow-x-auto">
            {tabs.map(tab => (
              <div
                key={tab.id}
                className={`flex items-center gap-2 px-3 py-1 rounded-t cursor-pointer transition-colors ${
                  activeTabId === tab.id
                    ? 'bg-gray-900 border-t border-x border-white/10'
                    : 'bg-gray-700/50 hover:bg-gray-700'
                }`}
                onClick={() => setActiveTabId(tab.id)}
              >
                <FileText className="h-3 w-3 text-blue-400" />
                <span className="text-sm">{tab.name}</span>
                {tab.isDirty && <span className="text-orange-400">•</span>}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCloseTab(tab.id);
                  }}
                  className="ml-1 hover:bg-white/10 rounded p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              onClick={() => {
                const newTab: EditorTab = {
                  id: Date.now().toString(),
                  name: 'untitled',
                  path: '/untitled',
                  content: '',
                  language: 'javascript',
                  isDirty: false
                };
                setTabs(prev => [...prev, newTab]);
                setActiveTabId(newTab.id);
              }}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0 h-[calc(100%-120px)]">
          <div className="flex h-full">
            {/* File Explorer */}
            {showFileExplorer && (
              <div className="w-64 border-r border-white/10 bg-gray-900/50">
                <FileExplorer
                  projectId={projectId}
                  onFileSelect={handleFileSelect}
                />
              </div>
            )}
            
            {/* Main Editor Area */}
            <div className="flex-1 flex flex-col">
              <div className={`flex-1 flex ${splitView === 'vertical' ? 'flex-row' : 'flex-col'}`}>
                {/* Primary Editor */}
                <div className={`${splitView !== 'none' ? 'w-1/2' : 'w-full'} relative`}>
                  <CollaborationProvider
                    projectId={projectId}
                    onCollaboratorsChange={setCollaborators}
                  >
                    <Editor
                      height="100%"
                      language={activeTab?.language || 'javascript'}
                      value={activeTab?.content || ''}
                      onChange={handleEditorChange}
                      theme="vs-dark"
                      options={editorOptions}
                      onMount={(editor, monaco) => {
                        editorRef.current = editor;
                        monacoRef.current = monaco;
                        
                        // Add save shortcut
                        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, handleSave);
                        
                        // Initialize Claude AI suggestions
                        if (lspClientRef.current) {
                          try {
                            lspClientRef.current.attachToEditor(editor);
                          } catch (e) {
                            console.warn('LSP client attach failed:', e);
                          }
                        }
                      }}
                      beforeMount={(monaco) => {
                        // Define custom theme
                        monaco.editor.defineTheme('ultimate-dark', {
                          base: 'vs-dark',
                          inherit: true,
                          rules: [
                            { token: 'comment', foreground: '6A737D' },
                            { token: 'string', foreground: '9ECBFF' },
                            { token: 'keyword', foreground: 'F97583' },
                            { token: 'number', foreground: '79B8FF' },
                            { token: 'type', foreground: 'B392F0' },
                          ],
                          colors: {
                            'editor.background': '#0d1117',
                            'editor.foreground': '#c9d1d9',
                            'editor.lineHighlightBackground': '#161b22',
                            'editorLineNumber.foreground': '#484f58',
                            'editorIndentGuide.background': '#21262d',
                            'editor.selectionBackground': '#3392FF44',
                          }
                        });
                        monaco.editor.setTheme('ultimate-dark');
                      }}
                    />
                  </CollaborationProvider>
                  
                  {/* AI Assistant Overlay */}
                  {showAIAssistant && (
                    <div className="absolute top-0 right-0 w-96 h-full bg-gray-900/95 border-l border-white/10 z-10">
                      <ClaudeAIAssistant
                        editor={editorRef.current}
                        monaco={monacoRef.current}
                        onClose={() => setShowAIAssistant(false)}
                      />
                    </div>
                  )}
                </div>
                
                {/* Split View Editor */}
                {splitView !== 'none' && (
                  <div className="w-1/2 border-l border-white/10">
                    <Editor
                      height="100%"
                      language={activeTab?.language || 'javascript'}
                      value={activeTab?.content || ''}
                      theme="vs-dark"
                      options={{ ...editorOptions, readOnly: true }}
                    />
                  </div>
                )}
              </div>
              
              {/* Terminal */}
              {showTerminal && (
                <div className="h-64 border-t border-white/10 bg-gray-950">
                  <TerminalComponent projectId={projectId} />
                </div>
              )}
            </div>
            
            {/* Side Panels */}
            {showGitPanel && (
              <div className="w-80 border-l border-white/10 bg-gray-900/50">
                <GitIntegration
                  projectId={projectId}
                  currentFile={activeTab?.path}
                />
              </div>
            )}
            
            {showLivePreview && (
              <div className="w-96 border-l border-white/10 bg-gray-900/50">
                <LivePreview
                  projectId={projectId}
                  code={activeTab?.content || ''}
                  language={activeTab?.language || 'javascript'}
                />
              </div>
            )}
          </div>
        </CardContent>
        
        {/* Performance Monitor */}
        <div className="absolute bottom-4 left-4">
          <PerformanceMonitor />
        </div>
        
        {/* Command Palette */}
        {showCommandPalette && (
          <CommandPalette
            onClose={() => setShowCommandPalette(false)}
            onCommand={(command) => {
              // Handle commands
              console.log('Command executed:', command);
              setShowCommandPalette(false);
            }}
          />
        )}
      </Card>
    </div>
  );
}