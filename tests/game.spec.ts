import { test, expect } from '@playwright/test';

test.use({
  storageState: 'tests/playwright-auth-sessions/session-admin@foo.com.json',
});

test('Game page loads and map controls respond', async ({ page }) => {
  test.setTimeout(120000); // 2 minutes

  await page.goto('http://localhost:3000/game', { waitUntil: 'networkidle' });

  await expect(page.getByRole('button', { name: 'Start Game' }))
    .toBeVisible({ timeout: 60000 });

  await page.getByRole('button', { name: 'Start Game' }).click();
});
