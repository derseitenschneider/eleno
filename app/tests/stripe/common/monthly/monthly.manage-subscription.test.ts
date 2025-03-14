import { test, expect } from '@playwright/test'
import { SubscriptionPMO } from '../../../pmo/SubscriptionPMO'

test.beforeEach(async ({ page }) => {
  const subscrptionPMO = new SubscriptionPMO(page)
  subscrptionPMO.goto()
})

test.skip('can cancel subscription', async ({ page }) => { })
test.skip('can manage subscription', async ({ page }) => { })
