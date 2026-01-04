import { test, expect } from '@playwright/test'

/**
 * Visual tests for UI design review
 * Captures screenshots for each main view
 */
test.describe('Visual Design Review', () => {
  test('capture Quick Entry page', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Wait for content to render
    await page.waitForTimeout(500)

    await page.screenshot({
      path: 'test-results/screenshots/quick-entry.png',
      fullPage: true
    })
  })

  test('capture page indicators', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Take a screenshot focusing on the bottom navigation
    const indicator = page.locator('.fixed.bottom-0')
    if (await indicator.isVisible()) {
      await indicator.screenshot({
        path: 'test-results/screenshots/page-indicators.png'
      })
    }
  })

  test('verify swipe container exists', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Check that swipe container is present
    const swipeContainer = page.locator('.swipe-container')
    await expect(swipeContainer).toBeVisible()

    // Check that multiple pages exist
    const pages = page.locator('.swipe-page')
    const pageCount = await pages.count()
    expect(pageCount).toBe(4) // Entry, Dashboard, History, Flavors
  })

  test('verify navbar is minimal', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Check navbar structure
    const navbar = page.locator('nav')
    await expect(navbar).toBeVisible()

    // Should have Tracker title
    const title = navbar.locator('h1')
    await expect(title).toContainText('Tracker')

    // Should have settings button
    const settingsBtn = navbar.locator('button')
    await expect(settingsBtn).toBeVisible()

    await navbar.screenshot({
      path: 'test-results/screenshots/navbar.png'
    })
  })

  test('settings page accessible via gear icon', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Click settings gear
    const settingsBtn = page.locator('nav button').first()
    await settingsBtn.click()

    // Verify settings page appears
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Export Data' })).toBeVisible()

    await page.screenshot({
      path: 'test-results/screenshots/settings.png',
      fullPage: true
    })
  })
})
