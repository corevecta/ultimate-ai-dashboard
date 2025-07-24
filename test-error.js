const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  // Listen for console messages
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('Console error:', msg.text());
      msg.args().forEach(async arg => {
        try {
          const props = await arg.properties();
          for (const [key, value] of props) {
            console.log(`  ${key}: ${await value.jsonValue()}`);
          }
        } catch (e) {}
      });
    }
  });
  
  // Listen for page errors
  page.on('pageerror', error => {
    console.log('Page error:', error.message);
    console.log('Stack:', error.stack);
  });
  
  try {
    console.log('Opening projects page...');
    await page.goto('http://localhost:3000/projects', { 
      waitUntil: 'domcontentloaded',
      timeout: 15000 
    });
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    console.log('Page loaded, check browser window for errors');
    
  } catch (error) {
    console.error('Error:', error);
  }
  
  // Keep browser open for debugging
  await new Promise(resolve => setTimeout(resolve, 30000));
  await browser.close();
})();