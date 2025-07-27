import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'
import { createJob } from '@/lib/job-queue'

const PROJECTS_DIR = '/home/sali/ai/projects/projecthubv3/projects'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params

    // Find the specification.yaml file
    const possiblePaths = [
      path.join(PROJECTS_DIR, projectId, 'specification.yaml'),
      path.join(PROJECTS_DIR, `cvp-${projectId}`, 'specification.yaml'),
      path.join(PROJECTS_DIR, projectId, 'ai-generated', 'specification.yaml'),
      path.join(PROJECTS_DIR, `cvp-${projectId}`, 'ai-generated', 'specification.yaml'),
    ]

    let specPath: string | null = null
    let specContent: any = null

    for (const testPath of possiblePaths) {
      if (fs.existsSync(testPath)) {
        specPath = testPath
        const content = fs.readFileSync(testPath, 'utf-8')
        specContent = yaml.load(content)
        break
      }
    }

    if (!specPath || !specContent) {
      return NextResponse.json({ error: 'Specification file not found' }, { status: 404 })
    }

    // Get the project directory
    const projectDir = path.dirname(specPath)
    
    // Build the requirements prompt with all context
    const prompt = buildRequirementsPrompt(specContent, projectId, projectDir)

    // Create job for Claude CLI processing
    const job = createJob({
      type: 'claude-cli',
      input: { 
        prompt,
        expectedFile: path.join(projectDir, 'requirements.md'),
        projectId,
        context: {
          specificationPath: specPath,
          step: 'regenerate-requirements'
        }
      }
    })

    return NextResponse.json({
      jobId: job.id,
      message: 'Requirements regeneration started',
      projectId
    })

  } catch (error) {
    console.error('Error regenerating requirements:', error)
    return NextResponse.json(
      { error: 'Failed to regenerate requirements' },
      { status: 500 }
    )
  }
}

function buildRequirementsPrompt(specification: any, projectId: string, projectDir: string): string {
  // Extract basic project information
  const projectName = specification.name || specification.project?.name || projectId
  const projectType = specification.type || specification.project?.type || 'web application'
  const description = specification.description || specification.project?.description || ''
  
  // Extract business context
  const businessContext = specification.business_context || specification.businessContext || {}
  const targetAudience = businessContext.target_audience || businessContext.targetAudience || 'General users'
  const industry = businessContext.industry || 'Technology'
  const geography = businessContext.geography || ['Global']
  const budget = businessContext.budget || 'Flexible'
  const timeline = businessContext.timeline || '3-6 months'
  const monetization = businessContext.monetization || businessContext.revenue_model || specification.monetization?.model || ''
  const competitors = businessContext.competitors || ''
  const priorities = businessContext.priorities || []
  const compliance = businessContext.compliance || []
  
  // Extract features with proper handling
  const coreFeatures = specification.features?.core || []
  const advancedFeatures = specification.features?.advanced || []
  
  // Extract feature details
  const getFeatureDetails = (feature: any) => {
    if (typeof feature === 'string') return { name: feature, description: '' }
    if (feature && typeof feature === 'object') {
      return { 
        name: feature.name || 'Unnamed feature',
        description: feature.description || ''
      }
    }
    return { name: 'Feature', description: '' }
  }
  
  const coreFeatureDetails = coreFeatures.map(getFeatureDetails)
  const advancedFeatureDetails = advancedFeatures.map(getFeatureDetails)
  
  // Extract technical details
  const architecture = specification.architecture || specification.technical?.architecture || {}
  const techStack = specification.technology_stack || specification.tech_stack || specification.technical?.stack || {}
  const integrations = specification.integrations || specification.technical?.integrations || []
  const dataStructure = specification.data_structure || {}
  
  return `You are an expert requirements analyst creating comprehensive project requirements for a ${projectType} called "${projectName}".

CRITICAL INSTRUCTIONS:
1. Write the requirements to a file called '${projectDir}/requirements.md' using MCP filesystem
2. Generate UNIQUE, PROJECT-SPECIFIC content - NO generic templates
3. Create realistic user personas and stories based on the actual project features and target audience
4. Design architecture that specifically fits this project's needs
5. All content must be tailored to "${projectName}" and its specific features
6. Consider the business context, industry, and monetization model in all sections

PROJECT DETAILS:
Name: ${projectName}
Type: ${projectType}
Description: ${description}

BUSINESS CONTEXT:
- Target Audience: ${targetAudience}
- Industry: ${industry}
- Geography: ${Array.isArray(geography) ? geography.join(', ') : geography}
- Budget: ${budget}
- Timeline: ${timeline}
${monetization ? `- Monetization Model: ${monetization}` : ''}
${competitors ? `- Competitors/Similar: ${competitors}` : ''}
${priorities.length > 0 ? `- Key Priorities: ${priorities.join(', ')}` : ''}
${compliance.length > 0 ? `- Compliance Requirements: ${compliance.join(', ')}` : ''}

CORE FEATURES:
${coreFeatureDetails.map((f, i) => `${i + 1}. ${f.name}${f.description ? ': ' + f.description : ''}`).join('\n')}

ADVANCED FEATURES:
${advancedFeatureDetails.map((f, i) => `${i + 1}. ${f.name}${f.description ? ': ' + f.description : ''}`).join('\n')}

TECHNICAL CONTEXT:
${architecture.framework || techStack.frontend?.framework ? `- Framework: ${architecture.framework || techStack.frontend?.framework}` : ''}
${architecture.database || techStack.backend?.database ? `- Database: ${architecture.database || techStack.backend?.database}` : ''}
${architecture.deployment || techStack.deployment ? `- Deployment: ${architecture.deployment || techStack.deployment}` : ''}
${integrations.length > 0 ? `- Integrations: ${Array.isArray(integrations) ? integrations.map((i: any) => typeof i === 'string' ? i : i.name).join(', ') : integrations}` : ''}

FULL SPECIFICATION:
${JSON.stringify(specification, null, 2)}

Create a comprehensive requirements.md file with these sections:

# ${projectName} - Project Requirements

## Project Overview
Write a compelling, specific overview of what ${projectName} aims to achieve. Focus on:
- The specific problem it solves
- The target audience and their needs
- The unique value proposition
- How it differentiates from existing solutions

## Core Requirements

### Functional Requirements
For EACH core feature listed above, create detailed functional requirements:
- What exactly the feature does
- User interactions and workflows
- Data inputs and outputs
- Edge cases and error handling
- Integration points with other features

### Non-Functional Requirements
Based on the project type (${projectType}), specify:
1. Performance Requirements
   - Specific metrics relevant to ${projectType}
   - Load handling expectations
   - Response time requirements
   
2. Security Requirements
   - Authentication methods appropriate for the features
   - Data protection needs based on the data types handled
   - Compliance requirements if applicable
   
3. Scalability Requirements
   - Expected user growth patterns
   - Data volume projections
   - Infrastructure scaling strategy

4. Reliability Requirements
   - Uptime expectations
   - Backup and recovery procedures
   - Failure handling

## Technical Architecture

Design an architecture specifically for ${projectName}:
- Choose technologies that best fit the features
- Create a system diagram showing components
- Explain why each technology choice makes sense
- Show how components interact

## User Stories

Create SPECIFIC user stories for ${projectName}:
- Define 3-5 realistic user personas based on "${targetAudience}" in the ${industry} industry
- Consider the ${Array.isArray(geography) ? geography.join(', ') : geography} market context
- For each persona, write 3-5 user stories that relate to the actual features listed above
- Format: "As a [specific persona], I want to [use specific feature] so that [achieve specific goal]"

DO NOT use generic personas. Create personas that specifically match:
- Target audience: ${targetAudience}
- Industry: ${industry}
- Geography: ${Array.isArray(geography) ? geography.join(', ') : geography}
${monetization ? `- Who would pay for: ${monetization}` : ''}

## Data Model

Design the data model based on the actual features:
- Define entities needed for each feature
- Show relationships between entities
- Include sample data structures
- Explain data flow through the system

## API Design

If applicable, design APIs for ${projectName}:
- RESTful endpoints for each major feature
- Request/response formats
- Authentication requirements
- Rate limiting needs

## Integration Requirements

Based on the features, identify:
- Third-party services needed (payment, email, SMS, etc.)
- External APIs to consume
- Webhook requirements
- Data synchronization needs

## UI/UX Requirements

Describe the user interface needs:
- Key screens/pages for each feature
- Navigation structure
- Responsive design requirements
- Accessibility standards
- Brand/design guidelines

## Testing Strategy

Define testing approach for ${projectName}:
- Unit test coverage expectations
- Integration test scenarios
- User acceptance test cases
- Performance test benchmarks
- Security test requirements

## Deployment & DevOps

Specify deployment requirements:
- Environment needs (dev, staging, production)
- CI/CD pipeline requirements
- Monitoring and logging needs
- Infrastructure requirements
- Backup and disaster recovery

## Project Timeline

Create a realistic timeline based on "${timeline}" budget of "${budget}":
- Phase 1: MVP with core features (list specific features from above)
- Phase 2: Additional features (list specific features from above)
- Phase 3: Advanced features and optimization
- Include specific milestones and deliverables
- Consider ${industry} industry launch windows and market timing

## Success Metrics

Define measurable success criteria specific to ${projectName}:
- User adoption targets for ${targetAudience}
- Performance benchmarks relevant to ${projectType}
- Business metrics aligned with ${monetization || 'the business model'}
- Technical metrics for the chosen tech stack
- Quality metrics for ${industry} standards
${compliance.length > 0 ? `- Compliance metrics for: ${compliance.join(', ')}` : ''}

## Risk Analysis

Identify project-specific risks:
- Technical risks and mitigation strategies
- Business risks and contingency plans
- Security risks and prevention measures
- Timeline risks and buffer planning

FINAL CRITICAL INSTRUCTIONS:
1. Every section must be specific to ${projectName} and its features
2. NO generic content or boilerplate text
3. NO generic user personas (e.g., "John the developer" or "Sarah the manager")
4. Create personas that match ${targetAudience} in ${industry}
5. Architecture must be justified by the specific features and scale requirements
6. User stories must reference the ACTUAL features listed above, not generic actions
7. Make it feel like this document was crafted specifically for this unique project
8. If you mention any technology, explain WHY it's the right choice for THIS project

Write the complete requirements document to '${projectDir}/requirements.md' using the MCP filesystem tool.`
}