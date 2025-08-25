import type { PlaywrightTestConfig, Project } from '@playwright/test'
import { devices } from '@playwright/test'

// Browser configurations with specific settings
export const browserConfigs = {
  chromium: {
    name: 'chromium',
    browserName: 'chromium',
    launchOptions: {
      args: [
        '--disable-dev-shm-usage',
        '--disable-blink-features=AutomationControlled',
      ],
    },
  },
  chrome: {
    name: 'chrome',
    browserName: 'chromium',
    channel: 'chrome',
    launchOptions: {
      args: [
        '--disable-dev-shm-usage',
        '--disable-blink-features=AutomationControlled',
      ],
    },
  },
  firefox: {
    name: 'firefox',
    browserName: 'firefox',
    launchOptions: {
      firefoxUserPrefs: {
        'media.navigator.streams.fake': true,
        'media.navigator.permission.disabled': true,
      },
    },
  },
  webkit: {
    name: 'webkit',
    browserName: 'webkit',
    launchOptions: {
      // WebKit specific options
    },
  },
  'mobile-chrome': {
    name: 'mobile-chrome',
    browserName: 'chromium',
    ...devices['Pixel 5'],
    hasTouch: true,
  },
  'mobile-safari': {
    name: 'mobile-safari',
    browserName: 'webkit',
    ...devices['iPhone 12'],
    hasTouch: true,
  },
  'tablet-chrome': {
    name: 'tablet-chrome',
    browserName: 'chromium',
    ...devices['iPad Pro'],
    hasTouch: true,
  },
  'tablet-safari': {
    name: 'tablet-safari',
    browserName: 'webkit',
    ...devices['iPad Pro'],
    hasTouch: true,
  },
}

// Test suites configuration
export const testSuites = {
  critical: {
    name: 'critical',
    description: 'Critical user journeys',
    browsers: ['chromium', 'firefox', 'webkit'],
    testMatch: ['**/tests/cross-browser/critical/**/*.spec.ts'],
    timeout: 60000,
    retries: 2,
  },
  subscription: {
    name: 'subscription',
    description: 'Subscription flows across browsers',
    browsers: ['chromium', 'firefox', 'webkit'],
    testMatch: ['**/tests/cross-browser/subscription/**/*.spec.ts'],
    timeout: 90000,
    retries: 1,
  },
  responsive: {
    name: 'responsive',
    description: 'Responsive design testing',
    browsers: [
      'mobile-chrome',
      'mobile-safari',
      'tablet-chrome',
      'tablet-safari',
    ],
    testMatch: ['**/tests/cross-browser/responsive/**/*.spec.ts'],
    timeout: 45000,
    retries: 1,
  },
  compatibility: {
    name: 'compatibility',
    description: 'Browser compatibility features',
    browsers: ['chromium', 'chrome', 'firefox', 'webkit'],
    testMatch: ['**/tests/cross-browser/compatibility/**/*.spec.ts'],
    timeout: 30000,
    retries: 2,
  },
}

// Generate project configurations
export function generateCrossBrowserProjects(): Array<Project> {
  const projects: PlaywrightTestConfig['projects'] = []

  // Setup project
  projects.push({
    name: 'cross-browser-setup',
    testDir: './tests/cross-browser',
    testMatch: '**/setup.cross-browser.ts',
    timeout: 60000,
  })

  // Generate projects for each test suite and browser combination
  Object.entries(testSuites).forEach(([_, suite]) => {
    suite.browsers.forEach((browserKey) => {
      const browserConfig =
        browserConfigs[browserKey as keyof typeof browserConfigs]

      projects.push({
        name: `cross-browser-${suite.name}-${browserConfig.name}`,
        testDir: './tests/cross-browser',
        testMatch: suite.testMatch,
        dependencies: ['cross-browser-setup'],
        timeout: suite.timeout,
        retries: suite.retries,
        use: {
          browserName: browserConfig.browserName as any,
          ...('channel' in browserConfig && browserConfig.channel
            ? { channel: browserConfig.channel }
            : {}),
          ...('launchOptions' in browserConfig
            ? { launchOptions: browserConfig.launchOptions }
            : {}),
          // Common settings for all browsers
          storageState: './tests/cross-browser/.auth/user.json',
          actionTimeout: 15000,
          navigationTimeout: 30000,
          screenshot: 'only-on-failure',
          video: 'retain-on-failure',
          trace: 'retain-on-failure',
          // Browser-specific viewport if not mobile
          ...('viewport' in browserConfig && browserConfig.viewport
            ? { viewport: browserConfig.viewport }
            : { viewport: { width: 1440, height: 900 } }),
        },
        metadata: {
          browser: browserConfig.browserName,
          suite: suite.name,
          description: suite.description,
        },
      })
    })
  })

  // Cleanup project
  projects.push({
    name: 'cross-browser-cleanup',
    testDir: './tests/cross-browser',
    testMatch: '**/teardown.cross-browser.ts',
    timeout: 30000,
  })

  return projects
}

export const crossBrowserConfig = generateCrossBrowserProjects()

// Browser compatibility matrix for reporting
export const compatibilityMatrix = {
  browsers: {
    chromium: {
      name: 'Chromium',
      engine: 'Blink',
      mobile: false,
      priority: 'high',
    },
    chrome: {
      name: 'Chrome',
      engine: 'Blink',
      mobile: false,
      priority: 'high',
    },
    firefox: {
      name: 'Firefox',
      engine: 'Gecko',
      mobile: false,
      priority: 'high',
    },
    webkit: {
      name: 'WebKit/Safari',
      engine: 'WebKit',
      mobile: false,
      priority: 'high',
    },
    'mobile-chrome': {
      name: 'Mobile Chrome',
      engine: 'Blink',
      mobile: true,
      priority: 'medium',
    },
    'mobile-safari': {
      name: 'Mobile Safari',
      engine: 'WebKit',
      mobile: true,
      priority: 'high',
    },
    'tablet-chrome': {
      name: 'Tablet Chrome',
      engine: 'Blink',
      mobile: true,
      priority: 'medium',
    },
    'tablet-safari': {
      name: 'Tablet Safari',
      engine: 'WebKit',
      mobile: true,
      priority: 'medium',
    },
  },
  features: {
    authentication: [
      'chromium',
      'firefox',
      'webkit',
      'mobile-chrome',
      'mobile-safari',
    ],
    lessons: [
      'chromium',
      'firefox',
      'webkit',
      'mobile-chrome',
      'mobile-safari',
    ],
    students: [
      'chromium',
      'firefox',
      'webkit',
      'mobile-chrome',
      'mobile-safari',
    ],
    subscription: ['chromium', 'firefox', 'webkit'],
    responsive: [
      'mobile-chrome',
      'mobile-safari',
      'tablet-chrome',
      'tablet-safari',
    ],
    javascript: ['chromium', 'chrome', 'firefox', 'webkit'],
  },
}
