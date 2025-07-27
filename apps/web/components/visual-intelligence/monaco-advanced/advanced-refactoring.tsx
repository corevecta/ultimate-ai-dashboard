'use client';

import { useState, useEffect } from 'react';
import * as monaco from 'monaco-editor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Wand2,
  Code2,
  FileCode,
  Package,
  Scissors,
  Copy,
  FolderOpen,
  FileInput,
  Variable,
  FunctionSquare,
  Braces,
  ArrowRightLeft,
  Search,
  Replace,
  RefreshCw,
  Sparkles,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface AdvancedRefactoringProps {
  editor: monaco.editor.IStandaloneCodeEditor | null;
  projectId: string;
}

interface RefactoringPreview {
  type: string;
  description: string;
  changes: Array<{
    file: string;
    line: number;
    before: string;
    after: string;
  }>;
}

export function AdvancedRefactoring({ editor, projectId }: AdvancedRefactoringProps) {
  const [selectedText, setSelectedText] = useState('');
  const [renameTarget, setRenameTarget] = useState('');
  const [newName, setNewName] = useState('');
  const [preview, setPreview] = useState<RefactoringPreview | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  useEffect(() => {
    if (!editor) return;
    
    const selectionDisposable = editor.onDidChangeCursorSelection((e) => {
      const selection = editor.getSelection();
      if (selection && !selection.isEmpty()) {
        const text = editor.getModel()?.getValueInRange(selection) || '';
        setSelectedText(text);
      }
    });
    
    // Register refactoring actions
    const extractMethodAction = editor.addAction({
      id: 'refactor.extractMethod',
      label: 'Extract Method',
      keybindings: [
        monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | monaco.KeyCode.KeyM
      ],
      contextMenuGroupId: 'refactoring',
      contextMenuOrder: 1,
      run: () => extractMethod()
    });
    
    const extractVariableAction = editor.addAction({
      id: 'refactor.extractVariable',
      label: 'Extract Variable',
      keybindings: [
        monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | monaco.KeyCode.KeyV
      ],
      contextMenuGroupId: 'refactoring',
      contextMenuOrder: 2,
      run: () => extractVariable()
    });
    
    const renameSymbolAction = editor.addAction({
      id: 'refactor.renameSymbol',
      label: 'Rename Symbol',
      keybindings: [
        monaco.KeyCode.F2
      ],
      contextMenuGroupId: 'refactoring',
      contextMenuOrder: 3,
      run: () => startRename()
    });
    
    return () => {
      selectionDisposable.dispose();
      extractMethodAction.dispose();
      extractVariableAction.dispose();
      renameSymbolAction.dispose();
    };
  }, [editor]);
  
  const extractMethod = async () => {
    if (!editor || !selectedText) return;
    
    setIsProcessing(true);
    const selection = editor.getSelection();
    if (!selection) return;
    
    // Analyze the selected code
    const parameters = analyzeParameters(selectedText);
    const returnType = analyzeReturnType(selectedText);
    
    // Generate method name suggestion
    const methodName = suggestMethodName(selectedText);
    
    // Create preview
    const methodSignature = `function ${methodName}(${parameters.join(', ')})${returnType ? `: ${returnType}` : ''} {`;
    const methodBody = selectedText.split('\n').map(line => '  ' + line).join('\n');
    const methodCall = `${methodName}(${parameters.map(p => p.split(':')[0].trim()).join(', ')})`;
    
    setPreview({
      type: 'Extract Method',
      description: `Extract selected code into a new method "${methodName}"`,
      changes: [
        {
          file: 'current',
          line: selection.startLineNumber,
          before: selectedText,
          after: methodCall
        },
        {
          file: 'current',
          line: selection.startLineNumber - 1,
          before: '',
          after: `${methodSignature}\n${methodBody}\n}\n`
        }
      ]
    });
    
    setIsProcessing(false);
  };
  
  const extractVariable = async () => {
    if (!editor || !selectedText) return;
    
    setIsProcessing(true);
    const selection = editor.getSelection();
    if (!selection) return;
    
    // Analyze expression type
    const expressionType = analyzeExpressionType(selectedText);
    const variableName = suggestVariableName(selectedText);
    
    // Create preview
    setPreview({
      type: 'Extract Variable',
      description: `Extract expression into a new variable "${variableName}"`,
      changes: [
        {
          file: 'current',
          line: selection.startLineNumber,
          before: selectedText,
          after: variableName
        },
        {
          file: 'current',
          line: selection.startLineNumber,
          before: '',
          after: `const ${variableName}${expressionType ? `: ${expressionType}` : ''} = ${selectedText};\n`
        }
      ]
    });
    
    setIsProcessing(false);
  };
  
  const startRename = () => {
    if (!editor) return;
    
    const position = editor.getPosition();
    if (!position) return;
    
    const word = editor.getModel()?.getWordAtPosition(position);
    if (word) {
      setRenameTarget(word.word);
      setNewName(word.word);
    }
  };
  
  const performRename = async () => {
    if (!editor || !renameTarget || !newName) return;
    
    setIsProcessing(true);
    
    // Find all occurrences
    const model = editor.getModel();
    if (!model) return;
    
    const matches = model.findMatches(
      `\\b${renameTarget}\\b`,
      true,
      true,
      false,
      null,
      true
    );
    
    // Create preview
    setPreview({
      type: 'Rename Symbol',
      description: `Rename "${renameTarget}" to "${newName}" (${matches.length} occurrences)`,
      changes: matches.map(match => ({
        file: 'current',
        line: match.range.startLineNumber,
        before: model.getLineContent(match.range.startLineNumber),
        after: model.getLineContent(match.range.startLineNumber).replace(
          new RegExp(`\\b${renameTarget}\\b`, 'g'),
          newName
        )
      }))
    });
    
    setIsProcessing(false);
  };
  
  const applyRefactoring = () => {
    if (!editor || !preview) return;
    
    const model = editor.getModel();
    if (!model) return;
    
    // Apply changes in reverse order to maintain line numbers
    const edits: monaco.editor.IIdentifiedSingleEditOperation[] = preview.changes
      .sort((a, b) => b.line - a.line)
      .map((change, index) => {
        if (change.before === '') {
          // Insert new content
          return {
            range: new monaco.Range(change.line, 1, change.line, 1),
            text: change.after + '\n',
            forceMoveMarkers: true
          };
        } else {
          // Replace existing content
          const line = model.getLineContent(change.line);
          const startCol = line.indexOf(change.before) + 1;
          const endCol = startCol + change.before.length;
          
          return {
            range: new monaco.Range(change.line, startCol, change.line, endCol),
            text: change.after,
            forceMoveMarkers: true
          };
        }
      });
    
    editor.executeEdits('refactoring', edits);
    setPreview(null);
  };
  
  const analyzeParameters = (code: string): string[] => {
    // Simple parameter detection - in real implementation would use AST
    const params: Set<string> = new Set();
    const variableRegex = /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\b/g;
    let match;
    
    while ((match = variableRegex.exec(code)) !== null) {
      const varName = match[1];
      // Check if it's not a keyword and appears to be used as a variable
      if (!['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while'].includes(varName)) {
        params.add(varName);
      }
    }
    
    return Array.from(params).slice(0, 3).map(p => `${p}: any`);
  };
  
  const analyzeReturnType = (code: string): string => {
    if (code.includes('return')) {
      if (code.includes('return true') || code.includes('return false')) return 'boolean';
      if (code.match(/return\s+['"`]/)) return 'string';
      if (code.match(/return\s+\d/)) return 'number';
      return 'any';
    }
    return 'void';
  };
  
  const analyzeExpressionType = (expr: string): string => {
    if (expr.match(/^['"`].*['"`]$/)) return 'string';
    if (expr.match(/^\d+$/)) return 'number';
    if (expr === 'true' || expr === 'false') return 'boolean';
    if (expr.includes('=>') || expr.includes('function')) return 'Function';
    if (expr.startsWith('[')) return 'any[]';
    if (expr.startsWith('{')) return 'object';
    return '';
  };
  
  const suggestMethodName = (code: string): string => {
    // Simple heuristic - in real implementation would use NLP
    if (code.includes('calculate')) return 'calculateResult';
    if (code.includes('validate')) return 'validateInput';
    if (code.includes('fetch')) return 'fetchData';
    if (code.includes('render')) return 'renderComponent';
    if (code.includes('handle')) return 'handleEvent';
    return 'extractedMethod';
  };
  
  const suggestVariableName = (expr: string): string => {
    // Simple heuristic
    if (expr.includes('.length')) return 'length';
    if (expr.includes('.map')) return 'mappedItems';
    if (expr.includes('.filter')) return 'filteredItems';
    if (expr.includes('getElementById')) return 'element';
    if (expr.match(/^\d+$/)) return 'value';
    if (expr.match(/^['"`].*['"`]$/)) return 'text';
    return 'result';
  };
  
  return (
    <Card className="border-white/10 bg-gray-900/90 backdrop-blur-sm">
      <CardHeader className="border-b border-white/10 py-3">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-purple-500" />
          Advanced Refactoring
          {isProcessing && (
            <Badge variant="outline" className="ml-2">
              <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
              Processing
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs defaultValue="quick" className="h-full">
          <TabsList className="w-full rounded-none border-b border-white/10">
            <TabsTrigger value="quick" className="flex-1">
              <Sparkles className="h-3 w-3 mr-1" />
              Quick Actions
            </TabsTrigger>
            <TabsTrigger value="rename" className="flex-1">
              <ArrowRightLeft className="h-3 w-3 mr-1" />
              Rename
            </TabsTrigger>
            <TabsTrigger value="extract" className="flex-1">
              <Scissors className="h-3 w-3 mr-1" />
              Extract
            </TabsTrigger>
            <TabsTrigger value="organize" className="flex-1">
              <Package className="h-3 w-3 mr-1" />
              Organize
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="quick" className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="justify-start"
                onClick={extractMethod}
                disabled={!selectedText}
              >
                <FunctionSquare className="h-3 w-3 mr-2" />
                Extract Method
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="justify-start"
                onClick={extractVariable}
                disabled={!selectedText}
              >
                <Variable className="h-3 w-3 mr-2" />
                Extract Variable
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                <FileInput className="h-3 w-3 mr-2" />
                Move to File
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                <Copy className="h-3 w-3 mr-2" />
                Extract Component
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                <Braces className="h-3 w-3 mr-2" />
                Convert to Async
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                <Code2 className="h-3 w-3 mr-2" />
                Inline Variable
              </Button>
            </div>
            
            {selectedText && (
              <div className="mt-3 p-3 bg-gray-800/50 rounded">
                <p className="text-xs text-gray-400 mb-1">Selected:</p>
                <code className="text-xs text-blue-400">{selectedText.substring(0, 50)}...</code>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="rename" className="p-4 space-y-3">
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400">Symbol to rename</label>
                <Input
                  value={renameTarget}
                  onChange={(e) => setRenameTarget(e.target.value)}
                  placeholder="Enter symbol name"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400">New name</label>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Enter new name"
                  className="mt-1"
                />
              </div>
              <Button 
                onClick={performRename}
                disabled={!renameTarget || !newName || renameTarget === newName}
                className="w-full"
              >
                <Search className="h-3 w-3 mr-2" />
                Find & Preview Changes
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="extract" className="p-4">
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start" onClick={extractMethod}>
                <FunctionSquare className="h-3 w-3 mr-2" />
                Extract to Method
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" onClick={extractVariable}>
                <Variable className="h-3 w-3 mr-2" />
                Extract to Variable
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <FileCode className="h-3 w-3 mr-2" />
                Extract to Component
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Package className="h-3 w-3 mr-2" />
                Extract to Module
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="organize" className="p-4">
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <FolderOpen className="h-3 w-3 mr-2" />
                Organize Imports
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <ArrowRightLeft className="h-3 w-3 mr-2" />
                Sort Members
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Replace className="h-3 w-3 mr-2" />
                Remove Unused Code
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <RefreshCw className="h-3 w-3 mr-2" />
                Convert to ES6
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        {preview && (
          <div className="border-t border-white/10 p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                Refactoring Preview
              </h4>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setPreview(null)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={applyRefactoring} className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Apply
                </Button>
              </div>
            </div>
            
            <div className="space-y-2 max-h-48 overflow-y-auto">
              <p className="text-xs text-gray-400">{preview.description}</p>
              {preview.changes.map((change, index) => (
                <div key={index} className="bg-gray-800/50 rounded p-2 text-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gray-500">Line {change.line}</span>
                  </div>
                  {change.before && (
                    <div className="text-red-400 line-through mb-1">- {change.before}</div>
                  )}
                  <div className="text-green-400">+ {change.after}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}