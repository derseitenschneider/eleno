import { test as setup, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { loginUser } from '../utils/loginUser'
import { TestUser } from '../utils/TestUser'

// Create authentication directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const authDir = path.join(__dirname, '.auth')
if (!fs.existsSync(authDir)) {
  fs.mkdirSync(authDir, { recursive: true })
}

const authFile = path.join(authDir, 'user.json')

setup('setup accessibility test user with comprehensive data', async ({ page, context }) => {
  console.log('Setting up accessibility testing with TestUser and comprehensive data...')

  // Create a test user specifically for accessibility testing
  const testUser = new TestUser({
    userflow: 'general-user',
    project: 'general',
  })

  // Initialize the user (creates default student)
  await testUser.init()
  console.log('TestUser initialized with default student')

  // Create additional students for table navigation and student management tests
  const additionalStudents = await testUser.createAdditionalStudents(4)
  console.log(`Created ${additionalStudents.length} additional active students`)

  // Create some inactive students for comprehensive student list testing
  const inactiveStudents = await testUser.createInactiveStudents(2)
  console.log(`Created ${inactiveStudents.length} inactive students`)

  // Create a group for group-related accessibility tests
  const group = await testUser.createGroup('Accessibility Test Group')
  console.log(`Created group: ${group.name}`)

  // Create lessons for the main student (needed for lesson planning accessibility tests)
  const mainStudentLessons = await testUser.createLessonsForStudent(
    testUser.studentId,
    5
  )
  console.log(`Created ${mainStudentLessons.length} lessons for main student`)

  // Create lessons for additional students to have varied test data
  if (additionalStudents && additionalStudents.length > 0) {
    const firstStudentLessons = await testUser.createLessonsForStudent(
      additionalStudents[0].id.toString(),
      3
    )
    console.log(`Created ${firstStudentLessons.length} lessons for first additional student`)

    if (additionalStudents.length > 1) {
      const secondStudentLessons = await testUser.createLessonsForStudent(
        additionalStudents[1].id.toString(),
        2
      )
      console.log(`Created ${secondStudentLessons.length} lessons for second additional student`)
    }
  }

  // Create group lessons for group accessibility testing
  const groupLessons = await testUser.createLessonsForGroup(group.id.toString(), 3)
  console.log(`Created ${groupLessons.length} lessons for group`)

  // Create repertoire items for repertoire accessibility tests
  const repertoireItems = await testUser.createRepertoireItems(
    testUser.studentId,
    4
  )
  console.log(`Created ${repertoireItems.length} repertoire items for main student`)

  // Create repertoire for additional students
  if (additionalStudents && additionalStudents.length > 0) {
    const additionalRepertoire = await testUser.createRepertoireItems(
      additionalStudents[0].id.toString(),
      3
    )
    console.log(`Created ${additionalRepertoire.length} repertoire items for additional student`)
  }

  // Create notes for notes accessibility testing (drag-and-drop, ordering, etc.)
  const notesItems = await testUser.createNotesForStudent(testUser.studentId, 4)
  console.log(`Created ${notesItems.length} notes for main student`)

  // Create notes for additional students
  if (additionalStudents && additionalStudents.length > 0) {
    const additionalNotes = await testUser.createNotesForStudent(
      additionalStudents[0].id.toString(),
      3
    )
    console.log(`Created ${additionalNotes.length} notes for additional student`)
  }

  // Create group notes
  const groupNotes = await testUser.createNotesForGroup(
    group.id.toString(),
    2
  )
  console.log(`Created ${groupNotes.length} notes for group`)

  // Create general notes for general notes accessibility testing
  const generalNotes = await testUser.createGeneralNotes(3)
  console.log(`Created ${generalNotes.length} general notes`)

  console.log('All test data created successfully')

  // Perform login
  await page.goto('/')
  await loginUser(page, testUser.email, testUser.password)

  // Wait for successful authentication
  await expect(page.getByRole('heading', { name: 'Quick Links' })).toBeVisible({
    timeout: 10000,
  })

  // Verify we're logged in by checking for dashboard elements
  await expect(page.getByTestId('lesson-nav-sidebar')).toBeVisible()
  await expect(page.getByRole('link', { name: /Schüler.*innen.*Gruppen/i })).toBeVisible()

  console.log('Authentication successful - saving state for accessibility tests')

  // Save authenticated state
  await page.context().storageState({ path: authFile })

  // Verify navigation works and data is accessible
  await page.getByTestId('lesson-nav-sidebar').click()
  await expect(page.getByRole('heading', { name: 'notizen' })).toBeVisible()

  // Verify some test data is visible (lessons should be present)
  await page.waitForTimeout(2000) // Wait for data to load
  const lessonItems = page.locator('[data-testid*="lesson-item"]')
  const lessonCount = await lessonItems.count()
  console.log(`Verified ${lessonCount} lesson items are visible for accessibility tests`)

  console.log('Accessibility testing setup complete with comprehensive test data')
})
