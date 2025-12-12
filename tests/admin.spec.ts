import { test, expect } from '@playwright/test';

test.use({
  storageState: 'tests/playwright-auth-sessions/session-admin@foo.com.json',
});

test('test', async ({ page }) => {
  test.setTimeout(120000); // Increase timeout

  await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle' });

  await expect(page.getByRole('heading', { name: 'Admin Dashboard' }))
    .toBeVisible({ timeout: 60000 });

  await page.getByRole('cell', { name: 'admin@foo.com' }).first().click();
  await page.getByRole('cell', { name: 'Admin', exact: true }).click();
  await page.getByRole('cell', { name: 'ADMIN', exact: true }).click();
  await page.locator('tr:nth-child(31) > td:nth-child(3)').click();
  await page.getByRole('img', { name: 'The main library at UH Mānoa' }).click();
});
