'use client';

import { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  FileText,
  Copy,
  Download,
  Maximize2,
  Code,
  Eye,
  Terminal as TerminalIcon,
  GitBranch,
  Brain,
  Save,
  FolderOpen,
  Folder,
  FileCode,
  FileJson,
  ChevronRight,
  ChevronDown,
  Search,
  RefreshCw,
  Settings,
  Package,
  Play,
  Bug,
  Database,
  Globe,
  Server,
  Sparkles,
  X
} from 'lucide-react';

interface EnhancedCodeExplorerProps {
  projectId: string;
  className?: string;
}

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileNode[];
  content?: string;
  language?: string;
}

interface ProjectInfo {
  name: string;
  type: 'demo' | 'production';
  path: string;
}

export function EnhancedCodeExplorer({ projectId, className }: EnhancedCodeExplorerProps) {
  const [activeTab, setActiveTab] = useState('editor');
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [projectInfo, setProjectInfo] = useState<ProjectInfo | null>(null);
  const [openTabs, setOpenTabs] = useState<FileNode[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [fileContents, setFileContents] = useState<Record<string, string>>({});
  const [viewMode, setViewMode] = useState<'demo' | 'production'>('production');
  const [hasDemo, setHasDemo] = useState(false);
  const [hasProduction, setHasProduction] = useState(false);
  const editorRef = useRef<any>(null);

  // Load project info and file tree
  useEffect(() => {
    loadProjectData();
  }, [projectId]);

  const loadProjectData = async (mode?: 'demo' | 'production') => {
    try {
      // Clear existing tabs when switching modes
      if (mode && mode !== viewMode) {
        setOpenTabs([]);
        setActiveTabId(null);
        setSelectedFile(null);
        setFileContents({});
      }
      
      const targetMode = mode || viewMode;
      
      // Fetch file tree from API with mode parameter
      const response = await fetch(`/api/projects/${projectId}/tree?mode=${targetMode}`);
      if (!response.ok) {
        console.error('Failed to load project tree');
        return;
      }
      
      const data = await response.json();
      setProjectInfo(data.projectInfo);
      setFileTree(data.fileTree);
      
      // Check availability of demo and production
      if (data.availableModes) {
        setHasDemo(data.availableModes.includes('demo'));
        setHasProduction(data.availableModes.includes('production'));
      } else {
        // Fallback: check based on project ID
        const isProduction = projectId.includes('cvp-');
        setHasProduction(isProduction);
        setHasDemo(true); // Most projects have demo
      }
      
      if (mode) {
        setViewMode(mode);
      }
      
      // Auto-expand important folders
      setExpandedFolders(new Set(['src', 'src/components', 'src/pages', 'src/services', 'api', 'app', 'components']));
    } catch (error) {
      console.error('Error loading project data:', error);
    }
  };


  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const selectFile = async (file: FileNode) => {
    if (file.type === 'folder') {
      toggleFolder(file.path);
      return;
    }
    
    setSelectedFile(file);
    
    // Add to open tabs if not already open
    if (!openTabs.find(tab => tab.id === file.id)) {
      setOpenTabs([...openTabs, file]);
    }
    
    setActiveTabId(file.id);
    
    // Load file content if not cached
    if (!fileContents[file.id]) {
      try {
        const response = await fetch(`/api/projects/${projectId}/file-content?path=${encodeURIComponent(file.path)}&mode=${viewMode}`);
        if (response.ok) {
          const data = await response.json();
          setFileContents({
            ...fileContents,
            [file.id]: data.content
          });
        }
      } catch (error) {
        console.error('Error loading file content:', error);
      }
    }
  };

  const closeTab = (tabId: string) => {
    const newTabs = openTabs.filter(tab => tab.id !== tabId);
    setOpenTabs(newTabs);
    
    if (activeTabId === tabId && newTabs.length > 0) {
      setActiveTabId(newTabs[newTabs.length - 1].id);
      setSelectedFile(newTabs[newTabs.length - 1]);
    } else if (newTabs.length === 0) {
      setActiveTabId(null);
      setSelectedFile(null);
    }
  };

  const getFileIcon = (node: FileNode) => {
    if (node.type === 'folder') {
      return expandedFolders.has(node.path) ? 
        <FolderOpen className="h-4 w-4 text-yellow-500" /> : 
        <Folder className="h-4 w-4 text-yellow-500" />;
    }
    
    const ext = node.name.split('.').pop();
    switch (ext) {
      case 'ts':
      case 'tsx':
      case 'js':
      case 'jsx':
        return <FileCode className="h-4 w-4 text-blue-400" />;
      case 'json':
        return <FileJson className="h-4 w-4 text-yellow-400" />;
      default:
        return <FileText className="h-4 w-4 text-gray-400" />;
    }
  };

  const renderFileTree = (nodes: FileNode[], level = 0) => {
    return nodes.map(node => {
      const isExpanded = expandedFolders.has(node.path);
      const isSelected = selectedFile?.id === node.id;
      
      return (
        <div key={node.id}>
          <div
            className={`flex items-center gap-2 py-1 px-2 cursor-pointer hover:bg-white/5 rounded text-sm ${
              isSelected ? 'bg-blue-500/20 text-blue-400' : ''
            }`}
            style={{ paddingLeft: `${level * 20 + 8}px` }}
            onClick={() => selectFile(node)}
          >
            {node.type === 'folder' && (
              <div className="w-4 h-4">
                {isExpanded ? 
                  <ChevronDown className="h-3 w-3 text-gray-400" /> : 
                  <ChevronRight className="h-3 w-3 text-gray-400" />
                }
              </div>
            )}
            {getFileIcon(node)}
            <span className="flex-1">{node.name}</span>
          </div>
          {node.type === 'folder' && node.children && isExpanded && (
            <div>{renderFileTree(node.children, level + 1)}</div>
          )}
        </div>
      );
    });
  };

  const editorOptions = {
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
    }
  };

  const activeFile = openTabs.find(tab => tab.id === activeTabId);

  return (
    <Card className={`border-white/10 bg-gray-900/90 backdrop-blur-sm ${className}`}>
      <CardHeader className="border-b border-white/10 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Code className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-lg font-medium">
              {projectInfo?.name || 'Code Explorer'}
            </CardTitle>
            <Badge variant="outline" className={`text-xs ${
              viewMode === 'production' ? 'text-green-400 border-green-400/20' : 'text-blue-400 border-blue-400/20'
            }`}>
              {viewMode === 'production' ? (
                <>
                  <Server className="h-3 w-3 mr-1" />
                  Production
                </>
              ) : (
                <>
                  <Play className="h-3 w-3 mr-1" />
                  Demo
                </>
              )}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            {(hasDemo || hasProduction) && (
              <div className="flex items-center gap-1 p-0.5 bg-gray-800/50 rounded-md">
                {hasDemo && (
                  <Button 
                    size="sm" 
                    variant={viewMode === 'demo' ? 'default' : 'ghost'}
                    className={`h-6 px-2 text-xs ${
                      viewMode === 'demo' ? 'bg-blue-500/20 text-blue-400' : ''
                    }`}
                    onClick={() => loadProjectData('demo')}
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Demo
                  </Button>
                )}
                {hasProduction && (
                  <Button 
                    size="sm" 
                    variant={viewMode === 'production' ? 'default' : 'ghost'}
                    className={`h-6 px-2 text-xs ${
                      viewMode === 'production' ? 'bg-green-500/20 text-green-400' : ''
                    }`}
                    onClick={() => loadProjectData('production')}
                  >
                    <Server className="h-3 w-3 mr-1" />
                    Prod
                  </Button>
                )}
              </div>
            )}
            
            <div className="h-4 w-px bg-white/10" />
            
            <Button size="sm" variant="ghost" className="h-7 px-2">
              <GitBranch className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="ghost" className="h-7 px-2">
              <TerminalIcon className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="ghost" className="h-7 px-2">
              <Settings className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 flex h-[calc(100%-4rem)]">
        {/* File Explorer Sidebar */}
        <div className="w-64 border-r border-white/10 bg-gray-950/50">
          <div className="p-3 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
              <Input
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-7 text-xs bg-gray-800 border-white/10"
              />
            </div>
          </div>
          <ScrollArea className="h-[calc(100%-60px)]">
            <div className="p-2">
              {renderFileTree(fileTree)}
            </div>
          </ScrollArea>
        </div>
        
        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* Tabs Bar */}
          {openTabs.length > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 bg-gray-800/50 border-b border-white/10 overflow-x-auto">
              {openTabs.map(tab => (
                <div
                  key={tab.id}
                  className={`flex items-center gap-2 px-3 py-1 rounded-t cursor-pointer text-sm ${
                    activeTabId === tab.id
                      ? 'bg-gray-900 border-t border-x border-white/10'
                      : 'bg-gray-700/50 hover:bg-gray-700'
                  }`}
                  onClick={() => {
                    setActiveTabId(tab.id);
                    setSelectedFile(tab);
                  }}
                >
                  {getFileIcon(tab)}
                  <span>{tab.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      closeTab(tab.id);
                    }}
                    className="ml-1 hover:bg-white/10 rounded p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {/* Editor */}
          <div className="flex-1">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <TabsList className="w-full rounded-none border-b border-white/10">
                <TabsTrigger value="editor" className="flex-1">
                  <Code className="h-4 w-4 mr-2" />
                  Editor
                </TabsTrigger>
                <TabsTrigger value="ai" className="flex-1">
                  <Brain className="h-4 w-4 mr-2" />
                  AI Assistant
                </TabsTrigger>
                <TabsTrigger value="preview" className="flex-1">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="editor" className="flex-1 p-0 m-0">
                {activeFile ? (
                  <Editor
                    height="100%"
                    language={activeFile.language || 'javascript'}
                    value={fileContents[activeFile.id] || activeFile.content || ''}
                    onChange={(value) => {
                      if (value !== undefined && activeFile) {
                        setFileContents({
                          ...fileContents,
                          [activeFile.id]: value
                        });
                      }
                    }}
                    theme="vs-dark"
                    options={editorOptions}
                    onMount={(editor) => {
                      editorRef.current = editor;
                    }}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <FileCode className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                      <p>Select a file to start editing</p>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="ai" className="flex-1 p-6">
                <div className="max-w-2xl mx-auto">
                  <div className="text-center mb-8">
                    <Brain className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Claude AI Assistant</h3>
                    <p className="text-gray-400">
                      Get intelligent code suggestions, explanations, and refactoring help
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-20 flex-col gap-2">
                      <Sparkles className="h-6 w-6" />
                      <span>Explain Code</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col gap-2">
                      <Bug className="h-6 w-6" />
                      <span>Find Bugs</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col gap-2">
                      <Code className="h-6 w-6" />
                      <span>Refactor</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col gap-2">
                      <Database className="h-6 w-6" />
                      <span>Generate Tests</span>
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="preview" className="flex-1 p-6">
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <Globe className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Live Preview</h3>
                    <p className="text-gray-400 mb-4">
                      Preview your changes in real-time
                    </p>
                    <Button>
                      <Play className="h-4 w-4 mr-2" />
                      Start Preview Server
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}