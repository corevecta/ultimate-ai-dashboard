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
    
    console.log("📍 Navigating to projects page...");
    await page.goto("http://localhost:3000/projects", {
      waitUntil: "networkidle2",
      timeout: 30000
    });
    
    console.log("✅ Page loaded");

    // Wait for projects to load
    await page.waitForSelector("h2", { timeout: 10000 });
    
    // Find and click New AI Project button
    const newProjectButton = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(btn => btn.textContent.includes('New AI Project'));
    });
    
    if (!newProjectButton) {
      throw new Error("New AI Project button not found");
    }
    
    await newProjectButton.click();
    console.log("✅ Clicked New AI Project button");

    // Wait for dialog
    await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
    console.log("✅ Step 0 dialog opened");
    
    // Test Step 1: Basic Info
    console.log("\n🔍 Testing Step 1: Basic Info");
    
    // Check for name input
    const nameInput = await page.$('input[id="project-name"]');
    if (nameInput) {
      await nameInput.type("Enhanced Periodic Table");
      console.log("✅ Entered project name");
    } else {
      console.log("❌ Name input not found");
    }
    
    // Check project types
    const typeButtons = await page.$$eval('.grid button', buttons => 
      buttons.map(btn => ({
        text: btn.textContent,
        classes: btn.className
      }))
    );
    console.log(`✅ Found ${typeButtons.length} project type buttons`);
    
    // Click on Static Site type
    const staticSiteButton = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('.grid button'));
      return buttons.find(btn => btn.textContent.includes('Static Site'));
    });
    
    if (staticSiteButton) {
      await staticSiteButton.click();
      console.log("✅ Selected Static Site type");
    }
    
    // Enter description
    const descTextarea = await page.$('textarea[id="description"]');
    if (descTextarea) {
      await descTextarea.type("I want to create enhanced periodic table interactive full featured, modern looking with stunning ui with full elements and other details proper coloring on a single html page without requiring server that can work in offline mode");
      console.log("✅ Entered project description");
    } else {
      console.log("❌ Description textarea not found");
    }
    
    // Take screenshot of Step 1
    await page.screenshot({ path: "step0-step1.png" });
    console.log("📸 Step 1 screenshot saved");
    
    // Click Next button
    const nextButton = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(btn => btn.textContent.includes('Next'));
    });
    
    if (nextButton) {
      await nextButton.click();
      console.log("✅ Clicked Next button");
      
      // Wait for Step 2
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Test Step 2: Business Context
      console.log("\n🔍 Testing Step 2: Business Context");
      
      // Check for radio groups
      const audienceRadios = await page.$$('[name*="audience"] input[type="radio"]');
      console.log(`✅ Found ${audienceRadios.length} target audience options`);
      
      // Check for industry dropdown
      const industrySelect = await page.$('[role="combobox"]');
      if (industrySelect) {
        console.log("✅ Found industry dropdown");
      }
      
      // Check for geography badges
      const geoBadges = await page.$$eval('.flex.flex-wrap.gap-2 > div', badges => badges.length);
      console.log(`✅ Found ${geoBadges} geography options`);
      
      // Take screenshot of Step 2
      await page.screenshot({ path: "step0-step2.png" });
      console.log("📸 Step 2 screenshot saved");
      
      // Click Generate Requirements button
      const generateButton = await page.evaluateHandle(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.find(btn => btn.textContent.includes('Generate Requirements'));
      });
      
      if (generateButton) {
        console.log("✅ Found Generate Requirements button");
        
        // Don't actually click it to avoid API call
        // await generateButton.click();
      }
      
    } else {
      console.log("❌ Next button not found");
    }
    
    // Final screenshot
    await page.screenshot({ path: "step0-final-test.png" });
    console.log("\n📸 Final screenshot saved");
    
    // Check for any errors in the dialog
    const errorElements = await page.$$eval('[class*="error"], [class*="Error"]', els => 
      els.map(el => el.textContent).filter(text => text && text.trim())
    );
    
    if (errorElements.length > 0) {
      console.log("\n❌ Errors found in dialog:", errorElements);
    } else {
      console.log("\n✅ No errors found in dialog");
    }
    
    console.log("\n✅ Enhanced Step 0 dialog test completed!");

  } catch (error) {
    console.error("\n❌ Test failed:", error.message);
    if (page) {
      await page.screenshot({ path: "test-error.png" });
      console.log("📸 Error screenshot saved");
    }
  } finally {
    // Keep browser open for 5 seconds to see the result
    await new Promise(resolve => setTimeout(resolve, 5000));
    await browser.close();
  }
})();