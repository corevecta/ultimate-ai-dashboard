'use client';

import { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  FileText,
  Copy,
  Download,
  Maximize2,
  Code,
  Package,
  FolderOpen,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { useState } from 'react';

interface SimpleMonacoEditorProps {
  projectId: string;
  className?: string;
}

export function SimpleMonacoEditor({ projectId, className }: SimpleMonacoEditorProps) {
  const [code, setCode] = useState(`// Welcome to Visual Code Intelligence
// Select a file from the explorer to view its content

function example() {
  console.log('Hello from Ultimate AI Dashboard!');
  
  // This is where your project code will appear
  // with full syntax highlighting and IntelliSense
}

export default example;`);

  const [fileName, setFileName] = useState('welcome.js');
  const [language, setLanguage] = useState('javascript');

  const handleEditorChange = (value: string | undefined) => {
    if (value) setCode(value);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
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
  };

  return (
    <Card className={`border-white/10 bg-gray-900/90 backdrop-blur-sm ${className}`}>
      <CardHeader className="border-b border-white/10 p-0">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-3">
            <FileText className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium">{fileName}</span>
            <Badge variant="outline" className="text-xs">
              {language}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={copyCode}
              className="h-7 px-2"
            >
              <Copy className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-2"
            >
              <Download className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-2"
            >
              <Maximize2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Editor
          height="600px"
          defaultLanguage={language}
          value={code}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={editorOptions}
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
          }}
          onMount={(editor, monaco) => {
            // Apply custom theme
            monaco.editor.setTheme('ultimate-dark');
          }}
        />
      </CardContent>
    </Card>
  );
}

// Simple File Explorer
export function SimpleFileExplorer({ 
  projectId, 
  onFileSelect 
}: { 
  projectId: string;
  onFileSelect: (path: string, content: string, language: string) => void;
}) {
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set(['src', 'src/components']));

  // Mock file tree
  const fileTree = {
    'src': {
      type: 'folder',
      children: {
        'App.tsx': { type: 'file', language: 'typescript', content: `import React from 'react';
import { FormatEngine } from './services/formatting';
import { DocumentEditor } from './components/DocumentEditor';

export default function App() {
  const [document, setDocument] = useState(null);
  
  const handleFormat = async (file) => {
    const formatted = await FormatEngine.process(file);
    setDocument(formatted);
  };
  
  return (
    <div className="app">
      <Header />
      <DocumentEditor 
        document={document}
        onFormat={handleFormat}
      />
      <PreviewPane document={document} />
    </div>
  );
}` },
        'index.tsx': { type: 'file', language: 'typescript', content: `import React from 'react';
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
);` },
        'components': {
          type: 'folder',
          children: {
            'DocumentEditor.tsx': { type: 'file', language: 'typescript', content: `export function DocumentEditor({ document, onFormat }) {
  return (
    <div className="editor">
      <h2>Document Editor</h2>
      {/* Editor implementation */}
    </div>
  );
}` },
            'Header.tsx': { type: 'file', language: 'typescript', content: `export function Header() {
  return (
    <header className="header">
      <h1>Academic Paper Formatter</h1>
    </header>
  );
}` },
          }
        },
        'services': {
          type: 'folder',
          children: {
            'formatting.ts': { type: 'file', language: 'typescript', content: `export class FormatEngine {
  static async process(file: File) {
    // Formatting logic here
    return processedDocument;
  }
}` }
          }
        }
      }
    },
    'package.json': { type: 'file', language: 'json', content: `{
  "name": "academic-paper-formatter",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.0.0"
  }
}` },
    'README.md': { type: 'file', language: 'markdown', content: `# Academic Paper Formatter

A powerful tool for formatting academic papers according to various citation styles.

## Features
- APA, MLA, Chicago style support
- Real-time preview
- Export to multiple formats
` }
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

  const renderTree = (tree: any, path: string = '') => {
    return Object.entries(tree).map(([name, node]: [string, any]) => {
      const fullPath = path ? `${path}/${name}` : name;
      
      if (node.type === 'folder') {
        const isExpanded = expandedDirs.has(fullPath);
        return (
          <div key={fullPath}>
            <div
              className="flex items-center gap-2 py-1 px-2 hover:bg-white/5 rounded cursor-pointer"
              onClick={() => toggleDir(fullPath)}
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3 text-gray-500" />
              ) : (
                <ChevronRight className="h-3 w-3 text-gray-500" />
              )}
              <FolderOpen className="h-3 w-3 text-yellow-500" />
              <span className="text-sm">{name}</span>
            </div>
            {isExpanded && node.children && (
              <div className="pl-4">
                {renderTree(node.children, fullPath)}
              </div>
            )}
          </div>
        );
      } else {
        return (
          <div
            key={fullPath}
            className="flex items-center gap-2 py-1 px-2 pl-6 hover:bg-white/5 rounded cursor-pointer"
            onClick={() => onFileSelect(fullPath, node.content, node.language)}
          >
            <FileText className="h-3 w-3 text-blue-500" />
            <span className="text-sm">{name}</span>
          </div>
        );
      }
    });
  };

  return (
    <Card className="border-white/10 bg-gray-900/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Code className="h-5 w-5 text-blue-500" />
          File Explorer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <div className="font-mono text-xs">
            {renderTree(fileTree)}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}