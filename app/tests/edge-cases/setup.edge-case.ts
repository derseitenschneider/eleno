import { test as setup } from '@playwright/test'
import { loginUser } from '../utils/loginUser'
import { TestUser } from '../utils/TestUser'
import * as fs from 'node:fs'
import * as path from 'node:path'

/**
 * Setup authentication and test data for edge-case visual regression tests
 * Creates: 1 default student + 4 additional active students + 1 group + 2 inactive students
 */
setup('setup edge-case test data', async ({ page, context }) => {
  // Create a test user with default student and subscription
  const testUser = new TestUser({
    userflow: 'general-user',
    project: 'general',
  })

  // Initialize with default student
  await testUser.init()

  // Create 4 additional active students (total will be 5)
  const additionalStudents = await testUser.createAdditionalStudents(4)

  // Create 2 inactive students
  const inactiveStudents = await testUser.createInactiveStudents(2)

  // Create 1 group
  const group = await testUser.createGroup('Advanced Guitar Group')

  // Login with the created test user
  await loginUser(page, {
    email: testUser.email,
    password: testUser.password,
    skipOnboarding: true,
  })

  // Wait for application to be fully loaded
  await page.waitForSelector('[data-testid="dashboard"], .dashboard, main', {
    state: 'visible',
    timeout: 30000,
  })

  // Ensure stable state
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(1000)

  // Store test data IDs for cleanup
  const authDir = './tests/edge-cases/.auth'
  fs.mkdirSync(authDir, { recursive: true })

  const testData = {
    userId: (testUser as any).user?.id,
    defaultStudentId: testUser.studentId,
    additionalStudentIds: additionalStudents?.map((s) => s.id) || [],
    inactiveStudentIds: inactiveStudents?.map((s) => s.id) || [],
    groupId: group?.id,
    testUserEmail: testUser.email,
  }

  fs.writeFileSync(
    path.join(authDir, 'test-data.json'),
    JSON.stringify(testData, null, 2),
  )

  // Save authentication state
  await context.storageState({ path: './tests/edge-cases/.auth/user.json' })
})
