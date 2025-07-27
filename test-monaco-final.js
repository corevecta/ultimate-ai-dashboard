const puppeteer = require('puppeteer');
const { exec } = require('child_process');

async function testMonacoFinal() {
  console.log('🚀 Starting Monaco Final Test...');
  
  // Start dev server
  console.log('Starting development server...');
  const devProcess = exec('npm run dev', { 
    cwd: '/home/sali/ai/projects/projecthubv3/ultimate-ai-dashboard'
  });
  
  devProcess.stdout.on('data', (data) => {
    if (data.includes('Ready in')) {
      console.log('✅ Server ready, starting tests...');
      runTests();
    }
  });
  
  devProcess.stderr.on('data', (data) => {
    console.error('Dev server error:', data.toString());
  });
  
  async function runTests() {
    const browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      devtools: true
    });

    const page = await browser.newPage();
    
    const errors = [];
    
    // Capture console logs
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      
      if (type === 'error') {
        errors.push(text);
        console.error('❌ Console Error:', text);
      }
    });

    // Capture page errors
    page.on('pageerror', error => {
      errors.push(error.message);
      console.error('🔥 Page Error:', error.message);
    });

    try {
      console.log('📍 Navigating to Visual Intelligence...');
      await page.goto('http://localhost:3000/visual-intelligence', {
        waitUntil: 'networkidle0',
        timeout: 30000
      });

      console.log('⏳ Waiting for page to stabilize...');
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Check if page loaded
      const title = await page.title();
      console.log('📄 Page title:', title);

      // Click on first project
      console.log('🔍 Looking for projects...');
      const projects = await page.$$('[class*="cursor-pointer"][class*="hover:bg-white/10"]');
      console.log(`Found ${projects.length} projects`);

      if (projects.length > 0) {
        console.log('👆 Clicking first project...');
        await projects[0].click();
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      // Switch to Code Explorer tab
      console.log('🔄 Switching to Code Explorer...');
      const codeTab = await page.$('button[value="code"]');
      if (codeTab) {
        await codeTab.click();
        await new Promise(resolve => setTimeout(resolve, 3000));
      }

      // Check for Monaco editor
      console.log('🔍 Checking for Monaco Editor...');
      const hasMonaco = await page.evaluate(() => {
        const monacoElement = document.querySelector('.monaco-editor');
        const hasMonacoGlobal = typeof window.monaco !== 'undefined';
        return {
          element: !!monacoElement,
          global: hasMonacoGlobal,
          elementVisible: monacoElement ? monacoElement.offsetHeight > 0 : false
        };
      });
      
      console.log('Monaco status:', hasMonaco);

      // Check for advanced features
      console.log('\n🔍 Checking advanced features...');
      const features = await page.evaluate(() => {
        const results = {};
        
        // Check for various UI elements
        results.hasTerminal = !!document.querySelector('[class*="Terminal"]');
        results.hasGitIntegration = !!document.querySelector('[class*="GitIntegration"]');
        results.hasFileExplorer = !!document.querySelector('[class*="FileExplorer"]');
        results.hasAIAssistant = !!document.querySelector('[class*="ClaudeAI"]');
        results.hasDebugger = !!document.querySelector('[class*="Debugging"]');
        results.hasRefactoring = !!document.querySelector('[class*="Refactoring"]');
        
        return results;
      });
      
      console.log('Features found:', features);

      // Take screenshot
      await page.screenshot({ 
        path: 'monaco-final-test.png', 
        fullPage: true 
      });

      // Summary
      console.log('\n📊 Test Summary:');
      console.log('- Page loaded:', title ? '✅' : '❌');
      console.log('- Monaco element:', hasMonaco.element ? '✅' : '❌');
      console.log('- Monaco global:', hasMonaco.global ? '✅' : '❌');
      console.log('- Monaco visible:', hasMonaco.elementVisible ? '✅' : '❌');
      console.log('- Total errors:', errors.length);
      
      if (errors.length > 0) {
        console.log('\n❌ Errors found:');
        errors.forEach((err, i) => console.log(`${i + 1}. ${err}`));
      } else {
        console.log('\n✅ No errors detected!');
      }

      console.log('\n📸 Screenshot saved as monaco-final-test.png');

    } catch (error) {
      console.error('Test failed:', error.message);
      await page.screenshot({ path: 'monaco-error-final.png', fullPage: true });
    }

    // Keep browser open for manual inspection
    console.log('\n🔍 Browser will stay open. Press Ctrl+C to exit.');
  }
  
  process.on('SIGINT', () => {
    console.log('\nShutting down...');
    devProcess.kill();
    process.exit();
  });
}

testMonacoFinal().catch(console.error);