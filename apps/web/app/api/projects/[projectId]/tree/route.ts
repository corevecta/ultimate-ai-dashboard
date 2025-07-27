import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const PROJECTS_DIR = '/home/sali/ai/projects/projecthubv3/projects';

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileNode[];
  language?: string;
}

const IGNORED_ITEMS = [
  'node_modules',
  '.git',
  '.next',
  'dist',
  'build',
  '.DS_Store',
  '*.log',
  '.env.local',
  '.env',
  '__pycache__',
  '.pytest_cache',
  '.vscode',
  '.idea',
  'venv',
  '.venv',
  '*.pyc',
  '.mypy_cache'
];

function shouldIgnore(name: string): boolean {
  return IGNORED_ITEMS.some(pattern => {
    if (pattern.includes('*')) {
      const regex = new RegExp(pattern.replace('*', '.*'));
      return regex.test(name);
    }
    return name === pattern;
  });
}

function getLanguageFromExtension(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  const languageMap: Record<string, string> = {
    '.ts': 'typescript',
    '.tsx': 'typescript',
    '.js': 'javascript',
    '.jsx': 'javascript',
    '.json': 'json',
    '.css': 'css',
    '.scss': 'scss',
    '.html': 'html',
    '.md': 'markdown',
    '.py': 'python',
    '.java': 'java',
    '.go': 'go',
    '.rs': 'rust',
    '.yaml': 'yaml',
    '.yml': 'yaml',
    '.xml': 'xml',
    '.sql': 'sql',
    '.sh': 'shell',
    '.dockerfile': 'dockerfile',
    '.gitignore': 'ignore',
    '.env': 'dotenv'
  };
  
  return languageMap[ext] || 'plaintext';
}

async function buildFileTree(
  dirPath: string,
  basePath: string = '',
  depth: number = 0,
  maxDepth: number = 10
): Promise<FileNode[]> {
  if (depth > maxDepth) return [];
  
  try {
    const items = await fs.readdir(dirPath);
    const nodes: FileNode[] = [];
    
    for (const item of items) {
      if (shouldIgnore(item)) continue;
      
      const itemPath = path.join(dirPath, item);
      const relativePath = path.join(basePath, item);
      
      try {
        const stats = await fs.stat(itemPath);
        
        const node: FileNode = {
          id: relativePath.replace(/[\/\\]/g, '-'),
          name: item,
          type: stats.isDirectory() ? 'folder' : 'file',
          path: '/' + relativePath.replace(/\\/g, '/')
        };
        
        if (stats.isDirectory()) {
          node.children = await buildFileTree(itemPath, relativePath, depth + 1, maxDepth);
        } else {
          node.language = getLanguageFromExtension(item);
        }
        
        nodes.push(node);
      } catch (err) {
        console.error(`Error accessing ${itemPath}:`, err);
      }
    }
    
    // Sort: folders first, then files
    return nodes.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'folder' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
    return [];
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode') || 'production';
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
    
    // Determine project type and get correct path
    const isProduction = projectId.includes('cvp-');
    let targetPath = projectPath;
    let projectType = mode;
    
    // Check what modes are available
    const availableModes: string[] = [];
    
    // Check for demo paths
    const demoPaths = [
      path.join(projectPath, 'ai-generated', 'demo'),
      path.join(projectPath, 'demo'),
      path.join(projectPath, '.step3-temp', 'demo')
    ];
    
    for (const p of demoPaths) {
      try {
        await fs.access(p);
        const stats = await fs.stat(p);
        if (stats.isDirectory()) {
          availableModes.push('demo');
          break;
        }
      } catch {
        // Continue
      }
    }
    
    // Check for production paths
    if (isProduction) {
      const productionPaths = [
        path.join(projectPath, 'ai-generated', 'full_code'),
        path.join(projectPath, 'full_code'),
        path.join(projectPath, 'ai-generated')
      ];
      
      for (const p of productionPaths) {
        try {
          await fs.access(p);
          availableModes.push('production');
          break;
        } catch {
          // Continue
        }
      }
    }
    
    // Set target path based on requested mode
    if (mode === 'production' && isProduction) {
      const possiblePaths = [
        path.join(projectPath, 'ai-generated', 'full_code'),
        path.join(projectPath, 'full_code'),
        path.join(projectPath, 'ai-generated')
      ];
      
      for (const p of possiblePaths) {
        try {
          await fs.access(p);
          const stats = await fs.stat(p);
          if (stats.isDirectory()) {
            targetPath = p;
            break;
          }
        } catch {
          // Continue to next path
        }
      }
    } else {
      // Use demo path - try multiple locations
      const demoPaths = [
        path.join(projectPath, 'ai-generated', 'demo'),
        path.join(projectPath, 'demo'),
        path.join(projectPath, '.step3-temp', 'demo')
      ];
      
      for (const p of demoPaths) {
        try {
          await fs.access(p);
          const stats = await fs.stat(p);
          if (stats.isDirectory()) {
            targetPath = p;
            projectType = 'demo';
            break;
          }
        } catch {
          // Continue to next path
        }
      }
      
      // If no demo found, fall back to project root
      if (targetPath === projectPath && mode === 'demo') {
        console.warn(`Demo folder not found for project ${projectId}, using project root`);
      }
    }
    
    // Build file tree
    const fileTree = await buildFileTree(targetPath);
    
    // Get project info
    const projectName = projectId
      .replace('cvp-', '')
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    return NextResponse.json({
      projectInfo: {
        name: projectName,
        type: projectType,
        path: targetPath,
        id: projectId
      },
      fileTree,
      availableModes
    });
  } catch (error) {
    console.error('Error building file tree:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}