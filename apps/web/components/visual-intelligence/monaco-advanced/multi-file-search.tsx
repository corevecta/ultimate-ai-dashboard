'use client';

import { useState, useEffect } from 'react';
import * as monaco from 'monaco-editor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search,
  Replace,
  FileSearch,
  Regex,
  CaseSensitive,
  WholeWord,
  FolderSearch,
  File,
  ChevronRight,
  ChevronDown,
  CheckCircle,
  XCircle,
  Filter,
  History,
  Sparkles,
  GitBranch,
  AlertCircle
} from 'lucide-react';

interface MultiFileSearchProps {
  editor: monaco.editor.IStandaloneCodeEditor | null;
  projectId: string;
}

interface SearchResult {
  file: string;
  line: number;
  column: number;
  match: string;
  preview: string;
  selected: boolean;
}

interface SearchOptions {
  caseSensitive: boolean;
  wholeWord: boolean;
  useRegex: boolean;
  includePattern: string;
  excludePattern: string;
}

export function MultiFileSearch({ editor, projectId }: MultiFileSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [replaceQuery, setReplaceQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set());
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [selectedCount, setSelectedCount] = useState(0);
  const [searchOptions, setSearchOptions] = useState<SearchOptions>({
    caseSensitive: false,
    wholeWord: false,
    useRegex: false,
    includePattern: '**/*.{ts,tsx,js,jsx}',
    excludePattern: '**/node_modules/**'
  });
  
  useEffect(() => {
    // Update selected count
    setSelectedCount(searchResults.filter(r => r.selected).length);
  }, [searchResults]);
  
  const performSearch = async () => {
    if (!searchQuery) return;
    
    setIsSearching(true);
    
    // Add to search history
    setSearchHistory(prev => {
      const newHistory = [searchQuery, ...prev.filter(q => q !== searchQuery)];
      return newHistory.slice(0, 10);
    });
    
    // Simulate search across files - in real implementation would use file system API
    const mockResults: SearchResult[] = [
      {
        file: 'src/components/Button.tsx',
        line: 15,
        column: 10,
        match: searchQuery,
        preview: `  const ${searchQuery} = useCallback(() => {`,
        selected: true
      },
      {
        file: 'src/components/Button.tsx',
        line: 23,
        column: 5,
        match: searchQuery,
        preview: `    ${searchQuery}();`,
        selected: true
      },
      {
        file: 'src/utils/helpers.ts',
        line: 42,
        column: 15,
        match: searchQuery,
        preview: `export function ${searchQuery}(data: any) {`,
        selected: true
      },
      {
        file: 'src/hooks/useAuth.ts',
        line: 8,
        column: 20,
        match: searchQuery,
        preview: `  const ${searchQuery} = localStorage.getItem('token');`,
        selected: true
      },
      {
        file: 'tests/Button.test.tsx',
        line: 30,
        column: 12,
        match: searchQuery,
        preview: `    expect(${searchQuery}).toHaveBeenCalled();`,
        selected: true
      }
    ];
    
    setSearchResults(mockResults);
    setIsSearching(false);
    
    // Expand all files by default
    setExpandedFiles(new Set(mockResults.map(r => r.file)));
  };
  
  const performReplace = async () => {
    if (!replaceQuery || selectedCount === 0) return;
    
    // In real implementation, this would modify actual files
    const updatedResults = searchResults.map(result => {
      if (result.selected) {
        return {
          ...result,
          preview: result.preview.replace(result.match, replaceQuery),
          match: replaceQuery
        };
      }
      return result;
    });
    
    setSearchResults(updatedResults);
  };
  
  const toggleFile = (file: string) => {
    setExpandedFiles(prev => {
      const next = new Set(prev);
      if (next.has(file)) {
        next.delete(file);
      } else {
        next.add(file);
      }
      return next;
    });
  };
  
  const toggleResult = (index: number) => {
    setSearchResults(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], selected: !updated[index].selected };
      return updated;
    });
  };
  
  const toggleAllInFile = (file: string) => {
    setSearchResults(prev => {
      const fileResults = prev.filter(r => r.file === file);
      const allSelected = fileResults.every(r => r.selected);
      
      return prev.map(result => {
        if (result.file === file) {
          return { ...result, selected: !allSelected };
        }
        return result;
      });
    });
  };
  
  const selectAll = () => {
    setSearchResults(prev => prev.map(r => ({ ...r, selected: true })));
  };
  
  const deselectAll = () => {
    setSearchResults(prev => prev.map(r => ({ ...r, selected: false })));
  };
  
  const groupResultsByFile = () => {
    const grouped: Record<string, SearchResult[]> = {};
    searchResults.forEach(result => {
      if (!grouped[result.file]) {
        grouped[result.file] = [];
      }
      grouped[result.file].push(result);
    });
    return grouped;
  };
  
  const openInEditor = (result: SearchResult) => {
    if (!editor) return;
    
    // In real implementation, would open the actual file
    editor.setPosition({
      lineNumber: result.line,
      column: result.column
    });
    editor.revealLineInCenter(result.line);
  };
  
  return (
    <Card className="border-white/10 bg-gray-900/90 backdrop-blur-sm h-full">
      <CardHeader className="border-b border-white/10 py-3">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <FileSearch className="h-5 w-5 text-blue-500" />
          Multi-File Search & Replace
          {searchResults.length > 0 && (
            <Badge variant="outline" className="ml-2">
              {searchResults.length} results in {Object.keys(groupResultsByFile()).length} files
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs defaultValue="search" className="h-full">
          <TabsList className="w-full rounded-none border-b border-white/10">
            <TabsTrigger value="search" className="flex-1">
              <Search className="h-3 w-3 mr-1" />
              Search
            </TabsTrigger>
            <TabsTrigger value="replace" className="flex-1">
              <Replace className="h-3 w-3 mr-1" />
              Replace
            </TabsTrigger>
            <TabsTrigger value="filters" className="flex-1">
              <Filter className="h-3 w-3 mr-1" />
              Filters
            </TabsTrigger>
            <TabsTrigger value="history" className="flex-1">
              <History className="h-3 w-3 mr-1" />
              History
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="search" className="p-4 space-y-3">
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && performSearch()}
                  placeholder="Search across files..."
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={searchOptions.caseSensitive ? 'default' : 'outline'}
                  onClick={() => setSearchOptions(prev => ({ ...prev, caseSensitive: !prev.caseSensitive }))}
                  className="px-2"
                >
                  <CaseSensitive className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={searchOptions.wholeWord ? 'default' : 'outline'}
                  onClick={() => setSearchOptions(prev => ({ ...prev, wholeWord: !prev.wholeWord }))}
                  className="px-2"
                >
                  <WholeWord className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={searchOptions.useRegex ? 'default' : 'outline'}
                  onClick={() => setSearchOptions(prev => ({ ...prev, useRegex: !prev.useRegex }))}
                  className="px-2"
                >
                  <Regex className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={performSearch}
                  disabled={!searchQuery || isSearching}
                  className="flex-1"
                >
                  {isSearching ? 'Searching...' : 'Search All'}
                </Button>
              </div>
            </div>
            
            {searchResults.length > 0 && (
              <div className="border-t border-white/10 pt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">
                    {selectedCount} of {searchResults.length} selected
                  </span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={selectAll}>
                      Select All
                    </Button>
                    <Button size="sm" variant="ghost" onClick={deselectAll}>
                      Clear
                    </Button>
                  </div>
                </div>
                
                <ScrollArea className="h-[300px]">
                  {Object.entries(groupResultsByFile()).map(([file, results]) => {
                    const isExpanded = expandedFiles.has(file);
                    const fileSelected = results.every(r => r.selected);
                    const someSelected = results.some(r => r.selected);
                    
                    return (
                      <div key={file} className="mb-2">
                        <div className="flex items-center gap-2 p-2 hover:bg-white/5 rounded">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-5 w-5 p-0"
                            onClick={() => toggleFile(file)}
                          >
                            {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                          </Button>
                          <Checkbox
                            checked={fileSelected}
                            onCheckedChange={() => toggleAllInFile(file)}
                            className={someSelected && !fileSelected ? 'data-[state=checked]:bg-blue-600/50' : ''}
                          />
                          <File className="h-3 w-3 text-blue-400" />
                          <span className="text-sm flex-1">{file}</span>
                          <Badge variant="outline" className="text-xs">
                            {results.length}
                          </Badge>
                        </div>
                        
                        {isExpanded && (
                          <div className="ml-8 space-y-1">
                            {results.map((result, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2 p-1 hover:bg-white/5 rounded cursor-pointer"
                                onClick={() => openInEditor(result)}
                              >
                                <Checkbox
                                  checked={result.selected}
                                  onCheckedChange={() => toggleResult(searchResults.indexOf(result))}
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <span className="text-xs text-gray-500">
                                  {result.line}:{result.column}
                                </span>
                                <code className="text-xs flex-1 text-gray-300">
                                  {result.preview}
                                </code>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </ScrollArea>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="replace" className="p-4 space-y-3">
            <div className="space-y-3">
              <div className="relative">
                <Replace className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  value={replaceQuery}
                  onChange={(e) => setReplaceQuery(e.target.value)}
                  placeholder="Replace with..."
                  className="pl-10"
                  disabled={selectedCount === 0}
                />
              </div>
              
              <Button
                onClick={performReplace}
                disabled={!replaceQuery || selectedCount === 0}
                className="w-full"
              >
                <Replace className="h-4 w-4 mr-2" />
                Replace {selectedCount} occurrences
              </Button>
              
              {selectedCount > 0 && (
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-yellow-400">Preview changes before replacing</p>
                      <p className="text-gray-400 text-xs mt-1">
                        This will modify {selectedCount} occurrences across {Object.keys(groupResultsByFile()).length} files
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="filters" className="p-4 space-y-3">
            <div className="space-y-3">
              <div>
                <Label className="text-xs">Include files matching</Label>
                <Input
                  value={searchOptions.includePattern}
                  onChange={(e) => setSearchOptions(prev => ({ ...prev, includePattern: e.target.value }))}
                  placeholder="**/*.{ts,tsx,js,jsx}"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label className="text-xs">Exclude files matching</Label>
                <Input
                  value={searchOptions.excludePattern}
                  onChange={(e) => setSearchOptions(prev => ({ ...prev, excludePattern: e.target.value }))}
                  placeholder="**/node_modules/**"
                  className="mt-1"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs">Quick filters</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" variant="outline" className="text-xs">
                    <GitBranch className="h-3 w-3 mr-1" />
                    Changed files only
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Code files only
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="p-4">
            <div className="space-y-2">
              <Label className="text-xs text-gray-400">Recent searches</Label>
              {searchHistory.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No search history</p>
              ) : (
                searchHistory.map((query, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      setSearchQuery(query);
                      performSearch();
                    }}
                  >
                    <History className="h-3 w-3 mr-2" />
                    {query}
                  </Button>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}