/**
 * Platform-specific requirements and templates for all 70+ platforms
 * Used by Step 0 orchestrator to enhance prompts with domain-specific context
 */

export interface PlatformRequirements {
  requirements: string[]
  constraints?: string[]
  compliance?: string[]
  techStack?: string[]
  bestPractices?: string[]
  templates?: string
}

export const platformRequirements: Record<string, PlatformRequirements> = {
  // Web Platforms
  'web-app': {
    requirements: ['Responsive design', 'Cross-browser compatibility', 'SEO optimization', 'Accessibility WCAG 2.1'],
    techStack: ['React/Vue/Angular', 'REST/GraphQL APIs', 'PostgreSQL/MongoDB'],
    bestPractices: ['Progressive enhancement', 'Mobile-first design', 'Performance budgets']
  },
  'static-site': {
    requirements: ['Static HTML generation', 'CDN deployment', 'SEO metadata', 'Fast page loads'],
    techStack: ['Next.js/Gatsby/Hugo', 'Markdown/MDX', 'Netlify/Vercel'],
    constraints: ['No server-side processing', 'Build-time data fetching']
  },
  'pwa': {
    requirements: ['Service workers', 'Offline functionality', 'App manifest', 'Push notifications'],
    techStack: ['Workbox', 'IndexedDB', 'Cache API'],
    bestPractices: ['Cache-first strategy', 'Background sync', 'App shell architecture']
  },
  'blog': {
    requirements: ['Content management', 'RSS feeds', 'Comment system', 'Social sharing'],
    techStack: ['WordPress/Ghost/Strapi', 'Markdown editors', 'Disqus/Commento'],
    bestPractices: ['SEO-friendly URLs', 'Reading time estimates', 'Related posts']
  },
  'portfolio': {
    requirements: ['Project showcase', 'Contact forms', 'Resume download', 'Testimonials'],
    techStack: ['Gatsby/Next.js', 'EmailJS/Formspree', 'Cloudinary'],
    bestPractices: ['Fast image loading', 'Smooth animations', 'Case study format']
  },
  'landing-page': {
    requirements: ['Hero section', 'Call-to-action', 'Lead capture', 'A/B testing'],
    techStack: ['Tailwind CSS', 'Mailchimp/ConvertKit', 'Google Optimize'],
    bestPractices: ['Above-fold optimization', 'Social proof', 'Conversion tracking']
  },
  'docs-site': {
    requirements: ['Search functionality', 'Version control', 'Code syntax highlighting', 'API reference'],
    techStack: ['Docusaurus/VitePress', 'Algolia search', 'Prism.js'],
    bestPractices: ['Clear navigation', 'Interactive examples', 'Changelog maintenance']
  },

  // Mobile Platforms
  'mobile-app': {
    requirements: ['Native performance', 'Push notifications', 'Offline sync', 'App store compliance'],
    techStack: ['React Native/Flutter', 'Firebase/Supabase', 'Redux/Riverpod'],
    compliance: ['App Store guidelines', 'Google Play policies', 'COPPA for kids apps']
  },
  'android-app': {
    requirements: ['Material Design', 'Android API levels', 'Google Play services', 'ProGuard rules'],
    techStack: ['Kotlin/Java', 'Android Jetpack', 'Room database'],
    constraints: ['APK size limits', 'Background service restrictions']
  },
  'ios-app': {
    requirements: ['Human Interface Guidelines', 'App Store Review', 'iOS version support', 'Push certificates'],
    techStack: ['Swift/SwiftUI', 'Core Data', 'CloudKit'],
    compliance: ['App Store Review Guidelines', 'App Tracking Transparency']
  },
  'react-native': {
    requirements: ['Cross-platform components', 'Native module bridges', 'Platform-specific code', 'OTA updates'],
    techStack: ['React Native CLI/Expo', 'React Navigation', 'AsyncStorage'],
    bestPractices: ['Platform branching', 'Performance optimization', 'Memory management']
  },
  'flutter-app': {
    requirements: ['Widget-based UI', 'Dart packages', 'Platform channels', 'Hot reload'],
    techStack: ['Flutter SDK', 'Provider/Bloc', 'Hive/Sqflite'],
    bestPractices: ['Widget composition', 'State management patterns', 'Custom painters']
  },

  // Desktop Platforms
  'desktop-app': {
    requirements: ['OS integration', 'File system access', 'Native menus', 'Auto-updates'],
    techStack: ['Electron/Tauri', 'Node.js APIs', 'SQLite'],
    constraints: ['Binary size', 'Memory usage', 'Security sandbox']
  },
  'windows-app': {
    requirements: ['Windows UI guidelines', 'Registry access', '.NET integration', 'Microsoft Store'],
    techStack: ['WPF/WinUI 3', 'C#/.NET', 'Entity Framework'],
    compliance: ['Windows certification', 'SmartScreen requirements']
  },
  'mac-app': {
    requirements: ['macOS design', 'Notarization', 'App Sandbox', 'Mac App Store'],
    techStack: ['SwiftUI/AppKit', 'Core Data', 'CloudKit'],
    compliance: ['Gatekeeper', 'Notarization requirements']
  },
  'linux-app': {
    requirements: ['Distribution packages', 'Desktop integration', 'GTK/Qt themes', 'AppImage/Flatpak'],
    techStack: ['GTK/Qt', 'Python/C++', 'D-Bus'],
    bestPractices: ['FreeDesktop standards', 'Package maintainer guidelines']
  },

  // API & Backend Platforms
  'api-rest': {
    requirements: ['RESTful design', 'Authentication', 'Rate limiting', 'API documentation'],
    techStack: ['Express/FastAPI', 'JWT/OAuth2', 'Swagger/OpenAPI'],
    bestPractices: ['Versioning strategy', 'HATEOAS', 'Idempotency']
  },
  'api-graphql': {
    requirements: ['Schema design', 'Resolvers', 'Subscriptions', 'Query complexity'],
    techStack: ['Apollo Server/GraphQL Yoga', 'DataLoader', 'GraphQL Playground'],
    bestPractices: ['N+1 query prevention', 'Schema stitching', 'Error handling']
  },
  'api-websocket': {
    requirements: ['Real-time communication', 'Connection management', 'Message protocols', 'Reconnection logic'],
    techStack: ['Socket.io/ws', 'Redis pub/sub', 'Protocol Buffers'],
    constraints: ['Connection limits', 'Message size limits']
  },
  'api-grpc': {
    requirements: ['Protocol buffers', 'Service definitions', 'Streaming support', 'Load balancing'],
    techStack: ['gRPC framework', 'Protobuf compiler', 'Envoy proxy'],
    bestPractices: ['Service mesh integration', 'Circuit breakers', 'Retry policies']
  },

  // Specialized Platforms
  'blockchain-dapp': {
    requirements: ['Smart contracts', 'Web3 integration', 'Wallet connection', 'Gas optimization'],
    techStack: ['Solidity/Rust', 'Hardhat/Truffle', 'ethers.js/web3.js'],
    compliance: ['Security audits', 'Token standards (ERC-20/721)']
  },
  'iot-device': {
    requirements: ['Sensor integration', 'MQTT protocol', 'OTA firmware', 'Power management'],
    techStack: ['Arduino/ESP32', 'MQTT broker', 'InfluxDB'],
    constraints: ['Memory limitations', 'Battery life', 'Connectivity issues']
  },
  'game': {
    requirements: ['Game loop', 'Physics engine', 'Asset pipeline', 'Multiplayer support'],
    techStack: ['Unity/Unreal/Godot', 'Photon/Mirror', 'Steamworks SDK'],
    bestPractices: ['Performance profiling', 'LOD systems', 'Input handling']
  },
  'ar-app': {
    requirements: ['AR tracking', 'Scene understanding', '3D rendering', 'Gesture recognition'],
    techStack: ['ARCore/ARKit', 'Unity AR Foundation', 'Vuforia'],
    constraints: ['Device compatibility', 'Processing power', 'Battery drain']
  },
  'vr-app': {
    requirements: ['VR headset support', 'Motion controllers', 'Spatial audio', 'Comfort settings'],
    techStack: ['Unity XR/Unreal VR', 'OpenXR', 'SteamVR'],
    bestPractices: ['Motion sickness prevention', 'Performance targets (90fps)', 'Teleportation']
  },
  'ai-model': {
    requirements: ['Model architecture', 'Training pipeline', 'Inference optimization', 'Model versioning'],
    techStack: ['TensorFlow/PyTorch', 'MLflow', 'ONNX'],
    bestPractices: ['Bias detection', 'Model explainability', 'A/B testing']
  },
  'data-pipeline': {
    requirements: ['ETL processes', 'Data validation', 'Scheduling', 'Error handling'],
    techStack: ['Apache Airflow/Prefect', 'Apache Spark', 'dbt'],
    bestPractices: ['Idempotent operations', 'Data lineage', 'Monitoring/alerting']
  },

  // Browser Extensions
  'chrome-extension': {
    requirements: ['Manifest V3', 'Content scripts', 'Background service worker', 'Permissions model'],
    techStack: ['Chrome APIs', 'Webpack', 'TypeScript'],
    constraints: ['5MB size limit', 'CSP restrictions', 'Review process'],
    compliance: ['Chrome Web Store policies', 'Privacy policy requirement']
  },
  'firefox-addon': {
    requirements: ['WebExtensions API', 'Browser compatibility', 'AMO signing', 'Storage sync'],
    techStack: ['WebExtensions', 'web-ext tool', 'Firefox APIs'],
    compliance: ['Mozilla Add-on policies', 'Security review']
  },
  'safari-extension': {
    requirements: ['Safari Web Extensions', 'App Extensions', 'Native messaging', 'iCloud sync'],
    techStack: ['Safari Extensions API', 'Xcode', 'Swift/JavaScript bridge'],
    compliance: ['App Store review', 'Safari extension guidelines']
  },
  'edge-extension': {
    requirements: ['Chromium-based APIs', 'Microsoft Store', 'Edge-specific features', 'Enterprise policies'],
    techStack: ['Manifest V3', 'Edge APIs', 'WebExtensions'],
    compliance: ['Microsoft Store policies', 'Edge add-ons guidelines']
  },

  // Automation & Bots
  'discord-bot': {
    requirements: ['Discord.js/py', 'Command handling', 'Event listeners', 'Permission system'],
    techStack: ['Discord API', 'Node.js/Python', 'PostgreSQL'],
    bestPractices: ['Rate limit handling', 'Sharding', 'Slash commands']
  },
  'telegram-bot': {
    requirements: ['Bot API', 'Inline queries', 'Webhooks', 'Payment integration'],
    techStack: ['python-telegram-bot/telegraf', 'Redis', 'Docker'],
    constraints: ['Message size limits', 'API rate limits']
  },
  'slack-app': {
    requirements: ['Slack SDK', 'OAuth flow', 'Interactive components', 'Event subscriptions'],
    techStack: ['Bolt framework', 'Block Kit', 'Slack API'],
    compliance: ['Slack App Directory requirements', 'Security review']
  },
  'whatsapp-bot': {
    requirements: ['Business API', 'Template messages', 'Media handling', 'Session management'],
    techStack: ['WhatsApp Business API', 'Twilio/MessageBird', 'Node.js'],
    compliance: ['WhatsApp Business Policy', 'Message templates approval']
  },
  'twitter-bot': {
    requirements: ['Twitter API v2', 'OAuth 2.0', 'Rate limits', 'Streaming API'],
    techStack: ['Tweepy/twitter-api-v2', 'Python/Node.js', 'MongoDB'],
    compliance: ['Twitter Developer Policy', 'Automation rules']
  },

  // CLI Tools
  'cli-tool': {
    requirements: ['Command parsing', 'Help documentation', 'Configuration files', 'Cross-platform support'],
    techStack: ['Commander.js/Click', 'Chalk/Colors', 'Inquirer'],
    bestPractices: ['POSIX compliance', 'Exit codes', 'Pipe support']
  },
  'bash-script': {
    requirements: ['Shell compatibility', 'Error handling', 'Input validation', 'Documentation'],
    techStack: ['Bash 4+', 'GNU coreutils', 'jq/yq'],
    constraints: ['POSIX compatibility', 'Platform differences']
  },
  'powershell-script': {
    requirements: ['PowerShell 7+', 'Module structure', 'Help system', 'Error handling'],
    techStack: ['PowerShell Core', 'Pester tests', 'PSScriptAnalyzer'],
    bestPractices: ['Verb-Noun naming', 'Pipeline support', 'Parameter validation']
  },

  // Data & Analytics
  'dashboard': {
    requirements: ['Real-time updates', 'Interactive charts', 'Data filters', 'Export functionality'],
    techStack: ['D3.js/Chart.js', 'WebSockets', 'Redis cache'],
    bestPractices: ['Performance optimization', 'Responsive charts', 'Accessibility']
  },
  'data-viz': {
    requirements: ['Chart libraries', 'Interactive visualizations', 'Data processing', 'Responsive design'],
    techStack: ['D3.js/Plotly', 'Canvas/SVG', 'WebGL'],
    bestPractices: ['Color accessibility', 'Performance with large datasets', 'Mobile interactions']
  },
  'analytics-tool': {
    requirements: ['Event tracking', 'User sessions', 'Funnel analysis', 'Custom dashboards'],
    techStack: ['Segment/Mixpanel SDK', 'ClickHouse/BigQuery', 'Metabase'],
    compliance: ['GDPR compliance', 'Cookie consent', 'Data retention policies']
  },

  // Infrastructure
  'infrastructure': {
    requirements: ['IaC templates', 'CI/CD pipelines', 'Monitoring setup', 'Security policies'],
    techStack: ['Terraform/CloudFormation', 'GitHub Actions/GitLab CI', 'Prometheus/Grafana'],
    bestPractices: ['GitOps workflow', 'Blue-green deployments', 'Disaster recovery']
  },
  'kubernetes-app': {
    requirements: ['Container orchestration', 'Helm charts', 'Service mesh', 'Autoscaling'],
    techStack: ['Kubernetes', 'Helm', 'Istio/Linkerd'],
    bestPractices: ['Resource limits', 'Health checks', 'Rolling updates']
  },
  'serverless-function': {
    requirements: ['Function triggers', 'Cold start optimization', 'API Gateway', 'Environment variables'],
    techStack: ['AWS Lambda/Vercel', 'Serverless Framework', 'DynamoDB'],
    constraints: ['Execution time limits', 'Memory limits', 'Stateless design']
  },

  // Content Management
  'cms': {
    requirements: ['Content modeling', 'User roles', 'Media library', 'Version control'],
    techStack: ['Strapi/Contentful', 'PostgreSQL', 'S3/Cloudinary'],
    bestPractices: ['Content workflows', 'SEO optimization', 'Multi-language support']
  },
  'headless-cms': {
    requirements: ['API-first design', 'Content delivery API', 'Webhooks', 'Preview functionality'],
    techStack: ['Strapi/Sanity', 'GraphQL/REST', 'CDN'],
    bestPractices: ['Content modeling', 'Caching strategies', 'Webhook security']
  },

  // E-commerce
  'ecommerce-store': {
    requirements: ['Product catalog', 'Shopping cart', 'Payment processing', 'Order management'],
    techStack: ['Shopify/WooCommerce', 'Stripe/PayPal', 'Inventory systems'],
    compliance: ['PCI DSS', 'Tax regulations', 'Consumer protection laws']
  },
  'marketplace': {
    requirements: ['Multi-vendor support', 'Commission system', 'Dispute resolution', 'Review system'],
    techStack: ['Custom platform/Sharetribe', 'Stripe Connect', 'Elasticsearch'],
    bestPractices: ['Trust & safety', 'Fraud prevention', 'Escrow payments']
  },

  // Education
  'online-course': {
    requirements: ['Video hosting', 'Progress tracking', 'Quiz system', 'Certificates'],
    techStack: ['Moodle/Custom LMS', 'Video.js', 'SCORM'],
    compliance: ['FERPA', 'Accessibility standards', 'Copyright protection']
  },
  'learning-platform': {
    requirements: ['Course management', 'Student dashboard', 'Discussion forums', 'Assignment submission'],
    techStack: ['Canvas/Blackboard APIs', 'WebRTC', 'Turnitin integration'],
    bestPractices: ['Mobile learning', 'Offline content', 'Gamification']
  },

  // Healthcare
  'health-app': {
    requirements: ['Patient data security', 'Appointment scheduling', 'Health records', 'Telemedicine'],
    techStack: ['FHIR standards', 'HL7 integration', 'Encrypted storage'],
    compliance: ['HIPAA', 'FDA regulations', 'Medical device standards']
  },
  'fitness-tracker': {
    requirements: ['Activity monitoring', 'Goal setting', 'Social features', 'Wearable integration'],
    techStack: ['HealthKit/Google Fit', 'Bluetooth LE', 'Charts libraries'],
    bestPractices: ['Data privacy', 'Battery optimization', 'Sync strategies']
  },

  // Finance
  'fintech-app': {
    requirements: ['Bank integration', 'Transaction security', 'KYC/AML', 'Real-time processing'],
    techStack: ['Plaid/Yodlee', 'Stripe/Dwolla', 'PostgreSQL'],
    compliance: ['PCI DSS', 'SOC 2', 'Banking regulations']
  },
  'trading-platform': {
    requirements: ['Real-time quotes', 'Order execution', 'Portfolio management', 'Risk analysis'],
    techStack: ['WebSocket feeds', 'Redis', 'Time-series databases'],
    compliance: ['SEC regulations', 'FINRA rules', 'Market data agreements']
  },

  // Social & Communication
  'social-network': {
    requirements: ['User profiles', 'Friend system', 'Feed algorithm', 'Content moderation'],
    techStack: ['Graph database', 'Redis cache', 'Elasticsearch'],
    bestPractices: ['Privacy controls', 'Content filtering', 'Scalable architecture']
  },
  'chat-app': {
    requirements: ['Real-time messaging', 'End-to-end encryption', 'Media sharing', 'Group chats'],
    techStack: ['Socket.io/WebRTC', 'Signal Protocol', 'MongoDB'],
    bestPractices: ['Message delivery', 'Offline sync', 'Push notifications']
  },
  'forum': {
    requirements: ['Thread management', 'User reputation', 'Moderation tools', 'Search functionality'],
    techStack: ['Discourse/phpBB', 'PostgreSQL', 'Elasticsearch'],
    bestPractices: ['SEO optimization', 'Spam prevention', 'Community guidelines']
  },

  // Media & Entertainment
  'video-streaming': {
    requirements: ['Video encoding', 'CDN delivery', 'Adaptive bitrate', 'DRM protection'],
    techStack: ['FFmpeg', 'HLS/DASH', 'AWS MediaConvert'],
    constraints: ['Bandwidth costs', 'Storage requirements', 'Latency']
  },
  'music-player': {
    requirements: ['Audio streaming', 'Playlist management', 'Offline playback', 'Recommendation engine'],
    techStack: ['Web Audio API', 'IndexedDB', 'Spotify/Apple Music API'],
    compliance: ['Music licensing', 'Copyright protection']
  },
  'podcast-platform': {
    requirements: ['RSS feed generation', 'Episode management', 'Analytics', 'Distribution'],
    techStack: ['RSS 2.0', 'Audio processing', 'Podcast directories APIs'],
    bestPractices: ['SEO for podcasts', 'Transcript generation', 'Cross-platform distribution']
  },

  // Productivity
  'project-management': {
    requirements: ['Task tracking', 'Team collaboration', 'Gantt charts', 'Time tracking'],
    techStack: ['React DnD', 'WebSockets', 'PostgreSQL'],
    bestPractices: ['Real-time sync', 'Offline capabilities', 'Integration APIs']
  },
  'note-taking': {
    requirements: ['Rich text editor', 'Markdown support', 'Search functionality', 'Sync across devices'],
    techStack: ['ProseMirror/Slate', 'Full-text search', 'E2E encryption'],
    bestPractices: ['Conflict resolution', 'Version history', 'Export formats']
  },
  'calendar-app': {
    requirements: ['Event scheduling', 'Recurring events', 'Timezone handling', 'Calendar sync'],
    techStack: ['FullCalendar', 'iCal format', 'CalDAV protocol'],
    bestPractices: ['Timezone accuracy', 'Conflict detection', 'Reminder system']
  },

  // Security
  'security-tool': {
    requirements: ['Vulnerability scanning', 'Threat detection', 'Audit logging', 'Compliance reporting'],
    techStack: ['OWASP tools', 'SIEM integration', 'Python/Go'],
    compliance: ['Security frameworks', 'Industry standards', 'Audit requirements']
  },
  'password-manager': {
    requirements: ['Encryption standards', 'Secure storage', 'Auto-fill', 'Cross-platform sync'],
    techStack: ['AES-256', 'PBKDF2', 'Browser extensions'],
    bestPractices: ['Zero-knowledge architecture', 'Two-factor auth', 'Secure sharing']
  },
  'vpn-app': {
    requirements: ['VPN protocols', 'Server infrastructure', 'Kill switch', 'No-logs policy'],
    techStack: ['WireGuard/OpenVPN', 'Network programming', 'DNS leak prevention'],
    compliance: ['Privacy laws', 'Data retention laws', 'Transparency reports']
  },

  // Development Tools
  'code-editor': {
    requirements: ['Syntax highlighting', 'IntelliSense', 'Extension system', 'Git integration'],
    techStack: ['Monaco Editor', 'Language Server Protocol', 'Tree-sitter'],
    bestPractices: ['Performance optimization', 'Memory management', 'Plugin security']
  },
  'dev-tool': {
    requirements: ['Developer workflow', 'Build optimization', 'Debug capabilities', 'Performance profiling'],
    techStack: ['Node.js/Python', 'CLI frameworks', 'Analytics'],
    bestPractices: ['Cross-platform support', 'Configuration management', 'Update mechanism']
  },
  'testing-framework': {
    requirements: ['Test runners', 'Assertion libraries', 'Coverage reports', 'CI integration'],
    techStack: ['Jest/Pytest', 'Selenium/Playwright', 'Istanbul'],
    bestPractices: ['Parallel execution', 'Flaky test detection', 'Test isolation']
  },

  // Default fallback
  'other': {
    requirements: ['Clear project scope', 'User requirements', 'Technical specifications', 'Success criteria'],
    techStack: ['Technology stack based on requirements'],
    bestPractices: ['Industry best practices', 'Security considerations', 'Scalability planning']
  }
}

/**
 * Get platform-specific requirements
 */
export function getPlatformRequirements(platformType: string): PlatformRequirements {
  return platformRequirements[platformType] || platformRequirements['other']
}

/**
 * Build platform-specific context for LLM prompt
 */
export function buildPlatformContext(platformType: string): string {
  const platform = getPlatformRequirements(platformType)
  const sections: string[] = []

  if (platform.requirements.length > 0) {
    sections.push(`Key Requirements:\n${platform.requirements.map(r => `- ${r}`).join('\n')}`)
  }

  if (platform.techStack && platform.techStack.length > 0) {
    sections.push(`Recommended Tech Stack:\n${platform.techStack.map(t => `- ${t}`).join('\n')}`)
  }

  if (platform.constraints && platform.constraints.length > 0) {
    sections.push(`Platform Constraints:\n${platform.constraints.map(c => `- ${c}`).join('\n')}`)
  }

  if (platform.compliance && platform.compliance.length > 0) {
    sections.push(`Compliance Requirements:\n${platform.compliance.map(c => `- ${c}`).join('\n')}`)
  }

  if (platform.bestPractices && platform.bestPractices.length > 0) {
    sections.push(`Best Practices:\n${platform.bestPractices.map(b => `- ${b}`).join('\n')}`)
  }

  return sections.join('\n\n')
}