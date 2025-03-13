import { expect, type Locator, type Page } from '@playwright/test'

export class LessonsPMO {
  readonly page: Page
  readonly lessonNavSidebar: Locator
  readonly title: Locator

  constructor(page: Page) {
    this.page = page
    this.lessonNavSidebar = this.page.getByTestId('lesson-nav-sidebar')
    this.title = page.getByRole('heading', { name: 'notizen' })
  }

  async goto() {
    await this.lessonNavSidebar.click()
    await expect(this.title).toBeVisible()
  }
}
