#!/bin/bash

# Practical requirements regeneration script

PROJECT_ID="${1:-cvp-api-service-customer-service-bot}"
PROJECT_DIR="/home/sali/ai/projects/projecthubv3/projects/$PROJECT_ID"
SPEC_FILE="$PROJECT_DIR/ai-generated/specification.yaml"
OUTPUT_FILE="$PROJECT_DIR/ai-generated/requirements.md"

if [ ! -f "$SPEC_FILE" ]; then
    echo "❌ No specification found for $PROJECT_ID"
    exit 1
fi

echo "🚀 Regenerating requirements for: $PROJECT_ID"

# Use Python to parse YAML properly
PROJECT_INFO=$(python3 -c "
import yaml
with open('$SPEC_FILE', 'r') as f:
    spec = yaml.safe_load(f)
    print(f'NAME:{spec.get(\"project\", {}).get(\"name\", \"Unknown\")}')
    print(f'TYPE:{spec.get(\"project\", {}).get(\"type\", \"Unknown\")}')
    print(f'DESC:{spec.get(\"project\", {}).get(\"description\", \"No description\")}')
" 2>/dev/null)

PROJECT_NAME=$(echo "$PROJECT_INFO" | grep "NAME:" | cut -d: -f2-)
PROJECT_TYPE=$(echo "$PROJECT_INFO" | grep "TYPE:" | cut -d: -f2-)
PROJECT_DESC=$(echo "$PROJECT_INFO" | grep "DESC:" | cut -d: -f2-)

# Extract features section (simplified)
FEATURES=$(awk '/features:/{flag=1;next}/^[^ ]/{flag=0}flag' "$SPEC_FILE" | head -20)

# Extract technical stack
TECH_STACK=$(awk '/technical:/{flag=1;next}/^[^ ]/{flag=0}flag' "$SPEC_FILE" | grep -E "stack:|platform:" | head -10)

# Extract business model
BUSINESS=$(awk '/business:/{flag=1;next}/^[^ ]/{flag=0}flag' "$SPEC_FILE" | head -15)

echo "📊 Extracted project info:"
echo "   Name: $PROJECT_NAME"
echo "   Type: $PROJECT_TYPE"
echo "   Description: ${PROJECT_DESC:0:60}..."

# Create focused prompt
PROMPT="Create a comprehensive requirements document for the following project:

PROJECT: $PROJECT_NAME
TYPE: $PROJECT_TYPE
DESCRIPTION: $PROJECT_DESC

KEY FEATURES:
$FEATURES

TECHNICAL INFO:
$TECH_STACK

BUSINESS MODEL:
$BUSINESS

Write a detailed requirements document with these sections:
1. Executive Summary
2. Project Overview
3. Functional Requirements (based on the features above)
4. Technical Architecture
5. User Stories (2-3 per feature)
6. Security Requirements
7. Testing Strategy
8. Deployment Architecture

Make it specific to this project. Generate at least 150 lines of content."

# Save prompt for debugging
echo "$PROMPT" > "/tmp/prompt-$PROJECT_ID.txt"

# Run Claude with timeout
echo "$PROMPT" | timeout 45s claude --continue > "$OUTPUT_FILE.tmp" 2>/dev/null

# Check result
if [ -s "$OUTPUT_FILE.tmp" ] && [ $(wc -l < "$OUTPUT_FILE.tmp") -gt 50 ]; then
    mv "$OUTPUT_FILE.tmp" "$OUTPUT_FILE"
    SIZE=$(stat -c%s "$OUTPUT_FILE" 2>/dev/null || stat -f%z "$OUTPUT_FILE" 2>/dev/null || echo "0")
    LINES=$(wc -l < "$OUTPUT_FILE")
    echo "✅ Success! Requirements created"
    echo "   Size: $SIZE bytes"
    echo "   Lines: $LINES"
else
    rm -f "$OUTPUT_FILE.tmp"
    echo "❌ Failed or insufficient output"
    if [ -f "/tmp/prompt-$PROJECT_ID.txt" ]; then
        echo "   Check prompt at: /tmp/prompt-$PROJECT_ID.txt"
    fi
fi