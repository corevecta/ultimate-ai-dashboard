#\!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectDir = '/home/sali/ai/projects/projecthubv3/projects/cvp-api-service-city-service-reporter';
const outputDir = path.join(projectDir, 'ai-generated');
const outputFile = path.join(outputDir, 'requirements.md');

// Simple prompt
const prompt = `Read specification.yaml and create requirements.md with a comprehensive product requirements document.`;

console.log('Testing Claude invocation...');
const cmd = `claude --allowedTools Write,Read --add-dir "${outputDir}" --dangerously-skip-permissions -p "${prompt}"`;
console.log('Command:', cmd);

const startTime = Date.now();
exec(cmd, { timeout: 60000 }, (error, stdout, stderr) => {
  const duration = (Date.now() - startTime) / 1000;
  console.log(`\nCompleted in ${duration}s`);
  
  if (error) {
    console.log('Error:', error.message);
    console.log('Exit code:', error.code);
  }
  if (stdout) console.log('Stdout:', stdout.substring(0, 500));
  if (stderr) console.log('Stderr:', stderr);
  console.log('File exists?', fs.existsSync(outputFile));
  
  if (fs.existsSync(outputFile)) {
    const content = fs.readFileSync(outputFile, 'utf-8');
    console.log('Word count:', content.split(/\s+/).length);
  }
});
EOF < /dev/null
