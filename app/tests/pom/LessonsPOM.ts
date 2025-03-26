import {
  expect,
  type TestInfo,
  type Locator,
  type Page,
} from '@playwright/test'

export class LessonsPOM {
  readonly page: Page
  readonly testInfos: TestInfo
  readonly lessonNavSidebar: Locator
  readonly title: Locator
  readonly btnAddNote: Locator

  constructor(page: Page, testInfos: TestInfo) {
    this.page = page
    this.testInfos = testInfos
    this.lessonNavSidebar = this.page.getByTestId('lesson-nav-sidebar')
    this.title = page.getByRole('heading', { name: 'notizen' })
    this.btnAddNote = page.getByRole('button', { name: 'Neu' })
  }

  async goto() {
    await this.page.goto('/')

    // Wait for dashboard heading to be loaded. This is only the case when
    // all data is loaded from the database. With this we prevent flakyness
    // because otherwhise pw might navigate to the lessons page before the
    // students data is loaded causing it to land on the "no-students" page.
    await expect(
      this.page.getByRole('heading', { name: 'Quick Links' }),
    ).toBeVisible()

    // Additionally since the lessons nav button is disabled until all data is
    // loaded, we wait until its enabled.
    await expect(this.lessonNavSidebar).toBeEnabled()

    await this.lessonNavSidebar.click()

    await this.testInfos.attach('post-lesson-nav', {
      body: await this.page.screenshot(),
      contentType: 'image/png',
    })

    await expect(this.title).toBeVisible()
  }
}
