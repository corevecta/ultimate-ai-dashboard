#!/usr/bin/env node

/**
 * Platform-Aware Batch Requirements Regeneration with Platform-Level Workers
 * Each worker processes all projects in a platform before moving to the next
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const yaml = require('js-yaml');

const PROJECTS_DIR = '/home/sali/ai/projects/projecthubv3/projects';
const MAX_WORKERS = 5;

// Platform-specific prompt templates (same as before)
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

// Process single project
async function processProject(project, platformConfig) {
  return new Promise((resolve) => {
    const { id, dir } = project;
    const outputFile = path.join(dir, 'ai-generated', 'requirements.md');
    
    // Check if requirements already exist and meet quality standards
    if (fs.existsSync(outputFile)) {
      const content = fs.readFileSync(outputFile, 'utf-8');
      const wordCount = content.split(/\s+/).length;
      
      if (wordCount >= platformConfig.minWords) {
        return resolve({ status: 'skipped', reason: 'quality-met', wordCount });
      }
    }
    
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
        resolve({ status: 'success', wordCount, duration });
      } else {
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
async function processPlatform(workerId, platform, projects, config) {
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
      const result = await processProject(project, config);
      
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
      console.log(`\n[Worker ${workerId}] ❌ ${project.id} - Error: ${err.message}`);
    }
    
    // Small delay between projects
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
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
async function runWorker(workerId, platformQueue, projectsByPlatform) {
  console.log(`[Worker ${workerId}] Started`);
  
  while (true) {
    const platformData = platformQueue.getNext(workerId);
    if (!platformData) {
      console.log(`[Worker ${workerId}] No more platforms to process`);
      break;
    }
    
    const [platform, projects] = platformData;
    const config = PLATFORM_PROMPTS[platform] || PLATFORM_PROMPTS.default;
    
    await processPlatform(workerId, platform, projects, config);
    platformQueue.complete(workerId, platform);
  }
  
  console.log(`[Worker ${workerId}] Finished`);
}

// Main
async function main() {
  console.log('🔍 Analyzing projects by platform...\n');
  const projectsByPlatform = await getProjectsByPlatform();
  
  // Show summary
  console.log('📊 Project Distribution:');
  const platforms = Object.entries(projectsByPlatform);
  let totalProjects = 0;
  
  for (const [platform, projects] of platforms) {
    console.log(`   ${platform}: ${projects.length} projects`);
    totalProjects += projects.length;
  }
  console.log(`\n   Total: ${totalProjects} projects across ${platforms.length} platforms`);
  console.log(`\n🔧 Starting ${MAX_WORKERS} workers to process platforms...\n`);
  
  // Create platform queue
  const platformQueue = new PlatformQueue(platforms);
  
  // Start workers
  const workers = [];
  for (let i = 1; i <= MAX_WORKERS; i++) {
    workers.push(runWorker(i, platformQueue, projectsByPlatform));
  }
  
  // Status monitor
  const statusInterval = setInterval(() => {
    const status = platformQueue.getStatus();
    if (status.remaining > 0 || status.inProgress > 0) {
      process.stdout.write(`\r📊 Platforms: ${status.completed} completed | ${status.inProgress} in progress | ${status.remaining} remaining     `);
    }
  }, 2000);
  
  // Wait for all workers to complete
  await Promise.all(workers);
  
  clearInterval(statusInterval);
  console.log('\n\n✅ All platforms processed!');
}

// Run
if (require.main === module) {
  main().catch(console.error);
}