// Simple test to verify async job queue is working end-to-end

const testData = {
  name: 'E-Commerce Platform',
  type: 'e-commerce',
  description: 'A modern e-commerce platform with AI-powered recommendations, real-time inventory management, and seamless checkout experience',
  targetAudience: 'consumers',
  industry: 'Retail',
  geography: ['global'],
  budget: 'medium',
  timeline: '6months',
  monetization: 'marketplace',
  priorities: ['ux', 'scalability']
};

console.log('🚀 Testing async job queue API end-to-end...\n');

// Step 1: Create a job
console.log('1️⃣ Creating job...');
fetch('http://localhost:3000/api/orchestrator/step0', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(testData)
})
.then(res => res.json())
.then(data => {
  console.log('✅ Job created:', {
    jobId: data.jobId,
    message: data.message
  });
  
  if (!data.jobId) {
    throw new Error('No job ID returned');
  }
  
  // Step 2: Poll for results
  console.log('\n2️⃣ Polling for results...');
  let pollCount = 0;
  
  const pollJob = () => {
    pollCount++;
    
    fetch(`http://localhost:3000/api/orchestrator/step0?jobId=${data.jobId}`)
      .then(res => res.json())
      .then(jobData => {
        console.log(`Poll #${pollCount}: ${jobData.status}`);
        
        if (jobData.status === 'completed') {
          console.log('\n✅ Job completed successfully!');
          console.log('📋 Validation:', {
            isValid: jobData.validation?.isValid,
            coverage: `${jobData.validation?.coverage}%`,
            warnings: jobData.validation?.warnings?.length || 0
          });
          console.log('\n📄 Requirements preview:');
          console.log(jobData.requirements.substring(0, 300) + '...');
          console.log(`\n📏 Total length: ${jobData.requirements.length} characters`);
          console.log('⏱️ Response time:', jobData.metadata?.responseTime, 'ms');
          
          console.log('\n✅ End-to-end test PASSED! The async job queue is working correctly.');
          process.exit(0);
        } else if (jobData.status === 'failed') {
          console.error('\n❌ Job failed:', jobData.error);
          process.exit(1);
        } else {
          // Continue polling
          setTimeout(pollJob, 2000);
        }
      })
      .catch(err => {
        console.error('❌ Polling error:', err);
        process.exit(1);
      });
  };
  
  // Start polling after 1 second
  setTimeout(pollJob, 1000);
})
.catch(err => {
  console.error('❌ Error creating job:', err);
  process.exit(1);
});