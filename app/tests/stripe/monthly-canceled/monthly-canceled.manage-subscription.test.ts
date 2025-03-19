import { test, expect } from '@playwright/test'
import { SubscriptionPOM } from '../../pom/SubscriptionPOM'

test.beforeEach(async ({ page }) => {
  const subscrptionPom = new SubscriptionPOM(page)
  subscrptionPom.goto()
})

test.skip('can reactivate subscription', async ({ page }) => {})
test.skip('can manage subscription', async ({ page }) => {})
