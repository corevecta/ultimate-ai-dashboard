#!/usr/bin/env node

/**
 * Platform-Aware Requirements Generation with Enforced Individual Processing
 * Ensures each project is processed individually based on its unique specification
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const yaml = require('js-yaml');

const PROJECTS_DIR = '/home/sali/ai/projects/projecthubv3/projects';
const MAX_WORKERS = 5;
const PROGRESS_FILE = path.join(__dirname, '.platform-regeneration-progress.json');

// Platform-specific prompt templates with individual processing enforcement
const PLATFORM_PROMPTS = {
  'chrome-extension': {
    category: 'Browser Extensions',
    prompt: `You are creating requirements for a Chrome Extension project.

CRITICAL: This is an INDIVIDUAL PROJECT. You MUST:
1. Read THIS project's specification file completely
2. Base ALL content on THIS project's unique features, business model, and requirements
3. Do NOT use generic templates or content from other projects
4. Every section must be specific to THIS project's actual specification

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

CRITICAL: This is an INDIVIDUAL PROJECT. You MUST:
1. Read THIS project's specification file completely
2. Base ALL content on THIS project's unique features, business model, and requirements
3. Do NOT use generic templates or content from other projects
4. Every section must be specific to THIS project's actual specification

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

CRITICAL: This is an INDIVIDUAL PROJECT. You MUST:
1. Read THIS project's specification file completely
2. Base ALL content on THIS project's unique features, business model, and requirements
3. Do NOT use generic templates or content from other projects
4. Every section must be specific to THIS project's actual specification

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

CRITICAL: This is an INDIVIDUAL PROJECT. You MUST:
1. Read THIS project's specification file completely
2. Base ALL content on THIS project's unique features, business model, and requirements
3. Do NOT use generic templates or content from other projects
4. Every section must be specific to THIS project's actual specification

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

CRITICAL: This is an INDIVIDUAL PROJECT. You MUST:
1. Read THIS project's specification file completely
2. Base ALL content on THIS project's unique features, business model, and requirements
3. Do NOT use generic templates or content from other projects
4. Every section must be specific to THIS project's actual specification

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

CRITICAL: This is an INDIVIDUAL PROJECT. You MUST:
1. Read THIS project's specification file completely
2. Base ALL content on THIS project's unique features, business model, and requirements
3. Do NOT use generic templates or content from other projects
4. Every section must be specific to THIS project's actual specification

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

CRITICAL: This is an INDIVIDUAL PROJECT. You MUST:
1. Read THIS project's specification file completely
2. Base ALL content on THIS project's unique features, business model, and requirements
3. Do NOT use generic templates or content from other projects
4. Every section must be specific to THIS project's actual specification

Read the specification files and create comprehensive requirements that address all aspects of the project including functional requirements, technical architecture, security, testing, and deployment.`,
    minWords: 3000
  }
};

// Get project name and key features for verification
async function getProjectDetails(specFile) {
  try {
    const spec = yaml.load(fs.readFileSync(specFile, 'utf-8'));
    return {
      name: spec.project?.name || 'Unknown',
      description: spec.project?.description || 'No description',
      features: spec.features?.core?.slice(0, 3) || []
    };
  } catch (e) {
    return null;
  }
}

// Process single project with enhanced individual processing
async function processProject(project, platformConfig) {
  return new Promise(async (resolve) => {
    const { id, dir, specFile } = project;
    const outputFile = path.join(dir, 'ai-generated', 'requirements.md');
    
    // Get project details for verification
    const details = await getProjectDetails(specFile);
    if (!details) {
      console.error(`❌ Cannot read specification for ${id}`);
      return resolve({ status: 'failed' });
    }
    
    // Build the enhanced prompt with project-specific enforcement
    const prompt = `${platformConfig.prompt}

PROJECT-SPECIFIC INSTRUCTIONS:
You are now processing: "${details.name}"
Project ID: ${id}
Description: ${details.description}

This project's unique features include:
${details.features.map((f, i) => `${i+1}. ${typeof f === 'string' ? f : f.name || 'Feature'}`).join('\n')}

REQUIREMENTS:
1. First, use the Read tool to read: ${specFile}
2. Also read if exists: ${path.join(dir, 'ai-generated', 'market-enhanced-spec.yaml')}
3. Create a comprehensive requirements document (minimum ${platformConfig.minWords} words)
4. Use Write tool to save to: ${outputFile}

CRITICAL REMINDERS:
- Base EVERYTHING on the specification you just read
- Use the ACTUAL project name: "${details.name}"
- Include the ACTUAL features from the specification
- Reference the ACTUAL business model from the specification
- Use the ACTUAL technical stack from the specification
- Every user story must relate to THIS project's features
- Every requirement must be specific to THIS project

The document MUST include all standard sections plus platform-specific requirements mentioned above.
Focus heavily on ${project.platform} specific considerations for THIS PARTICULAR PROJECT.

Start by reading the specification files NOW.`;

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
        
        // Verify the content contains project-specific information
        if (content.includes(details.name) || content.includes(id)) {
          resolve({ status: 'success', wordCount, duration });
        } else {
          console.warn(`⚠️  ${id} - Generated but might be generic`);
          resolve({ status: 'success', wordCount, duration, warning: 'possibly-generic' });
        }
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
        totalSkipped: 0,
        totalWarnings: 0
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
  
  markProjectComplete(projectId, platform, status, wordCount = 0, warning = null) {
    this.progress.completedProjects[projectId] = {
      platform,
      status,
      timestamp: new Date().toISOString(),
      wordCount,
      warning
    };
    
    if (status === 'success') this.progress.stats.totalSuccess++;
    else if (status === 'failed') this.progress.stats.totalFailed++;
    else if (status === 'skipped') this.progress.stats.totalSkipped++;
    
    if (warning) this.progress.stats.totalWarnings++;
    
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

// Main and other functions remain the same...
// [Rest of the code continues with the same structure but using the enhanced processProject function]