'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  GitBranch,
  GitCommit,
  GitPullRequest,
  GitMerge,
  RefreshCw,
  Plus,
  Check,
  X,
  AlertCircle,
  FileText,
  FilePlus,
  FileX,
  FilePen,
  ChevronDown,
  ChevronRight,
  Upload,
  Download,
  Clock,
  User,
  MoreVertical,
  Search,
  Filter
} from 'lucide-react';

interface GitIntegrationProps {
  projectId: string;
  currentFile?: string;
}

interface GitFile {
  path: string;
  status: 'added' | 'modified' | 'deleted' | 'untracked';
  additions?: number;
  deletions?: number;
  isStaged: boolean;
}

interface GitCommit {
  id: string;
  message: string;
  author: string;
  date: Date;
  files: number;
}

interface GitBranch {
  name: string;
  isCurrent: boolean;
  isRemote: boolean;
  ahead: number;
  behind: number;
}

export function GitIntegration({ projectId, currentFile }: GitIntegrationProps) {
  const [activeTab, setActiveTab] = useState('changes');
  const [files, setFiles] = useState<GitFile[]>([
    {
      path: 'src/App.tsx',
      status: 'modified',
      additions: 10,
      deletions: 5,
      isStaged: false
    },
    {
      path: 'src/components/Header.tsx',
      status: 'added',
      additions: 50,
      deletions: 0,
      isStaged: true
    },
    {
      path: 'src/old-component.tsx',
      status: 'deleted',
      additions: 0,
      deletions: 100,
      isStaged: false
    }
  ]);
  
  const [commits, setCommits] = useState<GitCommit[]>([
    {
      id: 'abc123',
      message: 'Add new header component with responsive design',
      author: 'John Doe',
      date: new Date(Date.now() - 3600000),
      files: 3
    },
    {
      id: 'def456',
      message: 'Fix navigation bug in mobile view',
      author: 'Jane Smith',
      date: new Date(Date.now() - 7200000),
      files: 1
    }
  ]);
  
  const [branches, setBranches] = useState<GitBranch[]>([
    {
      name: 'main',
      isCurrent: true,
      isRemote: false,
      ahead: 2,
      behind: 0
    },
    {
      name: 'feature/new-ui',
      isCurrent: false,
      isRemote: false,
      ahead: 0,
      behind: 3
    },
    {
      name: 'origin/main',
      isCurrent: false,
      isRemote: true,
      ahead: 0,
      behind: 0
    }
  ]);
  
  const [commitMessage, setCommitMessage] = useState('');
  const [showDiff, setShowDiff] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const stageFile = (path: string) => {
    setFiles(prev => prev.map(file => 
      file.path === path ? { ...file, isStaged: true } : file
    ));
  };

  const unstageFile = (path: string) => {
    setFiles(prev => prev.map(file => 
      file.path === path ? { ...file, isStaged: false } : file
    ));
  };

  const stageAll = () => {
    setFiles(prev => prev.map(file => ({ ...file, isStaged: true })));
  };

  const unstageAll = () => {
    setFiles(prev => prev.map(file => ({ ...file, isStaged: false })));
  };

  const commit = () => {
    if (!commitMessage.trim()) return;
    
    const stagedFiles = files.filter(f => f.isStaged);
    if (stagedFiles.length === 0) return;
    
    const newCommit: GitCommit = {
      id: Date.now().toString(),
      message: commitMessage,
      author: 'Current User',
      date: new Date(),
      files: stagedFiles.length
    };
    
    setCommits(prev => [newCommit, ...prev]);
    setFiles(prev => prev.filter(f => !f.isStaged));
    setCommitMessage('');
  };

  const getFileIcon = (status: GitFile['status']) => {
    switch (status) {
      case 'added':
        return <FilePlus className="h-4 w-4 text-green-400" />;
      case 'modified':
        return <FilePen className="h-4 w-4 text-yellow-400" />;
      case 'deleted':
        return <FileX className="h-4 w-4 text-red-400" />;
      default:
        return <FileText className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: GitFile['status']) => {
    switch (status) {
      case 'added':
        return 'text-green-400';
      case 'modified':
        return 'text-yellow-400';
      case 'deleted':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const filteredCommits = commits.filter(commit =>
    commit.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
    commit.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-gray-900">
      <CardHeader className="border-b border-white/10 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-purple-500" />
            Git Integration
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              <GitBranch className="h-3 w-3 mr-1" />
              main
            </Badge>
            <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
              <RefreshCw className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="w-full rounded-none border-b border-white/10">
            <TabsTrigger value="changes" className="flex-1">Changes</TabsTrigger>
            <TabsTrigger value="commits" className="flex-1">History</TabsTrigger>
            <TabsTrigger value="branches" className="flex-1">Branches</TabsTrigger>
          </TabsList>
          
          <TabsContent value="changes" className="flex-1 flex flex-col p-0 m-0">
            {/* Commit Message */}
            <div className="p-4 border-b border-white/10">
              <Textarea
                placeholder="Commit message..."
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                className="min-h-[80px] bg-gray-800 border-white/10 mb-2"
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={stageAll}
                    className="text-xs"
                  >
                    Stage All
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={unstageAll}
                    className="text-xs"
                  >
                    Unstage All
                  </Button>
                </div>
                <Button
                  size="sm"
                  disabled={!commitMessage.trim() || !files.some(f => f.isStaged)}
                  onClick={commit}
                >
                  <GitCommit className="h-3 w-3 mr-1" />
                  Commit
                </Button>
              </div>
            </div>
            
            {/* File Changes */}
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-4">
                {/* Staged Changes */}
                {files.some(f => f.isStaged) && (
                  <div>
                    <h3 className="text-sm font-medium mb-2 text-gray-400">
                      Staged Changes ({files.filter(f => f.isStaged).length})
                    </h3>
                    <div className="space-y-1">
                      {files.filter(f => f.isStaged).map(file => (
                        <div
                          key={file.path}
                          className="flex items-center justify-between p-2 rounded hover:bg-white/5 cursor-pointer"
                          onClick={() => setShowDiff(file.path)}
                        >
                          <div className="flex items-center gap-2">
                            {getFileIcon(file.status)}
                            <span className="text-sm">{file.path}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {file.additions !== undefined && (
                              <span className="text-xs text-green-400">+{file.additions}</span>
                            )}
                            {file.deletions !== undefined && (
                              <span className="text-xs text-red-400">-{file.deletions}</span>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                unstageFile(file.path);
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Unstaged Changes */}
                {files.some(f => !f.isStaged) && (
                  <div>
                    <h3 className="text-sm font-medium mb-2 text-gray-400">
                      Changes ({files.filter(f => !f.isStaged).length})
                    </h3>
                    <div className="space-y-1">
                      {files.filter(f => !f.isStaged).map(file => (
                        <div
                          key={file.path}
                          className="flex items-center justify-between p-2 rounded hover:bg-white/5 cursor-pointer"
                          onClick={() => setShowDiff(file.path)}
                        >
                          <div className="flex items-center gap-2">
                            {getFileIcon(file.status)}
                            <span className="text-sm">{file.path}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {file.additions !== undefined && (
                              <span className="text-xs text-green-400">+{file.additions}</span>
                            )}
                            {file.deletions !== undefined && (
                              <span className="text-xs text-red-400">-{file.deletions}</span>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                stageFile(file.path);
                              }}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="commits" className="flex-1 flex flex-col p-0 m-0">
            <div className="p-3 border-b border-white/10">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search commits..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-800 border-white/10"
                />
              </div>
            </div>
            
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-2">
                {filteredCommits.map(commit => (
                  <Card
                    key={commit.id}
                    className="border-white/10 bg-gray-800/50 hover:bg-gray-800 cursor-pointer"
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium mb-1">{commit.message}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {commit.author}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {commit.date.toLocaleTimeString()}
                            </span>
                            <span>{commit.files} files</span>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs font-mono">
                          {commit.id.substring(0, 7)}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="branches" className="flex-1 p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium">Local Branches</h3>
                <Button size="sm" variant="outline" className="text-xs">
                  <Plus className="h-3 w-3 mr-1" />
                  New Branch
                </Button>
              </div>
              
              <div className="space-y-2">
                {branches.filter(b => !b.isRemote).map(branch => (
                  <Card
                    key={branch.name}
                    className={`border-white/10 ${
                      branch.isCurrent ? 'bg-blue-500/10' : 'bg-gray-800/50'
                    } hover:bg-gray-800 cursor-pointer`}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <GitBranch className={`h-4 w-4 ${
                            branch.isCurrent ? 'text-blue-400' : 'text-gray-400'
                          }`} />
                          <span className="text-sm font-medium">{branch.name}</span>
                          {branch.isCurrent && (
                            <Badge variant="outline" className="text-xs">current</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          {branch.ahead > 0 && (
                            <span className="text-green-400">↑{branch.ahead}</span>
                          )}
                          {branch.behind > 0 && (
                            <span className="text-red-400">↓{branch.behind}</span>
                          )}
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="pt-4">
                <h3 className="text-sm font-medium mb-2">Remote Branches</h3>
                <div className="space-y-2">
                  {branches.filter(b => b.isRemote).map(branch => (
                    <Card
                      key={branch.name}
                      className="border-white/10 bg-gray-800/50 hover:bg-gray-800 cursor-pointer"
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2">
                          <GitBranch className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{branch.name}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      {/* Status Bar */}
      <div className="border-t border-white/10 p-2">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <Upload className="h-3 w-3" />
            <span>2 ahead</span>
          </div>
          <div className="flex items-center gap-2">
            <Download className="h-3 w-3" />
            <span>0 behind</span>
          </div>
        </div>
      </div>
    </div>
  );
}