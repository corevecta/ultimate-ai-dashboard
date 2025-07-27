const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  // Navigate and force reload
  await page.goto('http://localhost:3001/projects', { waitUntil: 'networkidle0' });
  await page.reload({ waitUntil: 'networkidle0' });
  
  // Wait for projects to load
  await page.waitForSelector('.grid', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 3000));
  
  // Search for periodic
  const searchInput = await page.$('input[placeholder*="Search"]');
  await searchInput.click({ clickCount: 3 }); // Select all
  await searchInput.type('periodic');
  
  // Wait for search results to update
  await new Promise(r => setTimeout(r, 3000));
  
  // Get project info
  const projectInfo = await page.evaluate(() => {
    const firstCard = document.querySelector('.group');
    if (firstCard) {
      const name = firstCard.querySelector('h3')?.textContent;
      const badges = Array.from(firstCard.querySelectorAll('.cursor-pointer'))
        .map(b => b.textContent);
      return { name, badges };
    }
    return null;
  });
  
  console.log('Project found:', projectInfo);
  
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
  
  // Wait for modal to fully load
  await new Promise(r => setTimeout(r, 4000));
  
  // Get detailed modal content
  const modalDetails = await page.evaluate(() => {
    const modals = Array.from(document.querySelectorAll('.fixed.inset-0'));
    
    // Find the file viewer modal
    const fileModal = modals.find(modal => {
      const hasTitle = modal.querySelector('h3');
      const hasButtons = modal.querySelector('button');
      return hasTitle || (hasButtons && modal.textContent.includes('Requirements'));
    });
    
    if (fileModal) {
      const title = fileModal.querySelector('h3')?.textContent || '';
      const buttons = Array.from(fileModal.querySelectorAll('button')).map(btn => ({
        text: btn.textContent.trim(),
        hasIcon: btn.querySelector('svg') !== null
      }));
      
      // Check for specific UI elements
      const hasMissingIcon = !!fileModal.querySelector('[class*="FileX"]');
      const hasRegenerateSection = fileModal.textContent.includes('reverse-engineering');
      const hasQualityMessage = fileModal.textContent.includes('same quality');
      
      return {
        title,
        buttons,
        hasMissingIcon,
        hasRegenerateSection,
        hasQualityMessage,
        contentPreview: fileModal.textContent.substring(0, 200)
      };
    }
    
    return { error: 'Modal not found' };
  });
  
  console.log('\nModal details:', JSON.stringify(modalDetails, null, 2));
  
  if (modalDetails.hasRegenerateSection) {
    console.log('\n✅ SUCCESS! Requirements regeneration feature is working!');
    console.log('The UI shows the option to regenerate requirements from specification.');
    
    // Try clicking the regenerate button
    const regenerateClicked = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const regenerateBtn = buttons.find(btn => 
        btn.textContent.includes('Regenerate Requirements')
      );
      
      if (regenerateBtn) {
        regenerateBtn.click();
        return true;
      }
      return false;
    });
    
    if (regenerateClicked) {
      console.log('Regenerate button clicked!');
      await new Promise(r => setTimeout(r, 3000));
      
      // Check if button shows loading state
      const isRegenerating = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const regenerateBtn = buttons.find(btn => 
          btn.textContent.includes('Regenerating')
        );
        return !!regenerateBtn;
      });
      
      console.log('Is regenerating:', isRegenerating);
    }
  }
  
  await new Promise(r => setTimeout(r, 5000));
  await browser.close();
})();