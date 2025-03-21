import { expect, test } from '@playwright/test'
import { LessonsPOM } from '../../pom/LessonsPOM'
import { TodosPOM } from '../../pom/TodosPOM'
import { RepertoirePOM } from '../../pom/RepertoirePOM'

test('create lesson is blocked', async ({ page }) => {
  const lessonPom = new LessonsPOM(page)
  await lessonPom.goto()
  const accessBlocker = page.getByTestId('access-blocker-createLesson')

  await expect(accessBlocker).toBeVisible()
})

test('create note is blocked', async ({ page }) => {
  const lessonPom = new LessonsPOM(page)

  await lessonPom.goto()
  await lessonPom.btnAddNote.click()

  await expect(
    page.getByRole('dialog', { name: 'Neue Notiz erstellen' }),
  ).toBeVisible()

  const accessBlocker = page.getByTestId('access-blocker-createNote')
  await expect(accessBlocker).toBeVisible()
})

test('create repertoire item is blocked', async ({ page }) => {
  await page.addLocatorHandler(
    page.getByText('Neue Nachricht', { exact: true }),
    async () => {
      await page.getByRole('button', { name: 'Close toast' }).click()
    },
  )
  const repertoirePom = new RepertoirePOM(page)
  await repertoirePom.goto()

  const accessBlocker = page.getByTestId('access-blocker')
  await expect(accessBlocker).toBeVisible()
})

test('create todo is blocked', async ({ page }) => {
  const todosPom = new TodosPOM(page)
  await todosPom.goto()
  const accessBlocker = page.getByTestId('access-blocker')

  await expect(accessBlocker).toBeVisible()
})
