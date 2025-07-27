/**
 * Parallel job queue processor with worker pool for Claude CLI operations
 */

import { spawn } from 'child_process'
import fs from 'fs/promises'
import { Job, getJob, updateJob, jobs } from './job-queue'

// Configuration
const MAX_CONCURRENT_WORKERS = 6 // Run 6 Claude CLI instances in parallel (Sonnet 4)
const WORKER_CHECK_INTERVAL = 1000 // Check for new jobs every second
const CLAUDE_TIMEOUT = 80 * 1000 // 80 second timeout per job

// Track active workers
const activeWorkers = new Set<string>()

/**
 * Process a single Claude job (same as before but extracted)
 */
async function processClaudeJobWorker(jobId: string): Promise<void> {
  const job = getJob(jobId)
  if (!job || job.status !== 'pending') return
  
  // Mark this worker as active
  activeWorkers.add(jobId)
  
  try {
    updateJob(jobId, { 
      status: 'processing',
      startedAt: new Date()
    })
    
    const prompt = job.input.prompt
    const expectedFile = job.input.expectedFile || `/tmp/requirements-${Date.now()}.md`
    
    // Run Claude CLI with MCP filesystem
    const result = await runClaudeCLIWithTimeout(prompt, expectedFile, CLAUDE_TIMEOUT)
    
    if (result.success && result.outputFile) {
      // Read the generated file
      const content = await fs.readFile(result.outputFile, 'utf-8')
      
      updateJob(jobId, {
        status: 'completed',
        completedAt: new Date(),
        output: content,
        outputFile: result.outputFile
      })
      
      // Clean up temp file if needed
      if (result.outputFile.startsWith('/tmp/')) {
        await fs.unlink(result.outputFile).catch(() => {})
      }
    } else {
      throw new Error(result.error || 'Failed to generate requirements')
    }
  } catch (error: any) {
    const job = getJob(jobId)
    if (!job) return
    
    // Retry logic
    const currentRetries = job.retries || 0
    const maxRetries = job.maxRetries || 2
    
    if (currentRetries < maxRetries) {
      console.log(`[Worker] Retrying job ${jobId}, attempt ${currentRetries + 1}/${maxRetries}`)
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
  } finally {
    // Remove from active workers
    activeWorkers.delete(jobId)
  }
}

/**
 * Run Claude CLI with timeout
 */
async function runClaudeCLIWithTimeout(
  prompt: string, 
  expectedFile: string,
  timeout: number
): Promise<{
  success: boolean
  outputFile?: string
  error?: string
}> {
  return new Promise((resolve) => {
    // Create MCP config directory
    const jobDir = `/tmp/claude-job-${Date.now()}`
    const mcpConfig = {
      mcpServers: {
        filesystem: {
          command: "npx",
          args: ["-y", "@modelcontextprotocol/server-filesystem", "/"]
        }
      }
    }
    
    // Write MCP config
    fs.mkdir(jobDir, { recursive: true })
      .then(() => fs.writeFile(`${jobDir}/mcp-config.json`, JSON.stringify(mcpConfig)))
      .catch(err => {
        resolve({ success: false, error: `MCP setup failed: ${err.message}` })
        return
      })
    
    const args = [
      '--mcp-config', `${jobDir}/mcp-config.json`,
      '--continue',
      '--dangerously-skip-permissions'
    ]
    
    console.log(`[Worker] Starting Claude CLI for: ${expectedFile}`)
    
    const claudeProcess = spawn('claude', args, {
      env: { ...process.env }
    })
    
    let output = ''
    let errorOutput = ''
    let fileCreated = false
    let processExited = false
    
    // Set timeout
    const timeoutHandle = setTimeout(() => {
      if (!processExited) {
        claudeProcess.kill('SIGTERM')
        resolve({
          success: false,
          error: `Claude process timed out after ${timeout/1000} seconds`
        })
      }
    }, timeout)
    
    // Monitor for file creation
    const checkInterval = setInterval(async () => {
      try {
        await fs.access(expectedFile)
        fileCreated = true
        console.log(`[Worker] File created: ${expectedFile}`)
        
        // Give it a moment to finish writing
        setTimeout(() => {
          if (!processExited) {
            clearTimeout(timeoutHandle)
            clearInterval(checkInterval)
            claudeProcess.kill('SIGTERM')
            resolve({
              success: true,
              outputFile: expectedFile
            })
          }
        }, 2000)
      } catch {
        // File not created yet
      }
    }, 1000)
    
    claudeProcess.stdout.on('data', (data) => {
      output += data.toString()
    })
    
    claudeProcess.stderr.on('data', (data) => {
      errorOutput += data.toString()
    })
    
    claudeProcess.on('close', (code) => {
      processExited = true
      clearTimeout(timeoutHandle)
      clearInterval(checkInterval)
      
      // Clean up temp directory
      fs.rm(jobDir, { recursive: true, force: true }).catch(() => {})
      
      if (fileCreated) {
        resolve({
          success: true,
          outputFile: expectedFile
        })
      } else if (code === 0) {
        // Process succeeded but file wasn't created
        resolve({
          success: false,
          error: 'Claude completed but no file was created'
        })
      } else {
        resolve({
          success: false,
          error: errorOutput || output || `Process exited with code ${code}`
        })
      }
    })
    
    // Send prompt via stdin
    claudeProcess.stdin.write(prompt)
    claudeProcess.stdin.end()
  })
}

/**
 * Start parallel job processor with worker pool
 */
export function startParallelJobProcessor() {
  console.log(`[Job Queue] Starting parallel processor with ${MAX_CONCURRENT_WORKERS} workers`)
  
  setInterval(async () => {
    // Skip if we're at max capacity
    if (activeWorkers.size >= MAX_CONCURRENT_WORKERS) {
      return
    }
    
    // Find pending jobs
    const pendingJobs: string[] = []
    for (const [jobId, job] of jobs) {
      if (job.status === 'pending' && job.type === 'claude-cli' && !activeWorkers.has(jobId)) {
        pendingJobs.push(jobId)
        
        // Only take enough to fill our worker pool
        if (pendingJobs.length + activeWorkers.size >= MAX_CONCURRENT_WORKERS) {
          break
        }
      }
    }
    
    // Start processing jobs in parallel
    for (const jobId of pendingJobs) {
      // Don't await - let them run in parallel
      processClaudeJobWorker(jobId).catch(err => {
        console.error(`[Worker] Error processing job ${jobId}:`, err)
        activeWorkers.delete(jobId)
      })
    }
    
    if (pendingJobs.length > 0) {
      console.log(`[Job Queue] Started ${pendingJobs.length} workers, active: ${activeWorkers.size}/${MAX_CONCURRENT_WORKERS}`)
    }
  }, WORKER_CHECK_INTERVAL)
}

// Export for use
export { MAX_CONCURRENT_WORKERS }