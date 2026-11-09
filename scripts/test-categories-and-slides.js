const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function testTabsAndSlides() {
  const browser = await chromium.launch({ channel: 'chrome' });
  const outputDir = path.join(__dirname, '..', 'responsive-audit', 'verification');

  for (const width of [360, 390, 768, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Capture Slide 1
    await page.screenshot({
      path: path.join(outputDir, `${width}-slide-1.png`),
      clip: { x: 0, y: 0, width, height: 420 }
    });

    // Wait for slide 2 (slide cycles every ~3.5s)
    await page.waitForTimeout(3800);
    await page.screenshot({
      path: path.join(outputDir, `${width}-slide-2.png`),
      clip: { x: 0, y: 0, width, height: 420 }
    });

    // Wait for slide 3
    await page.waitForTimeout(3800);
    await page.screenshot({
      path: path.join(outputDir, `${width}-slide-3.png`),
      clip: { x: 0, y: 0, width, height: 420 }
    });

    // Capture Explore What We Offer + Category Filter Tabs
    const exploreHeading = await page.$('text=Explore What We Offer');
    if (exploreHeading) {
      const box = await exploreHeading.boundingBox();
      if (box) {
        await page.screenshot({
          path: path.join(outputDir, `${width}-filter-tabs.png`),
          clip: {
            x: 0,
            y: Math.max(0, box.y - 40),
            width,
            height: 320
          }
        });
      }
    }

    await page.close();
  }

  await browser.close();
  console.log('Tabs and slides testing complete!');
}

testTabsAndSlides().catch(console.error);

