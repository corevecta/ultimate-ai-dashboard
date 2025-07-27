#!/usr/bin/env node
/**
 * Platform-Aware Requirements Generation - Fixed Version with YAML Embedding
 * Processes 2265+ projects with embedded YAML content in prompts
 */
const fs = require('fs-extra');
const path = require('path');
const yaml = require('yaml');
const { spawn } = require('child_process');
const os = require('os');

// Configuration
const HOME = os.homedir();
const PROJECTS_DIR = process.env.PROJECTS_DIR || path.join(HOME, 'ai/projects/projecthubv3/projects');
const MAX_WORKERS = 5;
const PROGRESS_FILE = path.join(__dirname, '.platform-regeneration-progress.json');
const MIN_WORD_COUNT = 2000;

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

// Create prompt with embedded YAML
function createPromptWithYAML(specContent, projectId) {
  return `
You are a senior software architect creating technical specifications.

**Task:** Generate a comprehensive requirements.md file (minimum 2000 words) for project: ${projectId}

## PROJECT SPECIFICATION:
\`\`\`yaml
${specContent}
\`\`\`

Based on the specification above, create a developer-focused requirements document with these sections:

# Technical Specifications

## Project Overview
- **Purpose**: What this software does (from the specification)
- **Platform**: Determine from project ID pattern (cvp-[platform]-[name])
- **Target Users**: From market.targetMarket and features
- **Core Value**: Main problem solved

## Feature Specifications
List 8-12 features with implementation details based on the specification:

### Feature: [Name]
- **Description**: What it does and why
- **User Flow**: Step-by-step interaction
- **API Endpoints**: GET/POST/PUT/DELETE paths
- **Data Models**: Database tables/fields
- **UI Components**: Interface elements
- **Dependencies**: Requirements

## Technical Architecture

### Technology Stack
Extract from technical section of spec or use modern defaults:
- **Frontend**: Framework, libraries, tools
- **Backend**: Languages, frameworks, databases
- **APIs**: Third-party integrations
- **Infrastructure**: Cloud providers, CDN

### Data Models
- **Database Schema**: Tables, relationships
- **API Structures**: Request/response formats
- **File Storage**: Media storage needs
- **Caching**: Performance optimization

### API Design
- **Endpoints**: All required routes
- **Authentication**: Security methods
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
- Concurrent users: Based on market.analysis.som
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

Output the complete requirements.md file to /ai-generated/requirements.md using MCP.Filesystem tool.
Minimum 2000 words, developer-focused, with specific implementation details.
`;
}

// Process single project
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
    
    // Read specification
    let specContent;
    try {
      specContent = fs.readFileSync(specFile, 'utf-8');
    } catch (err) {
      console.error(`❌ Failed to read spec for ${id}:`, err.message);
      progressTracker.markProjectComplete(id, 'unknown', 'failed');
      return resolve({ status: 'failed', reason: 'spec-read-error' });
    }
    
    // Create prompt with embedded YAML
    const prompt = createPromptWithYAML(specContent, id);
    
    // Write prompt to file
    const promptFile = path.join(dir, '.claude-prompt-temp.txt');
    fs.writeFileSync(promptFile, prompt);
    
    const startTime = Date.now();
    const outputDir = path.join(dir, 'ai-generated');
    fs.ensureDirSync(outputDir);
    
    // Spawn Claude process
    const claudeProcess = spawn('claude', [
      '--allowedTools', 'MCP.Filesystem',
      '--add-dir', outputDir,
      '--dangerously-skip-permissions',
      '-p'
    ], {
      cwd: dir,
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    // Pipe prompt
    const promptStream = fs.createReadStream(promptFile);
    promptStream.pipe(claudeProcess.stdin);
    
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
      if (timeoutId) clearTimeout(timeoutId);
      
      // Cleanup
      try {
        fs.unlinkSync(promptFile);
      } catch (e) {}
      
      const duration = ((Date.now() - startTime) / 1000).toFixed(1);
      
      if (stderrData.trim()) {
        console.error(`[Worker] Claude stderr for ${id}:`, stderrData.trim());
      }
      
      if (fs.existsSync(outputFile)) {
        const content = fs.readFileSync(outputFile, 'utf-8');
        const wordCount = content.split(/\s+/).length;
        
        // Detect platform
        if (id.includes('chrome-extension') || content.includes('Chrome Extension')) detectedPlatform = 'chrome-extension';
        else if (id.includes('api-service') || content.includes('API Service')) detectedPlatform = 'api-service';
        else if (id.includes('mobile-app') || content.includes('Mobile App')) detectedPlatform = 'mobile-app';
        else if (id.includes('web-app') || content.includes('Web Application')) detectedPlatform = 'web-app';
        else if (id.includes('discord-bot') || content.includes('Discord Bot')) detectedPlatform = 'discord-bot';
        else if (id.includes('cli-tool') || content.includes('CLI Tool')) detectedPlatform = 'cli-tool';
        
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
    
    claudeProcess.on('error', (error) => {
      console.error(`[Worker] Process error for ${id}:`, error.message);
      if (timeoutId) clearTimeout(timeoutId);
      try {
        fs.unlinkSync(promptFile);
      } catch (e) {}
      progressTracker.markProjectComplete(id, 'unknown', 'failed');
      resolve({ status: 'failed', reason: 'process-error', error: error.message });
    });
    
    // 3 minute timeout
    timeoutId = setTimeout(() => {
      console.error(`⏰ Timeout for ${id} after 3 minutes`);
      claudeProcess.kill('SIGTERM');
      setTimeout(() => {
        if (!claudeProcess.killed) {
          claudeProcess.kill('SIGKILL');
        }
      }, 5000);
    }, 180000);
  });
}

// Worker function
async function runWorker(workerId, projectQueue, progressTracker) {
  console.log(`[Worker ${workerId}] Started`);
  
  while (true) {
    const project = projectQueue.shift();
    if (!project) {
      console.log(`[Worker ${workerId}] No more projects to process`);
      break;
    }
    
    console.log(`[Worker ${workerId}] Processing ${project.id}...`);
    
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
    
    // Brief delay between projects
    await new Promise(resolve => setTimeout(resolve, 1000));
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
    console.log('\n📊 Progress Status:');
    console.log(`   Total Processed: ${stats.totalProcessed}`);
    console.log(`   Success: ${stats.totalSuccess}`);
    console.log(`   Failed: ${stats.totalFailed}`);
    console.log(`   Skipped: ${stats.totalSkipped}`);
    
    if (Object.keys(stats.platformsDetected).length > 0) {
      console.log('\n📊 Detected Platforms:');
      for (const [platform, count] of Object.entries(stats.platformsDetected)) {
        console.log(`   ${platform}: ${count} projects`);
      }
    }
    return;
  }
  
  // Check existing progress
  const existingStats = progressTracker.getStats();
  if (existingStats.totalProcessed > 0) {
    console.log('📂 Found existing progress:');
    console.log(`   Already processed: ${existingStats.totalProcessed} projects`);
    console.log('   Continuing from where we left off...\n');
  }
  
  console.log('🔍 Analyzing remaining projects...\n');
  const projects = await getUnprocessedProjects(progressTracker);
  
  if (projects.length === 0) {
    console.log('✅ All projects have been processed!');
    console.log('   Use --status to see summary or --reset to start over');
    return;
  }
  
  console.log(`📊 Found ${projects.length} projects to process`);
  console.log(`🚀 Starting ${MAX_WORKERS} workers...\n`);
  
  // Start workers
  const workers = [];
  for (let i = 1; i <= MAX_WORKERS; i++) {
    workers.push(runWorker(i, projects, progressTracker));
  }
  
  // Status monitor
  const statusInterval = setInterval(() => {
    const stats = progressTracker.getStats();
    const remaining = projects.length - (stats.totalProcessed - existingStats.totalProcessed);
    if (remaining > 0) {
      process.stdout.write(`\r📊 Progress: ${stats.totalProcessed - existingStats.totalProcessed}/${projects.length} | Success: ${stats.totalSuccess} | Failed: ${stats.totalFailed} | Remaining: ${remaining}     `);
    }
  }, 2000);
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n\n⚠️  Gracefully shutting down... Progress has been saved.');
    console.log('   Run again to continue from where you left off.');
    clearInterval(statusInterval);
    process.exit(0);
  });
  
  // Wait for all workers
  await Promise.all(workers);
  clearInterval(statusInterval);
  
  // Final summary
  const finalStats = progressTracker.getStats();
  console.log('\n\n✅ All projects processed!');
  console.log(`   Total Projects: ${finalStats.totalProcessed}`);
  console.log(`   Success: ${finalStats.totalSuccess}`);
  console.log(`   Failed: ${finalStats.totalFailed}`);
  console.log(`   Skipped: ${finalStats.totalSkipped}`);
  
  if (Object.keys(finalStats.platformsDetected).length > 0) {
    console.log('\n📊 Platform Detection Summary:');
    for (const [platform, count] of Object.entries(finalStats.platformsDetected).sort((a, b) => b[1] - a[1])) {
      console.log(`   ${platform}: ${count} projects`);
    }
  }
}

// Run
if (require.main === module) {
  main().catch(console.error);
}