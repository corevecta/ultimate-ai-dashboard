/**
 * Simple in-memory job queue for async Claude CLI operations
 * In production, consider using Redis or PostgreSQL for persistence
 */

import { spawn } from 'child_process'
import fs from 'fs/promises'
import path from 'path'

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
}

// In-memory storage (replace with Redis in production)
const jobs = new Map<string, Job>()

// Cleanup old jobs after 1 hour
const JOB_RETENTION_MS = 60 * 60 * 1000

export function createJob(type: Job['type'], input: any): Job {
  const job: Job = {
    id: `job_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    status: 'pending',
    type,
    input,
    createdAt: new Date()
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
    const timestamp = Date.now()
    const outputFile = `/tmp/step0-requirements-${timestamp}.md`
    
    // Update prompt to write to specific file
    const filePrompt = `${prompt}

IMPORTANT: Write your complete response to this file: ${outputFile}

After writing the file, respond with only: DONE`
    
    // Run Claude CLI
    const result = await runClaudeCLI(filePrompt, outputFile)
    
    if (result.success && result.outputFile) {
      // Read the generated file
      const content = await fs.readFile(result.outputFile, 'utf-8')
      
      updateJob(jobId, {
        status: 'completed',
        completedAt: new Date(),
        output: content,
        outputFile: result.outputFile
      })
      
      // Clean up file after reading
      await fs.unlink(result.outputFile).catch(() => {})
    } else {
      throw new Error(result.error || 'Failed to generate requirements')
    }
  } catch (error: any) {
    updateJob(jobId, {
      status: 'failed',
      completedAt: new Date(),
      error: error.message
    })
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
    
    // Longer timeout for complex generation
    const timeoutHandle = setTimeout(() => {
      claudeProcess.kill('SIGTERM')
      clearInterval(checkInterval)
      resolve({
        success: false,
        error: 'Claude process timed out after 5 minutes'
      })
    }, 5 * 60 * 1000) // 5 minutes
    
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
        await processClaudeJob(jobId, job.input.prompt)
        break
      }
    }
  }, 1000) // Check every second
}

// Auto-start processor (in production, this would be separate)
if (typeof window === 'undefined') {
  startJobProcessor()
}