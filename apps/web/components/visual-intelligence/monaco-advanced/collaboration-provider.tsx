'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';
import * as Y from 'yjs';
// import { WebsocketProvider } from 'y-websocket';
// import { MonacoBinding } from 'y-monaco';
// import { Awareness } from 'y-protocols/awareness';

interface CollaborationProviderProps {
  projectId: string;
  children: ReactNode;
  onCollaboratorsChange?: (collaborators: Collaborator[]) => void;
}

interface Collaborator {
  id: number;
  name: string;
  color: string;
  cursor?: {
    line: number;
    column: number;
  };
}

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#F7DC6F', '#BB8FCE',
  '#85C1E2', '#F8C471', '#82E0AA', '#F1948A', '#D7BDE2'
];

export function CollaborationProvider({ 
  projectId, 
  children, 
  onCollaboratorsChange 
}: CollaborationProviderProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);

  useEffect(() => {
    // Mock collaboration for demo
    setTimeout(() => {
      setIsConnected(true);
      
      // Simulate some collaborators
      const mockCollaborators: Collaborator[] = [
        {
          id: 1,
          name: 'Alice Developer',
          color: '#FF6B6B',
          cursor: { line: 10, column: 15 }
        },
        {
          id: 2,
          name: 'Bob Engineer',
          color: '#4ECDC4',
          cursor: { line: 25, column: 8 }
        }
      ];
      
      setCollaborators(mockCollaborators);
      onCollaboratorsChange?.(mockCollaborators);
    }, 1000);

    return () => {
      setIsConnected(false);
      setCollaborators([]);
    };
  }, [projectId, onCollaboratorsChange]);

  // Mock functions for demo
  function getUserId(): string {
    return localStorage.getItem('userId') || Math.random().toString(36).substring(7);
  }

  function getUserName(): string {
    return localStorage.getItem('userName') || `User ${Math.floor(Math.random() * 1000)}`;
  }

  function getRandomColor(): string {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
  }

  return (
    <>
      {children}
      {/* Collaboration Status Indicator */}
      <div className="absolute top-2 right-2 z-10">
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
          isConnected ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            isConnected ? 'bg-green-400' : 'bg-gray-400'
          } ${isConnected ? 'animate-pulse' : ''}`} />
          {isConnected ? 'Connected' : 'Offline'}
        </div>
      </div>
      
      {/* Collaborator Cursors */}
      {collaborators.map(collaborator => (
        collaborator.cursor && (
          <div
            key={collaborator.id}
            className="absolute pointer-events-none z-20"
            style={{
              left: `${collaborator.cursor.column * 8}px`,
              top: `${collaborator.cursor.line * 20}px`,
            }}
          >
            <div
              className="w-0.5 h-5"
              style={{ backgroundColor: collaborator.color }}
            />
            <div
              className="px-2 py-0.5 rounded text-xs text-white whitespace-nowrap"
              style={{ backgroundColor: collaborator.color }}
            >
              {collaborator.name}
            </div>
          </div>
        )
      ))}
    </>
  );
}