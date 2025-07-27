'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Eye,
  RefreshCw,
  Maximize2,
  ExternalLink,
  Smartphone,
  Tablet,
  Monitor,
  Code,
  Globe,
  Zap,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';

interface LivePreviewProps {
  projectId: string;
  code: string;
  language: string;
}

type DeviceMode = 'desktop' | 'tablet' | 'mobile';

interface ConsoleMessage {
  id: string;
  type: 'log' | 'error' | 'warn' | 'info';
  message: string;
  timestamp: Date;
}

export function LivePreview({ projectId, code, language }: LivePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [consoleMessages, setConsoleMessages] = useState<ConsoleMessage[]>([]);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Set up preview URL (in production, this would be a real preview server)
    const baseUrl = process.env.NEXT_PUBLIC_PREVIEW_URL || 'http://localhost:3001';
    setPreviewUrl(`${baseUrl}/preview/${projectId}`);
    
    // Simulate connection
    setTimeout(() => {
      setIsConnected(true);
      setIsLoading(false);
    }, 1000);
  }, [projectId]);

  useEffect(() => {
    if (!iframeRef.current) return;

    // Set up message handler for console messages
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== new URL(previewUrl).origin) return;
      
      if (event.data.type === 'console') {
        const newMessage: ConsoleMessage = {
          id: Date.now().toString(),
          type: event.data.level || 'log',
          message: event.data.message,
          timestamp: new Date()
        };
        setConsoleMessages(prev => [...prev, newMessage]);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [previewUrl]);

  // Hot reload when code changes
  useEffect(() => {
    if (!isConnected || !iframeRef.current) return;
    
    // Send code update to preview iframe
    iframeRef.current.contentWindow?.postMessage({
      type: 'code-update',
      code,
      language
    }, '*');
  }, [code, language, isConnected]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    setConsoleMessages([]);
  };

  const handleOpenExternal = () => {
    window.open(previewUrl, '_blank');
  };

  const getDeviceStyles = () => {
    switch (deviceMode) {
      case 'mobile':
        return 'max-w-[375px] mx-auto';
      case 'tablet':
        return 'max-w-[768px] mx-auto';
      default:
        return 'w-full';
    }
  };

  const getConsoleIcon = (type: ConsoleMessage['type']) => {
    switch (type) {
      case 'error':
        return <XCircle className="h-3 w-3 text-red-400" />;
      case 'warn':
        return <AlertCircle className="h-3 w-3 text-yellow-400" />;
      case 'info':
        return <AlertCircle className="h-3 w-3 text-blue-400" />;
      default:
        return <CheckCircle className="h-3 w-3 text-gray-400" />;
    }
  };

  const clearConsole = () => {
    setConsoleMessages([]);
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      <CardHeader className="border-b border-white/10 p-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Eye className="h-4 w-4 text-blue-500" />
            Live Preview
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`text-xs ${
                isConnected
                  ? 'bg-green-500/10 text-green-400 border-green-500/20'
                  : 'bg-gray-500/10 text-gray-400'
              }`}
            >
              <div className={`w-2 h-2 rounded-full mr-1 ${
                isConnected ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
              }`} />
              {isConnected ? 'Connected' : 'Disconnected'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <div className="p-3 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant={deviceMode === 'desktop' ? 'default' : 'ghost'}
              onClick={() => setDeviceMode('desktop')}
              className="h-7 w-7 p-0"
            >
              <Monitor className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant={deviceMode === 'tablet' ? 'default' : 'ghost'}
              onClick={() => setDeviceMode('tablet')}
              className="h-7 w-7 p-0"
            >
              <Tablet className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant={deviceMode === 'mobile' ? 'default' : 'ghost'}
              onClick={() => setDeviceMode('mobile')}
              className="h-7 w-7 p-0"
            >
              <Smartphone className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleRefresh}
              className="h-7 w-7 p-0"
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleOpenExternal}
              className="h-7 w-7 p-0"
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="preview" className="flex-1 flex flex-col">
        <TabsList className="w-full rounded-none border-b border-white/10">
          <TabsTrigger value="preview" className="flex-1 text-xs">
            <Globe className="h-3 w-3 mr-1" />
            Preview
          </TabsTrigger>
          <TabsTrigger value="console" className="flex-1 text-xs">
            <Code className="h-3 w-3 mr-1" />
            Console ({consoleMessages.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="preview" className="flex-1 p-0 m-0">
          <div className="h-full bg-white">
            {isLoading ? (
              <div className="h-full flex items-center justify-center bg-gray-900">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Loading preview...</p>
                </div>
              </div>
            ) : (
              <div className={`h-full ${getDeviceStyles()}`}>
                {/* Device Frame */}
                {deviceMode !== 'desktop' && (
                  <div className="h-full p-4">
                    <div className="h-full bg-gray-800 rounded-lg p-2">
                      <div className="h-full bg-white rounded overflow-hidden">
                        <iframe
                          ref={iframeRef}
                          key={refreshKey}
                          src={previewUrl}
                          className="w-full h-full border-0"
                          title="Live Preview"
                          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                        />
                      </div>
                    </div>
                  </div>
                )}
                {deviceMode === 'desktop' && (
                  <iframe
                    ref={iframeRef}
                    key={refreshKey}
                    src={previewUrl}
                    className="w-full h-full border-0"
                    title="Live Preview"
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                  />
                )}
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="console" className="flex-1 flex flex-col p-0 m-0">
          <div className="p-2 border-b border-white/10 flex justify-between items-center">
            <span className="text-xs text-gray-400">Console Output</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={clearConsole}
              className="h-6 px-2 text-xs"
            >
              Clear
            </Button>
          </div>
          <div className="flex-1 overflow-auto p-2 font-mono text-xs">
            {consoleMessages.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No console messages</p>
            ) : (
              <div className="space-y-1">
                {consoleMessages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2 py-1 ${
                      msg.type === 'error' ? 'text-red-400' :
                      msg.type === 'warn' ? 'text-yellow-400' :
                      msg.type === 'info' ? 'text-blue-400' :
                      'text-gray-300'
                    }`}
                  >
                    {getConsoleIcon(msg.type)}
                    <span className="text-gray-500">
                      {msg.timestamp.toLocaleTimeString()}
                    </span>
                    <span className="flex-1 break-all">{msg.message}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}