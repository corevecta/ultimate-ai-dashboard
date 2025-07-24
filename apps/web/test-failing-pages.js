const puppeteer = require('puppeteer');

const failingPages = ['/', '/advanced', '/api-explorer', '/analytics'];

async function testFailingPages() {
  console.log('Testing failing pages...\n');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  for (const path of failingPages) {
    const page = await browser.newPage();
    const errors = [];
    const consoleErrors = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    page.on('pageerror', error => {
      errors.push(error.toString());
    });
    
    try {
      console.log(`Testing ${path}...`);
      const response = await page.goto(`http://localhost:3000${path}`, {
        waitUntil: 'networkidle2',
        timeout: 10000
      });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(`  Status: ${response.status()}`);
      if (errors.length > 0) {
        console.log(`  Page errors:`, errors.slice(0, 2));
      }
      if (consoleErrors.length > 0) {
        console.log(`  Console errors:`, consoleErrors.slice(0, 2));
      }
      console.log('');
      
    } catch (error) {
      console.log(`  Error: ${error.message}\n`);
    }
    
    await page.close();
  }
  
  await browser.close();
}

testFailingPages().catch(console.error);