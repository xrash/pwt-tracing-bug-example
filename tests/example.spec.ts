import { Page } from 'playwright'
import { test as base, expect } from '@playwright/test'

const test = base.extend<{}, {
  playwrightPage: Page
}>({
  playwrightPage: [async ({ browser }, use) => {
    const ctx = await browser.newContext()

    const playwrightPage = await ctx.newPage()
    await playwrightPage.goto('https://playwright.dev/')

    await ctx.tracing.start({
      snapshots: true,
      screenshots: true,
      name: 'example',
    })

    await use(playwrightPage)

    await ctx.tracing.stop({
      path: '/tmp/trace-example.zip',
    })

    await playwrightPage.close()
    await ctx.close()

  }, { scope: 'worker', auto: true }],
})

test('A', async ({ playwrightPage }) => {
  await playwrightPage.waitForTimeout(1000)
})

test('B', async ({ playwrightPage }) => {
  await playwrightPage.waitForTimeout(1000)
  const title = playwrightPage.locator('.navbar__inner .navbar__title')
  await expect(title).toHaveText('Playwright')
})
