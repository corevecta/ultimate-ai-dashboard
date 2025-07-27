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
  ChevronDown,
  Wand2,
  FileSearch,
  Palette,
  BookOpen,
  Hash,
  Type,
  AlignLeft,
  Layers,
  FileJson,
  Braces
} from 'lucide-react';
import { ClaudeAIAssistant } from './claude-ai-assistant';
import { TerminalComponentWrapper as TerminalComponent } from './terminal-component-wrapper';
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
import { AdvancedIntelliSense } from './advanced-intellisense';
import { AdvancedDebugging } from './advanced-debugging';
import { CodeLensProvider } from './code-lens-provider';
import { AdvancedRefactoring } from './advanced-refactoring';
import { MultiFileSearch } from './multi-file-search';

interface EnhancedMonacoEditorV2Props {
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
  breakpoints?: number[];
}

export function EnhancedMonacoEditorV2({ 
  projectId, 
  className,
  onSave
}: EnhancedMonacoEditorV2Props) {
  const [tabs, setTabs] = useState<EditorTab[]>([
    {
      id: '1',
      name: 'App.tsx',
      path: '/src/App.tsx',
      content: `import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface AppProps {
  title: string;
  theme?: 'light' | 'dark';
}

/**
 * Main application component
 * @param {AppProps} props - Component properties
 * @returns {React.ReactElement} The rendered app
 */
function App({ title, theme = 'dark' }: AppProps): React.ReactElement {
  const [count, setCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // TODO: Implement data fetching
  useEffect(() => {
    console.log('App mounted with title:', title);
    return () => {
      console.log('App unmounting');
    };
  }, [title]);
  
  const handleIncrement = async () => {
    setIsLoading(true);
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 500));
    setCount(prev => prev + 1);
    setIsLoading(false);
  };
  
  return (
    <div className={\`app \${theme}\`}>
      <Card className="p-8 max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-4">{title}</h1>
        <div className="space-y-4">
          <p className="text-lg">Count: {count}</p>
          <Button 
            onClick={handleIncrement}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Loading...' : 'Increment'}
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default App;`,
      language: 'typescript',
      isDirty: false,
      breakpoints: []
    }
  ]);
  
  const [activeTabId, setActiveTabId] = useState('1');
  const [showTerminal, setShowTerminal] = useState(false);
  const [showGitPanel, setShowGitPanel] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showFileExplorer, setShowFileExplorer] = useState(true);
  const [showLivePreview, setShowLivePreview] = useState(false);
  const [showDebugging, setShowDebugging] = useState(false);
  const [showRefactoring, setShowRefactoring] = useState(false);
  const [showMultiFileSearch, setShowMultiFileSearch] = useState(false);
  const [showMinimap, setShowMinimap] = useState(true);
  const [showBreadcrumbs, setShowBreadcrumbs] = useState(true);
  const [wordWrap, setWordWrap] = useState<'off' | 'on' | 'wordWrapColumn' | 'bounded'>('on');
  const [fontSize, setFontSize] = useState(14);
  const [splitView, setSplitView] = useState<'none' | 'vertical' | 'horizontal'>('none');
  const [collaborators, setCollaborators] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [colorTheme, setColorTheme] = useState<'vs-dark' | 'vs-light' | 'hc-black'>('vs-dark');
  
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const lspClientRef = useRef<LSPClient | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const activeTab = tabs.find(tab => tab.id === activeTabId);

  // Initialize advanced features
  useEffect(() => {
    if (!monacoRef.current) return;
    
    // Configure TypeScript compiler options
    monacoRef.current.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monacoRef.current.languages.typescript.ScriptTarget.Latest,
      allowNonTsExtensions: true,
      moduleResolution: monacoRef.current.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monacoRef.current.languages.typescript.ModuleKind.ESNext,
      allowJs: true,
      jsx: monacoRef.current.languages.typescript.JsxEmit.React,
      reactNamespace: 'React',
      allowSyntheticDefaultImports: true,
      esModuleInterop: true,
      typeRoots: ['node_modules/@types'],
      lib: ['es2020', 'dom', 'dom.iterable', 'esnext']
    });

    // Add extra libraries for better IntelliSense
    const typeDefs = [
      'declare module "@/components/ui/button" { export const Button: any; }',
      'declare module "@/components/ui/card" { export const Card: any; }',
    ].join('\n');
    
    monacoRef.current.languages.typescript.typescriptDefaults.addExtraLib(
      typeDefs,
      'file:///node_modules/@types/custom/index.d.ts'
    );
    
    // Register custom actions
    if (editorRef.current) {
      // Quick Fix action
      editorRef.current.addAction({
        id: 'editor.action.quickFix',
        label: 'Quick Fix',
        keybindings: [monacoRef.current.KeyMod.CtrlCmd | monacoRef.current.KeyCode.Period],
        contextMenuGroupId: 'navigation',
        contextMenuOrder: 1.5,
        run: () => {
          editorRef.current?.trigger('', 'editor.action.quickFix', {});
        }
      });
      
      // Format Document
      editorRef.current.addAction({
        id: 'editor.action.formatDocument',
        label: 'Format Document',
        keybindings: [
          monacoRef.current.KeyMod.CtrlCmd | monacoRef.current.KeyMod.Shift | monacoRef.current.KeyCode.KeyF
        ],
        contextMenuGroupId: 'modification',
        contextMenuOrder: 1.5,
        run: () => {
          editorRef.current?.trigger('', 'editor.action.formatDocument', {});
        }
      });
    }
  }, [monacoRef.current, editorRef.current]);

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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command Palette
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        setShowCommandPalette(true);
      }
      // Save
      else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      // Find
      else if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        if (e.shiftKey) {
          e.preventDefault();
          setShowMultiFileSearch(true);
        }
      }
      // Toggle Terminal
      else if (e.ctrlKey && e.key === '`') {
        e.preventDefault();
        setShowTerminal(!showTerminal);
      }
      // Toggle AI Assistant
      else if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
        e.preventDefault();
        setShowAIAssistant(!showAIAssistant);
      }
      // Quick Open
      else if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        setShowCommandPalette(true);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showTerminal, showAIAssistant]);

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
        isDirty: false,
        breakpoints: []
      };
      setTabs(prev => [...prev, newTab]);
      setActiveTabId(newTab.id);
    }
  }, [tabs]);

  const editorOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
    // Basic options
    fontSize,
    fontFamily: "'Fira Code', 'Cascadia Code', 'JetBrains Mono', monospace",
    fontLigatures: true,
    lineHeight: 22,
    letterSpacing: 0.5,
    
    // Editor behavior
    automaticLayout: true,
    formatOnType: true,
    formatOnPaste: true,
    autoIndent: 'advanced',
    tabSize: 2,
    insertSpaces: true,
    trimAutoWhitespace: true,
    
    // Visual enhancements
    minimap: { 
      enabled: showMinimap,
      scale: 2,
      showSlider: 'always',
      renderCharacters: false
    },
    scrollBeyondLastLine: false,
    renderLineHighlight: 'all',
    renderWhitespace: 'selection',
    renderControlCharacters: true,
    renderIndentGuides: true,
    lineNumbers: 'on',
    lineNumbersMinChars: 5,
    glyphMargin: true,
    folding: true,
    foldingStrategy: 'indentation',
    showFoldingControls: 'always',
    
    // Advanced features
    wordWrap,
    wordWrapColumn: 120,
    wrappingIndent: 'indent',
    bracketPairColorization: {
      enabled: true,
      independentColorPoolPerBracketType: true
    },
    guides: {
      bracketPairs: true,
      bracketPairsHorizontal: true,
      indentation: true,
      highlightActiveIndentation: true
    },
    stickyScroll: {
      enabled: true,
      maxLineCount: 5
    },
    inlayHints: {
      enabled: 'on',
      fontSize: 12,
      fontFamily: 'monospace'
    },
    
    // IntelliSense
    suggestSelection: 'first',
    quickSuggestions: {
      other: 'on',
      comments: 'on',
      strings: 'on'
    },
    parameterHints: {
      enabled: true,
      cycle: true
    },
    suggest: {
      preview: true,
      showMethods: true,
      showFunctions: true,
      showConstructors: true,
      showFields: true,
      showVariables: true,
      showClasses: true,
      showStructs: true,
      showInterfaces: true,
      showModules: true,
      showProperties: true,
      showEvents: true,
      showOperators: true,
      showUnits: true,
      showValues: true,
      showConstants: true,
      showEnums: true,
      showEnumMembers: true,
      showKeywords: true,
      showWords: true,
      showColors: true,
      showFiles: true,
      showReferences: true,
      showFolders: true,
      showTypeParameters: true,
      showSnippets: true,
      showInlineDetails: true,
      showIcons: true,
      maxVisibleSuggestions: 12,
      insertMode: 'replace',
      filterGraceful: true,
      localityBonus: true,
      shareSuggestSelections: true,
      showStatusBar: true,
      showDeprecated: true
    },
    
    // Code lens
    codeLens: true,
    lightbulb: {
      enabled: true
    },
    
    // Scrollbar
    scrollbar: {
      vertical: 'visible',
      horizontal: 'visible',
      useShadows: true,
      verticalHasArrows: false,
      horizontalHasArrows: false,
      verticalScrollbarSize: 14,
      horizontalScrollbarSize: 14,
      arrowSize: 30
    },
    
    // Misc
    mouseWheelZoom: true,
    multiCursorModifier: 'ctrlCmd',
    accessibilitySupport: 'auto',
    autoClosingBrackets: 'languageDefined',
    autoClosingQuotes: 'languageDefined',
    autoSurround: 'languageDefined',
    copyWithSyntaxHighlighting: true,
    cursorBlinking: 'smooth',
    cursorSmoothCaretAnimation: 'on',
    cursorStyle: 'line',
    cursorSurroundingLines: 3,
    cursorWidth: 2,
    dragAndDrop: true,
    emptySelectionClipboard: true,
    links: true,
    matchBrackets: 'always',
    occurrencesHighlight: true,
    overviewRulerBorder: false,
    padding: { top: 10, bottom: 10 },
    quickSuggestionsDelay: 10,
    roundedSelection: true,
    selectOnLineNumbers: true,
    selectionHighlight: true,
    semanticHighlighting: {
      enabled: true
    },
    showUnused: true,
    smoothScrolling: true,
    snippetSuggestions: 'inline',
    tabCompletion: 'on',
    useTabStops: true,
    wordSeparators: '`~!@#$%^&*()-=+[{]}\\|;:\'",.<>/?',
    wordWrapBreakAfterCharacters: '\t})]?|/&.,;¢°′″‰℃、。｡､￠，．：；？！％・･ゝゞヽヾーァィゥェォッャュョヮヵヶぁぃぅぇぉっゃゅょゎゕゖㇰㇱㇲㇳㇴㇵㇶㇷㇸㇹㇺㇻㇼㇽㇾㇿ々〻ｧｨｩｪｫｬｭｮｯｰ"〉》」』】〕）］｝｣',
    wordWrapBreakBeforeCharacters: '!%&()*+,-./:;<=>?@[\\]^{|}'
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
              <Button
                size="sm"
                variant={showDebugging ? 'default' : 'ghost'}
                onClick={() => setShowDebugging(!showDebugging)}
                className="h-7 px-2"
              >
                <Bug className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant={showRefactoring ? 'default' : 'ghost'}
                onClick={() => setShowRefactoring(!showRefactoring)}
                className="h-7 px-2"
              >
                <Wand2 className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant={showMultiFileSearch ? 'default' : 'ghost'}
                onClick={() => setShowMultiFileSearch(!showMultiFileSearch)}
                className="h-7 px-2"
              >
                <FileSearch className="h-3 w-3" />
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
              
              <div className="h-6 w-px bg-white/10 mx-1" />
              
              {/* Editor Settings */}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowMinimap(!showMinimap)}
                className="h-7 px-2"
                title="Toggle Minimap"
              >
                <Layers className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setWordWrap(wordWrap === 'on' ? 'off' : 'on')}
                className="h-7 px-2"
                title="Toggle Word Wrap"
              >
                <AlignLeft className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setColorTheme(colorTheme === 'vs-dark' ? 'vs-light' : 'vs-dark')}
                className="h-7 px-2"
                title="Toggle Theme"
              >
                <Palette className="h-3 w-3" />
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
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setFontSize(fontSize > 10 ? fontSize - 1 : fontSize)}
                className="h-7 px-2"
                title="Decrease Font Size"
              >
                <Type className="h-3 w-3" />
                <span className="text-xs">-</span>
              </Button>
              <span className="text-xs text-gray-400">{fontSize}px</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setFontSize(fontSize < 24 ? fontSize + 1 : fontSize)}
                className="h-7 px-2"
                title="Increase Font Size"
              >
                <Type className="h-3 w-3" />
                <span className="text-xs">+</span>
              </Button>
            </div>
          </div>
          
          {/* Breadcrumbs */}
          {showBreadcrumbs && activeTab && (
            <div className="flex items-center gap-1 px-4 py-1 bg-gray-800/30 text-xs text-gray-400">
              <FileCode className="h-3 w-3" />
              {activeTab.path.split('/').map((part, index, arr) => (
                <React.Fragment key={index}>
                  <span className={index === arr.length - 1 ? 'text-white' : ''}>{part}</span>
                  {index < arr.length - 1 && <ChevronRight className="h-3 w-3" />}
                </React.Fragment>
              ))}
            </div>
          )}
          
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
                {tab.language === 'typescript' || tab.language === 'typescriptreact' ? (
                  <FileCode className="h-3 w-3 text-blue-400" />
                ) : tab.language === 'javascript' || tab.language === 'javascriptreact' ? (
                  <FileCode className="h-3 w-3 text-yellow-400" />
                ) : tab.language === 'json' ? (
                  <FileJson className="h-3 w-3 text-green-400" />
                ) : (
                  <FileText className="h-3 w-3 text-gray-400" />
                )}
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
                  language: 'typescript',
                  isDirty: false,
                  breakpoints: []
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
            <div className="flex-1 flex">
              <div className={`flex-1 flex flex-col ${splitView === 'vertical' ? 'w-1/2' : ''}`}>
                {/* Primary Editor */}
                <div className="flex-1 relative" ref={containerRef}>
                  <CollaborationProvider
                    projectId={projectId}
                    onCollaboratorsChange={setCollaborators}
                  >
                    <Editor
                      height="100%"
                      language={activeTab?.language || 'typescript'}
                      value={activeTab?.content || ''}
                      onChange={handleEditorChange}
                      theme={colorTheme}
                      options={editorOptions}
                      onMount={(editor, monaco) => {
                        editorRef.current = editor;
                        monacoRef.current = monaco;
                        
                        // Add save shortcut
                        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, handleSave);
                        
                        // Initialize LSP client
                        if (lspClientRef.current) {
                          try {
                            lspClientRef.current.attachToEditor(editor);
                          } catch (e) {
                            console.warn('LSP client attach failed:', e);
                          }
                        }
                        
                        // Configure additional editor features
                        editor.updateOptions({
                          'semanticHighlighting.enabled': true,
                          'bracketPairColorization.enabled': true,
                          'guides.bracketPairs': true,
                          'stickyScroll.enabled': true
                        });
                      }}
                      beforeMount={(monaco) => {
                        // Define enhanced theme
                        monaco.editor.defineTheme('vs-dark-enhanced', {
                          base: 'vs-dark',
                          inherit: true,
                          rules: [
                            { token: 'comment', fontStyle: 'italic', foreground: '6A737D' },
                            { token: 'string', foreground: '9ECBFF' },
                            { token: 'keyword', foreground: 'F97583' },
                            { token: 'number', foreground: '79B8FF' },
                            { token: 'type', foreground: 'B392F0' },
                            { token: 'class', foreground: 'B392F0', fontStyle: 'bold' },
                            { token: 'function', foreground: 'DCDCAA' },
                            { token: 'variable', foreground: '9CDCFE' },
                            { token: 'constant', foreground: '4FC1FF' },
                            { token: 'parameter', foreground: '9CDCFE' },
                            { token: 'property', foreground: '9CDCFE' },
                            { token: 'regexp', foreground: 'D16969' },
                            { token: 'operator', foreground: 'D4D4D4' },
                            { token: 'namespace', foreground: '4EC9B0' },
                            { token: 'tag', foreground: '569CD6' },
                            { token: 'attribute.name', foreground: '9CDCFE' },
                            { token: 'attribute.value', foreground: 'CE9178' },
                            { token: 'punctuation', foreground: 'D4D4D4' },
                            { token: 'delimiter', foreground: 'D4D4D4' },
                            { token: 'meta', foreground: 'D4D4D4' }
                          ],
                          colors: {
                            'editor.background': '#0d1117',
                            'editor.foreground': '#c9d1d9',
                            'editor.lineHighlightBackground': '#161b22',
                            'editorLineNumber.foreground': '#484f58',
                            'editorIndentGuide.background': '#21262d',
                            'editor.selectionBackground': '#3392FF44',
                            'editor.wordHighlightBackground': '#3392FF22',
                            'editor.wordHighlightStrongBackground': '#3392FF44',
                            'editorBracketMatch.background': '#3392FF22',
                            'editorBracketMatch.border': '#3392FF',
                            'editorCursor.foreground': '#58a6ff',
                            'editor.findMatchBackground': '#ffd33d44',
                            'editor.findMatchHighlightBackground': '#ffd33d22',
                            'editorGroup.border': '#30363d',
                            'editorGroupHeader.tabsBackground': '#010409',
                            'editorGutter.addedBackground': '#28a745',
                            'editorGutter.deletedBackground': '#ea4a5a',
                            'editorGutter.modifiedBackground': '#2188ff',
                            'editorHoverWidget.background': '#161b22',
                            'editorHoverWidget.border': '#30363d',
                            'editorIndentGuide.activeBackground': '#3b4048',
                            'editorLineNumber.activeForeground': '#e1e4e8',
                            'editorSuggestWidget.background': '#161b22',
                            'editorSuggestWidget.border': '#30363d',
                            'editorSuggestWidget.selectedBackground': '#3392FF44',
                            'editorWidget.background': '#161b22',
                            'errorForeground': '#f85149',
                            'focusBorder': '#388bfd',
                            'gitDecoration.addedResourceForeground': '#34d058',
                            'gitDecoration.conflictingResourceForeground': '#ffab70',
                            'gitDecoration.deletedResourceForeground': '#ea4a5a',
                            'gitDecoration.ignoredResourceForeground': '#6e7681',
                            'gitDecoration.modifiedResourceForeground': '#79b8ff',
                            'gitDecoration.submoduleResourceForeground': '#8b949e',
                            'gitDecoration.untrackedResourceForeground': '#34d058',
                            'list.activeSelectionBackground': '#3392FF44',
                            'list.activeSelectionForeground': '#e1e4e8',
                            'list.focusBackground': '#388bfd26',
                            'list.hoverBackground': '#3b4048',
                            'list.inactiveSelectionBackground': '#3392FF22',
                            'panel.background': '#010409',
                            'panel.border': '#30363d',
                            'panelTitle.activeBorder': '#f78166',
                            'peekView.border': '#388bfd',
                            'peekViewEditor.background': '#0d111788',
                            'peekViewResult.background': '#0d1117',
                            'pickerGroup.border': '#30363d',
                            'pickerGroup.foreground': '#8b949e',
                            'progressBar.background': '#388bfd',
                            'quickInput.background': '#161b22',
                            'quickInput.foreground': '#e1e4e8',
                            'settings.headerForeground': '#8b949e',
                            'settings.modifiedItemIndicator': '#388bfd',
                            'sideBar.background': '#010409',
                            'sideBar.border': '#30363d',
                            'sideBar.foreground': '#e1e4e8',
                            'sideBarSectionHeader.background': '#010409',
                            'sideBarSectionHeader.border': '#30363d',
                            'sideBarSectionHeader.foreground': '#e1e4e8',
                            'sideBarTitle.foreground': '#e1e4e8',
                            'statusBar.background': '#0d1117',
                            'statusBar.border': '#30363d',
                            'statusBar.debuggingBackground': '#ea4a5a',
                            'statusBar.debuggingForeground': '#f0f6fc',
                            'statusBar.foreground': '#8b949e',
                            'statusBar.noFolderBackground': '#0d1117',
                            'statusBarItem.prominentBackground': '#161b22',
                            'statusBarItem.remoteBackground': '#1f6feb',
                            'statusBarItem.remoteForeground': '#f0f6fc',
                            'tab.activeBackground': '#0d1117',
                            'tab.activeBorderTop': '#f78166',
                            'tab.activeForeground': '#e1e4e8',
                            'tab.border': '#30363d',
                            'tab.hoverBackground': '#0d111788',
                            'tab.inactiveBackground': '#010409',
                            'tab.inactiveForeground': '#8b949e',
                            'tab.unfocusedActiveBorderTop': '#30363d',
                            'tab.unfocusedHoverBackground': '#6e768166',
                            'terminal.ansiBlack': '#484f58',
                            'terminal.ansiBlue': '#58a6ff',
                            'terminal.ansiBrightBlack': '#6e7681',
                            'terminal.ansiBrightBlue': '#79c0ff',
                            'terminal.ansiBrightCyan': '#56d4dd',
                            'terminal.ansiBrightGreen': '#56d364',
                            'terminal.ansiBrightMagenta': '#d2a8ff',
                            'terminal.ansiBrightRed': '#ff7b72',
                            'terminal.ansiBrightWhite': '#f0f6fc',
                            'terminal.ansiBrightYellow': '#e3b341',
                            'terminal.ansiCyan': '#39c5cf',
                            'terminal.ansiGreen': '#2ea043',
                            'terminal.ansiMagenta': '#bc8cff',
                            'terminal.ansiRed': '#f85149',
                            'terminal.ansiWhite': '#b1bac4',
                            'terminal.ansiYellow': '#d29922',
                            'textLink.activeForeground': '#58a6ff',
                            'textLink.foreground': '#58a6ff',
                            'titleBar.activeBackground': '#0d1117',
                            'titleBar.activeForeground': '#e1e4e8',
                            'titleBar.border': '#30363d',
                            'titleBar.inactiveBackground': '#010409',
                            'titleBar.inactiveForeground': '#8b949e',
                            'tree.indentGuidesStroke': '#21262d',
                            'warningForeground': '#d29922'
                          }
                        });
                        
                        if (colorTheme === 'vs-dark') {
                          monaco.editor.setTheme('vs-dark-enhanced');
                        } else {
                          monaco.editor.setTheme(colorTheme);
                        }
                      }}
                    />
                  </CollaborationProvider>
                  
                  {/* Floating IntelliSense and CodeLens */}
                  <div className="absolute bottom-4 left-4 flex flex-col gap-2 pointer-events-none">
                    <div className="pointer-events-auto">
                      <AdvancedIntelliSense editor={editorRef.current} projectId={projectId} />
                    </div>
                    <div className="pointer-events-auto">
                      <CodeLensProvider editor={editorRef.current} projectId={projectId} />
                    </div>
                  </div>
                </div>
                
                {/* Terminal */}
                {showTerminal && (
                  <div className="h-64 border-t border-white/10 bg-gray-950">
                    <TerminalComponent projectId={projectId} />
                  </div>
                )}
              </div>
              
              {/* Split View Editor */}
              {splitView === 'vertical' && (
                <div className="w-1/2 border-l border-white/10">
                  <Editor
                    height="100%"
                    language={activeTab?.language || 'typescript'}
                    value={activeTab?.content || ''}
                    theme={colorTheme}
                    options={{ ...editorOptions, readOnly: true }}
                  />
                </div>
              )}
              
              {/* Right Panels */}
              {showAIAssistant && (
                <div className="w-96 border-l border-white/10 bg-gray-900/50">
                  <ClaudeAIAssistant
                    editor={editorRef.current}
                    monaco={monacoRef.current}
                    onClose={() => setShowAIAssistant(false)}
                  />
                </div>
              )}
              
              {showDebugging && (
                <div className="w-96 border-l border-white/10 bg-gray-900/50">
                  <AdvancedDebugging editor={editorRef.current} />
                </div>
              )}
              
              {showRefactoring && (
                <div className="w-80 border-l border-white/10 bg-gray-900/50">
                  <AdvancedRefactoring editor={editorRef.current} projectId={projectId} />
                </div>
              )}
              
              {showMultiFileSearch && (
                <div className="w-96 border-l border-white/10 bg-gray-900/50">
                  <MultiFileSearch editor={editorRef.current} projectId={projectId} />
                </div>
              )}
            </div>
            
            {/* Far Right Panels */}
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
                  language={activeTab?.language || 'typescript'}
                />
              </div>
            )}
          </div>
        </CardContent>
        
        {/* Performance Monitor */}
        <div className="absolute bottom-4 right-4">
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