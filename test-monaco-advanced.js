const puppeteer = require('puppeteer');

async function testMonacoAdvanced() {
  console.log('🚀 Starting Monaco Advanced Editor Test...');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    devtools: true
  });

  const page = await browser.newPage();
  
  // Capture console logs
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    
    if (type === 'error') {
      console.error('❌ Console Error:', text);
      // Log stack trace for errors
      msg.args().forEach(async (arg) => {
        try {
          const val = await arg.jsonValue();
          if (val && val.stack) {
            console.error('Stack trace:', val.stack);
          }
        } catch (e) {}
      });
    } else if (type === 'warning') {
      console.warn('⚠️  Console Warning:', text);
    } else {
      console.log(`📝 Console ${type}:`, text);
    }
  });

  // Capture page errors
  page.on('pageerror', error => {
    console.error('🔥 Page Error:', error.message);
    console.error('Stack:', error.stack);
  });

  // Capture request failures
  page.on('requestfailed', request => {
    console.error('❌ Request Failed:', request.url(), '-', request.failure().errorText);
  });

  // Capture response errors
  page.on('response', response => {
    if (response.status() >= 400) {
      console.error('❌ HTTP Error:', response.status(), response.url());
    }
  });

  try {
    console.log('📍 Navigating to Visual Intelligence page...');
    await page.goto('http://localhost:3000/visual-intelligence', {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // Wait for initial load
    await page.waitForTimeout(3000);

    // Check if projects are loaded
    console.log('🔍 Checking for project list...');
    const projects = await page.$$('.cursor-pointer[class*="hover:bg-white/10"]');
    console.log(`Found ${projects.length} projects`);

    if (projects.length > 0) {
      console.log('👆 Clicking first project...');
      await projects[0].click();
      await page.waitForTimeout(2000);
    }

    // Switch to Code Explorer tab
    console.log('🔄 Switching to Code Explorer tab...');
    const codeTab = await page.$('button[value="code"]');
    if (codeTab) {
      await codeTab.click();
      await page.waitForTimeout(3000);
    }

    // Check for Monaco editor
    console.log('🔍 Checking for Monaco Editor...');
    const monacoContainer = await page.$('.monaco-editor');
    if (monacoContainer) {
      console.log('✅ Monaco Editor found!');
      
      // Get editor dimensions
      const box = await monacoContainer.boundingBox();
      console.log('📐 Editor dimensions:', box);
      
      // Check if editor is visible
      const isVisible = await page.evaluate(() => {
        const editor = document.querySelector('.monaco-editor');
        if (!editor) return false;
        const rect = editor.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      });
      
      console.log('👁️  Editor visible:', isVisible);
    } else {
      console.error('❌ Monaco Editor not found!');
    }

    // Check for specific components
    console.log('\n🔍 Checking for advanced components...');
    
    const components = [
      { selector: '[class*="IntelliSense"]', name: 'IntelliSense' },
      { selector: '[class*="Debugging"]', name: 'Debugging' },
      { selector: '[class*="CodeLens"]', name: 'CodeLens' },
      { selector: '[class*="Refactoring"]', name: 'Refactoring' },
      { selector: '[class*="FileSearch"]', name: 'Multi-file Search' }
    ];

    for (const component of components) {
      const found = await page.$(component.selector);
      console.log(`${found ? '✅' : '❌'} ${component.name}: ${found ? 'Found' : 'Not found'}`);
    }

    // Get all network errors
    console.log('\n📊 Checking failed network requests...');
    const failedRequests = [];
    page.on('requestfailed', request => {
      failedRequests.push({
        url: request.url(),
        error: request.failure().errorText
      });
    });

    // Check for module loading errors
    const moduleErrors = await page.evaluate(() => {
      return window.__moduleLoadErrors || [];
    });
    
    if (moduleErrors.length > 0) {
      console.error('\n❌ Module loading errors:', moduleErrors);
    }

    // Get performance metrics
    console.log('\n📊 Performance Metrics:');
    const metrics = await page.metrics();
    console.log('- JS Heap Used:', (metrics.JSHeapUsedSize / 1024 / 1024).toFixed(2), 'MB');
    console.log('- DOM Nodes:', metrics.Nodes);
    console.log('- JS Event Listeners:', metrics.JSEventListeners);

    // Take screenshot
    console.log('\n📸 Taking screenshot...');
    await page.screenshot({ path: 'monaco-advanced-test.png', fullPage: true });

    console.log('\n✅ Test completed! Check monaco-advanced-test.png for visual output.');

  } catch (error) {
    console.error('\n🔥 Test failed:', error);
    await page.screenshot({ path: 'monaco-error-state.png', fullPage: true });
  }

  // Keep browser open for debugging
  console.log('\n🔍 Browser will stay open for debugging. Press Ctrl+C to exit.');
}

testMonacoAdvanced().catch(console.error);