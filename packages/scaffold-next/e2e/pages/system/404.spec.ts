import systemJsonEn from '@kzfoo/i18n/locales/en/system.json';
import systemJsonUk from '@kzfoo/i18n/locales/en_GB/system.json';
import { test, expect } from '@playwright/test';

const pageSlug = 'this-page-does-not-exist';

test.describe('404 not found page', () => {
  test('should have the title in english by default', async ({ page }) => {
    await page.goto(`/${pageSlug}`);
    const title = await page.title();
    expect(title).toBe(systemJsonEn.notFound.title);
  });
  test('should have the title in french', async ({ page }) => {
    await page.goto(`/en_GB/${pageSlug}`);
    const title = await page.title();
    expect(title).toBe(systemJsonUk.notFound.title);
  });
});
