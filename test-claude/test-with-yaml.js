#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const yaml = require('yaml');
const { spawn } = require('child_process');

const PROJECT_DIR = '/home/sali/ai/projects/projecthubv3/projects/cvp-api-service-city-service-reporter';
const OUTPUT_DIR = path.join(PROJECT_DIR, 'ai-generated');
const YAML_FILE = path.join(OUTPUT_DIR, 'specification.yaml');

async function testWithYaml() {
  console.log('🧪 Testing with YAML embedded in prompt...');
  
  // Read the specification
  if (!fs.existsSync(YAML_FILE)) {
    console.error('❌ Specification file not found:', YAML_FILE);
    return;
  }
  
  const specContent = fs.readFileSync(YAML_FILE, 'utf8');
  const spec = yaml.parse(specContent);
  
  console.log(`📄 Project Type: ${spec.project.type}`);
  console.log(`🎯 Description: ${spec.project.description.unique_value}`);
  
  // Create prompt with YAML embedded
  const prompt = `
You are a senior software architect creating technical specifications.

**Objective:** Generate a comprehensive requirements.md file (minimum 2000 words) for this project.

**How to work:**
- Analyze the specification below
- Create a developer-focused requirements document
- Output to /ai-generated/requirements.md using MCP.Filesystem tool
- Focus on technical implementation details

## PROJECT SPECIFICATION:
\`\`\`yaml
${specContent}
\`\`\`

Create the following document structure:

# Technical Specifications

## Project Overview
- **Purpose**: What this software does
- **Platform**: Determine from the project ID and features
- **Target Users**: Detail from spec
- **Core Value**: Main problem solved

## Feature Specifications
List 8-12 features with implementation details:

### Feature: [Name]
- **Description**: What it does and why
- **User Flow**: Step-by-step interaction
- **API Endpoints**: GET/POST/PUT/DELETE paths
- **Data Models**: Database tables/fields
- **UI Components**: Interface elements
- **Dependencies**: Requirements

## Technical Architecture

### Technology Stack
- **Frontend**: React, TypeScript
- **Backend**: Node.js, PostgreSQL
- **APIs**: Third-party integrations
- **Infrastructure**: Cloud providers, CDN

### Data Models
- **Database Schema**: Tables, relationships
- **API Structures**: Request/response formats
- **File Storage**: Media storage needs
- **Caching**: Redis or similar

### API Design
- **Endpoints**: All required routes
- **Authentication**: JWT, OAuth, etc.
- **Permissions**: Role-based access
- **Rate Limiting**: API throttling

## Implementation Roadmap

### Phase 1: Core MVP (Weeks 1-4)
- [ ] Authentication system
- [ ] Core data models
- [ ] Essential API endpoints
- [ ] Basic UI features
- [ ] Key integrations

### Phase 2: Enhanced Features (Weeks 5-8)
- [ ] Advanced features
- [ ] UI polish
- [ ] Additional integrations
- [ ] Performance optimization
- [ ] Testing

### Phase 3: Launch (Weeks 9-12)
- [ ] Security hardening
- [ ] Documentation
- [ ] Deployment
- [ ] Monitoring
- [ ] Launch support

## Development Guidelines

### Code Organization
- Project structure
- Naming conventions
- Code style
- Testing strategy

### Performance Requirements
- Page load: <2s
- API response: <200ms
- Concurrent users: 1000+
- Database optimization

### Security & Compliance
- Authentication methods
- Authorization system
- Data protection
- Input validation
- Error handling

## Quality Assurance

### Testing Strategy
- Unit tests (80% coverage)
- Integration tests
- End-to-end tests
- Performance tests
- Security tests

### Deployment Process
- CI/CD pipeline
- Environment setup
- Monitoring tools
- Backup strategy

REQUIREMENTS:
- Minimum 2000 words
- Technical focus for developers
- Specific implementation details
- Actionable for code generation

Start writing the requirements.md file now.
`;

  // Write prompt to file
  const promptFile = path.join(PROJECT_DIR, '.full-prompt.txt');
  fs.writeFileSync(promptFile, prompt);
  
  console.log('🚀 Running Claude with full prompt...\n');
  
  const startTime = Date.now();
  
  const claude = spawn('claude', [
    '--allowedTools', 'MCP.Filesystem',
    '--add-dir', OUTPUT_DIR,
    '--dangerously-skip-permissions',
    '-p'
  ], {
    cwd: PROJECT_DIR,
    stdio: ['pipe', 'inherit', 'inherit']
  });
  
  const promptStream = fs.createReadStream(promptFile);
  promptStream.pipe(claude.stdin);
  
  claude.on('close', (code) => {
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`\n⏱️ Completed in ${duration}s with code: ${code}`);
    
    // Cleanup
    try {
      fs.unlinkSync(promptFile);
    } catch (e) {}
    
    const outputFile = path.join(OUTPUT_DIR, 'requirements.md');
    if (fs.existsSync(outputFile)) {
      const content = fs.readFileSync(outputFile, 'utf-8');
      const wordCount = content.split(/\s+/).length;
      console.log(`✅ Generated ${wordCount} words`);
      
      if (wordCount >= 2000) {
        console.log('🎯 Success! Met 2000 word minimum');
      }
    } else {
      console.log('❌ No output file generated');
    }
  });
  
  // 3 minute timeout
  setTimeout(() => {
    if (!claude.killed) {
      console.log('\n⏰ Timeout after 3 minutes');
      claude.kill('SIGTERM');
    }
  }, 180000);
}

testWithYaml().catch(console.error);