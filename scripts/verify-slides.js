const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function verifySlides() {
  const browser = await chromium.launch({ channel: 'chrome' });
  const outputDir = path.join(__dirname, '..', 'responsive-audit', 'verification');

  for (const width of [360, 390, 768, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    
    // Skip preloader via sessionStorage
    await page.addInitScript(() => {
      sessionStorage.setItem('lg-preloaded', 'true');
    });

    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);

    // Slide 1
    await page.screenshot({
      path: path.join(outputDir, `${width}-hero-slide-1.png`),
      clip: { x: 0, y: 0, width, height: 480 }
    });

    // Wait for Slide 2
    await page.waitForTimeout(3800);
    await page.screenshot({
      path: path.join(outputDir, `${width}-hero-slide-2.png`),
      clip: { x: 0, y: 0, width, height: 480 }
    });

    // Wait for Slide 3
    await page.waitForTimeout(3800);
    await page.screenshot({
      path: path.join(outputDir, `${width}-hero-slide-3.png`),
      clip: { x: 0, y: 0, width, height: 480 }
    });

    await page.close();
  }

  await browser.close();
  console.log('Slides verification complete!');
}

verifySlides().catch(console.error);

