#!/bin/bash

PROJECT_ID="cvp-web-app-3d-photo-converter"
PROJECT_DIR="/home/sali/ai/projects/projecthubv3/projects/$PROJECT_ID"

# Create temp directory
TEMP_DIR="/tmp/test-explicit-$$"
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

# Test with explicit read command
cd "$TEMP_DIR"
echo "Testing explicit file read..."

cat > prompt.txt << 'EOF'
Please use the read_file tool to read the file at path: ai-generated/specification.yaml

Then tell me the project name and type from that file.
EOF

claude --mcp-config mcp-config.json --continue --dangerously-skip-permissions < prompt.txt

# Cleanup
rm -rf "$TEMP_DIR"