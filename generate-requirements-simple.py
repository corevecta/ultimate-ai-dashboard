#!/usr/bin/env python3

import os
import sys
import yaml
import subprocess
import time

def generate_requirements(project_id):
    """Generate requirements for a single project"""
    project_dir = f"/home/sali/ai/projects/projecthubv3/projects/{project_id}"
    spec_file = f"{project_dir}/ai-generated/specification.yaml"
    output_file = f"{project_dir}/ai-generated/requirements.md"
    
    # Check if spec exists
    if not os.path.exists(spec_file):
        print(f"❌ No specification found for {project_id}")
        return False
    
    print(f"🚀 Processing {project_id}...")
    
    try:
        # Load specification
        with open(spec_file, 'r') as f:
            spec = yaml.safe_load(f)
        
        # Extract key information safely
        project = spec.get('project', {})
        name = project.get('name', 'Unknown Project')
        proj_type = project.get('type', 'application')
        description = project.get('description', 'No description provided')
        
        features = spec.get('features', {})
        core_features = features.get('core', [])
        if not isinstance(core_features, list):
            core_features = []
        
        technical = spec.get('technical', {})
        stack = technical.get('stack', [])
        if not isinstance(stack, list):
            stack = []
        
        business = spec.get('business', {})
        model = business.get('model', {})
        
        # Format features
        feature_list = []
        for f in core_features[:5]:
            if isinstance(f, str):
                feature_list.append(f"- {f}")
            elif isinstance(f, dict):
                feature_list.append(f"- {f.get('name', 'Feature')}")
        
        # Create prompt
        prompt = f"""Create a comprehensive requirements document for the following project:

**Project Name:** {name}
**Type:** {proj_type}
**Description:** {description}

**Core Features:** {len(core_features)} features
{chr(10).join(feature_list)}

**Tech Stack:** {', '.join(stack[:5]) if stack else 'Not specified'}

**Business Model:** {model.get('type', 'Not specified') if isinstance(model, dict) else 'Not specified'}

Create a requirements document with these sections:
1. Executive Summary (150+ words)
2. Project Overview (200+ words)
3. Functional Requirements (detailed for each feature)
4. Technical Architecture (based on the tech stack)
5. User Stories (2 per major feature)
6. Security Requirements
7. Testing Strategy
8. Deployment Requirements

Be specific to this project. Aim for 150+ lines of content."""

        # Run Claude
        process = subprocess.Popen(
            ['claude', '--continue'],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        output, error = process.communicate(input=prompt, timeout=40)
        
        if output and len(output) > 1000:  # Minimum content check
            with open(output_file, 'w') as f:
                f.write(output)
            
            lines = len(output.split('\n'))
            size = len(output)
            print(f"✅ {project_id} - Success ({lines} lines, {size} bytes)")
            return True
        else:
            print(f"❌ {project_id} - Failed (insufficient output)")
            return False
            
    except subprocess.TimeoutExpired:
        print(f"❌ {project_id} - Timeout")
        return False
    except Exception as e:
        print(f"❌ {project_id} - Error: {str(e)}")
        return False

def main():
    if len(sys.argv) > 1:
        # Single project mode
        project_id = sys.argv[1]
        generate_requirements(project_id)
    else:
        # Batch mode
        projects_dir = "/home/sali/ai/projects/projecthubv3/projects"
        projects = [d for d in os.listdir(projects_dir) 
                   if os.path.isdir(os.path.join(projects_dir, d)) 
                   and os.path.exists(os.path.join(projects_dir, d, 'ai-generated/specification.yaml'))]
        
        print(f"Found {len(projects)} projects to process")
        
        success = 0
        failed = 0
        
        for i, project_id in enumerate(projects[:10]):  # Test with first 10
            print(f"\n[{i+1}/10] Processing {project_id}")
            if generate_requirements(project_id):
                success += 1
            else:
                failed += 1
            
            # Small delay to avoid rate limiting
            time.sleep(2)
        
        print(f"\n✨ Complete! Success: {success}, Failed: {failed}")

if __name__ == "__main__":
    main()