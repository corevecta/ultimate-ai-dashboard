const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  let page;
  
  try {
    page = await browser.newPage();
    
    // Enable request interception to track API calls
    await page.setRequestInterception(true);
    const apiCalls = [];
    
    page.on('request', request => {
      if (request.url().includes('/api/')) {
        console.log('🔵 API Request:', request.method(), request.url());
        apiCalls.push({
          method: request.method(),
          url: request.url(),
          postData: request.postData()
        });
      }
      request.continue();
    });
    
    page.on('response', response => {
      if (response.url().includes('/api/')) {
        console.log('🟢 API Response:', response.status(), response.url());
      }
    });
    
    // Enable console logging
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      if (type === 'error') {
        console.log('❌ Console error:', text);
      } else if (type === 'warning') {
        console.log('⚠️  Console warning:', text);
      }
    });
    
    page.on('pageerror', err => {
      console.log('❌ Page error:', err.message);
    });
    
    console.log("\n📍 Step 1: Navigating to projects page...");
    await page.goto("http://localhost:3000/projects", {
      waitUntil: "networkidle2",
      timeout: 30000
    });
    
    console.log("✅ Page loaded\n");

    // Wait for projects to load
    await page.waitForSelector("h2", { timeout: 10000 });
    
    // Find and click New AI Project button
    console.log("📍 Step 2: Opening New AI Project dialog...");
    const newProjectButton = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(btn => btn.textContent.includes('New AI Project'));
    });
    
    if (!newProjectButton) {
      throw new Error("New AI Project button not found");
    }
    
    await newProjectButton.click();
    console.log("✅ Clicked New AI Project button\n");

    // Wait for dialog
    await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
    console.log("✅ Step 0 dialog opened\n");
    
    // Fill Step 1: Basic Info
    console.log("📍 Step 3: Filling Basic Info...");
    
    // Enter project name
    await page.type('input[id="project-name"]', "Periodic Table");
    console.log("✅ Entered project name: Periodic Table");
    
    // Find and click Static Site button
    const staticSiteButton = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('.grid button'));
      return buttons.find(btn => btn.textContent.includes('Static Site'));
    });
    
    if (staticSiteButton) {
      await staticSiteButton.click();
      console.log("✅ Selected Static Site type");
    }
    
    // Enter description
    const description = "I want to create a static page for enhanced modern full featured ui stunning and featured rich periodic table that is interactive showing full elements of 118+";
    await page.type('textarea[id="description"]', description);
    console.log("✅ Entered description\n");
    
    // Take screenshot
    await page.screenshot({ path: "test-step0-basic-info.png" });
    
    // Click Next button
    console.log("📍 Step 4: Moving to Business Context...");
    const nextButton = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(btn => btn.textContent === 'Next: Business Context');
    });
    
    if (!nextButton) {
      throw new Error("Next button not found");
    }
    
    await nextButton.click();
    console.log("✅ Clicked Next button\n");
    
    // Wait a bit for transition
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Step 2: Business Context
    console.log("📍 Step 5: Filling Business Context...");
    
    // Select Education industry
    const industrySelect = await page.$('[role="combobox"]');
    if (industrySelect) {
      await industrySelect.click();
      await new Promise(resolve => setTimeout(resolve, 500));
      await page.keyboard.type('Education');
      await page.keyboard.press('Enter');
      console.log("✅ Selected Education industry");
    }
    
    // Take screenshot
    await page.screenshot({ path: "test-step0-business-context.png" });
    
    // Click Generate Requirements
    console.log("\n📍 Step 6: Generating Requirements...");
    const generateButton = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(btn => btn.textContent.includes('Generate Requirements'));
    });
    
    if (!generateButton) {
      throw new Error("Generate Requirements button not found");
    }
    
    // Clear previous API calls
    apiCalls.length = 0;
    
    await page.evaluate((btn) => btn.click(), generateButton);
    console.log("✅ Clicked Generate Requirements button");
    console.log("⏳ Waiting for API response...\n");
    
    // Wait for the loading state to appear
    await page.waitForFunction(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const genBtn = buttons.find(btn => btn.textContent.includes('Generating Requirements'));
      return genBtn !== undefined;
    }, { timeout: 5000 }).catch(() => console.log("⚠️  Loading state not detected"));
    
    // Wait for API response (with longer timeout for LLM)
    const maxWaitTime = 120000; // 2 minutes
    const startTime = Date.now();
    
    try {
      // Wait for either success (requirements shown) or error
      await Promise.race([
        // Wait for requirements to appear
        page.waitForFunction(() => {
          const preElements = document.querySelectorAll('pre');
          return Array.from(preElements).some(pre => 
            pre.textContent && pre.textContent.includes('#') && pre.textContent.length > 100
          );
        }, { timeout: maxWaitTime }),
        
        // Wait for error message
        page.waitForFunction(() => {
          const errorElements = document.querySelectorAll('[class*="error"], [class*="Error"]');
          return Array.from(errorElements).some(el => 
            el.textContent && el.textContent.toLowerCase().includes('failed')
          );
        }, { timeout: maxWaitTime })
      ]);
      
      const elapsed = Date.now() - startTime;
      console.log(`✅ Response received after ${Math.round(elapsed/1000)}s\n`);
      
    } catch (timeoutError) {
      console.log(`❌ Timeout after ${maxWaitTime/1000}s waiting for response\n`);
    }
    
    // Check what actually happened
    const dialogState = await page.evaluate(() => {
      const dialog = document.querySelector('[role="dialog"]');
      if (!dialog) return { dialogOpen: false };
      
      // Check for requirements
      const preElement = dialog.querySelector('pre');
      const hasRequirements = preElement && preElement.textContent && preElement.textContent.length > 100;
      
      // Check for errors
      const errorElements = Array.from(dialog.querySelectorAll('[class*="error"], [class*="Error"]'));
      const errors = errorElements.map(el => el.textContent).filter(text => text && text.trim());
      
      // Check button states
      const buttons = Array.from(dialog.querySelectorAll('button'));
      const buttonTexts = buttons.map(btn => btn.textContent);
      
      return {
        dialogOpen: true,
        hasRequirements,
        requirementsPreview: hasRequirements ? preElement.textContent.substring(0, 200) + '...' : null,
        errors,
        buttons: buttonTexts
      };
    });
    
    console.log("📋 Dialog State:", JSON.stringify(dialogState, null, 2));
    
    // Take final screenshot
    await page.screenshot({ path: "test-step0-final-state.png" });
    
    // Analyze API calls
    console.log("\n📊 API Call Analysis:");
    const step0Calls = apiCalls.filter(call => call.url.includes('step0') || call.url.includes('orchestrator'));
    
    for (const call of step0Calls) {
      console.log(`\n🔹 ${call.method} ${call.url}`);
      if (call.postData) {
        try {
          const data = JSON.parse(call.postData);
          console.log("   Request data:", {
            name: data.name,
            type: data.type,
            descriptionLength: data.description?.length,
            hasBusinessContext: !!(data.targetAudience || data.industry)
          });
        } catch (e) {
          console.log("   Could not parse request data");
        }
      }
    }
    
    // Check server logs for errors
    console.log("\n🔍 Checking for Claude CLI issues:");
    console.log("- Claude CLI was called but got SIGTERM (timeout)");
    console.log("- This suggests the prompt is too long or Claude is not responding");
    console.log("- The orchestrator timeout is 90 seconds");
    
    console.log("\n💡 Recommendations:");
    console.log("1. Check if Claude CLI is properly installed and authenticated");
    console.log("2. Try running Claude CLI manually with a simple prompt");
    console.log("3. Consider reducing the prompt length");
    console.log("4. Check if Ollama is available as fallback");
    console.log("5. Increase timeout or use streaming response");

  } catch (error) {
    console.error("\n❌ Test failed:", error.message);
    if (page) {
      await page.screenshot({ path: "test-error.png" });
      console.log("📸 Error screenshot saved");
    }
  } finally {
    console.log("\n🏁 Test completed");
    // Keep browser open for 10 seconds to observe
    await new Promise(resolve => setTimeout(resolve, 10000));
    await browser.close();
  }
})();