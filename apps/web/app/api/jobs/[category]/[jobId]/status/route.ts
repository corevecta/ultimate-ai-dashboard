import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const JOBS_DIR = '/home/sali/ai/projects/projecthubv3/jobs'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string; jobId: string }> }
) {
  try {
    const { category, jobId } = await params
    const jobDir = path.join(JOBS_DIR, category, jobId)

    if (!fs.existsSync(jobDir)) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    // Check if error file exists
    const errorPath = path.join(jobDir, 'error.txt')
    if (fs.existsSync(errorPath)) {
      const error = fs.readFileSync(errorPath, 'utf-8')
      return NextResponse.json({
        status: 'failed',
        error
      })
    }

    // Check if the output file exists
    let outputFile = ''
    let status = 'pending'
    
    switch (category) {
      case 'regenerate-requirements':
        outputFile = path.join(jobDir, 'requirements.md')
        break
      case 'orchestrator':
        outputFile = path.join(jobDir, 'output.txt')
        break
      default:
        outputFile = path.join(jobDir, 'output.txt')
    }

    if (fs.existsSync(outputFile)) {
      const content = fs.readFileSync(outputFile, 'utf-8')
      
      // Check if content is valid
      if (content.trim().length > 100) {
        status = 'completed'
      } else {
        status = 'in_progress'
      }
    }

    return NextResponse.json({
      status,
      jobId,
      category
    })

  } catch (error) {
    console.error('Error checking job status:', error)
    return NextResponse.json(
      { error: 'Failed to check job status' },
      { status: 500 }
    )
  }
}