import type { PlaywrightTestConfig } from '@playwright/test'

/**
 * Edge-case device configurations for comprehensive viewport testing
 * These configurations test problematic viewport sizes discovered in production
 */
export const edgeCaseConfig: PlaywrightTestConfig['projects'] = [
  {
    name: 'edge-case-setup',
    testDir: './tests/edge-cases',
    testMatch: '**/setup.edge-case.ts',
  },
  // iPhone XR - Large phone that had sidebar issues
  {
    name: 'edge-case-iphone-xr',
    testDir: './tests/edge-cases',
    testMatch: '**/*-edge-case.spec.ts',
    dependencies: ['edge-case-setup'],
    use: {
      browserName: 'chromium',
      viewport: { width: 414, height: 896 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
      storageState: './tests/edge-cases/.auth/user.json',
    },
    expect: {
      toHaveScreenshot: {
        threshold: 0.1,
        maxDiffPixels: 50,
        animations: 'disabled',
      },
    },
  },
  // Small laptop - Constrained height that hid students/repertoire
  {
    name: 'edge-case-small-laptop',
    testDir: './tests/edge-cases',
    testMatch: '**/*-edge-case.spec.ts',
    dependencies: ['edge-case-setup'],
    use: {
      browserName: 'chromium',
      viewport: { width: 1280, height: 720 },
      deviceScaleFactor: 1,
      isMobile: false,
      hasTouch: false,
      storageState: './tests/edge-cases/.auth/user.json',
    },
    expect: {
      toHaveScreenshot: {
        threshold: 0.1,
        maxDiffPixels: 50,
        animations: 'disabled',
      },
    },
  },
  // iPhone SE - Small phone edge case
  {
    name: 'edge-case-iphone-se',
    testDir: './tests/edge-cases',
    testMatch: '**/*-edge-case.spec.ts',
    dependencies: ['edge-case-setup'],
    use: {
      browserName: 'chromium',
      viewport: { width: 375, height: 667 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
      storageState: './tests/edge-cases/.auth/user.json',
    },
    expect: {
      toHaveScreenshot: {
        threshold: 0.1,
        maxDiffPixels: 50,
        animations: 'disabled',
      },
    },
  },
  // iPad Mini Portrait - Tablet boundary case
  {
    name: 'edge-case-ipad-mini',
    testDir: './tests/edge-cases',
    testMatch: '**/*-edge-case.spec.ts',
    dependencies: ['edge-case-setup'],
    use: {
      browserName: 'chromium',
      viewport: { width: 768, height: 1024 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
      storageState: './tests/edge-cases/.auth/user.json',
    },
    expect: {
      toHaveScreenshot: {
        threshold: 0.1,
        maxDiffPixels: 50,
        animations: 'disabled',
      },
    },
  },
  // Surface Duo - Dual-screen edge case
  {
    name: 'edge-case-surface-duo',
    testDir: './tests/edge-cases',
    testMatch: '**/*-edge-case.spec.ts',
    dependencies: ['edge-case-setup'],
    use: {
      browserName: 'chromium',
      viewport: { width: 540, height: 720 },
      deviceScaleFactor: 2.5,
      isMobile: true,
      hasTouch: true,
      storageState: './tests/edge-cases/.auth/user.json',
    },
    expect: {
      toHaveScreenshot: {
        threshold: 0.1,
        maxDiffPixels: 50,
        animations: 'disabled',
      },
    },
  },
  // Galaxy Fold - Foldable phone edge case
  {
    name: 'edge-case-galaxy-fold',
    testDir: './tests/edge-cases',
    testMatch: '**/*-edge-case.spec.ts',
    dependencies: ['edge-case-setup'],
    use: {
      browserName: 'chromium',
      viewport: { width: 280, height: 653 },
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
      storageState: './tests/edge-cases/.auth/user.json',
    },
    expect: {
      toHaveScreenshot: {
        threshold: 0.1,
        maxDiffPixels: 50,
        animations: 'disabled',
      },
    },
  },
  // Standard laptop - Most common laptop size
  {
    name: 'edge-case-standard-laptop',
    testDir: './tests/edge-cases',
    testMatch: '**/*-edge-case.spec.ts',
    dependencies: ['edge-case-setup'],
    use: {
      browserName: 'chromium',
      viewport: { width: 1366, height: 768 },
      deviceScaleFactor: 1,
      isMobile: false,
      hasTouch: false,
      storageState: './tests/edge-cases/.auth/user.json',
    },
    expect: {
      toHaveScreenshot: {
        threshold: 0.1,
        maxDiffPixels: 50,
        animations: 'disabled',
      },
    },
  },
  // Small desktop - Minimum desktop size
  {
    name: 'edge-case-small-desktop',
    testDir: './tests/edge-cases',
    testMatch: '**/*-edge-case.spec.ts',
    dependencies: ['edge-case-setup'],
    use: {
      browserName: 'chromium',
      viewport: { width: 1024, height: 768 },
      deviceScaleFactor: 1,
      isMobile: false,
      hasTouch: false,
      storageState: './tests/edge-cases/.auth/user.json',
    },
    expect: {
      toHaveScreenshot: {
        threshold: 0.1,
        maxDiffPixels: 50,
        animations: 'disabled',
      },
    },
  },
  {
    name: 'edge-case-cleanup',
    testDir: './tests/edge-cases',
    testMatch: '**/teardown.edge-case.ts',
  },
]