import * as monaco from 'monaco-editor';

export class LSPClient {
  private monaco: typeof monaco;
  private disposables: monaco.IDisposable[] = [];

  constructor(monacoInstance: typeof monaco) {
    this.monaco = monacoInstance;
    this.initialize();
  }

  initialize() {

    // Register completion provider for AI suggestions
    this.registerAICompletionProvider();
    
    // Register hover provider for AI explanations
    this.registerAIHoverProvider();
    
    // Register code actions for refactoring
    this.registerAICodeActionProvider();
  }

  async connectLanguageServer(language: string, serverUrl: string) {
    // Placeholder for language server connection
    // In production, implement actual LSP connection
    console.log(`Connecting to ${language} language server at ${serverUrl}`);
  }

  private registerAICompletionProvider() {
    // Register for all languages
    const provider = this.monaco.languages.registerCompletionItemProvider('*', {
      triggerCharacters: ['.', '(', '"', "'", '{', '[', ' '],
      
      provideCompletionItems: async (model, position, context, token) => {
        const textUntilPosition = model.getValueInRange({
          startLineNumber: 1,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column
        });
        
        // Get AI suggestions based on context
        const suggestions = await this.getAISuggestions(textUntilPosition, model.getLanguageId());
        
        return {
          suggestions: suggestions.map((suggestion, index) => ({
            label: suggestion.label,
            kind: this.monaco.languages.CompletionItemKind[suggestion.kind as keyof typeof monaco.languages.CompletionItemKind],
            detail: suggestion.detail,
            documentation: {
              value: suggestion.documentation,
              isTrusted: true
            },
            insertText: suggestion.insertText,
            insertTextRules: this.monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: {
              startLineNumber: position.lineNumber,
              startColumn: position.column,
              endLineNumber: position.lineNumber,
              endColumn: position.column
            },
            sortText: String(index).padStart(5, '0'),
            command: suggestion.command
          }))
        };
      }
    });
    
    this.disposables.push(provider);
  }

  private registerAIHoverProvider() {
    const provider = this.monaco.languages.registerHoverProvider('*', {
      provideHover: async (model, position, token) => {
        const word = model.getWordAtPosition(position);
        if (!word) return null;
        
        const line = model.getLineContent(position.lineNumber);
        const explanation = await this.getAIExplanation(word.word, line, model.getLanguageId());
        
        if (!explanation) return null;
        
        return {
          contents: [
            {
              value: explanation,
              isTrusted: true
            }
          ],
          range: new this.monaco.Range(
            position.lineNumber,
            word.startColumn,
            position.lineNumber,
            word.endColumn
          )
        };
      }
    });
    
    this.disposables.push(provider);
  }

  private registerAICodeActionProvider() {
    const provider = this.monaco.languages.registerCodeActionProvider('*', {
      provideCodeActions: async (model, range, context, token) => {
        const selectedText = model.getValueInRange(range);
        if (!selectedText) return { actions: [], dispose: () => {} };
        
        const codeActions = await this.getAICodeActions(selectedText, model.getLanguageId());
        
        return {
          actions: codeActions.map(action => ({
            title: action.title,
            kind: action.kind,
            diagnostics: [],
            edit: {
              edits: [{
                resource: model.uri,
                textEdit: {
                  range: range,
                  text: action.newText
                },
                versionId: model.getVersionId()
              }]
            },
            isPreferred: action.isPreferred
          })),
          dispose: () => {}
        };
      }
    });
    
    this.disposables.push(provider);
  }

  private async getAISuggestions(context: string, language: string) {
    // Simulate AI suggestions (in production, call Claude API)
    const suggestions = [
      {
        label: 'useState',
        kind: 'Function',
        detail: 'React Hook',
        documentation: 'Returns a stateful value and a function to update it.\n\n```typescript\nconst [state, setState] = useState(initialValue);\n```',
        insertText: 'const [${1:state}, set${1/(.*)/${1:/capitalize}/}] = useState(${2:initialValue});',
        command: {
          id: 'editor.action.triggerParameterHints',
          title: 'Trigger Parameter Hints'
        }
      },
      {
        label: 'useEffect',
        kind: 'Function',
        detail: 'React Hook',
        documentation: 'Accepts a function that contains imperative, possibly effectful code.',
        insertText: 'useEffect(() => {\n\t${1:// Effect logic}\n\treturn () => {\n\t\t${2:// Cleanup}\n\t};\n}, [${3:dependencies}]);'
      },
      {
        label: 'async function',
        kind: 'Snippet',
        detail: 'Async function declaration',
        documentation: 'Creates an asynchronous function',
        insertText: 'async function ${1:functionName}(${2:params}) {\n\t${3:// await async operations}\n}'
      }
    ];
    
    return suggestions;
  }

  private async getAIExplanation(word: string, context: string, language: string) {
    // Simulate AI explanation (in production, call Claude API)
    const explanations: Record<string, string> = {
      'useState': '### React useState Hook\n\nThe `useState` hook allows you to add state to functional components.\n\n**Syntax:**\n```javascript\nconst [state, setState] = useState(initialState);\n```\n\n**Parameters:**\n- `initialState`: The initial state value\n\n**Returns:**\n- An array with the current state value and a setter function',
      'useEffect': '### React useEffect Hook\n\nThe `useEffect` hook lets you perform side effects in function components.\n\n**Common use cases:**\n- Data fetching\n- Setting up subscriptions\n- Manually changing the DOM',
      'async': '### Async Keyword\n\nThe `async` keyword is used to declare asynchronous functions that return a Promise.\n\n**Benefits:**\n- Allows use of `await` keyword\n- Automatic Promise wrapping\n- Better error handling with try/catch'
    };
    
    return explanations[word] || null;
  }

  private async getAICodeActions(selectedText: string, language: string) {
    // Simulate AI code actions (in production, call Claude API)
    return [
      {
        title: '✨ Refactor with Claude',
        kind: 'refactor',
        newText: `// Refactored by Claude\n${selectedText}`,
        isPreferred: true
      },
      {
        title: '📝 Add JSDoc Comments',
        kind: 'documentation',
        newText: `/**\n * Description generated by Claude\n * @param {*} params - Parameters\n * @returns {*} Return value\n */\n${selectedText}`,
        isPreferred: false
      },
      {
        title: '🧪 Generate Tests',
        kind: 'test',
        newText: `// Test generated by Claude\ndescribe('${selectedText.split(' ')[1] || 'function'}', () => {\n\tit('should work correctly', () => {\n\t\t// Test implementation\n\t});\n});`,
        isPreferred: false
      },
      {
        title: '🔒 Add Type Safety',
        kind: 'type',
        newText: selectedText.replace(/function (\w+)\(([^)]*)\)/, 'function $1($2: any): any'),
        isPreferred: false
      }
    ];
  }

  attachToEditor(editor: monaco.editor.IStandaloneCodeEditor) {
    // Add custom commands
    editor.addCommand(
      this.monaco.KeyMod.CtrlCmd | this.monaco.KeyMod.Shift | this.monaco.KeyCode.KeyR,
      () => {
        const selection = editor.getSelection();
        if (selection) {
          editor.trigger('ai', 'editor.action.quickFix', {});
        }
      }
    );
    
    // Add inline suggestions
    this.monaco.languages.registerInlineCompletionsProvider('*', {
      provideInlineCompletions: async (model, position, context, token) => {
        const textUntilPosition = model.getValueInRange({
          startLineNumber: Math.max(1, position.lineNumber - 5),
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column
        });
        
        // Get AI inline suggestion
        const suggestion = await this.getAIInlineSuggestion(textUntilPosition, model.getLanguageId());
        
        if (!suggestion) return { items: [] };
        
        return {
          items: [{
            insertText: suggestion,
            range: new this.monaco.Range(
              position.lineNumber,
              position.column,
              position.lineNumber,
              position.column
            )
          }]
        };
      },
      freeInlineCompletions: () => {}
    });
  }

  private async getAIInlineSuggestion(context: string, language: string) {
    // Simulate AI inline suggestion (in production, call Claude API)
    const lastLine = context.split('\n').pop() || '';
    
    if (lastLine.includes('// TODO:')) {
      return ' Implement this feature';
    }
    
    if (lastLine.trim() === 'if (') {
      return 'condition) {\n\t// Code here\n}';
    }
    
    if (lastLine.includes('console.')) {
      return 'log("Debug:", variable);';
    }
    
    return null;
  }

  dispose() {
    this.disposables.forEach(d => d.dispose());
  }
}