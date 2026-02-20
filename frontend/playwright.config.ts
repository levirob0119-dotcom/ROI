import { defineConfig, devices } from '@playwright/test';

const projects = [
    {
        name: 'chromium',
        use: { ...devices['Desktop Chrome'] },
    },
    {
        name: 'Mobile Chrome',
        use: { ...devices['Pixel 5'] },
    },
];

if (process.env.PW_INCLUDE_WEBKIT === '1') {
    projects.push({
        name: 'Mobile Safari',
        use: { ...devices['iPhone 12'] },
    });
}

export default defineConfig({
    testDir: './e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    use: {
        baseURL: 'http://127.0.0.1:4173',
        trace: 'on-first-retry',
    },
    projects,
    webServer: {
        command: 'npm run dev -- --host 127.0.0.1 --port 4173',
        url: 'http://127.0.0.1:4173',
        reuseExistingServer: false,
    },
});
