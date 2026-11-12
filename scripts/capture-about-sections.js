const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'responsive-audit', 'about-verification');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

(async () => {
  const browser = await chromium.launch();

  // 1. Desktop Screenshots (1440x900)
  const desktopPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await desktopPage.addInitScript(() => sessionStorage.setItem('lg-preloaded', 'true'));
  await desktopPage.goto('http://localhost:3000/about', { waitUntil: 'networkidle' });
  await desktopPage.waitForTimeout(1000);

  const sections = ['about-hero-title', 'about-story-title', 'about-mission-title', 'about-approach-title', 'about-cta-title'];
  const sectionNames = ['hero', 'story', 'mission-vision', 'approach', 'cta'];

  for (let i = 0; i < sections.length; i++) {
    const titleLocator = desktopPage.locator(`[id="${sections[i]}"]`);
    await titleLocator.scrollIntoViewIfNeeded();
    await desktopPage.waitForTimeout(600);
    const screenshotPath = path.join(outDir, `desktop-1440-${sectionNames[i]}.png`);
    await desktopPage.screenshot({ path: screenshotPath });
    console.log(`Captured: desktop-1440-${sectionNames[i]}.png`);
  }

  // Full page desktop
  await desktopPage.screenshot({ path: path.join(outDir, 'desktop-1440-full.png'), fullPage: true });
  console.log('Captured full desktop page');

  // 2. Mobile Screenshots (390x844)
  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobilePage.addInitScript(() => sessionStorage.setItem('lg-preloaded', 'true'));
  await mobilePage.goto('http://localhost:3000/about', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1000);

  for (let i = 0; i < sections.length; i++) {
    const titleLocator = mobilePage.locator(`[id="${sections[i]}"]`);
    await titleLocator.scrollIntoViewIfNeeded();
    await mobilePage.waitForTimeout(600);
    const screenshotPath = path.join(outDir, `mobile-390-${sectionNames[i]}.png`);
    await mobilePage.screenshot({ path: screenshotPath });
    console.log(`Captured: mobile-390-${sectionNames[i]}.png`);
  }

  // Full page mobile
  await mobilePage.screenshot({ path: path.join(outDir, 'mobile-390-full.png'), fullPage: true });
  console.log('Captured full mobile page');

  // 3. Horizontal Scroll check across all viewports
  const viewports = [320, 360, 390, 430, 768, 1024, 1280, 1366, 1440, 1920, 2560];
  let allPass = true;

  for (const width of viewports) {
    const testPage = await browser.newPage({ viewport: { width, height: 800 } });
    await testPage.addInitScript(() => sessionStorage.setItem('lg-preloaded', 'true'));
    await testPage.goto('http://localhost:3000/about', { waitUntil: 'domcontentloaded' });
    await testPage.waitForTimeout(500);

    const hasHorizontalScroll = await testPage.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });

    const scrollWidth = await testPage.evaluate(() => document.documentElement.scrollWidth);
    console.log(`Viewport ${width}px: scrollWidth = ${scrollWidth}px (overflow: ${hasHorizontalScroll ? 'FAIL' : 'PASS'})`);

    if (hasHorizontalScroll) {
      allPass = false;
    }
    await testPage.close();
  }

  console.log('Horizontal overflow check complete. All passed:', allPass);
  await browser.close();
})();

