import { expect, test } from 'playwright/test';
import { digitalMarketing } from '../data/servicePages/digital-marketing';
import { industriesData } from '../data/industries';
import { websiteDevelopment } from '../data/servicePages/website-development';
import { techStackData, techTabs } from '../data/techStack';
import { statsData } from '../data/stats';
import { aboutContent } from '../data/about';

const copyStrings = [
  digitalMarketing.hero.eyebrow,
  digitalMarketing.hero.title,
  digitalMarketing.hero.text,
  ...digitalMarketing.hero.flow,
  digitalMarketing.what.title,
  ...digitalMarketing.what.paragraphs,
  digitalMarketing.services.eyebrow,
  digitalMarketing.services.title,
  digitalMarketing.services.count,
  ...digitalMarketing.services.items.flatMap(({ n, tag, name }) => [n, tag, name]),
  digitalMarketing.why.eyebrow,
  digitalMarketing.why.title,
  'Data-backed digital marketing designed to dominate search engines, capture high-intent buyers, and scale predictable revenue.',
  'Up to',
  'Full-Funnel Strategy',
  'Top Google SERP',
  'Lower Acquisition Cost',
  'High-Intent Leads',
  'Multi-Sector Growth',
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
const normalizeCopy = (value: string) => normalize(value.replace(/[’]/g, "'").replace(/,(?=\S)/g, ', '));

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

    const servicesSection = page.locator('#digital-marketing-services');
    await expect(servicesSection.locator('h2')).toHaveCount(1);
    await expect(servicesSection.locator('ul > li')).toHaveCount(9);
    await expect(servicesSection.getByText(digitalMarketing.services.count, { exact: true })).toBeVisible();
    for (const { n, tag, name } of digitalMarketing.services.items) {
      const row = servicesSection.locator('li').filter({ hasText: name });
      await expect(row).toHaveCount(1);
      await expect(row).toContainText(n);
      await expect(row).toContainText(tag);
    }
    const expectedServicesText = normalize([
      digitalMarketing.services.eyebrow,
      digitalMarketing.services.title,
      digitalMarketing.services.count,
      ...digitalMarketing.services.items.flatMap(({ n, tag, name }) => [n, tag, name]),
    ].join(' '));
    expect(normalize(await servicesSection.innerText())).toBe(expectedServicesText);

    const visibleText = await page.locator('main').evaluate((main) => {
      const clone = main.cloneNode(true) as HTMLElement;
      clone.querySelectorAll('[aria-hidden="true"], [data-counter-overlay], script, style').forEach((element) => element.remove());
      clone.querySelectorAll('[data-final-value]').forEach((element) => element.remove());
      return clone.innerText;
    });
    const normalizedText = normalizeCopy(visibleText);
    for (const string of copyStrings.filter((copy) => !digitalMarketing.why.stats.some(({ value }) => copy === value))) {
      expect(normalizedText).toContain(normalizeCopy(string));
    }

    const footerIsLast = await page.locator('#site-footer').evaluate((footer) => footer.parentElement?.lastElementChild === footer);
    expect(footerIsLast).toBeTruthy();
    expect(browserIssues).toEqual([]);
  });

  test('does not overflow at supported viewport widths', async ({ page }) => {
    await page.goto('/services/digital-marketing', { waitUntil: 'domcontentloaded' });
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: width === 768 ? 1024 : width < 768 ? 844 : 900 });
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
    await expect(page.getByRole('heading', { name: 'Digital Marketing', exact: true })).toBeVisible({ timeout: 30000 });
    await page.locator('html.lenis').waitFor({ state: 'attached', timeout: 30000 });
    await page.getByRole('button', { name: 'Explore Service', exact: true }).first().click({ timeout: 30000 });
    await expect(page).toHaveURL(/\/services\/digital-marketing$/);
  });
});

test.describe('Website Development service page', () => {
  test('renders the requested copy, reused sections, metadata and structure', async ({ page }) => {
    const browserIssues: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error' || message.type() === 'warning') browserIssues.push(message.text());
    });
    page.on('pageerror', (error) => browserIssues.push(error.message));

    await page.goto('/services/website-development', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('main h1')).toHaveCount(1);
    await expect(page).toHaveTitle('Website Development | LeadsGrow');
    const text = normalizeCopy(await page.locator('main').innerText());
    const required = [
      websiteDevelopment.hero.eyebrow, websiteDevelopment.hero.title, websiteDevelopment.hero.text,
      websiteDevelopment.why.eyebrow, websiteDevelopment.why.title, websiteDevelopment.why.text,
      ...websiteDevelopment.why.benefits,
      websiteDevelopment.services.eyebrow, websiteDevelopment.services.title, websiteDevelopment.services.text,
      ...websiteDevelopment.services.items,
      ...websiteDevelopment.services.items.map((_, index) => String(index + 1).padStart(2, '0')),
      websiteDevelopment.process.eyebrow, websiteDevelopment.process.title, websiteDevelopment.process.text,
      ...websiteDevelopment.process.steps.flatMap(({ title, text: stepText }) => [title, stepText]),
    ];
    required.forEach((copy) => expect(text).toContain(normalizeCopy(copy)));

    await expect(page.locator('#tech-stack')).toHaveCount(1);
    await expect(page.locator('#stats')).toHaveCount(1);
    await expect(page.locator('#about-story-title')).toHaveCount(1);
    const sectionOrder = await page.locator('main > section').evaluateAll((sections) => sections.map((section) => section.id || section.getAttribute('aria-labelledby') || section.getAttribute('aria-label')));
    expect(sectionOrder).toEqual(['website-hero-title', 'website-why-title', 'website-services-title', 'website-process-title', 'tech-stack', 'about-story-title', 'stats']);

    const allowed = [
      ...required,
      aboutContent.story.eyebrow, aboutContent.story.title, ...aboutContent.story.paragraphs,
      'Engineered For Growth', 'Modern Frameworks &', 'Digital Ecosystems.',
      'The battle-tested platforms, high-speed cloud infrastructure, and smart automation driving your business forward.',
      ...techTabs.map(({ label }) => label), ...Object.values(techStackData).flat().map(({ name }) => name),
      'Proven Track Record', 'You Believe.', 'We Achieve.',
      'Measurable growth architecture that transforms ambitious vision into market-dominating numbers.',
      '0',
      ...statsData.flatMap(({ value, suffix, label, description }) => [String(value), suffix, label, description]),
    ];
    const visibleText = await page.locator('main').evaluate((main) => {
      const clone = main.cloneNode(true) as HTMLElement;
      clone.querySelectorAll('[aria-hidden="true"], script, style, [data-counter-overlay]').forEach((element) => element.remove());
      clone.querySelectorAll('[data-final-value]').forEach((element) => element.remove());
      const walker = document.createTreeWalker(clone, NodeFilter.SHOW_TEXT);
      const nodes: string[] = [];
      while (walker.nextNode()) nodes.push(walker.currentNode.textContent ?? '');
      return nodes.join(' ');
    });
    const visibleWords = normalizeCopy(visibleText).match(/[\p{L}\p{N}]+(?:['-][\p{L}\p{N}]+)*/gu) ?? [];
    const allowedWords = new Set((normalizeCopy(allowed.join(' ')).match(/[\p{L}\p{N}]+(?:['-][\p{L}\p{N}]+)*/gu) ?? []).map((word) => word.toLowerCase()));
    visibleWords.forEach((word) => {
      const key = word.toLowerCase();
      expect(allowedWords.has(key), `Unexpected visible word: ${word}`).toBeTruthy();
    });
    expect(browserIssues).toEqual([]);
  });

  test('does not overflow at supported viewport widths', async ({ page }) => {
    await page.goto('/services/website-development', { waitUntil: 'domcontentloaded' });
    for (const width of [320, 360, 390, 768, 1024, 1280, 1440, 1920, 2560]) {
      await page.setViewportSize({ width, height: width < 768 ? 844 : 900 });
      await page.waitForTimeout(100);
      const widths = await page.evaluate(() => ({ viewport: window.innerWidth, content: document.documentElement.scrollWidth }));
      expect(widths.content, `Horizontal overflow at ${width}px`).toBeLessThanOrEqual(widths.viewport);
    }
  });

  test('opens the Website Development landing page from its service card', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: 'Website Development', exact: true })).toBeVisible({ timeout: 30000 });
    await page.locator('html.lenis').waitFor({ state: 'attached', timeout: 30000 });
    await page.getByRole('button', { name: 'Explore Service', exact: true }).nth(1).click({ timeout: 30000 });
    await expect(page).toHaveURL(/\/services\/website-development$/);
  });
});
