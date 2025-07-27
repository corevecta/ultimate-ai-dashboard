import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const PROJECTS_DIR = '/home/sali/ai/projects/projecthubv3/projects';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  
  try {
    // Security check - prevent directory traversal
    const normalizedId = path.normalize(projectId);
    if (normalizedId.includes('..')) {
      return NextResponse.json(
        { error: 'Invalid project ID' },
        { status: 400 }
      );
    }

    const projectPath = path.join(PROJECTS_DIR, projectId);
    
    // Verify the path is within the projects directory
    const resolvedPath = path.resolve(projectPath);
    const resolvedProjectsDir = path.resolve(PROJECTS_DIR);
    
    if (!resolvedPath.startsWith(resolvedProjectsDir)) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Check if project exists
    try {
      await fs.access(projectPath);
    } catch {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Delete the project directory recursively
    await fs.rm(projectPath, { recursive: true, force: true });

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}