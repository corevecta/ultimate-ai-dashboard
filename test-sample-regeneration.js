const fs = require('fs');
const path = require('path');

const PROJECTS_DIR = '/home/sali/ai/projects/projecthubv3/projects';

async function testSampleRegeneration() {
  console.log('🧪 Testing requirements regeneration with a small sample...\n');
  
  // Find projects needing requirements
  const dirs = fs.readdirSync(PROJECTS_DIR);
  const projectsNeedingReqs = [];
  
  for (const dir of dirs) {
    if (projectsNeedingReqs.length >= 5) break; // Just test 5 projects
    
    const projectPath = path.join(PROJECTS_DIR, dir);
    if (fs.statSync(projectPath).isDirectory()) {
      const hasSpec = fs.existsSync(path.join(projectPath, 'specification.yaml')) || 
                     fs.existsSync(path.join(projectPath, 'ai-generated', 'specification.yaml'));
      const hasReq = fs.existsSync(path.join(projectPath, 'requirements.md')) || 
                    fs.existsSync(path.join(projectPath, 'ai-generated', 'requirements.md'));
      
      if (hasSpec && !hasReq) {
        projectsNeedingReqs.push(dir);
      }
    }
  }
  
  console.log('Found sample projects:', projectsNeedingReqs);
  console.log('\nRegenerating requirements for these projects...\n');
  
  // Regenerate requirements
  for (const projectId of projectsNeedingReqs) {
    try {
      const response = await fetch(`http://localhost:3001/api/projects/${projectId}/regenerate-requirements`, {
        method: 'POST'
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ ${projectId}: Job started (${data.jobId})`);
      } else {
        console.log(`❌ ${projectId}: Failed to start`);
      }
    } catch (error) {
      console.log(`❌ ${projectId}: Error - ${error.message}`);
    }
  }
  
  // Wait and verify
  console.log('\n⏳ Waiting 10 seconds for generation...');
  await new Promise(resolve => setTimeout(resolve, 10000));
  
  console.log('\n🔍 Verifying generated files:');
  
  for (const projectId of projectsNeedingReqs) {
    const reqPaths = [
      path.join(PROJECTS_DIR, projectId, 'requirements.md'),
      path.join(PROJECTS_DIR, projectId, 'ai-generated', 'requirements.md')
    ];
    
    const exists = reqPaths.some(p => fs.existsSync(p));
    console.log(`${exists ? '✅' : '❌'} ${projectId}: Requirements ${exists ? 'created' : 'not found'}`);
  }
  
  console.log('\n✨ Test completed!');
}

testSampleRegeneration().catch(console.error);