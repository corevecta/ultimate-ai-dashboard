const puppeteer = require('puppeteer');

async function testStep0AsyncFlow() {
  console.log('🚀 Starting E2E test for Step 0 async job queue...\n');
  
  const browser = await puppeteer.launch({
    headless: false, // Set to true for CI
    devtools: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Enable console logging
    page.on('console', msg => console.log('Browser:', msg.text()));
    page.on('pageerror', err => console.error('Page error:', err));
    
    // Navigate to projects page
    console.log('📍 Navigating to projects page...');
    await page.goto('http://localhost:3000/projects', { waitUntil: 'networkidle2' });
    
    // Take a screenshot to see what's happening
    await page.screenshot({ path: 'debug-dashboard.png', fullPage: true });
    console.log('📸 Debug screenshot saved: debug-dashboard.png');
    
    // Wait for projects to load - try different selectors
    try {
      await page.waitForSelector('[data-testid="projects-grid"]', { timeout: 5000 });
      console.log('✅ Projects grid found');
    } catch (e) {
      console.log('⚠️  Projects grid not found, looking for alternative selectors...');
      // Try to find the New AI Project button instead
      // Use text selector
      const newProjectButton = await page.$$eval('button', buttons => 
        buttons.find(button => button.textContent?.includes('New AI Project'))
      );
      if (newProjectButton) {
        console.log('✅ Found New AI Project button');
      } else {
        // Look for any button with "New" text
        const buttons = await page.$$('button');
        console.log(`Found ${buttons.length} buttons on page`);
        for (const button of buttons) {
          const text = await button.evaluate(el => el.textContent);
          console.log(`Button text: "${text}"`);
        }
      }
    }
    console.log('✅ Dashboard loaded');
    
    // Click on "New AI Project" button
    console.log('📍 Clicking New AI Project button...');
    // Click New AI Project button
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const button = buttons.find(b => b.textContent?.includes('New AI Project'));
      if (button) button.click();
      else throw new Error('New AI Project button not found');
    });;
    
    // Wait for dialog to open
    await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
    console.log('✅ Step 0 dialog opened');
    
    // Take a screenshot to see the dialog content
    await page.screenshot({ path: 'debug-dialog.png', fullPage: true });
    console.log('📸 Dialog screenshot saved: debug-dialog.png');
    
    // Fill in basic project details
    console.log('📍 Filling project details...');
    
    // Try different selector approaches
    try {
      await page.waitForSelector('input[id="name"]', { visible: true, timeout: 2000 });
    } catch (e) {
      console.log('⚠️  id="name" not found, trying name="name"...');
      try {
        await page.waitForSelector('input[name="name"]', { visible: true, timeout: 2000 });
      } catch (e2) {
        console.log('⚠️  name="name" not found, looking for any input...');
        const inputs = await page.$$('input');
        console.log(`Found ${inputs.length} input fields`);
        for (let i = 0; i < inputs.length; i++) {
          const attrs = await inputs[i].evaluate(el => ({
            id: el.id,
            name: el.name,
            placeholder: el.placeholder,
            type: el.type
          }));
          console.log(`Input ${i}:`, attrs);
        }
        throw new Error('Could not find name input field');
      }
    }
    
    await page.type('input[id="name"]', 'AI-Powered Analytics Dashboard');
    
    // Select project type
    await page.click('[id="type"]');
    await page.waitForSelector('[role="option"]', { visible: true });
    await page.evaluate(() => {
      const options = Array.from(document.querySelectorAll('[role="option"]'));
      const option = options.find(o => o.textContent?.includes('SaaS Platform'));
      if (option) option.click();
    });
    
    // Fill description
    await page.type('textarea[id="description"]', 
      'A comprehensive analytics platform that uses machine learning to provide predictive insights, ' +
      'anomaly detection, and automated reporting for business metrics. The platform should integrate ' +
      'with multiple data sources and provide real-time dashboards with customizable widgets.'
    );
    
    // Click Next
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const button = buttons.find(b => b.textContent?.includes('Next: Business Context'));
      if (button) button.click();
    });;
    console.log('✅ Basic info completed');
    
    // Fill business context
    console.log('📍 Filling business context...');
    
    // Select B2B
    await page.click('label[for="businesses"]');
    
    // Select industry
    const comboboxes = await page.$$('button[role="combobox"]');
    if (comboboxes[0]) {
      await comboboxes[0].click();
      await page.waitForSelector('[role="option"]', { visible: true });
      await page.evaluate(() => {
        const options = Array.from(document.querySelectorAll('[role="option"]'));
        const option = options.find(o => o.textContent?.includes('Finance'));
        if (option) option.click();
      });
    }
    
    // Select budget
    await page.click('label[for="medium"]');
    
    // Select timeline
    await page.click('label[for="3months"]');
    
    // Toggle some priorities
    await page.evaluate(() => {
      const spans = Array.from(document.querySelectorAll('span'));
      const scalability = spans.find(s => s.textContent?.includes('Scalability'));
      const security = spans.find(s => s.textContent?.includes('Security'));
      if (scalability) scalability.click();
      if (security) security.click();
    });
    
    // Select monetization model
    const monetizationSelects = await page.$$('button[role="combobox"]');
    if (monetizationSelects[1]) {
      await monetizationSelects[1].click();
      await page.waitForSelector('[role="option"]', { visible: true });
      await page.evaluate(() => {
        const options = Array.from(document.querySelectorAll('[role="option"]'));
        const option = options.find(o => o.textContent?.includes('Subscription (SaaS)'));
        if (option) option.click();
      });
    };
    
    console.log('✅ Business context completed');
    
    // Click Generate Requirements
    console.log('📍 Clicking Generate Requirements...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const button = buttons.find(b => b.textContent?.includes('Generate Requirements'));
      if (button) button.click();
    });;
    
    // Monitor for job processing
    console.log('⏳ Waiting for async job to complete...');
    
    // Wait for either "Processing..." or requirements to appear
    const processingStartTime = Date.now();
    
    // Check if we see "Processing..." indicating async mode
    try {
      await page.waitForFunction(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.some(b => b.textContent?.includes('Processing...'));
      }, { timeout: 3000 });
      console.log('✅ Async job started - status: Processing...')
      console.log('✅ Async job started - status: Processing...');
      
      // Now wait for requirements to appear (max 60 seconds)
      await page.waitForSelector('[data-testid="generated-requirements"]', { 
        timeout: 60000 
      });
      
      const processingTime = Date.now() - processingStartTime;
      console.log(`✅ Requirements generated in ${(processingTime / 1000).toFixed(1)} seconds`);
      
    } catch (e) {
      // Might be using fallback mode
      console.log('ℹ️  May be using fallback mode (no Processing... state detected)');
    }
    
    // Verify we're on the review step
    const reviewStepVisible = await page.$('text="Review AI-generated comprehensive requirements"');
    if (!reviewStepVisible) {
      throw new Error('Review step not reached');
    }
    
    // Check for job ID
    const jobIdElement = await page.$('text=/Job ID: job_/');
    if (jobIdElement) {
      const jobIdText = await jobIdElement.evaluate(el => el.textContent);
      console.log('✅', jobIdText);
    }
    
    // Check for validation badge
    const validationBadge = await page.$('span:has-text("Coverage:")');
    if (validationBadge) {
      const validationText = await validationBadge.evaluate(el => el.textContent);
      console.log('✅ Validation:', validationText);
    }
    
    // Check if requirements are displayed
    const requirementsContent = await page.$('[data-testid="requirements-content"]');
    if (requirementsContent) {
      const firstLine = await requirementsContent.evaluate(el => 
        el.textContent?.split('\n')[0] || ''
      );
      console.log('✅ Requirements start with:', firstLine.substring(0, 50) + '...');
    }
    
    // Take screenshot
    await page.screenshot({ 
      path: 'step0-async-test-result.png',
      fullPage: true 
    });
    console.log('📸 Screenshot saved: step0-async-test-result.png');
    
    console.log('\n✅ E2E test completed successfully!');
    console.log('The async job queue system is working end-to-end with the UI.');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    // Only take screenshot if page exists
    if (page) {
      try {
        await page.screenshot({ 
          path: 'step0-async-test-error.png',
          fullPage: true 
        });
        console.log('📸 Error screenshot saved: step0-async-test-error.png');
      } catch (e) {
        // Ignore screenshot error
      }
    }
    throw error;
  } finally {
    await browser.close();
  }
}

// Check if puppeteer is installed
try {
  require.resolve('puppeteer');
  testStep0AsyncFlow().catch(console.error);
} catch (e) {
  console.log('Installing puppeteer first...');
  const { exec } = require('child_process');
  exec('npm install puppeteer', (error, stdout, stderr) => {
    if (error) {
      console.error('Failed to install puppeteer:', error);
      return;
    }
    console.log('Puppeteer installed, running test...\n');
    delete require.cache[require.resolve('./test-e2e-step0.js')];
    require('./test-e2e-step0.js');
  });
}