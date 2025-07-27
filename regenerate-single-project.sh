#!/bin/bash

# Script to regenerate requirements for a single project
# Usage: ./regenerate-single-project.sh <project-id>

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

# Create prompt file
cat > "$TEMP_DIR/prompt.txt" << EOF
Read the specification file at: $SPEC_FILE

Based on this specification, create a comprehensive requirements document and write it to: $OUTPUT_FILE

The requirements document MUST be at least 3000 words and include ALL of the following sections:

1. Executive Summary (200+ words)
2. Project Overview (300+ words)
   - Vision and mission
   - Business context and market opportunity
   - Target audience analysis
   - Value propositions

3. Detailed Functional Requirements (800+ words)
   - Core features (with detailed specifications for each)
   - Premium features (if applicable)
   - Enterprise features (if applicable)
   - User workflows and scenarios

4. Non-Functional Requirements (400+ words)
   - Performance requirements
   - Scalability requirements
   - Reliability and availability
   - Usability standards
   - Compatibility requirements

5. User Stories (500+ words)
   - Multiple user stories for each major feature
   - Acceptance criteria for each story
   - Priority levels

6. Technical Architecture (500+ words)
   - System architecture overview
   - Technology stack details
   - Component descriptions
   - Data flow diagrams (described in text)
   - Third-party integrations

7. Security Requirements (300+ words)
   - Authentication and authorization
   - Data protection measures
   - Compliance requirements
   - Security best practices

8. API Specifications (if applicable)
   - Endpoint descriptions
   - Request/response formats
   - Authentication methods

9. Database Schema (if applicable)
   - Entity descriptions
   - Relationships
   - Key constraints

10. UI/UX Requirements (300+ words)
    - Design principles
    - User interface guidelines
    - Accessibility requirements
    - Responsive design specifications

11. Testing Strategy (200+ words)
    - Unit testing approach
    - Integration testing
    - User acceptance testing
    - Performance testing

12. Deployment Architecture (200+ words)
    - Infrastructure requirements
    - Deployment process
    - Monitoring and logging
    - Backup and recovery

Be extremely detailed and specific to THIS project based on the specification.yaml content. Do not use generic placeholder text.
EOF

# Run Claude
cd "$TEMP_DIR"
echo "Running Claude CLI..."
claude --mcp-config mcp-config.json --continue --dangerously-skip-permissions < prompt.txt

# Check result
if [ -f "$OUTPUT_FILE" ]; then
    SIZE=$(stat -f%z "$OUTPUT_FILE" 2>/dev/null || stat -c%s "$OUTPUT_FILE" 2>/dev/null || echo "0")
    echo "✅ Success! Requirements file created ($SIZE bytes)"
else
    echo "❌ Failed to create requirements file"
fi

# Cleanup
rm -rf "$TEMP_DIR"