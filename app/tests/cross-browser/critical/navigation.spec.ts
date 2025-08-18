import { test, expect } from '@playwright/test'

test.describe('Critical: Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Start from dashboard
    await page.goto('/dashboard')
    await expect(page.getByTestId('main-navigation')).toBeVisible()
  })

  test('should navigate to all main sections', async ({ page, browserName }) => {
    console.log(`Testing main navigation in ${browserName}`)

    // Test navigation to Students
    await page.getByRole('link', { name: /students/i }).click()
    await expect(page).toHaveURL(/\/students/)
    await expect(page.getByTestId('students-page')).toBeVisible({ timeout: 10000 })

    // Test navigation to Lessons
    await page.getByRole('link', { name: /lessons/i }).click()
    await expect(page).toHaveURL(/\/lessons/)
    await expect(page.getByTestId('lessons-page')).toBeVisible({ timeout: 10000 })

    // Test navigation to Timetable
    await page.getByRole('link', { name: /timetable/i }).click()
    await expect(page).toHaveURL(/\/timetable/)
    await expect(page.getByTestId('timetable-page')).toBeVisible({ timeout: 10000 })

    // Test navigation to Todos
    await page.getByRole('link', { name: /todos/i }).click()
    await expect(page).toHaveURL(/\/todos/)
    await expect(page.getByTestId('todos-page')).toBeVisible({ timeout: 10000 })

    // Test navigation back to Dashboard
    await page.getByRole('link', { name: /dashboard/i }).click()
    await expect(page).toHaveURL(/\/dashboard/)
    await expect(page.getByTestId('dashboard-page')).toBeVisible({ timeout: 10000 })

    console.log(`✅ Main navigation works in ${browserName}`)
  })

  test('should handle browser back/forward buttons', async ({ page, browserName }) => {
    console.log(`Testing browser navigation in ${browserName}`)

    // Navigate to different pages
    await page.getByRole('link', { name: /students/i }).click()
    await expect(page).toHaveURL(/\/students/)

    await page.getByRole('link', { name: /lessons/i }).click()
    await expect(page).toHaveURL(/\/lessons/)

    // Test browser back button
    await page.goBack()
    await expect(page).toHaveURL(/\/students/)
    await expect(page.getByTestId('students-page')).toBeVisible()

    // Test browser forward button
    await page.goForward()
    await expect(page).toHaveURL(/\/lessons/)
    await expect(page.getByTestId('lessons-page')).toBeVisible()

    console.log(`✅ Browser navigation works in ${browserName}`)
  })

  test('should handle direct URL access', async ({ page, browserName }) => {
    console.log(`Testing direct URL access in ${browserName}`)

    // Test direct access to various pages
    const testRoutes = [
      { url: '/students', testId: 'students-page' },
      { url: '/lessons', testId: 'lessons-page' },
      { url: '/timetable', testId: 'timetable-page' },
      { url: '/todos', testId: 'todos-page' },
      { url: '/settings', testId: 'settings-page' },
    ]

    for (const route of testRoutes) {
      await page.goto(route.url)
      await expect(page).toHaveURL(new RegExp(route.url))
      await expect(page.getByTestId(route.testId)).toBeVisible({ timeout: 10000 })
    }

    console.log(`✅ Direct URL access works in ${browserName}`)
  })

  test('should show 404 page for invalid routes', async ({ page, browserName }) => {
    console.log(`Testing 404 handling in ${browserName}`)

    // Navigate to non-existent route
    await page.goto('/non-existent-page')

    // Should show 404 page or redirect to dashboard
    const is404 = await page.getByText(/404|not found/i).isVisible()
    const isDashboard = await page.getByTestId('dashboard-page').isVisible()

    expect(is404 || isDashboard).toBe(true)

    console.log(`✅ 404 handling works in ${browserName}`)
  })

  test('should maintain navigation state during interactions', async ({ page, browserName }) => {
    console.log(`Testing navigation state persistence in ${browserName}`)

    // Navigate to students page
    await page.getByRole('link', { name: /students/i }).click()
    await expect(page).toHaveURL(/\/students/)

    // Perform some interactions (if elements exist)
    try {
      const addButton = page.getByRole('button', { name: /add student/i })
      if (await addButton.isVisible({ timeout: 2000 })) {
        await addButton.click()
        // Close any modal that might open
        const cancelButton = page.getByRole('button', { name: /cancel/i })
        if (await cancelButton.isVisible({ timeout: 2000 })) {
          await cancelButton.click()
        }
      }
    } catch (error) {
      console.log('No add student interaction available, continuing...')
    }

    // Verify we're still on the students page
    await expect(page).toHaveURL(/\/students/)
    await expect(page.getByTestId('students-page')).toBeVisible()

    console.log(`✅ Navigation state persistence works in ${browserName}`)
  })
})