#!/usr/bin/env node

/**
 * Test script matching ui-subagent.js exactly
 */

const fs = require('fs-extra');
const path = require('path');
const yaml = require('yaml');
const { spawn } = require('child_process');

const PROJECT_DIR = '/home/sali/ai/projects/projecthubv3/projects/cvp-api-service-city-service-reporter';
const OUTPUT_DIR = path.join(PROJECT_DIR, 'ai-generated');
const PROMPT_FILE = path.join(PROJECT_DIR, 'test-prompt.txt');

// Simple prompt matching ui-subagent style
const prompt = `
# Claude Requirements Generator

You are a world-class software architect.

**Objective:** Generate comprehensive requirements for the following project.

**How to work:**
- Read and understand the specification.yaml in the current directory.
- Generate a requirements.md file with all sections filled (minimum 3500 words).
- Use only real information from spec, be specific to this project.
- Do not ask for user input or clarification—just generate the document.
- Output the file directly to /ai-generated/requirements.md using MCP.Filesystem tool.

## FILES TO CREATE:
- /ai-generated/requirements.md

Start writing the requirements now.
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