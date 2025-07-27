const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Direct test of Claude CLI for requirements generation
async function testClaudeDirect() {
  console.log('🧪 Testing Claude CLI directly for requirements generation\n');
  
  const projectId = 'cvp-web-app-3d-photo-converter';
  const projectDir = `/home/sali/ai/projects/projecthubv3/projects/${projectId}`;
  const specPath = path.join(projectDir, 'ai-generated', 'specification.yaml');
  
  // Read specification
  const specContent = yaml.load(fs.readFileSync(specPath, 'utf-8'));
  console.log('✅ Found specification for:', specContent.project?.name || projectId);
  
  // Create test directory
  const testDir = `/tmp/claude-requirements-test-${Date.now()}`;
  fs.mkdirSync(testDir, { recursive: true });
  
  // Create MCP config
  const mcpConfig = {
    mcpServers: {
      filesystem: {
        command: "npx",
        args: ["-y", "@modelcontextprotocol/server-filesystem", projectDir]
      }
    }
  };
  
  const configPath = path.join(testDir, 'mcp-config.json');
  fs.writeFileSync(configPath, JSON.stringify(mcpConfig, null, 2));
  
  // Create simple prompt
  const prompt = `Write a requirements.md file for the "${specContent.project?.name}" project.

The project is a ${specContent.project?.type} that ${specContent.project?.description}.

Core features:
${specContent.features?.core?.map((f, i) => `${i+1}. ${typeof f === 'string' ? f : f.name}`).join('\n')}

Write the requirements to: ${projectDir}/ai-generated/requirements.md

Include sections for:
- Project Overview
- Functional Requirements
- User Stories
- Technical Architecture

Start writing now.`;

  console.log('\n📝 Prompt preview (first 200 chars):');
  console.log(prompt.substring(0, 200) + '...\n');
  
  // Test Claude CLI
  console.log('🚀 Running Claude CLI...\n');
  
  return new Promise((resolve) => {
    const args = [
      '--mcp-config', configPath,
      '--continue',
      '--dangerously-skip-permissions'
    ];
    
    const proc = spawn('claude', args, {
      env: { ...process.env },
      cwd: testDir
    });
    
    let output = '';
    let error = '';
    const startTime = Date.now();
    
    proc.stdout.on('data', (data) => {
      const chunk = data.toString();
      output += chunk;
      process.stdout.write('.');
    });
    
    proc.stderr.on('data', (data) => {
      error += data.toString();
    });
    
    proc.on('close', (code) => {
      const duration = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(`\n\n⏱️  Completed in ${duration}s with exit code: ${code}`);
      
      if (error) {
        console.log('❌ Error output:', error);
      }
      
      // Check if file was created
      const expectedFile = path.join(projectDir, 'ai-generated', 'requirements.md');
      if (fs.existsSync(expectedFile)) {
        const content = fs.readFileSync(expectedFile, 'utf-8');
        console.log(`\n✅ SUCCESS! Requirements file created at: ${expectedFile}`);
        console.log(`   File size: ${content.length} characters`);
        console.log(`\n📄 First 500 characters:\n${content.substring(0, 500)}...`);
      } else {
        console.log(`\n❌ File not created at expected location: ${expectedFile}`);
        console.log('\n📝 Claude output (last 500 chars):');
        console.log(output.substring(output.length - 500));
      }
      
      // Cleanup
      fs.rmSync(testDir, { recursive: true, force: true });
      resolve();
    });
    
    // Send prompt
    proc.stdin.write(prompt);
    proc.stdin.end();
    
    // Timeout after 60 seconds
    setTimeout(() => {
      console.log('\n⏰ Timeout - killing process');
      proc.kill();
    }, 60000);
  });
}

testClaudeDirect().catch(console.error);