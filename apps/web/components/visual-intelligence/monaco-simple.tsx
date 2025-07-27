'use client';

import { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Save
} from 'lucide-react';

interface SimpleMonacoEditorProps {
  projectId: string;
  className?: string;
}

export function SimpleMonacoEditor({ projectId, className }: SimpleMonacoEditorProps) {
  const [code, setCode] = useState(`// Welcome to Visual Code Intelligence
function example() {
  console.log('Hello from Ultimate AI Dashboard!');
  
  // AI-powered code editing
  // Try typing and see intelligent suggestions
}

export default example;`);

  const [activeTab, setActiveTab] = useState('editor');
  const editorRef = useRef<any>(null);

  const handleEditorChange = (value: string | undefined) => {
    if (value) setCode(value);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
  };

  const saveCode = () => {
    console.log('Saving code...', code);
    // In production, save to backend
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
      <CardHeader className="border-b border-white/10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <Code className="h-5 w-5 text-blue-500" />
            Code Explorer
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={saveCode}
              className="h-8 px-3"
            >
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={copyCode}
              className="h-8 px-3"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
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
          
          <TabsContent value="editor" className="p-0 m-0">
            <Editor
              height="600px"
              defaultLanguage="javascript"
              value={code}
              onChange={handleEditorChange}
              theme="vs-dark"
              options={editorOptions}
              onMount={(editor) => {
                editorRef.current = editor;
              }}
            />
          </TabsContent>
          
          <TabsContent value="ai" className="p-6">
            <div className="text-center py-12">
              <Brain className="h-16 w-16 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Claude AI Assistant</h3>
              <p className="text-gray-400 mb-6">
                Get intelligent code suggestions, explanations, and refactoring help
              </p>
              <div className="max-w-md mx-auto space-y-3">
                <Button className="w-full" variant="outline">
                  Explain this code
                </Button>
                <Button className="w-full" variant="outline">
                  Suggest improvements
                </Button>
                <Button className="w-full" variant="outline">
                  Generate tests
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="preview" className="p-6">
            <div className="text-center py-12">
              <Eye className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Live Preview</h3>
              <p className="text-gray-400">
                Preview your code changes in real-time
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}