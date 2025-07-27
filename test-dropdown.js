const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000/projects');
  
  // Wait for projects to load
  await page.waitForSelector('.grid', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 2000));
  
  // Find first project card and hover to show dropdown button
  await page.evaluate(() => {
    const firstCard = document.querySelector('.group');
    if (firstCard) {
      // Trigger hover
      const event = new MouseEvent('mouseenter', {
        view: window,
        bubbles: true,
        cancelable: true
      });
      firstCard.dispatchEvent(event);
    }
  });
  
  await new Promise(r => setTimeout(r, 1000));
  
  // Click the dropdown button
  const dropdownClicked = await page.evaluate(() => {
    // Find visible dropdown buttons
    const buttons = Array.from(document.querySelectorAll('button'));
    const dropdownBtn = buttons.find(btn => {
      const svg = btn.querySelector('svg');
      return svg && window.getComputedStyle(btn).opacity !== '0';
    });
    
    if (dropdownBtn) {
      console.log('Found dropdown button, clicking...');
      dropdownBtn.click();
      return true;
    }
    return false;
  });
  
  console.log('Dropdown clicked:', dropdownClicked);
  
  await new Promise(r => setTimeout(r, 1000));
  
  // Check what's in the DOM after clicking
  const dropdownInfo = await page.evaluate(() => {
    // Look for any dropdown content
    const portals = document.querySelectorAll('[data-radix-portal]');
    const roleMenus = document.querySelectorAll('[role="menu"]');
    const dropdownContents = document.querySelectorAll('[class*="DropdownMenuContent"]');
    
    return {
      portals: portals.length,
      roleMenus: roleMenus.length,
      dropdownContents: dropdownContents.length,
      // Get all elements with role menuitem
      menuItems: Array.from(document.querySelectorAll('[role="menuitem"]')).map(item => ({
        text: item.textContent,
        visible: window.getComputedStyle(item).display !== 'none'
      }))
    };
  });
  
  console.log('Dropdown state:', dropdownInfo);
  
  // Also check the document body for any dropdown portal content
  const bodyContent = await page.evaluate(() => {
    const lastChild = document.body.lastElementChild;
    if (lastChild && lastChild.hasAttribute('data-radix-portal')) {
      return {
        found: true,
        html: lastChild.innerHTML.substring(0, 500)
      };
    }
    return { found: false };
  });
  
  console.log('Portal content:', bodyContent);
  
  await new Promise(r => setTimeout(r, 3000));
  await browser.close();
})();