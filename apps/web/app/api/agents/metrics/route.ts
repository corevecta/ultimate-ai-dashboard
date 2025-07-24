import { NextResponse } from 'next/server';

const ORCHESTRATOR_URL = process.env.ORCHESTRATOR_URL || 'http://localhost:3000';

export async function GET() {
  try {
    // Try to fetch agent metrics from the backend
    const response = await fetch(`${ORCHESTRATOR_URL}/api/agents/metrics`, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 0 }
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data);
    }
    
    throw new Error('Backend not available');
  } catch (error) {
    // Backend not available - return mock data
    // This is expected during development when backend is not running
    const mockAgents = [
      {
        name: 'Code Review',
        icon: 'Code',
        tasks: 156,
        tokens: 45230,
        avgDuration: 3200,
        successRate: 98.5,
        lastActive: '2 min ago',
        status: 'active'
      },
      {
        name: 'Security',
        icon: 'Shield',
        tasks: 89,
        tokens: 32100,
        avgDuration: 4500,
        successRate: 99.2,
        lastActive: '5 min ago',
        status: 'idle'
      },
      {
        name: 'Testing',
        icon: 'TestTube',
        tasks: 234,
        tokens: 67800,
        avgDuration: 2800,
        successRate: 95.8,
        lastActive: 'just now',
        status: 'busy'
      },
      {
        name: 'Documentation',
        icon: 'FileText',
        tasks: 67,
        tokens: 23400,
        avgDuration: 1800,
        successRate: 97.3,
        lastActive: '10 min ago',
        status: 'idle'
      },
      {
        name: 'UI/UX',
        icon: 'FileSearch',
        tasks: 45,
        tokens: 18900,
        avgDuration: 3600,
        successRate: 96.4,
        lastActive: '15 min ago',
        status: 'idle'
      },
      {
        name: 'Deployment',
        icon: 'Package',
        tasks: 78,
        tokens: 15600,
        avgDuration: 2200,
        successRate: 99.8,
        lastActive: '3 min ago',
        status: 'active'
      }
    ];
    
    return NextResponse.json(mockAgents);
  }
}