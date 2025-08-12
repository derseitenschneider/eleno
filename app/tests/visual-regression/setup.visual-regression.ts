import { test as setup } from '@playwright/test'
import { loginUser } from '../utils/loginUser'
import { TestUser } from '../utils/TestUser'
import * as fs from 'node:fs'
import * as path from 'node:path'
import supabaseAdmin from '../utils/supabaseAdmin'

/**
 * Setup authentication for visual regression tests
 */
setup('authenticate for visual tests', async ({ page, context }) => {
  // Create a test user with subscription row for proper UI display
  const testUser = new TestUser({
    userflow: 'general-user',
    project: 'general',
  })
  
  await testUser.init()
  
  // Login with the created test user
  await loginUser(page, {
    email: testUser.email,
    password: testUser.password, 
    skipOnboarding: true
  })

  // Wait for application to be fully loaded
  await page.waitForSelector('[data-testid="dashboard"], .dashboard, main', { 
    state: 'visible',
    timeout: 30000 
  })

  // Ensure stable state for visual testing
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(1000)

  // Get the student ID directly from the TestUser instance since it creates one
  // The TestUser.populateStudents() method creates a student and stores the ID
  const { data: student } = await supabaseAdmin
    .from('students')
    .select('id')
    .eq('user_id', (testUser as any).user.id)
    .single()

  if (student) {
    // Store student ID for visual tests
    const authDir = './tests/visual-regression/.auth'
    fs.mkdirSync(authDir, { recursive: true })
    
    const studentData = { studentId: student.id }
    fs.writeFileSync(
      path.join(authDir, 'student.json'),
      JSON.stringify(studentData, null, 2)
    )
  }

  // Save authentication state
  await context.storageState({ path: './tests/visual-regression/.auth/user.json' })
})