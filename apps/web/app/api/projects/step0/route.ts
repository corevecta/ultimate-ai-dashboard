import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const PROJECTS_DIR = '/home/sali/ai/projects/projecthubv3/projects'

interface Step0Data {
  name: string
  type: string
  description: string
  requirements?: string  // Full markdown requirements from orchestrator
}

function generateProjectId(name: string, type: string): string {
  // Convert name to lowercase, replace spaces with hyphens, remove special chars
  const cleanName = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
  
  // Use the standard naming convention: cvp-{type}-{descriptive-name}
  return `cvp-${type}-${cleanName}`
}

export async function POST(request: Request) {
  try {
    const data: Step0Data = await request.json()

    // Validate required fields
    if (!data.name || !data.type || !data.requirements) {
      return NextResponse.json(
        { error: 'Missing required fields: name, type, requirements' },
        { status: 400 }
      )
    }

    // Generate project ID using proper naming convention
    const projectId = generateProjectId(data.name, data.type)
    const projectPath = path.join(PROJECTS_DIR, projectId)
    const aiGenPath = path.join(projectPath, 'ai-generated')

    // Check if project already exists
    try {
      await fs.access(projectPath)
      return NextResponse.json(
        { error: `Project ${projectId} already exists. Please use a different name.` },
        { status: 409 }
      )
    } catch {
      // Directory doesn't exist, which is what we want
    }

    // Create directories
    await fs.mkdir(projectPath, { recursive: true })
    await fs.mkdir(aiGenPath, { recursive: true })

    // Write requirements.md file (from orchestrator)
    await fs.writeFile(
      path.join(projectPath, 'requirements.md'),
      data.requirements,
      'utf-8'
    )

    // Create project.json metadata
    const projectMetadata = {
      id: projectId,
      name: data.name,
      type: data.type,
      description: data.description,
      status: 'step-0-complete',
      createdAt: new Date().toISOString(),
      pipeline: {
        currentStep: 0,
        lastExecuted: new Date().toISOString(),
        steps: {
          0: { status: 'completed', completedAt: new Date().toISOString() },
          1: { status: 'pending' },
          2: { status: 'pending' },
          3: { status: 'pending' },
          4: { status: 'pending' },
          5: { status: 'pending' },
          6: { status: 'pending' },
          7: { status: 'pending' },
          8: { status: 'pending' }
        }
      }
    }

    await fs.writeFile(
      path.join(projectPath, 'project.json'),
      JSON.stringify(projectMetadata, null, 2),
      'utf-8'
    )

    // Create a pipeline execution workflow
    const pipelineWorkflow = {
      id: `workflow-${projectId}`,
      projectId,
      name: `Pipeline: ${data.name}`,
      type: 'pipeline-execution',
      status: 'pending',
      currentStep: 0,
      totalSteps: 8,
      steps: [
        { id: 0, name: 'Project Creation', status: 'completed', completedAt: new Date().toISOString() },
        { id: 1, name: 'Ideation & Refinement', status: 'pending' },
        { id: 2, name: 'Specification Generation', status: 'pending' },
        { id: 3, name: 'Market Analysis', status: 'pending' },
        { id: 4, name: 'Technical Architecture', status: 'pending' },
        { id: 5, name: 'Code Generation', status: 'pending' },
        { id: 6, name: 'Testing & Quality', status: 'pending' },
        { id: 7, name: 'Documentation', status: 'pending' },
        { id: 8, name: 'Deployment', status: 'pending' }
      ],
      createdAt: new Date().toISOString()
    }

    // In production, this would trigger the actual pipeline via orchestrator
    if (process.env.ORCHESTRATOR_URL) {
      try {
        // Notify orchestrator that Step 0 is complete and project is ready for Step 1
        await fetch(`${process.env.ORCHESTRATOR_URL}/api/pipeline/start`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectId,
            projectPath,
            startStep: 1,
            metadata: projectMetadata
          })
        })
      } catch (err) {
        console.error('Failed to notify orchestrator:', err)
        // Continue anyway - project is created
      }
    }

    // Return success response with pipeline info
    return NextResponse.json({
      success: true,
      projectId,
      message: 'Project created successfully',
      project: {
        id: projectId,
        name: data.name,
        type: data.type,
        status: 'step-0-complete',
        path: projectPath
      },
      pipeline: pipelineWorkflow,
      nextSteps: [
        'Your project has been created with comprehensive requirements',
        'Step 1 will generate 10+ project variations from these requirements',
        'Step 1 will convert requirements to a detailed YAML specification',
        'AI pipeline will execute Steps 1-8 automatically via orchestrator',
        'Monitor progress in the Workflows section',
        'Estimated completion time: 2-4 hours'
      ]
    })
  } catch (error: any) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Failed to create project', details: error.message },
      { status: 500 }
    )
  }
}