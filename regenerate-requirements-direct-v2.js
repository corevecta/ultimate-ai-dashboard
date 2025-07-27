#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Configuration
const MAX_CONCURRENT = 6;
const CLAUDE_TIMEOUT = 80 * 1000;
const BATCH_SIZE = 18;

let processedCount = 0;
let failedCount = 0;
let successCount = 0;
const startTime = Date.now();

// Worker pool
const workerPool = [];
for (let i = 0; i < MAX_CONCURRENT; i++) {
  workerPool.push({ id: i, busy: false });
}

// Get all projects
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

// Process single project
async function processProject(project, worker) {
  const { id, dir, specPath } = project;
  
  try {
    // Read specification
    const spec = yaml.load(fs.readFileSync(specPath, 'utf-8'));
    const p = spec.project || {};
    
    // Create temp directory
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
    
    // Create prompt file
    const outputPath = path.join(dir, 'ai-generated', 'requirements.md');
    const promptContent = `Read the specification.yaml file and create a comprehensive requirements.md document for the "${p.name || id}" project.

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

    const promptPath = path.join(tempDir, 'prompt.txt');
    fs.writeFileSync(promptPath, promptContent);
    
    console.log(`[Worker ${worker.id}] Processing ${id}...`);
    
    // Run Claude with prompt file
    const command = `claude --mcp-config "${configPath}" --continue --dangerously-skip-permissions < "${promptPath}"`;
    
    try {
      execSync(command, {
        cwd: tempDir,
        timeout: CLAUDE_TIMEOUT,
        stdio: 'pipe',
        maxBuffer: 10 * 1024 * 1024 // 10MB buffer
      });
      
      // Check if file was created
      if (fs.existsSync(outputPath)) {
        successCount++;
        console.log(`✅ [${processedCount}/${getAllProjects().length}] ${id} - Success`);
        
        // Cleanup
        fs.rmSync(tempDir, { recursive: true, force: true });
        return true;
      } else {
        throw new Error('File not created');
      }
      
    } catch (error) {
      failedCount++;
      console.error(`❌ [${processedCount}/${getAllProjects().length}] ${id} - Failed: ${error.message}`);
      
      // Cleanup
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
      } catch (e) {}
      
      return false;
    }
    
  } catch (error) {
    failedCount++;
    console.error(`❌ [${processedCount}/${getAllProjects().length}] ${id} - Error: ${error.message}`);
    return false;
  }
}

// Get available worker
function getAvailableWorker() {
  return workerPool.find(w => !w.busy) || null;
}

// Process all projects
async function main() {
  const projects = getAllProjects();
  console.log(`🚀 Starting requirements regeneration for ${projects.length} projects`);
  console.log(`⚙️  Configuration: ${MAX_CONCURRENT} workers, ${CLAUDE_TIMEOUT/1000}s timeout`);
  console.log('');
  
  // Process queue
  let projectIndex = 0;
  
  while (projectIndex < projects.length || workerPool.some(w => w.busy)) {
    // Assign projects to available workers
    while (projectIndex < projects.length) {
      const worker = getAvailableWorker();
      if (!worker) break;
      
      const project = projects[projectIndex++];
      processedCount++;
      worker.busy = true;
      
      // Process in background
      processProject(project, worker).finally(() => {
        worker.busy = false;
      });
    }
    
    // Wait a bit before checking again
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Show progress periodically
    if (processedCount % 10 === 0 && processedCount > 0) {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const rate = successCount / elapsed;
      const eta = rate > 0 ? Math.floor((projects.length - processedCount) / rate) : 0;
      
      console.log(`\n📊 Progress: ${processedCount}/${projects.length} (${Math.floor(processedCount/projects.length*100)}%)`);
      console.log(`   Success: ${successCount}, Failed: ${failedCount}`);
      console.log(`   Time: ${elapsed}s, Rate: ${rate.toFixed(2)}/s, ETA: ${eta}s\n`);
    }
  }
  
  // Final summary
  const totalTime = Math.floor((Date.now() - startTime) / 1000);
  console.log('\n✨ Regeneration Complete!');
  console.log(`   Total: ${projects.length} projects`);
  console.log(`   Success: ${successCount} (${Math.floor(successCount/projects.length*100)}%)`);
  console.log(`   Failed: ${failedCount}`);
  console.log(`   Time: ${totalTime}s (${Math.floor(totalTime/60)}m ${totalTime%60}s)`);
  console.log(`   Rate: ${(successCount/totalTime).toFixed(2)} projects/second`);
}

// Run
main().catch(console.error);