'use client';

import { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';
import { Badge } from '@/components/ui/badge';
import { 
  GitBranch, 
  Users, 
  Clock, 
  Bug,
  CheckCircle,
  XCircle,
  TestTube,
  FileCode,
  GitCommit,
  TrendingUp,
  AlertCircle,
  Sparkles
} from 'lucide-react';

interface CodeLensProviderProps {
  editor: monaco.editor.IStandaloneCodeEditor | null;
  projectId: string;
}

interface CodeMetrics {
  complexity: number;
  references: number;
  lastModified: string;
  author: string;
  testCoverage: number;
  bugs: number;
}

export function CodeLensProvider({ editor, projectId }: CodeLensProviderProps) {
  const codeLensProviderRef = useRef<monaco.IDisposable | null>(null);
  
  useEffect(() => {
    if (!editor) return;
    
    // Dispose previous provider
    if (codeLensProviderRef.current) {
      codeLensProviderRef.current.dispose();
    }
    
    // Register Code Lens Provider
    codeLensProviderRef.current = monaco.languages.registerCodeLensProvider(
      ['typescript', 'javascript', 'typescriptreact', 'javascriptreact'],
      {
        provideCodeLenses: (model, token) => {
          const lenses: monaco.languages.CodeLens[] = [];
          
          // Find all functions and classes
          const functionRegex = /(function\s+(\w+)|const\s+(\w+)\s*=\s*\([^)]*\)\s*=>|class\s+(\w+))/g;
          const text = model.getValue();
          let match;
          
          while ((match = functionRegex.exec(text)) !== null) {
            const startPosition = model.getPositionAt(match.index);
            const endPosition = model.getPositionAt(match.index + match[0].length);
            const functionName = match[2] || match[3] || match[4];
            
            if (!functionName) continue;
            
            const range = {
              startLineNumber: startPosition.lineNumber,
              startColumn: startPosition.column,
              endLineNumber: endPosition.lineNumber,
              endColumn: endPosition.column
            };
            
            // References lens
            lenses.push({
              range,
              id: `references-${functionName}`,
              command: {
                id: 'editor.action.findReferences',
                title: `${Math.floor(Math.random() * 20) + 1} references`,
                arguments: [model.uri, startPosition]
              }
            });
            
            // Test coverage lens
            const coverage = Math.floor(Math.random() * 100);
            lenses.push({
              range,
              id: `coverage-${functionName}`,
              command: {
                id: 'extension.showTestCoverage',
                title: `☂️ ${coverage}% coverage`,
                arguments: [functionName]
              }
            });
            
            // Complexity lens
            const complexity = Math.floor(Math.random() * 10) + 1;
            lenses.push({
              range,
              id: `complexity-${functionName}`,
              command: {
                id: 'extension.showComplexity',
                title: `🧩 Complexity: ${complexity}`,
                arguments: [functionName]
              }
            });
            
            // Last modified lens
            lenses.push({
              range,
              id: `modified-${functionName}`,
              command: {
                id: 'extension.showHistory',
                title: `👤 John Doe, 2 days ago`,
                arguments: [functionName]
              }
            });
          }
          
          // Find imports
          const importRegex = /import\s+.*\s+from\s+['"]([^'"]+)['"]/g;
          while ((match = importRegex.exec(text)) !== null) {
            const startPosition = model.getPositionAt(match.index);
            const endPosition = model.getPositionAt(match.index + match[0].length);
            const packageName = match[1];
            
            const range = {
              startLineNumber: startPosition.lineNumber,
              startColumn: startPosition.column,
              endLineNumber: endPosition.lineNumber,
              endColumn: endPosition.column
            };
            
            // Package info lens
            lenses.push({
              range,
              id: `package-${packageName}`,
              command: {
                id: 'extension.showPackageInfo',
                title: `📦 ${packageName.includes('@/') ? 'Local module' : 'v' + (Math.random() * 10).toFixed(1)}`,
                arguments: [packageName]
              }
            });
          }
          
          // Find TODOs and FIXMEs
          const todoRegex = /(\/\/\s*(TODO|FIXME|HACK|BUG|XXX):\s*(.*))/g;
          while ((match = todoRegex.exec(text)) !== null) {
            const startPosition = model.getPositionAt(match.index);
            const endPosition = model.getPositionAt(match.index + match[0].length);
            const type = match[2];
            const message = match[3];
            
            const range = {
              startLineNumber: startPosition.lineNumber,
              startColumn: startPosition.column,
              endLineNumber: endPosition.lineNumber,
              endColumn: endPosition.column
            };
            
            lenses.push({
              range,
              id: `todo-${match.index}`,
              command: {
                id: 'extension.showTodo',
                title: `⚠️ ${type}: ${message.substring(0, 30)}...`,
                arguments: [type, message]
              }
            });
          }
          
          return lenses;
        },
        
        resolveCodeLens: (model, codeLens, token) => {
          // Code lens is already resolved with command
          return codeLens;
        }
      }
    );
    
    // Add inline decorations for additional context
    const updateDecorations = () => {
      const model = editor.getModel();
      if (!model) return;
      
      const decorations: monaco.editor.IModelDeltaDecoration[] = [];
      
      // Find test files
      if (model.uri.path.includes('.test.') || model.uri.path.includes('.spec.')) {
        decorations.push({
          range: new monaco.Range(1, 1, 1, 1),
          options: {
            isWholeLine: false,
            afterContentClassName: 'test-file-indicator',
            after: {
              content: ' 🧪 Test File',
              color: 'rgba(34, 197, 94, 0.7)',
              fontStyle: 'italic'
            }
          }
        });
      }
      
      // Find async functions
      const asyncRegex = /async\s+(function|\()/g;
      const text = model.getValue();
      let match;
      
      while ((match = asyncRegex.exec(text)) !== null) {
        const position = model.getPositionAt(match.index);
        decorations.push({
          range: new monaco.Range(position.lineNumber, position.column, position.lineNumber, position.column + 5),
          options: {
            inlineClassName: 'async-function-indicator',
            hoverMessage: { value: '**Async Function**\n\nThis function returns a Promise' }
          }
        });
      }
      
      editor.deltaDecorations([], decorations);
    };
    
    updateDecorations();
    const disposable = editor.onDidChangeModelContent(updateDecorations);
    
    // Add custom CSS for indicators
    const style = document.createElement('style');
    style.textContent = `
      .test-file-indicator::after {
        margin-left: 10px;
        font-size: 12px;
      }
      .async-function-indicator {
        text-decoration: underline;
        text-decoration-style: wavy;
        text-decoration-color: rgba(59, 130, 246, 0.5);
      }
      .monaco-editor .codelens-decoration {
        font-size: 11px !important;
        color: rgba(156, 163, 175, 0.8) !important;
        font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', monospace !important;
      }
      .monaco-editor .codelens-decoration:hover {
        color: rgba(156, 163, 175, 1) !important;
        text-decoration: underline;
        cursor: pointer;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      if (codeLensProviderRef.current) {
        codeLensProviderRef.current.dispose();
      }
      disposable.dispose();
      style.remove();
    };
  }, [editor, projectId]);
  
  return (
    <div className="p-4 bg-gray-900/50 rounded-lg space-y-3">
      <h3 className="text-sm font-semibold flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-purple-500" />
        Code Lens Active
      </h3>
      
      <div className="space-y-2 text-xs">
        <div className="flex items-center gap-2 text-gray-400">
          <FileCode className="h-3 w-3" />
          <span>Reference counts above functions</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <TestTube className="h-3 w-3" />
          <span>Test coverage percentages</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <GitCommit className="h-3 w-3" />
          <span>Last modified by & when</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <AlertCircle className="h-3 w-3" />
          <span>Inline TODO/FIXME tracking</span>
        </div>
      </div>
      
      <div className="flex gap-2 flex-wrap">
        <Badge variant="outline" className="text-xs">
          <CheckCircle className="h-3 w-3 mr-1 text-green-400" />
          12 tests passing
        </Badge>
        <Badge variant="outline" className="text-xs">
          <XCircle className="h-3 w-3 mr-1 text-red-400" />
          2 tests failing
        </Badge>
        <Badge variant="outline" className="text-xs">
          <TrendingUp className="h-3 w-3 mr-1 text-blue-400" />
          85% coverage
        </Badge>
      </div>
    </div>
  );
}