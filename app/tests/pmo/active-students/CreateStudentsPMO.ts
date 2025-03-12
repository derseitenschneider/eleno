import type { Locator, Page } from '@playwright/test'
import { BasePMO } from '../BasePMO'

export class CreateStudentsPMO extends BasePMO {
  readonly page: Page
  readonly firstName: Locator
  readonly lastName: Locator
  readonly instrument: Locator
  readonly btnSave: Locator

  constructor(page: Page) {
    super(page)
    this.page = page
    this.firstName = page.getByRole('textbox', { name: 'Vorname*' })
    this.lastName = page.getByRole('textbox', { name: 'Nachname' })
    this.instrument = page.getByRole('textbox', { name: 'Instrument' })
    this.btnSave = page.getByRole('button', { name: 'Speichern' })
  }

}
