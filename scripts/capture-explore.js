const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.addInitScript(() => sessionStorage.setItem('lg-preloaded', 'true'));
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const heroEl = await page.$('#hero');
  if (heroEl) {
    const box = await heroEl.boundingBox();
    console.log('Hero box:', box);
  }

  const pill = await page.$('span:has-text("Explore What We Offer")');
  if (pill) {
    await pill.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'explore-section-390.png' });
    console.log('Captured explore-section-390.png');
  } else {
    console.log('Explore What We Offer not found');
  }

  await browser.close();
})();

