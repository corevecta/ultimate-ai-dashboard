#!/bin/bash

PROJECT_ID="cvp-web-app-3d-photo-converter"
PROJECT_DIR="/home/sali/ai/projects/projecthubv3/projects/$PROJECT_ID"

# Create temp directory
TEMP_DIR="/tmp/test-mcp-$$"
mkdir -p "$TEMP_DIR"

# Create MCP config
cat > "$TEMP_DIR/mcp-config.json" << EOF
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "$PROJECT_DIR"]
    }
  }
}
EOF

# Test with simple prompt
cd "$TEMP_DIR"
echo "Testing MCP file access..."
echo "List the files in the ai-generated directory" | claude --mcp-config mcp-config.json --continue --dangerously-skip-permissions

# Cleanup
rm -rf "$TEMP_DIR"