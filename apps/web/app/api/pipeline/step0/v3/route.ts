import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import { promises as fs } from 'fs'
import { getProjectTypeInfo, getProjectCategory } from '@/lib/project-types'

const execAsync = promisify(exec)

interface EnhancedStep0Request {
  // Basic info
  name: string
  type: string
  description: string
  
  // Business context
  targetAudience: string
  industry: string
  geography: string[]
  
  // Constraints
  budget: string
  timeline: string
  
  // Optional
  competitors?: string
  monetization?: string
  priorities?: string[]
  compliance?: string[]
}

// Dashboard branding context to include
const DASHBOARD_CONTEXT = {
  branding: {
    style: 'Modern dark theme with gradients and glassmorphic effects',
    ui: 'Responsive, accessible, performance-optimized',
    experience: 'Intuitive, professional, enterprise-ready'
  },
  standards: {
    code: 'Clean, maintainable, well-documented',
    testing: 'Comprehensive test coverage',
    deployment: 'CI/CD ready, containerized'
  }
}

function buildEnhancedIdea(data: EnhancedStep0Request): string {
  const typeInfo = getProjectTypeInfo(data.type)
  
  return `${data.name}: ${data.description}

Platform: ${typeInfo?.category || 'Web'} - ${typeInfo?.name || data.type}
Type: ${data.type}

Business Context:
- Target Audience: ${data.targetAudience}
- Industry/Domain: ${data.industry}
- Geography: ${data.geography.join(', ')}
- Budget Range: ${getBudgetDescription(data.budget)}
- Timeline: ${getTimelineDescription(data.timeline)}

${data.competitors ? `Market Reference: ${data.competitors}\n` : ''}
${data.priorities?.length ? `Key Priorities: ${data.priorities.join(', ')}\n` : ''}
${data.compliance?.length ? `Compliance Requirements: ${data.compliance.join(', ')}\n` : ''}
${data.monetization ? `Monetization Model: ${data.monetization}\n` : ''}

Technical Context:
- Dashboard Integration: ${DASHBOARD_CONTEXT.branding.style}
- UI/UX Standards: ${DASHBOARD_CONTEXT.branding.ui}
- Code Standards: ${DASHBOARD_CONTEXT.standards.code}

Requirements Generation Instructions:
Generate comprehensive requirements following the specification v2 schema including:
1. Project metadata with vision and goals
2. Market analysis with TAM/SAM/SOM estimates based on industry
3. Hierarchical features (Core/Advanced/Premium) aligned with budget
4. Technical architecture appropriate for platform and scale
5. Monetization strategy based on target audience
6. Compliance and security requirements for the industry
7. Branding guidelines matching dashboard aesthetics
8. Success metrics and KPIs
9. Timeline breakdown matching the budget
10. Risk assessment and mitigation strategies`
}

function getBudgetDescription(budget: string): string {
  const budgets: Record<string, string> = {
    'mvp': 'MVP/Prototype (<$10k) - Focus on core features only',
    'small': 'Small Project ($10-50k) - Core features with polish',
    'medium': 'Medium Project ($50-200k) - Full feature set',
    'enterprise': 'Enterprise ($200k+) - Complete platform with advanced features'
  }
  return budgets[budget] || budget
}

function getTimelineDescription(timeline: string): string {
  const timelines: Record<string, string> = {
    '1month': '1 Month - Rapid MVP',
    '3months': '3 Months - Standard development',
    '6months': '6 Months - Complex features',
    'ongoing': 'Ongoing - Continuous development'
  }
  return timelines[timeline] || timeline
}

export async function POST(request: Request) {
  try {
    const body: EnhancedStep0Request = await request.json()

    // Validate required fields
    if (!body.name || !body.type || !body.description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Build enhanced idea with full context
    const enhancedIdea = buildEnhancedIdea(body)
    
    // Generate project slug
    const projectSlug = body.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    // First try the orchestrator with full context
    const orchestratorUrl = process.env.ORCHESTRATOR_URL || 'http://localhost:8080'
    
    try {
      console.log('Calling orchestrator with enhanced context...')
      const orchestratorResponse = await fetch(`${orchestratorUrl}/api/pipeline/step0/enhanced`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea: enhancedIdea,
          metadata: {
            ...body,
            dashboard: DASHBOARD_CONTEXT,
            schema_version: '2.0',
            pipeline_mode: 'full_requirements'
          }
        }),
        signal: AbortSignal.timeout(60000) // 60 second timeout
      })

      if (orchestratorResponse.ok) {
        const data = await orchestratorResponse.json()
        console.log('Orchestrator generated requirements successfully')
        
        return NextResponse.json({
          success: true,
          requirements: data.requirements || data.output,
          metadata: {
            generator: 'orchestrator-enhanced',
            schema_version: '2.0',
            context_used: ['business', 'technical', 'market', 'compliance'],
            ...data.metadata
          }
        })
      }
    } catch (orchestratorError) {
      console.log('Orchestrator not available, using Step 0 pipeline directly')
    }

    // Fallback to Step 0 V2 pipeline with enhanced context
    const tempRunnerPath = `/tmp/run-step0-enhanced-${Date.now()}.ts`
    const tempOutputDir = `/tmp/step0-output-${Date.now()}`
    
    const runnerScript = `#!/usr/bin/env node
import { Step0IdeaToMarkdownEnhancedV2, IdeaExpansionConfig } from '${path.join('/home/sali/ai/projects/projecthubv3/ai-enhanced-pipeline/src/steps/step0-idea-to-markdown-enhanced-v2.js')}';
import { PipelineConfig } from '${path.join('/home/sali/ai/projects/projecthubv3/ai-enhanced-pipeline/src/types/index.js')}';
import { promises as fs } from 'fs';
import * as path from 'path';

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
    timeout: 90000,
    enhancedMode: true
  };

  const ideaConfig = {
    idea: \`${enhancedIdea.replace(/`/g, '\\`')}\`,
    category: '${getProjectCategory(body.type)}',
    targetAudience: '${body.targetAudience}',
    projectsPath: '/home/sali/ai/projects/projecthubv3/projects',
    userPriorities: ${JSON.stringify(body.priorities || [])},
    geography: '${body.geography.join(', ')}',
    compliance: ${JSON.stringify(body.compliance || [])}
  };

  try {
    await fs.mkdir('${tempOutputDir}', { recursive: true });
    
    const step0 = new Step0IdeaToMarkdownEnhancedV2(config, ideaConfig);
    const result = await step0.execute();
    
    if (result.success) {
      // Read the output directory to find the generated files
      const files = await fs.readdir('${tempOutputDir}');
      let requirementsContent = '';
      
      // Look for requirements.md file
      const mdFile = files.find(f => f.includes('requirements') && f.endsWith('.md'));
      if (mdFile) {
        requirementsContent = await fs.readFile(path.join('${tempOutputDir}', mdFile), 'utf-8');
      } else if (result.outputFiles && result.outputFiles.length > 0) {
        // Fallback to first output file
        const firstFile = await fs.readFile(result.outputFiles[0], 'utf-8');
        // If it's YAML, skip the meta section
        if (firstFile.startsWith('meta:')) {
          const lines = firstFile.split('\\n');
          const contentStart = lines.findIndex(line => line.startsWith('# '));
          if (contentStart > 0) {
            requirementsContent = lines.slice(contentStart).join('\\n');
          } else {
            requirementsContent = firstFile;
          }
        } else {
          requirementsContent = firstFile;
        }
      }
      
      console.log('---REQUIREMENTS START---');
      console.log(requirementsContent);
      console.log('---REQUIREMENTS END---');
      console.log('---METADATA START---');
      console.log(JSON.stringify({
        success: true,
        duration: result.duration,
        files: files,
        outputFiles: result.outputFiles,
        context_used: ['platform', 'audience', 'industry', 'compliance']
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
      // Write and execute the runner
      await fs.writeFile(tempRunnerPath, runnerScript, 'utf-8')
      
      const pipelineDir = '/home/sali/ai/projects/projecthubv3/ai-enhanced-pipeline'
      const command = `cd ${pipelineDir} && npx tsx ${tempRunnerPath}`
      
      console.log('Executing Step 0 V2 with enhanced context...')
      const { stdout, stderr } = await execAsync(command, {
        maxBuffer: 1024 * 1024 * 10, // 10MB
        timeout: 120000, // 2 minutes
        env: {
          ...process.env,
          NODE_ENV: 'production',
          ENHANCED_MODE: 'true'
        }
      })

      // Clean up
      await fs.unlink(tempRunnerPath).catch(() => {})
      await fs.rm(tempOutputDir, { recursive: true, force: true }).catch(() => {})

      // Extract requirements
      const reqStart = stdout.indexOf('---REQUIREMENTS START---')
      const reqEnd = stdout.indexOf('---REQUIREMENTS END---')
      
      if (reqStart !== -1 && reqEnd !== -1) {
        const requirements = stdout.substring(reqStart + 24, reqEnd).trim()
        
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
            schema_version: '2.0',
            enhanced_context: true,
            ...metadata
          }
        })
      }
    } catch (execError: any) {
      console.error('Pipeline execution error:', execError)
    }

    // Final fallback to basic generation
    return generateFallbackRequirements(body)

  } catch (error: any) {
    console.error('Error in Step 0 V3:', error)
    return NextResponse.json(
      { error: 'Failed to generate requirements', details: error.message },
      { status: 500 }
    )
  }
}

// Fallback requirements generation with enhanced context
function generateFallbackRequirements(data: EnhancedStep0Request) {
  const typeInfo = getProjectTypeInfo(data.type)
  const budgetInfo = getBudgetDescription(data.budget)
  const timelineInfo = getTimelineDescription(data.timeline)
  
  const requirements = `# ${data.name}

## Project Overview
${data.description}

## Vision & Goals
- **Mission**: Create a ${typeInfo?.name || data.type} that serves ${data.targetAudience} in the ${data.industry} industry
- **Primary Goal**: ${data.competitors ? `Compete with ${data.competitors} by offering superior features` : 'Establish market presence'}
- **Success Metrics**: User adoption, performance benchmarks, revenue targets

## Project Type
- **Platform**: ${typeInfo?.category || 'Web'} - ${typeInfo?.name || data.type}
- **Architecture**: ${data.budget === 'enterprise' ? 'Microservices' : 'Monolithic'}
- **Deployment**: Cloud-native, containerized

## Target Market
- **Audience**: ${data.targetAudience}
- **Industry**: ${data.industry}
- **Geography**: ${data.geography.join(', ')}
- **Market Size**: Based on ${data.industry} sector analysis

## Core Features (MVP)
${generateCoreFeatures(data)}

## Advanced Features (Post-MVP)
${generateAdvancedFeatures(data)}

## Technical Requirements
- **Performance**: ${data.priorities?.includes('performance') ? 'High-performance, <100ms response times' : 'Standard performance metrics'}
- **Security**: ${data.priorities?.includes('security') ? 'Enterprise-grade security' : 'Standard security practices'}
- **Scalability**: ${data.priorities?.includes('scalability') ? 'Auto-scaling, load balanced' : 'Vertical scaling'}
- **Stack**: Modern technology stack appropriate for ${typeInfo?.name}

## UI/UX Requirements
- **Design**: ${DASHBOARD_CONTEXT.branding.style}
- **Accessibility**: WCAG 2.1 AA compliant
- **Responsive**: Mobile-first design
- **Performance**: ${data.priorities?.includes('ux') ? 'Optimized for user experience' : 'Standard UX patterns'}

## Compliance & Security
${data.compliance?.length ? data.compliance.map(c => `- ${c} compliance required`).join('\\n') : '- Standard security practices'}
- Data encryption at rest and in transit
- Regular security audits

## Budget & Timeline
- **Budget**: ${budgetInfo}
- **Timeline**: ${timelineInfo}
- **Team Size**: ${data.budget === 'mvp' ? '1-2 developers' : data.budget === 'enterprise' ? '10+ team members' : '3-5 developers'}

## Monetization Strategy
${data.monetization ? `- Model: ${data.monetization}` : '- To be determined based on market analysis'}

## Risk Assessment
- Technical risks and mitigation strategies
- Market risks and contingency plans
- Compliance risks and preventive measures

## Success Criteria
- Launch within timeline and budget
- Achieve target user adoption
- Meet performance benchmarks
- Positive user feedback

---
Generated by Ultimate AI Dashboard
Schema Version: 2.0`

  return NextResponse.json({
    success: true,
    requirements,
    metadata: {
      generator: 'fallback-enhanced',
      schema_version: '2.0',
      enhanced_context: true,
      fallback_reason: 'Primary methods unavailable'
    }
  })
}

function generateCoreFeatures(data: EnhancedStep0Request): string {
  const features = []
  
  // Add platform-specific core features
  const typeInfo = getProjectTypeInfo(data.type)
  if (typeInfo?.category === 'Web' && data.type === 'static-site') {
    features.push(
      '- Static HTML generation with modern build tools',
      '- Offline functionality with service workers',
      '- SEO optimization and meta tags',
      '- Fast page load times (<2s)'
    )
  } else if (typeInfo?.category === 'Mobile') {
    features.push(
      '- Native app performance',
      '- Offline data synchronization',
      '- Push notifications',
      '- Device hardware integration'
    )
  }
  
  // Add priority-based features
  if (data.priorities?.includes('performance')) {
    features.push('- Performance monitoring and optimization')
  }
  if (data.priorities?.includes('security')) {
    features.push('- Advanced authentication and authorization')
  }
  
  return features.join('\\n') || '- Core functionality as described\\n- Basic user interface\\n- Essential features only'
}

function generateAdvancedFeatures(data: EnhancedStep0Request): string {
  const features = []
  
  if (data.budget === 'medium' || data.budget === 'enterprise') {
    features.push(
      '- Advanced analytics dashboard',
      '- AI-powered recommendations',
      '- Third-party integrations',
      '- Advanced reporting features'
    )
  }
  
  if (data.targetAudience === 'enterprises') {
    features.push(
      '- SSO/SAML integration',
      '- Advanced permissions system',
      '- Audit logging',
      '- White-label options'
    )
  }
  
  return features.join('\\n') || '- Extended feature set\\n- Premium capabilities\\n- Advanced integrations'
}