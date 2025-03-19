import { expect, type Locator, type Page } from '@playwright/test'

export class LessonsPMO {
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
    await this.lessonNavSidebar.click()
    await expect(this.title).toBeVisible()
  }
}
