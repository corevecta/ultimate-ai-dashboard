#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { spawn } = require('child_process');

const PROJECT_DIR = '/home/sali/ai/projects/projecthubv3/projects/cvp-api-service-city-service-reporter';
const OUTPUT_DIR = path.join(PROJECT_DIR, 'ai-generated');
const PROMPT_FILE = path.join(PROJECT_DIR, 'requirements-prompt.txt');

// Simple prompt
const prompt = `
# Claude Requirements Generator

**Objective:** Generate comprehensive requirements for this project.

**How to work:**
- Read specification.yaml in the current directory.
- Generate a requirements.md file (minimum 3500 words).
- Output **all content directly** to /ai-generated/requirements.md using MCP.Filesystem tool.

## FILE TO CREATE:
- /ai-generated/requirements.md

Start writing requirements.md now.
`;

// Ensure output directory exists
fs.ensureDirSync(OUTPUT_DIR);

// Write prompt file
fs.writeFileSync(PROMPT_FILE, prompt);

// Run Claude CLI
console.log('🚀 Invoking Claude CLI...');
const claude = spawn('claude', [
  '--allowedTools', 'MCP.Filesystem',
  '--add-dir', OUTPUT_DIR,
  '--dangerously-skip-permissions',
  '-p'
], {
  stdio: ['pipe', 'inherit', 'inherit']
});

const promptStream = fs.createReadStream(PROMPT_FILE);
promptStream.pipe(claude.stdin);

claude.on('close', code => {
  if (code === 0) {
    console.log('\\n✅ Requirements generated!');
    const reqFile = path.join(OUTPUT_DIR, 'requirements.md');
    if (fs.existsSync(reqFile)) {
      const content = fs.readFileSync(reqFile, 'utf-8');
      console.log('Word count:', content.split(/\\s+/).length);
    }
  } else {
    console.error('\\n❌ Claude CLI failed with code:', code);
  }
  
  // Cleanup
  fs.unlinkSync(PROMPT_FILE);
});