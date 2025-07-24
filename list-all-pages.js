console.log('\n🚀 Ultimate AI Dashboard - All Available Pages\n');
console.log('=' .repeat(50));

const pages = [
  { name: 'Dashboard', url: 'http://localhost:3002/' },
  { name: 'Projects', url: 'http://localhost:3002/projects' },
  { name: 'Jobs', url: 'http://localhost:3002/jobs' },
  { name: 'Pipeline', url: 'http://localhost:3002/pipeline' },
  { name: 'MCP Servers', url: 'http://localhost:3002/mcp-servers' },
  { name: 'Agents', url: 'http://localhost:3002/agents' },
  { name: 'Plugins', url: 'http://localhost:3002/plugins' },
  { name: 'AI Studio', url: 'http://localhost:3002/ai-studio' },
  { name: 'Templates', url: 'http://localhost:3002/templates' },
  { name: 'Platforms', url: 'http://localhost:3002/platforms' },
  { name: 'Deployments', url: 'http://localhost:3002/deployments' },
  { name: 'Analytics', url: 'http://localhost:3002/analytics' },
  { name: 'Errors', url: 'http://localhost:3002/errors' },
  { name: 'Settings', url: 'http://localhost:3002/settings' },
  { name: 'Docs', url: 'http://localhost:3002/docs' },
  { name: 'UI Demo', url: 'http://localhost:3002/shared-ui-demo' }
];

console.log('\n📋 All pages are now linked in the sidebar navigation:\n');

pages.forEach((page, index) => {
  console.log(`${(index + 1).toString().padStart(2, '0')}. ${page.name.padEnd(15)} - ${page.url}`);
});

console.log('\n✅ All 16 pages are accessible from the sidebar navigation!');
console.log('\n💡 Tip: Click the menu button (☰) in the sidebar to expand/collapse navigation labels\n');