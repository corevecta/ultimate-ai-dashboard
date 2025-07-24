const puppeteer = require('puppeteer');

const pages = [
  '/', '/projects', '/orchestrator', '/workflow-designer', '/agents',
  '/plugins', '/learning-lab', '/deployments', '/infrastructure',
  '/monitoring', '/logs', '/security', '/data', '/integrations',
  '/advanced', '/ai-studio', '/api-explorer', '/analytics', '/jobs',
  '/mcp-servers', '/discovery', '/backend-features', '/docs', '/settings'
];

async function testWithPuppeteer() {
  console.log('Starting Puppeteer test with console error monitoring...\n');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const results = [];

  for (const path of pages) {
    const page = await browser.newPage();
    const errors = [];
    const consoleErrors = [];
    const networkErrors = [];
    
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
    
    // Capture network errors
    page.on('response', response => {
      const url = response.url();
      const status = response.status();
      if (status >= 400) {
        if (url.includes('.css') || url.includes('.js')) {
          networkErrors.push(`${status} - ${url}`);
        }
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
      
      // Check if page has proper styling
      const hasStyles = await page.evaluate(() => {
        const body = document.body;
        const computedStyle = window.getComputedStyle(body);
        return computedStyle.fontFamily !== '' && computedStyle.fontSize !== '';
      });
      
      const result = {
        path,
        status: response.status(),
        hasStyles,
        errors: errors.length,
        consoleErrors: consoleErrors.length,
        networkErrors: networkErrors.length,
        details: {
          errors: errors.slice(0, 2),
          consoleErrors: consoleErrors.slice(0, 2),
          networkErrors: networkErrors.slice(0, 2)
        }
      };
      
      results.push(result);
      
      if (result.status !== 200 || !hasStyles || result.networkErrors > 0) {
        console.log(`❌ ${path} - Status: ${result.status}, Styles: ${hasStyles ? 'Yes' : 'No'}`);
        if (result.networkErrors > 0) {
          console.log(`   Network errors: ${result.details.networkErrors.join(', ')}`);
        }
        if (result.consoleErrors > 0) {
          console.log(`   Console errors: ${result.details.consoleErrors.join(', ')}`);
        }
      } else {
        console.log(`✅ ${path} - OK`);
      }
      
    } catch (error) {
      console.log(`❌ ${path} - Error: ${error.message}`);
      results.push({
        path,
        status: 0,
        hasStyles: false,
        errors: 1,
        consoleErrors: 0,
        networkErrors: 0,
        details: {
          errors: [error.message]
        }
      });
    }
    
    await page.close();
  }
  
  await browser.close();
  
  // Summary
  console.log('\n=== SUMMARY ===');
  const working = results.filter(r => r.status === 200 && r.hasStyles && r.networkErrors === 0).length;
  const stylingIssues = results.filter(r => !r.hasStyles || r.networkErrors > 0).length;
  
  console.log(`Total pages: ${results.length}`);
  console.log(`✅ Fully working: ${working}`);
  console.log(`⚠️ Styling issues: ${stylingIssues}`);
  console.log(`❌ Failed: ${results.filter(r => r.status !== 200).length}`);
  
  // Common issues
  const allNetworkErrors = results.flatMap(r => r.details.networkErrors || []);
  if (allNetworkErrors.length > 0) {
    console.log('\n=== COMMON NETWORK ERRORS ===');
    const uniqueErrors = [...new Set(allNetworkErrors.map(e => e.split(' - ')[1]))];
    uniqueErrors.forEach(error => {
      console.log(`- ${error}`);
    });
  }
}

testWithPuppeteer().catch(console.error);