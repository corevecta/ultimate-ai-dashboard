const fetch = require('node-fetch');

async function testRegenerateRequirements() {
  console.log('Testing requirements regeneration API...');
  
  // First, check if the project exists and has specification
  const projectsRes = await fetch('http://localhost:3001/api/projects?search=periodic');
  const projectsData = await projectsRes.json();
  
  console.log('Projects found:', projectsData.projects?.length || 0);
  
  if (projectsData.projects && projectsData.projects.length > 0) {
    const project = projectsData.projects[0];
    console.log('Project:', project.name, '- Has spec:', project.hasSpecification);
    
    // Call regenerate API
    const regenerateRes = await fetch(`http://localhost:3001/api/projects/${project.id}/regenerate-requirements`, {
      method: 'POST'
    });
    
    if (regenerateRes.ok) {
      const data = await regenerateRes.json();
      console.log('Regeneration started:', data);
      
      // Poll for status
      let attempts = 0;
      const maxAttempts = 30;
      
      const checkStatus = async () => {
        const statusRes = await fetch(`http://localhost:3001/api/jobs/regenerate-requirements/${data.jobId}/status`);
        if (statusRes.ok) {
          const status = await statusRes.json();
          console.log(`Attempt ${attempts + 1}: Status =`, status.status);
          
          if (status.status === 'completed') {
            console.log('✅ Requirements regeneration completed successfully!');
            
            // Check if file was created
            const fileRes = await fetch(`http://localhost:3001/api/projects/${project.id}/files?path=${encodeURIComponent(project.id + '/requirements.md')}`);
            if (fileRes.ok) {
              const fileData = await fileRes.json();
              console.log('Requirements file created, length:', fileData.content?.length || 0);
            }
            return true;
          } else if (status.status === 'failed') {
            console.log('❌ Requirements regeneration failed');
            return true;
          }
        }
        
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(checkStatus, 2000);
        } else {
          console.log('⏱️ Timeout waiting for regeneration');
        }
      };
      
      setTimeout(checkStatus, 2000);
    } else {
      console.log('Failed to start regeneration:', regenerateRes.status, await regenerateRes.text());
    }
  }
}

testRegenerateRequirements().catch(console.error);