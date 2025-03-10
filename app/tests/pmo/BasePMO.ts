import type { Locator, Page } from '@playwright/test'

export class BasePMO {
  readonly loader: Locator
  readonly root: Locator

  constructor(page: Page) {
    this.loader = page.locator('#loader')
    this.root = page.locator('#root')
  }
}
