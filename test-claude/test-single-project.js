#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { spawn } = require('child_process');

// Test with a specific project
const PROJECT_ID = 'cvp-api-service-city-service-reporter';
const PROJECT_DIR = `/home/sali/ai/projects/projecthubv3/projects/${PROJECT_ID}`;
const OUTPUT_DIR = path.join(PROJECT_DIR, 'ai-generated');

// Same prompt from the main script
const BULK_PROCESSING_PROMPT = `
You are a senior software architect creating technical specifications for development.

TASK:
1. Read "ai-generated/specification.yaml" using MCP.Filesystem
2. Write a developer-focused "ai-generated/requirements.md" document (minimum 2000 words)

FOCUS: Create actionable technical specifications that LLMs can use for code generation, not business presentations.

# [Project Name] - Technical Specifications

## Project Overview
- **Purpose**: What this software does (1-2 sentences)
- **Platform**: Web app, mobile app, API, Chrome extension, etc.
- **Target Users**: Who uses this and how
- **Core Value**: Main problem it solves

## Feature Specifications
List 8-12 features with implementation details:

### Feature: [Name]
- **Description**: What it does and why
- **User Flow**: Step-by-step user interaction
- **API Endpoints**: Required endpoints (GET/POST/PUT/DELETE with paths)
- **Data Models**: Required database tables/fields
- **UI Components**: Key interface elements needed
- **Dependencies**: What this feature requires

## Technical Architecture

### Technology Stack
- **Frontend**: Specific frameworks, libraries, versions
- **Backend**: Languages, frameworks, databases
- **APIs**: Third-party services and integrations
- **Infrastructure**: Hosting, storage, CDN requirements

### Data Models
- **Database Schema**: Tables, relationships, key fields
- **API Data Structures**: Request/response formats
- **File Storage**: What files/media need to be stored
- **Caching Strategy**: What should be cached and how

### API Design
- **Endpoints List**: All required API routes
- **Authentication**: How users log in and stay logged in
- **Permissions**: Who can access what features
- **Rate Limiting**: API usage limits and throttling

## Implementation Roadmap

### Phase 1: Core MVP (Weeks 1-4)
- [ ] Basic authentication system
- [ ] Core data models and database setup
- [ ] Essential API endpoints
- [ ] Basic UI for main features
- [ ] Key integrations

### Phase 2: Enhanced Features (Weeks 5-8)
- [ ] Advanced features and workflows
- [ ] UI polish and responsive design
- [ ] Additional integrations
- [ ] Performance optimization
- [ ] Testing and bug fixes

### Phase 3: Launch Preparation (Weeks 9-12)
- [ ] Security hardening
- [ ] Documentation
- [ ] Deployment setup
- [ ] Monitoring and analytics
- [ ] Launch and post-launch support

## Development Guidelines

### Code Organization
- **Project Structure**: How to organize files and folders
- **Naming Conventions**: Variables, functions, components
- **Code Style**: Formatting and best practices
- **Testing Strategy**: Unit tests, integration tests, coverage targets

### Performance Requirements
- **Page Load Times**: Target speeds for different views
- **API Response Times**: Expected response speeds
- **Concurrent Users**: How many users system should handle
- **Database Performance**: Query optimization requirements

### Security & Compliance
- **Authentication**: How users prove identity
- **Authorization**: Permission system design
- **Data Protection**: Encryption, privacy, GDPR compliance
- **Input Validation**: Preventing security vulnerabilities
- **Error Handling**: Safe error messages and logging

## Quality Assurance

### Testing Strategy
- **Automated Testing**: Unit, integration, end-to-end tests
- **Manual Testing**: User acceptance testing process
- **Performance Testing**: Load testing and optimization
- **Security Testing**: Vulnerability scanning and penetration testing

### Deployment Process
- **Environment Setup**: Dev, staging, production configurations
- **CI/CD Pipeline**: Automated build, test, and deployment
- **Monitoring**: Error tracking, performance monitoring
- **Backup Strategy**: Data backup and disaster recovery

REQUIREMENTS:
- Minimum 2000 words total
- Focus on technical implementation details
- Include specific API endpoints, data models, and code requirements
- Make content actionable for developers and code generation
- Use information from the specification file

Start by reading the specification file and create the technical requirements document.
`;

async function testSingleProject() {
  console.log(`🧪 Testing with project: ${PROJECT_ID}`);
  
  // Check if project exists
  if (!fs.existsSync(PROJECT_DIR)) {
    console.error(`❌ Project directory not found: ${PROJECT_DIR}`);
    return;
  }
  
  // Check if specification exists
  const specFile = path.join(PROJECT_DIR, 'ai-generated', 'specification.yaml');
  if (!fs.existsSync(specFile)) {
    console.error(`❌ Specification file not found: ${specFile}`);
    return;
  }
  
  // Backup existing requirements if any
  const outputFile = path.join(OUTPUT_DIR, 'requirements.md');
  if (fs.existsSync(outputFile)) {
    const backupFile = path.join(OUTPUT_DIR, 'requirements.md.backup');
    fs.copyFileSync(outputFile, backupFile);
    console.log(`📦 Backed up existing requirements to: ${backupFile}`);
  }
  
  // Create prompt file
  const promptFile = path.join(PROJECT_DIR, '.claude-prompt-temp.txt');
  fs.writeFileSync(promptFile, BULK_PROCESSING_PROMPT);
  
  console.log('🚀 Invoking Claude CLI...');
  const startTime = Date.now();
  
  // Ensure output dir exists
  fs.ensureDirSync(OUTPUT_DIR);
  
  // Run Claude with exact pattern from main script
  const claudeProcess = spawn('claude', [
    '--allowedTools', 'MCP.Filesystem',
    '--add-dir', OUTPUT_DIR,
    '--dangerously-skip-permissions',
    '-p'
  ], {
    cwd: PROJECT_DIR,
    stdio: ['pipe', 'pipe', 'pipe']
  });
  
  // Pipe prompt
  const promptStream = fs.createReadStream(promptFile);
  promptStream.pipe(claudeProcess.stdin);
  
  // Capture output
  let stdoutData = '';
  let stderrData = '';
  
  claudeProcess.stdout.on('data', (data) => {
    stdoutData += data.toString();
    process.stdout.write(data);
  });
  
  claudeProcess.stderr.on('data', (data) => {
    stderrData += data.toString();
    process.stderr.write(data);
  });
  
  claudeProcess.on('close', (code) => {
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    
    // Cleanup
    try {
      fs.unlinkSync(promptFile);
    } catch (e) {}
    
    console.log(`\n⏱️  Process completed in ${duration}s with code: ${code}`);
    
    if (fs.existsSync(outputFile)) {
      const content = fs.readFileSync(outputFile, 'utf-8');
      const wordCount = content.split(/\s+/).length;
      
      console.log(`\n✅ Requirements generated successfully!`);
      console.log(`📊 Word count: ${wordCount} words`);
      console.log(`📄 Output file: ${outputFile}`);
      
      // Detect platform
      let platform = 'unknown';
      if (content.includes('Chrome Extension')) platform = 'chrome-extension';
      else if (content.includes('API Service')) platform = 'api-service';
      else if (content.includes('Mobile App')) platform = 'mobile-app';
      else if (content.includes('Web Application') || content.includes('Web App')) platform = 'web-app';
      else if (content.includes('Discord Bot')) platform = 'discord-bot';
      else if (content.includes('CLI Tool')) platform = 'cli-tool';
      
      console.log(`🎯 Detected platform: ${platform}`);
      
      // Show first few lines
      const lines = content.split('\n').slice(0, 20);
      console.log(`\n📄 First 20 lines of output:`);
      console.log('---');
      lines.forEach(line => console.log(line));
      console.log('---');
      
    } else {
      console.error(`\n❌ Failed to generate requirements`);
      if (stderrData) {
        console.error('Error output:', stderrData);
      }
    }
  });
  
  // Timeout after 3 minutes
  setTimeout(() => {
    console.error('\n⏰ Timeout: Killing process after 3 minutes');
    claudeProcess.kill('SIGTERM');
  }, 180000);
}

// Run test
testSingleProject().catch(console.error);