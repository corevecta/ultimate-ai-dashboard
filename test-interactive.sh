#!/bin/bash

PROJECT_ID="cvp-api-service-customer-service-bot"
PROJECT_DIR="/home/sali/ai/projects/projecthubv3/projects/$PROJECT_ID"

# Create MCP config
TEMP_DIR="/tmp/claude-interactive-$$"
mkdir -p "$TEMP_DIR"

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

echo "🚀 Starting interactive Claude session..."
echo "📁 Project: $PROJECT_ID"
echo ""
echo "Please type this command when Claude starts:"
echo "Read $PROJECT_DIR/ai-generated/specification.yaml and create requirements at $PROJECT_DIR/ai-generated/requirements.md"
echo ""
echo "Press Ctrl+D when done"
echo ""

cd "$TEMP_DIR"
claude --mcp-config mcp.json --continue --dangerously-skip-permissions

# Cleanup
rm -rf "$TEMP_DIR"