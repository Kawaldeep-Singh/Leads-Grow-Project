import { expect, test } from 'playwright/test';
import { digitalMarketing } from '../data/servicePages/digital-marketing';
import { industriesData } from '../data/industries';
import { websiteDevelopment } from '../data/servicePages/website-development';
import { techStackData, techTabs } from '../data/techStack';
import { statsData } from '../data/stats';
import { aboutContent } from '../data/about';
import { appDevelopment } from '../data/servicePages/app-development';
import { performanceMarketing } from '../data/servicePages/performance-marketing';

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
    for (const string of copyStrings.filter((copy) => copy !== digitalMarketing.hero.title && !digitalMarketing.why.stats.some(({ value }) => copy === value))) {
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
      'Home', 'Service',
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

test.describe('App Development service page', () => {
  test('renders the exact brief copy, sub-labels, reused sections and metadata', async ({ page }) => {
    const browserIssues: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error' || message.type() === 'warning') browserIssues.push(message.text());
    });
    page.on('pageerror', (error) => browserIssues.push(error.message));

    await page.goto('/services/app-development', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle('App Development | LeadsGrow');
    await expect(page.locator('main h1')).toHaveCount(1);
    await expect(page.locator('#app-services-title')).toHaveText(appDevelopment.services.title);

    const required = [
      appDevelopment.hero.eyebrow, appDevelopment.hero.title, appDevelopment.hero.text,
      appDevelopment.why.title, appDevelopment.why.text, appDevelopment.why.subLabel,
      ...appDevelopment.why.benefits,
      appDevelopment.services.eyebrow, appDevelopment.services.title, appDevelopment.services.text,
      appDevelopment.services.servicesSubLabel, appDevelopment.services.featuresSubLabel,
      ...appDevelopment.services.items, ...appDevelopment.services.features,
      appDevelopment.process.eyebrow, appDevelopment.process.title, appDevelopment.process.text, appDevelopment.process.subLabel,
      ...appDevelopment.process.steps.flatMap(({ title, text }) => [title, text]),
      appDevelopment.whyChoose.eyebrow, appDevelopment.whyChoose.title, ...appDevelopment.whyChoose.points,
      appDevelopment.industries.title,
    ];
    const text = normalizeCopy(await page.locator('main').innerText());
    required.forEach((copy) => expect(text).toContain(normalizeCopy(copy)));
    expect(text.split(normalizeCopy('Scalable App Architecture')).length - 1).toBe(2);
    for (const label of ['Key Benefits', 'Services to Showcase', 'Features to Highlight', 'Our 6-Step Process']) {
      await expect(page.locator('main').getByText(label, { exact: true })).toBeVisible();
    }

    const permitted = [
      ...required,
      ...industriesData.map(({ name }) => name),
      ...industriesData.flatMap(({ benefit, statBadge }) => [benefit, statBadge]),
      'Industries', 'We Serve.', 'Domain-specific growth funnels optimized for high ticket and high volume conversion.', 'Explore Playbook',
      'Proven Track Record', 'You Believe.', 'We Achieve.',
      'Measurable growth architecture that transforms ambitious vision into market-dominating numbers.', '0',
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
    const allowedWords = new Set((normalizeCopy(permitted.join(' ')).match(/[\p{L}\p{N}]+(?:['-][\p{L}\p{N}]+)*/gu) ?? []).map((word) => word.toLowerCase()));
    visibleWords.forEach((word) => expect(allowedWords.has(word.toLowerCase()), `Unexpected visible word: ${word}`).toBeTruthy());

    await expect(page.locator('[role="region"][aria-roledescription="carousel"]')).toHaveCount(1);
    await expect(page.locator('[aria-label="Previous"]')).toHaveCount(1);
    await expect(page.locator('[aria-label="Next"]')).toHaveCount(1);
    await expect(page.locator('#stats')).toHaveCount(1);
    await expect(page.locator('#site-footer')).toHaveCount(1);
    await expect(page.locator('main h2')).toHaveCount(6);
    expect(browserIssues).toEqual([]);
  });

  test('fits phone, tablet and desktop widths without page overflow', async ({ page }) => {
    await page.goto('/services/app-development', { waitUntil: 'domcontentloaded' });
    for (const width of [320, 360, 390, 768, 1024, 1280, 1440, 1920, 2560]) {
      await page.setViewportSize({ width, height: width < 768 ? 844 : 900 });
      await page.waitForTimeout(120);
      const widths = await page.evaluate(() => ({ viewport: window.innerWidth, content: document.documentElement.scrollWidth }));
      expect(widths.content, `Horizontal overflow at ${width}px`).toBeLessThanOrEqual(widths.viewport);
    }
  });

  test('uses static hero and process layouts for reduced motion', async ({ page }) => {
    const browserIssues: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error' || message.type() === 'warning') browserIssues.push(message.text());
    });
    page.on('pageerror', (error) => browserIssues.push(error.message));
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/services/app-development', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-app-build-stage="final"]')).toBeVisible();
    const process = page.locator('section[aria-labelledby="app-process-title"]');
    await expect(process.locator('ol')).toHaveClass(/flex-col/);
    const trackPosition = await process.locator(':scope > div:last-child > div').evaluate((element) => getComputedStyle(element).position);
    expect(trackPosition).toBe('static');
    expect(browserIssues).toEqual([]);
  });

  test('opens from its service card and sets the Services active state', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.locator('html.lenis').waitFor({ state: 'attached', timeout: 30000 });
    await page.getByRole('button', { name: 'Explore Service', exact: true }).nth(2).click({ timeout: 30000 });
    await expect(page).toHaveURL(/\/services\/app-development$/);
    await expect(page.getByRole('link', { name: 'Services', exact: true })).toHaveAttribute('aria-current', 'page');
  });
});

test.describe('Performance Marketing service page', () => {
  test('renders the exact content, SEO metadata, reused sections and one heading', async ({ page }) => {
    const browserIssues: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error' || message.type() === 'warning') browserIssues.push(message.text());
    });
    page.on('pageerror', (error) => browserIssues.push(error.message));
    await page.goto('/services/performance-marketing', { waitUntil: 'domcontentloaded' });
    const normalize = (value: string) => value.replace(/[’]/g, "'").replace(/\s+/g, ' ').trim();
    await expect(page).toHaveTitle('Performance Marketing | LeadsGrow');
    await expect(page.locator('main h1')).toHaveCount(1);
    expect(normalize(await page.locator('main h1').innerText())).toBe(normalize(performanceMarketing.hero.title));

    const expected = [
      performanceMarketing.hero.eyebrow, performanceMarketing.hero.text,
      performanceMarketing.why.title, performanceMarketing.why.text, performanceMarketing.why.label,
      ...performanceMarketing.why.points,
      performanceMarketing.approach.eyebrow, performanceMarketing.approach.title, performanceMarketing.approach.text,
      ...performanceMarketing.approach.points,
      performanceMarketing.whatWeDo.eyebrow, performanceMarketing.whatWeDo.title, performanceMarketing.whatWeDo.text,
      ...performanceMarketing.whatWeDo.items.flatMap(({ title, text }) => [title, text]),
      performanceMarketing.platforms.eyebrow, performanceMarketing.platforms.title, performanceMarketing.platforms.text,
      ...performanceMarketing.platforms.items,
      'Industries We Serve', ...industriesData.map(({ name }) => name),
      'Leads Grow was built with a simple idea: businesses need more than just marketing; they need the right strategy, creative thinking and consistent execution to grow.',
      'We bring together different marketing capabilities, from traditional advertising to modern digital solutions, making it easier for businesses to manage their marketing needs through one growth partner.',
      'Our focus is simple: understand every business, create the right strategy and deliver solutions that make a difference.',
    ];
    const visible = normalize(await page.locator('main').evaluate((main) => {
      const copy = main.cloneNode(true) as HTMLElement;
      copy.querySelectorAll('[aria-hidden="true"], script, style').forEach((node) => node.remove());
      return copy.innerText;
    }));
    expected.forEach((copy) => expect(visible).toContain(normalize(copy)));
    await expect(page.locator('main section[aria-labelledby]')).toHaveCount(6);
    await expect(page.locator('main #industries')).toHaveCount(1);
    await expect(page.locator('#site-footer')).toHaveCount(1);
    expect(browserIssues).toEqual([]);
  });

  test('keeps the Services nav active and avoids horizontal overflow', async ({ page }) => {
    await page.goto('/services/performance-marketing', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('link', { name: 'Services', exact: true })).toHaveAttribute('aria-current', 'page');
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: width < 768 ? 844 : 900 });
      await page.waitForTimeout(120);
      const widths = await page.evaluate(() => ({ viewport: window.innerWidth, content: document.documentElement.scrollWidth }));
      expect(widths.content, `Horizontal overflow at ${width}px`).toBeLessThanOrEqual(widths.viewport);
    }
  });
});
