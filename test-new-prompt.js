#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Test project
const projectId = 'cvp-api-service-city-service-reporter';
const projectDir = `/home/sali/ai/projects/projecthubv3/projects/${projectId}`;
const outputFile = path.join(projectDir, 'ai-generated', 'requirements-new-test.md');
const specFile = path.join(projectDir, 'ai-generated', 'specification.yaml');

// Check current word count
const currentFile = path.join(projectDir, 'ai-generated', 'requirements.md');
if (fs.existsSync(currentFile)) {
  const content = fs.readFileSync(currentFile, 'utf-8');
  const wordCount = content.split(/\s+/).length;
  console.log(`Current requirements.md: ${wordCount} words`);
}

// Test if the new prompt generates 3500+ words
const prompt = `You are creating comprehensive requirements for a software project.

YOUR TASK:
1. Read the specification file
2. Generate a MINIMUM 3500 WORD requirements document
3. Follow this EXACT structure with ALL sections:

# Requirements Document

## 1. Executive Summary (300-400 words)
## 2. Product Overview (400-500 words)
## 3. Market Analysis (400-500 words)
## 4. Core Features - MVP (800-1000 words)
## 5. Advanced Features (500-600 words)
## 6. Monetization Strategy (500-600 words)
## 7. Technical Architecture (600-700 words)
## 8. User Experience Design (400-500 words)
## 9. Security & Compliance (300-400 words)
## 10. Development Roadmap (400-500 words)
## 11. Testing Strategy (300-400 words)
## 12. Launch Strategy (400-500 words)
## 13. Success Metrics & KPIs (300-400 words)
## 14. Risk Analysis & Mitigation (200-300 words)
## 15. Support & Documentation (200-300 words)
## 16. Future Vision (200-300 words)

CRITICAL: This document MUST be at least 3500 words. Each section must be detailed and comprehensive.

Read: ${specFile}
Save to: ${outputFile}`;

console.log('🧪 Testing new prompt structure...');
console.log(`📁 Output: ${outputFile}`);

const startTime = Date.now();

const claude = spawn('claude', [
  '--allowedTools', 'Read,Write',
  '--add-dir', projectDir,
  '--dangerously-skip-permissions'
], {
  stdio: ['pipe', 'inherit', 'inherit']
});

claude.stdin.write(prompt);
claude.stdin.end();

claude.on('close', (code) => {
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  
  if (fs.existsSync(outputFile)) {
    const content = fs.readFileSync(outputFile, 'utf-8');
    const wordCount = content.split(/\s+/).length;
    console.log(`\n✅ Generated ${wordCount} words in ${duration}s`);
    
    if (wordCount >= 3500) {
      console.log('✅ PASSED: Generated 3500+ words');
    } else {
      console.log(`❌ FAILED: Only ${wordCount} words (need 3500+)`);
    }
  } else {
    console.log(`\n❌ Failed to generate requirements`);
  }
});