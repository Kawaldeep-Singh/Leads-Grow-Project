const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.addInitScript(() => sessionStorage.setItem('lg-preloaded', 'true'));
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const outPath = path.join(__dirname, '..', 'responsive-audit', 'verification', 'hero-updated-spacing.png');
  await page.screenshot({
    path: outPath,
    clip: { x: 0, y: 0, width: 390, height: 600 }
  });

  console.log('Saved:', outPath);
  await browser.close();
})();

