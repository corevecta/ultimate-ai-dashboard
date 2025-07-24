'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { toast } from '../../../hooks/use-toast';
import {
  Search,
  Download,
  Upload,
  Star,
  GitBranch,
  Code,
  Shield,
  Zap,
  Package,
  Settings,
  Plus,
  Check,
  X,
  TrendingUp,
  Users,
  Clock,
  ExternalLink,
  Filter,
  Heart,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';

interface Plugin {
  id: string;
  name: string;
  description: string;
  author: string;
  version: string;
  category: string;
  icon: React.ComponentType<any>;
  downloads: number;
  rating: number;
  reviews: number;
  installed: boolean;
  verified: boolean;
  lastUpdated: string;
  size: string;
  dependencies: string[];
  tags: string[];
  price: number;
  screenshots: string[];
}

const plugins: Plugin[] = [
  {
    id: 'advanced-code-analyzer',
    name: 'Advanced Code Analyzer',
    description: 'Deep static analysis with AI-powered insights for code quality, security vulnerabilities, and performance optimizations.',
    author: 'AI Labs',
    version: '2.4.1',
    category: 'Code Quality',
    icon: Code,
    downloads: 45234,
    rating: 4.8,
    reviews: 234,
    installed: true,
    verified: true,
    lastUpdated: '2 days ago',
    size: '12.4 MB',
    dependencies: ['@ai-enhanced/core', 'typescript'],
    tags: ['analysis', 'quality', 'security', 'performance'],
    price: 0,
    screenshots: [],
  },
  {
    id: 'smart-security-scanner',
    name: 'Smart Security Scanner',
    description: 'Enterprise-grade security scanning with real-time threat detection and automated vulnerability patching.',
    author: 'SecureAI',
    version: '1.8.0',
    category: 'Security',
    icon: Shield,
    downloads: 23456,
    rating: 4.9,
    reviews: 189,
    installed: false,
    verified: true,
    lastUpdated: '1 week ago',
    size: '8.7 MB',
    dependencies: ['@ai-enhanced/core', 'security-framework'],
    tags: ['security', 'scanning', 'vulnerabilities', 'enterprise'],
    price: 29.99,
    screenshots: [],
  },
  {
    id: 'performance-optimizer',
    name: 'Performance Optimizer Pro',
    description: 'Automatically optimize your code for maximum performance with AI-driven suggestions and automated refactoring.',
    author: 'OptimizeAI',
    version: '3.1.0',
    category: 'Performance',
    icon: Zap,
    downloads: 34567,
    rating: 4.7,
    reviews: 312,
    installed: false,
    verified: true,
    lastUpdated: '3 days ago',
    size: '15.2 MB',
    dependencies: ['@ai-enhanced/core', 'performance-kit'],
    tags: ['performance', 'optimization', 'speed', 'efficiency'],
    price: 0,
    screenshots: [],
  },
  {
    id: 'git-workflow-enhancer',
    name: 'Git Workflow Enhancer',
    description: 'Streamline your Git workflow with AI-powered commit messages, branch management, and merge conflict resolution.',
    author: 'DevFlow',
    version: '2.2.3',
    category: 'Version Control',
    icon: GitBranch,
    downloads: 56789,
    rating: 4.6,
    reviews: 445,
    installed: true,
    verified: true,
    lastUpdated: '5 days ago',
    size: '6.3 MB',
    dependencies: ['@ai-enhanced/core', 'git-integration'],
    tags: ['git', 'version-control', 'workflow', 'productivity'],
    price: 0,
    screenshots: [],
  },
  {
    id: 'deployment-automator',
    name: 'Deployment Automator',
    description: 'One-click deployment to multiple platforms with intelligent configuration and rollback capabilities.',
    author: 'DeployMaster',
    version: '1.5.2',
    category: 'Deployment',
    icon: Package,
    downloads: 12345,
    rating: 4.5,
    reviews: 98,
    installed: false,
    verified: false,
    lastUpdated: '2 weeks ago',
    size: '10.1 MB',
    dependencies: ['@ai-enhanced/core', 'cloud-sdk'],
    tags: ['deployment', 'automation', 'cloud', 'devops'],
    price: 49.99,
    screenshots: [],
  },
];

const categories = [
  'All',
  'Code Quality',
  'Security',
  'Performance',
  'Version Control',
  'Deployment',
  'Testing',
  'Documentation',
  'UI/UX',
  'Database',
];

export const PluginMarketplace: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [installedPlugins, setInstalledPlugins] = useState<Set<string>>(
    new Set(plugins.filter(p => p.installed).map(p => p.id))
  );
  const [selectedPlugin, setSelectedPlugin] = useState<Plugin | null>(null);

  const filteredPlugins = plugins.filter((plugin) => {
    const matchesSearch = plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plugin.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plugin.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || plugin.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.downloads - a.downloads;
      case 'rating':
        return b.rating - a.rating;
      case 'recent':
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const installPlugin = (pluginId: string) => {
    setInstalledPlugins(new Set([...installedPlugins, pluginId]));
    toast({
      title: 'Plugin Installed',
      description: 'The plugin has been successfully installed.',
    });
  };

  const uninstallPlugin = (pluginId: string) => {
    const newInstalled = new Set(installedPlugins);
    newInstalled.delete(pluginId);
    setInstalledPlugins(newInstalled);
    toast({
      title: 'Plugin Uninstalled',
      description: 'The plugin has been successfully uninstalled.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Plugin Marketplace</h2>
          <p className="text-muted-foreground">Extend your AI pipeline with powerful plugins</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Upload Plugin
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Custom Plugin</DialogTitle>
                <DialogDescription>
                  Share your plugin with the community
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label>Plugin Name</Label>
                  <Input placeholder="My Awesome Plugin" />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea placeholder="Describe what your plugin does..." />
                </div>
                <div>
                  <Label>Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.slice(1).map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Plugin File</Label>
                  <Input type="file" accept=".zip,.js,.ts" />
                </div>
                <Button className="w-full">Upload Plugin</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Plugin
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search plugins..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popular">Most Popular</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="recent">Recently Updated</SelectItem>
            <SelectItem value="name">Name (A-Z)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Plugins</TabsTrigger>
          <TabsTrigger value="installed">Installed ({installedPlugins.size})</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPlugins.map((plugin) => {
              const Icon = plugin.icon;
              const isInstalled = installedPlugins.has(plugin.id);
              
              return (
                <Card key={plugin.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            {plugin.name}
                            {plugin.verified && (
                              <Badge variant="secondary" className="text-xs">
                                <Check className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription className="text-xs">
                            by {plugin.author} • v{plugin.version}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {plugin.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        {plugin.downloads.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-current text-yellow-500" />
                        {plugin.rating}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {plugin.reviews}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {plugin.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="text-sm font-medium">
                        {plugin.price === 0 ? (
                          <span className="text-green-600">Free</span>
                        ) : (
                          <span>${plugin.price}</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedPlugin(plugin)}
                        >
                          View Details
                        </Button>
                        {isInstalled ? (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => uninstallPlugin(plugin.id)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Uninstall
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => installPlugin(plugin.id)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Install
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="installed" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {plugins.filter(p => installedPlugins.has(p.id)).map((plugin) => {
              const Icon = plugin.icon;
              
              return (
                <Card key={plugin.id}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{plugin.name}</CardTitle>
                        <CardDescription className="text-xs">
                          v{plugin.version} • {plugin.size}
                        </CardDescription>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Status</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Last Updated</span>
                      <span>{plugin.lastUpdated}</span>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        Configure
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => uninstallPlugin(plugin.id)}
                      >
                        Uninstall
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="trending" className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold">Trending This Week</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPlugins.slice(0, 6).map((plugin) => {
              const Icon = plugin.icon;
              const isInstalled = installedPlugins.has(plugin.id);
              
              return (
                <Card key={plugin.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            {plugin.name}
                            <Badge variant="secondary" className="text-xs">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Trending
                            </Badge>
                          </CardTitle>
                          <CardDescription className="text-xs">
                            +{Math.floor(Math.random() * 50 + 20)}% this week
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {plugin.description}
                    </p>
                    {isInstalled ? (
                      <Button size="sm" variant="secondary" className="w-full">
                        <Check className="h-4 w-4 mr-1" />
                        Installed
                      </Button>
                    ) : (
                      <Button size="sm" className="w-full" onClick={() => installPlugin(plugin.id)}>
                        <Download className="h-4 w-4 mr-1" />
                        Install
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="featured" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {plugins.filter(p => p.verified).slice(0, 4).map((plugin) => {
              const Icon = plugin.icon;
              const isInstalled = installedPlugins.has(plugin.id);
              
              return (
                <Card key={plugin.id} className="overflow-hidden">
                  <div className="bg-gradient-to-r from-primary/20 to-primary/10 p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-background/80">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold flex items-center gap-2">
                          {plugin.name}
                          <Badge>Featured</Badge>
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          by {plugin.author} • {plugin.downloads.toLocaleString()} downloads
                        </p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="pt-6">
                    <p className="text-sm mb-4">{plugin.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-current text-yellow-500" />
                          <span className="font-medium">{plugin.rating}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          ({plugin.reviews} reviews)
                        </span>
                      </div>
                      {isInstalled ? (
                        <Button variant="secondary">
                          <Check className="h-4 w-4 mr-1" />
                          Installed
                        </Button>
                      ) : (
                        <Button onClick={() => installPlugin(plugin.id)}>
                          <Download className="h-4 w-4 mr-1" />
                          Install Now
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Plugin Details Dialog */}
      {selectedPlugin && (
        <Dialog open={!!selectedPlugin} onOpenChange={() => setSelectedPlugin(null)}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-4">
                {React.createElement(selectedPlugin.icon, { className: "h-12 w-12 text-primary" })}
                <div>
                  <DialogTitle className="text-2xl flex items-center gap-2">
                    {selectedPlugin.name}
                    {selectedPlugin.verified && (
                      <Badge variant="secondary">
                        <Check className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </DialogTitle>
                  <DialogDescription>
                    by {selectedPlugin.author} • v{selectedPlugin.version} • {selectedPlugin.category}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="space-y-6 pt-6">
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">{selectedPlugin.description}</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{selectedPlugin.downloads.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Downloads</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold flex items-center justify-center gap-1">
                    {selectedPlugin.rating}
                    <Star className="h-5 w-5 fill-current text-yellow-500" />
                  </div>
                  <div className="text-xs text-muted-foreground">Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{selectedPlugin.reviews}</div>
                  <div className="text-xs text-muted-foreground">Reviews</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{selectedPlugin.size}</div>
                  <div className="text-xs text-muted-foreground">Size</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Dependencies</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedPlugin.dependencies.map((dep) => (
                    <Badge key={dep} variant="outline">{dep}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedPlugin.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                {installedPlugins.has(selectedPlugin.id) ? (
                  <>
                    <Button variant="secondary" className="flex-1">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        uninstallPlugin(selectedPlugin.id);
                        setSelectedPlugin(null);
                      }}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Uninstall
                    </Button>
                  </>
                ) : (
                  <Button
                    className="flex-1"
                    onClick={() => {
                      installPlugin(selectedPlugin.id);
                      setSelectedPlugin(null);
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Install Plugin
                    {selectedPlugin.price > 0 && ` - $${selectedPlugin.price}`}
                  </Button>
                )}
                <Button variant="outline" asChild>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Documentation
                  </a>
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};