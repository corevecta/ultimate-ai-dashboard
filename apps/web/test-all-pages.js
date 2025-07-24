const puppeteer = require('puppeteer');

// List of all pages to test
const pages = [
  '/',
  '/projects',
  '/orchestrator',
  '/workflow-designer',
  '/agents',
  '/plugins',
  '/learning-lab',
  '/deployments',
  '/infrastructure',
  '/monitoring',
  '/logs',
  '/security',
  '/data',
  '/integrations',
  '/advanced',
  '/ai-studio',
  '/api-explorer',
  '/analytics',
  '/jobs',
  '/mcp-servers',
  '/discovery',
  '/docs',
  '/settings',
  '/backend-features',
  // Sub-pages
  '/orchestrator/dag',
  '/orchestrator/tasks',
  '/orchestrator/brand',
  '/orchestrator/prompts',
  '/monitoring/tracing',
  '/monitoring/metrics',
  '/monitoring/alerts',
  '/security/scanner',
  '/security/compliance',
  '/data/migrations',
  '/data/backups',
  '/integrations/gateway',
  '/integrations/webhooks',
  '/advanced/cache',
  '/advanced/circuit-breaker',
];

async function testAllPages() {
  console.log('Starting Puppeteer tests for all pages...\n');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const results = [];
  
  for (const path of pages) {
    const page = await browser.newPage();
    const errors = [];
    const consoleErrors = [];
    
    // Capture console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Capture page errors
    page.on('pageerror', error => {
      errors.push(error.toString());
    });
    
    // Capture response errors
    page.on('response', response => {
      if (response.status() >= 400) {
        errors.push(`HTTP ${response.status()} - ${response.url()}`);
      }
    });
    
    try {
      console.log(`Testing ${path}...`);
      const response = await page.goto(`http://localhost:3000${path}`, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });
      
      // Wait a bit for any async errors
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const result = {
        path,
        status: response.status(),
        statusText: response.statusText(),
        errors,
        consoleErrors,
        success: response.status() === 200 && errors.length === 0 && consoleErrors.length === 0
      };
      
      results.push(result);
      
      if (!result.success) {
        console.log(`❌ ${path} - Status: ${result.status}`);
        if (errors.length > 0) {
          console.log('   Page errors:', errors);
        }
        if (consoleErrors.length > 0) {
          console.log('   Console errors:', consoleErrors);
        }
      } else {
        console.log(`✅ ${path}`);
      }
      
    } catch (error) {
      console.log(`❌ ${path} - Error: ${error.message}`);
      results.push({
        path,
        status: 0,
        statusText: 'Failed to load',
        errors: [error.message],
        consoleErrors,
        success: false
      });
    }
    
    await page.close();
  }
  
  await browser.close();
  
  // Summary
  console.log('\n=== TEST SUMMARY ===');
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`Total pages tested: ${results.length}`);
  console.log(`✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);
  
  if (failed > 0) {
    console.log('\nFailed pages:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`\n${r.path}:`);
      console.log(`  Status: ${r.status} ${r.statusText}`);
      if (r.errors.length > 0) {
        console.log(`  Errors: ${r.errors.join(', ')}`);
      }
      if (r.consoleErrors.length > 0) {
        console.log(`  Console: ${r.consoleErrors.join(', ')}`);
      }
    });
  }
  
  // Find common errors
  const allErrors = results.flatMap(r => [...r.errors, ...r.consoleErrors]);
  const errorCounts = {};
  allErrors.forEach(error => {
    // Extract module not found errors
    const moduleMatch = error.match(/Module not found: Can't resolve '([^']+)'/);
    if (moduleMatch) {
      const key = `Module not found: ${moduleMatch[1]}`;
      errorCounts[key] = (errorCounts[key] || 0) + 1;
    } else {
      errorCounts[error] = (errorCounts[error] || 0) + 1;
    }
  });
  
  if (Object.keys(errorCounts).length > 0) {
    console.log('\n=== COMMON ERRORS ===');
    Object.entries(errorCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([error, count]) => {
        console.log(`${count}x: ${error}`);
      });
  }
}

testAllPages().catch(console.error);