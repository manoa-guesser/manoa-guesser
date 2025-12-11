import { test } from '@playwright/test';

test.use({
  storageState: 'tests/playwright-auth-sessions/john-auth.json',
});

test('Leaderboard filters work', async ({ page }) => {
  await page.goto('/leaderboard');

  // Click each filter once
  await page.getByRole('button', { name: 'Best Score' }).click();
  await page.getByRole('button', { name: 'All Time' }).click();
  await page.getByRole('button', { name: 'Past Week' }).click();
});
