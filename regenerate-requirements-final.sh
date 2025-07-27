#!/bin/bash

# Final working version of requirements regeneration script
# Usage: ./regenerate-requirements-final.sh <project-id>

if [ $# -eq 0 ]; then
    echo "Usage: $0 <project-id>"
    exit 1
fi

PROJECT_ID="$1"
PROJECT_DIR="/home/sali/ai/projects/projecthubv3/projects/$PROJECT_ID"
SPEC_FILE="$PROJECT_DIR/ai-generated/specification.yaml"
OUTPUT_FILE="$PROJECT_DIR/ai-generated/requirements.md"

if [ ! -f "$SPEC_FILE" ]; then
    echo "❌ Specification file not found: $SPEC_FILE"
    exit 1
fi

echo "🚀 Regenerating requirements for: $PROJECT_ID"

# Create temp directory
TEMP_DIR="/tmp/claude-req-$$"
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

# Create prompt that we know works
cat > "$TEMP_DIR/prompt.txt" << EOF
Read the specification at: $SPEC_FILE

Create a comprehensive requirements document at: $OUTPUT_FILE

Include these sections:
1. Executive Summary
2. Project Overview (with business context from the spec)
3. Functional Requirements (detailed for all features: core, premium, enterprise)
4. Non-Functional Requirements
5. User Stories (at least 2 per major feature)
6. Technical Architecture
7. Security Requirements
8. API Specifications
9. Database Schema
10. UI/UX Requirements
11. Testing Strategy
12. Deployment Architecture

Make it comprehensive (2000+ words) and specific to this project's actual features and business model from the specification.
EOF

# Run Claude with timeout
cd "$TEMP_DIR"
echo "Running Claude CLI (this may take 30-60 seconds)..."

# Use timeout to prevent hanging
timeout 90s claude --mcp-config mcp-config.json --continue --dangerously-skip-permissions < prompt.txt > output.log 2>&1

# Check result
if [ -f "$OUTPUT_FILE" ]; then
    SIZE=$(stat -f%z "$OUTPUT_FILE" 2>/dev/null || stat -c%s "$OUTPUT_FILE" 2>/dev/null || echo "0")
    LINES=$(wc -l < "$OUTPUT_FILE")
    echo "✅ Success! Requirements file created"
    echo "   Size: $SIZE bytes"
    echo "   Lines: $LINES"
else
    echo "❌ Failed to create requirements file"
    echo "Claude output:"
    tail -20 output.log
fi

# Cleanup
rm -rf "$TEMP_DIR"