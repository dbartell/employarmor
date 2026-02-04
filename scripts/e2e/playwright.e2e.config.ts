import { defineConfig, devices } from '@playwright/test'

/**
 * E2E Test Configuration for Daily Runs
 * Runs against production with real credentials
 */
export default defineConfig({
  testDir: '.',
  testMatch: '**/*.spec.ts',
  
  fullyParallel: false,
  forbidOnly: true,
  retries: 1,
  workers: 1,
  
  reporter: [['list']],
  
  use: {
    baseURL: process.env.E2E_BASE_URL || 'https://hireshield.vercel.app',
    trace: 'on-first-retry',
    screenshot: 'on',
    video: 'on-first-retry',
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },

  timeout: 120000,
  
  expect: {
    timeout: 15000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
