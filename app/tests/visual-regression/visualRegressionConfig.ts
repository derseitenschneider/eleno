import type { PlaywrightTestConfig } from '@playwright/test'

export const visualRegressionConfig: PlaywrightTestConfig['projects'] = [
  {
    name: 'visual-regression-setup',
    testDir: './tests/visual-regression',
    testMatch: '**/setup.visual-regression.ts',
  },
  {
    name: 'visual-regression-desktop',
    testDir: './tests/visual-regression',
    testMatch: '**/*.visual.spec.ts',
    dependencies: ['visual-regression-setup'],
    use: {
      browserName: 'chromium',
      viewport: { width: 1280, height: 720 },
      deviceScaleFactor: 1,
      hasTouch: false,
      isMobile: false,
      colorScheme: 'light',
      // Load authentication state
      storageState: './tests/visual-regression/.auth/user.json',
      // Enable screenshots and video for debugging
      screenshot: 'only-on-failure',
      video: 'retain-on-failure',
    },
    expect: {
      // Set threshold for visual comparison
      threshold: 0.3, // 30% threshold to allow for minor rendering differences
      toHaveScreenshot: {
        threshold: 0.3,
        mode: 'match',
        animations: 'disabled',
      },
    },
  },
  {
    name: 'visual-regression-mobile',
    testDir: './tests/visual-regression',
    testMatch: '**/*.visual.spec.ts',
    dependencies: ['visual-regression-setup'],
    use: {
      browserName: 'chromium',
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
      colorScheme: 'light',
      storageState: './tests/visual-regression/.auth/user.json',
      screenshot: 'only-on-failure',
      video: 'retain-on-failure',
    },
    expect: {
      threshold: 0.3,
      toHaveScreenshot: {
        threshold: 0.3,
        mode: 'match',
        animations: 'disabled',
      },
    },
  },
  {
    name: 'visual-regression-dark-desktop',
    testDir: './tests/visual-regression',
    testMatch: '**/*.visual.spec.ts',
    dependencies: ['visual-regression-setup'],
    use: {
      browserName: 'chromium',
      viewport: { width: 1280, height: 720 },
      deviceScaleFactor: 1,
      hasTouch: false,
      isMobile: false,
      colorScheme: 'dark',
      storageState: './tests/visual-regression/.auth/user.json',
      screenshot: 'only-on-failure',
      video: 'retain-on-failure',
    },
    expect: {
      threshold: 0.3,
      toHaveScreenshot: {
        threshold: 0.3,
        mode: 'match',
        animations: 'disabled',
      },
    },
  },
  {
    name: 'visual-regression-dark-mobile',
    testDir: './tests/visual-regression',
    testMatch: '**/*.visual.spec.ts',
    dependencies: ['visual-regression-setup'],
    use: {
      browserName: 'chromium',
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
      colorScheme: 'dark',
      storageState: './tests/visual-regression/.auth/user.json',
      screenshot: 'only-on-failure',
      video: 'retain-on-failure',
    },
    expect: {
      threshold: 0.3,
      toHaveScreenshot: {
        threshold: 0.3,
        mode: 'match',
        animations: 'disabled',
      },
    },
  },
  {
    name: 'visual-regression-cleanup',
    testDir: './tests/visual-regression',
    testMatch: '**/teardown.visual-regression.ts',
  },
]