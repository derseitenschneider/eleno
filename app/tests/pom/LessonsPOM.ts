import * as fs from 'node:fs'
import * as path from 'node:path'
import {
  expect,
  type Locator,
  type Page,
  type TestInfo,
} from '@playwright/test'

export class LessonsPOM {
  readonly page: Page
  readonly testInfos: TestInfo
  readonly lessonNavSidebar: Locator
  readonly title: Locator
  readonly btnAddNote: Locator

  constructor(page: Page, testInfos: TestInfo) {
    this.page = page
    this.testInfos = testInfos
    this.lessonNavSidebar = this.page.getByTestId('lesson-nav-sidebar')
    this.title = page.getByRole('heading', { name: 'notizen' })
    this.btnAddNote = page.getByRole('button', { name: 'Neu' })
  }

  async goto(studentId?: string) {
    // If student ID is provided, navigate directly to lessons page
    if (studentId) {
      await this.page.goto(`/lessons/s-${studentId}`)

      // Wait for the lessons page to load
      await this.page.waitForLoadState('networkidle')

      // Wait for lesson content to be visible (more flexible selectors)
      await this.page.waitForSelector(
        '[data-testid="lessons-page"], main, .lessons-container',
        {
          state: 'visible',
          timeout: 30000,
        },
      )

      await this.testInfos.attach('post-lesson-direct-nav', {
        body: await this.page.screenshot(),
        contentType: 'image/png',
      })

      return
    }

    // Fallback to original navigation method
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

    await this.testInfos.attach('post-lesson-nav', {
      body: await this.page.screenshot(),
      contentType: 'image/png',
    })

    await expect(this.title).toBeVisible()
  }

  /**
   * Get student ID from stored file (for visual regression tests)
   */
  static getStoredStudentId(): string | null {
    try {
      const studentFilePath = path.join(
        './tests/visual-regression/.auth/student.json',
      )
      if (fs.existsSync(studentFilePath)) {
        const studentData = JSON.parse(
          fs.readFileSync(studentFilePath, 'utf-8'),
        )
        return studentData.studentId || null
      }
    } catch (error) {
      console.warn('Could not read stored student ID:', error)
    }
    return null
  }
}
