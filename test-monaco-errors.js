const puppeteer = require('puppeteer');

async function testMonacoErrors() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  const errors = [];
  const warnings = [];
  
  // Capture console logs
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    
    if (type === 'error') {
      errors.push(text);
      console.error('❌ Error:', text);
    } else if (type === 'warning') {
      warnings.push(text);
    }
  });

  // Capture page errors
  page.on('pageerror', error => {
    errors.push(error.message);
    console.error('🔥 Page Error:', error.message);
  });

  try {
    console.log('🚀 Navigating to Visual Intelligence...');
    await page.goto('http://localhost:3000/visual-intelligence', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    // Wait a bit for dynamic content
    await page.waitForFunction(() => document.readyState === 'complete', { timeout: 5000 });
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Check if page loaded successfully
    const title = await page.title();
    console.log('📄 Page title:', title);

    // Click on a project to trigger Monaco loading
    const projectCards = await page.$$('[class*="cursor-pointer"]');
    if (projectCards.length > 0) {
      console.log('👆 Clicking first project...');
      await projectCards[0].click();
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Switch to code tab
    const codeTab = await page.$('button[value="code"]');
    if (codeTab) {
      console.log('🔄 Switching to Code tab...');
      await codeTab.click();
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Check for Monaco
    const hasMonaco = await page.evaluate(() => {
      return !!window.monaco || !!document.querySelector('.monaco-editor');
    });
    
    console.log('🔍 Monaco detected:', hasMonaco);

    if (!hasMonaco) {
      // Check what's actually on the page
      const bodyText = await page.evaluate(() => document.body.innerText);
      console.log('📝 Page content preview:', bodyText.substring(0, 200) + '...');
    }

    // Summary
    console.log('\n📊 Summary:');
    console.log('- Total errors:', errors.length);
    console.log('- Total warnings:', warnings.length);
    
    if (errors.length > 0) {
      console.log('\n❌ All errors:');
      errors.forEach((err, i) => console.log(`${i + 1}. ${err}`));
    }

  } catch (error) {
    console.error('Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

testMonacoErrors().catch(console.error);