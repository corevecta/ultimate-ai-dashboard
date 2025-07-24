import { promises as fs } from 'fs'
import path from 'path'

export interface PromptTemplate {
  id: string
  platform: string
  version: string
  template: string
  variables: string[]
  successRate?: number
  usageCount?: number
  lastUsed?: Date
  metadata?: Record<string, any>
}

export interface PromptHistory {
  jobId: string
  platform: string
  prompt: string
  success: boolean
  responseQuality?: number // 1-5 rating
  timestamp: Date
}

const PROMPT_LIBRARY_DIR = process.env.PROMPT_LIBRARY_DIR || '/tmp/step0-prompt-library'
const PROMPT_TEMPLATES_FILE = path.join(PROMPT_LIBRARY_DIR, 'templates.json')
const PROMPT_HISTORY_FILE = path.join(PROMPT_LIBRARY_DIR, 'history.json')

/**
 * Default prompt templates for each platform category
 */
const DEFAULT_TEMPLATES: Record<string, string> = {
  'web': `Generate comprehensive project requirements in markdown format.

Project: {{name}}
Type: {{type}}
Description: {{description}}
Target: {{targetAudience}} in {{industry}}
Budget: {{budget}}, Timeline: {{timeline}}
Geography: {{geography}}
{{priorities}}

Platform Context:
{{platformContext}}

Create a requirements document with these sections:
# {{name}}

## Project Overview
Expand on: {{description}}

## Core Features (MVP)
List 8-12 essential features for a {{type}} in {{industry}}

## Technical Requirements
- Architecture for {{type}}
- Technology stack
- Performance requirements
- Security requirements

## UI/UX Requirements
- Design principles
- User experience

## Budget & Timeline
- Development phases for {{budget}} budget
- {{timeline}} timeline breakdown

## Success Metrics
- KPIs
- User metrics

Include all standard sections for a complete requirements document.`,

  'mobile': `Generate comprehensive mobile app requirements.

App Name: {{name}}
Platform: {{type}}
Description: {{description}}
Target Users: {{targetAudience}} in {{industry}}
Budget: {{budget}}, Timeline: {{timeline}}
{{priorities}}

Platform Requirements:
{{platformContext}}

Create detailed requirements including:
- Native features and device capabilities
- Platform-specific guidelines (iOS/Android)
- Offline functionality
- Performance optimization
- App store requirements
- Push notifications and background tasks

Structure the document with all standard sections.`,

  'api': `Generate comprehensive API requirements.

API Name: {{name}}
Type: {{type}}
Purpose: {{description}}
Consumers: {{targetAudience}} in {{industry}}
Scale: {{budget}} budget, {{timeline}} timeline
{{priorities}}

API Context:
{{platformContext}}

Include:
- API design principles (REST/GraphQL/gRPC)
- Authentication and authorization
- Rate limiting and quotas
- Data models and schemas
- Endpoint specifications
- Error handling
- Documentation requirements
- Versioning strategy

Format as complete requirements document.`,

  'default': `Generate project requirements for:
{{name}} - {{type}}
{{description}}

Context: {{targetAudience}}, {{industry}}, {{budget}}, {{timeline}}
{{platformContext}}

Include: Overview, Core Features, Technical Stack, Timeline, Success Metrics`
}

/**
 * Ensure prompt library directory exists
 */
async function ensureLibraryDir() {
  try {
    await fs.mkdir(PROMPT_LIBRARY_DIR, { recursive: true })
  } catch (error) {
    console.error('Failed to create prompt library directory:', error)
  }
}

/**
 * Get prompt template for platform
 */
export async function getPromptTemplate(platform: string): Promise<PromptTemplate | null> {
  await ensureLibraryDir()

  try {
    const data = await fs.readFile(PROMPT_TEMPLATES_FILE, 'utf-8')
    const templates: Record<string, PromptTemplate> = JSON.parse(data)
    
    // Look for exact platform match
    if (templates[platform]) {
      return templates[platform]
    }
    
    // Look for category match
    const category = platform.split('-')[0]
    if (templates[category]) {
      return templates[category]
    }
    
    // Return default template
    if (templates['default']) {
      return templates['default']
    }
  } catch {
    // File doesn't exist, return default
  }

  // Create default template
  const category = platform.includes('api') ? 'api' : 
                  platform.includes('mobile') || platform.includes('ios') || platform.includes('android') ? 'mobile' :
                  platform.includes('web') || platform.includes('site') ? 'web' : 'default'
  
  return {
    id: `${platform}-default`,
    platform,
    version: '1.0',
    template: DEFAULT_TEMPLATES[category] || DEFAULT_TEMPLATES['default'],
    variables: ['name', 'type', 'description', 'targetAudience', 'industry', 'budget', 'timeline', 'geography', 'priorities', 'platformContext'],
    successRate: 0,
    usageCount: 0
  }
}

/**
 * Save prompt template
 */
export async function savePromptTemplate(template: PromptTemplate): Promise<void> {
  await ensureLibraryDir()
  
  let templates: Record<string, PromptTemplate> = {}
  
  try {
    const data = await fs.readFile(PROMPT_TEMPLATES_FILE, 'utf-8')
    templates = JSON.parse(data)
  } catch {
    // File doesn't exist, start fresh
  }
  
  templates[template.platform] = {
    ...template,
    lastUsed: new Date()
  }
  
  await fs.writeFile(PROMPT_TEMPLATES_FILE, JSON.stringify(templates, null, 2), 'utf-8')
}

/**
 * Fill prompt template with values
 */
export function fillPromptTemplate(template: string, values: Record<string, any>): string {
  let filled = template
  
  // Replace all template variables
  Object.entries(values).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g')
    filled = filled.replace(regex, value || '')
  })
  
  // Clean up any remaining empty template variables
  filled = filled.replace(/{{[^}]+}}/g, '')
  
  // Clean up extra whitespace
  filled = filled.replace(/\n{3,}/g, '\n\n').trim()
  
  return filled
}

/**
 * Record prompt usage
 */
export async function recordPromptUsage(history: PromptHistory): Promise<void> {
  await ensureLibraryDir()
  
  let histories: PromptHistory[] = []
  
  try {
    const data = await fs.readFile(PROMPT_HISTORY_FILE, 'utf-8')
    histories = JSON.parse(data)
  } catch {
    // File doesn't exist
  }
  
  histories.push(history)
  
  // Keep only last 1000 entries
  if (histories.length > 1000) {
    histories = histories.slice(-1000)
  }
  
  await fs.writeFile(PROMPT_HISTORY_FILE, JSON.stringify(histories, null, 2), 'utf-8')
  
  // Update template success rate if successful
  if (history.success && history.responseQuality && history.responseQuality >= 4) {
    await updateTemplateStats(history.platform, true)
  }
}

/**
 * Update template statistics
 */
async function updateTemplateStats(platform: string, success: boolean): Promise<void> {
  const template = await getPromptTemplate(platform)
  if (!template) return
  
  template.usageCount = (template.usageCount || 0) + 1
  
  if (success) {
    const currentSuccessCount = (template.successRate || 0) * (template.usageCount - 1) / 100
    template.successRate = ((currentSuccessCount + 1) / template.usageCount) * 100
  } else {
    const currentSuccessCount = (template.successRate || 0) * (template.usageCount - 1) / 100
    template.successRate = (currentSuccessCount / template.usageCount) * 100
  }
  
  await savePromptTemplate(template)
}

/**
 * Get best performing prompts
 */
export async function getBestPrompts(limit: number = 10): Promise<PromptTemplate[]> {
  await ensureLibraryDir()
  
  try {
    const data = await fs.readFile(PROMPT_TEMPLATES_FILE, 'utf-8')
    const templates: Record<string, PromptTemplate> = JSON.parse(data)
    
    return Object.values(templates)
      .filter(t => (t.usageCount || 0) > 5) // Only consider templates used at least 5 times
      .sort((a, b) => (b.successRate || 0) - (a.successRate || 0))
      .slice(0, limit)
  } catch {
    return []
  }
}

/**
 * Export prompt library for backup
 */
export async function exportPromptLibrary(): Promise<{
  templates: Record<string, PromptTemplate>
  history: PromptHistory[]
}> {
  await ensureLibraryDir()
  
  let templates: Record<string, PromptTemplate> = {}
  let history: PromptHistory[] = []
  
  try {
    const templatesData = await fs.readFile(PROMPT_TEMPLATES_FILE, 'utf-8')
    templates = JSON.parse(templatesData)
  } catch {
    // Use defaults
  }
  
  try {
    const historyData = await fs.readFile(PROMPT_HISTORY_FILE, 'utf-8')
    history = JSON.parse(historyData)
  } catch {
    // Empty history
  }
  
  return { templates, history }
}

/**
 * Import prompt library from backup
 */
export async function importPromptLibrary(data: {
  templates: Record<string, PromptTemplate>
  history: PromptHistory[]
}): Promise<void> {
  await ensureLibraryDir()
  
  if (data.templates) {
    await fs.writeFile(PROMPT_TEMPLATES_FILE, JSON.stringify(data.templates, null, 2), 'utf-8')
  }
  
  if (data.history) {
    await fs.writeFile(PROMPT_HISTORY_FILE, JSON.stringify(data.history, null, 2), 'utf-8')
  }
}