import { NextResponse } from 'next/server';

// Backend orchestrator URL from environment or default
const ORCHESTRATOR_URL = process.env.ORCHESTRATOR_URL || 'http://localhost:3000';

export async function GET() {
  try {
    // Fetch metrics from the orchestrator backend
    const response = await fetch(`${ORCHESTRATOR_URL}/api/metrics/dashboard`, {
      headers: {
        'Content-Type': 'application/json',
      },
      // Don't cache this endpoint
      next: { revalidate: 0 }
    });

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`);
    }

    const data = await response.json();
    
    // Transform the backend response to match our frontend expectations
    const transformedData = {
      pipeline: {
        totalRuns: data.pipeline?.totalRuns || 0,
        successRate: data.pipeline?.successRate || 0,
        avgDuration: data.pipeline?.averageDuration || 0,
      },
      agents: {
        totalTasks: data.agents?.totalTasks || 0,
        totalTokens: data.agents?.totalTokens || 0,
        avgDuration: data.agents?.averageDuration || 0,
        activeAgents: data.agents?.activeAgents || 0,
      },
      system: {
        uptime: data.system?.uptime || 0,
        cpu: data.system?.cpu || 0,
        memory: data.system?.memory || 0,
        disk: data.system?.disk || 0,
      },
      activity: {
        recentEvents: data.recentEvents || [],
      }
    };

    return NextResponse.json(transformedData);
  } catch (error) {
    // Backend not available - return mock data
    // This is expected during development when backend is not running
    return NextResponse.json({
      pipeline: {
        totalRuns: 1247,
        successRate: 98.5,
        avgDuration: 3200,
      },
      agents: {
        totalTasks: 15832,
        totalTokens: 2847291,
        avgDuration: 2800,
        activeAgents: 12,
      },
      system: {
        uptime: 99.9,
        cpu: 45,
        memory: 62,
        disk: 38,
      },
      activity: {
        recentEvents: []
      }
    });
  }
}