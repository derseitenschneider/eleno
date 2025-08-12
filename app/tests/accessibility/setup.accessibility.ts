import { test as setup, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { loginUser } from '../utils/loginUser'

// Test user credentials for accessibility testing
const testUser = {
  email: 'accessibility@eleno.test',
  password: 'AccessibilityTest123!',
}

// Create authentication directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const authDir = path.join(__dirname, '.auth')
if (!fs.existsSync(authDir)) {
  fs.mkdirSync(authDir, { recursive: true })
}

const authFile = path.join(authDir, 'user.json')

setup('authenticate accessibility test user', async ({ page, context }) => {
  console.log('Setting up accessibility testing authentication...')

  // Navigate to login page
  await page.goto('/')
  
  // Perform login
  await loginUser(page, testUser.email, testUser.password)
  
  // Wait for successful authentication
  await expect(
    page.getByRole('heading', { name: 'Quick Links' })
  ).toBeVisible({ timeout: 10000 })

  // Verify we're logged in by checking for dashboard elements
  await expect(page.getByTestId('lesson-nav-sidebar')).toBeVisible()
  await expect(page.getByTestId('students-nav-sidebar')).toBeVisible()

  console.log('Authentication successful - saving state for accessibility tests')
  
  // Save authenticated state
  await page.context().storageState({ path: authFile })
  
  // Verify navigation works
  await page.getByTestId('lesson-nav-sidebar').click()
  await expect(page.getByRole('heading', { name: 'notizen' })).toBeVisible()
  
  console.log('Accessibility testing authentication setup complete')
})