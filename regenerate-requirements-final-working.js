#!/usr/bin/env node

/**
 * Requirements Generation - Final Working Version
 * Based on successful test patterns
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { spawn } = require('child_process');

// Get project ID
const PROJECT_ID = process.argv[2];
if (!PROJECT_ID) {
  console.error('Usage: node regenerate-requirements-final-working.js <project-id>');
  process.exit(1);
}

const PROJECT_DIR = `/home/sali/ai/projects/projecthubv3/projects/${PROJECT_ID}`;
const SPEC_FILE = path.join(PROJECT_DIR, 'ai-generated', 'specification.yaml');
const OUTPUT_DIR = path.join(PROJECT_DIR, 'ai-generated');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'requirements.md');

// Check if specification exists
if (!fs.existsSync(SPEC_FILE)) {
  console.error(`❌ Cannot find ${SPEC_FILE}`);
  process.exit(1);
}

console.log(`🚀 Generating requirements for: ${PROJECT_ID}`);

// Load specification
const spec = yaml.load(fs.readFileSync(SPEC_FILE, 'utf8'));
const project = spec.project || {};

// Build a focused prompt
const prompt = `Read the following project specification and create a comprehensive requirements document.

Project: ${project.name || PROJECT_ID}
Type: ${project.type || 'Unknown'}
Description: ${project.description || 'No description'}

Full specification:
${JSON.stringify(spec, null, 2)}

Create a requirements.md file at: ${OUTPUT_FILE}

The document should include:
1. Executive Summary
2. Project Overview
3. Functional Requirements (based on features in spec)
4. Technical Architecture
5. User Stories
6. Security Requirements
7. Testing Strategy
8. Deployment Requirements

Use the Write tool to create the file. Make it comprehensive and specific to this project.`;

// Run Claude CLI
console.log('📝 Starting Claude CLI...');
const startTime = Date.now();

const claude = spawn('claude', [
  '--allowedTools', 'Write',
  '--add-dir', OUTPUT_DIR,
  '--dangerously-skip-permissions'
], {
  stdio: ['pipe', 'pipe', 'pipe']
});

// Write prompt to stdin
claude.stdin.write(prompt);
claude.stdin.end();

// Capture output
let output = '';
let error = '';

claude.stdout.on('data', (data) => {
  output += data.toString();
  process.stdout.write('.');
});

claude.stderr.on('data', (data) => {
  error += data.toString();
});

// Handle completion
claude.on('close', (code) => {
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(''); // New line after dots
  
  if (code === 0 || fs.existsSync(OUTPUT_FILE)) {
    // Check if file was created
    if (fs.existsSync(OUTPUT_FILE)) {
      const stats = fs.statSync(OUTPUT_FILE);
      console.log(`✅ Requirements generated successfully!`);
      console.log(`   File: ${OUTPUT_FILE}`);
      console.log(`   Size: ${stats.size} bytes`);
      console.log(`   Time: ${duration}s`);
    } else {
      console.log(`⚠️  Claude completed but file not found`);
      console.log('Output:', output.substring(0, 200));
    }
  } else {
    console.error(`❌ Claude CLI failed with code: ${code}`);
    if (error) console.error('Error:', error);
  }
});

// Timeout handler
const timeout = setTimeout(() => {
  console.log('\n⏰ Timeout after 90s - killing process');
  claude.kill('SIGTERM');
}, 90000);