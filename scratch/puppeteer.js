const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.text().includes('DEBUG LOG') || msg.text().includes('canvas.')) {
      console.log(msg.text());
    }
  });

  await page.setViewport({ width: 1536, height: 730 });
  await page.goto('http://localhost:3000');
  await new Promise(r => setTimeout(r, 4000));
  
  await page.setViewport({ width: 1920, height: 1080 });
  await new Promise(r => setTimeout(r, 4000));
  
  await browser.close();
})();
