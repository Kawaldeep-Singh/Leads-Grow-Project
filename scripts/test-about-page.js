const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function testAboutPage() {
  const browser = await chromium.launch({ channel: 'chrome' });
  const outputDir = path.join(__dirname, '..', 'responsive-audit', 'about-page');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (const vp of [
    { name: 'desktop-1440', width: 1440, height: 900 },
    { name: 'tablet-768', width: 768, height: 1024 },
    { name: 'phone-390', width: 390, height: 844 },
    { name: 'phone-360', width: 360, height: 740 },
  ]) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await page.addInitScript(() => sessionStorage.setItem('lg-preloaded', 'true'));
    
    await page.goto('http://localhost:3000/about', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Full page screenshot
    await page.screenshot({
      path: path.join(outputDir, `${vp.name}-about-full.png`),
      fullPage: true,
    });

    // Top fold screenshot
    await page.screenshot({
      path: path.join(outputDir, `${vp.name}-about-hero.png`),
      clip: { x: 0, y: 0, width: vp.width, height: Math.min(vp.height, 900) }
    });

    console.log(`Captured ${vp.name} about page`);
    await page.close();
  }

  await browser.close();
  console.log('About page visual testing complete!');
}

testAboutPage().catch(console.error);

