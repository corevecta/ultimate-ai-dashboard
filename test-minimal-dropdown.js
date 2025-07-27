const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000/projects');
  
  // Enable console logging
  page.on('console', msg => {
    console.log('Browser console:', msg.text());
  });
  
  page.on('pageerror', error => {
    console.log('Page error:', error.message);
  });
  
  // Wait for projects to load
  await page.waitForSelector('.grid', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 2000));
  
  // Check if Radix UI is loaded
  const radixCheck = await page.evaluate(() => {
    return {
      hasRadixPortal: document.querySelector('[data-radix-portal]') !== null,
      hasRadixPresence: window.RadixPresence !== undefined,
      bodyChildren: document.body.children.length
    };
  });
  
  console.log('Radix UI check:', radixCheck);
  
  // Try to find and click dropdown
  const dropdownClicked = await page.evaluate(() => {
    // Find the first dropdown trigger
    const triggers = Array.from(document.querySelectorAll('button'));
    const dropdownTrigger = triggers.find(btn => {
      const svg = btn.querySelector('svg');
      return svg && btn.closest('.group') && svg.parentElement === btn;
    });
    
    if (dropdownTrigger) {
      // Make button visible first
      dropdownTrigger.style.opacity = '1';
      dropdownTrigger.click();
      return true;
    }
    return false;
  });
  
  console.log('Dropdown clicked:', dropdownClicked);
  
  // Wait for portal to render
  await new Promise(r => setTimeout(r, 2000));
  
  // Check all possible locations for dropdown content
  const dropdownState = await page.evaluate(() => {
    const results = {
      portals: [],
      dropdowns: [],
      lastBodyChild: null,
      allMenuItems: []
    };
    
    // Check for portals
    document.querySelectorAll('[data-radix-portal]').forEach(portal => {
      results.portals.push({
        html: portal.innerHTML.substring(0, 200),
        childCount: portal.children.length
      });
    });
    
    // Check for dropdown content
    document.querySelectorAll('[data-radix-popper-content-wrapper]').forEach(wrapper => {
      results.dropdowns.push({
        html: wrapper.innerHTML.substring(0, 200),
        style: window.getComputedStyle(wrapper).display
      });
    });
    
    // Check last body child (common portal location)
    const lastChild = document.body.lastElementChild;
    if (lastChild) {
      results.lastBodyChild = {
        tagName: lastChild.tagName,
        className: lastChild.className,
        hasDropdown: lastChild.innerHTML.includes('View Details')
      };
    }
    
    // Find all elements with menuitem role anywhere in document
    document.querySelectorAll('[role="menuitem"]').forEach(item => {
      results.allMenuItems.push(item.textContent);
    });
    
    return results;
  });
  
  console.log('Dropdown state:', JSON.stringify(dropdownState, null, 2));
  
  await new Promise(r => setTimeout(r, 3000));
  await browser.close();
})();