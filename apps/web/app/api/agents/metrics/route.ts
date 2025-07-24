import { NextResponse } from 'next/server';

export async function GET() {
  // Return agent metrics based on our 0-8 pipeline steps
  const pipelineAgents = [
    {
      name: 'Inception (Step 0)',
      icon: 'Lightbulb',
      tasks: 2265, // Number of project specifications
      tokens: 2265 * 5000, // Estimated tokens per specification
      avgDuration: 1800,
      successRate: 100,
      lastActive: 'Complete',
      status: 'completed'
    },
    {
      name: 'Idea Expansion (Step 1)',
      icon: 'Brain',
      tasks: 2265, // All projects have step 1
      tokens: 2265 * 8000,
      avgDuration: 2400,
      successRate: 100,
      lastActive: 'Complete',
      status: 'completed'
    },
    {
      name: 'Market Analysis (Step 2)',
      icon: 'TrendingUp',
      tasks: 1233, // Market enhanced projects
      tokens: 1233 * 12000,
      avgDuration: 4500,
      successRate: 98.5,
      lastActive: 'Ready',
      status: 'idle'
    },
    {
      name: 'UI/UX Design (Step 3)',
      icon: 'Palette',
      tasks: 0,
      tokens: 0,
      avgDuration: 3600,
      successRate: 0,
      lastActive: 'Not started',
      status: 'idle'
    },
    {
      name: 'Implementation (Step 4)',
      icon: 'Code',
      tasks: 0,
      tokens: 0,
      avgDuration: 8000,
      successRate: 0,
      lastActive: 'Not started',
      status: 'idle'
    },
    {
      name: 'Security Audit (Step 5)',
      icon: 'Shield',
      tasks: 0,
      tokens: 0,
      avgDuration: 3200,
      successRate: 0,
      lastActive: 'Not started',
      status: 'idle'
    },
    {
      name: 'QA Testing (Step 6)',
      icon: 'TestTube',
      tasks: 0,
      tokens: 0,
      avgDuration: 4200,
      successRate: 0,
      lastActive: 'Not started',
      status: 'idle'
    },
    {
      name: 'Deployment (Step 7)',
      icon: 'Rocket',
      tasks: 0,
      tokens: 0,
      avgDuration: 2200,
      successRate: 0,
      lastActive: 'Not started',
      status: 'idle'
    },
    {
      name: 'Monitoring (Step 8)',
      icon: 'Activity',
      tasks: 0,
      tokens: 0,
      avgDuration: 1500,
      successRate: 0,
      lastActive: 'Not started',
      status: 'idle'
    }
  ];
  
  return NextResponse.json(pipelineAgents);
}