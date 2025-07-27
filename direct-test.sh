#!/bin/bash

PROJECT_ID="cvp-web-app-3d-photo-converter"
PROJECT_DIR="/home/sali/ai/projects/projecthubv3/projects/$PROJECT_ID"

# Test directory
cd /tmp

# Create MCP config inline
MCP_CONFIG='{"mcpServers":{"filesystem":{"command":"npx","args":["-y","@modelcontextprotocol/server-filesystem","'$PROJECT_DIR'"]}}}'

# Run Claude directly with echo
echo "Read $PROJECT_DIR/ai-generated/specification.yaml and create a simple requirements overview at $PROJECT_DIR/ai-generated/requirements.md" | \
  claude --mcp-config <(echo "$MCP_CONFIG") --continue --dangerously-skip-permissions

# Check result
if [ -f "$PROJECT_DIR/ai-generated/requirements.md" ]; then
    echo "✅ Success!"
    wc -l "$PROJECT_DIR/ai-generated/requirements.md"
else
    echo "❌ Failed"
fi