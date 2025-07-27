import { NextResponse } from 'next/server'
import { spawn } from 'child_process'
import { 
  generateJobId, 
  saveAuditLog, 
  type AuditLog 
} from '@/lib/audit-logger'
import { 
  validateRequirements, 
  fixRequirementsFormatting 
} from '@/lib/requirements-validator'
import { 
  getPlatformRequirements, 
  buildPlatformContext 
} from '@/lib/platform-requirements'
import {
  getPromptTemplate,
  fillPromptTemplate,
  recordPromptUsage
} from '@/lib/prompt-library'
import {
  createJob,
  getJob,
  processClaudeJob
} from '@/lib/job-queue'

interface OrchestratorStep0Request {
  // Basic info from UI
  projectId?: string  // Optional - only present when running from pipeline executor
  name: string
  type: string
  description: string
  
  // Business context from UI
  targetAudience: string
  industry: string
  geography: string[]
  budget: string
  timeline: string
  
  // Optional
  competitors?: string
  monetization?: string
  priorities?: string[]
  compliance?: string[]
}

export async function POST(request: Request) {
  const jobId = generateJobId()
  const startTime = Date.now()
  
  // Initialize audit log
  const auditLog: AuditLog = {
    jobId,
    timestamp: new Date(),
    platform: '',
    projectName: '',
    promptLength: 0,
    success: false,
    model: 'claude-cli-orchestrator'
  }

  try {
    const data: OrchestratorStep0Request = await request.json()

    // Validate inputs
    if (!data.name || !data.type || !data.description) {
      auditLog.error = 'Missing required fields'
      await saveAuditLog(auditLog)
      return NextResponse.json(
        { error: 'Missing required fields', jobId },
        { status: 400 }
      )
    }

    // Update audit log with project info
    auditLog.platform = data.type
    auditLog.projectName = data.name

    // Build the prompt for the LLM with all context
    const timestamp = Date.now()
    const prompt = await buildEnhancedLLMPrompt(data, timestamp)
    auditLog.promptLength = prompt.length
    
    // Create async job for Claude CLI
    const job = createJob('claude-cli', { prompt })
    
    // Start processing in background
    processClaudeJob(job.id, prompt)
    
    // Return immediately with job ID
    return NextResponse.json({
      success: true,
      jobId: job.id,
      message: 'Requirements generation started',
      metadata: {
        generator: 'claude-cli-orchestrator',
        model: 'claude-3-sonnet',
        mcp_context: true,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error: any) {
    console.error('Orchestrator error:', error)
    auditLog.error = error.message
    await saveAuditLog(auditLog)
    
    return NextResponse.json(
      { error: 'Orchestrator processing failed', details: error.message, jobId },
      { status: 500 }
    )
  }
}

// New endpoint to check job status
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const jobId = searchParams.get('jobId')
  
  if (!jobId) {
    return NextResponse.json(
      { error: 'Missing jobId parameter' },
      { status: 400 }
    )
  }
  
  const job = getJob(jobId)
  
  if (!job) {
    return NextResponse.json(
      { error: 'Job not found' },
      { status: 404 }
    )
  }
  
  // If job is completed, include the requirements
  if (job.status === 'completed' && job.output) {
    const requirements = cleanLLMResponse(job.output)
    const validation = validateRequirements(requirements, job.input.type || 'web-app')
    
    return NextResponse.json({
      status: job.status,
      requirements,
      validation: {
        isValid: validation.isValid,
        coverage: validation.metrics.coverage,
        warnings: validation.warnings
      },
      metadata: {
        generator: 'claude-cli-orchestrator',
        model: 'claude-3-sonnet',
        mcp_context: true,
        timestamp: job.completedAt?.toISOString(),
        responseTime: job.completedAt && job.startedAt 
          ? job.completedAt.getTime() - job.startedAt.getTime()
          : undefined
      }
    })
  }
  
  // Return current status
  return NextResponse.json({
    status: job.status,
    error: job.error,
    createdAt: job.createdAt,
    startedAt: job.startedAt
  })
}

async function buildEnhancedLLMPrompt(data: OrchestratorStep0Request, timestamp: number): Promise<string> {
  // Get platform-specific context
  const platformContext = buildPlatformContext(data.type)
  
  // Get prompt template for platform
  const template = await getPromptTemplate(data.type)
  
  if (template) {
    // Use template-based prompt
    const values = {
      name: data.name,
      type: data.type,
      description: data.description,
      targetAudience: data.targetAudience,
      industry: data.industry,
      budget: data.budget,
      timeline: data.timeline,
      geography: data.geography.join(', '),
      priorities: data.priorities?.length ? `Key Priorities: ${data.priorities.join(', ')}` : '',
      monetization: data.monetization ? `Monetization: ${data.monetization}` : '',
      platformContext
    }
    
    return fillPromptTemplate(template.template, values)
  }
  
  // Fallback to basic prompt
  return buildBasicPrompt(data, platformContext, timestamp)
}

function buildBasicPrompt(data: OrchestratorStep0Request, platformContext: string, timestamp: number): string {
  const monetizationInfo = data.monetization ? `\nMonetization Model: ${data.monetization}` : ''
  
  return `You are an expert software architect and requirements analyst. Generate comprehensive project requirements for the following project.

PROJECT DETAILS:
- Name: ${data.name}
- Type: ${data.type}
- Description: ${data.description}
- Target Audience: ${data.targetAudience}
- Industry: ${data.industry}
- Geography: ${data.geography.join(', ')}
- Budget: ${data.budget}
- Timeline: ${data.timeline}${monetizationInfo}
${data.priorities?.length ? `- Priorities: ${data.priorities.join(', ')}` : ''}
${data.competitors ? `- Similar to: ${data.competitors}` : ''}

PLATFORM CONTEXT:
${platformContext}

GENERATE A COMPREHENSIVE REQUIREMENTS DOCUMENT WITH THESE SECTIONS:
1. Project Overview (expand on the description)
2. Core Features (10-15 specific features for ${data.type})
3. Technical Requirements (architecture, tech stack, integrations)
4. UI/UX Requirements 
5. Security & Compliance
6. Performance Requirements
7. Data Management
8. Testing Strategy
9. Deployment & Operations
10. Success Metrics
11. Timeline & Milestones
12. Budget Considerations

IMPORTANT:
- Be specific and detailed for each section
- Include modern best practices for ${data.type}
- Consider ${data.industry} industry requirements
- Account for ${data.targetAudience} needs
- Format as clean markdown
- Start with # ${data.name}
- Use proper markdown headers (##) for sections
- Include bullet points for lists
- Be comprehensive but concise

OUTPUT FORMAT: Return ONLY the markdown requirements document. Do not include any preamble or explanation.
`
}

function cleanLLMResponse(response: string): string {
  // Remove any system messages or extra formatting
  let cleaned = response.trim()
  
  // Remove potential wrapper text
  const startMarkers = ['```markdown', '```md', 'Here is the requirements document:', 'Here are the requirements:']
  const endMarkers = ['```']
  
  for (const marker of startMarkers) {
    const idx = cleaned.indexOf(marker)
    if (idx !== -1) {
      cleaned = cleaned.substring(idx + marker.length).trim()
    }
  }
  
  for (const marker of endMarkers) {
    const idx = cleaned.lastIndexOf(marker)
    if (idx !== -1 && idx > cleaned.length - 10) {
      cleaned = cleaned.substring(0, idx).trim()
    }
  }
  
  return cleaned
}