#!/bin/bash

# Batch regenerate requirements for all projects
# Uses the working direct approach with parallel execution

PROJECTS_DIR="/home/sali/ai/projects/projecthubv3/projects"
MAX_PARALLEL=6
TOTAL=0
PROCESSED=0

echo "🚀 Starting batch requirements regeneration"
echo "⚙️  Configuration: $MAX_PARALLEL parallel workers"
echo ""

# Count total projects
for dir in "$PROJECTS_DIR"/*; do
    if [ -d "$dir" ] && [ -f "$dir/ai-generated/specification.yaml" ]; then
        ((TOTAL++))
    fi
done

echo "📊 Found $TOTAL projects to process"
echo ""

# Function to process a single project
process_project() {
    local project_id="$1"
    local index="$2"
    local project_dir="$PROJECTS_DIR/$project_id"
    
    echo "[$index/$TOTAL] Processing $project_id..."
    
    # Create inline MCP config
    MCP_CONFIG='{"mcpServers":{"filesystem":{"command":"npx","args":["-y","@modelcontextprotocol/server-filesystem","'$project_dir'"]}}}'
    
    # Run Claude with timeout
    if echo "Read $project_dir/ai-generated/specification.yaml and create a comprehensive requirements document at $project_dir/ai-generated/requirements.md with sections for Executive Summary, Project Overview, Functional Requirements (all features), Technical Architecture, Security, Testing Strategy, and Deployment. Make it specific to this project." | \
        timeout 60s claude --mcp-config <(echo "$MCP_CONFIG") --continue --dangerously-skip-permissions > /dev/null 2>&1; then
        
        if [ -f "$project_dir/ai-generated/requirements.md" ]; then
            local size=$(stat -f%z "$project_dir/ai-generated/requirements.md" 2>/dev/null || stat -c%s "$project_dir/ai-generated/requirements.md" 2>/dev/null || echo "0")
            echo "✅ [$index/$TOTAL] $project_id - Success ($size bytes)"
            return 0
        fi
    fi
    
    echo "❌ [$index/$TOTAL] $project_id - Failed"
    return 1
}

# Export function for parallel execution
export -f process_project
export PROJECTS_DIR

# Get all project IDs
PROJECT_IDS=()
for dir in "$PROJECTS_DIR"/*; do
    if [ -d "$dir" ] && [ -f "$dir/ai-generated/specification.yaml" ]; then
        PROJECT_IDS+=("$(basename "$dir")")
    fi
done

# Process in parallel using GNU parallel or xargs
if command -v parallel >/dev/null 2>&1; then
    echo "Using GNU parallel..."
    printf '%s\n' "${PROJECT_IDS[@]}" | parallel -j $MAX_PARALLEL --eta process_project {} {#}
else
    echo "Using xargs..."
    # Process with xargs (less elegant but works)
    for i in "${!PROJECT_IDS[@]}"; do
        while [ $(jobs -r | wc -l) -ge $MAX_PARALLEL ]; do
            sleep 1
        done
        
        process_project "${PROJECT_IDS[$i]}" $((i + 1)) &
        
        # Show progress every 10
        if [ $(( (i + 1) % 10 )) -eq 0 ]; then
            wait
            echo ""
            echo "📊 Progress: $((i + 1))/$TOTAL ($(( (i + 1) * 100 / TOTAL ))%)"
            echo ""
        fi
    done
    
    # Wait for remaining jobs
    wait
fi

# Final statistics
echo ""
echo "✨ Batch regeneration complete!"
echo ""

# Count results
SUCCESS=0
FAILED=0
for project_id in "${PROJECT_IDS[@]}"; do
    if [ -f "$PROJECTS_DIR/$project_id/ai-generated/requirements.md" ]; then
        ((SUCCESS++))
    else
        ((FAILED++))
    fi
done

echo "📊 Final Results:"
echo "   Total: $TOTAL projects"
echo "   Success: $SUCCESS ($(( SUCCESS * 100 / TOTAL ))%)"
echo "   Failed: $FAILED"
echo ""
echo "✅ Done!"