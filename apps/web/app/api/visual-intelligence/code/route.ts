import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const filePath = searchParams.get('path');
    const type = searchParams.get('type') || 'demo';

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID required' },
        { status: 400 }
      );
    }

    const projectBase = path.join(
      process.cwd(),
      '..',
      '..',
      '..',
      'projects',
      projectId,
      'ai-generated',
      type
    );

    // If no specific file, return file tree
    if (!filePath) {
      const fileTree = await buildFileTree(projectBase);
      return NextResponse.json({ 
        projectId,
        type,
        files: fileTree 
      });
    }

    // Read specific file
    const fullPath = path.join(projectBase, filePath);
    
    // Security check - ensure path is within project directory
    if (!fullPath.startsWith(projectBase)) {
      return NextResponse.json(
        { error: 'Invalid file path' },
        { status: 403 }
      );
    }

    const content = await fs.readFile(fullPath, 'utf-8');
    const stats = await fs.stat(fullPath);

    return NextResponse.json({
      projectId,
      path: filePath,
      content,
      size: stats.size,
      modified: stats.mtime,
      language: getLanguageFromPath(filePath)
    });

  } catch (error) {
    console.error('Code reading error:', error);
    return NextResponse.json(
      { error: 'Failed to read code' },
      { status: 500 }
    );
  }
}

// Build file tree recursively
async function buildFileTree(dir: string, basePath: string = ''): Promise<any[]> {
  const items = await fs.readdir(dir, { withFileTypes: true });
  const tree = [];

  for (const item of items) {
    // Skip node_modules and hidden files
    if (item.name.startsWith('.') || item.name === 'node_modules') {
      continue;
    }

    const itemPath = path.join(basePath, item.name);
    const fullPath = path.join(dir, item.name);

    if (item.isDirectory()) {
      const children = await buildFileTree(fullPath, itemPath);
      tree.push({
        name: item.name,
        path: itemPath,
        type: 'directory',
        children
      });
    } else {
      const stats = await fs.stat(fullPath);
      tree.push({
        name: item.name,
        path: itemPath,
        type: 'file',
        size: stats.size,
        language: getLanguageFromPath(item.name)
      });
    }
  }

  return tree;
}

// Get language from file extension
function getLanguageFromPath(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const languageMap: Record<string, string> = {
    '.js': 'javascript',
    '.jsx': 'javascript',
    '.ts': 'typescript',
    '.tsx': 'typescript',
    '.css': 'css',
    '.scss': 'scss',
    '.html': 'html',
    '.json': 'json',
    '.md': 'markdown',
    '.py': 'python',
    '.java': 'java',
    '.cpp': 'cpp',
    '.c': 'c',
    '.go': 'go',
    '.rs': 'rust',
    '.php': 'php',
    '.rb': 'ruby',
    '.swift': 'swift',
    '.kt': 'kotlin',
    '.yaml': 'yaml',
    '.yml': 'yaml',
    '.xml': 'xml',
    '.sql': 'sql',
    '.sh': 'shell',
    '.bash': 'shell',
    '.dockerfile': 'dockerfile',
    '.gitignore': 'gitignore'
  };

  return languageMap[ext] || 'plaintext';
}

// Code analysis endpoint
export async function POST(request: NextRequest) {
  try {
    const { projectId, type = 'demo' } = await request.json();

    const projectBase = path.join(
      process.cwd(),
      '..',
      '..',
      '..',
      'projects',
      projectId,
      'ai-generated',
      type
    );

    // Analyze code metrics
    const metrics = await analyzeCodeMetrics(projectBase);

    return NextResponse.json({
      projectId,
      type,
      metrics
    });

  } catch (error) {
    console.error('Code analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze code' },
      { status: 500 }
    );
  }
}

// Analyze code metrics
async function analyzeCodeMetrics(projectPath: string) {
  let totalFiles = 0;
  let totalLines = 0;
  let totalSize = 0;
  const fileTypes: Record<string, number> = {};
  const largestFiles: any[] = [];

  async function walkDir(dir: string) {
    const items = await fs.readdir(dir, { withFileTypes: true });

    for (const item of items) {
      if (item.name.startsWith('.') || item.name === 'node_modules') {
        continue;
      }

      const fullPath = path.join(dir, item.name);

      if (item.isDirectory()) {
        await walkDir(fullPath);
      } else {
        totalFiles++;
        const stats = await fs.stat(fullPath);
        totalSize += stats.size;

        const ext = path.extname(item.name).toLowerCase() || 'no-ext';
        fileTypes[ext] = (fileTypes[ext] || 0) + 1;

        // Count lines for text files
        if (isTextFile(item.name)) {
          try {
            const content = await fs.readFile(fullPath, 'utf-8');
            const lines = content.split('\n').length;
            totalLines += lines;

            largestFiles.push({
              path: fullPath.replace(projectPath, ''),
              size: stats.size,
              lines
            });
          } catch (e) {
            // Ignore binary files
          }
        }
      }
    }
  }

  await walkDir(projectPath);

  // Sort largest files
  largestFiles.sort((a, b) => b.size - a.size);

  return {
    totalFiles,
    totalLines,
    totalSize,
    avgFileSize: totalFiles > 0 ? Math.round(totalSize / totalFiles) : 0,
    avgLinesPerFile: totalFiles > 0 ? Math.round(totalLines / totalFiles) : 0,
    fileTypes,
    largestFiles: largestFiles.slice(0, 10)
  };
}

// Check if file is text
function isTextFile(filename: string): boolean {
  const textExtensions = [
    '.js', '.jsx', '.ts', '.tsx', '.css', '.scss', '.html', 
    '.json', '.md', '.txt', '.py', '.java', '.cpp', '.c', 
    '.go', '.rs', '.php', '.rb', '.swift', '.kt', '.yaml', 
    '.yml', '.xml', '.sql', '.sh', '.bash'
  ];
  
  const ext = path.extname(filename).toLowerCase();
  return textExtensions.includes(ext);
}