const puppeteer = require('puppeteer');

async function testDashboard() {
  console.log('Testing Ultimate AI Dashboard...\n');
  
  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    // Collect errors
    const errors = [];
    page.on('error', err => errors.push(`Page Error: ${err.message}`));
    page.on('pageerror', err => errors.push(`Page Error: ${err.message}`));
    
    console.log('Loading http://localhost:3002...');
    const response = await page.goto('http://localhost:3002', {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    const status = response.status();
    console.log(`Status: ${status}`);

    if (status === 200) {
      console.log('✓ Dashboard loaded successfully!');
      
      // Take screenshot
      await page.screenshot({ path: 'dashboard-screenshot.png' });
      console.log('✓ Screenshot saved to dashboard-screenshot.png');
      
      // Check for content
      const title = await page.title();
      console.log(`Page title: ${title}`);
      
      const hasContent = await page.evaluate(() => {
        const body = document.body;
        return body && body.textContent.trim().length > 0;
      });
      
      if (hasContent) {
        console.log('✓ Page has content');
      } else {
        console.log('✗ Page appears to be empty');
      }
      
      // Check for navigation elements
      const navItems = await page.evaluate(() => {
        const items = document.querySelectorAll('nav a');
        return Array.from(items).map(a => a.textContent);
      });
      
      if (navItems.length > 0) {
        console.log(`✓ Found ${navItems.length} navigation items:`, navItems);
      }
      
    } else {
      console.log(`✗ Failed to load dashboard (status: ${status})`);
    }

    if (errors.length > 0) {
      console.log('\nErrors found:');
      errors.forEach(err => console.log(`  - ${err}`));
    } else {
      console.log('\n✓ No errors detected');
    }

    await browser.close();
    
  } catch (error) {
    console.error('Test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
testDashboard();