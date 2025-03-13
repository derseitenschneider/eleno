import { expect, type Locator, type Page } from '@playwright/test'

export class CreateMockStudentPMO {
  readonly page: Page
  readonly firstName: Locator
  readonly lastName: Locator
  readonly instrument: Locator
  readonly btnSave: Locator
  readonly studentResponseMock = {
    id: 1,
    created_at: '2025-03-12T18:19:10.211544+00:00',
    firstName: 'Test',
    lastName: 'User',
    instrument: 'Gitarre',
    startOfLesson: null,
    endOfLesson: null,
    archive: false,
    location: '',
    user_id: 'c352cb96-41e4-47ac-81bd-a77bf7865c92',
    durationMinutes: null,
    dayOfLesson: null,
  }

  constructor(page: Page) {
    this.page = page
    this.firstName = page.getByRole('textbox', { name: 'Vorname*' })
    this.lastName = page.getByRole('textbox', { name: 'Nachname' })
    this.instrument = page.getByRole('textbox', { name: 'Instrument' })
    this.btnSave = page.getByRole('button', { name: 'Speichern' })
  }

  async createMockStudent() {
    const routePromise = this.page.route(
      '**/rest/v1/students*',
      async (route) => {
        if (route.request().method() === 'POST') {
          const json = [
            {
              id: 1,
              firstName: 'Test',
              lastName: 'Student',
              instrument: 'Gitarre',
            },
          ]
          await route.fulfill({ json })
        } else {
          route.continue()
        }
      },
    )
    const firstName = 'Test'
    const lastName = 'Student'
    const instrument = 'Gitarre'
    const firstNameCell = this.page.getByRole('cell', { name: firstName })

    // ACT
    await this.firstName.fill(firstName)
    await this.lastName.fill(lastName)
    await this.instrument.fill(instrument)
    await this.btnSave.click()
    await routePromise
    await expect(firstNameCell).toBeVisible()
  }
}
