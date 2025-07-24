import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import { promises as fs } from 'fs'

const execAsync = promisify(exec)

interface Step0Request {
  name: string
  type: string
  description: string
}

// Map frontend types to pipeline categories
const typeToCategory: Record<string, string> = {
  'web-app': 'Web Application',
  'mobile-app': 'Mobile Application',
  'chrome-extension': 'Chrome Extension',
  'firefox-extension': 'Browser Extension',
  'safari-extension': 'Browser Extension',
  'edge-extension': 'Browser Extension',
  'browser-extension': 'Browser Extension',
  'api-service': 'API Service',
  'graphql-api': 'API Service',
  'microservice': 'Microservice',
  'cli-tool': 'CLI Tool',
  'desktop-app': 'Desktop Application',
  'electron-app': 'Desktop Application',
  'ai-agent': 'AI Agent',
  'ml-model': 'Machine Learning',
  'chatbot': 'AI Agent',
  'iot-device': 'IoT Device',
  'blockchain-app': 'Blockchain Application',
  'smart-contract': 'Smart Contract',
  'game': 'Game',
  'web-game': 'Game',
  'mobile-game': 'Game',
  'ecommerce-site': 'E-commerce Platform',
  'marketplace': 'E-commerce Platform',
  'dashboard': 'Dashboard',
  'data-pipeline': 'Data Pipeline',
  'devops-tool': 'DevOps Tool'
}

export async function POST(request: Request) {
  try {
    const body: Step0Request = await request.json()
    const { name, type, description } = body

    if (!name || !type || !description) {
      return NextResponse.json(
        { error: 'Missing required fields: name, type, description' },
        { status: 400 }
      )
    }

    // First try to call the actual orchestrator if it's running
    const orchestratorUrl = process.env.ORCHESTRATOR_URL || 'http://localhost:8080'
    
    try {
      console.log('Attempting to call orchestrator Step 0...')
      const orchestratorResponse = await fetch(`${orchestratorUrl}/api/pipeline/step0`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          type,
          description,
          // Add context about the dashboard
          context: {
            source: 'ultimate-ai-dashboard',
            ui_style: 'modern dark theme with gradients and glassmorphic effects',
            requirements_format: 'comprehensive markdown for Step 1'
          }
        }),
        signal: AbortSignal.timeout(30000) // 30 second timeout
      })

      if (orchestratorResponse.ok) {
        const data = await orchestratorResponse.json()
        console.log('Orchestrator Step 0 succeeded')
        
        return NextResponse.json({
          success: true,
          requirements: data.requirements || data.output || data.markdown,
          context: data.context,
          metadata: {
            generator: 'orchestrator-pipeline-step0',
            ...data.metadata
          }
        })
      } else {
        console.log(`Orchestrator returned ${orchestratorResponse.status}, falling back...`)
      }
    } catch (orchestratorError) {
      console.log('Orchestrator not available:', orchestratorError.message)
    }

    // Fallback: Try to execute Step 0 directly via CLI
    const pipelineDir = '/home/sali/ai/projects/projecthubv3/ai-enhanced-pipeline'
    const category = typeToCategory[type] || 'Web Application'
    
    const enhancedIdea = `${description}

Project Name: ${name}
Platform Type: ${type}
Category: ${category}

Context: This project is being created through the Ultimate AI Dashboard. Generate comprehensive requirements including technical architecture, features, UI/UX design, performance metrics, security considerations, testing strategy, and deployment approach suitable for a ${category}.`

    try {
      console.log('Attempting to run Step 0 via CLI...')
      
      // Create a temporary input file
      const tempInputFile = `/tmp/step0-input-${Date.now()}.txt`
      await fs.writeFile(tempInputFile, enhancedIdea, 'utf-8')
      
      // Execute Step 0 V2 script (simplified version)
      const command = `cd ${pipelineDir} && node test-step-0-v2.ts`
      
      const { stdout, stderr } = await execAsync(command, {
        maxBuffer: 1024 * 1024 * 10, // 10MB
        timeout: 60000, // 60 seconds
        env: {
          ...process.env,
          PIPELINE_MODE: 'requirements_only',
          OUTPUT_FORMAT: 'markdown'
        }
      })

      // Clean up temp file
      await fs.unlink(tempInputFile).catch(() => {})

      if (stderr && !stderr.includes('WARNING')) {
        console.error('Step 0 stderr:', stderr)
      }

      // Extract requirements from output
      const requirements = extractRequirements(stdout) || generateFallbackRequirements(name, type, description, category)

      return NextResponse.json({
        success: true,
        requirements,
        metadata: {
          generator: 'pipeline-cli-step0',
          category,
          timestamp: new Date().toISOString()
        }
      })

    } catch (cliError: any) {
      console.error('CLI execution failed:', cliError.message)
      
      // Final fallback: Use mock generator
      return await fallbackToMockGenerator(name, type, description)
    }

  } catch (error: any) {
    console.error('Error in Step 0:', error)
    return NextResponse.json(
      { error: 'Failed to generate requirements', details: error.message },
      { status: 500 }
    )
  }
}

function extractRequirements(output: string): string | null {
  // Try to extract markdown requirements from output
  // Look for markers that indicate the requirements section
  const markers = [
    '# Requirements',
    '# Project Requirements',
    '## Requirements',
    '---REQUIREMENTS START---',
    '```markdown'
  ]
  
  for (const marker of markers) {
    const startIdx = output.indexOf(marker)
    if (startIdx !== -1) {
      let endIdx = output.length
      
      // Look for end markers
      const endMarkers = ['---REQUIREMENTS END---', '```\n', '---END---']
      for (const endMarker of endMarkers) {
        const idx = output.indexOf(endMarker, startIdx)
        if (idx !== -1 && idx < endIdx) {
          endIdx = idx
        }
      }
      
      return output.substring(startIdx, endIdx).trim()
    }
  }
  
  // If no markers found but output looks like markdown, return it
  if (output.includes('#') && output.length > 500) {
    return output.trim()
  }
  
  return null
}

function generateFallbackRequirements(name: string, type: string, description: string, category: string): string {
  return `# ${name}

## Project Overview
${description}

## Project Type
${category} (${type})

## Technical Requirements
- Modern architecture suitable for ${category}
- Scalable and maintainable codebase
- Security best practices
- Performance optimization

## Features
- Core functionality as described
- User-friendly interface
- Responsive design
- Error handling and recovery

## Development Approach
- Agile methodology
- Test-driven development
- Continuous integration

## Notes
This is a preliminary requirements document. Full specifications will be generated in Step 1.`
}

async function fallbackToMockGenerator(name: string, type: string, description: string) {
  try {
    const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'
    const response = await fetch(`${origin}/api/orchestrator/generate-requirements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, type, description })
    })

    if (response.ok) {
      const data = await response.json()
      return NextResponse.json({
        ...data,
        metadata: {
          ...data.metadata,
          generator: 'mock-fallback',
          fallbackReason: 'Pipeline and orchestrator unavailable'
        }
      })
    }
  } catch {}

  return NextResponse.json(
    { error: 'All requirement generation methods failed' },
    { status: 500 }
  )
}