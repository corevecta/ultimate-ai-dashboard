const puppeteer = require('puppeteer');

async function verifyLayout() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  const pagesToTest = [
    '/agents',
    '/workflow-designer',
    '/learning-lab',
    '/monitoring',
    '/deployments',
    '/api-explorer',
    '/discovery',
    '/plugins'
  ];
  
  console.log('Verifying layout on new pages...\n');
  
  for (const url of pagesToTest) {
    try {
      await page.goto(`http://localhost:3000${url}`, {
        waitUntil: 'networkidle2',
        timeout: 10000
      });
      
      // Check for AI Orchestrator title (indicates layout is present)
      const hasLayout = await page.evaluate(() => {
        return document.body.textContent.includes('AI Orchestrator');
      });
      
      // Count navigation links
      const navCount = await page.evaluate(() => {
        const links = document.querySelectorAll('a[href^="/"]');
        const navLinks = Array.from(links).filter(link => {
          const parent = link.closest('nav, aside');
          return parent !== null;
        });
        return navLinks.length;
      });
      
      // Check for main content
      const hasContent = await page.evaluate(() => {
        const main = document.querySelector('main');
        return main && main.textContent.length > 100;
      });
      
      console.log(`✅ ${url}`);
      console.log(`   - Has layout: ${hasLayout ? 'Yes' : 'No'}`);
      console.log(`   - Navigation items: ${navCount}`);
      console.log(`   - Has content: ${hasContent ? 'Yes' : 'No'}`);
      console.log('');
      
    } catch (error) {
      console.log(`❌ ${url} - Error: ${error.message}\n`);
    }
  }
  
  await browser.close();
}

verifyLayout().catch(console.error);