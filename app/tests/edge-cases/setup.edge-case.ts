import { test as setup } from '@playwright/test'
import { loginUser } from '../utils/loginUser'
import { TestUser } from '../utils/TestUser'
import * as fs from 'node:fs'
import * as path from 'node:path'

/**
 * Setup authentication and test data for edge-case visual regression tests
 * Creates comprehensive test data for visual regression testing:
 * - Students: 1 default + 4 additional active + 2 inactive students
 * - Groups: 1 group with lessons
 * - Lessons: 5 for main student + lessons for additional students + 3 group lessons
 * - Repertoire: 4 pieces for main student + pieces for additional students + 3 group pieces
 * - Notes: 3 notes for main student + notes for additional students + 2 group notes + 4 general notes
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

  // Create lessons for the main student
  const mainStudentLessons = await testUser.createLessonsForStudent(
    testUser.studentId,
    5,
  )

  // Create lessons for additional students (first 2)
  let additionalLessonIds: number[] = []
  if (additionalStudents && additionalStudents.length > 0) {
    const firstStudentLessons = await testUser.createLessonsForStudent(
      additionalStudents[0].id.toString(),
      3,
    )
    additionalLessonIds.push(...firstStudentLessons.map((l) => l.id))

    if (additionalStudents.length > 1) {
      const secondStudentLessons = await testUser.createLessonsForStudent(
        additionalStudents[1].id.toString(),
        2,
      )
      additionalLessonIds.push(...secondStudentLessons.map((l) => l.id))
    }
  }

  // Create lessons for the group
  let groupLessons: any[] = []
  if (group) {
    groupLessons = await testUser.createLessonsForGroup(group.id.toString(), 3)
  }

  // Create repertoire items for main student
  let repertoireItems: any[] = []
  try {
    repertoireItems = await testUser.createRepertoireItems(
      testUser.studentId,
      4,
    )
  } catch (error) {
    console.warn('Repertoire items not created:', error)
  }

  // Create repertoire for additional students and group
  let additionalRepertoireIds: number[] = []
  let groupRepertoireItems: any[] = []

  try {
    if (additionalStudents && additionalStudents.length > 0) {
      // Create repertoire for first additional student
      const firstStudentRepertoire = await testUser.createRepertoireItems(
        additionalStudents[0].id.toString(),
        2,
      )
      additionalRepertoireIds.push(...firstStudentRepertoire.map((r) => r.id))

      if (additionalStudents.length > 1) {
        // Create repertoire for second additional student
        const secondStudentRepertoire = await testUser.createRepertoireItems(
          additionalStudents[1].id.toString(),
          2,
        )
        additionalRepertoireIds.push(
          ...secondStudentRepertoire.map((r) => r.id),
        )
      }
    }

    // Create group repertoire
    if (group) {
      groupRepertoireItems = await testUser.createRepertoireForGroup(
        group.id.toString(),
        3,
      )
    }
  } catch (error) {
    console.warn('Additional repertoire creation failed:', error)
  }

  // Create notes for students and groups
  let notesItems: any[] = []
  let studentNotesIds: number[] = []
  let groupNotesItems: any[] = []
  let generalNotesItems: any[] = []

  try {
    // Create notes for main student
    notesItems = await testUser.createNotesForStudent(testUser.studentId, 3)

    // Create notes for additional students
    if (additionalStudents && additionalStudents.length > 0) {
      const firstStudentNotes = await testUser.createNotesForStudent(
        additionalStudents[0].id.toString(),
        2,
      )
      studentNotesIds.push(...firstStudentNotes.map((n) => n.id))

      if (additionalStudents.length > 1) {
        const secondStudentNotes = await testUser.createNotesForStudent(
          additionalStudents[1].id.toString(),
          2,
        )
        studentNotesIds.push(...secondStudentNotes.map((n) => n.id))
      }
    }

    // Create group notes
    if (group) {
      groupNotesItems = await testUser.createNotesForGroup(
        group.id.toString(),
        2,
      )
    }

    // Create general notes
    generalNotesItems = await testUser.createGeneralNotes(4)
  } catch (error) {
    console.warn('Notes creation failed:', error)
  }

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
    clockId: (testUser as any).customer?.test_clock,
    defaultStudentId: testUser.studentId,
    additionalStudentIds: additionalStudents?.map((s) => s.id) || [],
    inactiveStudentIds: inactiveStudents?.map((s) => s.id) || [],
    groupId: group?.id,
    testUserEmail: testUser.email,
    mainStudentLessonIds: mainStudentLessons?.map((l) => l.id) || [],
    additionalLessonIds: additionalLessonIds || [],
    groupLessonIds: groupLessons?.map((l) => l.id) || [],
    // Repertoire data
    mainStudentRepertoireIds: repertoireItems?.map((r) => r.id) || [],
    additionalRepertoireIds: additionalRepertoireIds || [],
    groupRepertoireIds: groupRepertoireItems?.map((r) => r.id) || [],
    // Notes data
    mainStudentNotesIds: notesItems?.map((n) => n.id) || [],
    additionalStudentNotesIds: studentNotesIds || [],
    groupNotesIds: groupNotesItems?.map((n) => n.id) || [],
    generalNotesIds: generalNotesItems?.map((n) => n.id) || [],
  }

  fs.writeFileSync(
    path.join(authDir, 'test-data.json'),
    JSON.stringify(testData, null, 2),
  )

  // Save authentication state
  await context.storageState({ path: './tests/edge-cases/.auth/user.json' })
})
