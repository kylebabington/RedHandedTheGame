import { expect, test } from '@playwright/test'

test('landing page smoke test', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { level: 1, name: 'The Evidence Room' })).toBeVisible()
  await expect(
    page.getByText('An unofficial interactive mystery game concept.'),
  ).toBeVisible()
})
