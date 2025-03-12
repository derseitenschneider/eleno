import type { Locator, Page } from '@playwright/test'
import { BasePMO } from './BasePMO'

export class LessonsPMO extends BasePMO {
  readonly page: Page

  constructor(page: Page) {
    super(page)
    this.page = page
  }

  async goto() {
    await this.page.goto('/settings/subscription')
  }
}
