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
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('path');
    
    if (!filePath) {
      return NextResponse.json(
        { error: 'File path is required' },
        { status: 400 }
      );
    }

    // Security: prevent path traversal attacks
    const normalizedPath = path.normalize(filePath);
    if (normalizedPath.includes('..')) {
      return NextResponse.json(
        { error: 'Invalid file path' },
        { status: 400 }
      );
    }

    // Construct the full path
    const fullPath = path.join(PROJECTS_DIR, normalizedPath);
    
    // Verify the path is within the projects directory
    const resolvedPath = path.resolve(fullPath);
    const resolvedProjectsDir = path.resolve(PROJECTS_DIR);
    
    if (!resolvedPath.startsWith(resolvedProjectsDir)) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    try {
      // Check if file exists
      await fs.access(fullPath);
      
      // Read the file content
      const content = await fs.readFile(fullPath, 'utf8');
      
      // Determine file type
      const fileExtension = path.extname(filePath).toLowerCase();
      const fileType = fileExtension === '.yaml' || fileExtension === '.yml' ? 'yaml' : 'markdown';
      
      return NextResponse.json({
        content,
        type: fileType,
        path: filePath,
        projectId
      });
      
    } catch (error) {
      // File not found
      console.error(`File not found: ${fullPath}`);
      
      // Try alternative paths for backward compatibility
      // Sometimes files might be under different naming conventions
      const alternativePaths = [
        // Try with project ID prefix
        path.join(PROJECTS_DIR, normalizedPath.replace(projectId, `cvp-${projectId}`)),
        // Try without cvp prefix if it exists
        path.join(PROJECTS_DIR, normalizedPath.replace(`cvp-${projectId}`, projectId)),
        // Try direct project folder
        path.join(PROJECTS_DIR, projectId, path.basename(normalizedPath)),
        // Try in ai-generated subfolder
        path.join(PROJECTS_DIR, projectId, 'ai-generated', path.basename(normalizedPath))
      ];
      
      for (const altPath of alternativePaths) {
        try {
          await fs.access(altPath);
          const content = await fs.readFile(altPath, 'utf8');
          const fileExtension = path.extname(filePath).toLowerCase();
          const fileType = fileExtension === '.yaml' || fileExtension === '.yml' ? 'yaml' : 'markdown';
          
          return NextResponse.json({
            content,
            type: fileType,
            path: filePath,
            projectId
          });
        } catch {
          // Continue to next alternative
        }
      }
      
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }
    
  } catch (error) {
    console.error('Error reading project file:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}