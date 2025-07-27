import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const PROJECTS_DIR = '/home/sali/ai/projects/projecthubv3/projects';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('path');
    const mode = searchParams.get('mode') || 'production';
    
    if (!filePath) {
      return NextResponse.json(
        { error: 'File path is required' },
        { status: 400 }
      );
    }
    
    // Security check
    const normalizedPath = path.normalize(filePath);
    if (normalizedPath.includes('..')) {
      return NextResponse.json(
        { error: 'Invalid file path' },
        { status: 400 }
      );
    }
    
    const projectPath = path.join(PROJECTS_DIR, projectId);
    const isProduction = projectId.includes('cvp-');
    
    // Try different path combinations based on mode
    let fullPath = '';
    let possiblePaths: string[] = [];
    
    if (mode === 'production' && isProduction) {
      possiblePaths = [
        path.join(projectPath, 'ai-generated/full_code', normalizedPath),
        path.join(projectPath, 'full_code', normalizedPath),
        path.join(projectPath, 'ai-generated', normalizedPath),
        path.join(projectPath, normalizedPath)
      ];
    } else {
      // Demo mode - try multiple demo locations
      possiblePaths = [
        path.join(projectPath, 'ai-generated/demo', normalizedPath),
        path.join(projectPath, 'demo', normalizedPath),
        path.join(projectPath, '.step3-temp/demo', normalizedPath),
        path.join(projectPath, normalizedPath)
      ];
    }
    
    for (const p of possiblePaths) {
      try {
        await fs.access(p);
        const stats = await fs.stat(p);
        if (stats.isFile()) {
          fullPath = p;
          break;
        }
      } catch {
        // Continue to next path
      }
    }
    
    if (!fullPath) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }
    
    // Read file content
    const content = await fs.readFile(fullPath, 'utf-8');
    
    return NextResponse.json({
      content,
      path: filePath
    });
  } catch (error) {
    console.error('Error reading file:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}