#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Configuration
const MAX_CONCURRENT = 6; // 6 parallel workers
const CLAUDE_TIMEOUT = 80 * 1000; // 80 seconds
const BATCH_SIZE = 18; // Process 18 at a time (3x workers for queue depth)

let activeWorkers = 0;
let processedCount = 0;
let failedCount = 0;
let successCount = 0;
const startTime = Date.now();

// Read all projects
function getAllProjects() {
  const projectsDir = '/home/sali/ai/projects/projecthubv3/projects';
  const projects = [];
  
  // Check if we're in test mode
  if (process.env.TEST_SINGLE_PROJECT) {
    const testProject = process.env.TEST_SINGLE_PROJECT;
    const specPath = path.join(projectsDir, testProject, 'ai-generated', 'specification.yaml');
    if (fs.existsSync(specPath)) {
      projects.push({
        id: testProject,
        dir: path.join(projectsDir, testProject),
        specPath
      });
      console.log(`🧪 TEST MODE: Only processing ${testProject}`);
    }
    return projects;
  }
  
  const entries = fs.readdirSync(projectsDir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const specPath = path.join(projectsDir, entry.name, 'ai-generated', 'specification.yaml');
      if (fs.existsSync(specPath)) {
        projects.push({
          id: entry.name,
          dir: path.join(projectsDir, entry.name),
          specPath
        });
      }
    }
  }
  
  return projects;
}

// Build requirements prompt
function buildRequirementsPrompt(spec, projectId) {
  const p = spec.project || {};
  const f = spec.features || {};
  const t = spec.technical || {};
  const b = spec.business || {};
  
  const featureDetails = (features) => {
    if (!features || !Array.isArray(features)) return '';
    return features.map((feature, idx) => {
      if (typeof feature === 'string') {
        return `  ${idx + 1}. ${feature}`;
      } else if (feature && typeof feature === 'object') {
        return `  ${idx + 1}. ${feature.name || feature.title || 'Feature'}${feature.description ? ': ' + feature.description : ''}`;
      }
      return '';
    }).filter(Boolean).join('\n');
  };

  const outputPath = path.join(spec.projectDir || projectId, 'ai-generated', 'requirements.md');
  
  return `Read the specification.yaml file and create a comprehensive requirements.md document for the "${p.name || projectId}" project.

The project is a ${p.type || 'application'} that ${p.description || 'provides various features'}.

Write the requirements document to: ${outputPath}

The document must include:
- Executive Summary
- Project Overview with business context
- Detailed Functional Requirements for all features (core, premium, enterprise)
- Non-Functional Requirements
- User Stories for each feature
- Technical Architecture
- Security Requirements
- API Specifications
- Database Schema
- UI/UX Requirements
- Testing Strategy
- Deployment Architecture

Base everything on the specification.yaml file content. Be specific to this project's features and business model.`;
}

// Process single project
async function processProject(project) {
  const { id, dir, specPath } = project;
  
  try {
    // Read specification
    const spec = yaml.load(fs.readFileSync(specPath, 'utf-8'));
    spec.projectDir = dir;
    
    // Build prompt
    const prompt = buildRequirementsPrompt(spec, id);
    
    // Create temp directory for MCP config
    const tempDir = `/tmp/claude-req-${id}-${Date.now()}`;
    fs.mkdirSync(tempDir, { recursive: true });
    
    // Create MCP config
    const mcpConfig = {
      mcpServers: {
        filesystem: {
          command: "npx",
          args: ["-y", "@modelcontextprotocol/server-filesystem", dir]
        }
      }
    };
    
    const configPath = path.join(tempDir, 'mcp-config.json');
    fs.writeFileSync(configPath, JSON.stringify(mcpConfig, null, 2));
    
    // Run Claude CLI
    const expectedFile = path.join(dir, 'ai-generated', 'requirements.md');
    const success = await runClaude(prompt, configPath, expectedFile, tempDir);
    
    // Cleanup
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (e) {
      // Ignore cleanup errors
    }
    
    if (success) {
      successCount++;
      console.log(`✅ [${processedCount}/${getAllProjects().length}] ${id} - Success`);
    } else {
      failedCount++;
      console.log(`❌ [${processedCount}/${getAllProjects().length}] ${id} - Failed`);
    }
    
  } catch (error) {
    failedCount++;
    console.error(`❌ [${processedCount}/${getAllProjects().length}] ${id} - Error: ${error.message}`);
  }
}

// Run Claude CLI
function runClaude(prompt, configPath, expectedFile, cwd) {
  return new Promise((resolve) => {
    const args = [
      '--mcp-config', configPath,
      '--continue',
      '--dangerously-skip-permissions'
    ];
    
    console.log(`   🚀 Starting Claude for: ${expectedFile}`);
    console.log(`   📝 Prompt length: ${prompt.length} chars`);
    console.log(`   📂 Working dir: ${cwd}`);
    console.log(`   🔧 Command: claude ${args.join(' ')}`);
    
    const proc = spawn('claude', args, {
      env: { ...process.env },
      cwd
    });
    
    let error = '';
    let output = '';
    let timedOut = false;
    const timeout = setTimeout(() => {
      timedOut = true;
      proc.kill('SIGTERM');
      console.error(`   ⏰ Timeout after ${CLAUDE_TIMEOUT/1000}s`);
    }, CLAUDE_TIMEOUT);
    
    let fileCreated = false;
    const checkInterval = setInterval(() => {
      if (fs.existsSync(expectedFile)) {
        fileCreated = true;
        clearInterval(checkInterval);
        setTimeout(() => {
          if (!timedOut) {
            clearTimeout(timeout);
            proc.kill('SIGTERM');
            console.log(`   ✅ File created, terminating Claude`);
          }
        }, 2000); // Give it 2 seconds to finish writing
      }
    }, 1000);
    
    proc.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    proc.stderr.on('data', (data) => {
      error += data.toString();
    });
    
    proc.on('close', (code) => {
      clearTimeout(timeout);
      clearInterval(checkInterval);
      if (!fileCreated) {
        console.error(`   ❌ Exit code: ${code}`);
        if (error) {
          console.error(`   ❌ Error: ${error.substring(0, 200)}`);
        }
        if (output) {
          console.log(`   📄 Output: ${output.substring(0, 200)}`);
        }
      }
      resolve(fileCreated);
    });
    
    // Send prompt
    proc.stdin.write(prompt);
    proc.stdin.end();
  });
}

// Process batch
async function processBatch(projects) {
  const promises = projects.map(async (project) => {
    while (activeWorkers >= MAX_CONCURRENT) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    activeWorkers++;
    processedCount++;
    
    try {
      await processProject(project);
    } finally {
      activeWorkers--;
    }
  });
  
  await Promise.all(promises);
}

// Main
async function main() {
  const projects = getAllProjects();
  console.log(`🚀 Starting requirements regeneration for ${projects.length} projects`);
  console.log(`⚙️  Configuration: ${MAX_CONCURRENT} workers, ${CLAUDE_TIMEOUT/1000}s timeout`);
  console.log('');
  
  // Process in batches
  for (let i = 0; i < projects.length; i += BATCH_SIZE) {
    const batch = projects.slice(i, i + BATCH_SIZE);
    await processBatch(batch);
    
    // Show progress
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const rate = processedCount / elapsed;
    const eta = Math.floor((projects.length - processedCount) / rate);
    
    console.log(`\n📊 Progress: ${processedCount}/${projects.length} (${Math.floor(processedCount/projects.length*100)}%)`);
    console.log(`   Success: ${successCount}, Failed: ${failedCount}`);
    console.log(`   Time: ${elapsed}s, Rate: ${rate.toFixed(2)}/s, ETA: ${eta}s\n`);
  }
  
  // Final summary
  const totalTime = Math.floor((Date.now() - startTime) / 1000);
  console.log('\n✨ Regeneration Complete!');
  console.log(`   Total: ${projects.length} projects`);
  console.log(`   Success: ${successCount} (${Math.floor(successCount/projects.length*100)}%)`);
  console.log(`   Failed: ${failedCount}`);
  console.log(`   Time: ${totalTime}s (${Math.floor(totalTime/60)}m ${totalTime%60}s)`);
  console.log(`   Rate: ${(projects.length/totalTime).toFixed(2)} projects/second`);
}

// Run
main().catch(console.error);