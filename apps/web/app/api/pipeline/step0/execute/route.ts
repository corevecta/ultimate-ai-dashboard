import { NextResponse } from 'next/server'
import { Step0IdeaToMarkdownEnhanced, IdeaExpansionConfig } from '/home/sali/ai/projects/projecthubv3/ai-enhanced-pipeline/src/steps/step0-idea-to-markdown-enhanced.js'
import { PipelineConfig } from '/home/sali/ai/projects/projecthubv3/ai-enhanced-pipeline/src/types/index.js'
import path from 'path'
import { promises as fs } from 'fs'

interface Step0ExecuteRequest {
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
    const body: Step0ExecuteRequest = await request.json()
    const { name, type, description } = body

    if (!name || !type || !description) {
      return NextResponse.json(
        { error: 'Missing required fields: name, type, description' },
        { status: 400 }
      )
    }

    // Map the type to a category the pipeline understands
    const category = typeToCategory[type] || 'Web Application'
    
    // Generate a project slug from the name
    const projectSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    // Create a comprehensive idea description for Step 0
    const enhancedIdea = `${description}

Project Name: ${name}
Platform Type: ${type}
Category: ${category}

Context: This project is being created through the Ultimate AI Dashboard, a sophisticated platform with modern UI/UX design featuring dark themes, gradients, and glassmorphic effects. The project should follow modern development best practices, be scalable, maintainable, and production-ready.

Requirements: Generate comprehensive requirements including technical architecture, features, UI/UX design, performance metrics, security considerations, testing strategy, and deployment approach suitable for a ${category} targeting modern users.`

    // Configure the pipeline
    const outputDir = `/tmp/ai-pipeline-step0-${Date.now()}`
    
    const config: PipelineConfig = {
      projectSlug,
      outputDir,
      model: 'sonnet' as const,
      verbose: false,
      maxSteps: 1,
      skipExisting: false,
      parallel: false,
      retries: 2,
      timeout: 60000
    }

    const ideaConfig: IdeaExpansionConfig = {
      idea: enhancedIdea,
      category,
      targetAudience: 'General users', // Could be extracted from description
      projectsPath: '/home/sali/ai/projects/projecthubv3/projects',
      userPriorities: ['user-experience', 'performance', 'scalability'],
      geography: 'Global',
      compliance: [] // Could be inferred from industry/description
    }

    // Create output directory
    await fs.mkdir(outputDir, { recursive: true })

    try {
      // Execute Step 0 of the pipeline
      console.log('Executing Step 0 with config:', { projectSlug, category, outputDir })
      
      const step0 = new Step0IdeaToMarkdownEnhanced(config)
      const result = await step0.execute(ideaConfig)

      if (!result.success) {
        throw new Error(result.error || 'Step 0 execution failed')
      }

      // Read the generated requirements markdown
      const requirementsPath = path.join(outputDir, 'requirements.md')
      const contextPath = path.join(outputDir, 'context.yaml')
      
      let requirements = ''
      let context = null

      try {
        requirements = await fs.readFile(requirementsPath, 'utf-8')
      } catch (err) {
        console.error('Failed to read requirements:', err)
        // Try alternate path
        const altPath = path.join(outputDir, result.data?.requirementsFile || 'expanded-requirements.md')
        requirements = await fs.readFile(altPath, 'utf-8')
      }

      try {
        const contextContent = await fs.readFile(contextPath, 'utf-8')
        context = contextContent // Keep as string for now
      } catch (err) {
        console.log('No context.yaml found (optional)')
      }

      // Clean up temp directory
      await fs.rm(outputDir, { recursive: true, force: true })

      return NextResponse.json({
        success: true,
        requirements,
        context,
        metadata: {
          generator: 'ai-enhanced-pipeline-step0',
          model: config.model,
          category,
          timestamp: new Date().toISOString(),
          inputLength: description.length,
          outputLength: requirements.length,
          executionTime: result.data?.executionTime || 0,
          ...result.metadata
        }
      })

    } catch (executionError: any) {
      console.error('Step 0 execution error:', executionError)
      
      // Clean up on error
      try {
        await fs.rm(outputDir, { recursive: true, force: true })
      } catch {}

      // Try fallback to simple generation
      return fallbackGeneration(name, type, description, executionError.message)
    }

  } catch (error: any) {
    console.error('Error in Step 0 execution:', error)
    return NextResponse.json(
      { error: 'Failed to execute Step 0', details: error.message },
      { status: 500 }
    )
  }
}

// Fallback generation when pipeline fails
async function fallbackGeneration(name: string, type: string, description: string, originalError: string) {
  try {
    // Try the mock orchestrator endpoint as fallback
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
          generator: 'fallback-mock',
          originalError,
          fallbackReason: 'Pipeline execution failed'
        }
      })
    }
  } catch {}

  // Last resort: return error
  return NextResponse.json(
    { 
      error: 'Step 0 execution failed', 
      details: originalError,
      fallbackError: 'All generation methods failed'
    },
    { status: 500 }
  )
}