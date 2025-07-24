import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';

const PROJECTS_DIR = '/home/sali/ai/projects/projecthubv3/projects';

interface ProjectSpecification {
  meta?: {
    version?: string;
    created_at?: string;
    pipeline_status?: string;
  };
  project?: {
    type?: string;
    name?: string;
    description?: string;
    vision?: string;
  };
  market_analysis?: {
    tam?: string;
    sam?: string;
    som?: string;
  };
  features?: {
    core?: string[];
    advanced?: string[];
  };
}

interface Project {
  id: string;
  name: string;
  type: string;
  description: string;
  status: string;
  hasSpecification: boolean;
  hasMarketEnhanced: boolean;
  createdAt?: string;
  features?: {
    core: number;
    advanced: number;
  };
  market?: {
    tam?: string;
    sam?: string;
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || '';
    const status = searchParams.get('status') || '';
    const hasFeatures = searchParams.get('hasFeatures') || '';
    const hasMarket = searchParams.get('hasMarket') || '';
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = searchParams.get('sortOrder') || 'asc';
    
    // Read all project directories
    const projectDirs = await fs.readdir(PROJECTS_DIR);
    const cvpProjects = projectDirs.filter(dir => dir.startsWith('cvp-'));
    
    // Process projects in parallel (but limit concurrency)
    const projects: Project[] = [];
    const batchSize = 50;
    
    for (let i = 0; i < cvpProjects.length; i += batchSize) {
      const batch = cvpProjects.slice(i, i + batchSize);
      const batchProjects = await Promise.all(
        batch.map(async (projectId) => {
          try {
            const projectPath = path.join(PROJECTS_DIR, projectId);
            const aiGenPath = path.join(projectPath, 'ai-generated');
            
            // Check if project has specifications
            const hasSpec = await fs.access(path.join(aiGenPath, 'specification.yaml'))
              .then(() => true)
              .catch(() => false);
            
            const hasMarketEnhanced = await fs.access(path.join(aiGenPath, 'specification-market-enhanced-v2.yaml'))
              .then(() => true)
              .catch(() => false);
            
            // Extract project info from directory name
            const parts = projectId.split('-');
            const projectType = parts.slice(1, -1).join('-'); // e.g., chrome-extension
            const projectNumber = parts[parts.length - 1];
            
            let project: Project = {
              id: projectId,
              name: `${projectType.replace(/-/g, ' ')} ${projectNumber}`,
              type: projectType,
              description: `Project ${projectNumber}`,
              status: hasSpec ? 'specification-ready' : 'pending',
              hasSpecification: hasSpec,
              hasMarketEnhanced: hasMarketEnhanced
            };
            
            // Try to read specification for more details
            if (hasSpec) {
              try {
                const specPath = hasMarketEnhanced 
                  ? path.join(aiGenPath, 'specification-market-enhanced-v2.yaml')
                  : path.join(aiGenPath, 'specification.yaml');
                
                const specContent = await fs.readFile(specPath, 'utf-8');
                const spec = yaml.load(specContent) as ProjectSpecification;
                
                if (spec.project?.name) {
                  project.name = spec.project.name;
                }
                if (spec.project?.description) {
                  // Handle description as object or string
                  if (typeof spec.project.description === 'object' && spec.project.description !== null) {
                    // Use elevator_pitch as the primary description
                    project.description = (spec.project.description as any).elevator_pitch || 
                                         (spec.project.description as any).detailed || 
                                         `Project ${projectNumber}`;
                  } else {
                    project.description = spec.project.description;
                  }
                }
                if (spec.meta?.created_at) {
                  project.createdAt = spec.meta.created_at;
                }
                if (spec.features) {
                  project.features = {
                    core: spec.features.core?.length || 0,
                    advanced: spec.features.advanced?.length || 0
                  };
                }
                if (spec.market_analysis) {
                  project.market = {
                    tam: spec.market_analysis.tam,
                    sam: spec.market_analysis.sam
                  };
                }
              } catch (error) {
                // If we can't read the spec, continue with basic info
              }
            }
            
            return project;
          } catch (error) {
            return null;
          }
        })
      );
      
      projects.push(...batchProjects.filter(p => p !== null) as Project[]);
    }
    
    // Remove any duplicate projects by ID
    const uniqueProjects = Array.from(
      new Map(projects.map(p => [p.id, p])).values()
    );
    
    // Apply filters
    let filteredProjects = uniqueProjects;
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProjects = filteredProjects.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.type.toLowerCase().includes(searchLower) ||
        p.id.toLowerCase().includes(searchLower)
      );
    }
    
    if (type && type !== 'all') {
      filteredProjects = filteredProjects.filter(p => {
        // Extract base type for comparison
        const parts = p.type.split('-');
        const baseType = parts.length >= 2 ? parts.slice(0, 2).join('-') : p.type;
        return baseType === type;
      });
    }
    
    if (status) {
      switch (status) {
        case 'specification-ready':
          filteredProjects = filteredProjects.filter(p => p.hasSpecification);
          break;
        case 'market-enhanced':
          filteredProjects = filteredProjects.filter(p => p.hasMarketEnhanced);
          break;
        case 'pending':
          filteredProjects = filteredProjects.filter(p => !p.hasSpecification);
          break;
      }
    }
    
    if (hasFeatures === 'yes') {
      filteredProjects = filteredProjects.filter(p => p.features && (p.features.core > 0 || p.features.advanced > 0));
    } else if (hasFeatures === 'no') {
      filteredProjects = filteredProjects.filter(p => !p.features || (p.features.core === 0 && p.features.advanced === 0));
    }
    
    if (hasMarket === 'yes') {
      filteredProjects = filteredProjects.filter(p => p.market && (p.market.tam || p.market.sam));
    } else if (hasMarket === 'no') {
      filteredProjects = filteredProjects.filter(p => !p.market || (!p.market.tam && !p.market.sam));
    }
    
    // Apply sorting
    filteredProjects.sort((a, b) => {
      let compareResult = 0;
      
      switch (sortBy) {
        case 'name':
          compareResult = a.name.localeCompare(b.name);
          break;
        case 'type':
          compareResult = a.type.localeCompare(b.type);
          break;
        case 'status':
          compareResult = a.status.localeCompare(b.status);
          break;
        case 'features':
          const aFeatures = (a.features?.core || 0) + (a.features?.advanced || 0);
          const bFeatures = (b.features?.core || 0) + (b.features?.advanced || 0);
          compareResult = aFeatures - bFeatures;
          break;
        case 'date':
          const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          compareResult = aDate - bDate;
          break;
      }
      
      return sortOrder === 'asc' ? compareResult : -compareResult;
    });
    
    // Paginate
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProjects = filteredProjects.slice(startIndex, endIndex);
    
    // Get unique base project types for filtering (e.g., "api-service", "chrome-extension")
    const projectTypes = [...new Set(uniqueProjects.map(p => {
      // Extract base type from patterns like "api-service-city-service" -> "api-service"
      const parts = p.type.split('-');
      if (parts.length >= 2) {
        // Handle cases like "api-service-*" or "chrome-extension-*"
        return parts.slice(0, 2).join('-');
      }
      return p.type;
    }))].sort();
    
    return NextResponse.json({
      projects: paginatedProjects,
      total: filteredProjects.length,
      page,
      limit,
      totalPages: Math.ceil(filteredProjects.length / limit),
      projectTypes,
      stats: {
        total: projects.length,
        withSpecification: projects.filter(p => p.hasSpecification).length,
        withMarketEnhanced: projects.filter(p => p.hasMarketEnhanced).length
      }
    });
  } catch (error: any) {
    console.error('Error reading projects:', error);
    return NextResponse.json(
      { error: 'Failed to load projects', details: error.message },
      { status: 500 }
    );
  }
}