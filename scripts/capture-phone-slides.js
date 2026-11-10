const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.addInitScript(() => sessionStorage.setItem('lg-preloaded', 'true'));
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2200);

  const btn2 = await page.$('button[aria-label="Jump to slide 2"]');
  if (btn2) {
    await btn2.click();
    await page.waitForTimeout(1600);
    await page.screenshot({
      path: path.join(__dirname, '..', 'responsive-audit', 'sweep-verification', 'phone-390-slide-2-landed.png'),
      clip: { x: 0, y: 0, width: 390, height: 750 },
    });
    console.log('Captured phone-390 Slide 2 Landed');
  }

  const btn3 = await page.$('button[aria-label="Jump to slide 3"]');
  if (btn3) {
    await btn3.click();
    await page.waitForTimeout(1600);
    await page.screenshot({
      path: path.join(__dirname, '..', 'responsive-audit', 'sweep-verification', 'phone-390-slide-3-landed.png'),
      clip: { x: 0, y: 0, width: 390, height: 750 },
    });
    console.log('Captured phone-390 Slide 3 Landed');
  }

  await browser.close();
})();

