const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 360, height: 800 } });
  await page.addInitScript(() => sessionStorage.setItem('lg-preloaded', 'true'));
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  const info = await page.evaluate(() => {
    const slides = Array.from(document.querySelectorAll('.slide-main-line'));
    return slides.map((s, idx) => ({
      slide: idx + 1,
      scrollWidth: s.scrollWidth,
      clientWidth: s.clientWidth,
      offsetHeight: s.offsetHeight,
      spans: Array.from(s.children).map(c => ({
        text: c.textContent.trim(),
        scrollWidth: c.scrollWidth,
        clientWidth: c.clientWidth,
        offsetHeight: c.offsetHeight
      }))
    }));
  });

  console.log(JSON.stringify(info, null, 2));
  await browser.close();
})();

