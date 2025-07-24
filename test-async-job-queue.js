const { exec } = require('child_process');

console.log('Testing async job queue for Claude CLI...\n');

const testData = {
  name: 'AI Task Manager',
  type: 'web-app',
  description: 'An intelligent task management system that uses AI to automatically categorize, prioritize, and suggest task completion strategies based on user patterns and deadlines.',
  targetAudience: 'businesses',
  industry: 'Technology',
  geography: ['global'],
  budget: 'medium',
  timeline: '3months',
  monetization: 'subscription',
  priorities: ['ux', 'performance', 'scalability']
};

// Start the job
console.log('Starting requirements generation job...');
fetch('http://localhost:3001/api/orchestrator/step0', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(testData)
})
.then(res => res.json())
.then(data => {
  console.log('Job started:', data);
  
  if (data.jobId) {
    console.log('\nPolling for job status...');
    const pollJob = () => {
      fetch(`http://localhost:3001/api/orchestrator/step0?jobId=${data.jobId}`)
        .then(res => res.json())
        .then(jobData => {
          console.log(`Status: ${jobData.status}`);
          
          if (jobData.status === 'completed') {
            console.log('\n✅ Job completed successfully!');
            console.log('Requirements length:', jobData.requirements?.length || 0);
            console.log('Validation:', jobData.validation);
            console.log('\nFirst 500 chars of requirements:');
            console.log(jobData.requirements?.substring(0, 500) + '...');
            process.exit(0);
          } else if (jobData.status === 'failed') {
            console.log('\n❌ Job failed:', jobData.error);
            process.exit(1);
          } else {
            // Continue polling
            setTimeout(pollJob, 2000);
          }
        })
        .catch(err => {
          console.error('Polling error:', err);
          process.exit(1);
        });
    };
    
    // Start polling after 1 second
    setTimeout(pollJob, 1000);
  } else {
    console.log('No job ID returned - may be using fallback mode');
    if (data.requirements) {
      console.log('Got direct requirements:', data.requirements.substring(0, 200) + '...');
    }
  }
})
.catch(err => {
  console.error('Error starting job:', err);
  process.exit(1);
});