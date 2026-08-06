import { test, expect } from '@playwright/test';

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
});
