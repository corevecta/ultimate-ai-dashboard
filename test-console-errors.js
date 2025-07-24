const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  // Collect all console messages
  const consoleMessages = [];
  
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    consoleMessages.push({ type, text });
    
    if (type === 'error' || type === 'warning') {
      console.log(`[${type.toUpperCase()}] ${text}`);
      
      // Try to get more details for errors
      msg.args().forEach(async (arg, index) => {
        try {
          const val = await arg.jsonValue();
          if (val && typeof val === 'object') {
            console.log(`  Arg ${index}:`, JSON.stringify(val, null, 2));
          }
        } catch (e) {
          // Some args can't be serialized
        }
      });
    }
  });
  
  // Catch page errors
  page.on('pageerror', error => {
    console.log('[PAGE ERROR]', error.message);
    console.log('Stack:', error.stack);
  });
  
  // Listen for response errors
  page.on('response', response => {
    if (!response.ok() && !response.url().includes('appspecific')) {
      console.log(`[HTTP ${response.status()}] ${response.url()}`);
    }
  });
  
  try {
    console.log('Navigating to projects page...');
    await page.goto('http://localhost:3000/projects', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    // Wait a bit for any async errors
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check if the page has any visible error elements
    const errorElements = await page.$$eval('[class*="error"], [class*="Error"]', elements => 
      elements.map(el => ({
        className: el.className,
        text: el.textContent?.substring(0, 100)
      }))
    );
    
    if (errorElements.length > 0) {
      console.log('\nError elements found on page:');
      errorElements.forEach(err => console.log(`  - ${err.className}: ${err.text}`));
    }
    
    // Try to get the stats
    const stats = await page.evaluate(() => {
      const statElements = document.querySelectorAll('.text-3xl.font-bold');
      return Array.from(statElements).map(el => el.textContent);
    });
    console.log('\nStats displayed:', stats);
    
    // Check if projects are loaded
    const projectCount = await page.$$eval('h3', elements => elements.length);
    console.log('Project cards found:', projectCount);
    
    // Take a screenshot
    await page.screenshot({ path: 'error-state.png', fullPage: true });
    console.log('\nScreenshot saved as error-state.png');
    
    // Log summary
    const errors = consoleMessages.filter(m => m.type === 'error');
    const warnings = consoleMessages.filter(m => m.type === 'warning');
    console.log(`\nSummary: ${errors.length} errors, ${warnings.length} warnings`);
    
  } catch (error) {
    console.error('Navigation error:', error);
  } finally {
    await browser.close();
  }
})();