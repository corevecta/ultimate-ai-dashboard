const fs = require('fs');
const path = require('path');

const PROJECTS_DIR = '/home/sali/ai/projects/projecthubv3/projects';

// Function to find all requirements.md files with [object Object]
function findMalformedRequirements() {
  const malformedFiles = [];
  
  const dirs = fs.readdirSync(PROJECTS_DIR);
  
  for (const dir of dirs) {
    const projectPath = path.join(PROJECTS_DIR, dir);
    
    if (fs.statSync(projectPath).isDirectory()) {
      // Check main requirements.md
      const reqPath = path.join(projectPath, 'requirements.md');
      if (fs.existsSync(reqPath)) {
        const content = fs.readFileSync(reqPath, 'utf-8');
        if (content.includes('[object Object]')) {
          malformedFiles.push({
            projectId: dir,
            path: reqPath,
            type: 'main'
          });
        }
      }
      
      // Check ai-generated/requirements.md
      const aiGenReqPath = path.join(projectPath, 'ai-generated', 'requirements.md');
      if (fs.existsSync(aiGenReqPath)) {
        const content = fs.readFileSync(aiGenReqPath, 'utf-8');
        if (content.includes('[object Object]')) {
          malformedFiles.push({
            projectId: dir,
            path: aiGenReqPath,
            type: 'ai-generated'
          });
        }
      }
    }
  }
  
  return malformedFiles;
}

// Function to trigger regeneration for a project
async function regenerateRequirements(projectId) {
  try {
    const response = await fetch(`http://localhost:3001/api/projects/${projectId}/regenerate-requirements`, {
      method: 'POST'
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Started regeneration for ${projectId}, job ID: ${data.jobId}`);
      return data.jobId;
    } else {
      console.log(`❌ Failed to start regeneration for ${projectId}`);
      return null;
    }
  } catch (error) {
    console.error(`Error regenerating ${projectId}:`, error);
    return null;
  }
}

// Main function
async function fixAllMalformedRequirements() {
  console.log('🔍 Scanning for malformed requirements files...\n');
  
  const malformedFiles = findMalformedRequirements();
  
  if (malformedFiles.length === 0) {
    console.log('✅ No malformed requirements files found!');
    return;
  }
  
  console.log(`Found ${malformedFiles.length} malformed requirements files:\n`);
  
  // Group by project
  const projectsToFix = {};
  malformedFiles.forEach(file => {
    if (!projectsToFix[file.projectId]) {
      projectsToFix[file.projectId] = [];
    }
    projectsToFix[file.projectId].push(file);
  });
  
  // Show what we found
  Object.entries(projectsToFix).forEach(([projectId, files]) => {
    console.log(`📁 ${projectId}`);
    files.forEach(file => {
      console.log(`   - ${file.type}/requirements.md`);
    });
  });
  
  console.log('\n🔧 Starting regeneration process...\n');
  
  // First, delete the malformed files
  for (const [projectId, files] of Object.entries(projectsToFix)) {
    console.log(`Removing malformed files for ${projectId}...`);
    for (const file of files) {
      fs.unlinkSync(file.path);
      console.log(`   ✅ Deleted ${file.path}`);
    }
  }
  
  // Then trigger regeneration for each project
  const jobs = [];
  for (const projectId of Object.keys(projectsToFix)) {
    const jobId = await regenerateRequirements(projectId);
    if (jobId) {
      jobs.push({ projectId, jobId });
    }
    // Add delay to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log(`\n📊 Started ${jobs.length} regeneration jobs`);
  console.log('Monitor the jobs to ensure they complete successfully.');
  
  // Optionally, wait and check status
  if (jobs.length > 0) {
    console.log('\nWaiting 10 seconds before checking status...');
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    for (const job of jobs) {
      try {
        const statusRes = await fetch(`http://localhost:3001/api/jobs/regenerate-requirements/${job.jobId}/status`);
        if (statusRes.ok) {
          const status = await statusRes.json();
          console.log(`${job.projectId}: ${status.status}`);
        }
      } catch (error) {
        console.error(`Error checking status for ${job.projectId}:`, error);
      }
    }
  }
}

// Run the fix
fixAllMalformedRequirements().catch(console.error);