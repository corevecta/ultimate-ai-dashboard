'use client';

import { useEffect, useRef, useState } from 'react';
import * as monaco from 'monaco-editor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  FileText,
  X,
  Search,
  Copy,
  Download,
  Maximize2,
  Code,
  GitBranch,
  Terminal,
  Bug
} from 'lucide-react';

interface MonacoEditorProps {
  projectId: string;
  initialFile?: string;
  className?: string;
}

interface OpenFile {
  path: string;
  content: string;
  language: string;
  modified: boolean;
}

export function MonacoEditor({ projectId, initialFile, className }: MonacoEditorProps) {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [openFiles, setOpenFiles] = useState<OpenFile[]>([]);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [theme, setTheme] = useState<'vs-dark' | 'vs-light'>('vs-dark');
  const [fontSize, setFontSize] = useState(14);

  // Initialize Monaco Editor
  useEffect(() => {
    if (!containerRef.current) return;

    // Configure Monaco environment
    monaco.editor.defineTheme('custom-dark', {
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

    // Create editor instance
    const editor = monaco.editor.create(containerRef.current, {
      value: '// Select a file to view its content',
      language: 'javascript',
      theme: 'custom-dark',
      fontSize,
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      formatOnType: true,
      formatOnPaste: true,
      wordWrap: 'on',
      folding: true,
      lineNumbers: 'on',
      renderWhitespace: 'selection',
      bracketPairColorization: { enabled: true },
      'semanticHighlighting.enabled': true,
    });

    editorRef.current = editor;

    // Load initial file if provided
    if (initialFile) {
      loadFile(initialFile);
    }

    return () => {
      editor.dispose();
    };
  }, []);

  // Load file content
  const loadFile = async (filePath: string) => {
    try {
      const response = await fetch(
        `/api/visual-intelligence/code?projectId=${projectId}&path=${filePath}`
      );
      
      if (!response.ok) throw new Error('Failed to load file');
      
      const data = await response.json();
      
      // Check if file is already open
      const existingFile = openFiles.find(f => f.path === filePath);
      if (existingFile) {
        setActiveFile(filePath);
        if (editorRef.current) {
          editorRef.current.setValue(existingFile.content);
          monaco.editor.setModelLanguage(
            editorRef.current.getModel()!,
            existingFile.language
          );
        }
        return;
      }

      // Add new file to open files
      const newFile: OpenFile = {
        path: filePath,
        content: data.content,
        language: data.language,
        modified: false
      };

      setOpenFiles(prev => [...prev, newFile]);
      setActiveFile(filePath);

      // Update editor
      if (editorRef.current) {
        editorRef.current.setValue(data.content);
        monaco.editor.setModelLanguage(
          editorRef.current.getModel()!,
          data.language
        );
      }
    } catch (error) {
      console.error('Failed to load file:', error);
    }
  };

  // Close file
  const closeFile = (filePath: string) => {
    setOpenFiles(prev => prev.filter(f => f.path !== filePath));
    
    if (activeFile === filePath) {
      const remainingFiles = openFiles.filter(f => f.path !== filePath);
      if (remainingFiles.length > 0) {
        const newActiveFile = remainingFiles[remainingFiles.length - 1];
        setActiveFile(newActiveFile.path);
        if (editorRef.current) {
          editorRef.current.setValue(newActiveFile.content);
          monaco.editor.setModelLanguage(
            editorRef.current.getModel()!,
            newActiveFile.language
          );
        }
      } else {
        setActiveFile(null);
        if (editorRef.current) {
          editorRef.current.setValue('// Select a file to view its content');
        }
      }
    }
  };

  // Switch between files
  const switchFile = (filePath: string) => {
    const file = openFiles.find(f => f.path === filePath);
    if (file && editorRef.current) {
      setActiveFile(filePath);
      editorRef.current.setValue(file.content);
      monaco.editor.setModelLanguage(
        editorRef.current.getModel()!,
        file.language
      );
    }
  };

  // Copy code to clipboard
  const copyCode = () => {
    if (editorRef.current) {
      const selection = editorRef.current.getSelection();
      const text = selection 
        ? editorRef.current.getModel()?.getValueInRange(selection)
        : editorRef.current.getValue();
      
      if (text) {
        navigator.clipboard.writeText(text);
      }
    }
  };

  // Format code
  const formatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument')?.run();
    }
  };

  return (
    <Card className={`border-white/10 bg-black/90 backdrop-blur-sm ${className}`}>
      <CardHeader className="p-0">
        {/* File Tabs */}
        <div className="flex items-center border-b border-white/10 bg-white/5">
          <ScrollArea className="flex-1">
            <div className="flex items-center">
              {openFiles.map((file) => (
                <div
                  key={file.path}
                  className={`group flex items-center gap-2 px-4 py-2 border-r border-white/10 cursor-pointer transition-colors ${
                    activeFile === file.path
                      ? 'bg-white/10 text-white'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                  onClick={() => switchFile(file.path)}
                >
                  <FileText className="h-3 w-3" />
                  <span className="text-sm">
                    {file.path.split('/').pop()}
                  </span>
                  {file.modified && (
                    <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      closeFile(file.path);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Editor Actions */}
          <div className="flex items-center gap-1 px-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={formatCode}
              className="h-7 w-7 p-0"
              title="Format Code"
            >
              <Code className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={copyCode}
              className="h-7 w-7 p-0"
              title="Copy Code"
            >
              <Copy className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setTheme(theme === 'vs-dark' ? 'vs-light' : 'vs-dark')}
              className="h-7 w-7 p-0"
              title="Toggle Theme"
            >
              <Maximize2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Monaco Editor Container */}
        <div 
          ref={containerRef} 
          className="w-full"
          style={{ height: '600px' }}
        />

        {/* Status Bar */}
        <div className="flex items-center justify-between px-4 py-1 bg-white/5 border-t border-white/10 text-xs text-gray-400">
          <div className="flex items-center gap-4">
            {activeFile && (
              <>
                <span>{activeFile}</span>
                <Badge variant="outline" className="text-xs">
                  {openFiles.find(f => f.path === activeFile)?.language}
                </Badge>
              </>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span>UTF-8</span>
            <span>Spaces: 2</span>
            <span>Ln 1, Col 1</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// File Explorer component for selecting files
export function FileExplorer({ 
  projectId, 
  onFileSelect 
}: { 
  projectId: string;
  onFileSelect: (path: string) => void;
}) {
  const [fileTree, setFileTree] = useState<any[]>([]);
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadFileTree();
  }, [projectId]);

  const loadFileTree = async () => {
    try {
      const response = await fetch(
        `/api/visual-intelligence/code?projectId=${projectId}`
      );
      const data = await response.json();
      setFileTree(data.files || []);
    } catch (error) {
      console.error('Failed to load file tree:', error);
    }
  };

  const toggleDir = (path: string) => {
    setExpandedDirs(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const renderTree = (items: any[], level = 0) => {
    return items.map((item) => (
      <div key={item.path} style={{ paddingLeft: `${level * 16}px` }}>
        {item.type === 'directory' ? (
          <>
            <div
              className="flex items-center gap-2 py-1 px-2 hover:bg-white/5 rounded cursor-pointer"
              onClick={() => toggleDir(item.path)}
            >
              <FileText className="h-3 w-3 text-yellow-500" />
              <span className="text-sm">{item.name}</span>
            </div>
            {expandedDirs.has(item.path) && renderTree(item.children, level + 1)}
          </>
        ) : (
          <div
            className="flex items-center gap-2 py-1 px-2 hover:bg-white/5 rounded cursor-pointer"
            onClick={() => onFileSelect(item.path)}
          >
            <FileText className="h-3 w-3 text-blue-500" />
            <span className="text-sm">{item.name}</span>
          </div>
        )}
      </div>
    ));
  };

  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <FileText className="h-4 w-4" />
          File Explorer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px]">
          {renderTree(fileTree)}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}