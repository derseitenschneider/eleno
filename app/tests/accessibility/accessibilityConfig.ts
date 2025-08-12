import type { PlaywrightTestConfig } from '@playwright/test'

export const accessibilityConfig: PlaywrightTestConfig['projects'] = [
  {
    name: 'accessibility-setup',
    testDir: './tests/accessibility',
    testMatch: '**/setup.accessibility.ts',
  },
  {
    name: 'accessibility-desktop',
    testDir: './tests/accessibility',
    testMatch: '**/*.accessibility.spec.ts',
    dependencies: ['accessibility-setup'],
    use: {
      browserName: 'chromium',
      viewport: { width: 1280, height: 720 },
      deviceScaleFactor: 1,
      hasTouch: false,
      isMobile: false,
      colorScheme: 'light',
      // Load authentication state
      storageState: './tests/accessibility/.auth/user.json',
      // Enable tracing for debugging
      trace: 'retain-on-failure',
      screenshot: 'only-on-failure',
      video: 'retain-on-failure',
    },
  },
  {
    name: 'accessibility-mobile',
    testDir: './tests/accessibility',
    testMatch: '**/*.accessibility.spec.ts',
    dependencies: ['accessibility-setup'],
    use: {
      browserName: 'chromium',
      ...{
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1'
      },
      colorScheme: 'light',
      storageState: './tests/accessibility/.auth/user.json',
      trace: 'retain-on-failure',
      screenshot: 'only-on-failure',
      video: 'retain-on-failure',
    },
  },
  {
    name: 'accessibility-keyboard-only',
    testDir: './tests/accessibility',
    testMatch: '**/keyboard-*.accessibility.spec.ts',
    dependencies: ['accessibility-setup'],
    use: {
      browserName: 'chromium',
      viewport: { width: 1280, height: 720 },
      deviceScaleFactor: 1,
      hasTouch: false,
      isMobile: false,
      colorScheme: 'light',
      storageState: './tests/accessibility/.auth/user.json',
      trace: 'retain-on-failure',
      screenshot: 'only-on-failure',
      video: 'retain-on-failure',
      // Disable mouse to force keyboard navigation
      launchOptions: {
        args: ['--disable-mouse'],
      },
    },
  },
  {
    name: 'accessibility-high-contrast',
    testDir: './tests/accessibility',
    testMatch: '**/contrast-*.accessibility.spec.ts',
    dependencies: ['accessibility-setup'],
    use: {
      browserName: 'chromium',
      viewport: { width: 1280, height: 720 },
      deviceScaleFactor: 1,
      hasTouch: false,
      isMobile: false,
      colorScheme: 'light',
      storageState: './tests/accessibility/.auth/user.json',
      trace: 'retain-on-failure',
      screenshot: 'only-on-failure',
      video: 'retain-on-failure',
      // Enable high contrast mode
      launchOptions: {
        args: ['--force-prefers-contrast=high'],
      },
    },
  },
  {
    name: 'accessibility-cleanup',
    testDir: './tests/accessibility',
    testMatch: '**/teardown.accessibility.ts',
  },
]