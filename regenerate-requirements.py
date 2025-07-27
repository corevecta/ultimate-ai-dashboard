#!/usr/bin/env python3

import os
import subprocess
import json
import yaml
import time
import tempfile
import shutil
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
import sys

# Configuration
MAX_WORKERS = 6
CLAUDE_TIMEOUT = 80  # seconds
PROJECTS_DIR = "/home/sali/ai/projects/projecthubv3/projects"

def get_all_projects():
    """Get all projects with specification.yaml"""
    projects = []
    
    # Check if test mode
    test_project = os.environ.get('TEST_SINGLE_PROJECT')
    if test_project:
        spec_path = Path(PROJECTS_DIR) / test_project / 'ai-generated' / 'specification.yaml'
        if spec_path.exists():
            projects.append({
                'id': test_project,
                'dir': Path(PROJECTS_DIR) / test_project,
                'spec_path': spec_path
            })
            print(f"🧪 TEST MODE: Only processing {test_project}")
        return projects
    
    # Get all projects
    for entry in os.listdir(PROJECTS_DIR):
        project_dir = Path(PROJECTS_DIR) / entry
        if project_dir.is_dir():
            spec_path = project_dir / 'ai-generated' / 'specification.yaml'
            if spec_path.exists():
                projects.append({
                    'id': entry,
                    'dir': project_dir,
                    'spec_path': spec_path
                })
    
    return projects

def process_project(project, worker_id):
    """Process a single project"""
    project_id = project['id']
    project_dir = project['dir']
    spec_path = project['spec_path']
    
    try:
        # Read specification
        with open(spec_path, 'r') as f:
            spec = yaml.safe_load(f)
        
        project_name = spec.get('project', {}).get('name', project_id)
        project_type = spec.get('project', {}).get('type', 'application')
        project_desc = spec.get('project', {}).get('description', 'provides various features')
        
        # Create temp directory
        with tempfile.TemporaryDirectory(prefix=f'claude-req-{project_id}-') as temp_dir:
            # Create MCP config
            mcp_config = {
                "mcpServers": {
                    "filesystem": {
                        "command": "npx",
                        "args": ["-y", "@modelcontextprotocol/server-filesystem", str(project_dir)]
                    }
                }
            }
            
            config_path = Path(temp_dir) / 'mcp-config.json'
            with open(config_path, 'w') as f:
                json.dump(mcp_config, f, indent=2)
            
            # Create prompt
            output_path = project_dir / 'ai-generated' / 'requirements.md'
            prompt = f"""Read the specification.yaml file and create a comprehensive requirements.md document for the "{project_name}" project.

The project is a {project_type} that {project_desc}.

Write the requirements document to: {output_path}

The document must include:
- Executive Summary
- Project Overview with business context
- Detailed Functional Requirements for all features (core, premium, enterprise)
- Non-Functional Requirements
- User Stories for each feature
- Technical Architecture
- Security Requirements
- API Specifications
- Database Schema
- UI/UX Requirements
- Testing Strategy
- Deployment Architecture

Base everything on the specification.yaml file content. Be specific to this project's features and business model."""
            
            print(f"[Worker {worker_id}] Processing {project_id}...")
            
            # Run Claude CLI
            cmd = [
                'claude',
                '--mcp-config', str(config_path),
                '--continue',
                '--dangerously-skip-permissions'
            ]
            
            # Start process
            proc = subprocess.Popen(
                cmd,
                stdin=subprocess.PIPE,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
                cwd=temp_dir
            )
            
            # Send prompt and close stdin
            proc.stdin.write(prompt.encode())
            proc.stdin.close()
            
            # Monitor for file creation
            start_time = time.time()
            file_created = False
            
            while time.time() - start_time < CLAUDE_TIMEOUT:
                if output_path.exists():
                    file_created = True
                    time.sleep(2)  # Let it finish writing
                    proc.terminate()
                    break
                time.sleep(1)
            
            # Timeout
            if not file_created:
                proc.terminate()
                proc.wait(timeout=5)
            
            # Check result
            if file_created and output_path.exists():
                file_size = output_path.stat().st_size
                print(f"✅ {project_id} - Success ({file_size} bytes)")
                return True
            else:
                print(f"❌ {project_id} - Failed")
                return False
                
    except Exception as e:
        print(f"❌ {project_id} - Error: {str(e)}")
        return False

def main():
    """Main function"""
    projects = get_all_projects()
    total = len(projects)
    
    print(f"🚀 Starting requirements regeneration for {total} projects")
    print(f"⚙️  Configuration: {MAX_WORKERS} workers, {CLAUDE_TIMEOUT}s timeout")
    print("")
    
    success_count = 0
    failed_count = 0
    start_time = time.time()
    
    # Process with thread pool
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        # Submit all tasks
        future_to_project = {
            executor.submit(process_project, project, i % MAX_WORKERS): project
            for i, project in enumerate(projects)
        }
        
        # Process results
        for i, future in enumerate(as_completed(future_to_project)):
            if future.result():
                success_count += 1
            else:
                failed_count += 1
            
            # Progress update
            if (i + 1) % 10 == 0:
                elapsed = time.time() - start_time
                rate = success_count / elapsed if elapsed > 0 else 0
                eta = (total - i - 1) / rate if rate > 0 else 0
                
                print(f"\n📊 Progress: {i+1}/{total} ({(i+1)/total*100:.0f}%)")
                print(f"   Success: {success_count}, Failed: {failed_count}")
                print(f"   Time: {elapsed:.0f}s, Rate: {rate:.2f}/s, ETA: {eta:.0f}s\n")
    
    # Final summary
    total_time = time.time() - start_time
    print("\n✨ Regeneration Complete!")
    print(f"   Total: {total} projects")
    print(f"   Success: {success_count} ({success_count/total*100:.0f}%)")
    print(f"   Failed: {failed_count}")
    print(f"   Time: {total_time:.0f}s ({int(total_time/60)}m {int(total_time%60)}s)")
    print(f"   Rate: {success_count/total_time:.2f} projects/second")

if __name__ == '__main__':
    main()