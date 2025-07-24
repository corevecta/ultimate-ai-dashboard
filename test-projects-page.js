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
    await page.goto("http://localhost:3000/projects", {
      waitUntil: "networkidle2",
      timeout: 30000
    });

    // Wait for any h2 heading
    await page.waitForSelector("h2", { timeout: 10000 });
    
    // Get all h2 headings to find the right one
    const headings = await page.$$eval("h2", elements => 
      elements.map(el => el.textContent)
    );
    console.log("📋 Found headings:", headings);

    // Look for stats cards
    const statsCards = await page.$$(".bg-gradient-to-br");
    console.log(`✅ Found ${statsCards.length} gradient cards`);

    // Check for New AI Project button by text content
    const newProjectButton = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      return buttons.find(btn => btn.textContent.includes("New AI Project")) ? true : false;
    });
    console.log(`✅ New AI Project button: ${newProjectButton ? "Found" : "Not found"}`);

    // Look for project cards - wait for them to appear
    console.log("⏳ Waiting for projects to load...");
    
    try {
      // Wait for at least one project card or loading skeleton
      await page.waitForSelector(".group, .animate-pulse", { timeout: 10000 });
      await new Promise(resolve => setTimeout(resolve, 2000)); // Additional wait for all cards
      
      const projectCards = await page.$$(".group");
      const loadingCards = await page.$$(".animate-pulse");
      
      console.log(`✅ Found ${projectCards.length} project cards`);
      console.log(`📊 Found ${loadingCards.length} loading skeletons`);
      
      // Get some project details if cards exist
      if (projectCards.length > 0) {
        const firstFewProjects = await page.evaluate(() => {
          const cards = document.querySelectorAll(".group");
          return Array.from(cards).slice(0, 3).map(card => {
            const title = card.querySelector("h3")?.textContent || "No title";
            const type = card.querySelector(".text-gray-400")?.textContent || "No type";
            return { title, type };
          });
        });
        console.log("📋 Sample projects:", firstFewProjects);
      }
    } catch (error) {
      console.log("⚠️  No project cards found within timeout");
    }

    // Take a screenshot for verification
    await page.screenshot({ path: "projects-page.png" });
    console.log("📸 Screenshot saved as projects-page.png");

    console.log("\\n✅ Test completed!");

  } catch (error) {
    console.error("❌ Test failed:", error.message);
    if (page) {
      await page.screenshot({ path: "error-screenshot.png" });
      console.log("📸 Error screenshot saved");
    }
  } finally {
    await browser.close();
  }
})();
