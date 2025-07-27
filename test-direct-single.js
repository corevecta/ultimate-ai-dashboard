#!/usr/bin/env node

// Test direct regeneration for a single project
const script = require('./regenerate-requirements-direct.js');

// Modify to only process one project
const originalGetAllProjects = script.getAllProjects || function() {
  const fs = require('fs');
  const path = require('path');
  const projectsDir = '/home/sali/ai/projects/projecthubv3/projects';
  
  // Only return the 3D photo converter project for testing
  const testProject = 'cvp-web-app-3d-photo-converter';
  const specPath = path.join(projectsDir, testProject, 'ai-generated', 'specification.yaml');
  
  if (fs.existsSync(specPath)) {
    return [{
      id: testProject,
      dir: path.join(projectsDir, testProject),
      specPath
    }];
  }
  
  return [];
};

// Override the function
if (script.getAllProjects) {
  script.getAllProjects = function() {
    return originalGetAllProjects().slice(0, 1);
  };
}

console.log('🧪 Testing direct regeneration with single project...\n');