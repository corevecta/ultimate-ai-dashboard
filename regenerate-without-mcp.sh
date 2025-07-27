#!/bin/bash

# Regenerate requirements without MCP by embedding spec content

PROJECT_ID="${1:-cvp-api-service-customer-service-bot}"
PROJECT_DIR="/home/sali/ai/projects/projecthubv3/projects/$PROJECT_ID"
SPEC_FILE="$PROJECT_DIR/ai-generated/specification.yaml"
OUTPUT_FILE="$PROJECT_DIR/ai-generated/requirements.md"

if [ ! -f "$SPEC_FILE" ]; then
    echo "❌ No specification found for $PROJECT_ID"
    exit 1
fi

echo "🚀 Regenerating requirements for: $PROJECT_ID"

# Read entire spec file
SPEC_CONTENT=$(cat "$SPEC_FILE")

# Create comprehensive prompt with spec embedded
PROMPT="Based on the following specification, create a comprehensive requirements document.

=== SPECIFICATION CONTENT ===
$SPEC_CONTENT
=== END SPECIFICATION ===

Create a comprehensive requirements document with the following sections:

1. Executive Summary (200+ words)
2. Project Overview (300+ words)
   - Vision and mission
   - Business context and market opportunity
   - Target audience analysis
   - Value propositions

3. Functional Requirements (500+ words)
   - Detailed specifications for each core feature
   - Premium features (if any)
   - Enterprise features (if any)
   - User workflows

4. Non-Functional Requirements (300+ words)
   - Performance requirements
   - Scalability requirements
   - Security requirements
   - Usability standards

5. Technical Architecture (400+ words)
   - System architecture
   - Technology stack
   - Component descriptions
   - Integration points

6. User Stories (300+ words)
   - At least 2-3 user stories per major feature
   - Acceptance criteria

7. Testing Strategy (200+ words)
   - Testing approach
   - Test scenarios
   - Quality metrics

8. Deployment and Operations (200+ words)
   - Deployment architecture
   - Monitoring strategy
   - Maintenance requirements

Be specific to THIS project's actual features and requirements from the specification. Make it comprehensive and detailed."

# Run Claude and save output
echo "$PROMPT" | claude --continue > "$OUTPUT_FILE.tmp"

# Check if output was created
if [ -s "$OUTPUT_FILE.tmp" ]; then
    mv "$OUTPUT_FILE.tmp" "$OUTPUT_FILE"
    SIZE=$(stat -c%s "$OUTPUT_FILE" 2>/dev/null || stat -f%z "$OUTPUT_FILE" 2>/dev/null || echo "0")
    LINES=$(wc -l < "$OUTPUT_FILE")
    echo "✅ Success! Requirements created"
    echo "   Size: $SIZE bytes"
    echo "   Lines: $LINES"
else
    rm -f "$OUTPUT_FILE.tmp"
    echo "❌ Failed to generate requirements"
fi