const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000/projects');
  
  // Enable console logging
  page.on('console', msg => console.log('Browser:', msg.text()));
  
  // Monitor network requests to see API calls
  page.on('request', request => {
    if (request.url().includes('/api/projects/') && request.url().includes('/files')) {
      console.log('📡 File API Request:', request.url());
    }
  });
  
  page.on('response', response => {
    if (response.url().includes('/api/projects/') && response.url().includes('/files')) {
      console.log(`📡 File API Response: ${response.status()} - ${response.url()}`);
    }
  });
  
  // Wait for projects to load
  await page.waitForSelector('.grid', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 2000));
  
  // Search for periodic table
  const searchInput = await page.$('input[placeholder*="Search"]');
  await searchInput.type('periodic');
  await new Promise(r => setTimeout(r, 2000));
  
  // Find badges in the periodic table card
  const badges = await page.evaluate(() => {
    const h3Elements = Array.from(document.querySelectorAll('h3'));
    const periodic = h3Elements.find(h3 => h3.textContent.toLowerCase().includes('periodic table'));
    if (!periodic) return null;
    
    const card = periodic.closest('.group');
    // Look for badges by their visual characteristics
    const badgeElements = Array.from(card.querySelectorAll('div')).filter(el => {
      const classes = el.className;
      return classes.includes('bg-') && classes.includes('/20') && classes.includes('border-') && classes.includes('/30');
    });
    
    return badgeElements.map(badge => ({
      text: badge.textContent,
      classes: badge.className,
      clickable: window.getComputedStyle(badge).cursor === 'pointer'
    }));
  });
  
  console.log('\n🏷️  Found badges:', badges);
  
  // Try clicking the Requirements badge
  const clicked = await page.evaluate(() => {
    const h3Elements = Array.from(document.querySelectorAll('h3'));
    const periodic = h3Elements.find(h3 => h3.textContent.toLowerCase().includes('periodic table'));
    if (!periodic) return false;
    
    const card = periodic.closest('.group');
    // Look for badges by their visual characteristics
    const badges = Array.from(card.querySelectorAll('div')).filter(el => {
      const classes = el.className;
      return classes.includes('bg-') && classes.includes('/20') && classes.includes('border-') && classes.includes('/30');
    });
    const requirementsBadge = badges.find(b => b.textContent.includes('Requirements'));
    
    if (requirementsBadge) {
      requirementsBadge.click();
      return true;
    }
    return false;
  });
  
  if (clicked) {
    console.log('\n✅ Clicked Requirements badge');
    
    // Wait for modal to appear and content to load
    await new Promise(r => setTimeout(r, 3000));
    
    // Check if modal appeared
    const modalContent = await page.evaluate(() => {
      // Look for the file viewer modal specifically (should have a close button and content area)
      const modals = Array.from(document.querySelectorAll('[class*="fixed inset-0"]'));
      const modal = modals.find(m => m.querySelector('h3') || m.textContent?.includes('Requirements'));
      if (!modal) return { error: 'No modal found' };
      
      // Debug: log modal HTML structure
      console.log('Modal HTML:', modal.innerHTML.substring(0, 500));
      
      const title = modal.querySelector('h3')?.textContent;
      // Look for content in various possible containers
      const preContent = modal.querySelector('pre')?.textContent;
      const proseContent = modal.querySelector('.prose')?.textContent;
      const anyDivContent = modal.querySelector('div[class*="overflow-y-auto"]')?.textContent;
      const content = preContent || proseContent || anyDivContent;
      
      // Also check for "Loading" text
      const loadingText = modal.textContent?.includes('Loading') ? 'Still loading...' : null;
      
      return {
        title,
        contentPreview: content?.substring(0, 200) + '...',
        loading: loadingText,
        modalFound: true
      };
    });
    
    if (modalContent) {
      console.log('\n📋 Modal appeared:');
      console.log('Title:', modalContent.title);
      console.log('Content preview:', modalContent.contentPreview);
    } else {
      console.log('\n❌ No modal found');
    }
  } else {
    console.log('\n❌ Could not find/click Requirements badge');
  }
  
  await new Promise(r => setTimeout(r, 5000));
  await browser.close();
})();