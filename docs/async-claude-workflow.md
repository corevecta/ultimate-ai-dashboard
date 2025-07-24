# Async Claude CLI Job Queue Workflow

## Overview

The Step 0 orchestrator now implements an asynchronous job queue system to handle Claude CLI operations that take longer than typical HTTP timeout limits (25+ seconds).

## Architecture

### 1. Job Queue System (`/lib/job-queue.ts`)
- In-memory job storage (can be upgraded to Redis/PostgreSQL)
- Job states: `pending`, `processing`, `completed`, `failed`
- Background job processor runs every second
- Jobs auto-cleanup after 1 hour

### 2. API Workflow

#### POST `/api/orchestrator/step0`
1. Creates a new job with status `pending`
2. Returns immediately with job ID
3. Job processor picks up the job and runs Claude CLI
4. Claude writes requirements to `/tmp/step0-requirements-{timestamp}.md`
5. Job reads the file and updates status to `completed`

#### GET `/api/orchestrator/step0?jobId={id}`
- Returns current job status
- If completed, includes the generated requirements
- If failed, includes error message

### 3. UI Polling (`step0-dialog-v3.tsx`)
1. After receiving job ID, starts polling every 2 seconds
2. Updates UI to show "Processing..." status
3. When job completes, displays requirements for review
4. Handles errors gracefully

## Claude CLI Integration

The system uses MCP filesystem to enable Claude to write files:

```bash
# Claude writes to file with this prompt structure:
IMPORTANT: Write your complete response to this file: /tmp/step0-requirements-{timestamp}.md
After writing the file, respond with only: DONE
```

## Benefits

1. **No Timeouts**: Can handle Claude generation that takes 25+ seconds
2. **Better UX**: User sees real-time status updates
3. **Scalable**: Can be upgraded to use Redis/PostgreSQL queue
4. **Reliable**: File-based output ensures content is captured

## Testing

Run the test script:
```bash
node test-async-job-queue.js
```

This will:
1. Start a requirements generation job
2. Poll for status updates
3. Display the generated requirements when complete

## Future Improvements

1. **Redis Queue**: Replace in-memory storage with Redis for persistence
2. **Worker Processes**: Separate job processing into worker processes
3. **Progress Updates**: Add progress percentage during generation
4. **Batch Processing**: Support multiple jobs in parallel
5. **Webhooks**: Notify UI via websockets instead of polling