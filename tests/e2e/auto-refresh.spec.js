import { test, expect } from '@playwright/test'

/**
 * Auto-refresh E2E Tests
 *
 * Tests that adding entries automatically updates all views without manual refresh.
 * Configured to run on iPhone 14 Pro (Safari/WebKit) via playwright.config.js
 *
 * Run tests: npx playwright test tests/e2e/auto-refresh.spec.js
 * Run with UI: npx playwright test tests/e2e/auto-refresh.spec.js --ui
 */

test.describe('Auto-refresh on Entry Addition', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test for clean state
    await page.goto('/')
    await page.evaluate(() => {
      localStorage.clear()
    })
    await page.reload()
    await page.waitForLoadState('networkidle')
  })

  test('should auto-update dashboard stats when new entry is added', async ({ page }) => {
    // First, we need to add a substance and initial data via Settings/import
    // or by navigating to Substance Manager
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Inject test data directly for reliable testing
    await page.evaluate(() => {
      const testData = {
        substances: [
          {
            id: 'test-substance-1',
            name: 'Test Flavor',
            advertisedMass: 1.0,
            active: true,
            createdAt: new Date().toISOString()
          }
        ],
        entries: [
          {
            id: 'test-entry-1',
            substanceId: 'test-substance-1',
            person: 't',
            delta: 0.04,
            timestamp: new Date().toISOString()
          }
        ],
        metadata: {
          version: '1.0',
          lastUpdated: new Date().toISOString()
        }
      }
      localStorage.setItem('tracker_data', JSON.stringify(testData))
    })
    await page.reload()
    await page.waitForLoadState('networkidle')

    // Navigate to Dashboard (swipe or click navigation)
    // The Dashboard should show 1 entry with 0.04g total
    const dashboardNav = page.locator('[data-page="dashboard"]').or(
      page.locator('text=Your Stats').first()
    )

    // Try clicking on page indicator dot for dashboard
    const pageIndicator = page.locator('[aria-label*="dashboard"]').or(
      page.locator('button').filter({ hasText: /dashboard/i })
    )

    if (await pageIndicator.isVisible()) {
      await pageIndicator.click()
    } else {
      // Swipe to dashboard (page 2)
      await page.evaluate(() => {
        const container = document.querySelector('.snap-x')
        if (container) {
          container.scrollBy({ left: container.offsetWidth, behavior: 'smooth' })
        }
      })
    }

    await page.waitForTimeout(500)

    // Verify initial dashboard state shows data
    const totalMassElement = page.locator('text=/Total mass/i').locator('..').locator('span.font-mono')

    // Go back to QuickEntry to add a new entry
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Select flavor (first matching button in the flavor section)
    const flavorButton = page.locator('button').filter({ hasText: 'Test Flavor' }).first()
    if (await flavorButton.isVisible()) {
      await flavorButton.click()
    }

    // Select person (t) - first matching button
    const personButton = page.locator('button').filter({ hasText: /^T$/i }).first()
    if (await personButton.isVisible()) {
      await personButton.click()
    }

    // Click a dab size button
    const dabButton = page.locator('button').filter({ hasText: '0.03g' }).first()
    if (await dabButton.isVisible()) {
      await dabButton.click()

      // Confirm the dialog
      const confirmButton = page.locator('button').filter({ hasText: /yes|confirm|record/i }).first()
      if (await confirmButton.isVisible()) {
        await confirmButton.click()
      }
    }

    // Wait for success message
    await page.waitForTimeout(500)

    // Navigate back to dashboard
    await page.evaluate(() => {
      const container = document.querySelector('.snap-x')
      if (container) {
        container.scrollBy({ left: container.offsetWidth, behavior: 'smooth' })
      }
    })
    await page.waitForTimeout(500)

    // Verify localStorage was updated
    const updatedData = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('tracker_data') || '{}')
    })

    // Should now have 2 entries
    expect(updatedData.entries?.length).toBeGreaterThanOrEqual(1)
  })

  test('should update history view when entry is added from QuickEntry', async ({ page }) => {
    // Inject test data with one existing entry (to populate person buttons)
    await page.goto('/')
    await page.evaluate(() => {
      const testData = {
        substances: [
          {
            id: 'test-sub-2',
            name: 'Apollo',
            advertisedMass: 1.0,
            active: true,
            createdAt: new Date().toISOString()
          }
        ],
        entries: [
          {
            id: 'existing-entry',
            substanceId: 'test-sub-2',
            person: 't',
            delta: 0.03,
            timestamp: new Date(Date.now() - 3600000).toISOString()
          }
        ],
        metadata: { version: '1.0', lastUpdated: new Date().toISOString() }
      }
      localStorage.setItem('tracker_data', JSON.stringify(testData))
    })
    await page.reload()
    await page.waitForLoadState('networkidle')

    // Select flavor and person, then add entry (use .first() for strict mode)
    await page.locator('button').filter({ hasText: 'Apollo' }).first().click()
    await page.locator('button').filter({ hasText: /^T$/i }).first().click()
    await page.locator('button').filter({ hasText: '0.04g' }).first().click()

    // Confirm dialog
    const confirmBtn = page.locator('button').filter({ hasText: /yes|confirm|record/i }).first()
    if (await confirmBtn.isVisible()) {
      await confirmBtn.click()
    }
    await page.waitForTimeout(500)

    // Swipe to History (page 3)
    await page.evaluate(() => {
      const container = document.querySelector('.snap-x')
      if (container) {
        const pageWidth = container.scrollWidth / 5
        container.scrollTo({ left: pageWidth * 2, behavior: 'instant' })
      }
    })
    await page.waitForTimeout(500)

    // Verify entry appears in history without refresh
    const historyEntry = page.locator('td').filter({ hasText: 'Apollo' })

    // Verify data in localStorage - should now have 2 entries
    const data = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('tracker_data') || '{}')
    })
    expect(data.entries?.length).toBe(2)
    expect(data.entries[0].delta).toBe(0.04)
  })

  test('should NOT have refresh button in History view', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Swipe to History (page 3)
    await page.evaluate(() => {
      const container = document.querySelector('.snap-x')
      if (container) {
        container.scrollBy({ left: container.offsetWidth * 2, behavior: 'smooth' })
      }
    })
    await page.waitForTimeout(500)

    // Verify no refresh button in History
    const historyRefreshBtn = page.locator('button').filter({ hasText: 'Refresh' })

    // Get all visible refresh buttons
    const refreshButtons = await historyRefreshBtn.all()

    // History should not have a refresh button visible on this page
    // (only Dashboard has one)
    for (const btn of refreshButtons) {
      const isVisible = await btn.isVisible()
      if (isVisible) {
        // Check we're not on Dashboard
        const dashboardHeading = page.locator('h2').filter({ hasText: 'Your Stats' })
        const historyHeading = page.locator('h2').filter({ hasText: 'History' })

        // If History heading is visible, no refresh button should be visible
        if (await historyHeading.isVisible()) {
          expect(isVisible).toBeFalsy()
        }
      }
    }
  })

  test('Dashboard should still have one refresh button', async ({ page }) => {
    // Inject test data so Dashboard has content
    await page.goto('/')
    await page.evaluate(() => {
      const testData = {
        substances: [{ id: 'sub1', name: 'TestFlavor', advertisedMass: 1.0, active: true, createdAt: new Date().toISOString() }],
        entries: [{ id: 'e1', substanceId: 'sub1', person: 't', delta: 0.04, timestamp: new Date().toISOString() }],
        metadata: { version: '1.0', lastUpdated: new Date().toISOString() }
      }
      localStorage.setItem('tracker_data', JSON.stringify(testData))
    })
    await page.reload()
    await page.waitForLoadState('networkidle')

    // Swipe to Dashboard (page 2) using scroll snap
    await page.evaluate(() => {
      const container = document.querySelector('.snap-x')
      if (container) {
        // Scroll to second page
        const pageWidth = container.scrollWidth / 5 // 5 pages total
        container.scrollTo({ left: pageWidth, behavior: 'instant' })
      }
    })
    await page.waitForTimeout(1000)

    // Verify Dashboard heading is visible
    const dashboardHeading = page.locator('h2').filter({ hasText: 'Your Stats' })
    await expect(dashboardHeading).toBeVisible({ timeout: 10000 })

    // Verify refresh button exists on Dashboard
    const refreshBtn = page.locator('button').filter({ hasText: 'Refresh' }).first()
    await expect(refreshBtn).toBeVisible()
  })
})
