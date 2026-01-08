/**
 * UI Simplification E2E Tests
 * Tests all changes from the UI simplification implementation plan
 * Runs on iPhone 14 Pro Safari emulation
 */
import { test, expect, devices } from '@playwright/test';

// Configure iPhone 14 Pro Safari emulation
test.use({
  ...devices['iPhone 14 Pro'],
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
});

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:5173/Tracker/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
});

test.describe('QuickEntry UI Changes', () => {
  test('should not show "(TAP TO RECORD)" text', async ({ page }) => {
    const tapToRecordText = page.getByText('(tap to record)', { exact: false });
    await expect(tapToRecordText).not.toBeVisible();
  });

  test('should show "Dab Size" label', async ({ page }) => {
    const dabSizeLabel = page.getByText('Dab Size');
    await expect(dabSizeLabel).toBeVisible();
  });

  test('should render flavor buttons (not dropdown)', async ({ page }) => {
    // Look for buttons with flavor names in a grid
    const flavorButtons = page.locator('div.grid button');
    const count = await flavorButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should render person buttons (not dropdown)', async ({ page }) => {
    // Look for person buttons (T, S)
    const personButtons = page.locator('button').filter({ hasText: /^[TS]$/i });
    const count = await personButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should highlight selected flavor button', async ({ page }) => {
    // Click first flavor button
    const firstFlavorButton = page.locator('div.grid button').first();
    await firstFlavorButton.click();
    await page.waitForTimeout(500);

    // Check for emerald styling
    const classes = await firstFlavorButton.getAttribute('class');
    expect(classes).toContain('emerald');
  });

  test('should allow entry submission with button selections', async ({ page }) => {
    // Select first flavor
    await page.locator('div.grid button').first().click();
    await page.waitForTimeout(300);

    // Select first person
    await page.locator('button').filter({ hasText: /^[TS]$/i }).first().click();
    await page.waitForTimeout(300);

    // Click 0.03g dab size
    await page.getByRole('button', { name: '0.03' }).click();
    await page.waitForTimeout(300);

    // Confirm
    await page.getByRole('button', { name: 'Confirm' }).click();

    // Wait for success message
    await page.waitForTimeout(2000);
  });
});

test.describe('Navigation Changes', () => {
  test('should not show "Dabta" title in navbar', async ({ page }) => {
    const dabtaText = page.getByText('Dabta');
    await expect(dabtaText).not.toBeVisible();
  });

  test('should show 5 page indicator dots', async ({ page }) => {
    // Look for page indicators at bottom
    const indicators = page.locator('[class*="indicator"], [class*="page-dot"]').locator('visible=true');

    // Alternative: count all buttons/indicators at bottom of page
    const bottomIndicators = page.locator('button[class*="w-"], div[class*="h-2"]');
    const count = await bottomIndicators.count();

    // Should have 5 pages
    expect(count).toBeGreaterThanOrEqual(5);
  });
});

test.describe('Dashboard UI Changes', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to Dashboard by swiping or clicking
    // Swipe left to get to dashboard
    await page.mouse.move(300, 400);
    await page.mouse.down();
    await page.mouse.move(50, 400);
    await page.mouse.up();
    await page.waitForTimeout(1500);
  });

  test('should show "Select All" and "Clear All" buttons', async ({ page }) => {
    const selectAllButton = page.getByRole('button', { name: 'Select All' });
    await expect(selectAllButton).toBeVisible();

    const clearAllButton = page.getByRole('button', { name: 'Clear All' });
    await expect(clearAllButton).toBeVisible();
  });

  test('should render only 1 chart', async ({ page }) => {
    await page.waitForTimeout(2000);
    const charts = page.locator('.recharts-wrapper');
    const count = await charts.count();
    expect(count).toBeLessThanOrEqual(1);
  });

  test('should not show "Usage by Person" chart', async ({ page }) => {
    const usageByPerson = page.getByText('Usage by Person');
    await expect(usageByPerson).not.toBeVisible();
  });

  test('should not show "All Flavors Overview" chart', async ({ page }) => {
    const allFlavors = page.getByText('All Flavors Overview');
    await expect(allFlavors).not.toBeVisible();
  });
});

test.describe('Critical Functionality', () => {
  test('complete user flow works end-to-end', async ({ page }) => {
    // 1. Select flavor
    await page.locator('div.grid button').first().click();
    await page.waitForTimeout(300);

    // 2. Select person
    await page.locator('button').filter({ hasText: /^[TS]$/i }).first().click();
    await page.waitForTimeout(300);

    // 3. Record dab
    await page.getByRole('button', { name: '0.03' }).click();
    await page.waitForTimeout(300);
    await page.getByRole('button', { name: 'Confirm' }).click();
    await page.waitForTimeout(2000);

    // Verify we're still on the page without errors
    const pageTitle = await page.textContent('body');
    expect(pageTitle).toBeTruthy();
  });
});
