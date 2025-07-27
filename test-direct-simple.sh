#!/bin/bash

PROJECT_ID="${1:-cvp-api-service-customer-service-bot}"
PROJECT_DIR="/home/sali/ai/projects/projecthubv3/projects/$PROJECT_ID"

echo "Testing $PROJECT_ID..."

# Create temp directory
TEMP_DIR="/tmp/claude-test-$$"
mkdir -p "$TEMP_DIR"

# Create MCP config file
cat > "$TEMP_DIR/mcp.json" << EOF
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "$PROJECT_DIR"]
    }
  }
}
EOF

# Create prompt file
cat > "$TEMP_DIR/prompt.txt" << EOF
Read the file at $PROJECT_DIR/ai-generated/specification.yaml and create a requirements document at $PROJECT_DIR/ai-generated/requirements.md

Include sections for:
- Project Overview
- Functional Requirements
- Technical Architecture
EOF

# Run Claude
cd "$TEMP_DIR"
timeout 30s claude --mcp-config mcp.json --continue --dangerously-skip-permissions < prompt.txt

# Check result
if [ -f "$PROJECT_DIR/ai-generated/requirements.md" ]; then
    echo "✅ Success!"
    wc -l "$PROJECT_DIR/ai-generated/requirements.md"
else
    echo "❌ Failed"
fi

# Cleanup
rm -rf "$TEMP_DIR"