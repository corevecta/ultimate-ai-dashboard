#!/bin/bash

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}Starting Ultimate AI Dashboard and running tests...${NC}\n"

# Kill any existing processes
echo "Cleaning up existing processes..."
pkill -f "next dev" || true
sleep 2

# Start the server in background
echo -e "${YELLOW}Starting Next.js server on port 3002...${NC}"
cd apps/web
nohup pnpm dev -p 3002 > server.log 2>&1 &
SERVER_PID=$!
echo "Server PID: $SERVER_PID"

# Wait for server to be ready
echo -e "${YELLOW}Waiting for server to be ready...${NC}"
for i in {1..30}; do
  if curl -s http://localhost:3002 > /dev/null; then
    echo -e "${GREEN}✓ Server is ready!${NC}"
    break
  fi
  echo -n "."
  sleep 2
done

# Check if server is actually running
if ! curl -s http://localhost:3002 > /dev/null; then
  echo -e "${RED}✗ Server failed to start${NC}"
  echo "Server log:"
  tail -n 50 server.log
  kill $SERVER_PID 2>/dev/null
  exit 1
fi

# Run Puppeteer test
echo -e "\n${YELLOW}Running Puppeteer tests...${NC}"
cd ../..
node test-headless.js

# Capture exit code
TEST_EXIT_CODE=$?

# Show server errors if any
echo -e "\n${YELLOW}Checking server logs for errors...${NC}"
cd apps/web
if grep -i "error" server.log | grep -v "Error:" | head -10; then
  echo -e "${RED}Errors found in server log${NC}"
else
  echo -e "${GREEN}No errors in server log${NC}"
fi

# Clean up
echo -e "\n${YELLOW}Cleaning up...${NC}"
kill $SERVER_PID 2>/dev/null

if [ $TEST_EXIT_CODE -eq 0 ]; then
  echo -e "\n${GREEN}✓ All tests passed!${NC}"
else
  echo -e "\n${RED}✗ Tests failed${NC}"
  exit $TEST_EXIT_CODE
fi