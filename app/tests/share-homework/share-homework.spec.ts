import { test as setup, expect } from '@playwright/test'
import { TestUser } from '../utils/TestUser'

setup(
  'create user, student and lesson, navigate to homework api and expect homework to be there.',
  async ({ page }) => {
    // Setup test user.
    const testUser = new TestUser({ userflow: 'share-homework' })
    await testUser.init()

    // Create test lesson.
    const lesson = await testUser.createLesson()

    // Navigate to homework api.
    const studentId = lesson?.studentId
    const homeworkKey = lesson?.homeworkKey
    await page.goto(
      `https://api.test.eleno.net/homework/${studentId}/${homeworkKey}`,
    )

    // Expect homework heading to be visible.
    await expect(page.getByTestId('homework-heading')).toContainText(
      'Hausaufgaben vom',
    )
  },
)
