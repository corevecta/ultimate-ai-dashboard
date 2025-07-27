#!/bin/bash

# Minimal test without MCP
PROJECT_ID="cvp-api-service-customer-service-bot"
SPEC_FILE="/home/sali/ai/projects/projecthubv3/projects/$PROJECT_ID/ai-generated/specification.yaml"

echo "Testing without MCP..."

# Read spec content
SPEC_CONTENT=$(head -50 "$SPEC_FILE" | sed 's/"/\\"/g')

# Simple prompt
echo "Based on this specification snippet, write a brief project overview:

$SPEC_CONTENT

Just write a 2-3 sentence overview." | claude --continue