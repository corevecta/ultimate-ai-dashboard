const puppeteer = require('puppeteer');

async function quickTest() {
  let browser;
  try {
    browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
    
    const page = await browser.newPage();
    
    // Collect errors
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    page.on('pageerror', error => {
      errors.push(error.message);
    });
    
    console.log('Testing http://localhost:3000...');
    try {
      await page.goto('http://localhost:3000', { 
        waitUntil: 'domcontentloaded',
        timeout: 5000 
      });
      console.log('✅ Home page loaded');
      
      // Try visual intelligence
      await page.goto('http://localhost:3000/visual-intelligence', { 
        waitUntil: 'domcontentloaded',
        timeout: 5000 
      });
      console.log('✅ Visual Intelligence page loaded');
      
    } catch (e) {
      console.log('❌ Page load failed:', e.message);
    }
    
    if (errors.length > 0) {
      console.log('\n❌ Console Errors Found:');
      errors.forEach(err => console.log('  -', err));
    } else {
      console.log('\n✅ No console errors');
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
  } finally {
    if (browser) await browser.close();
  }
}

quickTest();