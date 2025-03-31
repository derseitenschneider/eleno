import { expect } from '@playwright/test'
import { test } from '../../fixture'
import { LessonsPOM } from '../../pom/LessonsPOM'
import { TodosPOM } from '../../pom/TodosPOM'
import { RepertoirePOM } from '../../pom/RepertoirePOM'

test('create lesson is not blocked', async ({ forwardOneMonth }, testInfos) => {
  const lessonPom = new LessonsPOM(forwardOneMonth, testInfos)
  await lessonPom.goto()

  await testInfos.attach('create-lesson', {
    body: await forwardOneMonth.screenshot(),
    contentType: 'image/png',
  })

  const accessBlocker = forwardOneMonth.getByTestId(
    'access-blocker-createLesson',
  )

  await expect(accessBlocker).not.toBeVisible()
})

test('create note is not blocked', async ({ forwardOneMonth }, testInfos) => {
  const lessonPom = new LessonsPOM(forwardOneMonth, testInfos)

  await lessonPom.goto()

  await testInfos.attach('create-note', {
    body: await forwardOneMonth.screenshot(),
    contentType: 'image/png',
  })

  await lessonPom.btnAddNote.click()

  await expect(
    forwardOneMonth.getByRole('dialog', { name: 'Neue Notiz erstellen' }),
  ).toBeVisible()

  const accessBlocker = forwardOneMonth.getByTestId('access-blocker-createNote')
  await expect(accessBlocker).not.toBeVisible()
})

test('create repertoire item is not blocked', async ({
  forwardOneMonth,
}, testInfos) => {
  const repertoirePom = new RepertoirePOM(forwardOneMonth, testInfos)
  await repertoirePom.goto()

  await testInfos.attach('create-repertoire-item', {
    body: await forwardOneMonth.screenshot(),
    contentType: 'image/png',
  })

  const accessBlocker = forwardOneMonth.getByTestId('access-blocker')
  await expect(accessBlocker).not.toBeVisible()
})

test('create todo is not blocked', async ({ forwardOneMonth }, testInfos) => {
  const todosPom = new TodosPOM(forwardOneMonth)
  await todosPom.goto()

  await testInfos.attach('create-todo', {
    body: await forwardOneMonth.screenshot(),
    contentType: 'image/png',
  })

  const accessBlocker = forwardOneMonth.getByTestId('access-blocker')

  await expect(accessBlocker).not.toBeVisible()
})
