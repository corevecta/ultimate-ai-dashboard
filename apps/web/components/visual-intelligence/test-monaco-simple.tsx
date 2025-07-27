'use client';

import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function TestMonacoSimple() {
  const [value, setValue] = useState(`// Test Monaco Editor
function hello() {
  console.log("Hello, World!");
}`);

  return (
    <Card className="h-[600px]">
      <CardHeader>
        <CardTitle>Simple Monaco Test</CardTitle>
      </CardHeader>
      <CardContent className="h-[500px]">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          value={value}
          onChange={(val) => setValue(val || '')}
          theme="vs-dark"
          options={{
            minimap: { enabled: true },
            fontSize: 14
          }}
        />
      </CardContent>
    </Card>
  );
}