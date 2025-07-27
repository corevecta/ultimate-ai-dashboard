#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Test with a single Chrome extension project
const projectId = 'cvp-chrome-extension-a-b-test-stats-overlay-for-landing-pages-in-browser';
const projectDir = `/home/sali/ai/projects/projecthubv3/projects/${projectId}`;
const outputFile = path.join(projectDir, 'ai-generated', 'requirements.md');

// Chrome extension prompt
const prompt = `Create comprehensive requirements for this Chrome Extension project.

CRITICAL: The specification YAML may contain errors, placeholders, or mismatches. Analyze it critically and fix ALL issues.

FIRST, VERIFY THE PLATFORM TYPE:
- Check if the project ID starts with 'cvp-chrome-extension-'
- Verify the specification's project.type matches 'chrome-extension'
- If there's a mismatch, THIS IS A CHROME EXTENSION - treat it as such regardless of what the spec says

Generate a PRACTICAL, FEATURE-RICH requirements document that:

1. **Covers EVERY section from the specification** including:
   - Project details, vision, and unique value proposition
   - Complete market analysis (TAM/SAM/SOM) with real numbers
   - ALL features (core, advanced, premium, enterprise) - expand empty arrays with real features
   - Full technical architecture and infrastructure details
   - Complete monetization strategy with specific pricing and projections
   - Development phases and timelines
   - All integrations and third-party services
   - Security, compliance, and performance requirements

2. **Focuses on Chrome Extension specifics**:
   - Manifest V3 compliance and permissions
   - Chrome Web Store optimization
   - Extension-specific technical constraints
   - Browser API usage and limitations

3. **Makes it implementation-ready**:
   - Detailed feature descriptions with user stories
   - Clear monetization path with conversion strategies
   - Specific technical implementation details
   - Actionable development roadmap
   - Measurable success metrics

4. **Fixes all specification issues**:
   - Replace empty arrays with comprehensive lists
   - Fix any platform mismatches (this is a Chrome Extension, not SaaS)
   - Add missing details based on the project name and purpose
   - Ensure consistency throughout

Output a requirements document that a developer can use TODAY to start building this product.

YOUR TASK:
1. Read the specification file: ${path.join(projectDir, 'ai-generated', 'specification.yaml')}
2. Also read if it exists: ${path.join(projectDir, 'ai-generated', 'market-enhanced-spec.yaml')}
3. Generate comprehensive requirements (minimum 4000 words)
4. Save to: ${outputFile}

REMEMBER: You have access to the FULL specification. Use EVERY section - project details, market analysis, features, technical stack, monetization, integrations, etc. Fix any empty arrays, placeholder content, or inconsistencies.

Start by reading the specification files now.`;

console.log(`🧪 Testing with project: ${projectId}`);
console.log(`📁 Output will be saved to: ${outputFile}`);

const startTime = Date.now();

const claude = spawn('claude', [
  '--allowedTools', 'Read,Write',
  '--add-dir', projectDir,
  '--dangerously-skip-permissions'
], {
  stdio: ['pipe', 'inherit', 'inherit']
});

claude.stdin.write(prompt);
claude.stdin.end();

claude.on('close', (code) => {
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  
  if (fs.existsSync(outputFile)) {
    const content = fs.readFileSync(outputFile, 'utf-8');
    const wordCount = content.split(/\s+/).length;
    console.log(`\n✅ Success! Generated ${wordCount} words in ${duration}s`);
    console.log(`📄 Requirements saved to: ${outputFile}`);
    
    // Show first few lines
    const lines = content.split('\n').slice(0, 20);
    console.log('\n📝 Preview:');
    console.log('---');
    lines.forEach(line => console.log(line));
    console.log('...');
  } else {
    console.log(`\n❌ Failed to generate requirements`);
  }
});