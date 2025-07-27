#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { spawn } = require('child_process');

const PROJECT_DIR = '/home/sali/ai/projects/projecthubv3/projects/cvp-api-service-city-service-reporter';
const OUTPUT_DIR = path.join(PROJECT_DIR, 'ai-generated');

// Very simple prompt
const SIMPLE_PROMPT = `Read the specification.yaml file in ai-generated/ directory and write a simple requirements.md file with at least 100 words describing what this project does.`;

async function testClaude() {
  console.log('🧪 Testing Claude CLI with simple prompt...');
  
  // Ensure output directory exists
  fs.ensureDirSync(OUTPUT_DIR);
  
  // Create prompt file
  const promptFile = path.join(PROJECT_DIR, '.test-prompt.txt');
  fs.writeFileSync(promptFile, SIMPLE_PROMPT);
  
  console.log('📁 Working directory:', PROJECT_DIR);
  console.log('📄 Prompt file:', promptFile);
  console.log('🚀 Running Claude...\n');
  
  const claude = spawn('claude', [
    '--allowedTools', 'MCP.Filesystem',
    '--add-dir', OUTPUT_DIR,
    '--dangerously-skip-permissions',
    '-p'
  ], {
    cwd: PROJECT_DIR,
    stdio: ['pipe', 'inherit', 'inherit']
  });
  
  // Send prompt
  const promptStream = fs.createReadStream(promptFile);
  promptStream.pipe(claude.stdin);
  
  claude.on('close', (code) => {
    console.log(`\nClaude exited with code: ${code}`);
    
    // Cleanup
    try {
      fs.unlinkSync(promptFile);
    } catch (e) {}
    
    // Check if file was created
    const outputFile = path.join(OUTPUT_DIR, 'requirements.md');
    if (fs.existsSync(outputFile)) {
      const content = fs.readFileSync(outputFile, 'utf-8');
      console.log('✅ File created! Word count:', content.split(/\s+/).length);
    } else {
      console.log('❌ No output file created');
    }
  });
  
  // Short timeout
  setTimeout(() => {
    console.log('⏰ Killing after 30 seconds...');
    claude.kill();
  }, 30000);
}

testClaude().catch(console.error);