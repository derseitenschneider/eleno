import { expect, test as setup } from '@playwright/test'
import { loginUser } from '../../utils/loginUser'
import { setupTrialActive } from '../../utils/setupHelpers'

setup('create trial user and authenticate', async ({ page }) => {
  const { email, password, authFile } = await setupTrialActive()

  await loginUser(email, password, authFile, page)
})
