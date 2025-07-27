import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const PROJECTS_DIR = '/home/sali/ai/projects/projecthubv3/projects';

export async function POST(request: Request) {
  try {
    const { projectId } = await request.json();
    
    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    // Source project path
    const sourcePath = path.join(PROJECTS_DIR, projectId);
    
    // Check if source project exists
    try {
      await fs.access(sourcePath);
    } catch {
      return NextResponse.json(
        { error: 'Source project not found' },
        { status: 404 }
      );
    }

    // Generate a new clone name with timestamp
    const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const cloneId = `${projectId}-clone-${timestamp}`;
    const clonePath = path.join(PROJECTS_DIR, cloneId);

    // Check if clone already exists
    try {
      await fs.access(clonePath);
      // If it exists, add a random suffix
      const randomSuffix = Math.random().toString(36).substring(2, 7);
      const newCloneId = `${projectId}-clone-${timestamp}-${randomSuffix}`;
      const newClonePath = path.join(PROJECTS_DIR, newCloneId);
      
      // Copy the directory
      await copyDirectory(sourcePath, newClonePath);
      
      // Update project.json with new name
      await updateProjectJson(newClonePath, newCloneId);
      
      return NextResponse.json({
        success: true,
        projectId: newCloneId,
        message: 'Project cloned successfully'
      });
    } catch {
      // Clone doesn't exist, proceed with original clone path
      await copyDirectory(sourcePath, clonePath);
      
      // Update project.json with new name
      await updateProjectJson(clonePath, cloneId);
      
      return NextResponse.json({
        success: true,
        projectId: cloneId,
        message: 'Project cloned successfully'
      });
    }
    
  } catch (error) {
    console.error('Error cloning project:', error);
    return NextResponse.json(
      { error: 'Failed to clone project' },
      { status: 500 }
    );
  }
}

async function copyDirectory(source: string, destination: string) {
  await fs.mkdir(destination, { recursive: true });
  
  const entries = await fs.readdir(source, { withFileTypes: true });
  
  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const destPath = path.join(destination, entry.name);
    
    if (entry.isDirectory()) {
      await copyDirectory(sourcePath, destPath);
    } else {
      await fs.copyFile(sourcePath, destPath);
    }
  }
}

async function updateProjectJson(projectPath: string, newProjectId: string) {
  const projectJsonPath = path.join(projectPath, 'project.json');
  
  try {
    const content = await fs.readFile(projectJsonPath, 'utf8');
    const projectData = JSON.parse(content);
    
    // Update project metadata
    projectData.id = newProjectId;
    projectData.name = `${projectData.name} (Clone)`;
    projectData.createdAt = new Date().toISOString();
    projectData.clonedFrom = projectData.id;
    
    await fs.writeFile(projectJsonPath, JSON.stringify(projectData, null, 2));
  } catch (error) {
    console.log('No project.json found or error updating it:', error);
  }
}