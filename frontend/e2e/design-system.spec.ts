import { expect, test } from '@playwright/test';

test.describe('design system showpage', () => {
  test('allows anonymous access to /design-system', async ({ page }) => {
    await page.goto('/design-system');
    await expect(page.getByRole('heading', { name: 'Showpage Review v1' })).toBeVisible();
  });

  test('renders all six sections', async ({ page }) => {
    await page.goto('/design-system');

    await expect(page.getByRole('heading', { name: 'Foundation' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Typography' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Motion Lab' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Component States' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Patterns' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Readiness Matrix' })).toBeVisible();
  });

  test('supports keyboard tab traversal', async ({ page }) => {
    await page.goto('/design-system');

    await page.keyboard.press('Tab');
    const activeTag = await page.evaluate(() => document.activeElement?.tagName ?? '');
    expect(activeTag).not.toBe('BODY');
  });

  test('keeps layout readable on mobile viewport', async ({ page }) => {
    await page.goto('/design-system');

    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });

    expect(hasHorizontalOverflow).toBeFalsy();
  });

  test('toggles reduced motion simulation', async ({ page }) => {
    await page.goto('/design-system');

    await expect(page.getByTestId('reduced-motion-status')).toContainText('Off');
    await page.getByLabel('Toggle reduced motion').check({ force: true });
    await expect(page.getByTestId('reduced-motion-status')).toContainText('On');
    await expect(page.getByTestId('motion-sample-micro')).toHaveAttribute('data-reduced-motion', 'true');
  });
});
