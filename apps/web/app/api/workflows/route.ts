import { NextResponse } from 'next/server';

// Store workflows in memory for now (in production, use a database)
const workflows: any[] = [];

export async function GET() {
  // Return current workflows (pipeline executions)

  // Return mock workflows if backend is unavailable
  const mockWorkflows = [
    {
      id: 'wf-001',
      name: 'E-Commerce Platform Generation',
      description: 'Full-stack e-commerce application with AI-powered features',
      status: 'completed',
      type: 'full-stack',
      progress: 100,
      phases: [
        { name: 'Idea Expansion', status: 'completed', duration: 2300 },
        { name: 'Market Analysis', status: 'completed', duration: 5100 },
        { name: 'UI/UX Design', status: 'completed', duration: 4200 },
        { name: 'Implementation', status: 'completed', duration: 8500 },
        { name: 'Security Audit', status: 'completed', duration: 3200 },
        { name: 'QA Testing', status: 'completed', duration: 4100 },
        { name: 'Deployment', status: 'completed', duration: 1800 },
      ],
      metrics: {
        totalDuration: 29200,
        tokensUsed: 458230,
        filesGenerated: 156,
        successRate: 100,
      },
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'wf-002',
      name: 'Analytics Dashboard',
      description: 'Real-time data visualization platform with ML insights',
      status: 'running',
      type: 'frontend',
      progress: 65,
      currentPhase: 'Implementation',
      phases: [
        { name: 'Idea Expansion', status: 'completed', duration: 1800 },
        { name: 'Market Analysis', status: 'completed', duration: 3600 },
        { name: 'UI/UX Design', status: 'completed', duration: 3900 },
        { name: 'Implementation', status: 'running', progress: 65 },
        { name: 'Security Audit', status: 'pending' },
        { name: 'QA Testing', status: 'pending' },
        { name: 'Deployment', status: 'pending' },
      ],
      metrics: {
        totalDuration: 9300,
        tokensUsed: 234567,
        filesGenerated: 89,
        successRate: 100,
      },
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'wf-003',
      name: 'AI Chat Assistant',
      description: 'Intelligent conversational AI with custom knowledge base',
      status: 'queued',
      type: 'ai-service',
      progress: 0,
      phases: [
        { name: 'Idea Expansion', status: 'pending' },
        { name: 'Market Analysis', status: 'pending' },
        { name: 'UI/UX Design', status: 'pending' },
        { name: 'Implementation', status: 'pending' },
        { name: 'Security Audit', status: 'pending' },
        { name: 'QA Testing', status: 'pending' },
        { name: 'Deployment', status: 'pending' },
      ],
      metrics: {
        totalDuration: 0,
        tokensUsed: 0,
        filesGenerated: 0,
        successRate: 0,
      },
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'wf-004',
      name: 'Mobile Banking App',
      description: 'Secure mobile banking solution with biometric authentication',
      status: 'failed',
      type: 'mobile',
      progress: 45,
      failedPhase: 'Security Audit',
      error: 'Security vulnerabilities detected in authentication flow',
      phases: [
        { name: 'Idea Expansion', status: 'completed', duration: 2100 },
        { name: 'Market Analysis', status: 'completed', duration: 4200 },
        { name: 'UI/UX Design', status: 'completed', duration: 3800 },
        { name: 'Implementation', status: 'completed', duration: 7200 },
        { name: 'Security Audit', status: 'failed', duration: 2400 },
        { name: 'QA Testing', status: 'skipped' },
        { name: 'Deployment', status: 'skipped' },
      ],
      metrics: {
        totalDuration: 19700,
        tokensUsed: 342100,
        filesGenerated: 124,
        successRate: 71,
      },
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      failedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'wf-005',
      name: 'Social Media Platform',
      description: 'Next-gen social platform with AI content moderation',
      status: 'completed',
      type: 'full-stack',
      progress: 100,
      phases: [
        { name: 'Idea Expansion', status: 'completed', duration: 2800 },
        { name: 'Market Analysis', status: 'completed', duration: 6200 },
        { name: 'UI/UX Design', status: 'completed', duration: 5400 },
        { name: 'Implementation', status: 'completed', duration: 12000 },
        { name: 'Security Audit', status: 'completed', duration: 4100 },
        { name: 'QA Testing', status: 'completed', duration: 5200 },
        { name: 'Deployment', status: 'completed', duration: 2300 },
      ],
      metrics: {
        totalDuration: 38000,
        tokensUsed: 623400,
        filesGenerated: 234,
        successRate: 100,
      },
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      completedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  return NextResponse.json(mockWorkflows);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Create a new workflow (pipeline execution)
    const workflow = {
      id: 'wf-' + Date.now(),
      ...body,
      status: 'queued',
      progress: 0,
      createdAt: new Date().toISOString(),
      phases: [
        { name: 'Market Analysis', status: 'pending' },
        { name: 'UI/UX Design', status: 'pending' },
        { name: 'Implementation', status: 'pending' },
        { name: 'Security Audit', status: 'pending' },
        { name: 'QA Testing', status: 'pending' },
        { name: 'Deployment', status: 'pending' },
        { name: 'Monitoring', status: 'pending' }
      ],
      metrics: {
        totalDuration: 0,
        tokensUsed: 0,
        filesGenerated: 0,
        successRate: 0
      }
    };
    
    // Add to workflows array
    workflows.push(workflow);
    
    return NextResponse.json(workflow);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to create workflow', details: error.message },
      { status: 500 }
    );
  }
}