const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3001/projects');
  
  // Wait for projects to load
  await page.waitForSelector('.grid', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 2000));
  
  // Search for periodic
  await page.type('input[placeholder*="Search"]', 'periodic');
  
  // Wait for search results
  await new Promise(r => setTimeout(r, 2000));
  
  // Check results
  const results = await page.evaluate(() => {
    const projectCards = Array.from(document.querySelectorAll('.group'));
    
    return projectCards.map(card => {
      const name = card.querySelector('h3')?.textContent || 'Unknown';
      const badges = Array.from(card.querySelectorAll('.cursor-pointer')).map(b => b.textContent);
      
      return {
        name,
        badges
      };
    });
  });
  
  console.log(`Found ${results.length} projects matching "periodic":`);
  results.forEach((project, index) => {
    console.log(`${index + 1}. ${project.name}`);
    console.log(`   Badges: ${project.badges.join(', ')}`);
  });
  
  // Try clicking the Requirements badge on the first result
  if (results.length > 0) {
    const clicked = await page.evaluate(() => {
      const firstCard = document.querySelector('.group');
      if (firstCard) {
        const badges = Array.from(firstCard.querySelectorAll('.cursor-pointer'));
        const requirementsBadge = badges.find(badge => 
          badge.textContent.includes('Requirements')
        );
        
        if (requirementsBadge) {
          requirementsBadge.click();
          return true;
        }
      }
      return false;
    });
    
    if (clicked) {
      console.log('\nClicked Requirements badge');
      await new Promise(r => setTimeout(r, 2000));
      
      // Check modal content
      const modalInfo = await page.evaluate(() => {
        const modal = document.querySelector('.fixed.inset-0');
        if (modal) {
          return {
            title: modal.querySelector('h3')?.textContent || '',
            hasRegenerateButton: modal.textContent.includes('Regenerate Requirements'),
            content: modal.textContent.substring(0, 300)
          };
        }
        return null;
      });
      
      console.log('\nModal info:', modalInfo);
    }
  }
  
  await new Promise(r => setTimeout(r, 5000));
  await browser.close();
})();