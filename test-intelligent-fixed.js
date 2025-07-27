#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Test project
const projectId = 'cvp-api-service-city-service-reporter';
const projectDir = `/home/sali/ai/projects/projecthubv3/projects/${projectId}`;
const outputFile = path.join(projectDir, 'ai-generated', 'requirements-test-fixed.md');

// Simple test prompt
const prompt = `Read the specification YAML and create comprehensive requirements.

REQUIREMENTS:
- Minimum 3500 words
- Include all standard sections
- Fix any issues in the specification

Read: ${path.join(projectDir, 'ai-generated', 'specification.yaml')}
Write to: ${outputFile}`;

// Write to temp file
const promptFile = path.join(projectDir, '.test-prompt.txt');
fs.writeFileSync(promptFile, prompt);

console.log('Testing fixed Claude invocation...');

const claude = spawn('claude', [
  '--allowedTools', 'Read,Write',
  '--add-dir', projectDir,
  '--dangerously-skip-permissions',
  '-p'
], {
  stdio: ['pipe', 'inherit', 'inherit']
});

// Pipe from file
const stream = fs.createReadStream(promptFile);
stream.pipe(claude.stdin);

claude.on('close', (code) => {
  // Cleanup
  try {
    fs.unlinkSync(promptFile);
  } catch (e) {}
  
  console.log(`\nExit code: ${code}`);
  
  if (fs.existsSync(outputFile)) {
    const content = fs.readFileSync(outputFile, 'utf-8');
    const wordCount = content.split(/\s+/).length;
    console.log(`✅ Generated ${wordCount} words`);
  } else {
    console.log('❌ No output file generated');
  }
});