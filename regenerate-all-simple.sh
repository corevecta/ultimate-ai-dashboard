#!/bin/bash

# Simple batch regeneration script using Claude CLI directly

PROJECTS_DIR="/home/sali/ai/projects/projecthubv3/projects"
TOTAL=0
SUCCESS=0
FAILED=0

# Count total projects
for dir in "$PROJECTS_DIR"/*; do
  if [ -d "$dir" ] && [ -f "$dir/ai-generated/specification.yaml" ]; then
    ((TOTAL++))
  fi
done

echo "🚀 Starting requirements regeneration for $TOTAL projects"
echo ""

# Process each project
COUNTER=0
for dir in "$PROJECTS_DIR"/*; do
  if [ -d "$dir" ] && [ -f "$dir/ai-generated/specification.yaml" ]; then
    PROJECT_ID=$(basename "$dir")
    ((COUNTER++))
    
    echo "[$COUNTER/$TOTAL] Processing $PROJECT_ID..."
    
    # Create temp directory
    TEMP_DIR="/tmp/claude-req-$PROJECT_ID-$$"
    mkdir -p "$TEMP_DIR"
    
    # Create MCP config
    cat > "$TEMP_DIR/mcp-config.json" << EOF
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "$dir"]
    }
  }
}
EOF
    
    # Create prompt
    cat > "$TEMP_DIR/prompt.txt" << EOF
Read the specification.yaml file and create a comprehensive requirements.md document.

Write the requirements document to: $dir/ai-generated/requirements.md

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

Base everything on the specification.yaml file content. Be specific to this project's features and business model.
EOF
    
    # Run Claude
    cd "$TEMP_DIR"
    timeout 80s claude --mcp-config mcp-config.json --continue --dangerously-skip-permissions < prompt.txt > /dev/null 2>&1
    
    # Check result
    if [ -f "$dir/ai-generated/requirements.md" ]; then
      echo "✅ Success!"
      ((SUCCESS++))
    else
      echo "❌ Failed!"
      ((FAILED++))
    fi
    
    # Cleanup
    rm -rf "$TEMP_DIR"
    
    # Show progress every 10 projects
    if [ $((COUNTER % 10)) -eq 0 ]; then
      echo ""
      echo "📊 Progress: $COUNTER/$TOTAL"
      echo "   Success: $SUCCESS, Failed: $FAILED"
      echo ""
    fi
  fi
done

echo ""
echo "✨ Regeneration Complete!"
echo "   Total: $TOTAL projects"
echo "   Success: $SUCCESS"
echo "   Failed: $FAILED"