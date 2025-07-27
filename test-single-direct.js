#!/usr/bin/env node

const { spawn } = require('child_process');

// Run the regeneration script with modified environment
const proc = spawn('node', ['regenerate-requirements-direct.js'], {
  env: {
    ...process.env,
    TEST_SINGLE_PROJECT: 'cvp-web-app-3d-photo-converter'
  }
});

proc.stdout.on('data', (data) => process.stdout.write(data));
proc.stderr.on('data', (data) => process.stderr.write(data));
proc.on('close', (code) => {
  console.log(`\nTest completed with exit code: ${code}`);
  process.exit(code);
});