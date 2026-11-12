const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  // Clear session storage to force preloader
  await page.addInitScript(() => {
    sessionStorage.clear();
  });

  await page.goto('http://localhost:3000');
  
  // Wait a bit for the preloader to be in full animation
  await page.waitForTimeout(600);

  // Check the two images inside preloader
  const baseImgLoaded = await page.evaluate(() => {
    const img = document.querySelector('img[src*="leadsgrow-logo-base.png"]');
    return img ? { complete: img.complete, naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight, currentSrc: img.currentSrc } : null;
  });

  const arrowImgLoaded = await page.evaluate(() => {
    const img = document.querySelector('img[src*="leadsgrow-logo-arrow.png"]');
    return img ? { complete: img.complete, naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight, currentSrc: img.currentSrc } : null;
  });

  console.log('Base Image Status:', JSON.stringify(baseImgLoaded));
  console.log('Arrow Image Status:', JSON.stringify(arrowImgLoaded));

  // Take screenshot of preloader
  await page.screenshot({ path: path.join(__dirname, '../responsive-audit/preloader-verify.png') });

  await browser.close();
  console.log('Preloader verification finished successfully!');
})();
