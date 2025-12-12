import { test } from '@playwright/test';

test.use({
  storageState: 'tests/playwright-auth-sessions/session-admin@foo.com.json',
});

test('Test Filters', async ({ page }) => {
  await page.goto('http://localhost:3000/leaderboard');
  await page.getByRole('button', { name: 'Best Score' }).click();
  await page.locator('a').filter({ hasText: 'Best Score' }).click();
  await page.getByRole('button', { name: 'Best Score' }).click();
  await page.getByRole('button', { name: 'Best Average' }).click();
  await page.getByRole('button', { name: 'All Time' }).click();
  await page.locator('a').filter({ hasText: 'All Time' }).click();
  await page.getByRole('button', { name: 'All Time' }).click();
  await page.getByRole('button', { name: 'Past Week' }).click();
  await page.getByRole('button', { name: 'Past Week' }).click();
  await page.getByRole('button', { name: 'Past Month' }).click();
});
