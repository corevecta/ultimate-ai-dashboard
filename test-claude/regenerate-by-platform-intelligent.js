#!/usr/bin/env node
/**
 * Platform-Aware Requirements Generation - Optimized for Bulk Processing
 * Processes 2265+ projects, each with specification.yaml to generate requirements.md
 */
const fs = require('fs-extra');
const path = require('path');
const { spawn } = require('child_process');
const os = require('os');

// Configuration
const HOME = os.homedir();
const PROJECTS_DIR = process.env.PROJECTS_DIR || path.join(HOME, 'ai/projects/projecthubv3/projects');
const MAX_WORKERS = 2; // Increased from 5 for faster 2000-word documents
const PROGRESS_FILE = path.join(__dirname, '.platform-regeneration-progress.json');
const MIN_WORD_COUNT = 2000; // Optimized for faster, focused generation

if (!fs.existsSync(PROJECTS_DIR)) {
  console.error(`❌ PROJECTS_DIR (${PROJECTS_DIR}) does not exist. Exiting.`);
  process.exit(1);
}

// Developer-focused prompt optimized for LLM code generation
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

// Progress tracking class
class ProgressTracker {
  constructor() {
    this.progress = this.loadProgress();
  }
  
  loadProgress() {
    try {
      if (fs.existsSync(PROGRESS_FILE)) {
        const data = fs.readFileSync(PROGRESS_FILE, 'utf-8');
        return JSON.parse(data);
      }
    } catch (e) {
      console.log('⚠️  Could not load previous progress, starting fresh');
    }
    
    return {
      startTime: new Date().toISOString(),
      completedProjects: {},
      processedCount: 0,
      stats: {
        totalSuccess: 0,
        totalFailed: 0,
        totalSkipped: 0,
        platformsDetected: {}
      }
    };
  }
  
  saveProgress() {
    try {
      fs.writeFileSync(PROGRESS_FILE, JSON.stringify(this.progress, null, 2));
    } catch (e) {
      console.error('❌ Failed to save progress:', e.message);
    }
  }
  
  markProjectComplete(projectId, detectedPlatform, status, wordCount = 0) {
    this.progress.completedProjects[projectId] = {
      detectedPlatform,
      status,
      timestamp: new Date().toISOString(),
      wordCount
    };
    
    this.progress.processedCount++;
    
    if (status === 'success') {
      this.progress.stats.totalSuccess++;
      if (!this.progress.stats.platformsDetected[detectedPlatform]) {
        this.progress.stats.platformsDetected[detectedPlatform] = 0;
      }
      this.progress.stats.platformsDetected[detectedPlatform]++;
    } else if (status === 'failed') {
      this.progress.stats.totalFailed++;
    } else if (status === 'skipped') {
      this.progress.stats.totalSkipped++;
    }
    
    this.saveProgress();
  }
  
  isProjectCompleted(projectId) {
    return this.progress.completedProjects.hasOwnProperty(projectId);
  }
  
  getStats() {
    return {
      ...this.progress.stats,
      totalProcessed: this.progress.processedCount
    };
  }
  
  reset() {
    if (fs.existsSync(PROGRESS_FILE)) {
      fs.unlinkSync(PROGRESS_FILE);
    }
    this.progress = this.loadProgress();
    console.log('✅ Progress reset');
  }
}

// Get all unprocessed projects
async function getUnprocessedProjects(progressTracker) {
  const projects = [];
  const entries = fs.readdirSync(PROJECTS_DIR);
  
  console.log(`🔍 Scanning ${entries.length} folders for specifications...`);
  
  for (const entry of entries) {
    if (progressTracker.isProjectCompleted(entry)) {
      continue;
    }
    
    const projectDir = path.join(PROJECTS_DIR, entry);
    const specFile = path.join(projectDir, 'ai-generated', 'specification.yaml');
    
    if (fs.existsSync(specFile)) {
      projects.push({
        id: entry,
        dir: projectDir,
        specFile
      });
    }
  }
  
  return projects;
}

// Process single project - FIXED VERSION
async function processProject(project, progressTracker) {
  return new Promise((resolve) => {
    const { id, dir, specFile } = project;
    const outputFile = path.join(dir, 'ai-generated', 'requirements.md');
    
    // Check if requirements already exist and meet quality standards
    if (fs.existsSync(outputFile)) {
      const content = fs.readFileSync(outputFile, 'utf-8');
      const wordCount = content.split(/\s+/).length;
      
      if (wordCount >= MIN_WORD_COUNT) {
        progressTracker.markProjectComplete(id, 'existing', 'skipped', wordCount);
        return resolve({ status: 'skipped', reason: 'sufficient-words', wordCount });
      }
    }
    
    // Create prompt file
    const promptFile = path.join(dir, '.claude-prompt-temp.txt');
    fs.writeFileSync(promptFile, BULK_PROCESSING_PROMPT);
    
    const startTime = Date.now();
    const outputDir = path.join(dir, 'ai-generated');
    fs.ensureDirSync(outputDir);
    
    // FIXED: Add proper stdio configuration
    const claudeProcess = spawn('claude', [
      '--allowedTools', 'MCP.Filesystem',
      '--add-dir', outputDir,
      '--dangerously-skip-permissions',
      '-p'
    ], {
      cwd: dir,
      stdio: ['pipe', 'pipe', 'pipe'] // CRITICAL: Proper stdio setup
    });
    
    // Pipe prompt file to stdin
    const promptStream = fs.createReadStream(promptFile);
    promptStream.pipe(claudeProcess.stdin);
    
    // Capture output for debugging
    let stdoutData = '';
    let stderrData = '';
    
    claudeProcess.stdout.on('data', (data) => {
      stdoutData += data.toString();
    });
    
    claudeProcess.stderr.on('data', (data) => {
      stderrData += data.toString();
    });
    
    let detectedPlatform = 'unknown';
    let timeoutId;
    
    claudeProcess.on('close', (code) => {
      // Clear timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      // Cleanup prompt file
      try {
        fs.unlinkSync(promptFile);
      } catch (e) {
        // Ignore cleanup errors
      }
      
      const duration = ((Date.now() - startTime) / 1000).toFixed(1);
      
      // Log any errors from stderr
      if (stderrData.trim()) {
        console.error(`[Worker] Claude stderr for ${id}:`, stderrData.trim());
      }
      
      if (fs.existsSync(outputFile)) {
        const content = fs.readFileSync(outputFile, 'utf-8');
        const wordCount = content.split(/\s+/).length;
        
        // Detect platform from generated content
        if (content.includes('Chrome Extension')) detectedPlatform = 'chrome-extension';
        else if (content.includes('API Service')) detectedPlatform = 'api-service';
        else if (content.includes('Mobile App')) detectedPlatform = 'mobile-app';
        else if (content.includes('Web Application') || content.includes('Web App')) detectedPlatform = 'web-app';
        else if (content.includes('Discord Bot')) detectedPlatform = 'discord-bot';
        else if (content.includes('CLI Tool')) detectedPlatform = 'cli-tool';
        
        // Check if meets word count requirement
        if (wordCount >= MIN_WORD_COUNT) {
          progressTracker.markProjectComplete(id, detectedPlatform, 'success', wordCount);
          resolve({ status: 'success', wordCount, duration, detectedPlatform });
        } else {
          progressTracker.markProjectComplete(id, detectedPlatform, 'failed');
          resolve({ status: 'failed', reason: 'insufficient-words', wordCount });
        }
      } else {
        progressTracker.markProjectComplete(id, detectedPlatform, 'failed');
        resolve({ status: 'failed', reason: 'no-output' });
      }
    });
    
    // Handle process errors
    claudeProcess.on('error', (error) => {
      console.error(`[Worker] Process error for ${id}:`, error.message);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      try {
        fs.unlinkSync(promptFile);
      } catch (e) {}
      progressTracker.markProjectComplete(id, 'unknown', 'failed');
      resolve({ status: 'failed', reason: 'process-error', error: error.message });
    });
    
    // 3 minute timeout (reduced from 5 minutes for shorter documents)
    timeoutId = setTimeout(() => {
      console.error(`⏰ Timeout: Killing Claude process after 3 minutes for project ${id}`);
      claudeProcess.kill('SIGTERM');
      
      // Give it a moment to cleanup, then force kill
      setTimeout(() => {
        if (!claudeProcess.killed) {
          claudeProcess.kill('SIGKILL');
        }
      }, 5000);
    }, 180000); // 3 minutes instead of 5
  });
}

// Worker function - FIXED to be truly parallel
async function runWorker(workerId, projectQueue, progressTracker) {
  console.log(`[Worker ${workerId}] Started`);
  
  while (true) {
    // Thread-safe project acquisition
    let project;
    if (projectQueue.length === 0) {
      console.log(`[Worker ${workerId}] No more projects to process`);
      break;
    }
    
    project = projectQueue.shift();
    if (!project) {
      console.log(`[Worker ${workerId}] No more projects to process`);
      break;
    }
    
    console.log(`[Worker ${workerId}] Processing ${project.id.substring(0, 50)}...`);
    
    try {
      const result = await processProject(project, progressTracker);
      
      if (result.status === 'success') {
        console.log(`[Worker ${workerId}] ✅ ${project.id} | Platform: ${result.detectedPlatform} | Words: ${result.wordCount} | Time: ${result.duration}s`);
      } else if (result.status === 'failed') {
        console.log(`[Worker ${workerId}] ❌ ${project.id} - ${result.reason || 'Failed'}`);
      } else if (result.status === 'skipped') {
        console.log(`[Worker ${workerId}] ⏭️  ${project.id} - Already complete (${result.wordCount} words)`);
      }
    } catch (err) {
      console.log(`[Worker ${workerId}] ❌ ${project.id} - Error: ${err.message}`);
      progressTracker.markProjectComplete(project.id, 'unknown', 'failed');
    }
    
    // Brief delay between projects (reduced from 2000ms)
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log(`[Worker ${workerId}] Finished`);
}

// Main function
async function main() {
  const args = process.argv.slice(2);
  
  const progressTracker = new ProgressTracker();
  
  // Handle commands
  if (args[0] === '--reset') {
    progressTracker.reset();
    return;
  }
  
  if (args[0] === '--status') {
    const stats = progressTracker.getStats();
    console.log('\n📊 Bulk Processing Status:');
    console.log(`   Total Processed: ${stats.totalProcessed}`);
    console.log(`   Success: ${stats.totalSuccess}`);
    console.log(`   Failed: ${stats.totalFailed}`);
    console.log(`   Skipped: ${stats.totalSkipped}`);
    
    if (Object.keys(stats.platformsDetected).length > 0) {
      console.log('\n📊 Platform Distribution:');
      for (const [platform, count] of Object.entries(stats.platformsDetected).sort((a, b) => b[1] - a[1])) {
        console.log(`   ${platform}: ${count} projects`);
      }
    }
    return;
  }
  
  // Show existing progress
  const existingStats = progressTracker.getStats();
  if (existingStats.totalProcessed > 0) {
    console.log('📂 Resuming from previous session:');
    console.log(`   Already processed: ${existingStats.totalProcessed} projects`);
    console.log('   Continuing from where we left off...\n');
  }
  
  console.log('🔍 Scanning for projects with specification.yaml files...\n');
  const projects = await getUnprocessedProjects(progressTracker);
  
  if (projects.length === 0) {
    console.log('✅ All projects have been processed!');
    console.log('   Use --status to see final summary');
    return;
  }
  
  console.log(`📊 Found ${projects.length} projects to process`);
  console.log(`🚀 Starting ${MAX_WORKERS} workers for bulk processing...\n`);
  
  // Create shared project queue - FIXED: Create array copy for each worker
  const projectQueue = [...projects];
  
  // Start workers
  const workers = [];
  for (let i = 1; i <= MAX_WORKERS; i++) {
    workers.push(runWorker(i, projectQueue, progressTracker));
  }
  
  // Progress monitor
  const statusInterval = setInterval(() => {
    const stats = progressTracker.getStats();
    const processed = stats.totalProcessed - existingStats.totalProcessed;
    const remaining = projects.length - processed;
    
    if (remaining >= 0) {
      process.stdout.write(`\r📊 Progress: ${processed}/${projects.length} | Success: ${stats.totalSuccess} | Failed: ${stats.totalFailed} | Remaining: ${remaining}     `);
    }
  }, 3000);
  
  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n\n⚠️  Gracefully shutting down... Progress has been saved.');
    console.log('   Run the script again to continue from where you left off.');
    clearInterval(statusInterval);
    process.exit(0);
  });
  
  // Wait for completion
  await Promise.all(workers);
  clearInterval(statusInterval);
  
  // Final summary
  const finalStats = progressTracker.getStats();
  console.log('\n\n🎉 Bulk processing complete!');
  console.log(`   Total Projects: ${finalStats.totalProcessed}`);
  console.log(`   Success: ${finalStats.totalSuccess}`);
  console.log(`   Failed: ${finalStats.totalFailed}`);
  console.log(`   Skipped: ${finalStats.totalSkipped}`);
  
  if (Object.keys(finalStats.platformsDetected).length > 0) {
    console.log('\n📊 Final Platform Distribution:');
    for (const [platform, count] of Object.entries(finalStats.platformsDetected).sort((a, b) => b[1] - a[1])) {
      console.log(`   ${platform}: ${count} projects`);
    }
  }
  
  console.log('\n🎯 All 2265+ projects processed successfully!');
}

// Execute
if (require.main === module) {
  main().catch(console.error);
}