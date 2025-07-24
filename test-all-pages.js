const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Define all routes to test
const routes = [
  { path: '/', name: 'Home/Dashboard' },
  { path: '/projects', name: 'Projects' },
  { path: '/jobs', name: 'Jobs' },
  { path: '/mcp-servers', name: 'MCP Servers' },
  { path: '/agents', name: 'Agents' },
  { path: '/plugins', name: 'Plugins' },
  { path: '/analytics', name: 'Analytics' },
  { path: '/errors', name: 'Errors' },
  { path: '/settings', name: 'Settings' },
  { path: '/docs', name: 'Documentation' },
  { path: '/shared-ui-demo', name: 'Shared UI Demo' },
  { path: '/ai-studio', name: 'AI Studio' },
  { path: '/templates', name: 'Templates' },
  { path: '/platforms', name: 'Platforms' },
  { path: '/deployments', name: 'Deployments' }
];

async function testAllPages() {
  console.log('🚀 Testing Ultimate AI Dashboard - All Pages\n');
  
  const results = {
    passed: [],
    failed: [],
    errors: {}
  };
  
  let browser;
  
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    for (const route of routes) {
      console.log(`\n📍 Testing ${route.name} (${route.path})...`);
      
      const page = await browser.newPage();
      await page.setViewport({ width: 1920, height: 1080 });
      
      // Collect console errors
      const pageErrors = [];
      const consoleErrors = [];
      
      page.on('error', err => pageErrors.push(err.message));
      page.on('pageerror', err => pageErrors.push(err.message));
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });
      
      try {
        const response = await page.goto(`http://localhost:3002${route.path}`, {
          waitUntil: 'domcontentloaded',
          timeout: 10000
        });
        
        const status = response.status();
        
        if (status === 200) {
          console.log(`✅ ${route.name} loaded successfully (Status: ${status})`);
          
          // Check for content
          const hasContent = await page.evaluate(() => {
            return document.body && document.body.textContent.trim().length > 0;
          });
          
          if (hasContent) {
            console.log(`✅ ${route.name} has content`);
            results.passed.push(route);
          } else {
            console.log(`⚠️  ${route.name} appears to be empty`);
            results.failed.push(route);
          }
          
          // Take screenshot
          await page.screenshot({ 
            path: `screenshots/${route.name.toLowerCase().replace(/\s+/g, '-')}.png` 
          });
          
        } else {
          console.log(`❌ ${route.name} failed to load (Status: ${status})`);
          results.failed.push(route);
        }
        
        // Record any errors
        if (pageErrors.length > 0 || consoleErrors.length > 0) {
          results.errors[route.path] = {
            pageErrors,
            consoleErrors
          };
          console.log(`⚠️  ${route.name} has ${pageErrors.length + consoleErrors.length} errors`);
        }
        
      } catch (error) {
        console.log(`❌ ${route.name} test failed: ${error.message}`);
        results.failed.push(route);
        results.errors[route.path] = {
          testError: error.message
        };
      }
      
      await page.close();
    }
    
  } catch (error) {
    console.error('Fatal error:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
  
  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Passed: ${results.passed.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  console.log(`⚠️  Pages with errors: ${Object.keys(results.errors).length}`);
  
  if (results.failed.length > 0) {
    console.log('\n❌ Failed pages:');
    results.failed.forEach(route => {
      console.log(`   - ${route.name} (${route.path})`);
    });
  }
  
  if (Object.keys(results.errors).length > 0) {
    console.log('\n⚠️  Errors by page:');
    for (const [path, errors] of Object.entries(results.errors)) {
      const route = routes.find(r => r.path === path);
      console.log(`\n   ${route.name} (${path}):`);
      
      if (errors.testError) {
        console.log(`     Test Error: ${errors.testError}`);
      }
      if (errors.pageErrors?.length > 0) {
        console.log('     Page Errors:');
        errors.pageErrors.forEach(err => console.log(`       - ${err}`));
      }
      if (errors.consoleErrors?.length > 0) {
        console.log('     Console Errors:');
        errors.consoleErrors.forEach(err => console.log(`       - ${err}`));
      }
    }
  }
  
  // Write detailed report
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: routes.length,
      passed: results.passed.length,
      failed: results.failed.length,
      withErrors: Object.keys(results.errors).length
    },
    results
  };
  
  fs.writeFileSync('test-report.json', JSON.stringify(report, null, 2));
  console.log('\n📄 Detailed report saved to test-report.json');
  
  // Return exit code
  return results.failed.length === 0 ? 0 : 1;
}

// Create screenshots directory
if (!fs.existsSync('screenshots')) {
  fs.mkdirSync('screenshots');
}

// Run tests
testAllPages().then(exitCode => {
  process.exit(exitCode);
});