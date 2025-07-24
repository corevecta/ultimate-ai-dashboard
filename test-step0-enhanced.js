const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1920, height: 1080 }
  });

  let page;
  
  try {
    page = await browser.newPage();
    
    // Enable console logging
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('❌ Console error:', msg.text());
      }
    });
    
    page.on('pageerror', err => {
      console.log('❌ Page error:', err.message);
    });
    
    console.log("📍 Navigating to projects page...");
    
    // First check if server is running
    try {
      await page.goto("http://localhost:3000/projects", {
        waitUntil: "networkidle2",
        timeout: 10000
      });
    } catch (err) {
      console.log("❌ Server not responding on port 3000, trying other ports...");
      try {
        await page.goto("http://localhost:3001/projects", {
          waitUntil: "networkidle2",
          timeout: 10000
        });
      } catch (err2) {
        await page.goto("http://localhost:3002/projects", {
          waitUntil: "networkidle2",
          timeout: 10000
        });
      }
    }
    
    console.log("✅ Page loaded");

    // Wait for page to be ready
    await page.waitForSelector("h2", { timeout: 10000 });
    
    // Look for console errors
    const errors = await page.evaluate(() => {
      const errorElements = document.querySelectorAll('.error, [class*="error"]');
      return Array.from(errorElements).map(el => el.textContent);
    });
    
    if (errors.length > 0) {
      console.log("⚠️  Found error elements on page:", errors);
    }

    // Check for New AI Project button
    const newProjectButton = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      return buttons.find(btn => btn.textContent.includes("New AI Project"));
    });
    
    if (!newProjectButton) {
      throw new Error("New AI Project button not found");
    }
    
    console.log("✅ Found New AI Project button");
    
    // Click it
    await newProjectButton.click();
    console.log("✅ Clicked New AI Project button");

    // Wait for dialog
    try {
      await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
      console.log("✅ Step 0 dialog opened");
      
      // Check dialog content
      const dialogContent = await page.evaluate(() => {
        const dialog = document.querySelector('[role="dialog"]');
        if (!dialog) return null;
        
        return {
          title: dialog.querySelector('h2')?.textContent,
          hasNameInput: !!dialog.querySelector('input[placeholder*="name"]'),
          hasTypeSelector: !!dialog.querySelector('[role="combobox"], .grid button'),
          hasDescriptionTextarea: !!dialog.querySelector('textarea'),
          hasNextButton: !!Array.from(dialog.querySelectorAll('button')).find(btn => 
            btn.textContent.includes('Next') || btn.textContent.includes('Generate')
          )
        };
      });
      
      console.log("📋 Dialog content:", dialogContent);
      
      // Check for any React errors
      const reactErrors = await page.evaluate(() => {
        const errorBoundary = document.querySelector('[data-react-error]');
        const errorOverlay = document.querySelector('.nextjs-error-overlay');
        return {
          hasErrorBoundary: !!errorBoundary,
          hasErrorOverlay: !!errorOverlay,
          errorText: errorBoundary?.textContent || errorOverlay?.textContent
        };
      });
      
      if (reactErrors.hasErrorBoundary || reactErrors.hasErrorOverlay) {
        console.log("❌ React error detected:", reactErrors.errorText);
      }
      
    } catch (err) {
      console.log("❌ Failed to open dialog:", err.message);
      
      // Take screenshot for debugging
      await page.screenshot({ path: "step0-dialog-error.png" });
      console.log("📸 Error screenshot saved");
    }

    // Take final screenshot
    await page.screenshot({ path: "step0-enhanced-test.png" });
    console.log("📸 Screenshot saved as step0-enhanced-test.png");

  } catch (error) {
    console.error("❌ Test failed:", error.message);
    if (page) {
      await page.screenshot({ path: "test-error.png" });
      console.log("📸 Error screenshot saved");
    }
  } finally {
    await browser.close();
  }
})();