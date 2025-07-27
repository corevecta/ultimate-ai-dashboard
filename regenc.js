#!/usr/bin/env node

/**
 * Platform-Aware Requirements Generation - Intelligent Version
 * Claude determines the correct platform based on all available context
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const yaml = require('js-yaml');

const PROJECTS_DIR = '/home/sali/ai/projects/projecthubv3/projects';
const MAX_WORKERS = 5;
const PROGRESS_FILE = path.join(__dirname, '.platform-regeneration-progress.json');

// Single powerful prompt that works for all platforms
const INTELLIGENT_PROMPT = `
You are creating comprehensive requirements for a software project.

YOUR INTELLIGENT ANALYSIS TASK:
1. Read the specification YAML file
2. Examine the project folder name and structure
3. Analyze the project name and description
4. DETERMINE the correct platform type based on ALL available evidence:
   - Project ID pattern (cvp-[platform]-[name])
   - Project name and description content
   - Features mentioned in the specification
   - Technical stack choices
   - File structure and context

PLATFORM DETECTION RULES:
- Chrome Extension: project ID contains 'chrome-extension', or name/features mention browser extension, Chrome, manifest, etc.
- API Service: project ID contains 'api-service', 'api-rest', 'api-graphql', or features describe API endpoints, microservices
- Mobile App: project ID contains 'mobile-app', 'android-app', 'ios-app', or features mention mobile, app stores
- Web App: project ID contains 'web-app', 'saas', 'pwa', or features describe web application, SaaS platform
- Discord Bot: project ID contains 'discord-bot', or features mention Discord commands, bot functionality
- CLI Tool: project ID contains 'cli-tool', or features describe command-line interface, terminal commands
- And so on for other platforms...

CRITICAL INSTRUCTIONS:
1. If the specification's project.type is WRONG (doesn't match the evidence), OVERRIDE IT
2. Fix ALL discrepancies, empty arrays, and placeholder content
3. Generate requirements that match the ACTUAL platform type you determined
4. Include platform-specific technical requirements, constraints, and best practices

COMPREHENSIVE REQUIREMENTS DOCUMENT STRUCTURE (MINIMUM 3500 WORDS):
Based on the platform you identify, create a comprehensive, implementation-ready document that includes ALL of these sections:
[...rest omitted for brevity, but use your original...]
Remember: You're creating a document that a development team can use IMMEDIATELY to build this product. Be comprehensive, specific, and actionable.
`;

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
      // Track platform detection
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

async function processProject(project, progressTracker) {
  return new Promise((resolve) => {
    const { id, dir, specFile } = project;
    const outputFile = path.join(dir, 'ai-generated', 'requirements.md');

    // Check if requirements already exist and meet quality standards
    if (fs.existsSync(outputFile)) {
      const content = fs.readFileSync(outputFile, 'utf-8');
      const wordCount = content.split(/\s+/).length;

      // Skip if word count is sufficient (2500+ words)
      if (wordCount >= 2500) {
        progressTracker.markProjectComplete(id, 'existing', 'skipped', wordCount);
        return resolve({ status: 'skipped', reason: 'sufficient-words', wordCount });
      }
    }

    // Build the prompt with project context
    const prompt = `${INTELLIGENT_PROMPT}

YOUR SPECIFIC TASK:
1. Read the specification file: ${specFile}
2. Also read if it exists: ${path.join(dir, 'ai-generated', 'market-enhanced-spec.yaml')}
3. Examine the project ID: ${id}
4. Analyze ALL available context to determine the correct platform
5. Generate comprehensive requirements based on your platform determination
6. Save to: ${outputFile}

Remember: Use your intelligence to determine what this project REALLY is, not what the spec claims.
Fix all issues and create implementation-ready requirements.

Start by reading the specification files now.`;

    const promptFile = path.join(dir, '.claude-prompt-temp.txt');
    fs.writeFileSync(promptFile, prompt);

    const startTime = Date.now();

    const claude = spawn('claude', [
      '--allowedTools', 'Write,Read',
      '--add-dir', dir,
      '--dangerously-skip-permissions',
      '-p'
    ], {
      stdio: ['pipe', 'inherit', 'inherit']
    });

    const promptStream = fs.createReadStream(promptFile);
    promptStream.pipe(claude.stdin);

    let detectedPlatform = 'unknown';

    claude.on('close', (code) => {
      try { fs.unlinkSync(promptFile); } catch (e) { }
      const duration = ((Date.now() - startTime) / 1000).toFixed(1);

      if (fs.existsSync(outputFile)) {
        const content = fs.readFileSync(outputFile, 'utf-8');
        const wordCount = content.split(/\s+/).length;

        // Try to detect platform from the generated content
        if (detectedPlatform === 'unknown') {
          if (content.includes('Chrome Extension')) detectedPlatform = 'chrome-extension';
          else if (content.includes('API Service')) detectedPlatform = 'api-service';
          else if (content.includes('Mobile App')) detectedPlatform = 'mobile-app';
          else if (content.includes('Web Application')) detectedPlatform = 'web-app';
          else if (content.includes('Discord Bot')) detectedPlatform = 'discord-bot';
          else if (content.includes('CLI Tool')) detectedPlatform = 'cli-tool';
        }

        progressTracker.markProjectComplete(id, detectedPlatform, 'success', wordCount);
        resolve({ status: 'success', wordCount, duration, detectedPlatform });
      } else {
        progressTracker.markProjectComplete(id, detectedPlatform, 'failed');
        resolve({ status: 'failed' });
      }
    });

    setTimeout(() => {
      claude.kill('SIGTERM');
    }, 180000);
  });
}

async function runWorker(workerId, projectQueue, progressTracker) {
  console.log(`[Worker ${workerId}] Started`);

  while (true) {
    const project = projectQueue.shift();
    if (!project) {
      console.log(`[Worker ${workerId}] No more projects to process`);
      break;
    }

    process.stdout.write(`\r[Worker ${workerId}] Processing ${project.id.substring(0, 40)}...     `);

    try {
      const result = await processProject(project, progressTracker);

      if (result.status === 'success') {
        console.log(`\n[Worker ${workerId}] ✅ ${project.id}`);
        console.log(`[Worker ${workerId}]    Platform: ${result.detectedPlatform}, Words: ${result.wordCount}, Time: ${result.duration}s`);
      } else if (result.status === 'failed') {
        console.log(`\n[Worker ${workerId}] ❌ ${project.id} - Failed`);
      }
    } catch (err) {
      console.log(`\n[Worker ${workerId}] ❌ ${project.id} - Error: ${err.message}`);
      progressTracker.markProjectComplete(project.id, 'unknown', 'failed');
    }

    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  console.log(`[Worker ${workerId}] Finished`);
}

// Main
async function main() {
  const args = process.argv.slice(2);

  const progressTracker = new ProgressTracker();

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

    console.log(`\n   Progress file: ${PROGRESS_FILE}`);
    return;
  }

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
  console.log(`🔧 Starting ${MAX_WORKERS} workers with intelligent platform detection...\n`);

  // Start workers
  const workers = [];
  for (let i = 1; i <= MAX_WORKERS; i++) {
    workers.push(runWorker(i, projects, progressTracker));
  }

  // Status monitor
  const statusInterval = setInterval(() => {
    const stats = progressTracker.getStats();
    const remaining = projects.length - stats.totalProcessed;
    if (remaining > 0) {
      process.stdout.write(`\r📊 Progress: ${stats.totalProcessed}/${projects.length} | Success: ${stats.totalSuccess} | Failed: ${stats.totalFailed} | Remaining: ${remaining}     `);
    }
  }, 2000);

  process.on('SIGINT', () => {
    console.log('\n\n⚠️  Gracefully shutting down... Progress has been saved.');
    console.log('   Run again to continue from where you left off.');
    process.exit(0);
  });

  await Promise.all(workers);

  clearInterval(statusInterval);

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

if (require.main === module) {
  main().catch(console.error);
}
