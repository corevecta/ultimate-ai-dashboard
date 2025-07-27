'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Monitor, 
  Tablet, 
  Smartphone,
  RefreshCw,
  Maximize2,
  Download,
  Share2,
  Code,
  Eye,
  Activity,
  Zap,
  Package,
  GitBranch,
  FileText,
  Search,
  Settings,
  Play,
  Pause,
  RotateCw
} from 'lucide-react';

interface DeviceFrame {
  name: string;
  width: number;
  height: number;
  scale: number;
  icon: React.ReactNode;
}

const deviceFrames: Record<string, DeviceFrame> = {
  desktop: { name: 'Desktop', width: 1440, height: 900, scale: 1, icon: <Monitor className="h-4 w-4" /> },
  tablet: { name: 'iPad', width: 768, height: 1024, scale: 0.8, icon: <Tablet className="h-4 w-4" /> },
  mobile: { name: 'iPhone', width: 375, height: 812, scale: 0.6, icon: <Smartphone className="h-4 w-4" /> },
};

export default function ProjectVisualIntelligencePage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const [activeTab, setActiveTab] = useState('demo');
  const [deviceMode, setDeviceMode] = useState<keyof typeof deviceFrames>('desktop');
  const [isLoading, setIsLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Mock project data
  const project = {
    id: projectId,
    name: 'Academic Paper Formatter',
    platform: 'Web App',
    status: 'completed',
    demoUrl: 'http://localhost:3001',
    productionUrl: null,
    codeStats: {
      files: 156,
      lines: 12450,
      components: 45,
      tests: 32,
      coverage: 78
    },
    performance: {
      fps: 60,
      loadTime: 1.2,
      bundleSize: 245,
      memory: 42
    }
  };

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      setPreviewUrl(project.demoUrl);
    }, 1500);
  }, [project.demoUrl]);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-background' : 'p-8'} space-y-6`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
          >
            ← Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {project.name}
              <Badge variant="outline">{project.platform}</Badge>
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Project ID: {projectId}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button 
            variant="default" 
            size="sm"
            className="bg-gradient-to-r from-blue-500 to-purple-600"
          >
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className="col-span-3 space-y-4">
          {/* Code Stats */}
          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Code className="h-4 w-4" />
                Code Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Files</span>
                <span className="text-sm font-medium">{project.codeStats.files}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Lines of Code</span>
                <span className="text-sm font-medium">{project.codeStats.lines.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Components</span>
                <span className="text-sm font-medium">{project.codeStats.components}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Test Coverage</span>
                <span className="text-sm font-medium">{project.codeStats.coverage}%</span>
              </div>
            </CardContent>
          </Card>

          {/* File Explorer */}
          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <FileText className="h-4 w-4" />
                File Explorer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-1 font-mono text-xs">
                  <div className="flex items-center gap-2 p-2 hover:bg-white/5 rounded cursor-pointer">
                    <Package className="h-3 w-3 text-yellow-500" />
                    <span>src/</span>
                  </div>
                  <div className="pl-4">
                    <div className="flex items-center gap-2 p-2 hover:bg-white/5 rounded cursor-pointer">
                      <Package className="h-3 w-3 text-yellow-500" />
                      <span>components/</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-white/5 rounded cursor-pointer">
                      <Package className="h-3 w-3 text-yellow-500" />
                      <span>pages/</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-white/5 rounded cursor-pointer">
                      <FileText className="h-3 w-3 text-blue-500" />
                      <span>App.tsx</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 hover:bg-white/5 rounded cursor-pointer">
                    <FileText className="h-3 w-3 text-green-500" />
                    <span>package.json</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 hover:bg-white/5 rounded cursor-pointer">
                    <FileText className="h-3 w-3" />
                    <span>README.md</span>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Preview Area */}
        <div className="col-span-9 space-y-4">
          {/* Tabs and Controls */}
          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="bg-white/5">
                    <TabsTrigger value="demo">Demo</TabsTrigger>
                    <TabsTrigger value="production" disabled={!project.productionUrl}>
                      Production
                    </TabsTrigger>
                    <TabsTrigger value="code">Code View</TabsTrigger>
                    <TabsTrigger value="console">Console</TabsTrigger>
                    <TabsTrigger value="network">Network</TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="flex items-center gap-2">
                  {/* Device Selector */}
                  <div className="flex gap-1 p-1 bg-white/5 rounded-lg">
                    {Object.entries(deviceFrames).map(([key, device]) => (
                      <Button
                        key={key}
                        size="sm"
                        variant={deviceMode === key ? 'default' : 'ghost'}
                        onClick={() => setDeviceMode(key as keyof typeof deviceFrames)}
                        className="h-8 w-8 p-0"
                        title={device.name}
                      >
                        {device.icon}
                      </Button>
                    ))}
                  </div>

                  <div className="h-6 w-px bg-white/10" />

                  <Button size="sm" variant="ghost" onClick={handleRefresh}>
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <RotateCw className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleFullscreen}>
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview Frame */}
          <Card className="border-white/10 bg-black/50 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="relative bg-gray-900 p-8">
                <div 
                  className="mx-auto transition-all duration-300 bg-white rounded-lg shadow-2xl overflow-hidden"
                  style={{
                    width: `${deviceFrames[deviceMode].width}px`,
                    height: `${deviceFrames[deviceMode].height}px`,
                    transform: `scale(${deviceFrames[deviceMode].scale})`,
                    transformOrigin: 'top center'
                  }}
                >
                  {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse mx-auto mb-4" />
                        <p className="text-gray-600">Loading preview...</p>
                      </div>
                    </div>
                  ) : (
                    <TabsContent value="demo" className="h-full m-0">
                      <iframe
                        src={previewUrl || ''}
                        className="w-full h-full border-0"
                        title="Preview"
                      />
                    </TabsContent>
                  )}
                  
                  <TabsContent value="code" className="h-full m-0 p-4 bg-gray-900 text-white font-mono text-sm overflow-auto">
                    <pre>{`// Academic Paper Formatter
import React from 'react';
import { FormatEngine } from './services/formatting';

export default function App() {
  const [document, setDocument] = useState(null);
  
  const handleFormat = async (file) => {
    const formatted = await FormatEngine.process(file);
    setDocument(formatted);
  };
  
  return (
    <div className="app">
      <Header />
      <DocumentEditor 
        document={document}
        onFormat={handleFormat}
      />
      <PreviewPane document={document} />
    </div>
  );
}`}</pre>
                  </TabsContent>

                  <TabsContent value="console" className="h-full m-0 p-4 bg-gray-900 text-white font-mono text-xs overflow-auto">
                    <div className="space-y-1">
                      <div className="text-gray-400">[10:23:45.123] App initialized</div>
                      <div className="text-blue-400">[10:23:45.456] Document loaded: paper.docx</div>
                      <div className="text-green-400">[10:23:46.789] Format applied: APA 7th Edition</div>
                      <div className="text-yellow-400">[10:23:47.012] Warning: Large file size detected</div>
                    </div>
                  </TabsContent>

                  <TabsContent value="network" className="h-full m-0 p-4 bg-gray-900 text-white font-mono text-xs overflow-auto">
                    <div className="space-y-1">
                      <div className="grid grid-cols-4 gap-2 text-gray-400 border-b border-gray-700 pb-1">
                        <span>Method</span>
                        <span>URL</span>
                        <span>Status</span>
                        <span>Time</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        <span className="text-green-400">GET</span>
                        <span>/api/documents</span>
                        <span className="text-green-400">200</span>
                        <span>45ms</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        <span className="text-blue-400">POST</span>
                        <span>/api/format</span>
                        <span className="text-green-400">201</span>
                        <span>123ms</span>
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">FPS</p>
                    <p className="text-2xl font-bold">{project.performance.fps}</p>
                    <p className="text-xs text-green-500">Smooth</p>
                  </div>
                  <Activity className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Load Time</p>
                    <p className="text-2xl font-bold">{project.performance.loadTime}s</p>
                    <p className="text-xs text-yellow-500">Good</p>
                  </div>
                  <Zap className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Bundle Size</p>
                    <p className="text-2xl font-bold">{project.performance.bundleSize}KB</p>
                    <p className="text-xs text-blue-500">Optimized</p>
                  </div>
                  <Package className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Memory</p>
                    <p className="text-2xl font-bold">{project.performance.memory}MB</p>
                    <p className="text-xs text-purple-500">Efficient</p>
                  </div>
                  <Eye className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}