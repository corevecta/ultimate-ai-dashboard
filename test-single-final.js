#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Test project
const projectId = 'cvp-chrome-extension-a-b-test-stats-overlay-for-landing-pages-in-browser';
const projectDir = `/home/sali/ai/projects/projecthubv3/projects/${projectId}`;
const outputFile = path.join(projectDir, 'ai-generated', 'requirements-final-test.md');

// Use the full prompt from intelligent script
const INTELLIGENT_PROMPT = `You are creating comprehensive requirements for a software project.

YOUR TASK:
1. Read the specification YAML file
2. DETERMINE the correct platform type based on the project ID: ${projectId}
3. Generate a MINIMUM 3500 WORD requirements document

CRITICAL: Include ALL these sections with specified word counts:
- Executive Summary (300-400 words)
- Product Overview (400-500 words)
- Market Analysis (400-500 words)
- Core Features - MVP (800-1000 words)
- Advanced Features (500-600 words)
- Monetization Strategy (500-600 words)
- Technical Architecture (600-700 words)
- User Experience Design (400-500 words)
- Security & Compliance (300-400 words)
- Development Roadmap (400-500 words)
- Testing Strategy (300-400 words)
- Launch Strategy (400-500 words)
- Success Metrics & KPIs (300-400 words)
- Risk Analysis & Mitigation (200-300 words)
- Support & Documentation (200-300 words)
- Future Vision (200-300 words)

Read: ${path.join(projectDir, 'ai-generated', 'specification.yaml')}
Write to: ${outputFile}`;

console.log('Testing final Claude invocation pattern...');
console.log(`Project: ${projectId}`);

const startTime = Date.now();

const claude = spawn('claude', [
  '--allowedTools', 'Read,Write',
  '--add-dir', projectDir,
  '--dangerously-skip-permissions'
], {
  stdio: ['pipe', 'pipe', 'pipe']
});

// Write prompt directly
claude.stdin.write(INTELLIGENT_PROMPT);
claude.stdin.end();

// Capture output
let output = '';
claude.stdout.on('data', (data) => {
  output += data.toString();
  process.stdout.write('.');
});

claude.stderr.on('data', (data) => {
  console.error('Error:', data.toString());
});

claude.on('close', (code) => {
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n\nCompleted in ${duration}s with code ${code}`);
  
  if (fs.existsSync(outputFile)) {
    const content = fs.readFileSync(outputFile, 'utf-8');
    const wordCount = content.split(/\s+/).length;
    console.log(`✅ Generated ${wordCount} words`);
    
    if (wordCount >= 3500) {
      console.log('✅ SUCCESS: Met 3500+ word requirement!');
    } else {
      console.log(`⚠️  Only ${wordCount} words (need 3500+)`);
    }
  } else {
    console.log('❌ No output file generated');
  }
});