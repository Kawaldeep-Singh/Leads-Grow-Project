const { chromium } = require('playwright');
const path = require('path');

async function verifyHeroSlides() {
  const browser = await chromium.launch({ channel: 'chrome' });
  const outputDir = path.join(__dirname, '..', 'responsive-audit', 'verification');

  // Verify on Phone (390x844) and Desktop (1440x900)
  for (const vp of [
    { name: 'phone-390', width: 390, height: 844 },
    { name: 'desktop-1440', width: 1440, height: 900 },
  ]) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await page.addInitScript(() => sessionStorage.setItem('lg-preloaded', 'true'));
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);

    // Slide 1 screenshot
    await page.screenshot({
      path: path.join(outputDir, `${vp.name}-slide-1.png`),
      clip: { x: 0, y: 0, width: vp.width, height: Math.min(vp.height, 750) },
    });
    console.log(`Captured ${vp.name} Slide 1`);

    // Wait for transition to Slide 2 (~4.5s)
    await page.waitForTimeout(4600);
    await page.screenshot({
      path: path.join(outputDir, `${vp.name}-slide-2.png`),
      clip: { x: 0, y: 0, width: vp.width, height: Math.min(vp.height, 750) },
    });
    console.log(`Captured ${vp.name} Slide 2`);

    // Wait for transition to Slide 3 (~4.5s)
    await page.waitForTimeout(4600);
    await page.screenshot({
      path: path.join(outputDir, `${vp.name}-slide-3.png`),
      clip: { x: 0, y: 0, width: vp.width, height: Math.min(vp.height, 750) },
    });
    console.log(`Captured ${vp.name} Slide 3`);

    // Scroll to Explore What We Offer section
    const pill = await page.$('span:has-text("Explore What We Offer")');
    if (pill) {
      await pill.scrollIntoViewIfNeeded();
      await page.waitForTimeout(600);
      await page.screenshot({
        path: path.join(outputDir, `${vp.name}-explore-section.png`),
      });
      console.log(`Captured ${vp.name} Explore Section`);
    }

    await page.close();
  }

  await browser.close();
  console.log('All verification screenshots captured successfully!');
}

verifyHeroSlides().catch((err) => {
  console.error(err);
  process.exit(1);
});

