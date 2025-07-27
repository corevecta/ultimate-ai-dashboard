'use client';

import { useState, useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bug, 
  Play, 
  Pause, 
  StepForward, 
  StepBack,
  Square,
  CircleDot,
  Variable,
  Layers,
  Activity,
  Eye,
  EyeOff,
  ChevronRight,
  ChevronDown,
  Zap,
  Clock,
  Database
} from 'lucide-react';

interface AdvancedDebuggingProps {
  editor: monaco.editor.IStandaloneCodeEditor | null;
  className?: string;
}

interface Breakpoint {
  id: string;
  line: number;
  condition?: string;
  hitCount?: number;
  enabled: boolean;
  verified: boolean;
}

interface Variable {
  name: string;
  value: any;
  type: string;
  children?: Variable[];
  expanded?: boolean;
}

interface StackFrame {
  id: string;
  name: string;
  source: string;
  line: number;
  column: number;
}

export function AdvancedDebugging({ editor, className }: AdvancedDebuggingProps) {
  const [isDebugging, setIsDebugging] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [breakpoints, setBreakpoints] = useState<Breakpoint[]>([]);
  const [variables, setVariables] = useState<Variable[]>([]);
  const [callStack, setCallStack] = useState<StackFrame[]>([]);
  const [watchExpressions, setWatchExpressions] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState<number | null>(null);
  const decorationsRef = useRef<string[]>([]);
  
  useEffect(() => {
    if (!editor) return;
    
    // Handle breakpoint clicks in gutter
    const mouseDownDisposable = editor.onMouseDown((e) => {
      if (e.target.type === monaco.editor.MouseTargetType.GUTTER_GLYPH_MARGIN) {
        const line = e.target.position?.lineNumber;
        if (line) {
          toggleBreakpoint(line);
        }
      }
    });
    
    // Handle debugging keyboard shortcuts
    const keyDownDisposable = editor.onKeyDown((e) => {
      // F5 - Start/Continue
      if (e.keyCode === monaco.KeyCode.F5) {
        e.preventDefault();
        if (!isDebugging) startDebugging();
        else if (isPaused) continueExecution();
      }
      // F9 - Toggle Breakpoint
      else if (e.keyCode === monaco.KeyCode.F9) {
        e.preventDefault();
        const position = editor.getPosition();
        if (position) toggleBreakpoint(position.lineNumber);
      }
      // F10 - Step Over
      else if (e.keyCode === monaco.KeyCode.F10) {
        e.preventDefault();
        if (isPaused) stepOver();
      }
      // F11 - Step Into
      else if (e.keyCode === monaco.KeyCode.F11) {
        e.preventDefault();
        if (isPaused) stepInto();
      }
    });
    
    return () => {
      mouseDownDisposable.dispose();
      keyDownDisposable.dispose();
    };
  }, [editor, isDebugging, isPaused]);
  
  useEffect(() => {
    if (!editor) return;
    
    // Clear old decorations
    editor.deltaDecorations(decorationsRef.current, []);
    
    const newDecorations: monaco.editor.IModelDeltaDecoration[] = [];
    
    // Add breakpoint decorations
    breakpoints.forEach(bp => {
      if (bp.enabled) {
        newDecorations.push({
          range: new monaco.Range(bp.line, 1, bp.line, 1),
          options: {
            isWholeLine: true,
            className: bp.verified ? 'debug-breakpoint-verified' : 'debug-breakpoint',
            glyphMarginClassName: bp.verified ? 'debug-breakpoint-glyph-verified' : 'debug-breakpoint-glyph',
            glyphMarginHoverMessage: {
              value: bp.condition ? `Conditional breakpoint: ${bp.condition}` : 'Breakpoint',
              isTrusted: true
            }
          }
        });
      }
    });
    
    // Add current execution line decoration
    if (currentLine && isPaused) {
      newDecorations.push({
        range: new monaco.Range(currentLine, 1, currentLine, 1),
        options: {
          isWholeLine: true,
          className: 'debug-current-line',
          glyphMarginClassName: 'debug-current-line-glyph'
        }
      });
    }
    
    decorationsRef.current = editor.deltaDecorations([], newDecorations);
    
    return () => {
      if (editor) {
        editor.deltaDecorations(decorationsRef.current, []);
      }
    };
  }, [editor, breakpoints, currentLine, isPaused]);
  
  const toggleBreakpoint = (line: number) => {
    setBreakpoints(prev => {
      const existing = prev.find(bp => bp.line === line);
      if (existing) {
        return prev.filter(bp => bp.line !== line);
      }
      return [...prev, {
        id: `bp-${Date.now()}`,
        line,
        enabled: true,
        verified: false,
        hitCount: 0
      }];
    });
  };
  
  const startDebugging = () => {
    setIsDebugging(true);
    setIsPaused(true);
    setCurrentLine(1);
    
    // Simulate initial variables
    setVariables([
      {
        name: 'props',
        type: 'object',
        value: { className: 'test', children: null },
        children: [
          { name: 'className', type: 'string', value: 'test' },
          { name: 'children', type: 'null', value: null }
        ]
      },
      {
        name: 'state',
        type: 'object',
        value: { count: 0, isLoading: false },
        children: [
          { name: 'count', type: 'number', value: 0 },
          { name: 'isLoading', type: 'boolean', value: false }
        ]
      }
    ]);
    
    // Simulate call stack
    setCallStack([
      { id: '1', name: 'MyComponent', source: 'src/components/MyComponent.tsx', line: 15, column: 5 },
      { id: '2', name: 'render', source: 'node_modules/react-dom/index.js', line: 1234, column: 10 },
      { id: '3', name: 'main', source: 'src/index.tsx', line: 8, column: 1 }
    ]);
  };
  
  const stopDebugging = () => {
    setIsDebugging(false);
    setIsPaused(false);
    setCurrentLine(null);
    setVariables([]);
    setCallStack([]);
  };
  
  const continueExecution = () => {
    setIsPaused(false);
    // Simulate execution continuing
    setTimeout(() => {
      const nextBreakpoint = breakpoints.find(bp => bp.enabled && bp.line > (currentLine || 0));
      if (nextBreakpoint) {
        setCurrentLine(nextBreakpoint.line);
        setIsPaused(true);
      } else {
        stopDebugging();
      }
    }, 1000);
  };
  
  const stepOver = () => {
    if (currentLine) {
      setCurrentLine(currentLine + 1);
    }
  };
  
  const stepInto = () => {
    if (currentLine) {
      setCurrentLine(currentLine + 1);
      // Simulate stepping into function
      setCallStack(prev => [{
        id: `${Date.now()}`,
        name: 'innerFunction',
        source: 'src/utils/helpers.ts',
        line: 42,
        column: 3
      }, ...prev]);
    }
  };
  
  const toggleVariableExpansion = (varPath: string[]) => {
    setVariables(prev => {
      const newVars = [...prev];
      let current = newVars;
      
      for (let i = 0; i < varPath.length - 1; i++) {
        const found = current.find(v => v.name === varPath[i]);
        if (found && found.children) {
          current = found.children;
        }
      }
      
      const variable = current.find(v => v.name === varPath[varPath.length - 1]);
      if (variable) {
        variable.expanded = !variable.expanded;
      }
      
      return newVars;
    });
  };
  
  const renderVariable = (variable: Variable, path: string[] = []): JSX.Element => {
    const hasChildren = variable.children && variable.children.length > 0;
    const currentPath = [...path, variable.name];
    
    return (
      <div key={variable.name} className="text-xs">
        <div 
          className="flex items-center gap-1 py-1 hover:bg-white/5 rounded cursor-pointer"
          onClick={() => hasChildren && toggleVariableExpansion(currentPath)}
        >
          {hasChildren && (
            <span className="w-4">
              {variable.expanded ? 
                <ChevronDown className="h-3 w-3" /> : 
                <ChevronRight className="h-3 w-3" />
              }
            </span>
          )}
          {!hasChildren && <span className="w-4" />}
          <span className="text-blue-400">{variable.name}:</span>
          <span className="text-gray-400">{variable.type}</span>
          <span className="text-green-400 ml-2">
            {typeof variable.value === 'object' ? 
              JSON.stringify(variable.value, null, 2).substring(0, 50) + '...' : 
              String(variable.value)
            }
          </span>
        </div>
        {hasChildren && variable.expanded && (
          <div className="ml-6">
            {variable.children.map(child => renderVariable(child, currentPath))}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <Card className={`border-white/10 bg-gray-900/90 backdrop-blur-sm ${className}`}>
      <CardHeader className="border-b border-white/10 py-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Bug className="h-5 w-5 text-red-500" />
            Advanced Debugger
          </CardTitle>
          <div className="flex items-center gap-2">
            {!isDebugging ? (
              <Button size="sm" onClick={startDebugging} className="bg-green-600 hover:bg-green-700">
                <Play className="h-3 w-3 mr-1" />
                Start
              </Button>
            ) : (
              <>
                {isPaused ? (
                  <Button size="sm" onClick={continueExecution} className="bg-blue-600 hover:bg-blue-700">
                    <Play className="h-3 w-3 mr-1" />
                    Continue
                  </Button>
                ) : (
                  <Button size="sm" onClick={() => setIsPaused(true)} variant="outline">
                    <Pause className="h-3 w-3 mr-1" />
                    Pause
                  </Button>
                )}
                <Button size="sm" onClick={stepOver} variant="outline" disabled={!isPaused}>
                  <StepForward className="h-3 w-3" />
                </Button>
                <Button size="sm" onClick={stepInto} variant="outline" disabled={!isPaused}>
                  <StepBack className="h-3 w-3" />
                </Button>
                <Button size="sm" onClick={stopDebugging} variant="destructive">
                  <Square className="h-3 w-3" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs defaultValue="breakpoints" className="h-[400px]">
          <TabsList className="w-full rounded-none border-b border-white/10">
            <TabsTrigger value="breakpoints" className="flex-1">
              <CircleDot className="h-3 w-3 mr-1" />
              Breakpoints
            </TabsTrigger>
            <TabsTrigger value="variables" className="flex-1">
              <Variable className="h-3 w-3 mr-1" />
              Variables
            </TabsTrigger>
            <TabsTrigger value="callstack" className="flex-1">
              <Layers className="h-3 w-3 mr-1" />
              Call Stack
            </TabsTrigger>
            <TabsTrigger value="watch" className="flex-1">
              <Eye className="h-3 w-3 mr-1" />
              Watch
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="breakpoints" className="p-4">
            <ScrollArea className="h-[320px]">
              {breakpoints.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <CircleDot className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No breakpoints set</p>
                  <p className="text-xs mt-1">Click in the gutter or press F9 to add</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {breakpoints.map(bp => (
                    <div key={bp.id} className="flex items-center gap-2 p-2 rounded bg-gray-800/50">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        onClick={() => {
                          setBreakpoints(prev => 
                            prev.map(b => b.id === bp.id ? { ...b, enabled: !b.enabled } : b)
                          );
                        }}
                      >
                        {bp.enabled ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                      </Button>
                      <CircleDot className={`h-3 w-3 ${bp.verified ? 'text-red-500' : 'text-gray-500'}`} />
                      <span className="text-sm flex-1">Line {bp.line}</span>
                      {bp.condition && (
                        <Badge variant="outline" className="text-xs">
                          Conditional
                        </Badge>
                      )}
                      {bp.hitCount ? (
                        <span className="text-xs text-gray-500">Hit {bp.hitCount}x</span>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="variables" className="p-4">
            <ScrollArea className="h-[320px]">
              {variables.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <Variable className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No variables in scope</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {variables.map(variable => renderVariable(variable))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="callstack" className="p-4">
            <ScrollArea className="h-[320px]">
              {callStack.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <Layers className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No call stack available</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {callStack.map((frame, index) => (
                    <div 
                      key={frame.id} 
                      className={`p-2 rounded cursor-pointer hover:bg-white/5 ${
                        index === 0 ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-gray-800/50'
                      }`}
                    >
                      <div className="font-medium text-sm">{frame.name}</div>
                      <div className="text-xs text-gray-400">
                        {frame.source}:{frame.line}:{frame.column}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="watch" className="p-4">
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add watch expression..."
                  className="flex-1 px-2 py-1 text-sm bg-gray-800 rounded border border-white/10"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value) {
                      setWatchExpressions(prev => [...prev, e.currentTarget.value]);
                      e.currentTarget.value = '';
                    }
                  }}
                />
              </div>
              <ScrollArea className="h-[280px]">
                {watchExpressions.map((expr, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 rounded bg-gray-800/50">
                    <Eye className="h-3 w-3 text-blue-400" />
                    <span className="text-sm flex-1">{expr}</span>
                    <span className="text-sm text-green-400">undefined</span>
                  </div>
                ))}
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}