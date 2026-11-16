import { expect, test, type Page } from '@playwright/test'

async function assertNoHorizontalOverflow(page: Page) {
  const overflowed = await page.evaluate(
    'document.documentElement.scrollWidth > document.documentElement.clientWidth + 1',
  )
  expect(overflowed).toBe(false)
}

async function collectConsoleErrors(page: Page) {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(message.text())
    }
  })
  return errors
}

test('landing page smoke test', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { level: 1, name: 'The Evidence Room' })).toBeVisible()
  await expect(
    page.getByText(/not affiliated with or endorsed by RedHanded/i),
  ).toBeVisible()
  await expect(page.getByRole('link', { name: 'Start investigation' })).toBeVisible()
})

test('m2 cinematic flow across required viewports', async ({ page }) => {
  const errors = await collectConsoleErrors(page)
  const viewports = [
    { width: 1440, height: 900, label: 'desktop' },
    { width: 390, height: 844, label: 'mobile' },
  ] as const

  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height })
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'The Evidence Room' })).toBeVisible()
    await assertNoHorizontalOverflow(page)

    await page.getByRole('link', { name: 'Start investigation' }).click()
    await expect(page.getByRole('heading', { name: 'Select a case' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'The Empty Locker' })).toBeVisible()
    await expect(page.getByText('Coming soon')).toBeVisible()
    await assertNoHorizontalOverflow(page)

    await page.getByRole('link', { name: 'Open case file' }).click()
    await expect(page.getByRole('heading', { name: 'The Empty Locker' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Enter investigation' })).toBeVisible()
    await assertNoHorizontalOverflow(page)

    await page.getByRole('link', { name: 'Enter investigation' }).click()
    await expect(page.getByText(/Shell layout only/i)).toBeVisible()
    await assertNoHorizontalOverflow(page)

    await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Settings' }).click()
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Reset progress' })).toBeDisabled()
    await assertNoHorizontalOverflow(page)

    await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Credits' }).click()
    await expect(page.getByRole('heading', { name: 'Credits' })).toBeVisible()
    await assertNoHorizontalOverflow(page)
  }

  await page.setViewportSize({ width: 320, height: 720 })
  for (const path of ['/', '/cases', '/cases/CASE_FIX_001/intro', '/cases/CASE_FIX_001/investigate', '/settings', '/credits']) {
    await page.goto(path)
    await assertNoHorizontalOverflow(page)
  }

  expect(errors, `console errors: ${errors.join(' | ')}`).toEqual([])
})

test('keyboard focus, text size, and reduced motion preferences', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')

  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.locator('#main-content')).toBeFocused()

  await page.getByRole('link', { name: 'Start investigation' }).focus()
  await expect(page.getByRole('link', { name: 'Start investigation' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('heading', { name: 'Select a case' })).toBeVisible()
  await expect(page.locator('#main-content')).toBeFocused()

  await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Settings' }).click()
  await page.getByRole('button', { name: 'Large' }).click()
  await expect
    .poll(async () => page.locator('html').getAttribute('data-text-size'))
    .toBe('large')

  await expect(page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Cases' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Large' })).toBeVisible()
  await assertNoHorizontalOverflow(page)

  await page.getByRole('checkbox', { name: /Reduce motion/i }).check()
  await expect
    .poll(async () => page.locator('html').getAttribute('data-reduced-motion'))
    .toBe('true')

  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/cases/CASE_FIX_001/intro')
  await expect(page.getByRole('link', { name: 'Enter investigation' })).toBeVisible()
  await assertNoHorizontalOverflow(page)
})
