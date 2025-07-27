#!/bin/bash

# Batch regenerate requirements for all projects
# Runs 6 parallel workers

PROJECTS_DIR="/home/sali/ai/projects/projecthubv3/projects"
MAX_JOBS=6
TOTAL=0
PROCESSED=0
SUCCESS=0
FAILED=0

# Get all projects with specification.yaml
PROJECTS=()
for dir in "$PROJECTS_DIR"/*; do
    if [ -d "$dir" ] && [ -f "$dir/ai-generated/specification.yaml" ]; then
        PROJECTS+=("$(basename "$dir")")
        ((TOTAL++))
    fi
done

echo "🚀 Starting batch requirements regeneration"
echo "   Total projects: $TOTAL"
echo "   Parallel workers: $MAX_JOBS"
echo ""

# Function to process a project
process_project() {
    local project_id=$1
    local index=$2
    
    echo "[$index/$TOTAL] Starting: $project_id"
    
    if ./regenerate-single-project.sh "$project_id" > "/tmp/regen-$project_id.log" 2>&1; then
        echo "✅ [$index/$TOTAL] Success: $project_id"
        return 0
    else
        echo "❌ [$index/$TOTAL] Failed: $project_id"
        cat "/tmp/regen-$project_id.log" | grep -E "❌|Error"
        return 1
    fi
}

# Process in batches
for i in "${!PROJECTS[@]}"; do
    # Wait if we have too many jobs
    while [ $(jobs -r | wc -l) -ge $MAX_JOBS ]; do
        sleep 1
    done
    
    # Start new job
    process_project "${PROJECTS[$i]}" $((i + 1)) &
    
    # Update progress
    ((PROCESSED++))
    
    # Show progress every 10 projects
    if [ $((PROCESSED % 10)) -eq 0 ]; then
        wait # Wait for current batch to finish
        
        # Count successes
        SUCCESS=$(find "$PROJECTS_DIR"/*/ai-generated -name "requirements.md" -newer /tmp/batch-start 2>/dev/null | wc -l)
        FAILED=$((PROCESSED - SUCCESS))
        
        echo ""
        echo "📊 Progress: $PROCESSED/$TOTAL ($(( PROCESSED * 100 / TOTAL ))%)"
        echo "   Success: $SUCCESS, Failed: $FAILED"
        echo ""
    fi
done

# Wait for all jobs to complete
wait

# Final count
echo ""
echo "✨ Batch regeneration complete!"
echo "   Total: $TOTAL projects"

# Count final results
SUCCESS=0
for project in "${PROJECTS[@]}"; do
    if [ -f "$PROJECTS_DIR/$project/ai-generated/requirements.md" ]; then
        ((SUCCESS++))
    fi
done
FAILED=$((TOTAL - SUCCESS))

echo "   Success: $SUCCESS"
echo "   Failed: $FAILED"

# Cleanup
rm -f /tmp/regen-*.log