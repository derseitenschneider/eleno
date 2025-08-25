import {
  expect,
  type Locator,
  type Page,
  type TestInfo,
} from '@playwright/test'
import { cleanupToasts } from '../utils/cleanupToasts'

export class RepertoirePOM {
  readonly page: Page
  readonly testInfos: TestInfo
  readonly lessonNavSidebar: Locator
  readonly btnAddNote: Locator
  readonly inputCreateItem: Locator

  constructor(page: Page, testInfos: TestInfo) {
    this.page = page
    this.lessonNavSidebar = this.page.getByTestId('lesson-nav-sidebar')
    this.btnAddNote = this.page.getByTestId('btn-add-note')
    this.inputCreateItem = page.getByTestId('input-create-repertoire')
    this.testInfos = testInfos
  }

  async goto() {
    await this.page.goto('/')

    // Wait for dashboard heading to be loaded. This is only the case when
    // all data is loaded from the database. With this we prevent flakyness
    // because otherwhise pw might navigate to the lessons page before the
    // students data is loaded causing it to land on the "no-students" page.
    await expect(
      this.page.getByRole('heading', { name: 'Quick Links' }),
    ).toBeVisible()

    // Additionally since the lessons nav button is disabled until all data is
    // loaded, we wait until its enabled.
    await expect(this.lessonNavSidebar).toBeEnabled()

    await this.lessonNavSidebar.click()

    await this.testInfos.attach('pre-repertoire-link-click', {
      body: await this.page.screenshot(),
      contentType: 'image/png',
    })

    cleanupToasts(this.page)

    await this.page.getByRole('link', { name: 'Repertoire' }).click()
    await expect(this.inputCreateItem).toBeVisible()
  }
}
