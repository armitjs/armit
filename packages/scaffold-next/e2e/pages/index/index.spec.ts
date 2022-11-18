import { test, expect } from '@playwright/test';
import { seo } from '@/config/config-seo';
test.describe('Demo page', () => {
  test('should have the title in english by default', async ({ page }) => {
    await page.goto('/');
    const title = await page.title();
    expect(title).toEqual(expect.stringContaining(seo('en').title || ''));
  });
  test('should have the title in french', async ({ page }) => {
    await page.goto('/en_GB');
    const title = await page.title();
    expect(title).toEqual(expect.stringContaining(seo('en_GB').title || ''));
  });
});
