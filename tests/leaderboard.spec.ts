import { test } from '@playwright/test';

test.use({
  storageState: 'tests/playwright-auth-sessions/john-auth.json',
});

test('test', async ({ page }) => {
  await page.goto('/leaderboard');
  await page.getByRole('button', { name: 'Best Score' }).click();
  await page.getByRole('button', { name: 'Average Performance' }).click();
  await page.getByRole('button', { name: 'Average Performance' }).click();
  await page.getByRole('button', { name: 'Accuracy' }).click();
  await page.getByRole('button', { name: 'Accuracy' }).click();
  await page.getByRole('button', { name: 'Best Score' }).click();
  await page.getByRole('button', { name: 'All Time' }).click();
  await page.getByRole('button', { name: 'Past Week' }).click();
  await page.getByRole('button', { name: 'Past Week' }).click();
  await page.getByRole('button', { name: 'Past Month' }).click();
  await page.getByRole('button', { name: 'Past Month' }).click();
  await page.getByRole('button', { name: 'All Time' }).click();
  await page.getByText('🥇AdminScore:').click();
  await page.getByText('🥈JohnScore:').click();
  await page.getByText('Best ScoreBest ScoreAverage PerformanceAccuracyAll TimeAll TimePast WeekPast').click();
  await page.locator('div').filter({ hasText: 'Best ScoreBest ScoreAverage' }).first().click();
});
