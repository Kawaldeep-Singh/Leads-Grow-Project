const { chromium } = require('playwright');
const path = require('path');

async function testSmallAndroid() {
  const browser = await chromium.launch({ channel: 'chrome' });
  const outputDir = path.join(__dirname, '..', 'responsive-audit', 'verification');

  const page = await browser.newPage({ viewport: { width: 360, height: 740 } });
  await page.addInitScript(() => sessionStorage.setItem('lg-preloaded', 'true'));
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Check horizontal overflow
  const hasHorizontalScroll = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  console.log('360px has horizontal scroll?', hasHorizontalScroll);

  // Capture hero on 360px
  await page.screenshot({
    path: path.join(outputDir, 'phone-360-slide-1.png'),
    clip: { x: 0, y: 0, width: 360, height: 740 },
  });
  console.log('Captured phone-360 Slide 1');

  // Scroll to explore section
  const pill = await page.$('span:has-text("Explore What We Offer")');
  if (pill) {
    await pill.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(outputDir, 'phone-360-explore-section.png'),
    });
    console.log('Captured phone-360 Explore Section');
  }

  await browser.close();
}

testSmallAndroid().catch(console.error);

