import { test } from '@playwright/test';

test.use({
  storageState: 'tests/playwright-auth-sessions/session-admin@foo.com.json',
});

test('Submission page loads and map responds', async ({ page }) => {
  test.setTimeout(120000);

  await page.goto('http://localhost:3000/submission', { waitUntil: 'networkidle' });

  await page.getByRole('button', { name: 'Choose File' }).click();
  await page.getByRole('textbox', { name: 'Hint...' }).click();
});
