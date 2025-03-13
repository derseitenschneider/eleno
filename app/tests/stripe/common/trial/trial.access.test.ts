import { expect, test } from '@playwright/test'
import { ActiveStudentsPMO } from '../../../pmo/StudentsPMO'
import { CreateMockStudentPMO } from '../../../pmo/active-students/CreateMockStudentPMO'
import { LessonsPMO } from '../../../pmo/LessonsPMO'

test.describe('trial user has access', () => {
  test.describe('to features that require a student', () => {
    test.beforeEach(async ({ page }) => {
      const activeStudentsPmo = new ActiveStudentsPMO(page)
      const createMockStudentPmo = new CreateMockStudentPMO(page)

      await activeStudentsPmo.goto()
      await activeStudentsPmo.controlsBtnCreate.click()
      await createMockStudentPmo.createMockStudent()
    })
    test('create lesson is not blocked', async ({ page }) => {
      const lessonPmo = new LessonsPMO(page)
      await lessonPmo.goto()
      const accessBlocker = page.getByTestId('access-blocker')

      await expect(accessBlocker).not.toBeVisible()
    })
    test.only('create note is not blocked', () => {})
    test.skip('create repertoire item is not blocked', () => {})
  })
  test.skip('create todo item is not blocked', () => {})
})
