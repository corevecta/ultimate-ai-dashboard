#!/usr/bin/env node

/**
 * Platform-Aware Requirements Generation - Final Version
 * Focuses on feature-rich, monetization-driven, and implementation-ready requirements
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const yaml = require('js-yaml');

const PROJECTS_DIR = '/home/sali/ai/projects/projecthubv3/projects';
const MAX_WORKERS = 5;
const PROGRESS_FILE = path.join(__dirname, '.platform-regeneration-progress.json');

// Enhanced platform-specific prompt templates with practical focus
const PLATFORM_PROMPTS = {
  'chrome-extension': {
    category: 'Browser Extensions',
    prompt: `You are creating requirements for a Chrome Extension project.

CRITICAL SPECIFICATION HANDLING:
The specification YAML may contain errors, discrepancies, or placeholder content. Analyze it critically and fix any issues in your output.

YOUR TASK: Create a PRACTICAL, IMPLEMENTATION-READY requirements document following this exact structure:

# [Project Name] - Chrome Extension Requirements

## 1. Product Overview
- **Purpose**: [Clear 1-2 sentence description of what the extension does]
- **Target Users**: [Specific user segments who will pay for this]
- **Core Value Proposition**: [What unique problem it solves]
- **Competitive Advantage**: [Why users would choose this over alternatives]

## 2. Core Features (MVP - Version 1.0)
List 5-7 essential features for launch:
### Feature 1: [Feature Name]
- **Description**: [What it does]
- **User Benefit**: [Why users need this]
- **Technical Implementation**: [Key Chrome APIs/tech needed]
- **Success Metrics**: [How to measure if it works]

[Repeat for each core feature]

## 3. Monetization Strategy
### Primary Revenue Model
- **Model Type**: [Freemium/Subscription/One-time/Usage-based]
- **Pricing Tiers**:
  - Free: [What's included]
  - Pro ($X/month): [Premium features]
  - Enterprise (Custom): [Enterprise features]
- **Payment Integration**: [Stripe/Paddle/Chrome Web Store payments]
- **Expected Conversion Rate**: [X% free to paid]

### Revenue Projections
- Month 1-3: [Conservative estimate]
- Month 4-6: [Growth phase]
- Year 1 Target: [Annual revenue goal]

## 4. Chrome Extension Specific Requirements
### Manifest V3 Configuration
- **Permissions Required**: [List specific permissions and justify each]
- **Content Scripts**: [Which sites/patterns to inject into]
- **Background Service Worker**: [Key background tasks]
- **Storage Requirements**: [chrome.storage.sync vs local]

### Chrome Web Store Listing
- **Category**: [Primary category]
- **Keywords**: [5-10 searchable keywords]
- **Screenshots Required**: [List 5 key screenshots to showcase]
- **Promotional Tile**: [280x280 graphic focus]

### Performance Requirements
- **Load Time**: < 100ms for popup
- **Memory Usage**: < 50MB active
- **Storage Limit**: 5MB sync, 10MB local
- **Network Requests**: Minimize and batch

## 5. User Experience Flow
### Installation Flow
1. [Step-by-step first-time user experience]

### Daily Usage Flow
1. [How users interact with the extension daily]

### Upgrade Flow
1. [How free users discover and upgrade to premium]

## 6. Technical Implementation
### Architecture
- **Frontend**: [React/Vue/Vanilla JS + specific libraries]
- **Backend API**: [If needed - Node.js/Python/Go]
- **Database**: [If needed - PostgreSQL/MongoDB]
- **Authentication**: [OAuth/JWT/Chrome identity]

### Third-party Integrations
- **Required APIs**: [List external services needed]
- **Analytics**: [Google Analytics/Mixpanel/Custom]
- **Error Tracking**: [Sentry/Bugsnag]
- **Payment Processing**: [Stripe/Paddle]

## 7. Development Roadmap
### Phase 1 - MVP (Month 1-2)
- [ ] Core feature implementation
- [ ] Basic monetization setup
- [ ] Chrome Web Store submission

### Phase 2 - Growth (Month 3-4)
- [ ] Premium features
- [ ] Analytics integration
- [ ] User feedback implementation

### Phase 3 - Scale (Month 5-6)
- [ ] Enterprise features
- [ ] API for integrations
- [ ] Team collaboration

## 8. Success Metrics & KPIs
### User Metrics
- **Install Rate**: Target X installs/day
- **Daily Active Users**: X% of installs
- **Retention**: X% after 7 days

### Business Metrics
- **Conversion Rate**: X% free to paid
- **Monthly Recurring Revenue**: $X by month 6
- **Customer Acquisition Cost**: <$X
- **Lifetime Value**: >$X

## 9. Risk Mitigation
### Technical Risks
- **Chrome API Changes**: [Mitigation strategy]
- **Performance Issues**: [Monitoring and optimization plan]

### Business Risks
- **Low Conversion**: [A/B testing plan]
- **Competition**: [Differentiation strategy]

## 10. Launch Strategy
### Pre-launch (2 weeks before)
- [ ] Beta testing with 50 users
- [ ] Prepare marketing materials
- [ ] Set up support docs

### Launch Week
- [ ] Submit to Chrome Web Store
- [ ] Product Hunt launch
- [ ] Reddit/community outreach

### Post-launch (First month)
- [ ] Daily monitoring and quick fixes
- [ ] User feedback collection
- [ ] Feature prioritization based on data

IMPORTANT Chrome Extension Constraints:
- Manifest V3 compliance (no remote code execution)
- 5MB package size limit for Chrome Web Store
- Content Security Policy restrictions
- Review process considerations (7-10 days)
- User privacy and data handling requirements`,
    minWords: 3000
  },

  'api-service': {
    category: 'API Services',
    prompt: `You are creating requirements for an API Service project.

CRITICAL SPECIFICATION HANDLING:
The specification YAML may contain errors, discrepancies, or placeholder content. Analyze it critically and fix any issues in your output.

YOUR TASK: Create a PRACTICAL, IMPLEMENTATION-READY requirements document following this exact structure:

# [Project Name] - API Service Requirements

## 1. Product Overview
- **Purpose**: [Clear description of the API's core functionality]
- **Target Developers**: [Who will integrate this API]
- **Core Value Proposition**: [What unique capabilities it provides]
- **API Type**: [REST/GraphQL/WebSocket/gRPC]

## 2. Core Endpoints (MVP - Version 1.0)
List 8-12 essential endpoints:

### Endpoint: POST /api/v1/[resource]
- **Purpose**: [What it does]
- **Request Body**: 
  \`\`\`json
  {
    "field": "type and description"
  }
  \`\`\`
- **Response**: 
  \`\`\`json
  {
    "field": "type and description"
  }
  \`\`\`
- **Rate Limit**: [Requests per minute]
- **Authentication**: [API Key/OAuth/JWT]

[Repeat for each core endpoint]

## 3. Monetization Strategy
### API Pricing Model
- **Free Tier**: 
  - [X requests/month]
  - [Basic endpoints only]
  - [Community support]
- **Pro Tier ($X/month)**: 
  - [X requests/month]
  - [All endpoints]
  - [Email support]
- **Enterprise (Custom)**: 
  - [Unlimited requests]
  - [SLA guarantee]
  - [Dedicated support]

### Usage Tracking
- **Metrics**: [Requests, unique users, endpoint usage]
- **Billing**: [Stripe/Paddle integration]
- **Overage Handling**: [Hard limit/pay-as-you-go]

## 4. Technical Architecture
### Infrastructure
- **Hosting**: [AWS/GCP/Azure specifics]
- **Database**: [PostgreSQL/MongoDB/Redis]
- **Caching**: [Redis/Memcached strategy]
- **CDN**: [CloudFlare/Fastly for global distribution]

### Performance Requirements
- **Response Time**: <200ms for 95th percentile
- **Uptime SLA**: 99.9% for paid tiers
- **Throughput**: [X requests/second]
- **Concurrent Connections**: [X simultaneous]

## 5. Authentication & Security
### Authentication Methods
- **API Keys**: [Generation and management]
- **OAuth 2.0**: [Scopes and flows]
- **JWT Tokens**: [Expiration and refresh]

### Security Measures
- **Rate Limiting**: [Per endpoint/tier]
- **DDoS Protection**: [CloudFlare/AWS Shield]
- **Input Validation**: [Schema validation]
- **Encryption**: [TLS 1.3, encryption at rest]

## 6. Developer Experience
### Documentation
- **API Reference**: [OpenAPI/Swagger spec]
- **Quick Start Guide**: [5-minute integration]
- **Code Examples**: [Python/JS/Go/Java]
- **Postman Collection**: [Pre-built requests]

### SDKs
- **Languages**: [Python, JavaScript, Go, Java]
- **Package Managers**: [npm, pip, Maven]
- **Auto-generation**: [OpenAPI Generator]

### Developer Portal
- **Features**: [API key management, usage dashboard]
- **Testing**: [Sandbox environment]
- **Support**: [Forums, chat, tickets]

## 7. Integration Features
### Webhooks
- **Events**: [List key events to notify]
- **Retry Logic**: [Exponential backoff]
- **Security**: [Webhook signatures]

### Batch Operations
- **Bulk Endpoints**: [For high-volume operations]
- **Async Processing**: [Job queues for long operations]
- **Results Retrieval**: [Polling/callback mechanisms]

## 8. Monitoring & Analytics
### Operational Metrics
- **Dashboards**: [Grafana/DataDog setup]
- **Alerts**: [Response time, error rate, usage spikes]
- **Logging**: [ELK stack or similar]

### Business Analytics
- **Usage Patterns**: [Popular endpoints, peak times]
- **Customer Metrics**: [Retention, upgrade rate]
- **Revenue Tracking**: [MRR, churn, LTV]

## 9. Compliance & Standards
### Industry Standards
- **REST**: [RESTful best practices]
- **Security**: [OWASP API Security Top 10]
- **Data Privacy**: [GDPR, CCPA compliance]

### SLA Commitments
- **Uptime**: [99.9% for paid tiers]
- **Support Response**: [<24h for Pro, <1h for Enterprise]
- **Bug Fix**: [Critical: 24h, Major: 72h]

## 10. Scaling Strategy
### Phase 1 - Launch (Month 1-2)
- [ ] Core endpoints live
- [ ] Basic documentation
- [ ] Free tier available

### Phase 2 - Growth (Month 3-6)
- [ ] SDK releases
- [ ] Premium features
- [ ] Webhook system

### Phase 3 - Enterprise (Month 7-12)
- [ ] Enterprise features
- [ ] Custom solutions
- [ ] Global expansion

IMPORTANT API Considerations:
- Versioning strategy (URL vs header)
- Backward compatibility commitments
- Deprecation policy (6-month notice)
- Status page and incident communication`,
    minWords: 3500
  },

  'mobile-app': {
    category: 'Mobile Applications',
    prompt: `You are creating requirements for a Mobile App project.

CRITICAL SPECIFICATION HANDLING:
The specification YAML may contain errors, discrepancies, or placeholder content. Analyze it critically and fix any issues in your output.

YOUR TASK: Create a PRACTICAL, IMPLEMENTATION-READY requirements document following this exact structure:

# [Project Name] - Mobile App Requirements

## 1. Product Overview
- **Purpose**: [Core functionality in 1-2 sentences]
- **Platform**: [iOS only/Android only/Cross-platform]
- **Target Users**: [Specific user demographics]
- **Market Opportunity**: [TAM and growth potential]

## 2. Core Features (MVP - Version 1.0)
List 8-10 essential features:

### Feature: [Feature Name]
- **Description**: [What it does]
- **User Story**: As a [user], I want to [action] so that [benefit]
- **Platform Considerations**: 
  - iOS: [Specific iOS implementation]
  - Android: [Specific Android implementation]
- **Offline Support**: [Yes/No and sync strategy]

[Repeat for each core feature]

## 3. Monetization Strategy
### Revenue Model
- **Model Type**: [Freemium/Subscription/Paid/In-app purchases]
- **Pricing**:
  - App Store: [$X or Free]
  - In-App Purchases: [List items and prices]
  - Subscription: [$X/month, $Y/year]
- **Platform Fees**: [30% first year, 15% after]

### Conversion Strategy
- **Free Trial**: [X days if applicable]
- **Paywall Placement**: [After X actions/days]
- **Premium Features**: [List exclusive features]

## 4. User Experience Design
### User Flows
1. **Onboarding Flow**:
   - Splash screen (2s max)
   - Permission requests (strategically placed)
   - Quick tutorial (3-5 screens)
   - Account creation (optional initially)

2. **Core User Journey**:
   - [Step-by-step main app flow]

3. **Monetization Flow**:
   - [How users discover premium features]

### UI/UX Requirements
- **Design System**: [Material Design/Human Interface Guidelines]
- **Accessibility**: [WCAG 2.1 AA compliance]
- **Localization**: [Initial languages]
- **Dark Mode**: [Required for modern apps]

## 5. Platform-Specific Requirements
### iOS Requirements
- **Minimum iOS Version**: iOS 15+
- **Device Support**: iPhone 8 and newer
- **iOS Features**:
  - Push Notifications (APNs)
  - Widgets support
  - Siri Shortcuts
  - iCloud sync

### Android Requirements
- **Minimum Android Version**: Android 8.0 (API 26)
- **Device Support**: 2GB RAM minimum
- **Android Features**:
  - Material You theming
  - Widgets support
  - Google Play Services
  - Work profiles support

## 6. Technical Architecture
### App Architecture
- **Pattern**: [MVVM/MVP/Clean Architecture]
- **Framework**: 
  - iOS: [SwiftUI/UIKit]
  - Android: [Jetpack Compose/XML]
  - Cross-platform: [React Native/Flutter]

### Backend Services
- **API**: [REST/GraphQL endpoint]
- **Database**: [Local: SQLite/Realm, Remote: Firebase/Custom]
- **Authentication**: [Firebase Auth/Auth0/Custom]
- **Push Notifications**: [FCM for both platforms]

### Third-party SDKs
- **Analytics**: [Firebase Analytics/Mixpanel]
- **Crash Reporting**: [Crashlytics/Sentry]
- **Payment Processing**: [StoreKit/Google Play Billing]
- **Ad Network**: [If applicable - AdMob/Facebook]

## 7. Performance Requirements
### App Performance
- **Launch Time**: <3 seconds cold start
- **Memory Usage**: <200MB typical usage
- **Battery Impact**: <5% per hour active use
- **Network**: Optimize for 3G connections

### Offline Functionality
- **Core Features**: [Which features work offline]
- **Data Sync**: [Conflict resolution strategy]
- **Storage Limit**: [Max local storage usage]

## 8. Security & Privacy
### Data Security
- **Encryption**: [At rest and in transit]
- **Authentication**: [Biometric + PIN/Password]
- **Token Management**: [Secure storage, refresh strategy]

### Privacy Compliance
- **App Store Privacy Labels**: [Data collected and usage]
- **Permissions**: [Minimal required permissions]
- **GDPR/CCPA**: [Compliance features]
- **Children's Privacy**: [COPPA if applicable]

## 9. App Store Optimization (ASO)
### Metadata
- **App Name**: [30 characters max]
- **Subtitle**: [30 characters, keyword rich]
- **Keywords**: [100 characters for iOS]
- **Description**: [Focus on first 3 lines]

### Visual Assets
- **Screenshots**: [5-7 per device type]
- **App Preview Video**: [15-30 seconds]
- **Icon**: [Memorable, scalable design]

## 10. Launch & Growth Strategy
### Pre-Launch (Month -1)
- [ ] Beta testing (TestFlight/Play Console)
- [ ] App Store assets preparation
- [ ] Press kit ready

### Launch (Month 1)
- [ ] Soft launch in test market
- [ ] App Store featuring pitch
- [ ] Initial marketing campaign

### Post-Launch (Month 2-6)
- [ ] Weekly updates based on feedback
- [ ] A/B testing monetization
- [ ] Feature expansion

### Success Metrics
- **Downloads**: [X in first month]
- **DAU/MAU**: [X% ratio]
- **Retention**: [D1: X%, D7: Y%, D30: Z%]
- **Revenue**: [$X MRR by month 6]

IMPORTANT Mobile App Constraints:
- App Store Review Guidelines compliance
- Google Play Policy compliance
- Platform-specific UI guidelines
- App size limits (iOS: 4GB, Android: 150MB APK)`,
    minWords: 4000
  },

  'web-app': {
    category: 'Web Applications',
    prompt: `You are creating requirements for a Web Application project.

CRITICAL SPECIFICATION HANDLING:
The specification YAML may contain errors, discrepancies, or placeholder content. Analyze it critically and fix any issues in your output.

YOUR TASK: Create a PRACTICAL, IMPLEMENTATION-READY requirements document following this exact structure:

# [Project Name] - Web Application Requirements

## 1. Product Overview
- **Purpose**: [Clear value proposition in 1-2 sentences]
- **Target Market**: [B2B/B2C and specific segments]
- **Core Problem Solved**: [Specific pain point addressed]
- **Competitive Edge**: [What makes this unique]

## 2. Core Features (MVP - Version 1.0)
List 10-15 essential features:

### Feature: [Feature Name]
- **Description**: [Detailed functionality]
- **User Value**: [Why users need this]
- **Implementation Priority**: [High/Medium/Low]
- **Estimated Development Time**: [X days]

[Repeat for each core feature]

## 3. Monetization Strategy
### Business Model
- **Primary Model**: [SaaS/Marketplace/Freemium/Advertising]
- **Pricing Structure**:
  - Starter: $X/month (or Free)
    - [Feature list]
    - [Usage limits]
  - Professional: $X/month
    - [Feature list]
    - [Usage limits]
  - Enterprise: Custom pricing
    - [Feature list]
    - [Custom solutions]

### Revenue Projections
- **Customer Acquisition Cost**: $X
- **Lifetime Value**: $X
- **Break-even**: Month X
- **Year 1 Target**: $X ARR

## 4. User Experience Architecture
### User Roles & Permissions
1. **Guest User**:
   - [View capabilities]
   - [Limited features]
2. **Registered User**:
   - [Full feature access]
   - [Personal dashboard]
3. **Admin**:
   - [Management capabilities]
   - [Analytics access]

### Key User Flows
1. **Onboarding**:
   - Landing page → Sign up → Email verification → Setup wizard → Dashboard

2. **Core Workflow**:
   - [Primary user journey through main features]

3. **Upgrade Flow**:
   - Feature limit reached → Upgrade prompt → Pricing page → Payment → Activation

## 5. Technical Specifications
### Frontend Architecture
- **Framework**: [React/Vue/Angular with specific version]
- **State Management**: [Redux/Zustand/Vuex]
- **UI Components**: [MUI/Ant Design/Custom]
- **Build Tools**: [Vite/Webpack]
- **Testing**: [Jest/Cypress]

### Backend Architecture
- **Framework**: [Node.js/Python/Ruby/Go]
- **API Design**: [REST/GraphQL]
- **Database**: [PostgreSQL/MongoDB]
- **Caching**: [Redis]
- **Queue**: [Bull/RabbitMQ]

### Infrastructure
- **Hosting**: [AWS/GCP/Vercel]
- **CDN**: [CloudFlare]
- **Monitoring**: [Datadog/New Relic]
- **CI/CD**: [GitHub Actions/GitLab CI]

## 6. Feature-Rich Functionality
### Dashboard & Analytics
- **Real-time Metrics**: [Key metrics displayed]
- **Custom Reports**: [User-generated reports]
- **Data Export**: [CSV/PDF/API]
- **Visualizations**: [Charts, graphs, heatmaps]

### Collaboration Features
- **Team Workspaces**: [Multi-user environments]
- **Real-time Updates**: [WebSocket/SSE]
- **Comments & Mentions**: [@mentions, threading]
- **Activity Feed**: [Audit trail]

### Automation & Integrations
- **Workflow Automation**: [If-this-then-that rules]
- **API Integrations**: [Zapier, native integrations]
- **Webhooks**: [Event notifications]
- **Import/Export**: [Bulk data operations]

## 7. Performance & Scalability
### Performance Targets
- **Page Load**: <2s for initial load
- **Time to Interactive**: <3s
- **API Response**: <200ms average
- **Uptime**: 99.9% SLA

### Scalability Plan
- **Users**: Support 100K concurrent users
- **Data**: Handle 1TB+ storage
- **Geographic**: Multi-region deployment
- **Load Balancing**: Auto-scaling policies

## 8. Security & Compliance
### Security Measures
- **Authentication**: [OAuth/SAML/2FA]
- **Authorization**: [RBAC/ABAC]
- **Encryption**: [TLS 1.3, AES-256]
- **Security Headers**: [CSP, HSTS, etc.]

### Compliance
- **GDPR**: [Data privacy controls]
- **SOC 2**: [If applicable]
- **HIPAA**: [If healthcare]
- **PCI DSS**: [If payments]

## 9. Marketing & Growth Features
### SEO & Content
- **SEO Optimization**: [Meta tags, structured data]
- **Blog Integration**: [Content marketing]
- **Landing Pages**: [A/B testable]
- **Social Sharing**: [Open Graph tags]

### Growth Tools
- **Referral Program**: [User rewards]
- **Email Marketing**: [Drip campaigns]
- **In-app Messaging**: [User engagement]
- **Analytics Integration**: [GA4, Mixpanel]

## 10. Development Roadmap
### Phase 1 - MVP (Month 1-3)
- [ ] Core features implementation
- [ ] Payment integration
- [ ] Basic analytics
- [ ] Launch preparation

### Phase 2 - Growth (Month 4-6)
- [ ] Advanced features
- [ ] Mobile responsiveness
- [ ] API development
- [ ] Marketing automation

### Phase 3 - Scale (Month 7-12)
- [ ] Enterprise features
- [ ] Advanced integrations
- [ ] International expansion
- [ ] Platform optimization

### KPIs & Success Metrics
- **User Acquisition**: X new users/month
- **Activation Rate**: X% complete onboarding
- **Retention**: X% monthly active users
- **Revenue Growth**: X% MoM growth

IMPORTANT Web App Best Practices:
- Progressive Web App capabilities
- Mobile-first responsive design
- Core Web Vitals optimization
- Accessibility (WCAG 2.1 AA)
- SEO-friendly architecture`,
    minWords: 4000
  },

  'discord-bot': {
    category: 'Chat Bots',
    prompt: `You are creating requirements for a Discord Bot project.

CRITICAL SPECIFICATION HANDLING:
The specification YAML may contain errors, discrepancies, or placeholder content. Analyze it critically and fix any issues in your output.

YOUR TASK: Create a PRACTICAL, IMPLEMENTATION-READY requirements document following this exact structure:

# [Project Name] - Discord Bot Requirements

## 1. Product Overview
- **Purpose**: [What problem the bot solves]
- **Target Servers**: [Gaming/Community/Business/Educational]
- **Unique Value**: [What makes this bot special]
- **Expected Scale**: [Number of servers/users]

## 2. Core Commands & Features (MVP)
List 15-20 essential commands:

### Command: /[command-name]
- **Description**: [What it does]
- **Usage**: \`/command [required] [optional]\`
- **Permissions**: [User/Moderator/Admin]
- **Response Type**: [Embed/Message/Ephemeral]
- **Cooldown**: [X seconds per user]

[Repeat for each command]

## 3. Monetization Strategy
### Revenue Model
- **Free Features**:
  - [Basic commands]
  - [Limited usage]
- **Premium Server ($X/month)**:
  - [Advanced features]
  - [No limits]
  - [Priority support]
- **Patreon/Donation Model**:
  - [Supporter perks]
  - [Early access]

### Payment Integration
- **Platform**: [Stripe/PayPal/Patreon API]
- **Subscription Management**: [Dashboard/Commands]
- **License Verification**: [Per-server activation]

## 4. Bot Architecture
### Technical Stack
- **Language**: [Python/JavaScript/TypeScript]
- **Framework**: [discord.py/discord.js]
- **Database**: [PostgreSQL/MongoDB]
- **Hosting**: [VPS/AWS/Railway]
- **Process Manager**: [PM2/Docker]

### Discord Features
- **Slash Commands**: [All interactions]
- **Message Components**: [Buttons, Select Menus]
- **Modals**: [Form inputs]
- **Auto-moderation**: [If applicable]
- **Voice Support**: [If applicable]

## 5. Advanced Features
### Automation Systems
- **Auto-roles**: [Based on reactions/time/activity]
- **Scheduled Messages**: [Announcements/reminders]
- **Triggers & Actions**: [Custom automation]
- **Logging System**: [Comprehensive audit logs]

### Integration Features
- **API Integrations**: [Twitch/YouTube/Twitter]
- **Webhooks**: [External notifications]
- **Game APIs**: [If gaming focused]
- **AI Integration**: [GPT/Claude if applicable]

## 6. Server Management
### Configuration
- **Setup Wizard**: [Easy onboarding]
- **Web Dashboard**: [Visual configuration]
- **Per-server Settings**: [Customizable features]
- **Backup/Restore**: [Settings export]

### Moderation Tools
- **Auto-moderation**: [Spam/raid protection]
- **Warning System**: [Strike tracking]
- **Temporary Actions**: [Mute/ban timers]
- **Appeal System**: [If applicable]

## 7. User Experience
### Interaction Design
- **Response Time**: [<1s for commands]
- **Error Handling**: [User-friendly messages]
- **Help System**: [Interactive help menus]
- **Localization**: [Multi-language support]

### Engagement Features
- **Leveling System**: [XP and ranks]
- **Economy**: [Virtual currency]
- **Mini-games**: [Simple interactive games]
- **Achievements**: [User goals]

## 8. Performance & Reliability
### Scaling Requirements
- **Sharding**: [Support 2,500+ guilds]
- **Rate Limiting**: [Respect Discord limits]
- **Caching Strategy**: [Redis for performance]
- **Database Optimization**: [Efficient queries]

### Uptime & Monitoring
- **Target Uptime**: [99.9%]
- **Health Checks**: [Status monitoring]
- **Error Tracking**: [Sentry integration]
- **Metrics**: [Commands/minute, latency]

## 9. Security & Privacy
### Security Measures
- **Token Security**: [Environment variables]
- **Input Validation**: [Prevent injections]
- **Permission Checks**: [Proper authorization]
- **Rate Limiting**: [Prevent abuse]

### Privacy Compliance
- **Data Collection**: [Minimal necessary data]
- **Data Retention**: [30-day default]
- **GDPR Commands**: [Data export/deletion]
- **Privacy Policy**: [Clear documentation]

## 10. Growth & Marketing
### Discovery Strategy
- **Bot Lists**: [top.gg, discord.bots.gg]
- **SEO Optimization**: [Website/landing page]
- **Community**: [Support server]
- **Documentation**: [Comprehensive guides]

### Launch Plan
- **Beta Phase**: [50 test servers]
- **Soft Launch**: [Limited features]
- **Full Launch**: [All features + marketing]
- **Growth Targets**: [X servers/month]

### Success Metrics
- **Servers**: [X active servers]
- **Users**: [X monthly active users]
- **Commands**: [X commands/day]
- **Revenue**: [$X MRR from premium]

IMPORTANT Discord Bot Considerations:
- Discord API rate limits (50 requests/second)
- Gateway intents requirements
- Verification requirements at 75+ servers
- Message content intent restrictions
- Slash command sync limitations`,
    minWords: 3500
  },

  'cli-tool': {
    category: 'CLI Tools',
    prompt: `You are creating requirements for a CLI Tool project.

CRITICAL SPECIFICATION HANDLING:
The specification YAML may contain errors, discrepancies, or placeholder content. Analyze it critically and fix any issues in your output.

YOUR TASK: Create a PRACTICAL, IMPLEMENTATION-READY requirements document following this exact structure:

# [Project Name] - CLI Tool Requirements

## 1. Product Overview
- **Purpose**: [What workflow/problem it solves]
- **Target Users**: [Developers/DevOps/Data Scientists]
- **Core Value**: [Time saved/automation provided]
- **Distribution**: [npm/brew/apt/standalone]

## 2. Core Commands (MVP)
List 10-15 essential commands:

### Command: [tool-name] [command]
- **Description**: [What it does]
- **Usage**: \`tool-name command [options] [arguments]\`
- **Options**:
  - \`-f, --flag\`: [Description]
  - \`-o, --output <path>\`: [Description]
- **Examples**:
  \`\`\`bash
  # Example usage
  tool-name command -f --output result.json
  \`\`\`

[Repeat for each command]

## 3. Monetization Strategy
### Business Model
- **Open Source Core**: [Free features]
- **Pro Version**: [$X/user/year]
  - [Advanced features]
  - [Priority support]
  - [Commercial license]
- **Enterprise**: [Custom pricing]
  - [On-premise deployment]
  - [SLA support]
  - [Custom features]

### License Management
- **License Key**: [Activation system]
- **Usage Tracking**: [Anonymous analytics]
- **Feature Flags**: [Pro feature gating]

## 4. Technical Architecture
### Core Design
- **Language**: [Go/Rust/Node.js/Python]
- **Architecture**: [Modular plugin system]
- **Dependencies**: [Minimal external deps]
- **Binary Size**: [Target <50MB]

### Cross-platform Support
- **Operating Systems**: 
  - macOS (Intel + Apple Silicon)
  - Linux (x64, ARM64)
  - Windows (x64)
- **Package Managers**:
  - npm/yarn
  - Homebrew
  - apt/yum
  - Chocolatey

## 5. User Experience
### Installation
\`\`\`bash
# Multiple installation methods
npm install -g tool-name
brew install tool-name
curl -sSL https://install.tool.com | bash
\`\`\`

### Configuration
- **Config File**: \`~/.toolname/config.yaml\`
- **Environment Variables**: \`TOOLNAME_*\`
- **Project Config**: \`.toolnamerc\`
- **Precedence**: CLI args > Env > Config file

### Interactive Features
- **Prompts**: [Interactive questionnaires]
- **Progress Bars**: [Long operations]
- **Colored Output**: [Status indicators]
- **Auto-completion**: [Bash/Zsh/Fish]

## 6. Advanced Features
### Automation & Scripting
- **Script Mode**: [Non-interactive execution]
- **JSON Output**: [\`--json\` flag for parsing]
- **Exit Codes**: [Meaningful status codes]
- **Hooks**: [Pre/post command hooks]

### Integration Features
- **CI/CD Support**: [GitHub Actions, GitLab CI]
- **Editor Plugins**: [VS Code, Vim, Emacs]
- **API Mode**: [Programmatic usage]
- **Docker Image**: [Containerized version]

## 7. Performance Requirements
### Speed Targets
- **Startup Time**: <100ms
- **Command Execution**: <1s for most operations
- **Large File Handling**: Stream processing
- **Memory Usage**: <100MB typical

### Optimization
- **Lazy Loading**: [Load only needed modules]
- **Caching**: [Results caching]
- **Parallel Processing**: [Multi-core utilization]
- **Network Efficiency**: [Minimal API calls]

## 8. Developer Experience
### Documentation
- **Man Pages**: [Comprehensive manual]
- **--help**: [Detailed help for each command]
- **Website**: [Searchable documentation]
- **Examples**: [Real-world use cases]

### Error Handling
- **Clear Messages**: [Actionable error text]
- **Debug Mode**: [\`--verbose\` flag]
- **Stack Traces**: [Developer mode only]
- **Suggestions**: [Did you mean...?]

## 9. Distribution & Updates
### Release Strategy
- **Versioning**: [Semantic versioning]
- **Channels**: [Stable, Beta, Nightly]
- **Auto-update**: [Built-in updater]
- **Changelog**: [Automated generation]

### Package Distribution
- **npm Registry**: [JavaScript ecosystem]
- **GitHub Releases**: [Binary downloads]
- **Container Registry**: [Docker Hub]
- **Package Managers**: [OS-specific]

## 10. Growth & Community
### Open Source Strategy
- **Core**: [MIT/Apache 2.0 license]
- **Contributions**: [Clear guidelines]
- **Plugin System**: [Community extensions]
- **Governance**: [Decision making process]

### Marketing & Adoption
- **Launch Strategy**:
  - Product Hunt launch
  - Hacker News submission
  - Dev.to articles
  - Conference talks
- **Growth Metrics**:
  - Downloads: X/month
  - GitHub stars: X
  - Active users: X
  - Revenue: $X ARR

### Success Indicators
- **Adoption**: [X downloads in 6 months]
- **Retention**: [X% weekly active users]
- **Community**: [X contributors]
- **Revenue**: [$X from pro licenses]

IMPORTANT CLI Tool Best Practices:
- POSIX compliance for arguments
- Respect NO_COLOR environment variable
- Support both stdout and file output
- Meaningful exit codes (0 success, 1-255 errors)
- Minimal dependencies for fast installation`,
    minWords: 3500
  },

  'default': {
    category: 'General Software',
    prompt: `You are creating requirements for a software project.

CRITICAL SPECIFICATION HANDLING:
The specification YAML may contain errors, discrepancies, or placeholder content. Analyze it critically and fix any issues in your output.

YOUR TASK: Create a PRACTICAL, IMPLEMENTATION-READY requirements document that includes:

1. Clear product overview with target market
2. Comprehensive feature list with priorities
3. Detailed monetization strategy with pricing
4. Technical architecture and stack decisions
5. User experience flows and wireframes
6. Performance and scalability requirements
7. Security and compliance measures
8. Development roadmap with timelines
9. Success metrics and KPIs
10. Launch and growth strategy

Focus on creating actionable, specific requirements that a development team can immediately use to build the product. Avoid vague or generic content.`,
    minWords: 3000
  }
};

// Progress tracking class (same as before)
class ProgressTracker {
  constructor() {
    this.progress = this.loadProgress();
  }
  
  loadProgress() {
    try {
      if (fs.existsSync(PROGRESS_FILE)) {
        const data = fs.readFileSync(PROGRESS_FILE, 'utf-8');
        return JSON.parse(data);
      }
    } catch (e) {
      console.log('⚠️  Could not load previous progress, starting fresh');
    }
    
    return {
      startTime: new Date().toISOString(),
      completedProjects: {},
      completedPlatforms: [],
      stats: {
        totalSuccess: 0,
        totalFailed: 0,
        totalSkipped: 0
      }
    };
  }
  
  saveProgress() {
    try {
      fs.writeFileSync(PROGRESS_FILE, JSON.stringify(this.progress, null, 2));
    } catch (e) {
      console.error('❌ Failed to save progress:', e.message);
    }
  }
  
  markProjectComplete(projectId, platform, status, wordCount = 0) {
    this.progress.completedProjects[projectId] = {
      platform,
      status,
      timestamp: new Date().toISOString(),
      wordCount
    };
    
    if (status === 'success') this.progress.stats.totalSuccess++;
    else if (status === 'failed') this.progress.stats.totalFailed++;
    else if (status === 'skipped') this.progress.stats.totalSkipped++;
    
    this.saveProgress();
  }
  
  markPlatformComplete(platform) {
    if (!this.progress.completedPlatforms.includes(platform)) {
      this.progress.completedPlatforms.push(platform);
      this.saveProgress();
    }
  }
  
  isProjectCompleted(projectId) {
    return this.progress.completedProjects.hasOwnProperty(projectId);
  }
  
  isPlatformCompleted(platform) {
    return this.progress.completedPlatforms.includes(platform);
  }
  
  getStats() {
    return {
      ...this.progress.stats,
      totalProcessed: Object.keys(this.progress.completedProjects).length,
      completedPlatforms: this.progress.completedPlatforms.length
    };
  }
  
  reset() {
    if (fs.existsSync(PROGRESS_FILE)) {
      fs.unlinkSync(PROGRESS_FILE);
    }
    this.progress = this.loadProgress();
    console.log('✅ Progress reset');
  }
}

// Get all projects grouped by platform
async function getProjectsByPlatform(progressTracker) {
  const projectsByPlatform = {};
  const entries = fs.readdirSync(PROJECTS_DIR);
  
  for (const entry of entries) {
    const projectDir = path.join(PROJECTS_DIR, entry);
    const specFile = path.join(projectDir, 'ai-generated', 'specification.yaml');
    
    if (fs.existsSync(specFile)) {
      try {
        const spec = yaml.load(fs.readFileSync(specFile, 'utf-8'));
        const platform = spec.project?.type || 'unknown';
        
        // Skip if already processed
        if (progressTracker.isProjectCompleted(entry)) {
          continue;
        }
        
        if (!projectsByPlatform[platform]) {
          projectsByPlatform[platform] = [];
        }
        
        projectsByPlatform[platform].push({
          id: entry,
          dir: projectDir,
          specFile,
          platform
        });
      } catch (e) {
        console.error(`Error reading spec for ${entry}:`, e.message);
      }
    }
  }
  
  // Remove completed platforms
  for (const platform of progressTracker.progress.completedPlatforms) {
    delete projectsByPlatform[platform];
  }
  
  return projectsByPlatform;
}

// Process single project
async function processProject(project, platformConfig, progressTracker) {
  // Double-check if already processed
  if (progressTracker.isProjectCompleted(project.id)) {
    return { status: 'skipped', reason: 'already-processed' };
  }
  
  return new Promise((resolve) => {
    const { id, dir } = project;
    const outputFile = path.join(dir, 'ai-generated', 'requirements.md');
    
    // Build the enhanced prompt
    const prompt = `${platformConfig.prompt}

Please complete the following:

1. Use the Read tool to read: ${path.join(dir, 'ai-generated', 'specification.yaml')}
2. Also read if exists: ${path.join(dir, 'ai-generated', 'market-enhanced-spec.yaml')}
3. Analyze the specifications critically - identify and fix any errors, placeholder content, or inconsistencies
4. Create a comprehensive, implementation-ready requirements document (minimum ${platformConfig.minWords} words)
5. Follow the exact structure provided in the prompt above
6. Ensure all content is specific to THIS project, not generic
7. Focus on practical features, clear monetization, and actionable technical details
8. Use Write tool to save to: ${outputFile}

IMPORTANT: The output must be a practical guide that developers can use immediately to build the product.

Start by reading the specification files.`;

    const startTime = Date.now();
    
    const claude = spawn('claude', [
      '--allowedTools', 'Read,Write',
      '--add-dir', dir,
      '--dangerously-skip-permissions'
    ], {
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    claude.stdin.write(prompt);
    claude.stdin.end();
    
    let output = '';
    claude.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    claude.on('close', (code) => {
      const duration = ((Date.now() - startTime) / 1000).toFixed(1);
      
      if (fs.existsSync(outputFile)) {
        const content = fs.readFileSync(outputFile, 'utf-8');
        const wordCount = content.split(/\s+/).length;
        progressTracker.markProjectComplete(id, project.platform, 'success', wordCount);
        resolve({ status: 'success', wordCount, duration });
      } else {
        progressTracker.markProjectComplete(id, project.platform, 'failed');
        resolve({ status: 'failed' });
      }
    });
    
    // Timeout
    setTimeout(() => {
      claude.kill('SIGTERM');
    }, 180000); // 3 minutes
  });
}

// Worker function to process an entire platform
async function processPlatform(workerId, platform, projects, config, progressTracker) {
  console.log(`\n[Worker ${workerId}] Starting ${platform} (${projects.length} projects)`);
  
  const results = {
    success: 0,
    failed: 0,
    skipped: 0
  };
  
  for (let i = 0; i < projects.length; i++) {
    const project = projects[i];
    process.stdout.write(`\r[Worker ${workerId}] ${platform}: ${i+1}/${projects.length} - Processing ${project.id.substring(0, 30)}...     `);
    
    try {
      const result = await processProject(project, config, progressTracker);
      
      if (result.status === 'success') {
        results.success++;
        console.log(`\n[Worker ${workerId}] ✅ ${project.id} - Success (${result.wordCount} words, ${result.duration}s)`);
      } else if (result.status === 'failed') {
        results.failed++;
        console.log(`\n[Worker ${workerId}] ❌ ${project.id} - Failed`);
      } else if (result.status === 'skipped') {
        results.skipped++;
        // Don't log skipped to reduce noise
      }
    } catch (err) {
      results.failed++;
      progressTracker.markProjectComplete(project.id, project.platform, 'failed');
      console.log(`\n[Worker ${workerId}] ❌ ${project.id} - Error: ${err.message}`);
    }
    
    // Small delay between projects
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  // Mark platform as complete
  progressTracker.markPlatformComplete(platform);
  
  console.log(`\n[Worker ${workerId}] ✨ Completed ${platform}:`);
  console.log(`[Worker ${workerId}]    Success: ${results.success}, Failed: ${results.failed}, Skipped: ${results.skipped}`);
  
  return results;
}

// Platform queue manager
class PlatformQueue {
  constructor(platforms) {
    this.queue = [...platforms];
    this.completed = [];
    this.inProgress = new Map();
  }
  
  getNext(workerId) {
    if (this.queue.length === 0) return null;
    
    const platform = this.queue.shift();
    this.inProgress.set(workerId, platform);
    return platform;
  }
  
  complete(workerId, platform) {
    this.inProgress.delete(workerId);
    this.completed.push(platform);
  }
  
  getStatus() {
    return {
      remaining: this.queue.length,
      inProgress: this.inProgress.size,
      completed: this.completed.length
    };
  }
}

// Worker process
async function runWorker(workerId, platformQueue, projectsByPlatform, progressTracker) {
  console.log(`[Worker ${workerId}] Started`);
  
  while (true) {
    const platformData = platformQueue.getNext(workerId);
    if (!platformData) {
      console.log(`[Worker ${workerId}] No more platforms to process`);
      break;
    }
    
    const [platform, projects] = platformData;
    const config = PLATFORM_PROMPTS[platform] || PLATFORM_PROMPTS.default;
    
    await processPlatform(workerId, platform, projects, config, progressTracker);
    platformQueue.complete(workerId, platform);
  }
  
  console.log(`[Worker ${workerId}] Finished`);
}

// Main
async function main() {
  const args = process.argv.slice(2);
  
  // Initialize progress tracker
  const progressTracker = new ProgressTracker();
  
  // Handle commands
  if (args[0] === '--reset') {
    progressTracker.reset();
    return;
  }
  
  if (args[0] === '--status') {
    const stats = progressTracker.getStats();
    console.log('\n📊 Progress Status:');
    console.log(`   Total Processed: ${stats.totalProcessed}`);
    console.log(`   Success: ${stats.totalSuccess}`);
    console.log(`   Failed: ${stats.totalFailed}`);
    console.log(`   Skipped: ${stats.totalSkipped}`);
    console.log(`   Completed Platforms: ${stats.completedPlatforms}`);
    console.log(`   Progress file: ${PROGRESS_FILE}`);
    return;
  }
  
  // Check for existing progress
  const existingStats = progressTracker.getStats();
  if (existingStats.totalProcessed > 0) {
    console.log('📂 Found existing progress:');
    console.log(`   Already processed: ${existingStats.totalProcessed} projects`);
    console.log(`   Completed platforms: ${existingStats.completedPlatforms}`);
    console.log('   Continuing from where we left off...\n');
  }
  
  console.log('🔍 Analyzing remaining projects by platform...\n');
  const projectsByPlatform = await getProjectsByPlatform(progressTracker);
  
  // Show summary
  console.log('📊 Remaining Project Distribution:');
  const platforms = Object.entries(projectsByPlatform);
  let totalProjects = 0;
  
  if (platforms.length === 0) {
    console.log('   ✅ All platforms have been processed!');
    console.log(`   Use --status to see summary or --reset to start over`);
    return;
  }
  
  for (const [platform, projects] of platforms) {
    console.log(`   ${platform}: ${projects.length} projects`);
    totalProjects += projects.length;
  }
  console.log(`\n   Total remaining: ${totalProjects} projects across ${platforms.length} platforms`);
  console.log(`\n🔧 Starting ${MAX_WORKERS} workers to process platforms...\n`);
  
  // Create platform queue
  const platformQueue = new PlatformQueue(platforms);
  
  // Start workers
  const workers = [];
  for (let i = 1; i <= MAX_WORKERS; i++) {
    workers.push(runWorker(i, platformQueue, projectsByPlatform, progressTracker));
  }
  
  // Status monitor
  const statusInterval = setInterval(() => {
    const status = platformQueue.getStatus();
    const stats = progressTracker.getStats();
    if (status.remaining > 0 || status.inProgress > 0) {
      process.stdout.write(`\r📊 Platforms: ${status.completed} completed | ${status.inProgress} in progress | ${status.remaining} remaining | Total: ${stats.totalProcessed} projects     `);
    }
  }, 2000);
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n\n⚠️  Gracefully shutting down... Progress has been saved.');
    console.log('   Run again to continue from where you left off.');
    process.exit(0);
  });
  
  // Wait for all workers to complete
  await Promise.all(workers);
  
  clearInterval(statusInterval);
  
  // Final summary
  const finalStats = progressTracker.getStats();
  console.log('\n\n✅ All platforms processed!');
  console.log(`   Total Projects: ${finalStats.totalProcessed}`);
  console.log(`   Success: ${finalStats.totalSuccess}`);
  console.log(`   Failed: ${finalStats.totalFailed}`);
  console.log(`   Skipped: ${finalStats.totalSkipped}`);
}

// Run
if (require.main === module) {
  main().catch(console.error);
}