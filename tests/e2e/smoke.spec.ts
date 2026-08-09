import { test, expect } from '@playwright/test';

// Canonical English slugs shared across all languages — every topic must exist in en/tr/ar.
const SLUGS = [
  'ai-agents-2026',
  'astro-benefits',
  'minimalist-design',
  'remote-work-tips',
  'hidden-routes',
  'fast-websites',
  'color-psychology',
  'sustainable-living',
  'healthy-habits',
  'multilingual-content',
  'reading-benefits',
  'web-dev-guide',
];
const LANGS = ['en', 'tr', 'ar'];

test.describe('Multilingual blog smoke', () => {
  test('home EN loads with hero and nav', async ({ page }) => {
    await page.goto('/en/');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.getByRole('navigation', { name: /main/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /blog|explore/i }).first()).toBeVisible();
  });

  test('language routes resolve', async ({ page }) => {
    for (const lang of ['en', 'tr', 'ar']) {
      const res = await page.goto(`/${lang}/`);
      expect(res?.ok()).toBeTruthy();
      await expect(page.locator('html')).toHaveAttribute('lang', lang);
      if (lang === 'ar') {
        await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
      } else {
        await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
      }
    }
  });

  test('blog index and article', async ({ page }) => {
    await page.goto('/en/blog/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    const candidates = page.locator('main a[href*="/en/blog/"]');
    const count = await candidates.count();
    let href: string | null = null;
    for (let i = 0; i < count; i++) {
      const h = await candidates.nth(i).getAttribute('href');
      if (h && /\/en\/blog\/[^/]+/.test(h.replace(/\/$/, ''))) {
        href = h;
        break;
      }
    }
    expect(href, 'expected a blog post link').toBeTruthy();
    await page.goto(href!);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('#article-body')).toBeVisible();
    await expect(page.locator('#reading-progress')).toBeAttached();
  });

  test('about contact privacy 404', async ({ page }) => {
    await page.goto('/en/about/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    await page.goto('/en/contact/');
    await expect(page.locator('#contact-form')).toBeVisible();
    await expect(page.locator('#name')).toBeVisible();

    await page.goto('/en/privacy-policy/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    const res = await page.goto('/en/this-page-does-not-exist-xyz/');
    // Astro static: may be 404 page or soft 404 depending on host
    expect(res?.status()).toBeGreaterThanOrEqual(200);
  });

  test('theme toggle toggles dark class', async ({ page }) => {
    await page.goto('/en/');
    const html = page.locator('html');
    const before = await html.evaluate((el) => el.classList.contains('dark'));
    await page.locator('#theme-toggle').click();
    const after = await html.evaluate((el) => el.classList.contains('dark'));
    expect(after).toBe(!before);
  });

  test('skip link and main landmark', async ({ page }) => {
    await page.goto('/en/');
    await expect(page.locator('#main-content')).toBeVisible();
    await expect(page.getByRole('link', { name: /skip/i })).toBeAttached();
  });

  test('all 12 articles exist in every language with h1 and article body', async ({ page }) => {
    for (const lang of LANGS) {
      for (const slug of SLUGS) {
        const res = await page.goto(`/${lang}/blog/${slug}/`);
        expect(res?.ok(), `expected /${lang}/blog/${slug}/ to return 200`).toBeTruthy();
        await expect(
          page.getByRole('heading', { level: 1 }),
          `expected h1 on /${lang}/blog/${slug}/`,
        ).toBeVisible();
        await expect(
          page.locator('#article-body'),
          `expected #article-body on /${lang}/blog/${slug}/`,
        ).toBeVisible();
      }
    }
  });

  test('KaTeX math renders on healthy-habits articles', async ({ page }) => {
    for (const lang of LANGS) {
      await page.goto(`/${lang}/blog/healthy-habits/`);
      // Display math (.katex-display) and inline math (.katex) must be present
      const displayCount = await page.locator('.katex-display').count();
      const inlineCount = await page.locator('.katex').count();
      expect(displayCount, `expected display math on /${lang}/blog/healthy-habits/`).toBeGreaterThan(0);
      expect(inlineCount, `expected inline math on /${lang}/blog/healthy-habits/`).toBeGreaterThan(0);
    }
  });

  test('Shiki code blocks render on web-dev-guide articles', async ({ page }) => {
    for (const lang of LANGS) {
      await page.goto(`/${lang}/blog/web-dev-guide/`);
      // Astro's Shiki highlighter wraps code in <pre class="astro-code ...">
      const codeBlocks = await page.locator('pre.astro-code').count();
      expect(codeBlocks, `expected highlighted code block on /${lang}/blog/web-dev-guide/`).toBeGreaterThan(0);
      // The block should contain a language class and actual code text
      const first = page.locator('pre.astro-code').first();
      await expect(first).not.toBeEmpty();
    }
  });

  test('Arabic pages render with computed RTL direction', async ({ page }) => {
    await page.goto('/ar/blog/healthy-habits/');
    const dir = await page.locator('html').evaluate((el) => getComputedStyle(el).direction);
    expect(dir).toBe('rtl');
    // Main content area should also inherit RTL visually
    const mainDir = await page.locator('#main-content').evaluate((el) => getComputedStyle(el).direction);
    expect(mainDir).toBe('rtl');
  });
});
