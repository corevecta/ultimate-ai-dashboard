import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const PROJECTS_DIR = '/home/sali/ai/projects/projecthubv3/projects';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  
  try {
    const projectPath = path.join(PROJECTS_DIR, projectId);
    
    // Check if project exists
    try {
      await fs.access(projectPath);
    } catch {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Collect all project files
    const projectData: any = {
      id: projectId,
      exportedAt: new Date().toISOString(),
      files: {}
    };

    // Read all files in the project directory
    const files = await fs.readdir(projectPath);
    
    for (const file of files) {
      const filePath = path.join(projectPath, file);
      const stat = await fs.stat(filePath);
      
      if (stat.isFile()) {
        try {
          const content = await fs.readFile(filePath, 'utf8');
          projectData.files[file] = content;
        } catch (error) {
          console.log(`Could not read file ${file}:`, error);
        }
      }
    }

    // Read project.json if it exists to get metadata
    try {
      const projectJsonPath = path.join(projectPath, 'project.json');
      const projectJson = await fs.readFile(projectJsonPath, 'utf8');
      const metadata = JSON.parse(projectJson);
      projectData.metadata = metadata;
    } catch {
      // No project.json found
    }

    // Create the export blob
    const exportContent = JSON.stringify(projectData, null, 2);
    
    return new Response(exportContent, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${projectId}-export.json"`
      }
    });
    
  } catch (error) {
    console.error('Error exporting project:', error);
    return NextResponse.json(
      { error: 'Failed to export project' },
      { status: 500 }
    );
  }
}