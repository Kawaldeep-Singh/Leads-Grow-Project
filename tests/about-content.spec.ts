import { test, expect } from 'playwright/test';
import { aboutContent } from '../data/about';

test.describe('About Page Content Accuracy', () => {
  test('verifies exact content and no extra visible text inside <main>', async ({ page }) => {
    page.on('console', (msg) => console.log('BROWSER LOG:', msg.type(), msg.text()));
    page.on('pageerror', (err) => console.log('PAGE ERROR:', err.stack || err.message));

    // 1. Open /about with reduced motion enabled
    await page.emulateMedia({ reducedMotion: 'reduce' });
    // Bypass preloader flag
    await page.addInitScript(() => {
      sessionStorage.setItem('lg-preloaded', 'true');
    });

    await page.goto('/about', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('main');
    await page.waitForTimeout(300);

    // 2. Assert exactly one <h1> and its text equals hero.title
    const h1Elements = page.locator('h1');
    const h1Count = await h1Elements.count();
    expect(h1Count, 'There must be exactly one <h1> on the page').toBe(1);

    const h1Text = (await h1Elements.first().innerText()).trim().replace(/\s+/g, ' ');
    expect(h1Text).toBe(aboutContent.hero.title);

    // 3. Collect all 38 expected strings from aboutContent
    const allExpectedStrings: string[] = [
      aboutContent.hero.eyebrow,
      aboutContent.hero.title,
      ...aboutContent.hero.paragraphs,
      aboutContent.story.eyebrow,
      aboutContent.story.title,
      ...aboutContent.story.paragraphs,
      aboutContent.mission.eyebrow,
      aboutContent.mission.title,
      aboutContent.mission.text,
      aboutContent.vision.eyebrow,
      aboutContent.vision.title,
      aboutContent.vision.text,
      aboutContent.approach.eyebrow,
      aboutContent.approach.title,
      aboutContent.approach.intro,
      ...aboutContent.approach.steps.flatMap((s) => [s.number, s.title, s.text]),
      aboutContent.cta.title,
      aboutContent.cta.text,
      aboutContent.cta.button,
    ];

    // Assert every string in aboutContent appears in the page text exactly as written
    const mainLocator = page.locator('main');
    const rawMainText = await mainLocator.innerText();
    const normalizedMainText = rawMainText.replace(/\s+/g, ' ');

    for (const expectedStr of allExpectedStrings) {
      const normalizedExpected = expectedStr.replace(/\s+/g, ' ');
      const containsString = normalizedMainText.includes(normalizedExpected);
      if (!containsString) {
        console.error(`Missing expected string: "${expectedStr}"`);
      }
      expect(containsString, `Expected string missing from page: "${expectedStr}"`).toBe(true);
    }

    // 4. Assert inside <main>, no other visible text exists beyond those strings
    // Sort expected strings longest first to avoid partial replacements
    const sortedExpected = [...allExpectedStrings].sort((a, b) => b.length - a.length);

    let remainingText = normalizedMainText;
    for (const expected of sortedExpected) {
      const normalized = expected.replace(/\s+/g, ' ');
      const idx = remainingText.indexOf(normalized);
      if (idx !== -1) {
        remainingText = remainingText.slice(0, idx) + ' ' + remainingText.slice(idx + normalized.length);
      }
    }

    const leftoverTrimmed = remainingText.trim().replace(/\s+/g, ' ');
    if (leftoverTrimmed.length > 0) {
      console.error('Found extra visible text inside <main>:', leftoverTrimmed);
    }
    expect(leftoverTrimmed, `Extra visible text found in <main>: "${leftoverTrimmed}"`).toBe('');
  });
});
