#!/usr/bin/env node

/**
 * Batch Requirements Regeneration - Final Working Version
 * Processes all projects with specifications using the working Claude CLI approach
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PROJECTS_DIR = '/home/sali/ai/projects/projecthubv3/projects';
const MAX_CONCURRENT = 3; // Reduced to avoid rate limiting
const DELAY_BETWEEN_PROJECTS = 10000; // 10 seconds between projects

// Get all projects with specifications
function getAllProjects() {
  const projects = [];
  const entries = fs.readdirSync(PROJECTS_DIR);
  
  for (const entry of entries) {
    const projectDir = path.join(PROJECTS_DIR, entry);
    const specFile = path.join(projectDir, 'ai-generated', 'specification.yaml');
    
    if (fs.existsSync(specFile)) {
      projects.push({
        id: entry,
        dir: projectDir,
        specFile
      });
    }
  }
  
  return projects;
}

// Process single project
async function processProject(project) {
  return new Promise((resolve) => {
    const { id, dir } = project;
    const outputDir = path.join(dir, 'ai-generated');
    const outputFile = path.join(outputDir, 'requirements.md');
    
    console.log(`\n🚀 Processing ${id}...`);
    
    // Run the working script
    const proc = spawn('node', [
      path.join(__dirname, 'regenerate-requirements-final-working.js'),
      id
    ], {
      stdio: 'inherit'
    });
    
    proc.on('close', (code) => {
      if (code === 0 && fs.existsSync(outputFile)) {
        console.log(`✅ ${id} - Success`);
        resolve(true);
      } else {
        console.log(`❌ ${id} - Failed`);
        resolve(false);
      }
    });
  });
}

// Process batch with concurrency control
async function processBatch(projects) {
  const results = { success: 0, failed: 0 };
  
  // Process in chunks
  for (let i = 0; i < projects.length; i += MAX_CONCURRENT) {
    const chunk = projects.slice(i, i + MAX_CONCURRENT);
    
    console.log(`\n📦 Processing batch ${Math.floor(i/MAX_CONCURRENT) + 1}/${Math.ceil(projects.length/MAX_CONCURRENT)}`);
    
    // Process chunk in parallel
    const promises = chunk.map(project => processProject(project));
    const chunkResults = await Promise.all(promises);
    
    // Count results
    chunkResults.forEach(success => {
      if (success) results.success++;
      else results.failed++;
    });
    
    // Progress update
    const processed = i + chunk.length;
    const percent = Math.floor((processed / projects.length) * 100);
    console.log(`\n📊 Progress: ${processed}/${projects.length} (${percent}%)`);
    console.log(`   Success: ${results.success}, Failed: ${results.failed}`);
    
    // Delay before next batch (except for last batch)
    if (i + MAX_CONCURRENT < projects.length) {
      console.log(`⏳ Waiting ${DELAY_BETWEEN_PROJECTS/1000}s before next batch...`);
      await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_PROJECTS));
    }
  }
  
  return results;
}

// Main
async function main() {
  console.log('🔍 Finding projects with specifications...');
  const projects = getAllProjects();
  
  console.log(`📋 Found ${projects.length} projects to process`);
  console.log(`⚙️  Configuration: ${MAX_CONCURRENT} concurrent, ${DELAY_BETWEEN_PROJECTS/1000}s delay`);
  
  if (process.argv[2] === '--test') {
    // Test mode - only process first 5
    console.log('\n🧪 TEST MODE: Processing first 5 projects only');
    projects.splice(5);
  }
  
  const startTime = Date.now();
  const results = await processBatch(projects);
  const duration = Math.floor((Date.now() - startTime) / 1000);
  
  console.log('\n✨ Batch regeneration complete!');
  console.log(`   Total: ${projects.length} projects`);
  console.log(`   Success: ${results.success} (${Math.floor(results.success/projects.length*100)}%)`);
  console.log(`   Failed: ${results.failed}`);
  console.log(`   Time: ${duration}s (${Math.floor(duration/60)}m ${duration%60}s)`);
  console.log(`   Rate: ${(projects.length/duration).toFixed(2)} projects/second`);
}

// Run
if (require.main === module) {
  main().catch(console.error);
}