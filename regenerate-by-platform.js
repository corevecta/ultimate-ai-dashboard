#!/usr/bin/env node

/**
 * Platform-Aware Batch Requirements Regeneration
 * Processes projects by platform type with specialized prompts
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const yaml = require('js-yaml');

const PROJECTS_DIR = '/home/sali/ai/projects/projecthubv3/projects';

// Platform-specific prompt templates
const PLATFORM_PROMPTS = {
  'chrome-extension': {
    category: 'Browser Extensions',
    prompt: `You are creating requirements for a Chrome Extension project.

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
2. Chrome API permissions needed
3. User privacy and data handling
4. Chrome Web Store listing requirements
5. Update mechanism and versioning
6. Cross-browser compatibility considerations`,
    minWords: 3500
  },

  'api-service': {
    category: 'API Services',
    prompt: `You are creating requirements for an API Service/Microservice project.

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
1. API endpoint design and routing
2. Security implementation (API keys, OAuth, JWT)
3. Performance requirements (response times, throughput)
4. Data validation and sanitization
5. API monitoring and analytics
6. SDK/client library requirements`,
    minWords: 4000
  },

  'mobile-app': {
    category: 'Mobile Applications',
    prompt: `You are creating requirements for a Mobile Application project.

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
1. Platform-specific UI/UX guidelines (Material Design/Human Interface)
2. Native feature integration (camera, GPS, contacts)
3. App store submission requirements
4. Update and version management
5. Offline-first architecture
6. Cross-platform code sharing strategy`,
    minWords: 4500
  },

  'web-app': {
    category: 'Web Applications',
    prompt: `You are creating requirements for a Web Application project.

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
1. Frontend framework and architecture
2. State management approach
3. API integration patterns
4. Authentication and session management
5. Performance optimization techniques
6. Deployment and hosting strategy`,
    minWords: 3500
  },

  'discord-bot': {
    category: 'Chat Bots',
    prompt: `You are creating requirements for a Discord Bot project.

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
1. Command structure and handling
2. Database for per-guild settings
3. Moderation features
4. Interactive components (buttons, modals)
5. Error handling and logging
6. Bot hosting and uptime requirements`,
    minWords: 3000
  },

  'cli-tool': {
    category: 'CLI Tools',
    prompt: `You are creating requirements for a CLI Tool project.

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
1. Command syntax and options
2. Installation methods (npm, brew, etc)
3. Configuration management
4. Plugin/extension system
5. Documentation and help system
6. Testing approach for CLIs`,
    minWords: 3000
  },

  'default': {
    category: 'General',
    prompt: `You are creating requirements for a software project.

Read the specification files and create comprehensive requirements that address all aspects of the project including functional requirements, technical architecture, security, testing, and deployment.`,
    minWords: 3000
  }
};

// Get all projects grouped by platform
async function getProjectsByPlatform() {
  const projectsByPlatform = {};
  const entries = fs.readdirSync(PROJECTS_DIR);
  
  for (const entry of entries) {
    const projectDir = path.join(PROJECTS_DIR, entry);
    const specFile = path.join(projectDir, 'ai-generated', 'specification.yaml');
    
    if (fs.existsSync(specFile)) {
      try {
        const spec = yaml.load(fs.readFileSync(specFile, 'utf-8'));
        const platform = spec.project?.type || 'unknown';
        
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
  
  return projectsByPlatform;
}

// Process single project with platform-specific prompt
async function processProjectWithPlatformPrompt(project, platformConfig) {
  return new Promise((resolve) => {
    const { id, dir } = project;
    const outputFile = path.join(dir, 'ai-generated', 'requirements.md');
    
    // Check if requirements already exist and meet quality standards
    if (fs.existsSync(outputFile)) {
      const content = fs.readFileSync(outputFile, 'utf-8');
      const wordCount = content.split(/\s+/).length;
      
      if (wordCount >= platformConfig.minWords) {
        console.log(`✓ ${id} - Already has quality requirements (${wordCount} words)`);
        return resolve({ status: 'skipped', reason: 'quality-met' });
      }
    }
    
    console.log(`🚀 Processing ${id} (${project.platform})...`);
    
    // Build the prompt
    const prompt = `${platformConfig.prompt}

Please complete the following:

1. Use the Read tool to read: ${path.join(dir, 'ai-generated', 'specification.yaml')}
2. Also read if exists: ${path.join(dir, 'ai-generated', 'market-enhanced-spec.yaml')}
3. Create a comprehensive requirements document (minimum ${platformConfig.minWords} words)
4. Use Write tool to save to: ${outputFile}

The document MUST include all standard sections plus platform-specific requirements mentioned above.
Focus heavily on ${project.platform} specific considerations.

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
        console.log(`✅ ${id} - Generated (${wordCount} words, ${duration}s)`);
        resolve({ status: 'success', wordCount, duration });
      } else {
        console.log(`❌ ${id} - Failed`);
        resolve({ status: 'failed' });
      }
    });
    
    // Timeout
    setTimeout(() => {
      claude.kill('SIGTERM');
    }, 180000); // 3 minutes
  });
}

// Worker pool management
class WorkerPool {
  constructor(maxWorkers = 5) {
    this.maxWorkers = maxWorkers;
    this.activeWorkers = new Map(); // workerId -> current job
    this.jobQueue = [];
    this.results = {
      success: 0,
      failed: 0,
      skipped: 0
    };
  }

  async addJob(project, platformConfig) {
    return new Promise((resolve) => {
      this.jobQueue.push({ project, platformConfig, resolve });
      this.processNext();
    });
  }

  async processNext() {
    // Check if we have available workers and pending jobs
    if (this.activeWorkers.size >= this.maxWorkers || this.jobQueue.length === 0) {
      return;
    }

    // Get next job
    const job = this.jobQueue.shift();
    const workerId = `worker-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Mark worker as active
    this.activeWorkers.set(workerId, job);
    
    // Process the job asynchronously (don't await)
    processProjectWithPlatformPrompt(job.project, job.platformConfig).then(result => {
      // Update results
      if (result.status === 'success') this.results.success++;
      else if (result.status === 'failed') this.results.failed++;
      else if (result.status === 'skipped') this.results.skipped++;
      
      // Remove worker and resolve
      this.activeWorkers.delete(workerId);
      job.resolve(result);
      
      // Process next job if available
      this.processNext();
    }).catch(err => {
      console.error(`\nWorker error:`, err);
      this.results.failed++;
      this.activeWorkers.delete(workerId);
      job.resolve({ status: 'failed' });
      this.processNext();
    });
    
    // Try to start more workers if available
    if (this.activeWorkers.size < this.maxWorkers && this.jobQueue.length > 0) {
      this.processNext();
    }
  }

  getStatus() {
    return {
      activeWorkers: this.activeWorkers.size,
      queueLength: this.jobQueue.length,
      results: this.results
    };
  }
}

// Process platform batch with worker pool
async function processPlatformBatch(platform, projects, config, workerPool) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📦 Processing ${platform} projects (${projects.length} total)`);
  console.log(`   Category: ${config.category}`);
  console.log(`   Min Words: ${config.minWords}`);
  console.log(`${'='.repeat(60)}\n`);
  
  const batchResults = {
    success: 0,
    failed: 0,
    skipped: 0
  };
  
  // Add all projects to worker pool
  const promises = projects.map(project => 
    workerPool.addJob(project, config).then(result => {
      if (result.status === 'success') batchResults.success++;
      else if (result.status === 'failed') batchResults.failed++;
      else if (result.status === 'skipped') batchResults.skipped++;
    })
  );
  
  // Wait for all projects in this platform to complete
  await Promise.all(promises);
  
  console.log(`\n✨ ${platform} Complete:`);
  console.log(`   Success: ${batchResults.success}`);
  console.log(`   Failed: ${batchResults.failed}`);
  console.log(`   Skipped: ${batchResults.skipped}`);
  
  return batchResults;
}

// Main
async function main() {
  const platform = process.argv[2];
  const maxWorkers = parseInt(process.argv[3]) || 5;
  
  console.log('🔍 Analyzing projects by platform...\n');
  const projectsByPlatform = await getProjectsByPlatform();
  
  // Show summary
  console.log('📊 Project Distribution:');
  let totalProjects = 0;
  for (const [plat, projects] of Object.entries(projectsByPlatform)) {
    console.log(`   ${plat}: ${projects.length} projects`);
    totalProjects += projects.length;
  }
  console.log(`\n   Total: ${totalProjects} projects`);
  
  // Create worker pool
  const workerPool = new WorkerPool(maxWorkers);
  console.log(`\n🔧 Worker Pool: ${maxWorkers} concurrent workers`);
  
  // Create status monitor
  const statusInterval = setInterval(() => {
    const status = workerPool.getStatus();
    if (status.activeWorkers > 0 || status.queueLength > 0) {
      process.stdout.write(`\r⚙️  Active Workers: ${status.activeWorkers}/${maxWorkers} | Queue: ${status.queueLength} | ✅ ${status.results.success} | ❌ ${status.results.failed} | ⏭️  ${status.results.skipped}     `);
    }
  }, 1000);
  
  // Process specific platform or all
  if (platform) {
    // Process single platform
    if (!projectsByPlatform[platform]) {
      console.error(`\n❌ No projects found for platform: ${platform}`);
      process.exit(1);
    }
    
    const config = PLATFORM_PROMPTS[platform] || PLATFORM_PROMPTS.default;
    await processPlatformBatch(platform, projectsByPlatform[platform], config, workerPool);
  } else {
    // Process all platforms
    console.log('\n🚀 Processing all platforms with worker pool...\n');
    
    // Process all platforms concurrently through the worker pool
    const allPromises = [];
    
    for (const [plat, projects] of Object.entries(projectsByPlatform)) {
      const config = PLATFORM_PROMPTS[plat] || PLATFORM_PROMPTS.default;
      
      // Add all projects from all platforms to the worker pool
      for (const project of projects) {
        allPromises.push(
          workerPool.addJob(project, config).catch(err => {
            console.error(`\nError processing ${project.id}:`, err.message);
            return { status: 'failed' };
          })
        );
      }
    }
    
    // Wait for all jobs to complete
    await Promise.all(allPromises);
  }
  
  // Clear status monitor
  clearInterval(statusInterval);
  
  // Final results
  const finalStatus = workerPool.getStatus();
  console.log('\n\n✅ Platform-aware regeneration complete!');
  console.log(`   Total Processed: ${finalStatus.results.success + finalStatus.results.failed + finalStatus.results.skipped}`);
  console.log(`   Success: ${finalStatus.results.success}`);
  console.log(`   Failed: ${finalStatus.results.failed}`);
  console.log(`   Skipped: ${finalStatus.results.skipped}`);
}

// Run
if (require.main === module) {
  main().catch(console.error);
}