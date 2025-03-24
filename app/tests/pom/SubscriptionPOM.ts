import type { Locator, Page } from '@playwright/test'

export class SubscriptionPOM {
  readonly page: Page
  readonly statusBadge: Locator
  readonly plan: Locator
  readonly startDate: Locator
  readonly endDate: Locator
  readonly pricingTable: Locator
  readonly lifetimeTeaser: Locator
  readonly currencySwitchCHF: Locator
  readonly currencySwitchEUR: Locator
  readonly buttonCheckoutMonthly: Locator
  readonly buttonCheckoutYearly: Locator
  readonly buttonCheckoutLifetime: Locator
  readonly trialBanner: Locator
  readonly trialBannerExpired: Locator
  readonly paymentFailedBanner: Locator

  constructor(page: Page) {
    this.page = page
    this.statusBadge = page.getByTestId('subscription-status-badge')
    this.plan = page.getByTestId('subscription-plan')
    this.startDate = page.getByTestId('subscription-period-start')
    this.endDate = page.getByTestId('subscription-period-end')
    this.pricingTable = page.getByTestId('pricing-table')
    this.lifetimeTeaser = page.getByTestId('lifetime-teaser')
    this.currencySwitchCHF = page.getByTestId('currency-switcher-chf')
    this.currencySwitchEUR = page.getByTestId('currency-switcher-eur')
    this.buttonCheckoutMonthly = page.getByTestId('pricing-checkout-monthly')
    this.buttonCheckoutYearly = page.getByTestId('pricing-checkout-yearly')
    this.buttonCheckoutLifetime = page.getByTestId('pricing-checkout-lifetime')
    this.trialBanner = page.getByTestId('banner-trial')
    this.trialBannerExpired = page.getByTestId('banner-trial-expired')
    this.paymentFailedBanner = page.getByTestId('banner-payment-failed')
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
