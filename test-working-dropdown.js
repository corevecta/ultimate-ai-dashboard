const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000/projects');
  
  // Wait for projects to load
  await page.waitForSelector('.grid', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 2000));
  
  // Test the Select dropdown (which we know works)
  console.log('\n📋 Testing Select dropdown (Type filter):');
  const selectClicked = await page.evaluate(() => {
    const selects = Array.from(document.querySelectorAll('[role="combobox"]'));
    if (selects[0]) {
      selects[0].click();
      return true;
    }
    return false;
  });
  
  if (selectClicked) {
    await new Promise(r => setTimeout(r, 1000));
    
    const selectState = await page.evaluate(() => {
      return {
        hasPortal: document.querySelector('[data-radix-portal]') !== null,
        selectOptions: Array.from(document.querySelectorAll('[role="option"]')).map(opt => opt.textContent)
      };
    });
    
    console.log('Select dropdown state:', selectState);
  }
  
  // Close select by clicking outside
  await page.click('body');
  await new Promise(r => setTimeout(r, 500));
  
  // Now test our DropdownMenu
  console.log('\n📋 Testing DropdownMenu:');
  
  // First, make the dropdown button visible
  await page.evaluate(() => {
    const firstCard = document.querySelector('.group');
    if (firstCard) {
      const btn = firstCard.querySelector('button[class*="opacity-0"]');
      if (btn) {
        btn.style.opacity = '1';
        btn.style.visibility = 'visible';
      }
    }
  });
  
  // Click the dropdown
  const dropdownClicked = await page.evaluate(() => {
    const firstCard = document.querySelector('.group');
    if (firstCard) {
      const btn = firstCard.querySelector('button svg')?.parentElement;
      if (btn && btn.tagName === 'BUTTON') {
        btn.click();
        return true;
      }
    }
    return false;
  });
  
  console.log('Dropdown clicked:', dropdownClicked);
  
  await new Promise(r => setTimeout(r, 1000));
  
  // Check dropdown state
  const dropdownState = await page.evaluate(() => {
    return {
      hasPortal: document.querySelector('[data-radix-portal]') !== null,
      menuItems: Array.from(document.querySelectorAll('[role="menuitem"]')).map(item => item.textContent),
      popperContent: document.querySelector('[data-radix-popper-content-wrapper]') !== null
    };
  });
  
  console.log('Dropdown state:', dropdownState);
  
  await new Promise(r => setTimeout(r, 3000));
  await browser.close();
})();