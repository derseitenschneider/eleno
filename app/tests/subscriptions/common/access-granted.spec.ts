import { expect, test } from '@playwright/test'
import { LessonsPOM } from '../../pom/LessonsPOM'
import { TodosPOM } from '../../pom/TodosPOM'
import { RepertoirePOM } from '../../pom/RepertoirePOM'

test('create lesson is not blocked', async ({ page }, testInfos) => {
  const lessonPom = new LessonsPOM(page, testInfos)
  await lessonPom.goto()

  await testInfos.attach('create-lesson', {
    body: await page.screenshot(),
    contentType: 'image/png',
  })

  const accessBlocker = page.getByTestId('access-blocker-createLesson')

  await expect(accessBlocker).not.toBeVisible()
})

test('create note is not blocked', async ({ page }, testInfos) => {
  const lessonPom = new LessonsPOM(page, testInfos)

  await lessonPom.goto()

  await testInfos.attach('create-note', {
    body: await page.screenshot(),
    contentType: 'image/png',
  })

  await lessonPom.btnAddNote.click()

  await expect(
    page.getByRole('dialog', { name: 'Neue Notiz erstellen' }),
  ).toBeVisible()

  const accessBlocker = page.getByTestId('access-blocker-createNote')
  await expect(accessBlocker).not.toBeVisible()
})

test('create repertoire item is not blocked', async ({ page }, testInfos) => {
  const repertoirePom = new RepertoirePOM(page, testInfos)
  await repertoirePom.goto()

  await testInfos.attach('create-repertoire-item', {
    body: await page.screenshot(),
    contentType: 'image/png',
  })

  const accessBlocker = page.getByTestId('access-blocker')
  await expect(accessBlocker).not.toBeVisible()
})

test('create todo is not blocked', async ({ page }, testInfos) => {
  const todosPom = new TodosPOM(page)
  await todosPom.goto()

  await testInfos.attach('create-todo', {
    body: await page.screenshot(),
    contentType: 'image/png',
  })

  const accessBlocker = page.getByTestId('access-blocker')

  await expect(accessBlocker).not.toBeVisible()
})
