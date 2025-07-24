/**
 * Requirements document validator
 * Ensures generated requirements contain all required sections
 */

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  sectionCoverage: Record<string, boolean>
  metrics: {
    totalSections: number
    presentSections: number
    coverage: number
    wordCount: number
    characterCount: number
  }
}

// Required sections for a complete requirements document
const REQUIRED_SECTIONS = [
  '# ', // Must have a title
  '## Project Overview',
  '## Core Features',
  '## Technical Requirements',
  '## UI/UX Requirements',
  '## Budget & Timeline',
  '## Success Metrics'
]

// Recommended sections for comprehensive coverage
const RECOMMENDED_SECTIONS = [
  '## Vision & Goals',
  '## Target Market',
  '## Advanced Features',
  '## Security Requirements',
  '## Performance Requirements',
  '## Data Management',
  '## Compliance & Legal',
  '## Integration Requirements',
  '## Development Approach',
  '## Deployment & Operations',
  '## Risk Assessment'
]

// Platform-specific required sections
const PLATFORM_SPECIFIC_SECTIONS: Record<string, string[]> = {
  'mobile-app': ['## Mobile-Specific Features', '## App Store Requirements'],
  'api-rest': ['## API Endpoints', '## Authentication'],
  'api-graphql': ['## Schema Design', '## Resolvers'],
  'blockchain-dapp': ['## Smart Contracts', '## Gas Optimization'],
  'health-app': ['## HIPAA Compliance', '## Patient Data Security'],
  'fintech-app': ['## Financial Regulations', '## Security Measures'],
  'ecommerce-store': ['## Payment Processing', '## Order Management'],
  'chrome-extension': ['## Manifest Configuration', '## Permissions']
}

/**
 * Validate requirements document
 */
export function validateRequirements(
  markdown: string, 
  platform?: string
): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  const sectionCoverage: Record<string, boolean> = {}

  // Check for empty or invalid content
  if (!markdown || markdown.trim().length === 0) {
    errors.push('Requirements document is empty')
    return {
      isValid: false,
      errors,
      warnings,
      sectionCoverage,
      metrics: {
        totalSections: 0,
        presentSections: 0,
        coverage: 0,
        wordCount: 0,
        characterCount: 0
      }
    }
  }

  // Normalize markdown for checking
  const normalizedMarkdown = markdown.toLowerCase()

  // Check required sections
  for (const section of REQUIRED_SECTIONS) {
    const sectionKey = section.replace(/^#+\s*/, '')
    const isPresent = normalizedMarkdown.includes(section.toLowerCase())
    sectionCoverage[sectionKey] = isPresent
    
    if (!isPresent) {
      errors.push(`Missing required section: ${section}`)
    }
  }

  // Check recommended sections
  for (const section of RECOMMENDED_SECTIONS) {
    const sectionKey = section.replace(/^#+\s*/, '')
    const isPresent = normalizedMarkdown.includes(section.toLowerCase())
    sectionCoverage[sectionKey] = isPresent
    
    if (!isPresent) {
      warnings.push(`Missing recommended section: ${section}`)
    }
  }

  // Check platform-specific sections if platform is provided
  if (platform && PLATFORM_SPECIFIC_SECTIONS[platform]) {
    for (const section of PLATFORM_SPECIFIC_SECTIONS[platform]) {
      const sectionKey = section.replace(/^#+\s*/, '')
      const isPresent = normalizedMarkdown.includes(section.toLowerCase())
      sectionCoverage[sectionKey] = isPresent
      
      if (!isPresent) {
        warnings.push(`Missing platform-specific section for ${platform}: ${section}`)
      }
    }
  }

  // Content quality checks
  const lines = markdown.split('\n')
  
  // Check for minimum content in each section
  let currentSection = ''
  const sectionContent: Record<string, number> = {}
  
  for (const line of lines) {
    if (line.startsWith('## ')) {
      currentSection = line
      sectionContent[currentSection] = 0
    } else if (currentSection && line.trim().length > 0) {
      sectionContent[currentSection] = (sectionContent[currentSection] || 0) + 1
    }
  }

  // Validate each section has meaningful content
  for (const [section, lineCount] of Object.entries(sectionContent)) {
    if (lineCount < 2) {
      warnings.push(`Section "${section}" appears to have insufficient content`)
    }
  }

  // Check for placeholder text
  const placeholders = [
    '[comprehensive description',
    '[list ',
    '[detailed ',
    '[specific ',
    'todo',
    'tbd',
    'xxx',
    '...'
  ]
  
  for (const placeholder of placeholders) {
    if (normalizedMarkdown.includes(placeholder)) {
      warnings.push(`Document contains placeholder text: "${placeholder}"`)
    }
  }

  // Calculate metrics
  const wordCount = markdown.split(/\s+/).filter(word => word.length > 0).length
  const characterCount = markdown.length
  const totalSections = REQUIRED_SECTIONS.length + RECOMMENDED_SECTIONS.length
  const presentSections = Object.values(sectionCoverage).filter(v => v).length
  const coverage = (presentSections / totalSections) * 100

  // Minimum content checks
  if (wordCount < 500) {
    errors.push(`Document is too short (${wordCount} words). Minimum 500 words required.`)
  }

  if (characterCount < 2000) {
    warnings.push(`Document may be too brief (${characterCount} characters)`)
  }

  // Check for proper markdown structure
  if (!markdown.includes('# ')) {
    errors.push('Document missing main title (# Title)')
  }

  const bulletPoints = (markdown.match(/^[\s]*[-*]\s/gm) || []).length
  if (bulletPoints < 10) {
    warnings.push('Document has few bullet points. Consider adding more structured lists.')
  }

  const isValid = errors.length === 0

  return {
    isValid,
    errors,
    warnings,
    sectionCoverage,
    metrics: {
      totalSections,
      presentSections,
      coverage,
      wordCount,
      characterCount
    }
  }
}

/**
 * Fix common formatting issues in requirements
 */
export function fixRequirementsFormatting(markdown: string): string {
  let fixed = markdown

  // Ensure proper spacing between sections
  fixed = fixed.replace(/\n##/g, '\n\n##')
  
  // Fix multiple blank lines
  fixed = fixed.replace(/\n{3,}/g, '\n\n')
  
  // Ensure lists have proper formatting
  fixed = fixed.replace(/^(-|\*)\s*/gm, '- ')
  
  // Add missing periods at end of sentences
  fixed = fixed.replace(/([a-zA-Z0-9])\n/g, (match, p1) => {
    if (p1 !== '.' && p1 !== '!' && p1 !== '?' && p1 !== ':') {
      return p1 + '.\n'
    }
    return match
  })

  return fixed.trim()
}

/**
 * Extract section content from requirements
 */
export function extractSection(markdown: string, sectionTitle: string): string | null {
  const lines = markdown.split('\n')
  let inSection = false
  let sectionContent: string[] = []
  
  for (const line of lines) {
    if (line.toLowerCase().includes(sectionTitle.toLowerCase())) {
      inSection = true
      continue
    }
    
    if (inSection && line.startsWith('#') && !line.startsWith('###')) {
      // Hit next major section, stop
      break
    }
    
    if (inSection) {
      sectionContent.push(line)
    }
  }
  
  return sectionContent.length > 0 ? sectionContent.join('\n').trim() : null
}

/**
 * Generate validation report
 */
export function generateValidationReport(result: ValidationResult): string {
  const report: string[] = []
  
  report.push('# Requirements Validation Report')
  report.push('')
  report.push(`**Status**: ${result.isValid ? '✅ VALID' : '❌ INVALID'}`)
  report.push(`**Coverage**: ${result.metrics.coverage.toFixed(1)}% (${result.metrics.presentSections}/${result.metrics.totalSections} sections)`)
  report.push(`**Word Count**: ${result.metrics.wordCount}`)
  report.push('')
  
  if (result.errors.length > 0) {
    report.push('## Errors')
    result.errors.forEach(error => report.push(`- ❌ ${error}`))
    report.push('')
  }
  
  if (result.warnings.length > 0) {
    report.push('## Warnings')
    result.warnings.forEach(warning => report.push(`- ⚠️ ${warning}`))
    report.push('')
  }
  
  report.push('## Section Coverage')
  Object.entries(result.sectionCoverage).forEach(([section, present]) => {
    report.push(`- ${present ? '✅' : '❌'} ${section}`)
  })
  
  return report.join('\n')
}