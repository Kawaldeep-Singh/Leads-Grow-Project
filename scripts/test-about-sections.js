const { chromium } = require('playwright');
const path = require('path');

async function testSections() {
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.addInitScript(() => sessionStorage.setItem('lg-preloaded', 'true'));
  await page.goto('http://localhost:3000/about', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const outputDir = path.join(__dirname, '..', 'responsive-audit', 'about-page');

  // Scroll to Pillars
  await page.evaluate(() => window.scrollTo(0, 800));
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outputDir, 'mobile-pillars.png') });

  // Scroll to Timeline
  await page.evaluate(() => window.scrollTo(0, 2000));
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outputDir, 'mobile-timeline.png') });

  // Scroll to Team
  await page.evaluate(() => window.scrollTo(0, 3100));
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outputDir, 'mobile-team.png') });

  // Scroll to Stats & CTA
  await page.evaluate(() => window.scrollTo(0, 4200));
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outputDir, 'mobile-cta.png') });

  console.log('Mobile sections captured');
  await browser.close();
}

testSections().catch(console.error);

