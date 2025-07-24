import { NextResponse } from 'next/server'
import { getGenerationMetrics, getRecentLogs } from '@/lib/audit-logger'
import { getBestPrompts } from '@/lib/prompt-library'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'summary'
    
    switch (type) {
      case 'metrics':
        const metrics = await getGenerationMetrics()
        return NextResponse.json(metrics)
        
      case 'recent':
        const limit = parseInt(searchParams.get('limit') || '10')
        const recentLogs = await getRecentLogs(limit)
        return NextResponse.json(recentLogs)
        
      case 'prompts':
        const bestPrompts = await getBestPrompts()
        return NextResponse.json(bestPrompts)
        
      case 'summary':
      default:
        const [summaryMetrics, summaryLogs, summaryPrompts] = await Promise.all([
          getGenerationMetrics(),
          getRecentLogs(5),
          getBestPrompts(5)
        ])
        
        return NextResponse.json({
          metrics: summaryMetrics,
          recentLogs: Object.values(summaryLogs),
          bestPrompts: summaryPrompts,
          timestamp: new Date().toISOString()
        })
    }
  } catch (error: any) {
    console.error('Metrics API error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve metrics', details: error.message },
      { status: 500 }
    )
  }
}