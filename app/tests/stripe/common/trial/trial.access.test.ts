import { test } from '@playwright/test'
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
    test.only('create lesson is not blocked', async ({ page }) => {
      const lessonPmo = new LessonsPMO(page)
      await lessonPmo.goto()
    })
    test.skip('create note is not blocked', () => {})
    test.skip('create repertoire item is not blocked', () => {})
  })
  test.skip('create todo item is not blocked', () => {})
})
