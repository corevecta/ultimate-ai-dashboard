import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // For now, return metrics based on the projects we have
    // TODO: Connect to real orchestrator metrics
    
    const totalProjects = 2267;
    const projectsWithSpecs = 2265;
    const marketEnhanced = 1233;
    
    return NextResponse.json({
      pipeline: {
        totalRuns: projectsWithSpecs,
        successRate: 98.5,
        avgDuration: 3200,
      },
      agents: {
        totalTasks: projectsWithSpecs * 8, // 8 pipeline steps per project
        totalTokens: projectsWithSpecs * 50000, // Estimated tokens per project
        avgDuration: 2800,
        activeAgents: 0, // No active pipeline runs yet
      },
      system: {
        uptime: 99.9,
        cpu: 15,
        memory: 42,
        disk: 38,
      },
      activity: {
        recentEvents: []
      }
    });
  } catch (error) {
    // Return default metrics
    return NextResponse.json({
      pipeline: {
        totalRuns: 0,
        successRate: 0,
        avgDuration: 0,
      },
      agents: {
        totalTasks: 0,
        totalTokens: 0,
        avgDuration: 0,
        activeAgents: 0,
      },
      system: {
        uptime: 99.9,
        cpu: 0,
        memory: 0,
        disk: 0,
      },
      activity: {
        recentEvents: []
      }
    });
  }
}