#!/usr/bin/env node
/**
 * Improved Requirements Generation with Intelligent Platform Detection
 * Uses condensed prompt for better Claude processing
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
const MIN_WORD_COUNT = 2000;

// Condensed prompt function
function createCondensedPrompt(projectId, spec) {
  return `
# Generate requirements.md for ${projectId}

Read specification.yaml and create requirements.md (min 2000 words).

PLATFORM DETECTION:
Project ID: ${projectId}
Pattern: cvp-[platform]-[name]
Detected platform: ${projectId.split('-').slice(1, 3).join('-')}

OVERRIDE RULE: If spec.project.type says "${spec.project?.type}" but ID indicates "${projectId.split('-')[1]}-${projectId.split('-')[2]}", trust the ID.

${projectId.includes('api-service') ? 'This is an API SERVICE, not a web app.' : ''}
${projectId.includes('chrome-extension') ? 'This is a CHROME EXTENSION, not a web app.' : ''}
${projectId.includes('mobile-app') ? 'This is a MOBILE APP, not a web app.' : ''}

Write requirements for: ${projectId.split('-').slice(3).join(' ').replace(/-/g, ' ').toUpperCase()}

Include:
1. Project Overview (for correct platform type)
2. 8-12 specific features with:
   - Description, User Flow, API Endpoints/Implementation
   - Data Models, Dependencies
3. Technical Architecture (platform-appropriate stack)
4. Implementation Roadmap (3 phases)
5. Development Guidelines
6. Testing Strategy

${projectId.includes('city-service-reporter') ? `
Example features: Report submission API, Location services, Photo uploads, Status tracking, Department routing, Notifications, Analytics, Admin APIs
` : ''}

Focus on what ${projectId} ACTUALLY does, not generic templates.

Start writing requirements.md now.
`;
}

// Process single project
async function processProject(projectId, projectDir) {
  const specFile = path.join(projectDir, 'ai-generated', 'specification.yaml');
  const outputFile = path.join(projectDir, 'ai-generated', 'requirements.md');
  
  // Read specification
  let spec = {};
  try {
    const specContent = fs.readFileSync(specFile, 'utf-8');
    spec = yaml.parse(specContent);
  } catch (err) {
    console.error(`Failed to read spec for ${projectId}:`, err.message);
    return { status: 'failed', reason: 'spec-read-error' };
  }
  
  // Create prompt with embedded spec
  const prompt = createCondensedPrompt(projectId, spec);
  
  // Write prompt to file
  const promptFile = path.join(projectDir, '.claude-prompt-temp.txt');
  fs.writeFileSync(promptFile, prompt);
  
  const outputDir = path.join(projectDir, 'ai-generated');
  fs.ensureDirSync(outputDir);
  
  return new Promise((resolve) => {
    const claudeProcess = spawn('claude', [
      '--allowedTools', 'MCP.Filesystem',
      '--add-dir', outputDir,
      '--dangerously-skip-permissions',
      '-p'
    ], {
      cwd: projectDir,
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    const promptStream = fs.createReadStream(promptFile);
    promptStream.pipe(claudeProcess.stdin);
    
    let timeoutId = setTimeout(() => {
      claudeProcess.kill('SIGTERM');
    }, 180000); // 3 minutes
    
    claudeProcess.on('close', (code) => {
      clearTimeout(timeoutId);
      try {
        fs.unlinkSync(promptFile);
      } catch (e) {}
      
      if (fs.existsSync(outputFile)) {
        const content = fs.readFileSync(outputFile, 'utf-8');
        const wordCount = content.split(/\s+/).length;
        resolve({ 
          status: 'success', 
          wordCount,
          meetsTarget: wordCount >= MIN_WORD_COUNT 
        });
      } else {
        resolve({ status: 'failed', reason: 'no-output' });
      }
    });
  });
}

// Test with a single project
async function testSingleProject() {
  const testProjectId = 'cvp-api-service-city-service-reporter';
  const testProjectDir = path.join(PROJECTS_DIR, testProjectId);
  
  console.log(`🧪 Testing improved prompt with: ${testProjectId}`);
  console.log(`📁 Directory: ${testProjectDir}`);
  
  const result = await processProject(testProjectId, testProjectDir);
  
  if (result.status === 'success') {
    console.log(`✅ Success! Generated ${result.wordCount} words`);
    console.log(`📊 Meets target: ${result.meetsTarget ? 'Yes' : 'No'}`);
  } else {
    console.log(`❌ Failed: ${result.reason}`);
  }
}

// Run test if called directly
if (require.main === module) {
  testSingleProject().catch(console.error);
}

module.exports = { createCondensedPrompt, processProject };