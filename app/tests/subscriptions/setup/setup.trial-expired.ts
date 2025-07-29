import { test as setup, expect } from '@playwright/test'
import { setupTrialExpired } from '../../utils/setupHelpers'
import { loginUser } from '../../utils/loginUser'

setup(
  'create trial user, authenticate and then expire subscription',
  async ({ page }) => {
    const { email, password, authFile } = await setupTrialExpired()

    await loginUser(email, password, authFile, page)
  },
)
