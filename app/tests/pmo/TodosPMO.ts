import { expect, type Locator, type Page } from '@playwright/test'

export class TodosPMO {
  readonly page: Page
  readonly lessonNavSidebar: Locator
  readonly title: Locator
  readonly inputCreate: Locator

  constructor(page: Page) {
    this.page = page
    this.lessonNavSidebar = this.page.getByTestId('lesson-nav-sidebar')
    this.title = page.getByRole('heading', { name: 'Todos', exact: true })
    this.inputCreate = page.getByTestId('input-create-todo')
  }

  async goto() {
    await this.page.goto('/todos')
    await expect(this.inputCreate).toBeVisible()
  }
}
