const fs = require('fs');
const path = require('path');

const PROJECTS_DIR = '/home/sali/ai/projects/projecthubv3/projects';

// Configuration
const BATCH_SIZE = 20; // Increased batch size for faster processing
const MAX_CONCURRENT = 10; // Maximum concurrent regenerations
const PAUSE_BETWEEN_BATCHES = 1000; // Reduced pause time

// Function to check if a project has specification but missing requirements
function findProjectsNeedingRequirements() {
  const projectsToRegenerate = [];
  const dirs = fs.readdirSync(PROJECTS_DIR);
  
  for (const dir of dirs) {
    const projectPath = path.join(PROJECTS_DIR, dir);
    
    if (fs.statSync(projectPath).isDirectory()) {
      const specPaths = [
        path.join(projectPath, 'specification.yaml'),
        path.join(projectPath, 'ai-generated', 'specification.yaml')
      ];
      
      const requirementsPaths = [
        path.join(projectPath, 'requirements.md'),
        path.join(projectPath, 'ai-generated', 'requirements.md')
      ];
      
      const hasSpecification = specPaths.some(p => fs.existsSync(p));
      const hasRequirements = requirementsPaths.some(p => fs.existsSync(p));
      
      if (hasSpecification && !hasRequirements) {
        projectsToRegenerate.push({
          projectId: dir,
          projectPath,
          hasSpec: true,
          hasReq: false
        });
      }
    }
  }
  
  return projectsToRegenerate;
}

// Simple regeneration function
async function regenerateRequirements(projectId) {
  try {
    const response = await fetch(`http://localhost:3001/api/projects/${projectId}/regenerate-requirements`, {
      method: 'POST'
    });
    
    if (response.ok) {
      const data = await response.json();
      return { success: true, jobId: data.jobId, projectId };
    } else {
      return { success: false, projectId, error: 'API error' };
    }
  } catch (error) {
    return { success: false, projectId, error: error.message };
  }
}

// Process projects in parallel batches
async function processBatch(projects, batchNumber, totalBatches) {
  console.log(`\n📦 Batch ${batchNumber}/${totalBatches} - Processing ${projects.length} projects...`);
  
  // Start all regenerations in parallel
  const results = await Promise.all(
    projects.map(project => regenerateRequirements(project.projectId))
  );
  
  // Count successes and failures
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`   ✅ Started: ${successful} | ❌ Failed: ${failed}`);
  
  // Log failures
  results.filter(r => !r.success).forEach(r => {
    console.log(`   ❌ ${r.projectId}: ${r.error}`);
  });
  
  return { successful, failed };
}

// Main function
async function regenerateAllFast() {
  const startTime = Date.now();
  console.log('🚀 FAST BATCH REQUIREMENTS REGENERATION');
  console.log('=====================================\n');
  
  const projectsToRegenerate = findProjectsNeedingRequirements();
  
  if (projectsToRegenerate.length === 0) {
    console.log('✅ All projects with specifications already have requirements!');
    return;
  }
  
  console.log(`📊 Found ${projectsToRegenerate.length} projects needing requirements`);
  console.log(`⚙️  Batch size: ${BATCH_SIZE} projects`);
  console.log(`🔄 Total batches: ${Math.ceil(projectsToRegenerate.length / BATCH_SIZE)}\n`);
  
  let totalSuccessful = 0;
  let totalFailed = 0;
  
  // Process in batches
  for (let i = 0; i < projectsToRegenerate.length; i += BATCH_SIZE) {
    const batch = projectsToRegenerate.slice(i, i + BATCH_SIZE);
    const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(projectsToRegenerate.length / BATCH_SIZE);
    
    const result = await processBatch(batch, batchNumber, totalBatches);
    totalSuccessful += result.successful;
    totalFailed += result.failed;
    
    // Progress update
    const processed = Math.min(i + BATCH_SIZE, projectsToRegenerate.length);
    const percentage = ((processed / projectsToRegenerate.length) * 100).toFixed(1);
    console.log(`   📈 Progress: ${processed}/${projectsToRegenerate.length} (${percentage}%)`);
    
    // Pause between batches if not the last one
    if (i + BATCH_SIZE < projectsToRegenerate.length) {
      await new Promise(resolve => setTimeout(resolve, PAUSE_BETWEEN_BATCHES));
    }
  }
  
  // Final summary
  const elapsedTime = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 REGENERATION COMPLETE');
  console.log('='.repeat(60));
  console.log(`✅ Successfully started: ${totalSuccessful} regenerations`);
  console.log(`❌ Failed to start: ${totalFailed} regenerations`);
  console.log(`⏱️  Total time: ${elapsedTime} minutes`);
  console.log(`📁 Total projects processed: ${projectsToRegenerate.length}`);
  
  // Note about completion
  console.log('\n⚠️  Note: Jobs are running asynchronously in the background.');
  console.log('Requirements files will be generated over the next few minutes.');
  
  // Quick verification after a delay
  console.log('\n⏳ Waiting 30 seconds before verification...');
  await new Promise(resolve => setTimeout(resolve, 30000));
  
  console.log('\n🔍 Quick verification of generated files...');
  let verifiedCount = 0;
  const sampleSize = Math.min(20, projectsToRegenerate.length);
  
  for (let i = 0; i < sampleSize; i++) {
    const project = projectsToRegenerate[i];
    const reqPaths = [
      path.join(PROJECTS_DIR, project.projectId, 'requirements.md'),
      path.join(PROJECTS_DIR, project.projectId, 'ai-generated', 'requirements.md')
    ];
    
    const exists = reqPaths.some(p => fs.existsSync(p));
    if (exists) {
      verifiedCount++;
    }
  }
  
  console.log(`✅ Verified ${verifiedCount}/${sampleSize} sample files were created`);
  console.log('\n✨ Regeneration process completed!');
}

// Run the fast regeneration
regenerateAllFast().catch(console.error);