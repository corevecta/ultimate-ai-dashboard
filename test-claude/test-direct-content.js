#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { spawn } = require('child_process');

const PROJECT_DIR = '/home/sali/ai/projects/projecthubv3/projects/cvp-api-service-city-service-reporter';
const OUTPUT_DIR = path.join(PROJECT_DIR, 'ai-generated');

// Direct prompt without asking Claude to read files
const DIRECT_PROMPT = `
You are creating technical specifications.

Write a comprehensive requirements.md file (minimum 2000 words) with these sections:

# City Service Reporter - Technical Specifications

## Project Overview
This is an API service for city service reporting. It allows citizens to report issues like potholes, broken streetlights, graffiti, etc. to their local government.

## Feature Specifications
List 8-12 features:

### Feature 1: Issue Reporting
- **Description**: Citizens can report city issues with photos and location
- **User Flow**: Open app → Take photo → Add description → Submit
- **API Endpoints**: POST /api/reports, GET /api/reports/{id}
- **Data Models**: reports table (id, type, description, lat, lng, photo_url, status)
- **UI Components**: Camera component, location picker, form
- **Dependencies**: Camera API, GPS

### Feature 2: Issue Tracking
- **Description**: Track status of reported issues
- **User Flow**: View my reports → See status updates → Get notifications
- **API Endpoints**: GET /api/reports/user/{userId}, GET /api/reports/{id}/status
- **Data Models**: status_updates table (report_id, status, timestamp, notes)
- **UI Components**: Report list, status timeline, push notifications
- **Dependencies**: Push notification service

### Feature 3: Admin Dashboard
- **Description**: City officials can manage and assign reports
- **User Flow**: Login → View new reports → Assign to department → Update status
- **API Endpoints**: GET /api/admin/reports, PUT /api/reports/{id}/assign
- **Data Models**: assignments table, departments table
- **UI Components**: Admin dashboard, assignment modal, filters
- **Dependencies**: Authentication, role management

Continue with 5-9 more features...

## Technical Architecture

### Technology Stack
- **Frontend**: React Native for mobile, React for web dashboard
- **Backend**: Node.js with Express, PostgreSQL database
- **APIs**: Google Maps, AWS S3 for photos, SendGrid for emails
- **Infrastructure**: AWS EC2, RDS, CloudFront CDN

### Data Models
Describe all database tables, relationships, and key fields...

### API Design
List all endpoints with authentication and rate limiting...

## Implementation Roadmap

### Phase 1: Core MVP (Weeks 1-4)
Detailed task list...

### Phase 2: Enhanced Features (Weeks 5-8)
Additional features...

### Phase 3: Launch (Weeks 9-12)
Launch preparation...

## Development Guidelines
Code organization, performance requirements, security...

## Quality Assurance
Testing strategy, deployment process...

Write the complete requirements.md file to /ai-generated/requirements.md using MCP.Filesystem tool. Make it at least 2000 words with comprehensive technical details.
`;

async function testDirect() {
  console.log('🧪 Testing with direct content prompt...');
  
  // Create prompt file
  const promptFile = path.join(PROJECT_DIR, '.direct-prompt.txt');
  fs.writeFileSync(promptFile, DIRECT_PROMPT);
  
  console.log('🚀 Running Claude...\n');
  
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
      
      // Show first 20 lines
      const lines = content.split('\n').slice(0, 20);
      console.log('\n📄 First 20 lines:');
      lines.forEach((line, i) => console.log(`${i+1}: ${line}`));
    }
  });
  
  // 2 minute timeout
  setTimeout(() => {
    if (!claude.killed) {
      console.log('\n⏰ Timeout after 2 minutes');
      claude.kill('SIGTERM');
    }
  }, 120000);
}

testDirect().catch(console.error);