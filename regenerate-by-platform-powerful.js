#!/usr/bin/env node

/**
 * Platform-Aware Requirements Generation - Powerful Prompt Version
 * Leverages Claude's ability to understand the full specification
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const yaml = require('js-yaml');

const PROJECTS_DIR = '/home/sali/ai/projects/projecthubv3/projects';
const MAX_WORKERS = 5;
const PROGRESS_FILE = path.join(__dirname, '.platform-regeneration-progress.json');

// Powerful platform-specific prompts that leverage Claude's understanding
const PLATFORM_PROMPTS = {
  'chrome-extension': {
    category: 'Browser Extensions',
    prompt: `Create comprehensive requirements for this Chrome Extension project.

CRITICAL: The specification YAML may contain errors, placeholders, or mismatches. Analyze it critically and fix ALL issues.

FIRST, VERIFY THE PLATFORM TYPE:
- Check if the project ID starts with 'cvp-chrome-extension-'
- Verify the specification's project.type matches 'chrome-extension'
- If there's a mismatch, THIS IS A CHROME EXTENSION - treat it as such regardless of what the spec says

Generate a PRACTICAL, FEATURE-RICH requirements document that:

1. **Covers EVERY section from the specification** including:
   - Project details, vision, and unique value proposition
   - Complete market analysis (TAM/SAM/SOM) with real numbers
   - ALL features (core, advanced, premium, enterprise) - expand empty arrays with real features
   - Full technical architecture and infrastructure details
   - Complete monetization strategy with specific pricing and projections
   - Development phases and timelines
   - All integrations and third-party services
   - Security, compliance, and performance requirements

2. **Focuses on Chrome Extension specifics**:
   - Manifest V3 compliance and permissions
   - Chrome Web Store optimization
   - Extension-specific technical constraints
   - Browser API usage and limitations

3. **Makes it implementation-ready**:
   - Detailed feature descriptions with user stories
   - Clear monetization path with conversion strategies
   - Specific technical implementation details
   - Actionable development roadmap
   - Measurable success metrics

4. **Fixes all specification issues**:
   - Replace empty arrays with comprehensive lists
   - Fix any platform mismatches (this is a Chrome Extension, not SaaS)
   - Add missing details based on the project name and purpose
   - Ensure consistency throughout

Output a requirements document that a developer can use TODAY to start building this product.`,
    minWords: 4000
  },

  'api-service': {
    category: 'API Services',
    prompt: `Create comprehensive requirements for this API Service project.

CRITICAL: The specification YAML may contain errors, placeholders, or mismatches. Analyze it critically and fix ALL issues.

FIRST, VERIFY THE PLATFORM TYPE:
- Check if the project ID starts with 'cvp-api-service-' or 'cvp-api-'
- Verify the specification's project.type matches 'api-service'
- If there's a mismatch, THIS IS AN API SERVICE - treat it as such regardless of what the spec says

Generate a PRACTICAL, FEATURE-RICH requirements document that:

1. **Covers EVERY section from the specification** including all project details, market analysis, features, technical architecture, monetization, and integrations.

2. **Focuses on API Service specifics**:
   - RESTful/GraphQL endpoint design
   - Authentication and rate limiting
   - API versioning and documentation
   - Developer experience and SDKs

3. **Makes it implementation-ready** with detailed endpoints, request/response examples, pricing tiers, and clear development roadmap.

4. **Fixes all specification issues** - replace empty arrays, fix platform mismatches, add missing details based on project purpose.

Create a document that enables immediate API development.`,
    minWords: 4000
  },

  'mobile-app': {
    category: 'Mobile Applications',
    prompt: `Create comprehensive requirements for this Mobile App project.

CRITICAL: The specification YAML may contain errors, placeholders, or mismatches. Analyze it critically and fix ALL issues.

FIRST, VERIFY THE PLATFORM TYPE:
- Check if the project ID starts with 'cvp-mobile-app-', 'cvp-android-app-', or 'cvp-ios-app-'
- Verify the specification's project.type matches 'mobile-app'
- If there's a mismatch, THIS IS A MOBILE APP - treat it as such regardless of what the spec says

Generate a PRACTICAL, FEATURE-RICH requirements document that:

1. **Covers EVERY section from the specification** - all project details, complete market analysis, full feature sets, technical stack, monetization strategy, and growth plans.

2. **Focuses on Mobile App specifics**:
   - iOS and Android platform requirements
   - App Store/Play Store optimization
   - Native features and permissions
   - Offline functionality and sync

3. **Makes it implementation-ready** with detailed user flows, monetization strategies, platform-specific implementations, and measurable KPIs.

4. **Fixes all specification issues** - populate empty sections, correct platform type, ensure mobile-appropriate features.

Deliver requirements that enable immediate mobile development.`,
    minWords: 4500
  },

  'web-app': {
    category: 'Web Applications',
    prompt: `Create comprehensive requirements for this Web Application project.

CRITICAL: The specification YAML may contain errors, placeholders, or mismatches. Analyze it critically and fix ALL issues.

FIRST, VERIFY THE PLATFORM TYPE:
- Check if the project ID starts with 'cvp-web-app-', 'cvp-pwa-', or 'cvp-saas-'
- Verify the specification's project.type matches 'web-app'
- If there's a mismatch, THIS IS A WEB APPLICATION - treat it as such regardless of what the spec says

Generate a PRACTICAL, FEATURE-RICH requirements document that:

1. **Covers EVERY section from the specification** including complete project vision, market analysis, all feature tiers, technical architecture, monetization model, and success metrics.

2. **Focuses on Web App specifics**:
   - Responsive design and PWA capabilities
   - SEO and performance optimization
   - User authentication and sessions
   - SaaS billing and subscriptions

3. **Makes it implementation-ready** with detailed features, clear pricing strategy, technical stack decisions, and phased roadmap.

4. **Fixes all specification issues** - fill empty arrays with real features, ensure web-appropriate architecture, add missing business details.

Create actionable requirements for immediate development.`,
    minWords: 4000
  },

  'discord-bot': {
    category: 'Chat Bots',
    prompt: `Create comprehensive requirements for this Discord Bot project.

CRITICAL: The specification YAML may contain errors, placeholders, or mismatches. Analyze it critically and fix ALL issues.

FIRST, VERIFY THE PLATFORM TYPE:
- Check if the project ID starts with 'cvp-discord-bot-', 'cvp-telegram-bot-', or similar bot patterns
- Verify the specification's project.type matches 'discord-bot'
- If there's a mismatch, THIS IS A DISCORD BOT - treat it as such regardless of what the spec says

Generate a PRACTICAL, FEATURE-RICH requirements document that:

1. **Covers EVERY section from the specification** - complete the vision, market opportunity, all features, technical details, and monetization strategy.

2. **Focuses on Discord Bot specifics**:
   - Commands and interactions design
   - Discord API compliance
   - Server management features
   - Bot monetization models

3. **Makes it implementation-ready** with specific commands, permission systems, hosting requirements, and growth strategies.

4. **Fixes all specification issues** - populate features, correct platform type, add Discord-specific technical requirements.

Deliver bot requirements ready for development.`,
    minWords: 3500
  },

  'cli-tool': {
    category: 'CLI Tools',
    prompt: `Create comprehensive requirements for this CLI Tool project.

CRITICAL: The specification YAML may contain errors, placeholders, or mismatches. Analyze it critically and fix ALL issues.

FIRST, VERIFY THE PLATFORM TYPE:
- Check if the project ID starts with 'cvp-cli-tool-'
- Verify the specification's project.type matches 'cli-tool'
- If there's a mismatch, THIS IS A CLI TOOL - treat it as such regardless of what the spec says

Generate a PRACTICAL, FEATURE-RICH requirements document that:

1. **Covers EVERY section from the specification** including project purpose, target developers, complete feature set, technical architecture, and distribution strategy.

2. **Focuses on CLI Tool specifics**:
   - Command structure and arguments
   - Cross-platform compatibility
   - Package distribution methods
   - Developer experience

3. **Makes it implementation-ready** with detailed commands, installation methods, configuration options, and monetization approach.

4. **Fixes all specification issues** - add real commands to empty feature arrays, ensure CLI-appropriate architecture, include distribution details.

Create requirements that enable immediate CLI development.`,
    minWords: 3500
  },

  'default': {
    category: 'General Software',
    prompt: `Create comprehensive requirements for this software project.

CRITICAL: Analyze the specification YAML critically and fix ALL issues, empty sections, and inconsistencies.

Generate a PRACTICAL, FEATURE-RICH requirements document that covers EVERY aspect from the specification including:
- Complete project vision and market analysis
- All features (populate any empty arrays)
- Full technical architecture
- Detailed monetization strategy
- Implementation roadmap

Make it actionable and ready for immediate development.`,
    minWords: 3500
  }
};

// Progress tracking class (same as before)
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
    
    // Build the powerful prompt
    const prompt = `${platformConfig.prompt}

YOUR TASK:
1. Read the specification file: ${path.join(dir, 'ai-generated', 'specification.yaml')}
2. Also read if it exists: ${path.join(dir, 'ai-generated', 'market-enhanced-spec.yaml')}
3. VERIFY THE PLATFORM: Check project ID (${id}) and ensure it matches the expected ${project.platform} type
4. Generate comprehensive requirements (minimum ${platformConfig.minWords} words)
5. Save to: ${outputFile}

CRITICAL PLATFORM VERIFICATION:
- Project ID: ${id}
- Expected platform: ${project.platform}
- If the specification's project.type doesn't match, OVERRIDE IT and treat this as a ${project.platform} project
- Base ALL requirements on the CORRECT platform type (${project.platform})

REMEMBER: You have access to the FULL specification. Use EVERY section - project details, market analysis, features, technical stack, monetization, integrations, etc. Fix any empty arrays, placeholder content, or inconsistencies.

Start by reading the specification files now.`;

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