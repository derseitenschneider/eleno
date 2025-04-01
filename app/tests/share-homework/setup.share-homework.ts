import { test as setup, expect } from '@playwright/test'
import { TestUser } from '../utils/TestUser'

setup(
  'create a trial user, run checkout fixture and activate',
  async ({ page }) => {
    // Setup test data.
    const testUser = new TestUser({ userflow: 'share-homework' })
    await testUser.init()
    const lesson = await testUser.createLesson()
    const studentId = lesson?.studentId
    const homeworkKey = lesson?.homeworkKey
    await page.goto(
      `https://api.test.eleno.net/homework/${studentId}/${homeworkKey}`,
    )
    await page.screenshot()
  },
)
