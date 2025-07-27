import { NextResponse } from 'next/server'
import { 
  generateJobId, 
  saveAuditLog, 
  type AuditLog 
} from '@/lib/audit-logger'
import {
  createJob,
  getJob,
  processClaudeJob
} from '@/lib/job-queue'

interface OrchestratorStep1Request {
  projectId: string
  projectName: string
  projectType: string
  previousSteps: {
    step0?: {
      output: string  // Requirements from Step 0
      completedAt?: Date
    }
  }
  forceRegenerate?: boolean
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
    model: 'claude-cli-orchestrator-step1'
  }

  try {
    const data: OrchestratorStep1Request = await request.json()

    // Validate inputs
    if (!data.projectId || !data.projectName || !data.projectType) {
      auditLog.error = 'Missing required fields'
      await saveAuditLog(auditLog)
      return NextResponse.json(
        { error: 'Missing required fields', jobId },
        { status: 400 }
      )
    }

    // Check if we have requirements from Step 0
    if (!data.previousSteps?.step0?.output) {
      auditLog.error = 'Missing requirements from Step 0'
      await saveAuditLog(auditLog)
      return NextResponse.json(
        { error: 'Step 0 requirements must be completed first', jobId },
        { status: 400 }
      )
    }

    // Update audit log with project info
    auditLog.platform = data.projectType
    auditLog.projectName = data.projectName

    // Build the prompt for specification generation
    const prompt = buildSpecificationPrompt(data)
    auditLog.promptLength = prompt.length
    
    // Create async job for Claude CLI
    const job = createJob('claude-cli', { 
      prompt,
      step: 'step1',
      projectId: data.projectId
    })
    
    // Start processing in background
    processClaudeJob(job.id, prompt)
    
    // Return immediately with job ID
    return NextResponse.json({
      success: true,
      jobId: job.id,
      message: 'Specification generation started',
      metadata: {
        generator: 'claude-cli-orchestrator-step1',
        model: 'claude-3-sonnet',
        mcp_context: true,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error: any) {
    console.error('Orchestrator Step 1 error:', error)
    auditLog.error = error.message
    await saveAuditLog(auditLog)
    
    return NextResponse.json(
      { error: 'Orchestrator processing failed', details: error.message, jobId },
      { status: 500 }
    )
  }
}

// GET endpoint to check job status
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
  
  // If job is completed, include the specification
  if (job.status === 'completed' && job.output) {
    const specification = cleanLLMResponse(job.output)
    
    return NextResponse.json({
      status: job.status,
      specification,
      metadata: {
        generator: 'claude-cli-orchestrator-step1',
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

function buildSpecificationPrompt(data: OrchestratorStep1Request): string {
  const requirements = data.previousSteps.step0?.output || ''
  const timestamp = Date.now()
  
  const regenerateContext = data.forceRegenerate 
    ? '\nNOTE: This is a regeneration request. Create a fresh, updated specification that improves upon any previous versions.\n'
    : ''
  
  return `You are an expert software architect creating detailed technical specifications. 
You have been provided with comprehensive project requirements and need to create detailed technical specifications.

PROJECT CONTEXT:
- Project ID: ${data.projectId}
- Project Name: ${data.projectName}
- Project Type: ${data.projectType}
${regenerateContext}

PROJECT REQUIREMENTS:
${requirements}

CREATE A COMPREHENSIVE TECHNICAL SPECIFICATION WITH THESE SECTIONS:

## 1. System Overview
- High-level architecture diagram description
- Core components and their interactions
- Technology stack decisions with justifications
- Integration points and external dependencies

## 2. Database Design
- Entity-relationship diagrams
- Table schemas with field types and constraints
- Indexes and optimization strategies
- Data migration considerations

## 3. API Specifications
- RESTful endpoints or GraphQL schema
- Request/response formats with examples
- Authentication and authorization flows
- Rate limiting and security measures
- Error handling standards

## 4. Frontend Architecture
- Component hierarchy and structure
- State management approach
- Routing and navigation patterns
- UI/UX implementation details
- Responsive design breakpoints

## 5. Business Logic
- Core algorithms and workflows
- Business rules and validations
- Data processing pipelines
- Background jobs and scheduled tasks

## 6. Security Specifications
- Authentication implementation (JWT, OAuth, etc.)
- Authorization and role-based access control
- Data encryption standards
- Input validation and sanitization
- Security headers and CORS policies

## 7. Performance Specifications
- Caching strategies (Redis, CDN, etc.)
- Database query optimization
- Asset optimization and bundling
- Load balancing requirements
- Performance metrics and monitoring

## 8. Testing Strategy
- Unit testing approach and coverage goals
- Integration testing scenarios
- End-to-end testing requirements
- Performance testing benchmarks
- Security testing checklist

## 9. Deployment Architecture
- Infrastructure requirements
- Container specifications (Docker)
- CI/CD pipeline configuration
- Environment variables and secrets management
- Monitoring and logging setup

## 10. Development Standards
- Code style and linting rules
- Git workflow and branching strategy
- Code review checklist
- Documentation standards
- Dependency management

IMPORTANT:
- Be specific and include concrete examples
- Use modern best practices for ${data.projectType}
- Include code snippets where helpful
- Consider scalability from the start
- Address all features mentioned in requirements
- Format as clean markdown
- Start with # Technical Specification: ${data.projectName}

IMPORTANT: Write your complete response to this file: /tmp/step1-specification-${timestamp}.md

After writing the file, respond with only: DONE`
}

function cleanLLMResponse(response: string): string {
  // Remove any system messages or extra formatting
  let cleaned = response.trim()
  
  // Remove potential wrapper text
  const startMarkers = ['```markdown', '```md', 'Here is the technical specification:', 'Here are the specifications:']
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