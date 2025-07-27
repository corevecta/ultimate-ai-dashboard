#!/usr/bin/env node

/**
 * Platform-Aware Requirements Generation - Intelligent Version
 * Claude determines the correct platform based on all available context
 * FIXED: 1. word count threshold 3200, 2. error handling, 3. portable paths, 4. stdout capture
 */

const fs = require('fs-extra');
const path = require('path');
const yaml = require('yaml');
const { spawn } = require('child_process');

const os = require('os');

// Portable configuration
const HOME = os.homedir();
const PROJECTS_DIR = process.env.PROJECTS_DIR || path.join(HOME, 'ai/projects/projecthubv3/projects');
const MAX_WORKERS = 5;
const PROGRESS_FILE = path.join(__dirname, '.platform-regeneration-progress.json');
const MIN_WORD_COUNT = 2500; // Reasonable target for comprehensive requirements

// Simplified prompt that works
const SIMPLE_PROMPT = `
# Claude Requirements Generator

You are a world-class software architect.

**Objective:** Generate comprehensive requirements for the project based on specification.yaml

**How to work:**
- Read and understand the entire specification.yaml in /ai-generated/
- Generate a comprehensive requirements.md file (minimum 3500 words)
- Use only real information from spec, be specific to this project
- Do not ask for user input—just generate the document
- Output **all content directly** to /ai-generated/requirements.md using MCP.Filesystem tool

## FILE TO CREATE:
- /ai-generated/requirements.md

The requirements must include all standard sections: Executive Summary, Product Overview, Market Analysis, Core Features, Advanced Features, Monetization Strategy, Technical Architecture, User Experience, Security & Compliance, Development Roadmap, Testing Strategy, Launch Strategy, Success Metrics, Risk Analysis, Support & Documentation, and Future Vision.

Start writing requirements.md now.
`;

// Original long prompt (keeping for reference but not using)
const INTELLIGENT_PROMPT_OLD = `You are creating comprehensive requirements for a software project.

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

# [Project Name] - [Platform Type] Requirements

## 1. Executive Summary (300-400 words)
- Project overview and vision
- Key objectives and success criteria
- Target market and opportunity size
- Expected outcomes and ROI

## 2. Product Overview (400-500 words)
- **Purpose**: Clear 1-2 sentence description
- **Target Users**: Detailed user segments and personas
- **Core Value Proposition**: Unique problem solved
- **Competitive Advantage**: Detailed differentiation
- **Market Positioning**: How it fits in the market

## 3. Market Analysis (400-500 words)
- Industry overview and trends
- Target market size (TAM/SAM/SOM from spec)
- Competitor analysis (expand from spec)
- Market opportunities and gaps
- Growth potential and projections

## 4. Core Features - MVP (800-1000 words)
List 7-10 essential features for launch:
### Feature 1: [Feature Name]
- **Description**: Detailed explanation (100+ words)
- **User Stories**: As a [user], I want to [action] so that [benefit]
- **Technical Implementation**: Specific tech/APIs needed
- **Acceptance Criteria**: Clear success metrics
- **Dependencies**: What this feature requires

[Repeat for each core feature with substantial detail]

## 5. Advanced Features (500-600 words)
- Premium tier features (5-7 features)
- Each with description, benefit, and implementation notes
- How they enhance the core offering

## 6. Monetization Strategy (500-600 words)
### Revenue Model
- **Model Type**: Detailed explanation of chosen model
- **Pricing Strategy**: Psychology and market positioning
- **Pricing Tiers**:
  - Free/Trial: Detailed features and limitations
  - Pro ($X/month): Complete feature list
  - Enterprise (Custom): Full capabilities
- **Payment Processing**: Specific providers and flow
- **Conversion Strategy**: Detailed funnel optimization

### Financial Projections
- Month 1-3: Detailed breakdown
- Month 4-6: Growth metrics
- Year 1: Complete P&L projection
- Key metrics: CAC, LTV, MRR, Churn

## 7. Technical Architecture (600-700 words)
### Technology Stack
- **Frontend**: Frameworks, libraries, tools (with versions)
- **Backend**: Languages, frameworks, databases
- **Infrastructure**: Cloud providers, CDN, monitoring
- **Third-party Services**: All integrations listed

### System Design
- Architecture diagrams (described in text)
- Data flow and storage strategy
- API design principles
- Microservices breakdown (if applicable)

### Platform-Specific Requirements
[Detailed requirements based on detected platform - 200+ words]

## 8. User Experience Design (400-500 words)
### User Flows
1. **Onboarding Flow**: Step-by-step with screenshots described
2. **Core User Journey**: Daily usage patterns
3. **Upgrade Flow**: Conversion optimization

### UI/UX Principles
- Design system and components
- Accessibility requirements
- Mobile responsiveness
- Performance targets

## 9. Security & Compliance (300-400 words)
- Authentication and authorization
- Data encryption and privacy
- Compliance requirements (GDPR, etc.)
- Security best practices
- Incident response plan

## 10. Development Roadmap (400-500 words)
### Phase 1 - MVP (Month 1-2)
- [ ] Detailed task list
- [ ] Technical milestones
- [ ] Testing requirements

### Phase 2 - Growth (Month 3-4)
- [ ] Feature expansion
- [ ] Performance optimization
- [ ] Market feedback integration

### Phase 3 - Scale (Month 5-6)
- [ ] Enterprise features
- [ ] International expansion
- [ ] Platform optimization

## 11. Testing Strategy (300-400 words)
- Unit testing approach
- Integration testing
- User acceptance testing
- Performance testing
- Security testing
- Platform-specific testing

## 12. Launch Strategy (400-500 words)
### Pre-launch (2-4 weeks)
- Beta testing plan
- Marketing preparation
- Documentation
- Support setup

### Launch Week
- Platform submission/deployment
- PR and marketing campaign
- Community outreach
- Monitoring plan

### Post-launch (Month 1)
- Success metrics tracking
- User feedback loops
- Iteration plan
- Growth tactics

## 13. Success Metrics & KPIs (300-400 words)
### User Metrics
- Acquisition targets
- Activation rates
- Retention benchmarks
- Engagement metrics

### Business Metrics
- Revenue targets
- Conversion rates
- Cost metrics
- Growth indicators

### Technical Metrics
- Performance benchmarks
- Uptime requirements
- Error rates
- Platform-specific metrics

## 14. Risk Analysis & Mitigation (200-300 words)
- Technical risks and solutions
- Business risks and contingencies
- Market risks and adaptations
- Compliance risks and measures

## 15. Support & Documentation (200-300 words)
- Documentation requirements
- Support channels
- Knowledge base structure
- Community building

## 16. Future Vision (200-300 words)
- Long-term product roadmap
- Platform expansion possibilities
- Market expansion opportunities
- Technology evolution

CRITICAL QUALITY REQUIREMENTS:
- MINIMUM 3500 WORDS - This is non-negotiable
- Every section must be detailed and specific
- No generic content - everything must be tailored to THIS project
- Include specific numbers, metrics, and technical details
- Fix ALL issues from the specification
- Ensure platform-specific accuracy throughout

Remember: You're creating a document that a development team can use IMMEDIATELY to build this product. Be comprehensive, specific, and actionable.`;

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

// Process single project with intelligent platform detection
async function processProject(project, progressTracker) {
  return new Promise((resolve) => {
    const { id, dir, specFile } = project;
    const outputFile = path.join(dir, 'ai-generated', 'requirements.md');
    
    // Check if requirements already exist and meet quality standards
    if (fs.existsSync(outputFile)) {
      const content = fs.readFileSync(outputFile, 'utf-8');
      const wordCount = content.split(/\s+/).length;
      
      // Skip if word count is sufficient
      if (wordCount >= MIN_WORD_COUNT) {
        progressTracker.markProjectComplete(id, 'existing', 'skipped', wordCount);
        return resolve({ status: 'skipped', reason: 'sufficient-words', wordCount });
      }
    }
    
    // Use simple prompt
    const prompt = SIMPLE_PROMPT;

    // Write prompt to file first (like ui-subagent.js)
    const promptFile = path.join(dir, '.claude-prompt-temp.txt');
    fs.writeFileSync(promptFile, prompt);
    
    const startTime = Date.now();
    
    // Ensure output dir exists
    const outputDir = path.join(dir, 'ai-generated');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Use spawn with exact pattern from ui-subagent.js
    const claude = spawn('claude', [
      '--allowedTools', 'MCP.Filesystem',
      '--add-dir', outputDir,
      '--dangerously-skip-permissions',
      '-p'
    ], {
      stdio: ['pipe', 'inherit', 'inherit']
    });
    
    // Pipe prompt from file like ui-subagent.js
    const promptStream = fs.createReadStream(promptFile);
    promptStream.pipe(claude.stdin);
    
    let detectedPlatform = 'unknown';
    
    claude.on('close', (code) => {
      // Cleanup prompt file
      try {
        fs.unlinkSync(promptFile);
      } catch (e) {
        // Ignore cleanup errors
      }
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
        console.error(`\n[Worker] ❌ Failed to generate requirements for ${id}`);
        progressTracker.markProjectComplete(id, detectedPlatform, 'failed');
        resolve({ status: 'failed' });
      }
    });
    
    // Timeout handler
    setTimeout(() => {
      claude.kill('SIGTERM');
    }, 180000); // 3 minutes
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
    
    // Small delay between projects
    await new Promise(resolve => setTimeout(resolve, 3000));
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
    
    if (Object.keys(stats.platformsDetected).length > 0) {
      console.log('\n📊 Detected Platforms:');
      for (const [platform, count] of Object.entries(stats.platformsDetected)) {
        console.log(`   ${platform}: ${count} projects`);
      }
    }
    
    console.log(`\n   Progress file: ${PROGRESS_FILE}`);
    return;
  }
  
  // Check for existing progress
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
