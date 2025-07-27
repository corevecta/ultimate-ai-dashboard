'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import {
  FolderOpen,
  Folder,
  FileText,
  FileCode,
  FileJson,
  Image,
  Film,
  Music,
  Archive,
  ChevronRight,
  ChevronDown,
  Plus,
  Search,
  RefreshCw,
  Upload,
  Download,
  Trash2,
  Edit,
  Copy,
  Scissors,
  Clipboard,
  FolderPlus,
  FilePlus
} from 'lucide-react';

interface FileExplorerProps {
  projectId: string;
  onFileSelect: (file: { path: string; content: string; language: string }) => void;
}

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileNode[];
  size?: number;
  modified?: Date;
  language?: string;
  content?: string;
}

export function FileExplorer({ projectId, onFileSelect }: FileExplorerProps) {
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Mock file tree
  useEffect(() => {
    const mockFileTree: FileNode[] = [
      {
        id: '1',
        name: 'src',
        type: 'folder',
        path: '/src',
        children: [
          {
            id: '2',
            name: 'components',
            type: 'folder',
            path: '/src/components',
            children: [
              {
                id: '3',
                name: 'Header.tsx',
                type: 'file',
                path: '/src/components/Header.tsx',
                language: 'typescript',
                content: `export function Header() {
  return (
    <header className="header">
      <h1>My App</h1>
    </header>
  );
}`
              },
              {
                id: '4',
                name: 'Footer.tsx',
                type: 'file',
                path: '/src/components/Footer.tsx',
                language: 'typescript',
                content: `export function Footer() {
  return (
    <footer className="footer">
      <p>&copy; 2024 My App</p>
    </footer>
  );
}`
              }
            ]
          },
          {
            id: '5',
            name: 'App.tsx',
            type: 'file',
            path: '/src/App.tsx',
            language: 'typescript',
            content: `import React from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <h2>Welcome to My App</h2>
      </main>
      <Footer />
    </div>
  );
}

export default App;`
          },
          {
            id: '6',
            name: 'index.tsx',
            type: 'file',
            path: '/src/index.tsx',
            language: 'typescript',
            content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`
          },
          {
            id: '7',
            name: 'index.css',
            type: 'file',
            path: '/src/index.css',
            language: 'css',
            content: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}`
          }
        ]
      },
      {
        id: '8',
        name: 'public',
        type: 'folder',
        path: '/public',
        children: [
          {
            id: '9',
            name: 'index.html',
            type: 'file',
            path: '/public/index.html',
            language: 'html',
            content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>My App</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>`
          }
        ]
      },
      {
        id: '10',
        name: 'package.json',
        type: 'file',
        path: '/package.json',
        language: 'json',
        content: `{
  "name": "my-app",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.0.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test"
  }
}`
      },
      {
        id: '11',
        name: 'README.md',
        type: 'file',
        path: '/README.md',
        language: 'markdown',
        content: `# My App

A modern web application built with React and TypeScript.

## Getting Started

\`\`\`bash
npm install
npm start
\`\`\`

## Features

- React 18
- TypeScript
- Modern UI`
      }
    ];

    setFileTree(mockFileTree);
    // Auto-expand src folder
    setExpandedFolders(new Set(['/src', '/src/components']));
  }, [projectId]);

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

  const getFileIcon = (node: FileNode) => {
    if (node.type === 'folder') {
      return expandedFolders.has(node.path) ? (
        <FolderOpen className="h-4 w-4 text-yellow-500" />
      ) : (
        <Folder className="h-4 w-4 text-yellow-500" />
      );
    }

    const ext = node.name.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'ts':
      case 'tsx':
      case 'js':
      case 'jsx':
        return <FileCode className="h-4 w-4 text-blue-400" />;
      case 'json':
        return <FileJson className="h-4 w-4 text-yellow-400" />;
      case 'css':
      case 'scss':
      case 'less':
        return <FileText className="h-4 w-4 text-purple-400" />;
      case 'html':
        return <FileText className="h-4 w-4 text-orange-400" />;
      case 'md':
        return <FileText className="h-4 w-4 text-gray-400" />;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'svg':
        return <Image className="h-4 w-4 text-green-400" />;
      case 'mp4':
      case 'webm':
        return <Film className="h-4 w-4 text-red-400" />;
      case 'mp3':
      case 'wav':
        return <Music className="h-4 w-4 text-pink-400" />;
      case 'zip':
      case 'tar':
      case 'gz':
        return <Archive className="h-4 w-4 text-gray-400" />;
      default:
        return <FileText className="h-4 w-4 text-gray-400" />;
    }
  };

  const getLanguageFromExtension = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const languageMap: Record<string, string> = {
      'ts': 'typescript',
      'tsx': 'typescript',
      'js': 'javascript',
      'jsx': 'javascript',
      'json': 'json',
      'css': 'css',
      'scss': 'scss',
      'less': 'less',
      'html': 'html',
      'xml': 'xml',
      'md': 'markdown',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'cs': 'csharp',
      'go': 'go',
      'rs': 'rust',
      'php': 'php',
      'rb': 'ruby',
      'swift': 'swift',
      'kt': 'kotlin',
      'yaml': 'yaml',
      'yml': 'yaml',
      'toml': 'toml',
      'sql': 'sql',
      'sh': 'shell',
      'bash': 'shell',
      'dockerfile': 'dockerfile',
    };
    return languageMap[ext || ''] || 'plaintext';
  };

  const handleFileClick = (node: FileNode) => {
    if (node.type === 'folder') {
      toggleFolder(node.path);
    } else {
      setSelectedFile(node.path);
      onFileSelect({
        path: node.path,
        content: node.content || '',
        language: node.language || getLanguageFromExtension(node.name)
      });
    }
  };

  const filterNodes = (nodes: FileNode[], query: string): FileNode[] => {
    if (!query) return nodes;
    
    return nodes.reduce((acc: FileNode[], node) => {
      if (node.name.toLowerCase().includes(query.toLowerCase())) {
        acc.push(node);
      } else if (node.children) {
        const filteredChildren = filterNodes(node.children, query);
        if (filteredChildren.length > 0) {
          acc.push({
            ...node,
            children: filteredChildren
          });
        }
      }
      return acc;
    }, []);
  };

  const renderTree = (nodes: FileNode[], level = 0) => {
    const filteredNodes = filterNodes(nodes, searchQuery);
    
    return filteredNodes.map(node => (
      <div key={node.id}>
        <ContextMenu>
          <ContextMenuTrigger>
            <div
              className={`flex items-center gap-2 py-1 px-2 cursor-pointer hover:bg-white/5 rounded text-sm ${
                selectedFile === node.path ? 'bg-blue-500/20 text-blue-400' : ''
              }`}
              style={{ paddingLeft: `${level * 20 + 8}px` }}
              onClick={() => handleFileClick(node)}
            >
              {node.type === 'folder' && (
                <div className="w-4 h-4 flex items-center justify-center">
                  {expandedFolders.has(node.path) ? (
                    <ChevronDown className="h-3 w-3 text-gray-400" />
                  ) : (
                    <ChevronRight className="h-3 w-3 text-gray-400" />
                  )}
                </div>
              )}
              {getFileIcon(node)}
              <span className="flex-1">{node.name}</span>
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>
              <Edit className="h-4 w-4 mr-2" />
              Rename
            </ContextMenuItem>
            <ContextMenuItem>
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </ContextMenuItem>
            <ContextMenuItem>
              <Scissors className="h-4 w-4 mr-2" />
              Cut
            </ContextMenuItem>
            <ContextMenuItem>
              <Clipboard className="h-4 w-4 mr-2" />
              Paste
            </ContextMenuItem>
            <ContextMenuItem>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
        {node.type === 'folder' && node.children && expandedFolders.has(node.path) && (
          <div>{renderTree(node.children, level + 1)}</div>
        )}
      </div>
    ));
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      <CardHeader className="border-b border-white/10 p-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Explorer</CardTitle>
          <div className="flex items-center gap-1">
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
              <FilePlus className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
              <FolderPlus className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
              <RefreshCw className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
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
      
      <ScrollArea className="flex-1">
        <div className="p-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-5 w-5 animate-spin text-gray-400" />
            </div>
          ) : fileTree.length > 0 ? (
            renderTree(fileTree)
          ) : (
            <div className="text-center py-8 text-gray-400 text-sm">
              <p>No files found</p>
              <Button
                size="sm"
                variant="outline"
                className="mt-2 text-xs"
                onClick={() => {
                  // Handle file upload
                  console.log('Upload files');
                }}
              >
                <Upload className="h-3 w-3 mr-1" />
                Upload Files
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}