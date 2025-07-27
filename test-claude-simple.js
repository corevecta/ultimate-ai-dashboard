const { exec } = require('child_process');
const fs = require('fs');

const outputDir = '/home/sali/ai/projects/projecthubv3/projects/cvp-api-service-city-service-reporter/ai-generated';
const cmd = `claude --allowedTools Write,Read --add-dir "${outputDir}" --dangerously-skip-permissions -p "Read specification.yaml and create requirements.md"`;

console.log('Running:', cmd);
exec(cmd, { timeout: 60000 }, (err, stdout, stderr) => {
  console.log('Done!');
  if (err) console.log('Error:', err.message);
  if (stdout) console.log('Output:', stdout);
  if (stderr) console.log('Stderr:', stderr);
});