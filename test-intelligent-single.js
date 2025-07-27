#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Test with a chrome extension that was miscategorized
const projectId = 'cvp-chrome-extension-a-b-test-stats-overlay-for-landing-pages-in-browser';
const projectDir = `/home/sali/ai/projects/projecthubv3/projects/${projectId}`;
const outputFile = path.join(projectDir, 'ai-generated', 'requirements-test.md');

// Single powerful prompt that works for all platforms
const INTELLIGENT_PROMPT = `You are creating comprehensive requirements for a software project.

YOUR INTELLIGENT ANALYSIS TASK:
1. Read the specification YAML file
2. Examine the project folder name and structure
3. Analyze the project name and description
4. DETERMINE the correct platform type based on ALL available evidence:
   - Project ID pattern (cvp-[platform]-[name])
   - Project name and description content
   - Features mentioned in the specification
   - Technical stack choices
   - File structure and context

PLATFORM DETECTION RULES:
- Chrome Extension: project ID contains 'chrome-extension', or name/features mention browser extension, Chrome, manifest, etc.
- API Service: project ID contains 'api-service', 'api-rest', 'api-graphql', or features describe API endpoints, microservices
- Mobile App: project ID contains 'mobile-app', 'android-app', 'ios-app', or features mention mobile, app stores
- Web App: project ID contains 'web-app', 'saas', 'pwa', or features describe web application, SaaS platform
- Discord Bot: project ID contains 'discord-bot', or features mention Discord commands, bot functionality
- CLI Tool: project ID contains 'cli-tool', or features describe command-line interface, terminal commands

CRITICAL INSTRUCTIONS:
1. If the specification's project.type is WRONG (doesn't match the evidence), OVERRIDE IT
2. Fix ALL discrepancies, empty arrays, and placeholder content
3. Generate requirements that match the ACTUAL platform type you determined
4. Include platform-specific technical requirements, constraints, and best practices

REQUIREMENTS DOCUMENT STRUCTURE:
Based on the platform you identify, create a comprehensive, implementation-ready document following this EXACT structure:

# [Project Name] - [Platform Type] Requirements

## 1. Product Overview
- **Purpose**: [Clear 1-2 sentence description of what it does]
- **Target Users**: [Specific user segments who will pay for this]
- **Core Value Proposition**: [What unique problem it solves]
- **Competitive Advantage**: [Why users would choose this over alternatives]

## 2. Core Features (MVP - Version 1.0)
List 5-7 essential features for launch:
### Feature 1: [Feature Name]
- **Description**: [What it does]
- **User Benefit**: [Why users need this]
- **Technical Implementation**: [Key tech/APIs needed]
- **Success Metrics**: [How to measure if it works]

[Repeat for each core feature - DO NOT USE EMPTY ARRAYS]

## 3. Monetization Strategy
### Primary Revenue Model
- **Model Type**: [Freemium/Subscription/One-time/Usage-based]
- **Pricing Tiers**:
  - Free: [What's included]
  - Pro ($X/month): [Premium features]
  - Enterprise (Custom): [Enterprise features]
- **Payment Integration**: [Specific payment provider]
- **Expected Conversion Rate**: [X% free to paid]

### Revenue Projections
- Month 1-3: [Conservative estimate]
- Month 4-6: [Growth phase]
- Year 1 Target: [Annual revenue goal]

## 4. Technical Architecture
### Technology Stack
- **Frontend**: [Specific frameworks and versions]
- **Backend**: [If needed - specific tech]
- **Database**: [If needed - specific DB]
- **Third-party Services**: [List all integrations]

### Platform-Specific Requirements
[Include requirements specific to the platform type you identified]

## 5. User Experience Flow
### Installation/Onboarding Flow
1. [Step-by-step first-time user experience]

### Daily Usage Flow
1. [How users interact daily]

### Upgrade Flow
1. [How free users discover and upgrade to premium]

## 6. Development Roadmap
### Phase 1 - MVP (Month 1-2)
- [ ] Core feature implementation
- [ ] Basic monetization setup
- [ ] Platform distribution preparation

### Phase 2 - Growth (Month 3-4)
- [ ] Premium features
- [ ] Analytics integration
- [ ] User feedback implementation

### Phase 3 - Scale (Month 5-6)
- [ ] Enterprise features
- [ ] API/integrations
- [ ] International expansion

## 7. Success Metrics & KPIs
### User Metrics
- **Install/Download Rate**: Target X per day
- **Daily Active Users**: X% of total users
- **Retention**: X% after 7 days, Y% after 30 days

### Business Metrics
- **Conversion Rate**: X% free to paid
- **Monthly Recurring Revenue**: $X by month 6
- **Customer Acquisition Cost**: <$X
- **Lifetime Value**: >$X

## 8. Launch Strategy
### Pre-launch (2 weeks before)
- [ ] Beta testing with target users
- [ ] Marketing materials preparation
- [ ] Documentation and support setup

### Launch Week
- [ ] Platform submission/deployment
- [ ] Marketing campaign launch
- [ ] Community outreach

### Post-launch (First month)
- [ ] Daily monitoring and fixes
- [ ] User feedback collection
- [ ] Feature prioritization

QUALITY REQUIREMENTS:
- Minimum 3500 words
- Specific, actionable content (no generic fluff)
- Implementation-ready details
- Fix ALL specification issues
- Ensure consistency throughout

Remember: You're the expert. Analyze everything available and make intelligent decisions about what this project REALLY is, regardless of what the specification claims.

YOUR SPECIFIC TASK:
1. Read the specification file: ${path.join(projectDir, 'ai-generated', 'specification.yaml')}
2. Also read if it exists: ${path.join(projectDir, 'ai-generated', 'market-enhanced-spec.yaml')}
3. Examine the project ID: ${projectId}
4. Analyze ALL available context to determine the correct platform
5. Generate comprehensive requirements based on your platform determination
6. Save to: ${outputFile}

Remember: Use your intelligence to determine what this project REALLY is, not what the spec claims.
Fix all issues and create implementation-ready requirements.

Start by reading the specification files now.`;

console.log(`🧪 Testing intelligent prompt with: ${projectId}`);
console.log(`📁 Output: ${outputFile}`);

const startTime = Date.now();

const claude = spawn('claude', [
  '--allowedTools', 'Read,Write',
  '--add-dir', projectDir,
  '--dangerously-skip-permissions'
], {
  stdio: ['pipe', 'inherit', 'inherit']
});

claude.stdin.write(INTELLIGENT_PROMPT);
claude.stdin.end();

claude.on('close', (code) => {
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  
  if (fs.existsSync(outputFile)) {
    const content = fs.readFileSync(outputFile, 'utf-8');
    const wordCount = content.split(/\s+/).length;
    console.log(`\n✅ Success! Generated ${wordCount} words in ${duration}s`);
    
    // Check quality indicators
    const hasMonetization = content.includes('Monetization Strategy');
    const hasChromeExt = content.includes('Chrome Extension');
    const hasFeatures = content.includes('Core Features');
    
    console.log('\n📊 Quality Check:');
    console.log(`   Monetization section: ${hasMonetization ? '✅' : '❌'}`);
    console.log(`   Chrome Extension focus: ${hasChromeExt ? '✅' : '❌'}`);
    console.log(`   Features section: ${hasFeatures ? '✅' : '❌'}`);
    console.log(`   Word count: ${wordCount >= 3500 ? '✅' : '❌'} (${wordCount} words)`);
  } else {
    console.log(`\n❌ Failed to generate requirements`);
  }
});