import { promises as fs } from 'fs'
import path from 'path'
import crypto from 'crypto'

export interface AuditLog {
  jobId: string
  timestamp: Date
  platform: string
  projectName: string
  promptLength: number
  responseLength?: number
  responseTime?: number
  success: boolean
  error?: string
  model: string
  userId?: string
  metadata?: Record<string, any>
}

export interface GenerationMetrics {
  totalGenerations: number
  successRate: number
  averageResponseTime: number
  platformDistribution: Record<string, number>
  modelUsage: Record<string, number>
  errorRate: number
  dailyGenerations: Record<string, number>
}

const AUDIT_LOG_DIR = process.env.AUDIT_LOG_DIR || '/tmp/step0-audit-logs'
const METRICS_FILE = path.join(AUDIT_LOG_DIR, 'generation-metrics.json')

/**
 * Ensure audit log directory exists
 */
async function ensureAuditDir() {
  try {
    await fs.mkdir(AUDIT_LOG_DIR, { recursive: true })
  } catch (error) {
    console.error('Failed to create audit directory:', error)
  }
}

/**
 * Generate a unique job ID
 */
export function generateJobId(): string {
  return `step0-${Date.now()}-${crypto.randomBytes(8).toString('hex')}`
}

/**
 * Save audit log entry
 */
export async function saveAuditLog(log: AuditLog): Promise<void> {
  await ensureAuditDir()
  
  const filename = `${log.jobId}.json`
  const filepath = path.join(AUDIT_LOG_DIR, filename)
  
  try {
    await fs.writeFile(filepath, JSON.stringify(log, null, 2), 'utf-8')
    
    // Update metrics
    await updateMetrics(log)
  } catch (error) {
    console.error('Failed to save audit log:', error)
  }
}

/**
 * Update generation metrics
 */
async function updateMetrics(log: AuditLog): Promise<void> {
  let metrics: GenerationMetrics = {
    totalGenerations: 0,
    successRate: 0,
    averageResponseTime: 0,
    platformDistribution: {},
    modelUsage: {},
    errorRate: 0,
    dailyGenerations: {}
  }

  try {
    const existingData = await fs.readFile(METRICS_FILE, 'utf-8')
    metrics = JSON.parse(existingData)
  } catch {
    // File doesn't exist or is invalid, use default metrics
  }

  // Update total generations
  metrics.totalGenerations++

  // Update platform distribution
  metrics.platformDistribution[log.platform] = (metrics.platformDistribution[log.platform] || 0) + 1

  // Update model usage
  metrics.modelUsage[log.model] = (metrics.modelUsage[log.model] || 0) + 1

  // Update daily generations
  const dateKey = new Date(log.timestamp).toISOString().split('T')[0]
  metrics.dailyGenerations[dateKey] = (metrics.dailyGenerations[dateKey] || 0) + 1

  // Calculate success rate
  const successCount = Object.values(await getRecentLogs(100))
    .filter(l => l.success).length
  metrics.successRate = (successCount / Math.min(metrics.totalGenerations, 100)) * 100

  // Calculate average response time
  if (log.responseTime) {
    const recentLogs = await getRecentLogs(50)
    const responseTimes = Object.values(recentLogs)
      .filter(l => l.responseTime)
      .map(l => l.responseTime!)
    
    if (responseTimes.length > 0) {
      metrics.averageResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
    }
  }

  // Calculate error rate
  const errorCount = Object.values(await getRecentLogs(100))
    .filter(l => !l.success).length
  metrics.errorRate = (errorCount / Math.min(metrics.totalGenerations, 100)) * 100

  try {
    await fs.writeFile(METRICS_FILE, JSON.stringify(metrics, null, 2), 'utf-8')
  } catch (error) {
    console.error('Failed to update metrics:', error)
  }
}

/**
 * Get recent audit logs
 */
export async function getRecentLogs(limit: number = 10): Promise<Record<string, AuditLog>> {
  await ensureAuditDir()
  
  try {
    const files = await fs.readdir(AUDIT_LOG_DIR)
    const logFiles = files
      .filter(f => f.endsWith('.json') && f !== 'generation-metrics.json')
      .sort((a, b) => b.localeCompare(a))
      .slice(0, limit)
    
    const logs: Record<string, AuditLog> = {}
    
    for (const file of logFiles) {
      try {
        const content = await fs.readFile(path.join(AUDIT_LOG_DIR, file), 'utf-8')
        const log = JSON.parse(content) as AuditLog
        logs[log.jobId] = log
      } catch {
        // Skip invalid files
      }
    }
    
    return logs
  } catch {
    return {}
  }
}

/**
 * Get generation metrics
 */
export async function getGenerationMetrics(): Promise<GenerationMetrics> {
  try {
    const data = await fs.readFile(METRICS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return {
      totalGenerations: 0,
      successRate: 0,
      averageResponseTime: 0,
      platformDistribution: {},
      modelUsage: {},
      errorRate: 0,
      dailyGenerations: {}
    }
  }
}

/**
 * Get audit log by job ID
 */
export async function getAuditLog(jobId: string): Promise<AuditLog | null> {
  const filepath = path.join(AUDIT_LOG_DIR, `${jobId}.json`)
  
  try {
    const content = await fs.readFile(filepath, 'utf-8')
    return JSON.parse(content)
  } catch {
    return null
  }
}

/**
 * Clean up old audit logs (older than 30 days)
 */
export async function cleanupOldLogs(): Promise<void> {
  await ensureAuditDir()
  
  const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000)
  
  try {
    const files = await fs.readdir(AUDIT_LOG_DIR)
    
    for (const file of files) {
      if (file.endsWith('.json') && file !== 'generation-metrics.json') {
        const filepath = path.join(AUDIT_LOG_DIR, file)
        const stats = await fs.stat(filepath)
        
        if (stats.mtimeMs < thirtyDaysAgo) {
          await fs.unlink(filepath)
        }
      }
    }
  } catch (error) {
    console.error('Failed to cleanup old logs:', error)
  }
}