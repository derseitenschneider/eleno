import type { Locator, Page } from '@playwright/test'
import { BasePMO } from './BasePMO'

export class SubscriptionPMO extends BasePMO {
  readonly page: Page
  readonly statusBadge: Locator
  readonly plan: Locator
  readonly startDate: Locator
  readonly endDate: Locator
  readonly pricingTitle: Locator
  readonly currencySwitchCHF: Locator
  readonly currencySwitchEUR: Locator
  readonly buttonCheckoutMonthly: Locator
  readonly buttonCheckoutYearly: Locator
  readonly buttonCheckoutLifetime: Locator
  readonly trialBanner: Locator

  constructor(page: Page) {
    super(page)
    this.page = page
    this.statusBadge = page.getByTestId('subscription-status-badge')
    this.plan = page.getByTestId('subscription-plan')
    this.startDate = page.getByTestId('subscription-period-start')
    this.endDate = page.getByTestId('subscription-period-end')
    this.pricingTitle = page.getByRole('heading', { name: 'upgrade' })
    this.currencySwitchCHF = page.getByTestId('currency-switcher-chf')
    this.currencySwitchEUR = page.getByTestId('currency-switcher-eur')
    this.buttonCheckoutMonthly = page.getByTestId('pricing-checkout-monthly')
    this.buttonCheckoutYearly = page.getByTestId('pricing-checkout-yearly')
    this.buttonCheckoutLifetime = page.getByTestId('pricing-checkout-lifetime')
    this.trialBanner = page.getByTestId('banner-trial')
  }

  async goto() {
    await this.page.goto('/settings/subscription')
  }

  async upgradeMonthly() {
    await this.currencySwitchCHF.click()
    await this.buttonCheckoutMonthly.click()
  }

  async interceptServerResponse() {
    await this.page.route('**/stripe/session/create', (route) => {
      route.fulfill({
        status: 200,
        body: 'Stripe server intercepted',
      })
    })
  }

  async interceptStripeResponse() {
    await this.page.route('https://checkout.stripe.com/**', (route) => {
      route.fulfill({
        status: 200,
        body: 'Stripe checkout intercepted',
      })
    })
  }
}
