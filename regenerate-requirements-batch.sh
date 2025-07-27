#!/bin/bash

# Run the Node.js script in the background with nohup
# This allows it to continue running even if the terminal is closed

echo "Starting batch requirements regeneration..."
echo "This will process 2,263 projects and may take several hours."
echo ""
echo "The process will run in the background."
echo "Check progress in: regenerate-progress.log"
echo "Check errors in: regenerate-errors.log"
echo ""

# Create log files
touch regenerate-progress.log
touch regenerate-errors.log

# Run the script in background
nohup node regenerate-all-missing-requirements.js > regenerate-progress.log 2> regenerate-errors.log &

# Get the process ID
PID=$!
echo "Process started with PID: $PID"
echo ""
echo "To check progress: tail -f regenerate-progress.log"
echo "To check if still running: ps -p $PID"
echo "To stop the process: kill $PID"

# Save PID to file for later reference
echo $PID > regenerate.pid

echo ""
echo "Initial progress:"
sleep 5
tail -20 regenerate-progress.log