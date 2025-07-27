const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3001/projects');
  
  // Wait for projects to load
  await page.waitForSelector('.grid', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 2000));
  
  // List all projects
  const projects = await page.evaluate(() => {
    const projectCards = Array.from(document.querySelectorAll('.group'));
    
    return projectCards.slice(0, 10).map(card => {
      const name = card.querySelector('h3')?.textContent || 'Unknown';
      const badges = Array.from(card.querySelectorAll('.cursor-pointer')).map(b => b.textContent);
      
      return {
        name,
        badges
      };
    });
  });
  
  console.log('First 10 projects:');
  projects.forEach((project, index) => {
    console.log(`${index + 1}. ${project.name}`);
    console.log(`   Badges: ${project.badges.join(', ')}`);
  });
  
  await new Promise(r => setTimeout(r, 2000));
  await browser.close();
})();