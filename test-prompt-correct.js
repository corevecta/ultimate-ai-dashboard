#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Test project
const projectId = 'cvp-api-service-city-service-reporter';
const projectDir = `/home/sali/ai/projects/projecthubv3/projects/${projectId}`;
const outputFile = path.join(projectDir, 'ai-generated', 'requirements-test-3500.md');
const specFile = path.join(projectDir, 'ai-generated', 'specification.yaml');

// Simple direct prompt that should work
const prompt = `Read the specification YAML file and create comprehensive requirements.

CRITICAL REQUIREMENTS:
- The document MUST be at least 3500 words
- Include ALL standard sections for a requirements document
- Add detailed descriptions, user stories, technical details
- Include monetization strategy with specific pricing
- Add testing strategy, security requirements, launch plan
- Be specific and detailed - no generic content

Read the specification from: ${specFile}
Save the comprehensive requirements to: ${outputFile}

Start by reading the specification file.`;

console.log('🧪 Testing correct Claude invocation...');
console.log(`📁 Output: ${outputFile}`);

const startTime = Date.now();

const claude = spawn('claude', [
  '--allowedTools', 'Read,Write',
  '--add-dir', projectDir,
  '--dangerously-skip-permissions'
], {
  stdio: ['pipe', 'inherit', 'inherit']  // Using inherit for stdout/stderr like working version
});

claude.stdin.write(prompt);
claude.stdin.end();

claude.on('close', (code) => {
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  
  console.log(`\nClaude exited with code: ${code}`);
  
  if (fs.existsSync(outputFile)) {
    const content = fs.readFileSync(outputFile, 'utf-8');
    const wordCount = content.split(/\s+/).length;
    console.log(`✅ Generated ${wordCount} words in ${duration}s`);
    
    if (wordCount >= 3500) {
      console.log('✅ SUCCESS: Generated 3500+ words!');
    } else {
      console.log(`⚠️  Only ${wordCount} words (target: 3500+)`);
    }
  } else {
    console.log(`❌ No output file generated`);
  }
});