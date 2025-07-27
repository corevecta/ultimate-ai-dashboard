#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { spawn } = require('child_process');

const PROJECT_DIR = '/home/sali/ai/projects/projecthubv3/projects/cvp-api-service-city-service-reporter';
const OUTPUT_DIR = path.join(PROJECT_DIR, 'ai-generated');

// Developer-focused prompt (condensed)
const DEVELOPER_PROMPT = `
You are a senior software architect creating technical specifications.

Read the specification.yaml file in ai-generated/ directory and create a comprehensive requirements.md file (minimum 2000 words) with these sections:

# [Project Name] - Technical Specifications

## Project Overview
- Purpose, Platform type, Target Users, Core Value

## Feature Specifications (8-12 features)
For each feature include:
- Description
- User Flow
- API Endpoints (GET/POST/PUT/DELETE)
- Data Models
- UI Components
- Dependencies

## Technical Architecture
- Technology Stack (Frontend, Backend, APIs, Infrastructure)
- Data Models (Database Schema, API Structures)
- API Design (Endpoints, Authentication, Permissions)

## Implementation Roadmap
- Phase 1: Core MVP (Weeks 1-4)
- Phase 2: Enhanced Features (Weeks 5-8)  
- Phase 3: Launch Preparation (Weeks 9-12)

## Development Guidelines
- Code Organization
- Performance Requirements
- Security & Compliance

## Quality Assurance
- Testing Strategy
- Deployment Process

Write the complete requirements.md file now with at least 2000 words.`;

async function testDeveloperPrompt() {
  console.log('🧪 Testing with developer-focused prompt...');
  
  // Backup existing file
  const outputFile = path.join(OUTPUT_DIR, 'requirements.md');
  if (fs.existsSync(outputFile)) {
    fs.copyFileSync(outputFile, outputFile + '.backup2');
    console.log('📦 Backed up existing file');
  }
  
  // Create prompt file
  const promptFile = path.join(PROJECT_DIR, '.dev-prompt.txt');
  fs.writeFileSync(promptFile, DEVELOPER_PROMPT);
  
  console.log('🚀 Running Claude with developer prompt...\n');
  
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
  
  let killed = false;
  
  claude.on('close', (code) => {
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`\n⏱️ Process completed in ${duration}s with code: ${code}`);
    
    // Cleanup
    try {
      fs.unlinkSync(promptFile);
    } catch (e) {}
    
    if (fs.existsSync(outputFile)) {
      const content = fs.readFileSync(outputFile, 'utf-8');
      const wordCount = content.split(/\s+/).length;
      console.log(`✅ Generated ${wordCount} words`);
      
      if (wordCount >= 2000) {
        console.log('🎯 Success! Met 2000 word minimum');
      } else {
        console.log('⚠️  Below 2000 word target');
      }
      
      // Show first 30 lines
      const lines = content.split('\n').slice(0, 30);
      console.log('\n📄 First 30 lines:');
      console.log('---');
      lines.forEach((line, i) => console.log(`${i+1}: ${line}`));
      console.log('---');
    } else {
      console.log('❌ No output file generated');
    }
    
    if (!killed) {
      process.exit(code);
    }
  });
  
  // 2 minute timeout
  setTimeout(() => {
    if (!claude.killed) {
      killed = true;
      console.log('\n⏰ Timeout after 2 minutes, killing process...');
      claude.kill('SIGTERM');
    }
  }, 120000);
}

testDeveloperPrompt().catch(console.error);