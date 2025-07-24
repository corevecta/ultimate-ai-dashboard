import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'

const execAsync = promisify(exec)

// Path to the actual AI pipeline Step 0
const PIPELINE_DIR = '/home/sali/ai/projects/projecthubv3/ai-enhanced-pipeline'
const STEP0_SCRIPT = path.join(PIPELINE_DIR, 'step0.sh')

interface Step0GenerateRequest {
  name: string
  type: string
  description: string
}

export async function POST(request: Request) {
  try {
    const body: Step0GenerateRequest = await request.json()
    const { name, type, description } = body

    if (!name || !type || !description) {
      return NextResponse.json(
        { error: 'Missing required fields: name, type, description' },
        { status: 400 }
      )
    }

    // Prepare the input for Step 0 of the actual pipeline
    // Step 0 expects a simple text description and generates comprehensive requirements
    const fullDescription = `Project Name: ${name}
Project Type: ${type}
Description: ${description}

Generate comprehensive requirements for this ${type} project. Include all standard sections expected by Step 1 of the pipeline including technical requirements, UI/UX design, features, performance requirements, security considerations, and deployment strategy. Make it detailed and production-ready.`

    try {
      // Call the actual Step 0 of the pipeline
      // Note: In production, this would be done through the orchestrator service
      const command = `cd ${PIPELINE_DIR} && echo "${fullDescription.replace(/"/g, '\\"').replace(/\n/g, '\\n')}" | ./step0.sh`
      
      console.log('Executing Step 0 of pipeline...')
      const { stdout, stderr } = await execAsync(command, {
        maxBuffer: 1024 * 1024 * 10, // 10MB buffer
        timeout: 60000 // 60 second timeout
      })

      if (stderr && !stderr.includes('WARNING')) {
        console.error('Step 0 stderr:', stderr)
      }

      // Step 0 should output the generated requirements
      const requirements = stdout.trim()

      if (!requirements || requirements.length < 100) {
        throw new Error('Step 0 did not generate valid requirements')
      }

      return NextResponse.json({
        success: true,
        requirements,
        metadata: {
          generator: 'ai-enhanced-pipeline-step0',
          timestamp: new Date().toISOString(),
          inputLength: description.length,
          outputLength: requirements.length
        }
      })

    } catch (pipelineError: any) {
      console.error('Pipeline execution error:', pipelineError)
      
      // Fallback to orchestrator API if pipeline script fails
      const orchestratorUrl = process.env.ORCHESTRATOR_URL || 'http://localhost:8080'
      
      try {
        const orchestratorResponse = await fetch(`${orchestratorUrl}/api/step0/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, type, description }),
          signal: AbortSignal.timeout(30000) // 30 second timeout
        })

        if (!orchestratorResponse.ok) {
          throw new Error(`Orchestrator returned ${orchestratorResponse.status}`)
        }

        const data = await orchestratorResponse.json()
        return NextResponse.json({
          success: true,
          requirements: data.requirements || data.output,
          metadata: {
            generator: 'orchestrator-step0',
            ...data.metadata
          }
        })

      } catch (orchestratorError) {
        console.error('Orchestrator fallback failed:', orchestratorError)
        
        // If both fail, use the mock generator as last resort
        const mockResponse = await fetch(`${request.headers.get('origin')}/api/orchestrator/generate-requirements`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, type, description })
        })

        if (mockResponse.ok) {
          const mockData = await mockResponse.json()
          return NextResponse.json({
            ...mockData,
            metadata: {
              ...mockData.metadata,
              generator: 'mock-fallback'
            }
          })
        }

        throw new Error('All requirement generation methods failed')
      }
    }

  } catch (error: any) {
    console.error('Error in Step 0 generation:', error)
    return NextResponse.json(
      { error: 'Failed to generate requirements', details: error.message },
      { status: 500 }
    )
  }
}