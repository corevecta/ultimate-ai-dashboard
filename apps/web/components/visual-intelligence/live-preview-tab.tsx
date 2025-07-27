'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Play,
  Square,
  RefreshCw,
  Maximize2,
  Monitor,
  Tablet,
  Smartphone,
  Globe,
  ExternalLink,
  Copy,
  Check,
  Loader2,
  AlertCircle,
  Zap,
  Activity,
  Package,
  Terminal,
  Code,
  Eye,
  Settings,
  Share2,
  Download,
  Grid,
  Columns
} from 'lucide-react';

interface LivePreviewTabProps {
  projectId: string;
  projectName?: string;
  viewMode?: 'demo' | 'production';
}

export function LivePreviewTab({ projectId, projectName, viewMode = 'demo' }: LivePreviewTabProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showConsole, setShowConsole] = useState(false);
  const [logs, setLogs] = useState<Array<{ type: string; message: string; timestamp: Date }>>([]);
  const [metrics, setMetrics] = useState({
    fps: 60,
    loadTime: 0,
    bundleSize: '0KB',
    memory: '0MB'
  });
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [splitView, setSplitView] = useState<'none' | 'vertical' | 'horizontal'>('none');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Device dimensions
  const deviceDimensions = {
    desktop: { width: '100%', height: '100%' },
    tablet: { width: '768px', height: '1024px' },
    mobile: { width: '375px', height: '667px' }
  };

  useEffect(() => {
    // Simulate performance metrics updates
    if (isRunning) {
      const interval = setInterval(() => {
        setMetrics({
          fps: Math.floor(Math.random() * 20) + 50,
          loadTime: Math.random() * 2 + 0.5,
          bundleSize: `${Math.floor(Math.random() * 200) + 200}KB`,
          memory: `${Math.floor(Math.random() * 50) + 30}MB`
        });
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isRunning]);

  const startPreview = async () => {
    setIsLoading(true);
    addLog('info', 'Starting preview server...');

    // Simulate server startup
    setTimeout(() => {
      const port = viewMode === 'demo' ? 3002 : 3003;
      const url = `http://localhost:${port}`;
      setPreviewUrl(url);
      setIsRunning(true);
      setIsLoading(false);
      addLog('success', `Preview server started at ${url}`);
      addLog('info', 'Hot reload enabled - changes will reflect automatically');
    }, 2000);
  };

  const stopPreview = () => {
    addLog('info', 'Stopping preview server...');
    setIsRunning(false);
    setPreviewUrl('');
    addLog('warn', 'Preview server stopped');
  };

  const refreshPreview = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
      addLog('info', 'Preview refreshed');
    }
  };

  const addLog = (type: string, message: string) => {
    setLogs(prev => [...prev, {
      type,
      message,
      timestamp: new Date()
    }]);
  };

  const handleCopyUrl = () => {
    if (previewUrl) {
      navigator.clipboard.writeText(previewUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  const handleFullscreen = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        containerRef.current.requestFullscreen();
      }
    }
  };

  const openInNewTab = () => {
    if (previewUrl) {
      window.open(previewUrl, '_blank');
    }
  };

  const exportScreenshot = () => {
    addLog('info', 'Screenshot functionality would be implemented here');
    // In production, this would capture the iframe content
  };

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="h-3 w-3 text-red-400" />;
      case 'warn':
        return <AlertCircle className="h-3 w-3 text-yellow-400" />;
      case 'success':
        return <Check className="h-3 w-3 text-green-400" />;
      default:
        return <Terminal className="h-3 w-3 text-blue-400" />;
    }
  };

  return (
    <div className="h-full flex flex-col" ref={containerRef}>
      {/* Preview Controls */}
      <div className="p-4 border-b border-white/10 bg-gray-900/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Start/Stop Controls */}
            <div className="flex items-center gap-2">
              {!isRunning ? (
                <Button
                  onClick={startPreview}
                  disabled={isLoading}
                  className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border-green-500/30"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4 mr-2" />
                  )}
                  Start Preview
                </Button>
              ) : (
                <>
                  <Button
                    onClick={stopPreview}
                    variant="outline"
                    className="text-red-400 border-red-400/30 hover:bg-red-500/10"
                  >
                    <Square className="h-4 w-4 mr-2" />
                    Stop
                  </Button>
                  <Button
                    onClick={refreshPreview}
                    variant="outline"
                    size="icon"
                    className="hover:bg-white/5"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>

            {/* URL Display */}
            {previewUrl && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 rounded-md border border-white/10">
                <Globe className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-mono text-gray-300">{previewUrl}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCopyUrl}
                  className="h-6 w-6 p-0"
                >
                  {copiedUrl ? (
                    <Check className="h-3 w-3 text-green-400" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={openInNewTab}
                  className="h-6 w-6 p-0"
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            )}

            {/* Status Badge */}
            <Badge
              variant="outline"
              className={isRunning ? 'text-green-400 border-green-400/30' : 'text-gray-400'}
            >
              <div className={`w-2 h-2 rounded-full mr-2 ${isRunning ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
              {isRunning ? 'Running' : 'Stopped'}
            </Badge>
          </div>

          {/* Device Mode & Actions */}
          <div className="flex items-center gap-2">
            {/* Device Mode Selector */}
            <div className="flex gap-1 p-1 bg-gray-800/50 rounded-lg border border-white/10">
              <Button
                size="sm"
                variant={deviceMode === 'desktop' ? 'default' : 'ghost'}
                onClick={() => setDeviceMode('desktop')}
                className="h-7 w-7 p-0"
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={deviceMode === 'tablet' ? 'default' : 'ghost'}
                onClick={() => setDeviceMode('tablet')}
                className="h-7 w-7 p-0"
              >
                <Tablet className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={deviceMode === 'mobile' ? 'default' : 'ghost'}
                onClick={() => setDeviceMode('mobile')}
                className="h-7 w-7 p-0"
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>

            <div className="h-4 w-px bg-white/10" />

            {/* View Options */}
            <div className="flex gap-1">
              <Button
                size="sm"
                variant={splitView === 'none' ? 'default' : 'ghost'}
                onClick={() => setSplitView('none')}
                className="h-7 px-2"
              >
                <Grid className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant={splitView === 'vertical' ? 'default' : 'ghost'}
                onClick={() => setSplitView('vertical')}
                className="h-7 px-2"
              >
                <Columns className="h-3 w-3" />
              </Button>
            </div>

            <div className="h-4 w-px bg-white/10" />

            {/* Actions */}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowConsole(!showConsole)}
              className={showConsole ? 'bg-white/10' : ''}
            >
              <Terminal className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={exportScreenshot}>
              <Download className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={handleFullscreen}>
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Performance Metrics */}
        {isRunning && (
          <div className="grid grid-cols-4 gap-4 mt-4">
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-800/30 rounded-lg">
              <Activity className="h-4 w-4 text-green-400" />
              <div>
                <p className="text-xs text-gray-400">FPS</p>
                <p className="text-sm font-semibold">{metrics.fps}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-800/30 rounded-lg">
              <Zap className="h-4 w-4 text-yellow-400" />
              <div>
                <p className="text-xs text-gray-400">Load Time</p>
                <p className="text-sm font-semibold">{metrics.loadTime.toFixed(2)}s</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-800/30 rounded-lg">
              <Package className="h-4 w-4 text-blue-400" />
              <div>
                <p className="text-xs text-gray-400">Bundle</p>
                <p className="text-sm font-semibold">{metrics.bundleSize}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-800/30 rounded-lg">
              <Globe className="h-4 w-4 text-purple-400" />
              <div>
                <p className="text-xs text-gray-400">Memory</p>
                <p className="text-sm font-semibold">{metrics.memory}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Preview Area */}
      <div className="flex-1 flex">
        <div className={`flex-1 ${showConsole ? 'flex flex-col' : ''}`}>
          {/* Preview Frame */}
          <div className={`${showConsole ? 'flex-1' : 'h-full'} bg-gray-950 p-4 overflow-auto`}>
            {!isRunning ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse mx-auto" />
                    <Globe className="h-12 w-12 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Preview Server Offline</h3>
                  <p className="text-gray-400 mb-4">
                    Start the preview server to see your {viewMode} build
                  </p>
                  <Button onClick={startPreview} disabled={isLoading}>
                    <Play className="h-4 w-4 mr-2" />
                    Start Preview
                  </Button>
                </div>
              </div>
            ) : (
              <div
                className={`mx-auto bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ${
                  deviceMode === 'desktop' ? 'w-full h-full' : ''
                }`}
                style={
                  deviceMode !== 'desktop'
                    ? {
                        width: deviceDimensions[deviceMode].width,
                        height: deviceDimensions[deviceMode].height
                      }
                    : undefined
                }
              >
                {splitView === 'vertical' ? (
                  <div className="flex h-full">
                    <iframe
                      ref={iframeRef}
                      src={previewUrl}
                      className="flex-1 w-1/2"
                      style={{ border: 'none' }}
                    />
                    <div className="w-px bg-gray-300" />
                    <iframe
                      src={`${previewUrl}?view=secondary`}
                      className="flex-1 w-1/2"
                      style={{ border: 'none' }}
                    />
                  </div>
                ) : (
                  <iframe
                    ref={iframeRef}
                    src={previewUrl}
                    className="w-full h-full"
                    style={{ border: 'none' }}
                  />
                )}
              </div>
            )}
          </div>

          {/* Console */}
          {showConsole && (
            <div className="h-64 border-t border-white/10 bg-gray-900/50">
              <div className="flex items-center justify-between p-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium">Console</span>
                  <Badge variant="outline" className="text-xs">
                    {logs.length} logs
                  </Badge>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setLogs([])}
                  className="h-6 px-2 text-xs"
                >
                  Clear
                </Button>
              </div>
              <div className="h-[calc(100%-40px)] overflow-y-auto p-2 font-mono text-xs">
                {logs.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-2 py-1">
                    {getLogIcon(log.type)}
                    <span className="text-gray-500">
                      [{log.timestamp.toLocaleTimeString()}]
                    </span>
                    <span className={
                      log.type === 'error' ? 'text-red-400' :
                      log.type === 'warn' ? 'text-yellow-400' :
                      log.type === 'success' ? 'text-green-400' :
                      'text-gray-300'
                    }>
                      {log.message}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}