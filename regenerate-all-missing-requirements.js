const fs = require('fs');
const path = require('path');

const PROJECTS_DIR = '/home/sali/ai/projects/projecthubv3/projects';

// Function to check if a project has specification but missing requirements
function findProjectsNeedingRequirements() {
  const projectsToRegenerate = [];
  
  const dirs = fs.readdirSync(PROJECTS_DIR);
  
  for (const dir of dirs) {
    const projectPath = path.join(PROJECTS_DIR, dir);
    
    if (fs.statSync(projectPath).isDirectory()) {
      // Check for specification.yaml in various locations
      const specPaths = [
        path.join(projectPath, 'specification.yaml'),
        path.join(projectPath, 'ai-generated', 'specification.yaml')
      ];
      
      const requirementsPaths = [
        path.join(projectPath, 'requirements.md'),
        path.join(projectPath, 'ai-generated', 'requirements.md')
      ];
      
      // Check if specification exists
      const hasSpecification = specPaths.some(p => fs.existsSync(p));
      
      // Check if requirements exist
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

// Function to trigger regeneration for a project
async function regenerateRequirements(projectId) {
  try {
    const response = await fetch(`http://localhost:3001/api/projects/${projectId}/regenerate-requirements`, {
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

// Function to check job status
async function checkJobStatus(jobId) {
  try {
    const response = await fetch(`http://localhost:3001/api/jobs/regenerate-requirements/${jobId}/status`);
    if (response.ok) {
      const data = await response.json();
      return data.status;
    }
  } catch (error) {
    return 'error';
  }
}

// Function to wait for job completion
async function waitForJobCompletion(jobId, maxWaitTime = 30000) {
  const startTime = Date.now();
  
  while (Date.now() - startTime < maxWaitTime) {
    const status = await checkJobStatus(jobId);
    
    if (status === 'completed' || status === 'failed') {
      return status;
    }
    
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  return 'timeout';
}

// Main function
async function regenerateAllMissingRequirements() {
  console.log('🔍 Scanning for projects with specification but missing requirements...\n');
  
  const projectsToRegenerate = findProjectsNeedingRequirements();
  
  if (projectsToRegenerate.length === 0) {
    console.log('✅ All projects with specifications already have requirements!');
    return;
  }
  
  console.log(`Found ${projectsToRegenerate.length} projects needing requirements:\n`);
  
  projectsToRegenerate.forEach((project, index) => {
    console.log(`${index + 1}. ${project.projectId}`);
  });
  
  console.log('\n🔧 Starting batch regeneration...\n');
  
  const results = {
    successful: [],
    failed: [],
    total: projectsToRegenerate.length
  };
  
  // Process in batches to avoid overwhelming the system
  const batchSize = 5;
  
  for (let i = 0; i < projectsToRegenerate.length; i += batchSize) {
    const batch = projectsToRegenerate.slice(i, i + batchSize);
    console.log(`\n📦 Processing batch ${Math.floor(i/batchSize) + 1} of ${Math.ceil(projectsToRegenerate.length/batchSize)}...\n`);
    
    // Start all jobs in the batch
    const batchJobs = await Promise.all(
      batch.map(async (project) => {
        console.log(`🚀 Starting regeneration for ${project.projectId}...`);
        const result = await regenerateRequirements(project.projectId);
        
        if (result.success) {
          console.log(`   ✅ Job started: ${result.jobId}`);
          return { ...project, jobId: result.jobId };
        } else {
          console.log(`   ❌ Failed to start: ${result.error}`);
          results.failed.push({ project: project.projectId, error: result.error });
          return null;
        }
      })
    );
    
    // Filter out failed jobs
    const validJobs = batchJobs.filter(job => job !== null);
    
    // Wait for batch completion
    if (validJobs.length > 0) {
      console.log(`\n⏳ Waiting for batch completion...\n`);
      
      await Promise.all(
        validJobs.map(async (job) => {
          const status = await waitForJobCompletion(job.jobId);
          
          if (status === 'completed') {
            console.log(`   ✅ ${job.projectId}: Completed`);
            results.successful.push(job.projectId);
          } else {
            console.log(`   ❌ ${job.projectId}: ${status}`);
            results.failed.push({ project: job.projectId, status });
          }
        })
      );
    }
    
    // Add delay between batches
    if (i + batchSize < projectsToRegenerate.length) {
      console.log('\n⏸️  Pausing before next batch...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  // Final report
  console.log('\n' + '='.repeat(60));
  console.log('📊 REGENERATION COMPLETE');
  console.log('='.repeat(60));
  console.log(`✅ Successful: ${results.successful.length} projects`);
  console.log(`❌ Failed: ${results.failed.length} projects`);
  console.log(`📁 Total processed: ${results.total} projects`);
  
  if (results.successful.length > 0) {
    console.log('\n✅ Successfully regenerated requirements for:');
    results.successful.forEach(project => {
      console.log(`   - ${project}`);
    });
  }
  
  if (results.failed.length > 0) {
    console.log('\n❌ Failed to regenerate requirements for:');
    results.failed.forEach(failure => {
      console.log(`   - ${failure.project}: ${failure.error || failure.status}`);
    });
  }
  
  // Verify results
  console.log('\n🔍 Verifying regenerated files...\n');
  
  let verifiedCount = 0;
  for (const projectId of results.successful) {
    const reqPaths = [
      path.join(PROJECTS_DIR, projectId, 'requirements.md'),
      path.join(PROJECTS_DIR, projectId, 'ai-generated', 'requirements.md')
    ];
    
    const exists = reqPaths.some(p => fs.existsSync(p));
    if (exists) {
      verifiedCount++;
    } else {
      console.log(`   ⚠️  Warning: ${projectId} still missing requirements file`);
    }
  }
  
  console.log(`\n✅ Verified ${verifiedCount} of ${results.successful.length} regenerated files exist`);
}

// Run the regeneration
regenerateAllMissingRequirements().catch(console.error);