import { expect, type Locator, type Page } from '@playwright/test'

export class LessonsPOM {
  readonly page: Page
  readonly lessonNavSidebar: Locator
  readonly title: Locator
  readonly btnAddNote: Locator

  constructor(page: Page) {
    this.page = page
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

    await this.lessonNavSidebar.click()
    await expect(this.title).toBeVisible()
  }
}
