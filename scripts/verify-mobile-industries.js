const { chromium } = require('playwright');
const path = require('path');

async function testMobile() {
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.addInitScript(() => sessionStorage.setItem('lg-preloaded', 'true'));
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  const ind = await page.$('#industries');
  if (ind) {
    const box = await ind.boundingBox();
    if (box) {
      // Scroll down to the bottom of the 8 boxes
      await page.evaluate(() => {
        const el = document.querySelector('#industries');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'end' });
      });
      await page.waitForTimeout(800);

      const outDir = path.join(__dirname, '..', 'responsive-audit', 'verification');
      await page.screenshot({
        path: path.join(outDir, 'phone-390-industries-view-more.png'),
      });
      console.log('Mobile industries view more captured successfully!');
    }
  }

  await browser.close();
}

testMobile().catch(console.error);

