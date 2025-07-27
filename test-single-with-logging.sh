#!/bin/bash

# Test script with detailed logging

PROJECT_ID="${1:-cvp-api-service-customer-service-bot}"
PROJECT_DIR="/home/sali/ai/projects/projecthubv3/projects/$PROJECT_ID"
LOG_FILE="/tmp/claude-test-$PROJECT_ID.log"

echo "🧪 Testing requirements generation for: $PROJECT_ID"
echo "📁 Project directory: $PROJECT_DIR"
echo "📝 Log file: $LOG_FILE"

# Check if spec exists
if [ ! -f "$PROJECT_DIR/ai-generated/specification.yaml" ]; then
    echo "❌ No specification.yaml found"
    exit 1
fi

echo "✅ Found specification.yaml"

# Remove existing requirements
rm -f "$PROJECT_DIR/ai-generated/requirements.md"

# Create MCP config
MCP_CONFIG='{"mcpServers":{"filesystem":{"command":"npx","args":["-y","@modelcontextprotocol/server-filesystem","'$PROJECT_DIR'"]}}}'

# Create simple prompt
PROMPT="Read the file at $PROJECT_DIR/ai-generated/specification.yaml and create a requirements document at $PROJECT_DIR/ai-generated/requirements.md with sections for Project Overview, Functional Requirements, and Technical Architecture."

echo "🚀 Running Claude..."
echo "Command: claude --mcp-config <(echo MCP_CONFIG) --continue --dangerously-skip-permissions"
echo ""

# Run with logging
(
    echo "$PROMPT" | \
    timeout 45s claude --mcp-config <(echo "$MCP_CONFIG") --continue --dangerously-skip-permissions
) 2>&1 | tee "$LOG_FILE"

# Check result
if [ -f "$PROJECT_DIR/ai-generated/requirements.md" ]; then
    SIZE=$(stat -c%s "$PROJECT_DIR/ai-generated/requirements.md" 2>/dev/null || echo "0")
    echo ""
    echo "✅ Success! Requirements created ($SIZE bytes)"
else
    echo ""
    echo "❌ Failed to create requirements"
    echo "Check log file: $LOG_FILE"
fi