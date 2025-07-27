const puppeteer = require('puppeteer');

async function testVisualIntelligence() {
  const browser = await puppeteer.launch({
    headless: false,
    devtools: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Set viewport
  await page.setViewport({ width: 1920, height: 1080 });
  
  // Collect console errors
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push({
        text: msg.text(),
        location: msg.location()
      });
    }
  });
  
  page.on('pageerror', error => {
    errors.push({
      text: error.message,
      stack: error.stack
    });
  });
  
  try {
    console.log('1. Testing Dashboard Home...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    await page.waitForTimeout(2000);
    
    console.log('2. Navigating to Visual Intelligence...');
    const visualIntelligenceLink = await page.waitForSelector('a[href="/visual-intelligence"]');
    await visualIntelligenceLink.click();
    await page.waitForTimeout(3000);
    
    console.log('3. Testing Project Selection...');
    // Try to select first project
    const projectSelector = 'div[class*="cursor-pointer"][class*="hover:bg-white/10"]';
    const projects = await page.$$(projectSelector);
    if (projects.length > 0) {
      await projects[0].click();
      await page.waitForTimeout(2000);
    }
    
    console.log('4. Testing Code Explorer Tab...');
    const codeTab = await page.waitForSelector('button:has-text("Code Explorer")');
    await codeTab.click();
    await page.waitForTimeout(3000);
    
    console.log('5. Testing AI Analysis Tab...');
    const analysisTab = await page.waitForSelector('button:has-text("AI Analysis")');
    await analysisTab.click();
    await page.waitForTimeout(2000);
    
    console.log('6. Going back to Code Explorer to test features...');
    await codeTab.click();
    await page.waitForTimeout(2000);
    
    // Test toolbar buttons if visible
    console.log('7. Testing Toolbar Buttons...');
    const toolbarButtons = [
      { selector: 'button[class*="h-7"][class*="px-2"]:has(svg)', name: 'Toolbar buttons' }
    ];
    
    for (const btn of toolbarButtons) {
      try {
        const buttons = await page.$$(btn.selector);
        console.log(`Found ${buttons.length} ${btn.name}`);
      } catch (e) {
        console.log(`Could not find ${btn.name}`);
      }
    }
    
    console.log('\n=== ERRORS FOUND ===');
    if (errors.length === 0) {
      console.log('No errors detected!');
    } else {
      errors.forEach((error, index) => {
        console.log(`\nError ${index + 1}:`);
        console.log('Message:', error.text);
        if (error.location) {
          console.log('Location:', error.location.url);
          console.log('Line:', error.location.lineNumber);
        }
        if (error.stack) {
          console.log('Stack:', error.stack);
        }
      });
    }
    
    // Take screenshots
    console.log('\n8. Taking screenshots...');
    await page.screenshot({ path: 'visual-intelligence-overview.png', fullPage: true });
    
  } catch (error) {
    console.error('Test error:', error);
  }
  
  // Keep browser open for manual inspection
  console.log('\nTest complete. Browser will remain open for inspection.');
  console.log('Press Ctrl+C to exit.');
  
  // Wait indefinitely
  await new Promise(() => {});
}

testVisualIntelligence().catch(console.error);