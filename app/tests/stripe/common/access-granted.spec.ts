import { expect, test } from '@playwright/test'
import { ActiveStudentsPOM } from '../../pom/StudentsPOM'
import { LessonsPOM } from '../../pom/LessonsPOM'
import { TodosPOM } from '../../pom/TodosPOM'
import { RepertoirePOM } from '../../pom/RepertoirePOM'
import { CreateMockStudentPOM } from '../../pom/active-students/CreateMockStudentPOM'

test.describe('has access to features that require a student', () => {
  test.beforeEach(async ({ page }) => {
    const activeStudentsPom = new ActiveStudentsPOM(page)
    const createMockStudentPom = new CreateMockStudentPOM(page)

    await activeStudentsPom.goto()
    await activeStudentsPom.controlsBtnCreate.click()
    await createMockStudentPom.createMockStudent()
  })
  test('create lesson is not blocked', async ({ page }) => {
    const lessonPom = new LessonsPOM(page)
    await lessonPom.goto()
    const accessBlocker = page.getByTestId('access-blocker')

    await expect(accessBlocker).not.toBeVisible()
  })

  test('create note is not blocked', async ({ page }) => {
    const lessonPom = new LessonsPOM(page)

    await lessonPom.goto()
    await lessonPom.btnAddNote.click()

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
    const repertoirePom = new RepertoirePOM(page)
    await repertoirePom.goto()
  })
})

test('blocker in todo createn not visible.', async ({ page }) => {
  const todosPom = new TodosPOM(page)
  await todosPom.goto()
  const accessBlocker = page.getByTestId('access-blocker')

  await expect(accessBlocker).not.toBeVisible()
})
