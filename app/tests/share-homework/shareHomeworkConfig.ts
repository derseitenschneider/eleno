import { type Project, devices } from '@playwright/test'

export const shareHomeworkConfig: Array<Project> = [
  {
    name: 'share-homework-teardown',
    testMatch: '**/tests/share-homework/teardown.share-homework.ts',
  },
  {
    name: 'setup-share-homework',
    testMatch: '**/tests/share-homework/setup.share-homework.ts',
    teardown: 'share-homework-teardown',
  },
  {
    name: 'share-homework',
    testMatch: '**/tests/share-homework/**/*.spec.ts',
    dependencies: ['setup-share-homework'],
    use: {
      ...devices['Desktop Chrome'],
      // storageState: `playwright/.auth/share-homework.json`,
    },
  },
]
