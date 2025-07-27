#!/usr/bin/env node

const { exec } = require('child_process');
const path = require('path');

const projectDir = '/home/sali/ai/projects/projecthubv3/projects/cvp-api-service-city-service-reporter';
const outputDir = path.join(projectDir, 'ai-generated');

console.log('Testing Claude MCP.Filesystem...');

const prompt = `Read the file specification.yaml and write a new file called test-output.txt with the content "Hello from Claude"`;

const cmd = [
  'claude',
  '--allowedTools MCP.Filesystem',
  `--add-dir "${outputDir}"`,
  '--dangerously-skip-permissions',
  '--print',
  `"${prompt}"`
].join(' ');

console.log('Running:', cmd);

exec(cmd, { 
  maxBuffer: 10 * 1024 * 1024,
  timeout: 30000 
}, (error, stdout, stderr) => {
  console.log('Exit code:', error ? error.code : 0);
  if (stdout) console.log('STDOUT:', stdout);
  if (stderr) console.log('STDERR:', stderr);
  if (error) console.log('ERROR:', error.message);
});