const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const VIEWPORTS = [
  // Small phone
  { name: 'small-phone-320x568', width: 320, height: 568, isTouch: true },
  { name: 'small-phone-360x640', width: 360, height: 640, isTouch: true },
  // Phone
  { name: 'phone-375x667', width: 375, height: 667, isTouch: true },
  { name: 'phone-390x844', width: 390, height: 844, isTouch: true },
  { name: 'phone-412x915', width: 412, height: 915, isTouch: true },
  { name: 'phone-430x932', width: 430, height: 932, isTouch: true },
  // Phone landscape
  { name: 'phone-land-667x375', width: 667, height: 375, isTouch: true },
  { name: 'phone-land-844x390', width: 844, height: 390, isTouch: true },
  { name: 'phone-land-915x412', width: 915, height: 412, isTouch: true },
  // Tablet portrait
  { name: 'tablet-port-768x1024', width: 768, height: 1024, isTouch: true },
  { name: 'tablet-port-820x1180', width: 820, height: 1180, isTouch: true },
  // Tablet landscape / small laptop
  { name: 'tablet-land-1024x768', width: 1024, height: 768, isTouch: true },
  { name: 'laptop-1180x820', width: 1180, height: 820, isTouch: false },
  { name: 'laptop-1280x720', width: 1280, height: 720, isTouch: false },
  { name: 'laptop-1366x768', width: 1366, height: 768, isTouch: false },
  { name: 'laptop-1536x730', width: 1536, height: 730, isTouch: false },
  // Desktop
  { name: 'desktop-1440x900', width: 1440, height: 900, isTouch: false },
  { name: 'desktop-1920x1080', width: 1920, height: 1080, isTouch: false },
  { name: 'desktop-2560x1440', width: 2560, height: 1440, isTouch: false },
];

const TAKE_SCREENSHOTS = process.argv.includes('--screenshots');
const SCREENSHOT_DIR = path.join(
  __dirname,
  '..',
  'responsive-audit',
  process.argv.includes('--after') ? 'after' : 'before'
);

async function runAudit() {
  if (TAKE_SCREENSHOTS && !fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }

  const browser = await chromium.launch({ channel: 'chrome' });
  let totalFailures = 0;
  const auditReport = [];

  console.log(`\n======================================================`);
  console.log(` Starting Responsive Audit across ${VIEWPORTS.length} viewports...`);
  console.log(` Target URL: http://localhost:3000/`);
  console.log(`======================================================\n`);

  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      hasTouch: vp.isTouch,
      isMobile: vp.isTouch,
      userAgent: vp.isTouch
        ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
        : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    });

    const page = await context.newPage();
    const consoleErrors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    try {
      await page.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 30000 });
      // Give animations and fonts time to stabilize
      await page.waitForTimeout(1000);

      // 1. Check document horizontal overflow
      const overflowCheck = await page.evaluate(() => {
        const docWidth = document.documentElement.scrollWidth;
        const winWidth = window.innerWidth;
        const bodyWidth = document.body.scrollWidth;

        // Find elements that bleed past window.innerWidth
        const offenders = [];
        const allElements = document.querySelectorAll('*');
        for (const el of allElements) {
          const rect = el.getBoundingClientRect();
          if (rect.right > winWidth + 1.5) {
            // Check if element is visible
            const style = window.getComputedStyle(el);
            if (
              style.display !== 'none' &&
              style.visibility !== 'hidden' &&
              style.opacity !== '0' &&
              rect.width > 0 &&
              rect.height > 0
            ) {
              offenders.push({
                tag: el.tagName.toLowerCase(),
                id: el.id || '',
                className: (el.className && typeof el.className === 'string' ? el.className.slice(0, 80) : ''),
                right: Math.round(rect.right),
                width: Math.round(rect.width),
                overflowBy: Math.round(rect.right - winWidth),
              });
            }
          }
        }

        return {
          docWidth,
          winWidth,
          bodyWidth,
          hasOverflow: docWidth > winWidth + 1,
          offenders: offenders.slice(0, 10), // top 10
        };
      });

      // 2. Check touch targets on touch viewports (width < 1024)
      const touchTargetCheck = vp.isTouch
        ? await page.evaluate(() => {
            const smallTargets = [];
            const interactiveElements = document.querySelectorAll(
              'a, button, input[type="button"], input[type="submit"], [role="button"], [role="tab"]'
            );

            for (const el of interactiveElements) {
              const rect = el.getBoundingClientRect();
              const style = window.getComputedStyle(el);
              if (
                style.display !== 'none' &&
                style.visibility !== 'hidden' &&
                style.opacity !== '0' &&
                rect.width > 0 &&
                rect.height > 0
              ) {
                // Must be >= 44x44
                if (rect.width < 43.5 || rect.height < 43.5) {
                  smallTargets.push({
                    text: (el.innerText || el.getAttribute('aria-label') || el.tagName).trim().slice(0, 30),
                    tag: el.tagName.toLowerCase(),
                    className: (el.className && typeof el.className === 'string' ? el.className.slice(0, 60) : ''),
                    width: Math.round(rect.width),
                    height: Math.round(rect.height),
                  });
                }
              }
            }

            return {
              count: smallTargets.length,
              samples: smallTargets.slice(0, 8),
            };
          })
        : { count: 0, samples: [] };

      // Capture screenshot if requested
      if (TAKE_SCREENSHOTS) {
        // Above the fold
        await page.screenshot({
          path: path.join(SCREENSHOT_DIR, `${vp.name}-fold.png`),
          fullPage: false,
        });
        // Full page
        await page.screenshot({
          path: path.join(SCREENSHOT_DIR, `${vp.name}-full.png`),
          fullPage: true,
        });
      }

      const hasIssues = overflowCheck.hasOverflow || consoleErrors.length > 0;
      if (hasIssues) totalFailures++;

      auditReport.push({
        viewport: vp.name,
        width: vp.width,
        height: vp.height,
        overflow: overflowCheck.hasOverflow,
        scrollWidth: overflowCheck.docWidth,
        innerWidth: overflowCheck.winWidth,
        offenders: overflowCheck.offenders,
        smallTouchTargetsCount: touchTargetCheck.count,
        smallTouchTargetsSamples: touchTargetCheck.samples,
        consoleErrors,
      });

      const statusIcon = hasIssues ? '❌ FAIL' : '✅ PASS';
      console.log(
        `${statusIcon} [${vp.name}]: ScrollWidth: ${overflowCheck.docWidth}px vs Window: ${overflowCheck.winWidth}px | Touch Issues: ${touchTargetCheck.count} | Console Errors: ${consoleErrors.length}`
      );

      if (overflowCheck.hasOverflow && overflowCheck.offenders.length > 0) {
        console.log(`   Overflow offenders:`, overflowCheck.offenders.map(o => `${o.tag}.${o.className} (+${o.overflowBy}px)`).slice(0, 3));
      }
    } catch (err) {
      console.error(`❌ ERROR on [${vp.name}]:`, err.message);
      totalFailures++;
    } finally {
      await context.close();
    }
  }

  await browser.close();

  // Save audit report to json
  const reportPath = path.join(__dirname, '..', 'responsive-audit', 'audit-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(auditReport, null, 2));

  console.log(`\n======================================================`);
  console.log(` Audit Complete. Total Viewports: ${VIEWPORTS.length} | Viewports with issues: ${totalFailures}`);
  console.log(` Full report written to: ${reportPath}`);
  console.log(`======================================================\n`);

  if (totalFailures > 0) {
    process.exitCode = 1;
  }
}

runAudit().catch((err) => {
  console.error('Fatal audit error:', err);
  process.exit(1);
});

