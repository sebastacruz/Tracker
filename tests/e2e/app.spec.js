import { test, expect, devices } from '@playwright/test'

test.describe('Substance Usage Tracker - App Loading', () => {
  test('should load the application', async ({ page }) => {
    await page.goto('/')

    // Wait for app to load
    await page.waitForLoadState('networkidle')

    // Check that the main content is visible
    const appElement = page.locator('[role="application"]').or(page.locator('body'))
    await expect(appElement).toBeVisible()
  })

  test('should display the navbar', async ({ page }) => {
    await page.goto('/')

    // Check for navigation elements (adjust selector based on actual markup)
    const navbar = page.locator('nav').or(page.locator('[class*="nav"]').first())
    await expect(navbar).toBeVisible()
  })

  test('should have correct title', async ({ page }) => {
    await page.goto('/')

    await expect(page).toHaveTitle('Dab Tracker')
  })
})

test.describe('Navigation - Placeholder Tests', () => {
  test.skip('should handle swipe navigation (placeholder)', async ({ page }) => {
    // TODO: Implement swipe gesture tests for navigation
    // This will test swiping between different views/tabs
  })

  test.skip('should navigate between views (placeholder)', async ({ page }) => {
    // TODO: Implement navigation between different app views
    // (QuickEntry, Dashboard, History, SubstanceManager, Settings)
  })
})
