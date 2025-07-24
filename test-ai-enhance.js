const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1920, height: 1080 }
  });

  let page;
  
  try {
    page = await browser.newPage();
    
    console.log("📍 Navigating to projects page...");
    await page.goto("http://localhost:3001/projects", {
      waitUntil: "networkidle2",
      timeout: 30000
    });

    // Wait for New AI Project button
    console.log("⏳ Waiting for New AI Project button...");
    await page.waitForSelector("button", { timeout: 10000 });
    
    // Click the New AI Project button
    const newProjectButton = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      return buttons.find(btn => btn.textContent.includes("New AI Project"));
    });
    
    if (!newProjectButton) {
      throw new Error("New AI Project button not found");
    }
    
    await newProjectButton.click();
    console.log("✅ Clicked New AI Project button");

    // Wait for dialog to appear
    await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
    console.log("✅ Step 0 dialog opened");

    // Fill in project details
    await page.type('input[placeholder="Enter project name"]', 'Enhanced Periodic Table');
    
    // Select project type - click the select trigger
    const typeSelect = await page.$('[role="combobox"]');
    await typeSelect.click();
    await page.waitForTimeout(500);
    
    // Select web-app type
    await page.keyboard.type('web');
    await page.waitForTimeout(500);
    await page.keyboard.press('Enter');
    
    console.log("✅ Filled basic project details");

    // Click Next to go to step 2 (description)
    const nextButton = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      return buttons.find(btn => btn.textContent === "Next");
    });
    await nextButton.click();
    await page.waitForTimeout(500);

    // Enter description
    const description = "I want to create enhanced periodic table interactive full featured, modern looking with stunning ui with full elements and other details proper coloring on a single html page without requiring server that can work in offline mode";
    await page.type('textarea[placeholder*="Describe your project"]', description);
    console.log("✅ Entered project description");

    // Click AI Enhance button
    const enhanceButton = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      return buttons.find(btn => btn.textContent.includes("AI Enhance"));
    });
    
    if (!enhanceButton) {
      throw new Error("AI Enhance button not found");
    }
    
    await enhanceButton.click();
    console.log("✅ Clicked AI Enhance button");

    // Wait for enhancement to complete (look for the loading state to disappear)
    await page.waitForFunction(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const enhanceBtn = buttons.find(btn => btn.textContent.includes("AI Enhance"));
      return enhanceBtn && !enhanceBtn.textContent.includes("Enhancing");
    }, { timeout: 30000 });

    // Get the enhanced description
    const enhancedDescription = await page.$eval('textarea[placeholder*="Describe your project"]', el => el.value);
    
    console.log("\n📝 Original description:");
    console.log(description);
    console.log("\n✨ Enhanced description:");
    console.log(enhancedDescription);
    
    // Verify enhancement happened
    if (enhancedDescription.length > description.length * 1.5) {
      console.log("\n✅ AI Enhancement successful! Description was significantly expanded.");
      
      // Check for context-aware enhancements
      const hasChemistryContext = enhancedDescription.toLowerCase().includes('118 elements') || 
                                  enhancedDescription.toLowerCase().includes('chemistry') ||
                                  enhancedDescription.toLowerCase().includes('atomic');
      const hasOfflineContext = enhancedDescription.toLowerCase().includes('offline') || 
                               enhancedDescription.toLowerCase().includes('self-contained');
      
      console.log(`✅ Chemistry context detected: ${hasChemistryContext}`);
      console.log(`✅ Offline context preserved: ${hasOfflineContext}`);
      
      if (!hasChemistryContext || !hasOfflineContext) {
        console.log("⚠️  Warning: Enhanced description may be missing context-specific details");
      }
    } else {
      console.log("❌ Enhancement failed - description not significantly changed");
    }

    // Take a screenshot
    await page.screenshot({ path: "ai-enhance-test.png" });
    console.log("📸 Screenshot saved as ai-enhance-test.png");

    console.log("\n✅ AI Enhancement test completed successfully!");

  } catch (error) {
    console.error("❌ Test failed:", error.message);
    if (page) {
      await page.screenshot({ path: "ai-enhance-error.png" });
      console.log("📸 Error screenshot saved");
    }
  } finally {
    await browser.close();
  }
})();