const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 360, height: 900 } });
  await page.addInitScript(() => sessionStorage.setItem('lg-preloaded', 'true'));
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // Wait until Slide 3 is fully visible and idle (after ~9 seconds)
  await page.waitForTimeout(9200);

  const outputDir = path.join(__dirname, '..', 'responsive-audit', 'verification');
  await page.screenshot({
    path: path.join(outputDir, '360-slide3-idle.png'),
    clip: { x: 0, y: 0, width: 360, height: 480 }
  });

  await browser.close();
  console.log('Slide 3 idle screenshot saved');
})();

