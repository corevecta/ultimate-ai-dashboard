import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

// Store active preview servers
const activeServers = new Map<string, { process: any; port: number }>();

export async function POST(request: NextRequest) {
  try {
    const { projectId, type } = await request.json();

    // Check if server already exists
    if (activeServers.has(projectId)) {
      const server = activeServers.get(projectId);
      return NextResponse.json({
        success: true,
        url: `http://localhost:${server?.port}`,
        port: server?.port,
        status: 'running'
      });
    }

    // Find available port
    const port = await findAvailablePort();
    
    // Determine project path
    const projectBase = path.join(
      process.cwd(),
      '..',
      '..',
      '..',
      'projects',
      projectId,
      'ai-generated',
      type === 'production' ? 'full_code' : 'demo'
    );

    // Start preview server
    const serverProcess = spawn('npm', ['run', 'dev'], {
      cwd: projectBase,
      env: {
        ...process.env,
        PORT: port.toString(),
        BROWSER: 'none'
      }
    });

    // Store server info
    activeServers.set(projectId, {
      process: serverProcess,
      port
    });

    // Handle process events
    serverProcess.on('error', (error) => {
      console.error(`Preview server error for ${projectId}:`, error);
      activeServers.delete(projectId);
    });

    serverProcess.on('exit', (code) => {
      console.log(`Preview server exited for ${projectId} with code ${code}`);
      activeServers.delete(projectId);
    });

    // Wait a bit for server to start
    await new Promise(resolve => setTimeout(resolve, 3000));

    return NextResponse.json({
      success: true,
      url: `http://localhost:${port}`,
      port,
      status: 'starting'
    });

  } catch (error) {
    console.error('Preview server error:', error);
    return NextResponse.json(
      { error: 'Failed to start preview server' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID required' },
        { status: 400 }
      );
    }

    const server = activeServers.get(projectId);
    if (server) {
      server.process.kill();
      activeServers.delete(projectId);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Stop preview error:', error);
    return NextResponse.json(
      { error: 'Failed to stop preview server' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      // Return all active servers
      const servers = Array.from(activeServers.entries()).map(([id, info]) => ({
        projectId: id,
        port: info.port,
        url: `http://localhost:${info.port}`,
        status: 'running'
      }));

      return NextResponse.json({ servers });
    }

    // Return specific server status
    const server = activeServers.get(projectId);
    if (!server) {
      return NextResponse.json({
        projectId,
        status: 'stopped'
      });
    }

    return NextResponse.json({
      projectId,
      port: server.port,
      url: `http://localhost:${server.port}`,
      status: 'running'
    });

  } catch (error) {
    console.error('Get preview status error:', error);
    return NextResponse.json(
      { error: 'Failed to get preview status' },
      { status: 500 }
    );
  }
}

// Helper function to find available port
async function findAvailablePort(): Promise<number> {
  const net = await import('net');
  
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(0, () => {
      const port = (server.address() as any).port;
      server.close(() => resolve(port));
    });
  });
}