const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();
  await page.addInitScript(() => {
    sessionStorage.setItem('lg-preloaded', 'true');
  });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  // Capture slide 1
  await page.screenshot({
    path: path.join(__dirname, '../responsive-audit/hero-slide1-desktop.png')
  });

  // Switch to mobile viewport
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(500);
  await page.screenshot({
    path: path.join(__dirname, '../responsive-audit/hero-slide1-mobile.png')
  });

  await browser.close();
  console.log('Hero screenshots captured successfully!');
})();
