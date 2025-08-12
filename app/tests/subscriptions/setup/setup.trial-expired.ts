import { expect, test as setup } from '@playwright/test'
import { loginUser } from '../../utils/loginUser'
import { setupTrialExpired } from '../../utils/setupHelpers'

setup(
  'create trial user, authenticate and then expire subscription',
  async ({ page }) => {
    const { email, password, authFile } = await setupTrialExpired()

    await loginUser(email, password, authFile, page)
  },
)
