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
  await new Promise(r => setTimeout(r, 2000));
  
  // Find periodic table project
  const projectInfo = await page.evaluate(() => {
    const firstCard = document.querySelector('.group');
    if (firstCard) {
      const name = firstCard.querySelector('h3')?.textContent;
      const hasSpecBadge = Array.from(firstCard.querySelectorAll('.cursor-pointer'))
        .some(badge => badge.textContent.includes('Specification Ready'));
      return { name, hasSpecBadge };
    }
    return null;
  });
  
  console.log('Project info:', projectInfo);
  
  // Click Requirements badge
  await page.evaluate(() => {
    const firstCard = document.querySelector('.group');
    if (firstCard) {
      const badges = Array.from(firstCard.querySelectorAll('[class*="cursor-pointer"]'));
      const requirementsBadge = badges.find(badge => 
        badge.textContent.includes('Requirements')
      );
      
      if (requirementsBadge) {
        requirementsBadge.click();
      }
    }
  });
  
  await new Promise(r => setTimeout(r, 3000));
  
  // Get modal content
  const modalContent = await page.evaluate(() => {
    // Find the file viewer modal (last one usually)
    const modals = document.querySelectorAll('.fixed.inset-0');
    const fileModal = Array.from(modals).find(modal => 
      modal.querySelector('h3') || modal.textContent.includes('Requirements')
    );
    
    if (fileModal) {
      return {
        title: fileModal.querySelector('h3')?.textContent || 'No title',
        hasRegenerateButton: !!fileModal.querySelector('button')?.textContent?.includes('Regenerate'),
        hasMissingMessage: fileModal.textContent.includes('Missing'),
        buttons: Array.from(fileModal.querySelectorAll('button')).map(b => b.textContent),
        fullText: fileModal.textContent.substring(0, 500)
      };
    }
    return null;
  });
  
  console.log('\nModal content:', JSON.stringify(modalContent, null, 2));
  
  if (modalContent?.hasRegenerateButton) {
    console.log('\n✅ Requirements regeneration feature is working!');
    console.log('The "Regenerate Requirements from Specification" button is available.');
  }
  
  await new Promise(r => setTimeout(r, 5000));
  await browser.close();
})();