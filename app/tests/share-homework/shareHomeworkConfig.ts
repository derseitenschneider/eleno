import { type Project, devices } from '@playwright/test'

export const shareHomeworkConfig: Array<Project> = [
  {
    name: 'share-homework-teardown',
    testMatch: '**/tests/share-homework/teardown.share-homework.ts',
  },
  {
    name: 'share-homework',
    testMatch: '**/tests/share-homework/share-homework.spec.ts',
    teardown: 'share-homework-teardown',
    use: {
      ...devices['Desktop Chrome'],
    },
  },
]
