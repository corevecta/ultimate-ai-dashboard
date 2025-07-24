const puppeteer = require('puppeteer');
const { spawn } = require('child_process');

// Colors for output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testDashboard() {
  console.log(`${colors.blue}Starting Ultimate AI Dashboard test...${colors.reset}\n`);
  
  // Start the Next.js server
  console.log(`${colors.yellow}Starting Next.js server on port 3002...${colors.reset}`);
  const server = spawn('pnpm', ['dev', '-p', '3002'], {
    cwd: __dirname + '/apps/web',
    shell: true
  });

  let serverReady = false;
  
  server.stdout.on('data', (data) => {
    const output = data.toString();
    if (output.includes('Ready in') || output.includes('started server on')) {
      serverReady = true;
    }
    console.log(`[Server] ${output.trim()}`);
  });

  server.stderr.on('data', (data) => {
    console.error(`[Server Error] ${data.toString().trim()}`);
  });

  // Wait for server to be ready
  console.log(`${colors.yellow}Waiting for server to be ready...${colors.reset}`);
  let attempts = 0;
  while (!serverReady && attempts < 30) {
    await sleep(1000);
    attempts++;
  }

  if (!serverReady) {
    console.error(`${colors.red}Server failed to start after 30 seconds${colors.reset}`);
    server.kill();
    process.exit(1);
  }

  // Give it a bit more time to fully initialize
  await sleep(3000);

  try {
    // Launch browser
    console.log(`\n${colors.yellow}Launching Puppeteer browser...${colors.reset}`);
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    
    // Set viewport
    await page.setViewport({ width: 1920, height: 1080 });

    // Collect console messages and errors
    const consoleMessages = [];
    const pageErrors = [];
    
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      consoleMessages.push({ type, text });
      
      if (type === 'error') {
        console.log(`${colors.red}[Console Error] ${text}${colors.reset}`);
      } else if (type === 'warning') {
        console.log(`${colors.yellow}[Console Warning] ${text}${colors.reset}`);
      }
    });

    page.on('pageerror', error => {
      pageErrors.push(error.message);
      console.log(`${colors.red}[Page Error] ${error.message}${colors.reset}`);
    });

    // Test pages
    const pages = [
      { path: '/', name: 'Dashboard' },
      { path: '/projects', name: 'Projects' },
      { path: '/jobs', name: 'Jobs' },
      { path: '/ai-studio', name: 'AI Studio' },
      { path: '/templates', name: 'Templates' },
      { path: '/platforms', name: 'Platforms' },
      { path: '/deployments', name: 'Deployments' },
      { path: '/analytics', name: 'Analytics' },
      { path: '/settings', name: 'Settings' }
    ];

    console.log(`\n${colors.blue}Testing pages...${colors.reset}\n`);

    for (const pageInfo of pages) {
      console.log(`${colors.yellow}Testing ${pageInfo.name} page...${colors.reset}`);
      
      try {
        const response = await page.goto(`http://localhost:3002${pageInfo.path}`, {
          waitUntil: 'networkidle0',
          timeout: 30000
        });

        const status = response.status();
        
        if (status === 200) {
          console.log(`${colors.green}✓ ${pageInfo.name}: OK (${status})${colors.reset}`);
          
          // Take screenshot
          await page.screenshot({ 
            path: `screenshots/${pageInfo.name.toLowerCase().replace(' ', '-')}.png`,
            fullPage: true 
          });
          
          // Check for key elements
          const hasContent = await page.evaluate(() => {
            return document.body.textContent.trim().length > 0;
          });
          
          if (!hasContent) {
            console.log(`${colors.yellow}  Warning: Page appears to be empty${colors.reset}`);
          }
        } else {
          console.log(`${colors.red}✗ ${pageInfo.name}: Error (${status})${colors.reset}`);
        }
      } catch (error) {
        console.log(`${colors.red}✗ ${pageInfo.name}: Failed - ${error.message}${colors.reset}`);
      }
      
      await sleep(1000);
    }

    // Summary
    console.log(`\n${colors.blue}Test Summary:${colors.reset}`);
    console.log(`Console errors: ${pageErrors.length}`);
    console.log(`Console warnings: ${consoleMessages.filter(m => m.type === 'warning').length}`);
    
    if (pageErrors.length > 0) {
      console.log(`\n${colors.red}Page Errors:${colors.reset}`);
      pageErrors.forEach(error => console.log(`  - ${error}`));
    }

    await browser.close();
    server.kill();
    
    if (pageErrors.length === 0) {
      console.log(`\n${colors.green}✓ All tests passed!${colors.reset}`);
      process.exit(0);
    } else {
      console.log(`\n${colors.red}✗ Tests failed with errors${colors.reset}`);
      process.exit(1);
    }
    
  } catch (error) {
    console.error(`\n${colors.red}Test failed: ${error.message}${colors.reset}`);
    server.kill();
    process.exit(1);
  }
}

// Create screenshots directory
const fs = require('fs');
if (!fs.existsSync('screenshots')) {
  fs.mkdirSync('screenshots');
}

// Run the test
testDashboard().catch(error => {
  console.error(`${colors.red}Unexpected error: ${error}${colors.reset}`);
  process.exit(1);
});