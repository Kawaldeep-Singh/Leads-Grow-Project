const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function testIndustries() {
  const browser = await chromium.launch({ channel: 'chrome' });
  const outputDir = path.join(__dirname, '..', 'responsive-audit', 'verification');

  for (const vp of [
    { name: 'desktop-1440', width: 1440, height: 900 },
    { name: 'phone-390', width: 390, height: 844 },
  ]) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await page.addInitScript(() => sessionStorage.setItem('lg-preloaded', 'true'));
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const indSection = await page.$('#industries');
    if (indSection) {
      await indSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      // Screenshot default 8 boxes + View More button
      await page.screenshot({
        path: path.join(outputDir, `${vp.name}-industries-default.png`),
      });
      console.log(`Captured ${vp.name} default`);

      // Click "View More"
      const viewMoreBtn = await page.$('button:has-text("View More")');
      if (viewMoreBtn) {
        await viewMoreBtn.click();
        await page.waitForTimeout(600); // Wait for AnimatePresence expand

        // Screenshot expanded 12 boxes
        await page.screenshot({
          path: path.join(outputDir, `${vp.name}-industries-expanded.png`),
        });
        console.log(`Captured ${vp.name} expanded`);

        // Click "Show Less"
        const showLessBtn = await page.$('button:has-text("Show Less")');
        if (showLessBtn) {
          await showLessBtn.click();
          await page.waitForTimeout(600);
          console.log(`Clicked ${vp.name} show less`);
        }
      }
    }

    await page.close();
  }

  await browser.close();
  console.log('Industries View More testing complete!');
}

testIndustries().catch(console.error);

