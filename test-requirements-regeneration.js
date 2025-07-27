const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3001/projects');
  
  // Wait for projects to load
  await page.waitForSelector('.grid', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 2000));
  
  console.log('Looking for periodic table project...');
  
  // Find and click on the Requirements badge for periodic table
  const clicked = await page.evaluate(() => {
    const projectCards = Array.from(document.querySelectorAll('.group'));
    
    for (const card of projectCards) {
      const nameElement = card.querySelector('h3');
      if (nameElement && nameElement.textContent.toLowerCase().includes('periodic')) {
        console.log('Found periodic table project');
        
        // Find the Requirements badge
        const badges = Array.from(card.querySelectorAll('.cursor-pointer'));
        const requirementsBadge = badges.find(badge => 
          badge.textContent.includes('Requirements')
        );
        
        if (requirementsBadge) {
          console.log('Clicking Requirements badge');
          requirementsBadge.click();
          return true;
        }
      }
    }
    return false;
  });
  
  if (clicked) {
    console.log('Requirements badge clicked');
    
    // Wait for the modal to appear
    await new Promise(r => setTimeout(r, 2000));
    
    // Check if regeneration UI is shown
    const hasRegenerateUI = await page.evaluate(() => {
      const modal = document.querySelector('.fixed.inset-0');
      if (modal) {
        const text = modal.textContent;
        return {
          hasMissingMessage: text.includes('Requirements File Missing'),
          hasRegenerateButton: text.includes('Regenerate Requirements from Specification'),
          modalContent: text.substring(0, 200)
        };
      }
      return { hasMissingMessage: false, hasRegenerateButton: false };
    });
    
    console.log('Regeneration UI state:', hasRegenerateUI);
    
    if (hasRegenerateUI.hasRegenerateButton) {
      console.log('✅ Requirements regeneration feature is working!');
      console.log('The modal shows the option to regenerate requirements from specification.');
    } else {
      console.log('❌ Requirements file exists or regeneration UI not shown');
      console.log('Modal content:', hasRegenerateUI.modalContent);
    }
  } else {
    console.log('Could not find periodic table project or Requirements badge');
  }
  
  await new Promise(r => setTimeout(r, 3000));
  await browser.close();
})();