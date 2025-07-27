#!/usr/bin/env node

/**
 * Platform-Aware Requirements Generation with Specification Error Handling
 * Handles discrepancies, incorrect data, and mismatches in specifications
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const yaml = require('js-yaml');

const PROJECTS_DIR = '/home/sali/ai/projects/projecthubv3/projects';
const MAX_WORKERS = 5;
const PROGRESS_FILE = path.join(__dirname, '.platform-regeneration-progress.json');

// Enhanced platform-specific prompt templates with error handling
const PLATFORM_PROMPTS = {
  'chrome-extension': {
    category: 'Browser Extensions',
    prompt: `You are creating requirements for a Chrome Extension project.

CRITICAL SPECIFICATION HANDLING:
The specification YAML file may contain:
- Discrepancies between project name and actual functionality
- Incorrect or mismatching data
- Missing or incomplete sections
- Template placeholder content
- Structural errors or malformed data
- Features that don't align with the project type

YOUR TASK:
1. Analyze the specification critically
2. Identify and fix any inconsistencies or errors
3. Generate requirements that reflect what the project SHOULD be, not just what the spec says
4. Ensure all content is specific, accurate, and properly aligned with Chrome Extension best practices

IMPORTANT Chrome Extension Specific Requirements:
- Manifest V3 compliance
- Chrome Web Store policies
- Content Security Policy restrictions
- Permission model and user consent
- Background service workers (not persistent pages)
- Content scripts isolation
- Chrome APIs usage
- Extension popup/options pages
- Cross-origin restrictions
- 5MB size limit for CWS

Read the specification files and create comprehensive requirements that address:
1. Extension architecture (popup, content scripts, service worker)
2. Chrome API permissions needed (fix any incorrect permissions in spec)
3. User privacy and data handling
4. Chrome Web Store listing requirements
5. Update mechanism and versioning
6. Cross-browser compatibility considerations

REMEMBER: If the specification contains errors or doesn't make sense for a Chrome Extension, correct these issues in your requirements document. The final requirements should be accurate and implementable.`,
    minWords: 3500
  },

  'api-service': {
    category: 'API Services',
    prompt: `You are creating requirements for an API Service/Microservice project.

CRITICAL SPECIFICATION HANDLING:
The specification YAML file may contain:
- Discrepancies between project name and actual functionality
- Incorrect or mismatching data
- Missing or incomplete sections
- Template placeholder content
- Structural errors or malformed data
- Features that don't align with the project type

YOUR TASK:
1. Analyze the specification critically
2. Identify and fix any inconsistencies or errors
3. Generate requirements that reflect what the project SHOULD be, not just what the spec says
4. Ensure all content is specific, accurate, and properly aligned with API service best practices

IMPORTANT API Service Specific Requirements:
- RESTful design principles
- API versioning strategy
- Authentication & authorization (OAuth2/JWT)
- Rate limiting and throttling
- API documentation (OpenAPI/Swagger)
- Error handling standards
- Request/response formats
- Idempotency for critical operations
- CORS configuration
- Webhook implementation

Read the specification files and create comprehensive requirements that address:
1. API endpoint design and routing (correct any illogical endpoints)
2. Security implementation (fix any security vulnerabilities in spec)
3. Performance requirements (ensure realistic metrics)
4. Data validation and sanitization
5. API monitoring and analytics
6. SDK/client library requirements

REMEMBER: If the specification contains errors or doesn't make sense for an API Service, correct these issues in your requirements document. The final requirements should be accurate and implementable.`,
    minWords: 4000
  },

  'mobile-app': {
    category: 'Mobile Applications',
    prompt: `You are creating requirements for a Mobile Application project.

CRITICAL SPECIFICATION HANDLING:
The specification YAML file may contain:
- Discrepancies between project name and actual functionality
- Incorrect or mismatching data
- Missing or incomplete sections
- Template placeholder content
- Structural errors or malformed data
- Features that don't align with the project type

YOUR TASK:
1. Analyze the specification critically
2. Identify and fix any inconsistencies or errors
3. Generate requirements that reflect what the project SHOULD be, not just what the spec says
4. Ensure all content is specific, accurate, and properly aligned with mobile app best practices

IMPORTANT Mobile App Specific Requirements:
- iOS and Android platform differences
- App Store/Play Store guidelines
- Push notification implementation
- Offline functionality and sync
- Device permissions handling
- Deep linking and app indexing
- Biometric authentication
- In-app purchases
- App performance and battery usage
- Crash reporting and analytics

Read the specification files and create comprehensive requirements that address:
1. Platform-specific UI/UX guidelines (fix any desktop-only UI elements)
2. Native feature integration (ensure mobile-appropriate features)
3. App store submission requirements
4. Update and version management
5. Offline-first architecture
6. Cross-platform code sharing strategy

REMEMBER: If the specification contains errors or doesn't make sense for a Mobile App, correct these issues in your requirements document. The final requirements should be accurate and implementable.`,
    minWords: 4500
  },

  'web-app': {
    category: 'Web Applications',
    prompt: `You are creating requirements for a Web Application project.

CRITICAL SPECIFICATION HANDLING:
The specification YAML file may contain:
- Discrepancies between project name and actual functionality
- Incorrect or mismatching data
- Missing or incomplete sections
- Template placeholder content
- Structural errors or malformed data
- Features that don't align with the project type

YOUR TASK:
1. Analyze the specification critically
2. Identify and fix any inconsistencies or errors
3. Generate requirements that reflect what the project SHOULD be, not just what the spec says
4. Ensure all content is specific, accurate, and properly aligned with web app best practices

IMPORTANT Web App Specific Requirements:
- Responsive design for all devices
- Progressive Web App capabilities
- SEO optimization
- Browser compatibility matrix
- Performance budgets
- Accessibility (WCAG 2.1 AA)
- Security headers and CSP
- Cookie consent and privacy
- CDN and caching strategy
- Analytics and tracking

Read the specification files and create comprehensive requirements that address:
1. Frontend framework and architecture (ensure appropriate tech choices)
2. State management approach
3. API integration patterns
4. Authentication and session management
5. Performance optimization techniques
6. Deployment and hosting strategy

REMEMBER: If the specification contains errors or doesn't make sense for a Web App, correct these issues in your requirements document. The final requirements should be accurate and implementable.`,
    minWords: 3500
  },

  'discord-bot': {
    category: 'Chat Bots',
    prompt: `You are creating requirements for a Discord Bot project.

CRITICAL SPECIFICATION HANDLING:
The specification YAML file may contain:
- Discrepancies between project name and actual functionality
- Incorrect or mismatching data
- Missing or incomplete sections
- Template placeholder content
- Structural errors or malformed data
- Features that don't align with the project type

YOUR TASK:
1. Analyze the specification critically
2. Identify and fix any inconsistencies or errors
3. Generate requirements that reflect what the project SHOULD be, not just what the spec says
4. Ensure all content is specific, accurate, and properly aligned with Discord bot best practices

IMPORTANT Discord Bot Specific Requirements:
- Discord API rate limits
- Bot permissions and intents
- Slash commands implementation
- Event handling (messages, reactions, voice)
- Guild management features
- User/role permissions
- Embed formatting
- Voice channel support
- Sharding for scale
- Discord ToS compliance

Read the specification files and create comprehensive requirements that address:
1. Command structure and handling (ensure Discord-appropriate commands)
2. Database for per-guild settings
3. Moderation features
4. Interactive components (buttons, modals)
5. Error handling and logging
6. Bot hosting and uptime requirements

REMEMBER: If the specification contains errors or doesn't make sense for a Discord Bot, correct these issues in your requirements document. The final requirements should be accurate and implementable.`,
    minWords: 3000
  },

  'cli-tool': {
    category: 'CLI Tools',
    prompt: `You are creating requirements for a CLI Tool project.

CRITICAL SPECIFICATION HANDLING:
The specification YAML file may contain:
- Discrepancies between project name and actual functionality
- Incorrect or mismatching data
- Missing or incomplete sections
- Template placeholder content
- Structural errors or malformed data
- Features that don't align with the project type

YOUR TASK:
1. Analyze the specification critically
2. Identify and fix any inconsistencies or errors
3. Generate requirements that reflect what the project SHOULD be, not just what the spec says
4. Ensure all content is specific, accurate, and properly aligned with CLI tool best practices

IMPORTANT CLI Tool Specific Requirements:
- Cross-platform compatibility (Windows/Mac/Linux)
- Command structure and subcommands
- Argument parsing and validation
- Configuration file support
- Output formatting (JSON, table, etc)
- Error codes and exit status
- Shell completion support
- Piping and redirection
- Interactive prompts
- Update mechanism

Read the specification files and create comprehensive requirements that address:
1. Command syntax and options (ensure CLI-appropriate interface)
2. Installation methods (npm, brew, etc)
3. Configuration management
4. Plugin/extension system
5. Documentation and help system
6. Testing approach for CLIs

REMEMBER: If the specification contains errors or doesn't make sense for a CLI Tool, correct these issues in your requirements document. The final requirements should be accurate and implementable.`,
    minWords: 3000
  },

  'default': {
    category: 'General',
    prompt: `You are creating requirements for a software project.

CRITICAL SPECIFICATION HANDLING:
The specification YAML file may contain:
- Discrepancies between project name and actual functionality
- Incorrect or mismatching data
- Missing or incomplete sections
- Template placeholder content
- Structural errors or malformed data
- Features that don't align with the project type

YOUR TASK:
1. Analyze the specification critically
2. Identify and fix any inconsistencies or errors
3. Generate requirements that reflect what the project SHOULD be, not just what the spec says
4. Ensure all content is specific, accurate, and properly aligned with software best practices

Read the specification files and create comprehensive requirements that address all aspects of the project including functional requirements, technical architecture, security, testing, and deployment.

REMEMBER: If the specification contains errors, correct these issues in your requirements document. The final requirements should be accurate and implementable.`,
    minWords: 3000
  }
};

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
      completedPlatforms: [],
      stats: {
        totalSuccess: 0,
        totalFailed: 0,
        totalSkipped: 0
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
  
  markProjectComplete(projectId, platform, status, wordCount = 0) {
    this.progress.completedProjects[projectId] = {
      platform,
      status,
      timestamp: new Date().toISOString(),
      wordCount
    };
    
    if (status === 'success') this.progress.stats.totalSuccess++;
    else if (status === 'failed') this.progress.stats.totalFailed++;
    else if (status === 'skipped') this.progress.stats.totalSkipped++;
    
    this.saveProgress();
  }
  
  markPlatformComplete(platform) {
    if (!this.progress.completedPlatforms.includes(platform)) {
      this.progress.completedPlatforms.push(platform);
      this.saveProgress();
    }
  }
  
  isProjectCompleted(projectId) {
    return this.progress.completedProjects.hasOwnProperty(projectId);
  }
  
  isPlatformCompleted(platform) {
    return this.progress.completedPlatforms.includes(platform);
  }
  
  getStats() {
    return {
      ...this.progress.stats,
      totalProcessed: Object.keys(this.progress.completedProjects).length,
      completedPlatforms: this.progress.completedPlatforms.length
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

// Get all projects grouped by platform
async function getProjectsByPlatform(progressTracker) {
  const projectsByPlatform = {};
  const entries = fs.readdirSync(PROJECTS_DIR);
  
  for (const entry of entries) {
    const projectDir = path.join(PROJECTS_DIR, entry);
    const specFile = path.join(projectDir, 'ai-generated', 'specification.yaml');
    
    if (fs.existsSync(specFile)) {
      try {
        const spec = yaml.load(fs.readFileSync(specFile, 'utf-8'));
        const platform = spec.project?.type || 'unknown';
        
        // Skip if already processed
        if (progressTracker.isProjectCompleted(entry)) {
          continue;
        }
        
        if (!projectsByPlatform[platform]) {
          projectsByPlatform[platform] = [];
        }
        
        projectsByPlatform[platform].push({
          id: entry,
          dir: projectDir,
          specFile,
          platform
        });
      } catch (e) {
        console.error(`Error reading spec for ${entry}:`, e.message);
      }
    }
  }
  
  // Remove completed platforms
  for (const platform of progressTracker.progress.completedPlatforms) {
    delete projectsByPlatform[platform];
  }
  
  return projectsByPlatform;
}

// Process single project
async function processProject(project, platformConfig, progressTracker) {
  // Double-check if already processed
  if (progressTracker.isProjectCompleted(project.id)) {
    return { status: 'skipped', reason: 'already-processed' };
  }
  
  return new Promise((resolve) => {
    const { id, dir } = project;
    const outputFile = path.join(dir, 'ai-generated', 'requirements.md');
    
    // Check if requirements already exist and meet quality standards
    if (fs.existsSync(outputFile)) {
      const content = fs.readFileSync(outputFile, 'utf-8');
      const wordCount = content.split(/\s+/).length;
      
      if (wordCount >= platformConfig.minWords) {
        progressTracker.markProjectComplete(id, project.platform, 'skipped', wordCount);
        return resolve({ status: 'skipped', reason: 'quality-met', wordCount });
      }
    }
    
    // Build the enhanced prompt
    const prompt = `${platformConfig.prompt}

Please complete the following:

1. Use the Read tool to read: ${path.join(dir, 'ai-generated', 'specification.yaml')}
2. Also read if exists: ${path.join(dir, 'ai-generated', 'market-enhanced-spec.yaml')}
3. Analyze the specifications critically for errors, inconsistencies, or mismatches
4. Create a comprehensive requirements document (minimum ${platformConfig.minWords} words)
5. Fix any issues from the specification in your requirements output
6. Use Write tool to save to: ${outputFile}

The document MUST include all standard sections plus platform-specific requirements mentioned above.
Focus heavily on ${project.platform} specific considerations.
Ensure all content is accurate, specific, and implementable.

Start by reading the specification files.`;

    const startTime = Date.now();
    
    const claude = spawn('claude', [
      '--allowedTools', 'Read,Write',
      '--add-dir', dir,
      '--dangerously-skip-permissions'
    ], {
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    claude.stdin.write(prompt);
    claude.stdin.end();
    
    let output = '';
    claude.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    claude.on('close', (code) => {
      const duration = ((Date.now() - startTime) / 1000).toFixed(1);
      
      if (fs.existsSync(outputFile)) {
        const content = fs.readFileSync(outputFile, 'utf-8');
        const wordCount = content.split(/\s+/).length;
        progressTracker.markProjectComplete(id, project.platform, 'success', wordCount);
        resolve({ status: 'success', wordCount, duration });
      } else {
        progressTracker.markProjectComplete(id, project.platform, 'failed');
        resolve({ status: 'failed' });
      }
    });
    
    // Timeout
    setTimeout(() => {
      claude.kill('SIGTERM');
    }, 180000); // 3 minutes
  });
}

// Worker function to process an entire platform
async function processPlatform(workerId, platform, projects, config, progressTracker) {
  console.log(`\n[Worker ${workerId}] Starting ${platform} (${projects.length} projects)`);
  
  const results = {
    success: 0,
    failed: 0,
    skipped: 0
  };
  
  for (let i = 0; i < projects.length; i++) {
    const project = projects[i];
    process.stdout.write(`\r[Worker ${workerId}] ${platform}: ${i+1}/${projects.length} - Processing ${project.id.substring(0, 30)}...     `);
    
    try {
      const result = await processProject(project, config, progressTracker);
      
      if (result.status === 'success') {
        results.success++;
        console.log(`\n[Worker ${workerId}] ✅ ${project.id} - Success (${result.wordCount} words, ${result.duration}s)`);
      } else if (result.status === 'failed') {
        results.failed++;
        console.log(`\n[Worker ${workerId}] ❌ ${project.id} - Failed`);
      } else if (result.status === 'skipped') {
        results.skipped++;
        // Don't log skipped to reduce noise
      }
    } catch (err) {
      results.failed++;
      progressTracker.markProjectComplete(project.id, project.platform, 'failed');
      console.log(`\n[Worker ${workerId}] ❌ ${project.id} - Error: ${err.message}`);
    }
    
    // Small delay between projects
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  // Mark platform as complete
  progressTracker.markPlatformComplete(platform);
  
  console.log(`\n[Worker ${workerId}] ✨ Completed ${platform}:`);
  console.log(`[Worker ${workerId}]    Success: ${results.success}, Failed: ${results.failed}, Skipped: ${results.skipped}`);
  
  return results;
}

// Platform queue manager
class PlatformQueue {
  constructor(platforms) {
    this.queue = [...platforms];
    this.completed = [];
    this.inProgress = new Map();
  }
  
  getNext(workerId) {
    if (this.queue.length === 0) return null;
    
    const platform = this.queue.shift();
    this.inProgress.set(workerId, platform);
    return platform;
  }
  
  complete(workerId, platform) {
    this.inProgress.delete(workerId);
    this.completed.push(platform);
  }
  
  getStatus() {
    return {
      remaining: this.queue.length,
      inProgress: this.inProgress.size,
      completed: this.completed.length
    };
  }
}

// Worker process
async function runWorker(workerId, platformQueue, projectsByPlatform, progressTracker) {
  console.log(`[Worker ${workerId}] Started`);
  
  while (true) {
    const platformData = platformQueue.getNext(workerId);
    if (!platformData) {
      console.log(`[Worker ${workerId}] No more platforms to process`);
      break;
    }
    
    const [platform, projects] = platformData;
    const config = PLATFORM_PROMPTS[platform] || PLATFORM_PROMPTS.default;
    
    await processPlatform(workerId, platform, projects, config, progressTracker);
    platformQueue.complete(workerId, platform);
  }
  
  console.log(`[Worker ${workerId}] Finished`);
}

// Main
async function main() {
  const args = process.argv.slice(2);
  
  // Initialize progress tracker
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
    console.log(`   Completed Platforms: ${stats.completedPlatforms}`);
    console.log(`   Progress file: ${PROGRESS_FILE}`);
    return;
  }
  
  // Check for existing progress
  const existingStats = progressTracker.getStats();
  if (existingStats.totalProcessed > 0) {
    console.log('📂 Found existing progress:');
    console.log(`   Already processed: ${existingStats.totalProcessed} projects`);
    console.log(`   Completed platforms: ${existingStats.completedPlatforms}`);
    console.log('   Continuing from where we left off...\n');
  }
  
  console.log('🔍 Analyzing remaining projects by platform...\n');
  const projectsByPlatform = await getProjectsByPlatform(progressTracker);
  
  // Show summary
  console.log('📊 Remaining Project Distribution:');
  const platforms = Object.entries(projectsByPlatform);
  let totalProjects = 0;
  
  if (platforms.length === 0) {
    console.log('   ✅ All platforms have been processed!');
    console.log(`   Use --status to see summary or --reset to start over`);
    return;
  }
  
  for (const [platform, projects] of platforms) {
    console.log(`   ${platform}: ${projects.length} projects`);
    totalProjects += projects.length;
  }
  console.log(`\n   Total remaining: ${totalProjects} projects across ${platforms.length} platforms`);
  console.log(`\n🔧 Starting ${MAX_WORKERS} workers to process platforms...\n`);
  
  // Create platform queue
  const platformQueue = new PlatformQueue(platforms);
  
  // Start workers
  const workers = [];
  for (let i = 1; i <= MAX_WORKERS; i++) {
    workers.push(runWorker(i, platformQueue, projectsByPlatform, progressTracker));
  }
  
  // Status monitor
  const statusInterval = setInterval(() => {
    const status = platformQueue.getStatus();
    const stats = progressTracker.getStats();
    if (status.remaining > 0 || status.inProgress > 0) {
      process.stdout.write(`\r📊 Platforms: ${status.completed} completed | ${status.inProgress} in progress | ${status.remaining} remaining | Total: ${stats.totalProcessed} projects     `);
    }
  }, 2000);
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n\n⚠️  Gracefully shutting down... Progress has been saved.');
    console.log('   Run again to continue from where you left off.');
    process.exit(0);
  });
  
  // Wait for all workers to complete
  await Promise.all(workers);
  
  clearInterval(statusInterval);
  
  // Final summary
  const finalStats = progressTracker.getStats();
  console.log('\n\n✅ All platforms processed!');
  console.log(`   Total Projects: ${finalStats.totalProcessed}`);
  console.log(`   Success: ${finalStats.totalSuccess}`);
  console.log(`   Failed: ${finalStats.totalFailed}`);
  console.log(`   Skipped: ${finalStats.totalSkipped}`);
}

// Run
if (require.main === module) {
  main().catch(console.error);
}