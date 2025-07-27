'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent } from '@/components/ui/card';
import { Terminal as TerminalIcon } from 'lucide-react';

// Dynamically import the terminal component to avoid SSR issues
const TerminalComponent = dynamic(
  () => import('./terminal-component').then(mod => ({ default: mod.TerminalComponent })),
  {
    ssr: false,
    loading: () => (
      <Card className="h-full bg-gray-950 flex items-center justify-center">
        <CardContent className="text-center">
          <TerminalIcon className="h-8 w-8 text-gray-600 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Loading terminal...</p>
        </CardContent>
      </Card>
    )
  }
);

interface TerminalComponentWrapperProps {
  projectId: string;
  className?: string;
}

export function TerminalComponentWrapper(props: TerminalComponentWrapperProps) {
  return <TerminalComponent {...props} />;
}