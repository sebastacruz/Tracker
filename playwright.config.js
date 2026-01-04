import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright configuration for end-to-end testing
 * Configured for iPhone 14 Pro Safari emulation
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:5173/Tracker/',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'iPhone 14 Pro',
      use: {
        ...devices['iPhone 14 Pro'],
        deviceScaleFactor: 3,
      },
      testDir: './tests/e2e',
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173/Tracker/',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
})
