import { expect, test } from 'playwright/test';
import { digitalMarketing } from '../data/servicePages/digital-marketing';
import { industriesData } from '../data/industries';

const copyStrings = [
  digitalMarketing.hero.eyebrow,
  digitalMarketing.hero.title,
  digitalMarketing.hero.text,
  ...digitalMarketing.hero.flow,
  digitalMarketing.what.title,
  ...digitalMarketing.what.paragraphs,
  digitalMarketing.services.eyebrow,
  digitalMarketing.services.title,
  ...digitalMarketing.services.items,
  digitalMarketing.why.eyebrow,
  digitalMarketing.why.title,
  ...digitalMarketing.why.stats.flatMap(({ value, label }) => [value, label]),
  digitalMarketing.process.eyebrow,
  digitalMarketing.process.title,
  ...digitalMarketing.process.steps.flatMap(({ title, text }) => [title, text]),
  digitalMarketing.industries.title,
  ...industriesData.map(({ name }) => name),
  digitalMarketing.cta.eyebrow,
  digitalMarketing.cta.title,
  digitalMarketing.cta.text,
  digitalMarketing.cta.button,
];

const normalize = (value: string) => value.replace(/\s+/g, ' ').trim();

test.describe('Digital Marketing service page', () => {
  test('renders the exact data copy, page structure, metadata and CTA', async ({ page }) => {
    const browserIssues: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error' || message.type() === 'warning') browserIssues.push(message.text());
    });
    page.on('pageerror', (error) => browserIssues.push(error.message));

    await page.goto('/services/digital-marketing', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('main h1')).toHaveCount(1);
    await expect(page.locator('main h1')).toContainText('More Leads.');
    await expect(page.locator('main h1')).toContainText('More Customers.');
    await expect(page.locator('main h1')).toContainText('More Revenue.');
    await expect(page.locator('main a[href="/contact"]')).toContainText(digitalMarketing.cta.button);
    await expect(page).toHaveTitle('Digital Marketing | LeadsGrow');
    await expect(page.locator('[data-stat-value]')).toHaveCount(digitalMarketing.why.stats.length);
    expect(await page.locator('[data-stat-value]').evaluateAll((tiles) => tiles.map((tile) => tile.getAttribute('data-stat-value'))))
      .toEqual(digitalMarketing.why.stats.map(({ value }) => value));

    const visibleText = await page.locator('main').evaluate((main) => {
      const clone = main.cloneNode(true) as HTMLElement;
      clone.querySelectorAll('[aria-hidden="true"], [data-counter-overlay], script, style').forEach((element) => element.remove());
      clone.querySelectorAll('[data-final-value]').forEach((element) => element.remove());
      return clone.innerText;
    });
    const visibleTextNodes = await page.locator('main').evaluate((main) => {
      const clone = main.cloneNode(true) as HTMLElement;
      clone.querySelectorAll('[aria-hidden="true"], [data-counter-overlay], script, style').forEach((element) => element.remove());
      clone.querySelectorAll('[data-final-value]').forEach((element) => element.remove());
      const walker = document.createTreeWalker(clone, NodeFilter.SHOW_TEXT);
      const nodes: string[] = [];
      while (walker.nextNode()) nodes.push(walker.currentNode.textContent ?? '');
      return nodes.join(' ');
    });
    const normalizedText = normalize(visibleText);
    for (const string of copyStrings.filter((copy) => !digitalMarketing.why.stats.some(({ value }) => copy === value))) {
      expect(normalizedText).toContain(normalize(string));
    }

    const allowedCounts = new Map<string, number>();
    const tokenize = (value: string) => value.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu) ?? [];
    const tokenCheckedCopy = copyStrings.filter((string) => !digitalMarketing.why.stats.some(({ value }) => string === value));
    tokenize(tokenCheckedCopy.join(' ')).forEach((word) => allowedCounts.set(word, (allowedCounts.get(word) ?? 0) + 1));
    tokenize(visibleTextNodes).forEach((word) => {
      const remaining = allowedCounts.get(word) ?? 0;
      expect(remaining, `Unexpected visible word: ${word}`).toBeGreaterThan(0);
      allowedCounts.set(word, remaining - 1);
    });

    const footerIsLast = await page.locator('#site-footer').evaluate((footer) => footer.parentElement?.lastElementChild === footer);
    expect(footerIsLast).toBeTruthy();
    expect(browserIssues).toEqual([]);
  });

  test('does not overflow at supported viewport widths', async ({ page }) => {
    await page.goto('/services/digital-marketing', { waitUntil: 'domcontentloaded' });
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: width < 768 ? 844 : 900 });
      await page.waitForTimeout(150);
      const widths = await page.evaluate(() => ({ viewport: window.innerWidth, content: document.documentElement.scrollWidth }));
      expect(widths.content, `Horizontal overflow at ${width}px`).toBeLessThanOrEqual(widths.viewport);
    }
  });

  test('returns 404 for an unregistered service slug', async ({ request }) => {
    const response = await request.get('/services/not-a-real-service');
    expect(response.status()).toBe(404);
  });

  test('opens the Digital Marketing landing page from the existing service card', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.getByText('LOADING YOUR GROWTH').waitFor({ state: 'visible', timeout: 10000 });
    await page.getByText('LOADING YOUR GROWTH').waitFor({ state: 'hidden', timeout: 15000 });
    await page.getByRole('button', { name: 'Explore Service', exact: true }).first().click();
    await expect(page).toHaveURL(/\/services\/digital-marketing$/);
  });
});
