const fs = require('fs');
const path = require('path');

const PROJECTS_DIR = '/home/sali/ai/projects/projecthubv3/projects';

// Count projects needing requirements
function countProjectsNeedingRequirements() {
  const stats = {
    totalProjects: 0,
    hasSpecification: 0,
    hasRequirements: 0,
    needsRequirements: 0,
    noSpecification: 0
  };
  
  const dirs = fs.readdirSync(PROJECTS_DIR);
  
  for (const dir of dirs) {
    const projectPath = path.join(PROJECTS_DIR, dir);
    
    if (fs.statSync(projectPath).isDirectory()) {
      stats.totalProjects++;
      
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
      
      if (hasSpecification) {
        stats.hasSpecification++;
        
        if (hasRequirements) {
          stats.hasRequirements++;
        } else {
          stats.needsRequirements++;
        }
      } else {
        stats.noSpecification++;
      }
    }
  }
  
  return stats;
}

// Run the count
const stats = countProjectsNeedingRequirements();

console.log('📊 PROJECT REQUIREMENTS STATUS');
console.log('============================');
console.log(`Total projects: ${stats.totalProjects}`);
console.log(`Has specification: ${stats.hasSpecification}`);
console.log(`Has requirements: ${stats.hasRequirements}`);
console.log(`\n🔴 Needs requirements: ${stats.needsRequirements}`);
console.log(`No specification: ${stats.noSpecification}`);

// Estimate time
const avgTimePerProject = 30; // seconds per project
const parallelWorkers = 6; // 6 parallel Claude workers
const effectiveTime = (stats.needsRequirements * avgTimePerProject) / parallelWorkers / 60;
const totalHours = effectiveTime / 60;

console.log(`\n⏱️  Estimated generation time:`);
console.log(`   Sequential: ${(stats.needsRequirements * avgTimePerProject / 60).toFixed(0)} minutes`);
console.log(`   With 6 parallel workers: ${effectiveTime.toFixed(0)} minutes (${totalHours.toFixed(1)} hours)`);
console.log(`   (Assuming ${avgTimePerProject}s per project with Claude CLI Sonnet 4)`);