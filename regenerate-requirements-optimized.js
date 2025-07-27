#!/usr/bin/env node

/**
 * Optimized Requirements Generation using Claude's Read capability
 * Instead of embedding specs in prompt, we ask Claude to read files directly
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Get project ID
const PROJECT_ID = process.argv[2];
if (!PROJECT_ID) {
  console.error('Usage: node regenerate-requirements-optimized.js <project-id>');
  process.exit(1);
}

const PROJECT_DIR = `/home/sali/ai/projects/projecthubv3/projects/${PROJECT_ID}`;
const SPEC_FILE = path.join(PROJECT_DIR, 'ai-generated', 'specification.yaml');
const MARKET_SPEC_FILE = path.join(PROJECT_DIR, 'ai-generated', 'market-enhanced-spec.yaml');
const OUTPUT_DIR = path.join(PROJECT_DIR, 'ai-generated');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'requirements.md');

// Check if specification exists
if (!fs.existsSync(SPEC_FILE)) {
  console.error(`❌ Cannot find ${SPEC_FILE}`);
  process.exit(1);
}

console.log(`🚀 Generating requirements for: ${PROJECT_ID}`);

// Build a much shorter prompt that uses Read tool
const prompt = `You are a world-class software architect creating comprehensive requirements documentation.

Please complete the following tasks:

1. Use the Read tool to read the specification file at: ${SPEC_FILE}

2. If it exists, also read the market-enhanced specification at: ${MARKET_SPEC_FILE}

3. Based on these specifications, create a comprehensive requirements document that includes:
   - Executive Summary (300+ words)
   - Project Overview with business context (400+ words)
   - Detailed Functional Requirements for ALL features (1000+ words)
   - Non-Functional Requirements (400+ words)
   - User Stories (at least 3 per major feature, 500+ words)
   - Technical Architecture (500+ words)
   - Security Requirements (300+ words)
   - API Specifications (if applicable)
   - Database Schema (if applicable)
   - UI/UX Requirements (300+ words)
   - Testing Strategy (300+ words)
   - Deployment Architecture (300+ words)
   - Development Timeline
   - Success Metrics

4. Use the Write tool to save the requirements document to: ${OUTPUT_FILE}

The document should be at least 3000 words, comprehensive, and specific to this project.
Base everything on the actual features, business model, and technical requirements from the specification files.

Start by reading the specification files now.`;

// Run Claude CLI with Read and Write permissions
console.log('📝 Starting Claude CLI with Read/Write permissions...');
const startTime = Date.now();

const claude = spawn('claude', [
  '--allowedTools', 'Read,Write',
  '--add-dir', PROJECT_DIR,  // Give access to entire project directory
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
let dots = 0;

claude.stdout.on('data', (data) => {
  output += data.toString();
  // Show progress dots
  if (++dots % 10 === 0) {
    process.stdout.write('.');
  }
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
      const lines = fs.readFileSync(OUTPUT_FILE, 'utf-8').split('\n').length;
      console.log(`✅ Requirements generated successfully!`);
      console.log(`   File: ${OUTPUT_FILE}`);
      console.log(`   Size: ${stats.size} bytes`);
      console.log(`   Lines: ${lines}`);
      console.log(`   Time: ${duration}s`);
    } else {
      console.log(`⚠️  Claude completed but file not found`);
      if (output.includes('Error') || output.includes('error')) {
        console.log('Claude output:', output.substring(output.lastIndexOf('Error'), output.lastIndexOf('Error') + 200));
      }
    }
  } else {
    console.error(`❌ Claude CLI failed with code: ${code}`);
    if (error) console.error('Error:', error.substring(0, 500));
  }
});

// Timeout handler
const timeout = setTimeout(() => {
  console.log('\n⏰ Timeout after 120s - killing process');
  claude.kill('SIGTERM');
}, 120000); // 2 minute timeout