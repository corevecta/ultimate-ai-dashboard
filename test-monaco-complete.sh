#!/bin/bash

echo "🚀 Starting Monaco Complete Test..."

# Kill any existing processes
pkill -f "next dev" 2>/dev/null
pkill -f "chromium" 2>/dev/null

# Start dev server in background
echo "Starting development server..."
cd /home/sali/ai/projects/projecthubv3/ultimate-ai-dashboard
npm run dev &
DEV_PID=$!

# Wait for server to be ready
echo "Waiting for server to start..."
sleep 15

# Check if server is running
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Server is running"
else
    echo "❌ Server failed to start"
    exit 1
fi

# Run Puppeteer test
echo "Running Monaco tests..."
node test-monaco-errors.js

# Keep server running for manual testing
echo ""
echo "Server is still running on http://localhost:3000"
echo "Press Ctrl+C to stop the server"

# Wait for Ctrl+C
trap "echo 'Stopping server...'; kill $DEV_PID; exit" INT
wait