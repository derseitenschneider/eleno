import { type Page } from '@playwright/test'

export async function cleanupToasts(page: Page) {
  const toasts = await page.getByRole('status').all()
  for (const toast of toasts) {
    try {
      const closeButton = toast.getByRole('button', {
        name: 'Close toast',
      })
      await closeButton.click()
    } catch (error) {
      console.warn(
        'Could not find or click the close button on a toast.',
        error,
      )
    }
  }
}
