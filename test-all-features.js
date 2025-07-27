const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000/projects');
  
  // Enable console logging
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('❌ Browser ERROR:', msg.text());
    }
  });
  
  // Monitor network requests
  page.on('response', response => {
    const url = response.url();
    if (url.includes('/api/projects/') && url.includes('/files')) {
      console.log(`📡 File API: ${response.status()} - ${url.split('?')[1]?.substring(0, 50)}...`);
    }
  });
  
  // Wait for projects to load
  await page.waitForSelector('.grid', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 2000));
  
  // Search for periodic table
  const searchInput = await page.$('input[placeholder*="Search"]');
  await searchInput.type('periodic');
  await new Promise(r => setTimeout(r, 2000));
  
  console.log('\n🔍 Testing Periodic Table Project:');
  
  // Test 1: Check if badges exist
  const badges = await page.evaluate(() => {
    const h3Elements = Array.from(document.querySelectorAll('h3'));
    const periodic = h3Elements.find(h3 => h3.textContent.toLowerCase().includes('periodic table'));
    if (!periodic) return { error: 'Project not found' };
    
    const card = periodic.closest('.group');
    const badgeElements = Array.from(card.querySelectorAll('div')).filter(el => {
      const classes = el.className;
      return classes.includes('bg-') && classes.includes('/20') && classes.includes('border-') && classes.includes('/30');
    });
    
    return badgeElements.map(badge => badge.textContent);
  });
  
  console.log('✅ Badges found:', badges);
  
  // Test 2: Click Requirements badge
  console.log('\n📄 Testing Requirements Badge:');
  const reqClicked = await page.evaluate(() => {
    const h3Elements = Array.from(document.querySelectorAll('h3'));
    const periodic = h3Elements.find(h3 => h3.textContent.toLowerCase().includes('periodic table'));
    if (!periodic) return false;
    
    const card = periodic.closest('.group');
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
  
  if (reqClicked) {
    await new Promise(r => setTimeout(r, 2000));
    
    // Check modal content
    const hasContent = await page.evaluate(() => {
      const modal = Array.from(document.querySelectorAll('[class*="fixed inset-0"]'))
        .find(m => m.querySelector('h3'));
      
      if (!modal) return false;
      
      // Close modal
      const closeBtn = modal.querySelector('button[class*="hover:bg-white/10"]');
      if (closeBtn) closeBtn.click();
      
      return modal.textContent.includes('Periodic Table');
    });
    
    console.log(hasContent ? '✅ Real content displayed' : '❌ Mock content shown');
  }
  
  await new Promise(r => setTimeout(r, 1000));
  
  // Test 3: Test dropdown menu
  console.log('\n📋 Testing Dropdown Menu:');
  const dropdownOpened = await page.evaluate(() => {
    const h3Elements = Array.from(document.querySelectorAll('h3'));
    const periodic = h3Elements.find(h3 => h3.textContent.toLowerCase().includes('periodic table'));
    if (!periodic) return false;
    
    const card = periodic.closest('.group');
    const dropdownBtn = card.querySelector('button svg[class*="h-4 w-4"]')?.parentElement;
    
    if (dropdownBtn) {
      dropdownBtn.click();
      return true;
    }
    return false;
  });
  
  if (dropdownOpened) {
    await new Promise(r => setTimeout(r, 1000));
    
    // Check dropdown items
    const items = await page.evaluate(() => {
      const dropdown = document.querySelector('[role="menu"]');
      if (!dropdown) return [];
      
      return Array.from(dropdown.querySelectorAll('[role="menuitem"]'))
        .map(item => item.textContent);
    });
    
    console.log('✅ Dropdown items:', items);
    
    // Test Export
    const exportClicked = await page.evaluate(() => {
      const exportItem = Array.from(document.querySelectorAll('[role="menuitem"]'))
        .find(item => item.textContent.includes('Export'));
      
      if (exportItem) {
        exportItem.click();
        return true;
      }
      return false;
    });
    
    if (exportClicked) {
      console.log('✅ Export clicked');
    }
  }
  
  // Clear search to see all projects
  await searchInput.click({ clickCount: 3 });
  await searchInput.press('Backspace');
  await new Promise(r => setTimeout(r, 2000));
  
  // Test 4: Check different project types
  console.log('\n🔍 Testing Other Projects:');
  const projectsWithBadges = await page.evaluate(() => {
    const projects = Array.from(document.querySelectorAll('h3')).slice(0, 5);
    
    return projects.map(h3 => {
      const card = h3.closest('.group');
      const badges = Array.from(card.querySelectorAll('div')).filter(el => {
        const classes = el.className;
        return classes.includes('bg-') && classes.includes('/20') && classes.includes('border-') && classes.includes('/30');
      });
      
      return {
        name: h3.textContent,
        badges: badges.map(b => b.textContent)
      };
    });
  });
  
  projectsWithBadges.forEach(p => {
    console.log(`📦 ${p.name}: ${p.badges.join(', ')}`);
  });
  
  await new Promise(r => setTimeout(r, 3000));
  await browser.close();
})();