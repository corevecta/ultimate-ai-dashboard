const fs = require('fs');
const path = require('path');

// Test single project requirements generation
async function testSingleProject() {
  const projectId = 'cvp-web-app-3d-photo-converter';
  console.log(`\n🧪 Testing requirements generation for: ${projectId}\n`);
  
  // Check if server is running
  try {
    const healthCheck = await fetch('http://localhost:3001/api/health');
    if (!healthCheck.ok) {
      console.error('❌ Server not running or not healthy');
      console.log('Please start the server with: USE_PARALLEL_JOBS=true pnpm dev');
      return;
    }
  } catch (error) {
    console.error('❌ Cannot connect to server at http://localhost:3001');
    console.log('Please start the server with: USE_PARALLEL_JOBS=true pnpm dev');
    return;
  }
  
  console.log('✅ Server is running');
  
  // Submit job
  console.log('\n📤 Submitting requirements generation job...');
  
  try {
    const response = await fetch(`http://localhost:3001/api/projects/${projectId}/regenerate-requirements`, {
      method: 'POST'
    });
    
    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Failed to submit job:', error);
      return;
    }
    
    const data = await response.json();
    console.log(`✅ Job submitted: ${data.jobId}`);
    
    // Monitor job status
    console.log('\n⏳ Monitoring job status...');
    const startTime = Date.now();
    const maxWaitTime = 90000; // 90 seconds
    
    while (Date.now() - startTime < maxWaitTime) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
      
      try {
        const statusResponse = await fetch(`http://localhost:3001/api/jobs/status/${data.jobId}`);
        if (statusResponse.ok) {
          const status = await statusResponse.json();
          
          console.log(`   Status: ${status.status} (${Math.floor((Date.now() - startTime) / 1000)}s)`);
          
          if (status.status === 'completed') {
            console.log('✅ Job completed successfully!');
            
            // Check if file was created
            const possiblePaths = [
              `/home/sali/ai/projects/projecthubv3/projects/${projectId}/requirements.md`,
              `/home/sali/ai/projects/projecthubv3/projects/${projectId}/ai-generated/requirements.md`,
            ];
            
            console.log('\n🔍 Checking for generated file...');
            for (const filePath of possiblePaths) {
              if (fs.existsSync(filePath)) {
                const content = fs.readFileSync(filePath, 'utf-8');
                console.log(`\n✅ Found requirements at: ${filePath}`);
                console.log(`   File size: ${content.length} characters`);
                console.log(`   First 500 chars:\n${content.substring(0, 500)}...`);
                return;
              }
            }
            
            console.log('❌ Job completed but no file found');
            return;
            
          } else if (status.status === 'failed') {
            console.error(`❌ Job failed: ${status.error}`);
            
            // Check job directory for more details
            const jobDir = `/home/sali/ai/projects/projecthubv3/jobs/regenerate-requirements/${data.jobId}`;
            if (fs.existsSync(jobDir)) {
              console.log('\n📁 Job directory contents:');
              const files = fs.readdirSync(jobDir);
              for (const file of files) {
                console.log(`   - ${file}`);
                if (file.endsWith('.json') || file.endsWith('.txt')) {
                  const content = fs.readFileSync(path.join(jobDir, file), 'utf-8');
                  console.log(`     Content: ${content.substring(0, 200)}...`);
                }
              }
            }
            return;
          }
        }
      } catch (error) {
        console.error('   Error checking status:', error.message);
      }
    }
    
    console.log('❌ Timeout waiting for job completion');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run test
testSingleProject().catch(console.error);