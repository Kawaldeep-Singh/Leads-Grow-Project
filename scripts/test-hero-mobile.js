const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function testMobile() {
  const browser = await chromium.launch({ channel: 'chrome' });
  const viewports = [
    { name: 'phone-360', width: 360, height: 740 },
    { name: 'phone-390', width: 390, height: 844 },
    { name: 'tablet-768', width: 768, height: 1024 },
    { name: 'desktop-1440', width: 1440, height: 900 },
  ];

  const outputDir = path.join(__dirname, '..', 'responsive-audit', 'verification');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Screenshot hero and category buttons
    await page.screenshot({
      path: path.join(outputDir, `${vp.name}-hero-and-tabs.png`),
      clip: { x: 0, y: 0, width: vp.width, height: Math.min(vp.height, 950) }
    });
    console.log(`Captured screenshot for ${vp.name}`);
    await page.close();
  }

  await browser.close();
  console.log('Visual verification complete!');
}

testMobile().catch(console.error);
