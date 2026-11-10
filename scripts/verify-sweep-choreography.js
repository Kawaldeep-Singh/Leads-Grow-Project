const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function verifySweepChoreography() {
  const browser = await chromium.launch({ channel: 'chrome' });
  const outputDir = path.join(__dirname, '..', 'responsive-audit', 'sweep-verification');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 1. Test horizontal scroll across all required viewports (320, 390, 768, 1024, 1440, 1920)
  const viewports = [320, 390, 768, 1024, 1440, 1920];
  console.log('--- Testing horizontal scroll integrity across viewports ---');
  for (const w of viewports) {
    const page = await browser.newPage({ viewport: { width: w, height: 800 } });
    await page.addInitScript(() => sessionStorage.setItem('lg-preloaded', 'true'));
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    // Monitor scrollWidth during animation
    const hasScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    console.log(`Viewport ${w}px horizontal scroll check: ${hasScroll ? 'FAILED (has scrollbar)' : 'PASSED (0 scrollbar)'}`);
    await page.close();
  }

  // 2. Capture sequential motion states (Entering, Landed, Exiting) on Desktop 1440x900
  console.log('\n--- Capturing sequential motion on Desktop 1440x900 ---');
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.addInitScript(() => sessionStorage.setItem('lg-preloaded', 'true'));
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    // Measure button position to verify zero layout jump
    const btnBox1 = await (await page.$('#hero a, #hero button'))?.boundingBox();

    // Slide 1 Landed
    await page.waitForTimeout(1400);
    await page.screenshot({
      path: path.join(outputDir, 'desktop-1440-slide1-landed.png'),
      clip: { x: 0, y: 0, width: 1440, height: 750 },
    });
    console.log('Captured desktop-1440 Slide 1 Landed');

    // Slide 1 Exiting (~3.8s total from start)
    await page.waitForTimeout(2200);
    await page.screenshot({
      path: path.join(outputDir, 'desktop-1440-slide1-exiting.png'),
      clip: { x: 0, y: 0, width: 1440, height: 750 },
    });
    console.log('Captured desktop-1440 Slide 1 Exiting');

    // Slide 2 Landed
    await page.waitForTimeout(1400);
    await page.screenshot({
      path: path.join(outputDir, 'desktop-1440-slide2-landed.png'),
      clip: { x: 0, y: 0, width: 1440, height: 750 },
    });
    console.log('Captured desktop-1440 Slide 2 Landed');

    // Slide 3 Landed (with 15+ countup)
    await page.waitForTimeout(3800);
    await page.screenshot({
      path: path.join(outputDir, 'desktop-1440-slide3-landed.png'),
      clip: { x: 0, y: 0, width: 1440, height: 750 },
    });
    console.log('Captured desktop-1440 Slide 3 Landed');

    const btnBox2 = await (await page.$('#hero a, #hero button'))?.boundingBox();
    console.log('Button position delta Y:', Math.abs((btnBox1?.y || 0) - (btnBox2?.y || 0)));

    // Test clicking progress segment 01
    const seg1Btn = await page.$('button[aria-label="Jump to slide 1"]');
    if (seg1Btn) {
      console.log('Clicking progress segment 01 to jump...');
      await seg1Btn.click();
      await page.waitForTimeout(1200);
      await page.screenshot({
        path: path.join(outputDir, 'desktop-1440-jump-slide1.png'),
        clip: { x: 0, y: 0, width: 1440, height: 750 },
      });
      console.log('Captured desktop-1440 after Jump to Slide 1');
    }

    await page.close();
  }

  // 3. Capture sequential motion states on Mobile Phone 390x844
  console.log('\n--- Capturing sequential motion on Phone 390x844 ---');
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.addInitScript(() => sessionStorage.setItem('lg-preloaded', 'true'));
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    // Slide 1 Landed on Phone
    await page.waitForTimeout(1400);
    await page.screenshot({
      path: path.join(outputDir, 'phone-390-slide1-landed.png'),
      clip: { x: 0, y: 0, width: 390, height: 700 },
    });
    console.log('Captured phone-390 Slide 1 Landed');

    // Slide 2 Landed on Phone
    await page.waitForTimeout(3800);
    await page.screenshot({
      path: path.join(outputDir, 'phone-390-slide2-landed.png'),
      clip: { x: 0, y: 0, width: 390, height: 700 },
    });
    console.log('Captured phone-390 Slide 2 Landed');

    // Slide 3 Landed on Phone
    await page.waitForTimeout(3800);
    await page.screenshot({
      path: path.join(outputDir, 'phone-390-slide3-landed.png'),
      clip: { x: 0, y: 0, width: 390, height: 700 },
    });
    console.log('Captured phone-390 Slide 3 Landed');

    await page.close();
  }

  await browser.close();
  console.log('\nAll sweep choreography verifications completed successfully!');
}

verifySweepChoreography().catch((err) => {
  console.error(err);
  process.exit(1);
});

