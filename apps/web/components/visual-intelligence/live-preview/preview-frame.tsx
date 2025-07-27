'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  RefreshCw, 
  Maximize2, 
  Minimize2,
  AlertCircle,
  Loader2,
  Play,
  Square,
  Wifi,
  WifiOff
} from 'lucide-react';

interface PreviewFrameProps {
  projectId: string;
  type: 'demo' | 'production';
  deviceMode: 'desktop' | 'tablet' | 'mobile';
  className?: string;
}

const deviceDimensions = {
  desktop: { width: '100%', height: '100%', scale: 1 },
  tablet: { width: '768px', height: '1024px', scale: 0.8 },
  mobile: { width: '375px', height: '812px', scale: 0.7 }
};

export function PreviewFrame({ 
  projectId, 
  type, 
  deviceMode,
  className 
}: PreviewFrameProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [serverStatus, setServerStatus] = useState<'stopped' | 'starting' | 'running'>('stopped');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Start preview server
  const startPreviewServer = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setServerStatus('starting');

      const response = await fetch('/api/visual-intelligence/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, type })
      });

      if (!response.ok) {
        throw new Error('Failed to start preview server');
      }

      const data = await response.json();
      setPreviewUrl(data.url);
      setServerStatus('running');
      
      // Wait for server to be ready
      await waitForServer(data.url);
      setIsConnected(true);
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start preview');
      setServerStatus('stopped');
      setIsLoading(false);
    }
  };

  // Stop preview server
  const stopPreviewServer = async () => {
    try {
      await fetch(`/api/visual-intelligence/preview?projectId=${projectId}`, {
        method: 'DELETE'
      });
      setPreviewUrl(null);
      setIsConnected(false);
      setServerStatus('stopped');
    } catch (err) {
      console.error('Failed to stop preview:', err);
    }
  };

  // Wait for server to be ready
  const waitForServer = async (url: string, maxAttempts = 30) => {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const response = await fetch(url, { mode: 'no-cors' });
        return true;
      } catch (err) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    throw new Error('Server failed to start');
  };

  // Refresh iframe
  const handleRefresh = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Setup WebSocket for hot reload
  useEffect(() => {
    if (!previewUrl || !isConnected) return;

    // Create WebSocket connection for hot reload
    const ws = new WebSocket(`ws://localhost:${new URL(previewUrl).port}/ws`);
    
    ws.onmessage = (event) => {
      if (event.data === 'reload') {
        handleRefresh();
      }
    };

    ws.onerror = () => {
      setIsConnected(false);
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [previewUrl, isConnected]);

  // Check server status on mount
  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const response = await fetch(`/api/visual-intelligence/preview?projectId=${projectId}`);
        const data = await response.json();
        
        if (data.status === 'running') {
          setPreviewUrl(data.url);
          setServerStatus('running');
          setIsConnected(true);
          setIsLoading(false);
        } else {
          // Auto-start server
          startPreviewServer();
        }
      } catch (err) {
        startPreviewServer();
      }
    };

    checkServerStatus();

    return () => {
      // Don't stop server on unmount to allow switching between views
    };
  }, [projectId, type]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Status Bar */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <Badge 
          variant={isConnected ? 'default' : 'secondary'}
          className="bg-black/50 backdrop-blur-sm"
        >
          {isConnected ? (
            <>
              <Wifi className="h-3 w-3 mr-1" />
              Connected
            </>
          ) : (
            <>
              <WifiOff className="h-3 w-3 mr-1" />
              Disconnected
            </>
          )}
        </Badge>
        
        {serverStatus === 'running' && (
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleRefresh}
              className="h-8 w-8 p-0 bg-black/50 backdrop-blur-sm"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={toggleFullscreen}
              className="h-8 w-8 p-0 bg-black/50 backdrop-blur-sm"
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Device Frame */}
      <div 
        className="relative mx-auto transition-all duration-500 ease-in-out"
        style={{
          maxWidth: deviceDimensions[deviceMode].width,
          transform: `scale(${deviceDimensions[deviceMode].scale})`,
          transformOrigin: 'top center'
        }}
      >
        {/* Device Border */}
        {deviceMode !== 'desktop' && (
          <div className="absolute inset-0 bg-gray-800 rounded-[2.5rem] -z-10" 
               style={{ 
                 padding: deviceMode === 'mobile' ? '10px' : '20px',
                 boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
               }}
          >
            {/* Notch for mobile */}
            {deviceMode === 'mobile' && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-7 bg-gray-800 rounded-b-2xl" />
            )}
          </div>
        )}

        {/* Content Area */}
        <div 
          className={`relative bg-white overflow-hidden ${
            deviceMode !== 'desktop' ? 'rounded-[2rem]' : 'rounded-lg shadow-2xl'
          }`}
          style={{
            width: deviceMode === 'desktop' ? '100%' : deviceDimensions[deviceMode].width,
            height: deviceMode === 'desktop' ? '800px' : deviceDimensions[deviceMode].height,
          }}
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-20">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">Starting preview server...</p>
                <p className="text-sm text-gray-500 mt-1">This may take a few moments</p>
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-20 p-8">
              <Alert variant="destructive" className="max-w-md">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {error}
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={startPreviewServer}
                    className="mt-2 w-full"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Retry
                  </Button>
                </AlertDescription>
              </Alert>
            </div>
          )}

          {serverStatus === 'stopped' && !isLoading && !error && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-20">
              <div className="text-center">
                <Square className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium mb-4">Preview server stopped</p>
                <Button onClick={startPreviewServer}>
                  <Play className="h-4 w-4 mr-2" />
                  Start Preview
                </Button>
              </div>
            </div>
          )}

          {previewUrl && serverStatus === 'running' && (
            <iframe
              ref={iframeRef}
              src={previewUrl}
              className="w-full h-full border-0"
              title={`${projectId} preview`}
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            />
          )}
        </div>
      </div>
    </div>
  );
}