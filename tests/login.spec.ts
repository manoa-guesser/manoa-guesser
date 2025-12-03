import { test } from '@playwright/test';

test.use({
  storageState: 'tests/playwright-auth-sessions/john-auth.json',
});

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'Sign in' }).click();
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByRole('link', { name: 'Sign up' }).click();
  await page.locator('input[name="email"]').click();
  await page.locator('input[name="email"]').fill('admin@foo.com');
  await page.getByRole('button', { name: 'Reset' }).click();
  await page.getByRole('button', { name: 'Register' }).click();
  await page.getByRole('link', { name: 'Sign in' }).click();
});
