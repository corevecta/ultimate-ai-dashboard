const puppeteer = require('puppeteer');

const pages = [
  '/',
  '/advanced',
  '/backend-features',
  '/data',
  '/infrastructure',
  '/integrations',
  '/security',
  '/monitoring',
  '/api-explorer',
  '/agents',
  '/deployments',
  '/plugins',
  '/workflow-designer',
  '/learning-lab',
  '/discovery'
];

(async () => {
  console.log('Starting critical page tests...\n');
  
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  const results = [];
  let passedCount = 0;
  let failedCount = 0;
  
  // Ignore non-critical errors
  const ignoredPatterns = [
    /_vercel\/(insights|speed-insights)/,
    /favicon\.ico/,
    /\.map$/
  ];
  
  for (const path of pages) {
    const url = `http://localhost:3000${path}`;
    console.log(`Testing ${path}...`);
    
    const errors = [];
    let statusCode = null;
    
    // Listen for console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Filter out non-critical errors
        if (!ignoredPatterns.some(pattern => pattern.test(text))) {
          errors.push(text);
        }
      }
    });
    
    // Listen for page errors
    page.on('pageerror', error => {
      const errorStr = error.toString();
      // Filter out non-critical errors
      if (!ignoredPatterns.some(pattern => pattern.test(errorStr))) {
        errors.push(errorStr);
      }
    });
    
    try {
      const response = await page.goto(url, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });
      statusCode = response.status();
      
      // Wait a bit for any async errors
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if page has content
      const content = await page.content();
      if (!content || content.length < 100) {
        errors.push('Page appears to be empty');
      }
      
      // Check for React error boundary
      const hasReactError = await page.evaluate(() => {
        return document.body.textContent.includes('Application error:') ||
               document.body.textContent.includes('Something went wrong');
      });
      
      if (hasReactError) {
        errors.push('React Error Boundary triggered');
      }
      
    } catch (error) {
      errors.push(`Navigation error: ${error.message}`);
      statusCode = 'ERROR';
    }
    
    const passed = statusCode === 200 && errors.length === 0;
    if (passed) {
      console.log(`✅ ${path} - OK`);
      passedCount++;
    } else {
      console.log(`❌ ${path} - Status: ${statusCode}`);
      if (errors.length > 0) {
        console.log(`   Errors: ${errors.join(', ')}`);
      }
      failedCount++;
    }
    
    results.push({ path, statusCode, errors, passed });
    
    // Clear event listeners
    page.removeAllListeners('console');
    page.removeAllListeners('pageerror');
  }
  
  await browser.close();
  
  // Summary
  console.log('\n=====================================');
  console.log('TEST SUMMARY');
  console.log('=====================================');
  console.log(`Total pages tested: ${pages.length}`);
  console.log(`Passed: ${passedCount}`);
  console.log(`Failed: ${failedCount}`);
  console.log('=====================================\n');
  
  if (failedCount > 0) {
    console.log('Failed pages:');
    results.filter(r => !r.passed).forEach(r => {
      console.log(`- ${r.path}: ${r.errors.join(', ') || `HTTP ${r.statusCode}`}`);
    });
    process.exit(1);
  } else {
    console.log('All critical pages are working correctly! 🎉');
    process.exit(0);
  }
})();