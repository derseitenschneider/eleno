import { expect, test } from '@playwright/test'
import { ActiveStudentsPMO } from '../../pmo/StudentsPMO'
import { CreateMockStudentPMO } from '../../pmo/active-students/CreateMockStudentPMO'
import { LessonsPMO } from '../../pmo/LessonsPMO'
import { TodosPMO } from '../../pmo/TodosPMO'
import { RepertoirePMO } from '../../pmo/RepertoirePMO'

test.describe('has access to features that require a student', () => {
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

  test('create note is not blocked', async ({ page }) => {
    const lessonPmo = new LessonsPMO(page)

    await lessonPmo.goto()
    await lessonPmo.btnAddNote.click()

    await expect(
      page.getByRole('dialog', { name: 'Neue Notiz erstellen' }),
    ).toBeVisible()

    const accessBlocker = page.getByTestId('access-blocker')
    await expect(accessBlocker).not.toBeVisible()
  })

  test('create repertoire item is not blocked', async ({ page }) => {
    await page.addLocatorHandler(
      page.getByText('Neue Nachricht', { exact: true }),
      async () => {
        await page.getByRole('button', { name: 'Close toast' }).click()
      },
    )
    const repertoirePmo = new RepertoirePMO(page)
    await repertoirePmo.goto()
  })
})

test('blocker in todo createn not visible.', async ({ page }) => {
  const todosPmo = new TodosPMO(page)
  await todosPmo.goto()
  const accessBlocker = page.getByTestId('access-blocker')

  await expect(accessBlocker).not.toBeVisible()
})
