const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 360, height: 800 } });
  await page.addInitScript(() => sessionStorage.setItem('lg-preloaded', 'true'));
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  for (const fontSize of ['20px', '21px', '22px', '23px', '24px']) {
    const res = await page.evaluate((fs) => {
      const slides = document.querySelectorAll('.slide-main-line');
      slides.forEach(s => s.style.fontSize = fs);
      return Array.from(slides).map((s, idx) => ({
        slide: idx + 1,
        offsetHeight: s.offsetHeight,
        spans: Array.from(s.children).map(c => ({
          text: c.textContent.trim(),
          scrollWidth: c.scrollWidth,
          offsetHeight: c.offsetHeight
        }))
      }));
    }, fontSize);

    console.log(`\n--- Font Size: ${fontSize} ---`);
    res.forEach(s => {
      console.log(`Slide ${s.slide} height: ${s.offsetHeight}px | Spans: ${s.spans.map(sp => `${sp.text} (${sp.offsetHeight}px)`).join(' + ')}`);
    });
  }

  await browser.close();
})();

