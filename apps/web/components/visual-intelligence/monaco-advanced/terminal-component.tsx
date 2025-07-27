'use client';

import { useEffect, useRef, useState } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import 'xterm/css/xterm.css';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Terminal as TerminalIcon,
  X,
  Maximize2,
  Minimize2,
  Copy,
  Trash2,
  Plus,
  Play,
  Square,
  RefreshCw,
  Settings,
  ChevronDown
} from 'lucide-react';

interface TerminalComponentProps {
  projectId: string;
  className?: string;
}

interface TerminalSession {
  id: string;
  name: string;
  terminal: Terminal;
  fitAddon: FitAddon;
  isActive: boolean;
}

export function TerminalComponent({ projectId, className }: TerminalComponentProps) {
  const terminalContainerRef = useRef<HTMLDivElement>(null);
  const [sessions, setSessions] = useState<TerminalSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Create initial terminal session
    createNewSession();
    
    return () => {
      // Clean up all sessions
      sessions.forEach(session => {
        session.terminal.dispose();
      });
      wsRef.current?.close();
    };
  }, []);

  const createNewSession = () => {
    if (!terminalContainerRef.current) return;

    const terminal = new Terminal({
      theme: {
        background: '#0d1117',
        foreground: '#c9d1d9',
        cursor: '#c9d1d9',
        black: '#484f58',
        red: '#ff7b72',
        green: '#3fb950',
        yellow: '#d29922',
        blue: '#58a6ff',
        magenta: '#bc8cff',
        cyan: '#39c5cf',
        white: '#b1bac4',
        brightBlack: '#6e7681',
        brightRed: '#ffa198',
        brightGreen: '#56d364',
        brightYellow: '#e3b341',
        brightBlue: '#79c0ff',
        brightMagenta: '#d2a8ff',
        brightCyan: '#56d4dd',
        brightWhite: '#f0f6fc',
      },
      fontSize: 14,
      fontFamily: 'JetBrains Mono, Consolas, monospace',
      cursorBlink: true,
      cursorStyle: 'block',
      allowTransparency: true,
      windowsMode: false,
    });

    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();
    
    terminal.loadAddon(fitAddon);
    terminal.loadAddon(webLinksAddon);

    const sessionId = Date.now().toString();
    const newSession: TerminalSession = {
      id: sessionId,
      name: `Terminal ${sessions.length + 1}`,
      terminal,
      fitAddon,
      isActive: true
    };

    setSessions(prev => [...prev, newSession]);
    setActiveSessionId(sessionId);

    // Initialize terminal
    setTimeout(() => {
      if (terminalContainerRef.current) {
        terminal.open(terminalContainerRef.current);
        fitAddon.fit();
        terminal.writeln('Welcome to Ultimate AI Dashboard Terminal');
        terminal.writeln('Connecting to project environment...\n');
        
        // Simulate command prompt
        terminal.write('$ ');
        
        setupTerminalHandlers(terminal, sessionId);
        connectToBackend(terminal, sessionId);
      }
    }, 0);
  };

  const setupTerminalHandlers = (terminal: Terminal, sessionId: string) => {
    let currentLine = '';
    let commandHistory: string[] = [];
    let historyIndex = -1;

    terminal.onData((data) => {
      const code = data.charCodeAt(0);
      
      // Handle special keys
      if (code === 13) { // Enter
        terminal.writeln('');
        handleCommand(currentLine, terminal, sessionId);
        commandHistory.push(currentLine);
        historyIndex = commandHistory.length;
        currentLine = '';
      } else if (code === 127) { // Backspace
        if (currentLine.length > 0) {
          currentLine = currentLine.slice(0, -1);
          terminal.write('\b \b');
        }
      } else if (code === 27) { // Escape sequences
        // Handle arrow keys for history
        if (data === '\x1b[A' && historyIndex > 0) { // Up arrow
          historyIndex--;
          // Clear current line
          terminal.write('\r$ ' + ' '.repeat(currentLine.length) + '\r$ ');
          currentLine = commandHistory[historyIndex];
          terminal.write(currentLine);
        } else if (data === '\x1b[B' && historyIndex < commandHistory.length - 1) { // Down arrow
          historyIndex++;
          terminal.write('\r$ ' + ' '.repeat(currentLine.length) + '\r$ ');
          currentLine = commandHistory[historyIndex];
          terminal.write(currentLine);
        }
      } else if (code >= 32) { // Printable characters
        currentLine += data;
        terminal.write(data);
      }
    });
  };

  const connectToBackend = (terminal: Terminal, sessionId: string) => {
    // Simulate WebSocket connection to backend
    // In production, connect to actual terminal backend
    
    // For now, simulate local terminal
    terminal.onData((data) => {
      // Echo back for demo
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'input',
          sessionId,
          data
        }));
      }
    });
  };

  const handleCommand = (command: string, terminal: Terminal, sessionId: string) => {
    const cmd = command.trim().toLowerCase();
    
    // Simulate command execution
    if (cmd === 'help') {
      terminal.writeln('Available commands:');
      terminal.writeln('  help     - Show this help message');
      terminal.writeln('  clear    - Clear the terminal');
      terminal.writeln('  ls       - List files');
      terminal.writeln('  pwd      - Print working directory');
      terminal.writeln('  npm      - Run npm commands');
      terminal.writeln('  git      - Run git commands');
      terminal.writeln('  exit     - Close terminal session');
    } else if (cmd === 'clear') {
      terminal.clear();
    } else if (cmd === 'ls') {
      terminal.writeln('src/');
      terminal.writeln('  App.tsx');
      terminal.writeln('  index.tsx');
      terminal.writeln('  components/');
      terminal.writeln('package.json');
      terminal.writeln('README.md');
    } else if (cmd === 'pwd') {
      terminal.writeln(`/projects/${projectId}`);
    } else if (cmd.startsWith('npm')) {
      terminal.writeln('Running npm command...');
      setTimeout(() => {
        if (cmd === 'npm install') {
          terminal.writeln('\nInstalling dependencies...');
          terminal.writeln('✓ Dependencies installed successfully');
        } else if (cmd === 'npm start') {
          terminal.writeln('\nStarting development server...');
          terminal.writeln('Server running at http://localhost:3000');
        } else if (cmd === 'npm test') {
          terminal.writeln('\nRunning tests...');
          terminal.writeln('✓ All tests passed!');
        }
        terminal.write('\n$ ');
      }, 1000);
      return;
    } else if (cmd.startsWith('git')) {
      if (cmd === 'git status') {
        terminal.writeln('On branch main');
        terminal.writeln('Your branch is up to date with \'origin/main\'.');
        terminal.writeln('\nnothing to commit, working tree clean');
      } else if (cmd === 'git log') {
        terminal.writeln('commit a1b2c3d (HEAD -> main)');
        terminal.writeln('Author: Developer <dev@example.com>');
        terminal.writeln('Date:   ' + new Date().toDateString());
        terminal.writeln('\n    Initial commit');
      }
    } else if (cmd === 'exit') {
      terminal.writeln('Closing terminal session...');
      closeSession(sessionId);
      return;
    } else if (cmd === '') {
      // Empty command, do nothing
    } else {
      terminal.writeln(`Command not found: ${command}`);
    }
    
    terminal.write('$ ');
  };

  const closeSession = (sessionId: string) => {
    setSessions(prev => {
      const newSessions = prev.filter(s => s.id !== sessionId);
      if (activeSessionId === sessionId && newSessions.length > 0) {
        setActiveSessionId(newSessions[0].id);
      } else if (newSessions.length === 0) {
        setActiveSessionId(null);
      }
      return newSessions;
    });
  };

  const clearTerminal = () => {
    const activeSession = sessions.find(s => s.id === activeSessionId);
    if (activeSession) {
      activeSession.terminal.clear();
    }
  };

  const copyTerminalContent = () => {
    const activeSession = sessions.find(s => s.id === activeSessionId);
    if (activeSession) {
      const selection = activeSession.terminal.getSelection();
      if (selection) {
        navigator.clipboard.writeText(selection);
      }
    }
  };

  const activeSession = sessions.find(s => s.id === activeSessionId);

  useEffect(() => {
    // Update terminal display when switching sessions
    if (activeSession && terminalContainerRef.current) {
      terminalContainerRef.current.innerHTML = '';
      activeSession.terminal.open(terminalContainerRef.current);
      activeSession.fitAddon.fit();
    }
  }, [activeSessionId]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      sessions.forEach(session => {
        if (session.fitAddon) {
          session.fitAddon.fit();
        }
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sessions]);

  return (
    <div className={`${className} ${isMaximized ? 'fixed inset-0 z-50' : 'h-full'} bg-gray-950 flex flex-col`}>
      {/* Terminal Header */}
      <div className="flex items-center justify-between p-2 border-b border-white/10 bg-gray-900">
        <div className="flex items-center gap-2">
          <TerminalIcon className="h-4 w-4 text-green-400" />
          <span className="text-sm font-medium">Terminal</span>
          {sessions.length > 0 && (
            <div className="flex items-center gap-1">
              {sessions.map(session => (
                <Button
                  key={session.id}
                  size="sm"
                  variant={session.id === activeSessionId ? 'default' : 'ghost'}
                  className="h-6 px-2 text-xs"
                  onClick={() => setActiveSessionId(session.id)}
                >
                  {session.name}
                  {sessions.length > 1 && (
                    <X
                      className="h-3 w-3 ml-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        closeSession(session.id);
                      }}
                    />
                  )}
                </Button>
              ))}
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={createNewSession}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            onClick={copyTerminalContent}
          >
            <Copy className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            onClick={clearTerminal}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            onClick={() => setIsMaximized(!isMaximized)}
          >
            {isMaximized ? (
              <Minimize2 className="h-3 w-3" />
            ) : (
              <Maximize2 className="h-3 w-3" />
            )}
          </Button>
        </div>
      </div>
      
      {/* Terminal Content */}
      <div className="flex-1 p-2">
        <div
          ref={terminalContainerRef}
          className="h-full w-full"
          style={{ backgroundColor: '#0d1117' }}
        />
      </div>
      
      {/* Status Bar */}
      <div className="flex items-center justify-between px-2 py-1 border-t border-white/10 bg-gray-900 text-xs">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs bg-green-500/10 text-green-400">
            Connected
          </Badge>
          <span className="text-gray-400">UTF-8</span>
          <span className="text-gray-400">bash</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <span>Ln 1, Col 1</span>
        </div>
      </div>
    </div>
  );
}