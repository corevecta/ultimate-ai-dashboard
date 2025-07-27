'use client';

import { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Lightbulb, 
  Package, 
  FileType, 
  Code2,
  Sparkles,
  Import,
  FileSearch,
  Braces
} from 'lucide-react';

interface AdvancedIntelliSenseProps {
  editor: monaco.editor.IStandaloneCodeEditor | null;
  projectId: string;
}

export function AdvancedIntelliSense({ editor, projectId }: AdvancedIntelliSenseProps) {
  const providersRef = useRef<monaco.IDisposable[]>([]);
  
  useEffect(() => {
    if (!editor) return;
    
    // Clean up previous providers
    providersRef.current.forEach(provider => provider.dispose());
    providersRef.current = [];
    
    // Enhanced Completion Item Provider with AI
    const completionProvider = monaco.languages.registerCompletionItemProvider(['typescript', 'javascript', 'typescriptreact', 'javascriptreact'], {
      triggerCharacters: ['.', '"', "'", '/', '@', '<', ' '],
      provideCompletionItems: async (model, position, context, token) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn
        };
        
        const lineContent = model.getLineContent(position.lineNumber);
        const textBeforeCursor = lineContent.substring(0, position.column - 1);
        
        const suggestions: monaco.languages.CompletionItem[] = [];
        
        // Smart Import Suggestions
        if (textBeforeCursor.match(/import\s+.*\s+from\s+['"]/)) {
          suggestions.push(
            {
              label: 'react',
              kind: monaco.languages.CompletionItemKind.Module,
              insertText: 'react',
              detail: 'React - A JavaScript library for building user interfaces',
              documentation: 'Import React library',
              range,
              sortText: '0001'
            },
            {
              label: 'next/router',
              kind: monaco.languages.CompletionItemKind.Module,
              insertText: 'next/router',
              detail: 'Next.js Router',
              documentation: 'Import Next.js routing utilities',
              range,
              sortText: '0002'
            },
            {
              label: '@/components/',
              kind: monaco.languages.CompletionItemKind.Folder,
              insertText: '@/components/',
              detail: 'Local components directory',
              documentation: 'Import from components folder',
              range,
              sortText: '0003'
            }
          );
        }
        
        // AI-Powered Code Suggestions
        if (context.triggerCharacter === ' ' || !context.triggerCharacter) {
          const contextLines = model.getValueInRange({
            startLineNumber: Math.max(1, position.lineNumber - 5),
            startColumn: 1,
            endLineNumber: position.lineNumber,
            endColumn: position.column
          });
          
          // Simulate AI suggestions based on context
          if (contextLines.includes('useState')) {
            suggestions.push({
              label: 'const [value, setValue] = useState()',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: 'const [${1:value}, set${1/(.*)/${1:/capitalize}/}] = useState(${2:initialValue})$0',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: 'React State Hook',
              documentation: 'Create a new state variable with setter',
              range,
              sortText: '0001',
              preselect: true
            });
          }
          
          if (contextLines.includes('useEffect')) {
            suggestions.push({
              label: 'useEffect(() => {}, [])',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: 'useEffect(() => {\n\t${1:// Effect logic}\n\treturn () => {\n\t\t${2:// Cleanup}\n\t};\n}, [${3:dependencies}]);',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: 'React Effect Hook',
              documentation: 'Create a new effect with cleanup',
              range,
              sortText: '0001'
            });
          }
        }
        
        // JSDoc Suggestions
        if (textBeforeCursor.trim() === '/**') {
          const nextLine = position.lineNumber < model.getLineCount() 
            ? model.getLineContent(position.lineNumber + 1).trim()
            : '';
            
          if (nextLine.startsWith('function') || nextLine.startsWith('const') || nextLine.startsWith('export')) {
            suggestions.push({
              label: 'JSDoc Function Documentation',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: [
                '',
                ' * ${1:Brief description}',
                ' * ',
                ' * @param {${2:type}} ${3:paramName} - ${4:Parameter description}',
                ' * @returns {${5:type}} ${6:Return description}',
                ' * @example',
                ' * ${7:// Example usage}',
                ' */'
              ].join('\n'),
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: 'Generate JSDoc documentation',
              documentation: 'Create comprehensive function documentation',
              range,
              sortText: '0001'
            });
          }
        }
        
        // Type Definition Suggestions
        if (textBeforeCursor.includes('interface') || textBeforeCursor.includes('type')) {
          suggestions.push(
            {
              label: 'React.FC',
              kind: monaco.languages.CompletionItemKind.Interface,
              insertText: 'React.FC<${1:Props}>',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: 'React Function Component Type',
              documentation: 'Type for React functional components',
              range,
              sortText: '0001'
            },
            {
              label: 'HTMLAttributes',
              kind: monaco.languages.CompletionItemKind.Interface,
              insertText: 'React.HTMLAttributes<${1:HTMLDivElement}>',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: 'HTML Element Attributes',
              documentation: 'Type for HTML element attributes',
              range,
              sortText: '0002'
            }
          );
        }
        
        // Smart Component Suggestions
        if (textBeforeCursor.includes('<')) {
          const availableComponents = [
            { name: 'Button', props: 'onClick variant size' },
            { name: 'Card', props: 'className' },
            { name: 'Dialog', props: 'open onOpenChange' },
            { name: 'Input', props: 'value onChange placeholder' },
            { name: 'Select', props: 'value onValueChange' }
          ];
          
          availableComponents.forEach((comp, index) => {
            suggestions.push({
              label: comp.name,
              kind: monaco.languages.CompletionItemKind.Class,
              insertText: `${comp.name} ${comp.props.split(' ').map(p => `${p}={$${p}}`).join(' ')}`,
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: `UI Component`,
              documentation: `Insert ${comp.name} component with common props`,
              range,
              sortText: `000${index + 1}`
            });
          });
        }
        
        return { suggestions };
      }
    });
    
    // Hover Provider with Rich Documentation
    const hoverProvider = monaco.languages.registerHoverProvider(['typescript', 'javascript', 'typescriptreact', 'javascriptreact'], {
      provideHover: async (model, position) => {
        const word = model.getWordAtPosition(position);
        if (!word) return null;
        
        // Simulate type information and documentation
        const hoverContent: monaco.IMarkdownString[] = [];
        
        if (['useState', 'useEffect', 'useCallback', 'useMemo'].includes(word.word)) {
          hoverContent.push({
            value: `\`\`\`typescript
function ${word.word}<T>(initialValue: T): [T, Dispatch<SetStateAction<T>>]
\`\`\``,
            isTrusted: true
          });
          
          hoverContent.push({
            value: `**React Hook: ${word.word}**\n\n${getHookDocumentation(word.word)}`,
            isTrusted: true
          });
        }
        
        if (word.word === 'console') {
          hoverContent.push({
            value: `\`\`\`typescript
interface Console {
  log(...data: any[]): void;
  error(...data: any[]): void;
  warn(...data: any[]): void;
  // ... more methods
}
\`\`\``,
            isTrusted: true
          });
        }
        
        return {
          contents: hoverContent,
          range: new monaco.Range(
            position.lineNumber,
            word.startColumn,
            position.lineNumber,
            word.endColumn
          )
        };
      }
    });
    
    // Definition Provider
    const definitionProvider = monaco.languages.registerDefinitionProvider(['typescript', 'javascript', 'typescriptreact', 'javascriptreact'], {
      provideDefinition: async (model, position) => {
        const word = model.getWordAtPosition(position);
        if (!word) return null;
        
        // Search for definition in current file
        const matches = model.findMatches(
          `(function|const|let|var|class|interface|type)\\s+${word.word}`,
          true,
          true,
          false,
          null,
          true
        );
        
        if (matches.length > 0) {
          return matches.map(match => ({
            uri: model.uri,
            range: match.range
          }));
        }
        
        return null;
      }
    });
    
    // Reference Provider
    const referenceProvider = monaco.languages.registerReferenceProvider(['typescript', 'javascript', 'typescriptreact', 'javascriptreact'], {
      provideReferences: async (model, position, context) => {
        const word = model.getWordAtPosition(position);
        if (!word) return null;
        
        const matches = model.findMatches(
          word.word,
          true,
          false,
          false,
          null,
          true
        );
        
        return matches.map(match => ({
          uri: model.uri,
          range: match.range
        }));
      }
    });
    
    // Quick Fix Provider
    const codeActionProvider = monaco.languages.registerCodeActionProvider(['typescript', 'javascript', 'typescriptreact', 'javascriptreact'], {
      provideCodeActions: (model, range, context) => {
        const actions: monaco.languages.CodeAction[] = [];
        
        // Check for missing imports
        const text = model.getValueInRange(range);
        
        if (context.markers.some(marker => marker.message.includes('Cannot find name'))) {
          actions.push({
            title: '✨ Add import statement',
            kind: 'quickfix',
            edit: {
              edits: [{
                resource: model.uri,
                textEdit: {
                  range: new monaco.Range(1, 1, 1, 1),
                  text: `import { ${text} } from '@/components';\n`
                },
                versionId: undefined
              }]
            },
            isPreferred: true
          });
        }
        
        // Convert to async function
        if (text.includes('function') && !text.includes('async')) {
          actions.push({
            title: '⚡ Convert to async function',
            kind: 'refactor',
            edit: {
              edits: [{
                resource: model.uri,
                textEdit: {
                  range,
                  text: text.replace('function', 'async function')
                },
                versionId: undefined
              }]
            }
          });
        }
        
        return { actions, dispose: () => {} };
      }
    });
    
    providersRef.current = [
      completionProvider,
      hoverProvider,
      definitionProvider,
      referenceProvider,
      codeActionProvider
    ];
    
    // Configure language defaults
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
      onlyVisible: false
    });
    
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.Latest,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      allowJs: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      reactNamespace: 'React',
      typeRoots: ['node_modules/@types']
    });
    
    return () => {
      providersRef.current.forEach(provider => provider.dispose());
    };
  }, [editor, projectId]);
  
  const getHookDocumentation = (hookName: string): string => {
    const docs: Record<string, string> = {
      useState: 'Returns a stateful value, and a function to update it.\n\nDuring the initial render, the returned state is the same as the value passed as the first argument.',
      useEffect: 'Accepts a function that contains imperative, possibly effectful code.\n\nMutations, subscriptions, timers, logging, and other side effects are not allowed inside the main body of a function component.',
      useCallback: 'Returns a memoized callback.\n\nPass an inline callback and an array of dependencies. useCallback will return a memoized version of the callback that only changes if one of the dependencies has changed.',
      useMemo: 'Returns a memoized value.\n\nPass a "create" function and an array of dependencies. useMemo will only recompute the memoized value when one of the dependencies has changed.'
    };
    return docs[hookName] || '';
  };
  
  return (
    <div className="p-4 bg-gray-900/50 rounded-lg space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-yellow-500" />
          IntelliSense Enhanced
        </h3>
        <Badge variant="outline" className="text-xs">
          AI-Powered
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-xs">
        <Button variant="ghost" size="sm" className="justify-start">
          <Lightbulb className="h-3 w-3 mr-2" />
          Smart Suggestions
        </Button>
        <Button variant="ghost" size="sm" className="justify-start">
          <Import className="h-3 w-3 mr-2" />
          Auto Imports
        </Button>
        <Button variant="ghost" size="sm" className="justify-start">
          <FileType className="h-3 w-3 mr-2" />
          Type Definitions
        </Button>
        <Button variant="ghost" size="sm" className="justify-start">
          <Braces className="h-3 w-3 mr-2" />
          JSDoc Support
        </Button>
      </div>
    </div>
  );
}