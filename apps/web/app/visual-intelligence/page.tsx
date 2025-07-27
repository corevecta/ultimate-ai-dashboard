'use client';

import { useState, useEffect } from 'react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EnhancedCodeExplorer } from '@/components/visual-intelligence/enhanced-code-explorer';
import { 
  Search, 
  Play, 
  Code, 
  Smartphone, 
  Monitor, 
  Tablet,
  RefreshCw,
  Maximize2,
  Activity,
  Zap,
  Eye,
  Sparkles,
  GitBranch,
  FileCode,
  Brain,
  BarChart3,
  Shield,
  Layers,
  Terminal,
  Database,
  Package
} from 'lucide-react';

export default function VisualIntelligencePage() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeView, setActiveView] = useState<'preview' | 'code' | 'analysis'>('preview');
  const [selectedFile, setSelectedFile] = useState<{ path: string; content: string; language: string } | null>(null);
  
  // Mock data for projects
  const projects = [
    { 
      id: 'cvp-education-tool-academic-paper-formatter',
      name: 'Academic Paper Formatter',
      platform: 'Web App',
      status: 'completed',
      hasDemo: true,
      hasProduction: true,
      lastUpdated: '2 hours ago',
      metrics: {
        quality: 95,
        performance: 88,
        security: 92,
        coverage: 78
      }
    },
    {
      id: 'cvp-chrome-extension-browser-window-tab-session-template-manager',
      name: 'Tab Session Manager',
      platform: 'Chrome Extension',
      status: 'in_progress',
      hasDemo: true,
      hasProduction: false,
      lastUpdated: '5 minutes ago',
      metrics: {
        quality: 82,
        performance: 90,
        security: 85,
        coverage: 65
      }
    }
  ];

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.platform.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardShell>
      <div className="min-h-screen">
        {/* Animated background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20" />
          <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
          <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000" />
        </div>

        <div className="relative z-10 p-8 space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
                <Eye className="h-10 w-10 text-blue-500" />
                Visual Code Intelligence
              </h1>
              <p className="text-gray-400 mt-2 text-lg">
                Live preview, code exploration, and AI-powered analysis for your projects
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline"
                className="border-white/10 hover:bg-white/5"
              >
                <GitBranch className="mr-2 h-4 w-4" />
                Connect Git
              </Button>
              <Button 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                AI Analysis
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-white/10 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Active Previews</p>
                    <p className="text-3xl font-bold text-white">3</p>
                    <p className="text-xs text-blue-400 mt-1">↑ 2 from yesterday</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Monitor className="h-6 w-6 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Code Quality</p>
                    <p className="text-3xl font-bold text-white">87%</p>
                    <p className="text-xs text-green-400 mt-1">↑ 5% improvement</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">AI Insights</p>
                    <p className="text-3xl font-bold text-white">142</p>
                    <p className="text-xs text-purple-400 mt-1">New suggestions</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <Brain className="h-6 w-6 text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Performance</p>
                    <p className="text-3xl font-bold text-white">98ms</p>
                    <p className="text-xs text-orange-400 mt-1">Avg load time</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <Zap className="h-6 w-6 text-orange-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeView} onValueChange={setActiveView} className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList className="bg-gray-900/50 border border-white/10">
                <TabsTrigger value="preview" className="data-[state=active]:bg-white/10">
                  <Eye className="w-4 h-4 mr-2" />
                  Live Preview
                </TabsTrigger>
                <TabsTrigger value="code" className="data-[state=active]:bg-white/10">
                  <Code className="w-4 h-4 mr-2" />
                  Code Explorer
                </TabsTrigger>
                <TabsTrigger value="analysis" className="data-[state=active]:bg-white/10">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  AI Analysis
                </TabsTrigger>
              </TabsList>

              {/* Search and Filters */}
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-80 bg-gray-900/50 border-white/10 focus:border-blue-500"
                  />
                </div>
                <Button variant="outline" className="border-white/10 hover:bg-white/5">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <TabsContent value="preview" className="space-y-6">
              <div className="grid grid-cols-12 gap-6">
                {/* Project List */}
                <div className="col-span-3">
                  <Card className="border-white/10 bg-gray-900/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Layers className="h-5 w-5 text-blue-500" />
                        Projects
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[600px]">
                        <div className="space-y-3">
                          {filteredProjects.map((project) => (
                            <div
                              key={project.id}
                              onClick={() => setSelectedProject(project.id)}
                              className={`p-4 rounded-lg cursor-pointer transition-all ${
                                selectedProject === project.id 
                                  ? 'bg-blue-500/20 border border-blue-500/50' 
                                  : 'bg-white/5 hover:bg-white/10 border border-transparent'
                              }`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-white">{project.name}</h4>
                                  <p className="text-sm text-gray-400 mt-1">{project.platform}</p>
                                </div>
                                <Badge 
                                  variant={project.status === 'completed' ? 'default' : 'secondary'}
                                  className={project.status === 'completed' ? 'bg-green-500/20 text-green-400' : ''}
                                >
                                  {project.status === 'completed' ? 'Ready' : 'Building'}
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-2 mt-3">
                                {project.hasDemo && (
                                  <Badge variant="outline" className="text-xs justify-center">
                                    <Play className="h-3 w-3 mr-1" />
                                    Demo
                                  </Badge>
                                )}
                                {project.hasProduction && (
                                  <Badge variant="outline" className="text-xs justify-center">
                                    <Package className="h-3 w-3 mr-1" />
                                    Prod
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="mt-3 space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span className="text-gray-500">Quality</span>
                                  <span className="text-gray-400">{project.metrics.quality}%</span>
                                </div>
                                <div className="w-full bg-gray-800 rounded-full h-1.5">
                                  <div 
                                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full"
                                    style={{ width: `${project.metrics.quality}%` }}
                                  />
                                </div>
                              </div>
                              
                              <p className="text-xs text-gray-500 mt-3">{project.lastUpdated}</p>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>

                {/* Preview Area */}
                <div className="col-span-9">
                  {selectedProject ? (
                    <div className="space-y-4">
                      {/* Preview Controls */}
                      <Card className="border-white/10 bg-gray-900/50 backdrop-blur-sm">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                              <Tabs defaultValue="demo" className="w-auto">
                                <TabsList className="bg-gray-800/50">
                                  <TabsTrigger value="demo">Demo</TabsTrigger>
                                  <TabsTrigger value="production">Production</TabsTrigger>
                                </TabsList>
                              </Tabs>
                              
                              <div className="flex gap-1 p-1 bg-gray-800/50 rounded-lg">
                                <Button
                                  size="sm"
                                  variant={deviceMode === 'desktop' ? 'default' : 'ghost'}
                                  onClick={() => setDeviceMode('desktop')}
                                  className="h-8 w-8 p-0"
                                >
                                  <Monitor className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant={deviceMode === 'tablet' ? 'default' : 'ghost'}
                                  onClick={() => setDeviceMode('tablet')}
                                  className="h-8 w-8 p-0"
                                >
                                  <Tablet className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant={deviceMode === 'mobile' ? 'default' : 'ghost'}
                                  onClick={() => setDeviceMode('mobile')}
                                  className="h-8 w-8 p-0"
                                >
                                  <Smartphone className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
                                Connected
                              </Badge>
                              <Button size="sm" variant="ghost">
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Maximize2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Preview Frame */}
                      <Card className="border-white/10 bg-black/50 backdrop-blur-sm overflow-hidden">
                        <CardContent className="p-0">
                          <div className={`mx-auto transition-all duration-300 ${
                            deviceMode === 'desktop' ? 'w-full' : 
                            deviceMode === 'tablet' ? 'max-w-[768px]' : 
                            'max-w-[375px]'
                          }`}>
                            <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ height: '700px' }}>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                  <div className="relative">
                                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse mx-auto" />
                                    <div className="absolute inset-0 w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-ping mx-auto opacity-30" />
                                  </div>
                                  <p className="text-gray-400 mt-4 font-medium">Initializing preview...</p>
                                  <p className="text-sm text-gray-500 mt-1">This will connect to your project shortly</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Performance Metrics */}
                      <div className="grid grid-cols-4 gap-4">
                        <Card className="border-white/10 bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs text-gray-400">FPS</p>
                                <p className="text-2xl font-bold text-white">60</p>
                                <p className="text-xs text-green-400">Optimal</p>
                              </div>
                              <Activity className="h-8 w-8 text-green-400" />
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="border-white/10 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-sm">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs text-gray-400">Load Time</p>
                                <p className="text-2xl font-bold text-white">1.2s</p>
                                <p className="text-xs text-yellow-400">Good</p>
                              </div>
                              <Zap className="h-8 w-8 text-yellow-400" />
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="border-white/10 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 backdrop-blur-sm">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs text-gray-400">Bundle Size</p>
                                <p className="text-2xl font-bold text-white">245KB</p>
                                <p className="text-xs text-blue-400">Optimized</p>
                              </div>
                              <Package className="h-8 w-8 text-blue-400" />
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="border-white/10 bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs text-gray-400">Memory</p>
                                <p className="text-2xl font-bold text-white">42MB</p>
                                <p className="text-xs text-purple-400">Efficient</p>
                              </div>
                              <Database className="h-8 w-8 text-purple-400" />
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  ) : (
                    <Card className="border-white/10 bg-gray-900/50 backdrop-blur-sm h-[600px]">
                      <CardContent className="h-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="relative">
                            <Eye className="h-20 w-20 text-gray-600 mx-auto" />
                            <Sparkles className="h-8 w-8 text-blue-500 absolute -top-2 -right-2 animate-pulse" />
                          </div>
                          <h3 className="text-2xl font-semibold text-white mt-4 mb-2">Select a Project</h3>
                          <p className="text-gray-400 max-w-md">
                            Choose a project from the list to start exploring its code, preview it live, 
                            and get AI-powered insights
                          </p>
                          <Button className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600">
                            <Sparkles className="mr-2 h-4 w-4" />
                            Browse Projects
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="code" className="space-y-6">
              {selectedProject ? (
                <EnhancedCodeExplorer 
                  projectId={selectedProject}
                  className="h-[700px]"
                />
              ) : (
                <Card className="border-white/10 bg-gray-900/50 backdrop-blur-sm h-[700px]">
                  <CardContent className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <FileCode className="h-20 w-20 text-gray-600 mx-auto" />
                      <h3 className="text-2xl font-semibold text-white mt-4 mb-2">Code Explorer</h3>
                      <p className="text-gray-400">Select a project to explore its code</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="analysis" className="space-y-6">
              <Card className="border-white/10 bg-gray-900/50 backdrop-blur-sm h-[700px]">
                <CardContent className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <Brain className="h-20 w-20 text-gray-600 mx-auto" />
                    <h3 className="text-2xl font-semibold text-white mt-4 mb-2">AI Analysis</h3>
                    <p className="text-gray-400">3D dependency visualization and code insights coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardShell>
  );
}