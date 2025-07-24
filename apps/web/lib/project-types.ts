import {
  Globe,
  Smartphone,
  Chrome,
  Puzzle,
  Terminal,
  Package,
  Server,
  Cloud,
  Bot,
  ShoppingBag,
  Brain,
  Cpu,
  Code,
  Zap,
  TrendingUp
} from 'lucide-react'

export const projectTypes = [
  // Web Applications
  { id: 'web-app', name: 'Web App', icon: Globe, description: 'Full-stack web application', category: 'Web' },
  { id: 'static-site', name: 'Static Site', icon: Globe, description: 'Static website/landing page', category: 'Web' },
  { id: 'pwa-app', name: 'Progressive Web App', icon: Smartphone, description: 'Offline-capable web app', category: 'Web' },
  
  // Browser Extensions
  { id: 'chrome-extension', name: 'Chrome Extension', icon: Chrome, description: 'Chrome browser extension', category: 'Extensions' },
  { id: 'firefox-extension', name: 'Firefox Extension', icon: Chrome, description: 'Firefox browser addon', category: 'Extensions' },
  { id: 'safari-extension', name: 'Safari Extension', icon: Chrome, description: 'Safari browser extension', category: 'Extensions' },
  { id: 'edge-extension', name: 'Edge Extension', icon: Chrome, description: 'Microsoft Edge extension', category: 'Extensions' },
  { id: 'browser-extension', name: 'Browser Extension', icon: Chrome, description: 'Cross-browser extension', category: 'Extensions' },
  
  // Desktop Applications
  { id: 'electron-app', name: 'Electron App', icon: Cpu, description: 'Cross-platform desktop app', category: 'Desktop' },
  { id: 'desktop-app', name: 'Native Desktop App', icon: Package, description: 'OS-specific desktop app', category: 'Desktop' },
  { id: 'tauri-app', name: 'Tauri App', icon: Cpu, description: 'Rust-based desktop app', category: 'Desktop' },
  
  // Mobile Applications
  { id: 'mobile-app', name: 'Mobile App', icon: Smartphone, description: 'iOS/Android native app', category: 'Mobile' },
  { id: 'react-native-app', name: 'React Native App', icon: Smartphone, description: 'Cross-platform mobile app', category: 'Mobile' },
  { id: 'flutter-app', name: 'Flutter App', icon: Smartphone, description: 'Dart-based mobile app', category: 'Mobile' },
  { id: 'ionic-app', name: 'Ionic App', icon: Smartphone, description: 'Hybrid mobile app', category: 'Mobile' },
  
  // API & Services
  { id: 'api-service', name: 'REST API', icon: Server, description: 'RESTful API service', category: 'API' },
  { id: 'graphql-api', name: 'GraphQL API', icon: Server, description: 'GraphQL API service', category: 'API' },
  { id: 'microservice', name: 'Microservice', icon: Cloud, description: 'Microservice architecture', category: 'API' },
  { id: 'websocket-service', name: 'WebSocket Service', icon: Zap, description: 'Real-time WebSocket service', category: 'API' },
  
  // CLI Tools
  { id: 'cli-tool', name: 'CLI Tool', icon: Terminal, description: 'Command line interface tool', category: 'CLI' },
  { id: 'npm-package', name: 'NPM Package', icon: Package, description: 'Node.js package', category: 'CLI' },
  { id: 'python-package', name: 'Python Package', icon: Package, description: 'Python library/package', category: 'CLI' },
  { id: 'rust-crate', name: 'Rust Crate', icon: Package, description: 'Rust library/crate', category: 'CLI' },
  
  // AI & ML
  { id: 'ai-agent', name: 'AI Agent', icon: Bot, description: 'Intelligent AI assistant', category: 'AI' },
  { id: 'ml-model', name: 'ML Model', icon: Brain, description: 'Machine learning model', category: 'AI' },
  { id: 'chatbot', name: 'Chatbot', icon: Bot, description: 'Conversational AI bot', category: 'AI' },
  { id: 'nlp-service', name: 'NLP Service', icon: Brain, description: 'Natural language processing', category: 'AI' },
  
  // E-commerce
  { id: 'ecommerce-site', name: 'E-commerce Site', icon: ShoppingBag, description: 'Online store', category: 'E-commerce' },
  { id: 'marketplace', name: 'Marketplace', icon: ShoppingBag, description: 'Multi-vendor platform', category: 'E-commerce' },
  { id: 'payment-gateway', name: 'Payment Gateway', icon: ShoppingBag, description: 'Payment processing', category: 'E-commerce' },
  
  // Games
  { id: 'web-game', name: 'Web Game', icon: Puzzle, description: 'Browser-based game', category: 'Games' },
  { id: 'mobile-game', name: 'Mobile Game', icon: Puzzle, description: 'iOS/Android game', category: 'Games' },
  { id: 'desktop-game', name: 'Desktop Game', icon: Puzzle, description: 'PC/Console game', category: 'Games' },
  
  // IoT & Hardware
  { id: 'iot-device', name: 'IoT Device', icon: Cpu, description: 'Internet of Things device', category: 'IoT' },
  { id: 'embedded-system', name: 'Embedded System', icon: Cpu, description: 'Embedded software', category: 'IoT' },
  { id: 'arduino-project', name: 'Arduino Project', icon: Cpu, description: 'Arduino-based project', category: 'IoT' },
  { id: 'raspberry-pi', name: 'Raspberry Pi', icon: Cpu, description: 'Raspberry Pi project', category: 'IoT' },
  
  // Blockchain
  { id: 'blockchain-app', name: 'Blockchain DApp', icon: Code, description: 'Decentralized application', category: 'Blockchain' },
  { id: 'smart-contract', name: 'Smart Contract', icon: Code, description: 'Blockchain smart contract', category: 'Blockchain' },
  { id: 'nft-platform', name: 'NFT Platform', icon: Code, description: 'NFT marketplace/minting', category: 'Blockchain' },
  { id: 'defi-protocol', name: 'DeFi Protocol', icon: Code, description: 'Decentralized finance', category: 'Blockchain' },
  
  // Data & Analytics
  { id: 'dashboard', name: 'Dashboard', icon: TrendingUp, description: 'Analytics dashboard', category: 'Data' },
  { id: 'data-pipeline', name: 'Data Pipeline', icon: TrendingUp, description: 'ETL/data processing', category: 'Data' },
  { id: 'visualization-tool', name: 'Visualization Tool', icon: TrendingUp, description: 'Data visualization', category: 'Data' },
  
  // DevOps & Tools
  { id: 'devops-tool', name: 'DevOps Tool', icon: Zap, description: 'CI/CD or automation tool', category: 'DevOps' },
  { id: 'monitoring-tool', name: 'Monitoring Tool', icon: Zap, description: 'System monitoring', category: 'DevOps' },
  { id: 'testing-framework', name: 'Testing Framework', icon: Zap, description: 'Test automation', category: 'DevOps' },
  
  // Other platforms
  { id: 'vscode-extension', name: 'VS Code Extension', icon: Code, description: 'Visual Studio Code extension', category: 'Other' },
  { id: 'figma-plugin', name: 'Figma Plugin', icon: Code, description: 'Figma design plugin', category: 'Other' },
  { id: 'slack-app', name: 'Slack App', icon: Code, description: 'Slack integration', category: 'Other' },
  { id: 'discord-bot', name: 'Discord Bot', icon: Bot, description: 'Discord bot application', category: 'Other' },
  { id: 'telegram-bot', name: 'Telegram Bot', icon: Bot, description: 'Telegram bot application', category: 'Other' },
  { id: 'whatsapp-bot', name: 'WhatsApp Bot', icon: Bot, description: 'WhatsApp bot application', category: 'Other' },
  { id: 'zoom-app', name: 'Zoom App', icon: Code, description: 'Zoom integration', category: 'Other' },
  { id: 'shopify-app', name: 'Shopify App', icon: ShoppingBag, description: 'Shopify store app', category: 'Other' },
  { id: 'wordpress-plugin', name: 'WordPress Plugin', icon: Code, description: 'WordPress plugin', category: 'Other' },
  { id: 'obsidian-plugin', name: 'Obsidian Plugin', icon: Code, description: 'Obsidian note-taking plugin', category: 'Other' },
  { id: 'notion-integration', name: 'Notion Integration', icon: Code, description: 'Notion workspace integration', category: 'Other' }
]

// Helper function to get project type info
export function getProjectTypeInfo(typeId: string) {
  return projectTypes.find(t => t.id === typeId)
}

// Helper function to get category from type
export function getProjectCategory(typeId: string): string {
  const typeInfo = getProjectTypeInfo(typeId)
  return typeInfo?.category || 'Other'
}

// Get all unique categories
export function getProjectCategories(): string[] {
  return Array.from(new Set(projectTypes.map(t => t.category)))
}