import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: 'src/tests/e2e',
  timeout: 180000,
  expect: { timeout: 20000 },
  fullyParallel: false,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:4173/js/',
    launchOptions: {
      args: process.platform === 'darwin' ? ['--use-angle=metal', '--enable-gpu'] : [],
    },
    viewport: { width: 1000, height: 720 },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run build && npm run preview -- --port 4173',
    url: 'http://127.0.0.1:4173/js/',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
