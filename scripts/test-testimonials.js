const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function testTestimonials() {
  const browser = await chromium.launch({ channel: 'chrome' });
  const outputDir = path.join(__dirname, '..', 'responsive-audit', 'verification');

  for (const vp of [
    { name: 'phone-360', width: 360, height: 800 },
    { name: 'phone-390', width: 390, height: 844 },
    { name: 'desktop-1440', width: 1440, height: 900 }
  ]) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await page.addInitScript(() => sessionStorage.setItem('lg-preloaded', 'true'));
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const testimonials = await page.$('#testimonials');
    if (testimonials) {
      await testimonials.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      await page.screenshot({
        path: path.join(outputDir, `${vp.name}-testimonials.png`),
      });
      console.log(`Captured ${vp.name} testimonials`);
    }

    await page.close();
  }

  await browser.close();
  console.log('Testimonials verification complete!');
}

testTestimonials().catch(console.error);

