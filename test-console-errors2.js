const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  // Enable console logging
  page.on('console', msg => {
    console.log('Browser console:', msg.text());
  });
  
  page.on('pageerror', error => {
    console.log('Page error:', error.message);
  });
  
  await page.goto('http://localhost:3001/projects');
  
  // Wait for projects to load
  await page.waitForSelector('.grid', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 2000));
  
  // Search for periodic
  await page.type('input[placeholder*="Search"]', 'periodic');
  await new Promise(r => setTimeout(r, 2000));
  
  // Click Requirements badge
  const clicked = await page.evaluate(() => {
    const firstCard = document.querySelector('.group');
    if (firstCard) {
      const badges = Array.from(firstCard.querySelectorAll('[class*="cursor-pointer"]'));
      console.log('Found badges:', badges.length);
      
      const requirementsBadge = badges.find(badge => 
        badge.textContent.includes('Requirements')
      );
      
      if (requirementsBadge) {
        console.log('Clicking requirements badge');
        requirementsBadge.click();
        return true;
      }
    }
    return false;
  });
  
  await new Promise(r => setTimeout(r, 3000));
  
  // Check if modal appeared
  const hasModal = await page.evaluate(() => {
    const modals = document.querySelectorAll('.fixed.inset-0');
    console.log('Number of modals found:', modals.length);
    return modals.length > 0;
  });
  
  console.log('Modal appeared:', hasModal);
  
  await new Promise(r => setTimeout(r, 5000));
  await browser.close();
})();