/**
 * Simple in-memory job queue for async Claude CLI operations
 * In production, consider using Redis or PostgreSQL for persistence
 */

import { spawn } from 'child_process'
import fs from 'fs/promises'
import path from 'path'
import { startParallelJobProcessor } from './job-queue-parallel'

export interface Job {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  type: 'claude-cli' | 'ollama'
  input: any
  output?: any
  error?: string
  createdAt: Date
  startedAt?: Date
  completedAt?: Date
  outputFile?: string
  retries?: number
  maxRetries?: number
}

// In-memory storage (replace with Redis in production)
const jobs = new Map<string, Job>()

// Cleanup old jobs after 1 hour
const JOB_RETENTION_MS = 60 * 60 * 1000

export function createJob(input: { type: Job['type'], input: any, maxRetries?: number }): Job {
  const job: Job = {
    id: `job_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    status: 'pending',
    type: input.type,
    input: input.input,
    createdAt: new Date(),
    retries: 0,
    maxRetries: input.maxRetries || 2
  }
  
  jobs.set(job.id, job)
  
  // Schedule cleanup
  setTimeout(() => {
    jobs.delete(job.id)
  }, JOB_RETENTION_MS)
  
  return job
}

export function getJob(jobId: string): Job | undefined {
  return jobs.get(jobId)
}

export function updateJob(jobId: string, updates: Partial<Job>): void {
  const job = jobs.get(jobId)
  if (job) {
    Object.assign(job, updates)
  }
}

/**
 * Process Claude CLI job asynchronously
 */
export async function processClaudeJob(jobId: string, prompt: string): Promise<void> {
  const job = getJob(jobId)
  if (!job) return
  
  updateJob(jobId, { 
    status: 'processing',
    startedAt: new Date()
  })
  
  try {
    const prompt = job.input.prompt
    const expectedFile = job.input.expectedFile || `/tmp/requirements-${Date.now()}.md`
    
    // Update prompt to ensure Claude uses MCP filesystem
    const filePrompt = prompt // The prompt already includes MCP instructions
    
    // Run Claude CLI
    const result = await runClaudeCLI(filePrompt, expectedFile)
    
    if (result.success && result.outputFile) {
      // Read the generated file
      const content = await fs.readFile(result.outputFile, 'utf-8')
      
      updateJob(jobId, {
        status: 'completed',
        completedAt: new Date(),
        output: content,
        outputFile: result.outputFile
      })
      
      // Update pipeline status if this is part of a pipeline
      if (job.input.projectId) {
        await updatePipelineStatus(job.input.projectId, job.input.step || 'step0', {
          status: 'completed',
          output: content,
          endTime: new Date()
        })
      }
      
      // Clean up file after reading
      await fs.unlink(result.outputFile).catch(() => {})
    } else {
      throw new Error(result.error || 'Failed to generate requirements')
    }
  } catch (error: any) {
    const job = getJob(jobId)
    if (!job) return
    
    // Check if we should retry
    const currentRetries = job.retries || 0
    const maxRetries = job.maxRetries || 2
    
    if (currentRetries < maxRetries) {
      console.log(`[Job Queue] Retrying job ${jobId}, attempt ${currentRetries + 1}/${maxRetries}`)
      updateJob(jobId, {
        status: 'pending',
        retries: currentRetries + 1,
        error: `Attempt ${currentRetries + 1} failed: ${error.message}`
      })
    } else {
      updateJob(jobId, {
        status: 'failed',
        completedAt: new Date(),
        error: `Failed after ${maxRetries} attempts: ${error.message}`
      })
    }
  }
}

/**
 * Run Claude CLI and monitor for file output
 */
async function runClaudeCLI(prompt: string, expectedFile: string): Promise<{
  success: boolean
  outputFile?: string
  error?: string
}> {
  return new Promise((resolve) => {
    const args = ['--print', '--dangerously-skip-permissions', '--model', 'sonnet']
    
    console.log('[Job Queue] Running Claude CLI for file:', expectedFile)
    
    const claudeProcess = spawn('claude', args, {
      stdio: ['pipe', 'pipe', 'pipe']
    })
    
    let output = ''
    let errorOutput = ''
    let fileCreated = false
    
    // Monitor for file creation
    const checkInterval = setInterval(async () => {
      try {
        await fs.access(expectedFile)
        fileCreated = true
        console.log('[Job Queue] File created:', expectedFile)
        clearInterval(checkInterval)
      } catch {
        // File not yet created
      }
    }, 1000)
    
    claudeProcess.stdout.on('data', (data) => {
      output += data.toString()
    })
    
    claudeProcess.stderr.on('data', (data) => {
      errorOutput += data.toString()
    })
    
    // Timeout for requirements generation
    const timeoutHandle = setTimeout(() => {
      claudeProcess.kill('SIGTERM')
      clearInterval(checkInterval)
      resolve({
        success: false,
        error: 'Claude process timed out after 80 seconds'
      })
    }, 80 * 1000) // 80 seconds
    
    claudeProcess.on('close', async (code) => {
      clearTimeout(timeoutHandle)
      clearInterval(checkInterval)
      
      // Check if file was created
      try {
        await fs.access(expectedFile)
        fileCreated = true
      } catch {
        fileCreated = false
      }
      
      if (code === 0 && fileCreated) {
        resolve({
          success: true,
          outputFile: expectedFile
        })
      } else if (code === 0 && output.includes('DONE')) {
        // Claude said DONE but file wasn't created yet - wait a bit
        await new Promise(r => setTimeout(r, 2000))
        
        try {
          await fs.access(expectedFile)
          resolve({
            success: true,
            outputFile: expectedFile
          })
        } catch {
          resolve({
            success: false,
            error: 'Claude reported DONE but file was not created'
          })
        }
      } else {
        resolve({
          success: false,
          error: errorOutput || output || `Process exited with code ${code}`
        })
      }
    })
    
    claudeProcess.on('error', (error) => {
      clearTimeout(timeoutHandle)
      clearInterval(checkInterval)
      resolve({
        success: false,
        error: `Failed to spawn Claude: ${error.message}`
      })
    })
    
    // Send prompt via stdin
    claudeProcess.stdin.write(prompt)
    claudeProcess.stdin.end()
  })
}

/**
 * Start processing pending jobs
 * In production, this would be a separate worker process
 */
export function startJobProcessor() {
  setInterval(async () => {
    for (const [jobId, job] of jobs) {
      if (job.status === 'pending' && job.type === 'claude-cli') {
        // Process one job at a time
        await processClaudeJob(jobId)
        break
      }
    }
  }, 1000) // Check every second
}

// Auto-start processor (in production, this would be separate)
if (typeof window === 'undefined') {
  // Use parallel processor for better performance
  if (process.env.USE_PARALLEL_JOBS === 'true') {
    startParallelJobProcessor()
  } else {
    startJobProcessor()
  }
}

/**
 * Update pipeline status for a project
 */
async function updatePipelineStatus(projectId: string, step: string, updates: any) {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/pipeline/status/${projectId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        [step]: {
          ...updates,
          name: step.replace('step', 'Step ')
        }
      })
    })
  } catch (error) {
    console.error('[Job Queue] Failed to update pipeline status:', error)
  }
}