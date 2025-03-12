import type { Locator, Page } from '@playwright/test'
import { BasePMO } from './BasePMO'

export class ActiveStudentsPMO extends BasePMO {
  readonly page: Page
  readonly controlsBtnCreate: Locator
  readonly createStudentsFirstRowFirstName: Locator

  constructor(page: Page) {
    super(page)
    this.page = page
    this.controlsBtnCreate = page.getByTestId('active-students-control-create')
  }

  async goto() {
    await this.page.goto('/students')
  }
}
