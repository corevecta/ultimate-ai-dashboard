'use client';

import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import Fuse from 'fuse.js';
import {
  Command,
  FileText,
  Search,
  Settings,
  Terminal,
  GitBranch,
  Package,
  Zap,
  Code,
  FileCode,
  FolderOpen,
  Save,
  Copy,
  Scissors,
  Clipboard,
  Undo,
  Redo,
  Download,
  Upload,
  RefreshCw,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  X,
  ChevronRight,
  Sparkles,
  Brain,
  TestTube,
  Shield,
  Bug,
  BookOpen,
  Palette,
  Keyboard,
  Monitor,
  Moon,
  Sun
} from 'lucide-react';

interface CommandPaletteProps {
  onClose: () => void;
  onCommand: (command: Command) => void;
}

interface Command {
  id: string;
  title: string;
  category: string;
  icon: React.ReactNode;
  shortcut?: string;
  action: () => void;
}

export function CommandPalette({ onClose, onCommand }: CommandPaletteProps) {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Command[] = [
    // File Commands
    {
      id: 'file-new',
      title: 'New File',
      category: 'File',
      icon: <FileText className="h-4 w-4" />,
      shortcut: 'Ctrl+N',
      action: () => console.log('New file')
    },
    {
      id: 'file-open',
      title: 'Open File',
      category: 'File',
      icon: <FolderOpen className="h-4 w-4" />,
      shortcut: 'Ctrl+O',
      action: () => console.log('Open file')
    },
    {
      id: 'file-save',
      title: 'Save',
      category: 'File',
      icon: <Save className="h-4 w-4" />,
      shortcut: 'Ctrl+S',
      action: () => console.log('Save file')
    },
    {
      id: 'file-save-all',
      title: 'Save All',
      category: 'File',
      icon: <Save className="h-4 w-4" />,
      shortcut: 'Ctrl+Shift+S',
      action: () => console.log('Save all files')
    },
    
    // Edit Commands
    {
      id: 'edit-undo',
      title: 'Undo',
      category: 'Edit',
      icon: <Undo className="h-4 w-4" />,
      shortcut: 'Ctrl+Z',
      action: () => console.log('Undo')
    },
    {
      id: 'edit-redo',
      title: 'Redo',
      category: 'Edit',
      icon: <Redo className="h-4 w-4" />,
      shortcut: 'Ctrl+Y',
      action: () => console.log('Redo')
    },
    {
      id: 'edit-cut',
      title: 'Cut',
      category: 'Edit',
      icon: <Scissors className="h-4 w-4" />,
      shortcut: 'Ctrl+X',
      action: () => console.log('Cut')
    },
    {
      id: 'edit-copy',
      title: 'Copy',
      category: 'Edit',
      icon: <Copy className="h-4 w-4" />,
      shortcut: 'Ctrl+C',
      action: () => console.log('Copy')
    },
    {
      id: 'edit-paste',
      title: 'Paste',
      category: 'Edit',
      icon: <Clipboard className="h-4 w-4" />,
      shortcut: 'Ctrl+V',
      action: () => console.log('Paste')
    },
    
    // View Commands
    {
      id: 'view-command-palette',
      title: 'Command Palette',
      category: 'View',
      icon: <Command className="h-4 w-4" />,
      shortcut: 'Ctrl+Shift+P',
      action: () => console.log('Command palette')
    },
    {
      id: 'view-terminal',
      title: 'Toggle Terminal',
      category: 'View',
      icon: <Terminal className="h-4 w-4" />,
      shortcut: 'Ctrl+`',
      action: () => console.log('Toggle terminal')
    },
    {
      id: 'view-sidebar',
      title: 'Toggle Sidebar',
      category: 'View',
      icon: <Eye className="h-4 w-4" />,
      shortcut: 'Ctrl+B',
      action: () => console.log('Toggle sidebar')
    },
    {
      id: 'view-fullscreen',
      title: 'Toggle Fullscreen',
      category: 'View',
      icon: <Maximize2 className="h-4 w-4" />,
      shortcut: 'F11',
      action: () => console.log('Toggle fullscreen')
    },
    
    // AI Commands
    {
      id: 'ai-explain',
      title: 'Explain Code',
      category: 'AI Assistant',
      icon: <Brain className="h-4 w-4" />,
      shortcut: 'Ctrl+Shift+E',
      action: () => console.log('Explain code')
    },
    {
      id: 'ai-refactor',
      title: 'Refactor Code',
      category: 'AI Assistant',
      icon: <Sparkles className="h-4 w-4" />,
      shortcut: 'Ctrl+Shift+R',
      action: () => console.log('Refactor code')
    },
    {
      id: 'ai-generate-tests',
      title: 'Generate Tests',
      category: 'AI Assistant',
      icon: <TestTube className="h-4 w-4" />,
      shortcut: 'Ctrl+Shift+T',
      action: () => console.log('Generate tests')
    },
    {
      id: 'ai-security-scan',
      title: 'Security Scan',
      category: 'AI Assistant',
      icon: <Shield className="h-4 w-4" />,
      action: () => console.log('Security scan')
    },
    {
      id: 'ai-find-bugs',
      title: 'Find Bugs',
      category: 'AI Assistant',
      icon: <Bug className="h-4 w-4" />,
      action: () => console.log('Find bugs')
    },
    {
      id: 'ai-generate-docs',
      title: 'Generate Documentation',
      category: 'AI Assistant',
      icon: <BookOpen className="h-4 w-4" />,
      action: () => console.log('Generate docs')
    },
    
    // Git Commands
    {
      id: 'git-commit',
      title: 'Commit',
      category: 'Git',
      icon: <GitBranch className="h-4 w-4" />,
      shortcut: 'Ctrl+K',
      action: () => console.log('Git commit')
    },
    {
      id: 'git-push',
      title: 'Push',
      category: 'Git',
      icon: <Upload className="h-4 w-4" />,
      action: () => console.log('Git push')
    },
    {
      id: 'git-pull',
      title: 'Pull',
      category: 'Git',
      icon: <Download className="h-4 w-4" />,
      action: () => console.log('Git pull')
    },
    {
      id: 'git-sync',
      title: 'Sync',
      category: 'Git',
      icon: <RefreshCw className="h-4 w-4" />,
      action: () => console.log('Git sync')
    },
    
    // Settings Commands
    {
      id: 'settings-preferences',
      title: 'Preferences',
      category: 'Settings',
      icon: <Settings className="h-4 w-4" />,
      shortcut: 'Ctrl+,',
      action: () => console.log('Open preferences')
    },
    {
      id: 'settings-keyboard',
      title: 'Keyboard Shortcuts',
      category: 'Settings',
      icon: <Keyboard className="h-4 w-4" />,
      action: () => console.log('Keyboard shortcuts')
    },
    {
      id: 'settings-theme',
      title: 'Change Theme',
      category: 'Settings',
      icon: <Palette className="h-4 w-4" />,
      action: () => console.log('Change theme')
    }
  ];

  // Initialize Fuse.js for fuzzy search
  const fuse = new Fuse(commands, {
    keys: ['title', 'category'],
    threshold: 0.3,
    includeScore: true
  });

  const filteredCommands = search
    ? fuse.search(search).map(result => result.item)
    : commands;

  // Group commands by category
  const groupedCommands = filteredCommands.reduce((acc, command) => {
    if (!acc[command.category]) {
      acc[command.category] = [];
    }
    acc[command.category].push(command);
    return acc;
  }, {} as Record<string, Command[]>);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const flatCommands = filteredCommands;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => 
          prev < flatCommands.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        e.preventDefault();
        if (flatCommands[selectedIndex]) {
          const command = flatCommands[selectedIndex];
          command.action();
          onCommand(command);
          onClose();
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  };

  let currentIndex = -1;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="p-0 max-w-2xl bg-gray-900 border-white/10">
        <div className="flex flex-col h-[500px]">
          {/* Search Input */}
          <div className="p-4 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                ref={inputRef}
                placeholder="Type a command or search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-10 bg-gray-800 border-white/10 focus:border-blue-500"
              />
            </div>
          </div>
          
          {/* Command List */}
          <ScrollArea className="flex-1">
            <div className="p-2">
              {Object.entries(groupedCommands).map(([category, categoryCommands]) => (
                <div key={category} className="mb-4">
                  <h3 className="text-xs font-medium text-gray-400 uppercase px-2 mb-1">
                    {category}
                  </h3>
                  {categoryCommands.map((command) => {
                    currentIndex++;
                    const isSelected = currentIndex === selectedIndex;
                    
                    return (
                      <button
                        key={command.id}
                        onClick={() => {
                          command.action();
                          onCommand(command);
                          onClose();
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded text-left transition-colors ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'hover:bg-white/5 text-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {command.icon}
                          <span className="text-sm">{command.title}</span>
                        </div>
                        {command.shortcut && (
                          <kbd className={`text-xs px-2 py-0.5 rounded ${
                            isSelected
                              ? 'bg-blue-700'
                              : 'bg-gray-800 text-gray-400'
                          }`}>
                            {command.shortcut}
                          </kbd>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
              
              {filteredCommands.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <p>No commands found</p>
                  <p className="text-sm mt-1">Try a different search term</p>
                </div>
              )}
            </div>
          </ScrollArea>
          
          {/* Footer */}
          <div className="p-3 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-4">
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
              <span>Esc Close</span>
            </div>
            <span>{filteredCommands.length} commands</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}