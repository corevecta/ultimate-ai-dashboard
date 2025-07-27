const fs = require('fs');
const path = require('path');

const PROJECTS_DIR = '/home/sali/ai/projects/projecthubv3/projects';
const API_BASE = 'http://localhost:3001/api';

// Configuration
const BATCH_SIZE = 18; // Process 18 at a time (3x our 6 workers for queue depth)
const BATCH_DELAY = 3000; // 3 seconds between batches
const JOB_CHECK_INTERVAL = 2000; // Check job status every 2 seconds
const MAX_WAIT_TIME = 90000; // 90 seconds max wait per job (80s timeout + 10s buffer)
const PARALLEL_WORKERS = 6; // We have 6 parallel Claude workers

// Track statistics
const stats = {
  total: 0,
  submitted: 0,
  completed: 0,
  failed: 0,
  skipped: 0,
  startTime: Date.now()
};

// Find projects needing requirements
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
          projectPath
        });
      }
    }
  }
  
  return projectsToRegenerate;
}

// Submit regeneration job
async function submitRegenerationJob(projectId) {
  try {
    const response = await fetch(`${API_BASE}/projects/${projectId}/regenerate-requirements`, {
      method: 'POST'
    });
    
    if (response.ok) {
      const data = await response.json();
      return { success: true, jobId: data.jobId };
    } else {
      const error = await response.text();
      return { success: false, error };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Check job status
async function checkJobStatus(jobId) {
  try {
    const response = await fetch(`${API_BASE}/jobs/status/${jobId}`);
    if (response.ok) {
      const data = await response.json();
      return data;
    }
    return { status: 'unknown' };
  } catch (error) {
    return { status: 'error', error: error.message };
  }
}

// Wait for job completion
async function waitForJobCompletion(jobId, projectId) {
  const startTime = Date.now();
  
  while (Date.now() - startTime < MAX_WAIT_TIME) {
    const status = await checkJobStatus(jobId);
    
    if (status.status === 'completed') {
      return { success: true };
    } else if (status.status === 'failed') {
      return { success: false, error: status.error || 'Job failed' };
    }
    
    // Wait before checking again
    await new Promise(resolve => setTimeout(resolve, JOB_CHECK_INTERVAL));
  }
  
  return { success: false, error: 'Timeout waiting for completion' };
}

// Process a batch of projects
async function processBatch(projects) {
  const batchResults = [];
  
  // Submit all jobs in parallel
  console.log(`\n📤 Submitting ${projects.length} jobs...`);
  const submissions = await Promise.all(
    projects.map(async (project) => {
      const result = await submitRegenerationJob(project.projectId);
      
      if (result.success) {
        stats.submitted++;
        console.log(`  ✅ ${project.projectId}: Job ${result.jobId} submitted`);
        return { ...project, jobId: result.jobId, submitted: true };
      } else {
        stats.failed++;
        console.log(`  ❌ ${project.projectId}: Failed to submit - ${result.error}`);
        return { ...project, submitted: false, error: result.error };
      }
    })
  );
  
  // Wait for successful submissions to complete
  const successfulSubmissions = submissions.filter(s => s.submitted);
  
  if (successfulSubmissions.length > 0) {
    console.log(`\n⏳ Waiting for ${successfulSubmissions.length} jobs to complete...`);
    
    const completions = await Promise.all(
      successfulSubmissions.map(async (submission) => {
        const result = await waitForJobCompletion(submission.jobId, submission.projectId);
        
        if (result.success) {
          stats.completed++;
          console.log(`  ✅ ${submission.projectId}: Completed`);
        } else {
          stats.failed++;
          console.log(`  ❌ ${submission.projectId}: ${result.error}`);
        }
        
        return { ...submission, ...result };
      })
    );
    
    batchResults.push(...completions);
  }
  
  return batchResults;
}

// Main function
async function regenerateAllRequirements() {
  console.log('🚀 CLAUDE-POWERED REQUIREMENTS REGENERATION');
  console.log('==========================================\n');
  
  const projectsToRegenerate = findProjectsNeedingRequirements();
  stats.total = projectsToRegenerate.length;
  
  if (projectsToRegenerate.length === 0) {
    console.log('✅ All projects with specifications already have requirements!');
    return;
  }
  
  console.log(`📊 Found ${projectsToRegenerate.length} projects needing requirements`);
  console.log(`⚙️  Processing in batches of ${BATCH_SIZE}\n`);
  
  // Process in batches
  for (let i = 0; i < projectsToRegenerate.length; i += BATCH_SIZE) {
    const batch = projectsToRegenerate.slice(i, i + BATCH_SIZE);
    const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(projectsToRegenerate.length / BATCH_SIZE);
    
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📦 BATCH ${batchNumber}/${totalBatches}`);
    console.log(`${'='.repeat(60)}`);
    
    await processBatch(batch);
    
    // Progress update
    const processed = Math.min(i + BATCH_SIZE, projectsToRegenerate.length);
    const percentage = ((processed / projectsToRegenerate.length) * 100).toFixed(1);
    const elapsed = ((Date.now() - stats.startTime) / 1000 / 60).toFixed(1);
    
    console.log(`\n📈 PROGRESS: ${processed}/${projectsToRegenerate.length} (${percentage}%)`);
    console.log(`⏱️  Elapsed: ${elapsed} minutes`);
    console.log(`📊 Stats: ${stats.completed} completed, ${stats.failed} failed`);
    
    // Add delay between batches
    if (i + BATCH_SIZE < projectsToRegenerate.length) {
      console.log(`\n⏸️  Pausing ${BATCH_DELAY/1000} seconds before next batch...`);
      await new Promise(resolve => setTimeout(resolve, BATCH_DELAY));
    }
  }
  
  // Final summary
  const totalElapsed = ((Date.now() - stats.startTime) / 1000 / 60).toFixed(1);
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 REGENERATION COMPLETE');
  console.log('='.repeat(60));
  console.log(`✅ Successfully completed: ${stats.completed} projects`);
  console.log(`❌ Failed: ${stats.failed} projects`);
  console.log(`📤 Total submitted: ${stats.submitted} jobs`);
  console.log(`⏱️  Total time: ${totalElapsed} minutes`);
  console.log(`📁 Total projects processed: ${stats.total}`);
  
  // Verify generated files
  console.log('\n🔍 Verifying generated files...');
  let verifiedCount = 0;
  
  for (const project of projectsToRegenerate.slice(0, 20)) { // Check first 20
    const reqPaths = [
      path.join(project.projectPath, 'requirements.md'),
      path.join(project.projectPath, 'ai-generated', 'requirements.md')
    ];
    
    if (reqPaths.some(p => fs.existsSync(p))) {
      verifiedCount++;
    }
  }
  
  console.log(`✅ Verified ${verifiedCount}/20 sample files exist`);
  console.log('\n✨ All done! Requirements are being generated by Claude.');
}

// Run the regeneration
regenerateAllRequirements().catch(console.error);