const puppeteer = require('puppeteer');

// All 24 navigation items from src/lib/navigation.ts
const allPages = [
  { title: 'Dashboard', href: '/' },
  { title: 'Projects', href: '/projects' },
  { title: 'Orchestrator', href: '/orchestrator' },
  { title: 'Workflow Designer', href: '/workflow-designer' },
  { title: 'AI Agents', href: '/agents' },
  { title: 'Plugins', href: '/plugins' },
  { title: 'Learning Lab', href: '/learning-lab' },
  { title: 'Deployments', href: '/deployments' },
  { title: 'Infrastructure', href: '/infrastructure' },
  { title: 'Monitoring', href: '/monitoring' },
  { title: 'Logs', href: '/logs' },
  { title: 'Security', href: '/security' },
  { title: 'Data', href: '/data' },
  { title: 'Integrations', href: '/integrations' },
  { title: 'Advanced', href: '/advanced' },
  { title: 'AI Studio', href: '/ai-studio' },
  { title: 'API Explorer', href: '/api-explorer' },
  { title: 'Analytics', href: '/analytics' },
  { title: 'Jobs', href: '/jobs' },
  { title: 'MCP Servers', href: '/mcp-servers' },
  { title: 'Feature Discovery', href: '/discovery' },
  { title: 'Backend Features', href: '/backend-features' },
  { title: 'Documentation', href: '/docs' },
  { title: 'Settings', href: '/settings' }
];

async function testAllNavigation() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  console.log('Testing all 24 navigation items...\n');
  console.log('='.repeat(50));
  
  let successCount = 0;
  let failureCount = 0;
  
  for (const navItem of allPages) {
    try {
      await page.goto(`http://localhost:3000${navItem.href}`, {
        waitUntil: 'domcontentloaded',
        timeout: 10000
      });
      
      // Check if page loaded successfully (no 404)
      const pageTitle = await page.title();
      const is404 = pageTitle.includes('404') || pageTitle.includes('not found');
      
      // Check for AI Orchestrator layout
      const hasLayout = await page.evaluate(() => {
        return document.body.textContent.includes('AI Orchestrator');
      });
      
      // Check if navigation sidebar exists
      const hasNavigation = await page.evaluate(() => {
        const nav = document.querySelector('nav, aside');
        return nav !== null;
      });
      
      const status = !is404 && hasLayout && hasNavigation;
      
      if (status) {
        console.log(`✅ ${navItem.title.padEnd(20)} ${navItem.href}`);
        successCount++;
      } else {
        console.log(`❌ ${navItem.title.padEnd(20)} ${navItem.href}`);
        console.log(`   Issues: ${is404 ? '404 Page' : ''} ${!hasLayout ? 'No Layout' : ''} ${!hasNavigation ? 'No Nav' : ''}`);
        failureCount++;
      }
      
    } catch (error) {
      console.log(`❌ ${navItem.title.padEnd(20)} ${navItem.href} - Error: ${error.message}`);
      failureCount++;
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`\nSummary:`);
  console.log(`✅ Success: ${successCount}/${allPages.length} pages`);
  console.log(`❌ Failed: ${failureCount}/${allPages.length} pages`);
  console.log(`\nAll navigation items are configured in the sidebar.`);
  console.log(`Pages with issues need their components created.`);
  
  await browser.close();
}

testAllNavigation().catch(console.error);