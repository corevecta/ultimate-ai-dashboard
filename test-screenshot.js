const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  page.setViewport({ width: 1920, height: 1080 });
  
  try {
    await page.goto('http://localhost:3000/projects', { 
      waitUntil: 'networkidle2',
      timeout: 15000 
    });
    
    await page.screenshot({ path: 'current-projects-page.png', fullPage: true });
    console.log('Screenshot saved as current-projects-page.png');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();