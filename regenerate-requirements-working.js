#!/usr/bin/env node

/**
 * Requirements Generation Script (Based on Working UI Subagent Pattern)
 * 
 * Generates requirements.md for a single project using Claude CLI
 * with the same approach as the working ui-subagent.js
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { spawn } = require('child_process');

// Get project ID from command line
const PROJECT_ID = process.argv[2];
if (!PROJECT_ID) {
  console.error('Usage: node regenerate-requirements-working.js <project-id>');
  process.exit(1);
}

const PROJECT_DIR = `/home/sali/ai/projects/projecthubv3/projects/${PROJECT_ID}`;
const SPEC_FILE = path.join(PROJECT_DIR, 'ai-generated', 'specification.yaml');
const OUTPUT_DIR = path.join(PROJECT_DIR, 'ai-generated');
const PROMPT_FILE = `/tmp/requirements-prompt-${PROJECT_ID}.txt`;

// 1. Check if specification exists
if (!fs.existsSync(SPEC_FILE)) {
  console.error(`❌ Cannot find ${SPEC_FILE}`);
  process.exit(1);
}

console.log(`🚀 Generating requirements for: ${PROJECT_ID}`);

// 2. Load specification
const spec = yaml.load(fs.readFileSync(SPEC_FILE, 'utf8'));

// 3. Build prompt (similar to ui-subagent style)
const prompt = `
# Claude Requirements Generator

You are a world-class software architect and requirements analyst.

**Objective:** Generate a comprehensive requirements document for the following project, based on the specification provided.

**How to work:**
- Read and understand the entire specification YAML below.
- Generate a requirements.md file in the ai-generated directory.
- Create a comprehensive, detailed requirements document (minimum 2000 words).
- Include all standard sections: Executive Summary, Project Overview, Functional Requirements, Non-Functional Requirements, User Stories, Technical Architecture, Security Requirements, Testing Strategy, Deployment Architecture.
- Use only real information from the spec, be specific to this project.
- Do not ask for user input or clarification—just generate the document.
- Use the Write tool to create the file at ${OUTPUT_DIR}/requirements.md.

## PROJECT SPECIFICATION:
\`\`\`yaml
${fs.readFileSync(SPEC_FILE, 'utf8')}
\`\`\`

## FILE TO CREATE:
- ${OUTPUT_DIR}/requirements.md

The requirements document must be comprehensive and include:
1. Executive Summary (200+ words)
2. Project Overview with business context (300+ words)
3. Detailed Functional Requirements for all features
4. Non-Functional Requirements
5. User Stories (2-3 per major feature)
6. Technical Architecture
7. Security Requirements
8. API Specifications (if applicable)
9. Database Schema (if applicable)
10. UI/UX Requirements
11. Testing Strategy
12. Deployment Architecture

Start writing the requirements.md file now.
`;

// 4. Write prompt to file
fs.writeFileSync(PROMPT_FILE, prompt);

// 5. Run Claude CLI with same pattern as working script
console.log('📝 Running Claude CLI...');
const startTime = Date.now();

const claude = spawn('claude', [
  '--allowedTools', 'Write,Read',
  '--add-dir', OUTPUT_DIR,
  '--dangerously-skip-permissions'
], {
  stdio: ['pipe', 'inherit', 'inherit']
});

// Pipe prompt from file
const promptStream = fs.createReadStream(PROMPT_FILE);
promptStream.pipe(claude.stdin);

// Handle completion
claude.on('close', code => {
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  
  if (code === 0) {
    // Check if file was created
    const reqFile = path.join(OUTPUT_DIR, 'requirements.md');
    if (fs.existsSync(reqFile)) {
      const stats = fs.statSync(reqFile);
      console.log(`\n✅ Requirements generated successfully!`);
      console.log(`   File: ${reqFile}`);
      console.log(`   Size: ${stats.size} bytes`);
      console.log(`   Time: ${duration}s`);
    } else {
      console.log(`\n⚠️  Claude completed but file not found`);
    }
  } else {
    console.error(`\n❌ Claude CLI failed with code: ${code}`);
  }
  
  // Cleanup prompt file
  try {
    fs.unlinkSync(PROMPT_FILE);
  } catch (e) {}
});

// Timeout handler
setTimeout(() => {
  console.log('\n⏰ Timeout - killing process');
  claude.kill();
}, 90000); // 90 second timeout