import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import { promises as fs } from 'fs'
import { getProjectTypeInfo, getProjectCategory } from '@/lib/project-types'

const execAsync = promisify(exec)

interface Step0Request {
  name: string
  type: string
  description: string
}

function getPlatformContext(type: string): string {
  const typeInfo = getProjectTypeInfo(type)
  if (typeInfo) {
    // Return both the category and the specific name for better context
    return `${typeInfo.category} - ${typeInfo.name}`
  }
  // Fallback: try to infer from the type ID
  return type.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
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

    // Create the idea text for Step 0 V2 with platform context
    const platformContext = getPlatformContext(type)
    const idea = `${name}: ${description}

Platform: ${platformContext}
Type: ${type}`
    
    // Generate project slug
    const projectSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    // Create a temporary Step 0 runner script
    const tempRunnerPath = `/tmp/run-step0-${Date.now()}.ts`
    const tempOutputDir = `/tmp/step0-output-${Date.now()}`
    
    const runnerScript = `#!/usr/bin/env node
import { Step0IdeaToMarkdownEnhancedV2, IdeaExpansionConfig } from '${path.join('/home/sali/ai/projects/projecthubv3/ai-enhanced-pipeline/src/steps/step0-idea-to-markdown-enhanced-v2.js')}';
import { PipelineConfig } from '${path.join('/home/sali/ai/projects/projecthubv3/ai-enhanced-pipeline/src/types/index.js')}';
import { promises as fs } from 'fs';

async function runStep0() {
  const config = {
    projectSlug: '${projectSlug}',
    outputDir: '${tempOutputDir}',
    model: 'sonnet',
    verbose: false,
    maxSteps: 1,
    skipExisting: false,
    parallel: false,
    retries: 2,
    timeout: 60000
  };

  const ideaConfig = {
    idea: \`${idea.replace(/`/g, '\\`')}\`,
    category: '${getProjectCategory(type)}',
    projectsPath: '/home/sali/ai/projects/projecthubv3/projects'
  };

  try {
    await fs.mkdir('${tempOutputDir}', { recursive: true });
    
    const step0 = new Step0IdeaToMarkdownEnhancedV2(config, ideaConfig);
    const result = await step0.execute();
    
    if (result.success && result.outputFiles) {
      const requirements = await fs.readFile(result.outputFiles[0], 'utf-8');
      console.log('---REQUIREMENTS START---');
      console.log(requirements);
      console.log('---REQUIREMENTS END---');
      console.log('---METADATA START---');
      console.log(JSON.stringify({
        success: true,
        duration: result.duration,
        files: result.outputFiles
      }));
      console.log('---METADATA END---');
    } else {
      console.error('Step 0 failed:', result.error);
      process.exit(1);
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

runStep0();
`

    try {
      // Write the runner script
      await fs.writeFile(tempRunnerPath, runnerScript, 'utf-8')
      
      // Execute the runner
      const pipelineDir = '/home/sali/ai/projects/projecthubv3/ai-enhanced-pipeline'
      const command = `cd ${pipelineDir} && npx tsx ${tempRunnerPath}`
      
      console.log('Executing Step 0 V2...')
      const { stdout, stderr } = await execAsync(command, {
        maxBuffer: 1024 * 1024 * 10, // 10MB
        timeout: 90000, // 90 seconds
        env: {
          ...process.env,
          NODE_ENV: 'production'
        }
      })

      // Clean up temp files
      await fs.unlink(tempRunnerPath).catch(() => {})
      await fs.rm(tempOutputDir, { recursive: true, force: true }).catch(() => {})

      if (stderr && !stderr.includes('WARNING') && !stderr.includes('ExperimentalWarning')) {
        console.error('Step 0 stderr:', stderr)
      }

      // Extract requirements from output
      const reqStart = stdout.indexOf('---REQUIREMENTS START---')
      const reqEnd = stdout.indexOf('---REQUIREMENTS END---')
      
      if (reqStart === -1 || reqEnd === -1) {
        throw new Error('Could not extract requirements from Step 0 output')
      }
      
      const requirements = stdout.substring(reqStart + 24, reqEnd).trim()
      
      // Extract metadata if available
      let metadata = {}
      const metaStart = stdout.indexOf('---METADATA START---')
      const metaEnd = stdout.indexOf('---METADATA END---')
      
      if (metaStart !== -1 && metaEnd !== -1) {
        try {
          metadata = JSON.parse(stdout.substring(metaStart + 20, metaEnd).trim())
        } catch {}
      }

      return NextResponse.json({
        success: true,
        requirements,
        metadata: {
          generator: 'ai-enhanced-pipeline-step0-v2',
          timestamp: new Date().toISOString(),
          ...metadata
        }
      })

    } catch (execError: any) {
      console.error('Step 0 V2 execution error:', execError)
      
      // Clean up on error
      await fs.unlink(tempRunnerPath).catch(() => {})
      await fs.rm(tempOutputDir, { recursive: true, force: true }).catch(() => {})
      
      // Try orchestrator as fallback
      return await tryOrchestratorFallback(name, type, description, execError.message)
    }

  } catch (error: any) {
    console.error('Error in Step 0 V2:', error)
    return NextResponse.json(
      { error: 'Failed to generate requirements', details: error.message },
      { status: 500 }
    )
  }
}

async function tryOrchestratorFallback(name: string, type: string, description: string, originalError: string) {
  try {
    // Try orchestrator
    const orchestratorUrl = process.env.ORCHESTRATOR_URL || 'http://localhost:8080'
    const response = await fetch(`${orchestratorUrl}/api/pipeline/step0`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, type, description }),
      signal: AbortSignal.timeout(30000)
    })

    if (response.ok) {
      const data = await response.json()
      return NextResponse.json({
        ...data,
        metadata: {
          ...data.metadata,
          generator: 'orchestrator-fallback',
          originalError
        }
      })
    }
  } catch {}

  // Try mock as last resort
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
          originalError
        }
      })
    }
  } catch {}

  return NextResponse.json(
    { error: 'All generation methods failed', details: originalError },
    { status: 500 }
  )
}