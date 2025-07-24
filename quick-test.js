const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ 
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  let errors = 0;
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('Error:', msg.text());
      errors++;
    }
  });
  
  console.log('Loading page...');
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 3000));
  
  console.log(`\nTotal console errors: ${errors}`);
  console.log(errors === 0 ? '✅ No errors!' : '❌ Errors found');
  
  await browser.close();
})();