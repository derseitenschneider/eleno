import { test as setup, expect } from '@playwright/test'
import { setupTrialActive } from '../../utils/setupHelpers'
import { loginUser } from '../../utils/loginUser'

setup('create trial user and authenticate', async ({ page }) => {
  const { email, password, authFile } = await setupTrialActive()

  await loginUser(email, password, authFile, page)
})
