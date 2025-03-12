import { test } from '@playwright/test'
import { ActiveStudentsPMO } from '../../../pmo/StudentsPMO'
import { CreateStudentsPMO } from '../../../pmo/active-students/CreateStudentsPMO'

test.describe
  .serial('trial user has access to all features.', () => {
    test.skip('can create a student', async ({ page }) => {
      const studentsPmo = new ActiveStudentsPMO(page)
      const createStudentPmo = new CreateStudentsPMO(page)
      const firstName = 'Test'
      const lastName = 'Student'
      const instrument = 'Gitarre'
      studentsPmo.goto()
      await createStudentPmo.firstName.fill(firstName)
      await createStudentPmo.lastName.fill(lastName)
      await createStudentPmo.instrument.fill(instrument)
      await createStudentPmo.btnSave.click()
    })
    test.skip('create lesson is not blocked', () => { })
    test.skip('create note is not blocked', () => { })
    test.skip('create repertoire item is not blocked', () => { })
    test.skip('create todo item is not blocked', () => { })
  })
