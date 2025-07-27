const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000/projects');
  
  // Enable console logging and error tracking
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('Browser ERROR:', msg.text());
    } else {
      console.log('Browser console:', msg.text());
    }
  });
  
  page.on('pageerror', error => {
    console.log('Page error:', error.message);
  });
  
  // Wait for projects to load - look for the grid structure
  try {
    await page.waitForSelector('.grid', { timeout: 10000 });
  } catch (e) {
    console.log('❌ Grid not found, checking page content...');
    const content = await page.content();
    console.log('Page contains "loading":', content.includes('loading'));
    console.log('Page contains "grid":', content.includes('grid'));
  }
  
  // Wait a bit more for the page to fully load
  await new Promise(r => setTimeout(r, 3000));
  
  // First check if any projects are loaded
  const initialProjects = await page.evaluate(() => {
    const h3Elements = Array.from(document.querySelectorAll('h3'));
    return h3Elements.map(h3 => h3.textContent);
  });
  
  console.log(`Initial projects count: ${initialProjects.length}`);
  if (initialProjects.length > 0) {
    console.log('Sample projects:', initialProjects.slice(0, 5));
  }
  
  // Search for periodic
  const searchInput = await page.$('input[placeholder*="Search"]');
  if (!searchInput) {
    console.log('❌ Search input not found');
    await browser.close();
    return;
  }
  
  await searchInput.type('periodic');
  
  // Wait for search results
  await new Promise(r => setTimeout(r, 3000));
  
  // After search, check what projects are shown
  const projectNames = await page.evaluate(() => {
    const h3Elements = Array.from(document.querySelectorAll('h3'));
    return h3Elements.map(h3 => h3.textContent);
  });
  console.log('Available projects after search:', projectNames);
  
  // Find the periodic table project by looking for h3 containing periodic
  const projectCard = await page.evaluate(() => {
    const h3Elements = Array.from(document.querySelectorAll('h3'));
    const periodic = h3Elements.find(h3 => h3.textContent.toLowerCase().includes('periodic'));
    return periodic ? true : false;
  });
  
  if (!projectCard) {
    console.log('❌ Periodic table project not found');
    await browser.close();
    return;
  }
  
  console.log('✅ Found periodic table project');
  
  // Find buttons in the periodic table card
  const buttonInfo = await page.evaluate(() => {
    const h3Elements = Array.from(document.querySelectorAll('h3'));
    const periodic = h3Elements.find(h3 => h3.textContent.toLowerCase().includes('periodic table'));
    if (!periodic) return null;
    
    const card = periodic.closest('.group');
    const buttons = Array.from(card.querySelectorAll('button'));
    
    return buttons.map(btn => ({
      text: btn.textContent,
      disabled: btn.disabled,
      classes: btn.className
    }));
  });
  
  if (!buttonInfo) {
    console.log('❌ Could not find buttons in periodic table card');
    await browser.close();
    return;
  }
  
  console.log(`Found ${buttonInfo.length} buttons in the card`);
  
  buttonInfo.forEach((btn, i) => {
    console.log(`Button ${i}: "${btn.text}" - Disabled: ${btn.disabled}`);
    console.log(`  Classes: ${btn.classes}`);
  });
  
  // Check specifically for pipeline buttons
  const runPipelineBtn = buttonInfo.find(btn => btn.text.includes('Run Pipeline'));
  const pendingBtn = buttonInfo.find(btn => btn.text.includes('Pending Specification'));
  
  if (runPipelineBtn) {
    console.log('\n✅ Run Pipeline button found!');
    console.log(`Is disabled: ${runPipelineBtn.disabled}`);
  } else if (pendingBtn) {
    console.log('\n❌ Still showing "Pending Specification" button');
    console.log(`Is disabled: ${pendingBtn.disabled}`);
  } else {
    console.log('\n❓ No pipeline-related button found');
    console.log('All button texts:', buttonInfo.map(b => b.text));
  }
  
  await new Promise(r => setTimeout(r, 5000));
  await browser.close();
})();