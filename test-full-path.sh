#!/bin/bash

PROJECT_ID="cvp-web-app-3d-photo-converter"
PROJECT_DIR="/home/sali/ai/projects/projecthubv3/projects/$PROJECT_ID"

# Create temp directory
TEMP_DIR="/tmp/test-fullpath-$$"
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

# Test with full path
cd "$TEMP_DIR"
echo "Testing with full path..."

cat > prompt.txt << EOF
Please read the file at: $PROJECT_DIR/ai-generated/specification.yaml

Then create a requirements.md file at: $PROJECT_DIR/ai-generated/requirements.md

Include a simple project overview based on the specification.
EOF

claude --mcp-config mcp-config.json --continue --dangerously-skip-permissions < prompt.txt

# Check if file was created
if [ -f "$PROJECT_DIR/ai-generated/requirements.md" ]; then
    echo "✅ Success! File created"
    head -20 "$PROJECT_DIR/ai-generated/requirements.md"
else
    echo "❌ Failed to create file"
fi

# Cleanup
rm -rf "$TEMP_DIR"