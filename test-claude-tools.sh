#!/bin/bash

PROJECT_ID="cvp-api-service-customer-service-bot"
OUTPUT_DIR="/home/sali/ai/projects/projecthubv3/projects/$PROJECT_ID/ai-generated"

echo "Testing Claude with filesystem tools..."

# Simple test prompt
echo "Create a file at $OUTPUT_DIR/test.txt with the content 'Hello from Claude'" | \
  claude --allowedTools Write --add-dir "$OUTPUT_DIR" --dangerously-skip-permissions

# Check if file was created
if [ -f "$OUTPUT_DIR/test.txt" ]; then
  echo "✅ Test file created!"
  cat "$OUTPUT_DIR/test.txt"
  rm "$OUTPUT_DIR/test.txt"
else
  echo "❌ Test file not created"
fi