import { NextResponse } from 'next/server'

// In-memory storage for pipeline status
// In production, use database or Redis
const pipelineStatus = new Map<string, any>()

export async function GET(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  const projectId = params.projectId
  
  // Get status from storage
  const status = pipelineStatus.get(projectId) || getDefaultPipelineStatus()
  
  return NextResponse.json(status)
}

export async function POST(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  const projectId = params.projectId
  const updates = await request.json()
  
  // Get current status
  const currentStatus = pipelineStatus.get(projectId) || getDefaultPipelineStatus()
  
  // Merge updates
  const newStatus = {
    ...currentStatus,
    ...updates,
    lastUpdated: new Date().toISOString()
  }
  
  // Save status
  pipelineStatus.set(projectId, newStatus)
  
  return NextResponse.json({
    success: true,
    status: newStatus
  })
}

function getDefaultPipelineStatus() {
  return {
    step0: {
      status: 'pending',
      name: 'Requirements',
      output: null,
      error: null,
      startTime: null,
      endTime: null,
      jobId: null
    },
    step1: {
      status: 'pending',
      name: 'Specification',
      output: null,
      error: null,
      startTime: null,
      endTime: null,
      jobId: null
    },
    step2: {
      status: 'pending',
      name: 'Architecture',
      output: null,
      error: null,
      startTime: null,
      endTime: null,
      jobId: null
    },
    step3: {
      status: 'pending',
      name: 'Setup',
      output: null,
      error: null,
      startTime: null,
      endTime: null,
      jobId: null
    },
    step4: {
      status: 'pending',
      name: 'Development',
      output: null,
      error: null,
      startTime: null,
      endTime: null,
      jobId: null
    },
    step5: {
      status: 'pending',
      name: 'Testing',
      output: null,
      error: null,
      startTime: null,
      endTime: null,
      jobId: null
    },
    step6: {
      status: 'pending',
      name: 'Documentation',
      output: null,
      error: null,
      startTime: null,
      endTime: null,
      jobId: null
    },
    step7: {
      status: 'pending',
      name: 'Deployment',
      output: null,
      error: null,
      startTime: null,
      endTime: null,
      jobId: null
    },
    step8: {
      status: 'pending',
      name: 'Optimization',
      output: null,
      error: null,
      startTime: null,
      endTime: null,
      jobId: null
    },
    lastUpdated: new Date().toISOString()
  }
}