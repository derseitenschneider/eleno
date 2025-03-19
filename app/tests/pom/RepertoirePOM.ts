import { expect, type Locator, type Page } from '@playwright/test'

export class RepertoirePOM {
  readonly page: Page
  readonly lessonNavSidebar: Locator
  readonly btnAddNote: Locator
  readonly inputCreateItem: Locator

  constructor(page: Page) {
    this.page = page
    this.lessonNavSidebar = this.page.getByTestId('lesson-nav-sidebar')
    this.inputCreateItem = page.getByTestId('input-create-repertoire')
  }

  async goto() {
    await this.lessonNavSidebar.click()
    await this.page.getByRole('link', { name: 'Repertoire' }).click()
    await expect(this.inputCreateItem).toBeVisible()
  }
}
