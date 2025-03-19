import type { Locator, Page } from '@playwright/test'

export class ActiveStudentsPOM {
  readonly page: Page
  readonly controlsBtnCreate: Locator
  readonly createStudentsFirstRowFirstName: Locator

  constructor(page: Page) {
    this.page = page
    this.controlsBtnCreate = page.getByTestId('active-students-control-create')
  }

  async goto() {
    await this.page.goto('/students')
  }
}
