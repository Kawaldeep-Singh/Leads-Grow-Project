const { chromium } = require('playwright');
const path = require('path');

async function captureEachSlide() {
  const browser = await chromium.launch({ channel: 'chrome' });
  const outputDir = path.join(__dirname, '..', 'responsive-audit', 'sweep-verification');

  for (const vp of [
    { name: 'desktop-1440', width: 1440, height: 900, clipH: 750 },
    { name: 'phone-390', width: 390, height: 844, clipH: 700 },
  ]) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await page.addInitScript(() => sessionStorage.setItem('lg-preloaded', 'true'));
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    // Wait for slide 1 to land
    await page.waitForTimeout(1600);
    await page.screenshot({
      path: path.join(outputDir, `${vp.name}-slide-1-landed.png`),
      clip: { x: 0, y: 0, width: vp.width, height: vp.clipH },
    });
    console.log(`Captured ${vp.name} Slide 1 Landed`);

    // Jump to Slide 2 using progress button
    const btn2 = await page.$('button[aria-label="Jump to slide 2"]');
    if (btn2) {
      await btn2.click();
      await page.waitForTimeout(1600);
      await page.screenshot({
        path: path.join(outputDir, `${vp.name}-slide-2-landed.png`),
        clip: { x: 0, y: 0, width: vp.width, height: vp.clipH },
      });
      console.log(`Captured ${vp.name} Slide 2 Landed`);
    }

    // Jump to Slide 3 using progress button
    const btn3 = await page.$('button[aria-label="Jump to slide 3"]');
    if (btn3) {
      await btn3.click();
      await page.waitForTimeout(1600);
      await page.screenshot({
        path: path.join(outputDir, `${vp.name}-slide-3-landed.png`),
        clip: { x: 0, y: 0, width: vp.width, height: vp.clipH },
      });
      console.log(`Captured ${vp.name} Slide 3 Landed`);
    }

    await page.close();
  }

  await browser.close();
  console.log('Capture each slide complete!');
}

captureEachSlide().catch(console.error);

