import { expect, type Locator, type Page } from '@playwright/test'

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
    // Wait for the page to be fully loaded
    // await this.page.waitForLoadState('networkidle')

    // Wait for subscription data to load
    try {
      await expect(
        this.page.getByTestId('subscription-status-badge'),
      ).toBeVisible({ timeout: 10000 })
    } catch (error) {
      console.warn(
        'Warning: Subscription status badge not found within timeout',
      )
    }
  }

  async upgradeMonthly() {
    await this.currencySwitchCHF.click()
    await this.buttonCheckoutMonthly.click()
  }

  async interceptAPIResponse(serverRoute: string = '**/stripe/session/create') {
    await this.page.route(serverRoute, (route) => {
      route.fulfill({
        status: 200,
        body: 'API server intercepted',
      })
    })
  }

  async interceptStripeResponse(
    stripeRoute = 'https://checkout.stripe.com/**',
  ) {
    await this.page.route(stripeRoute, (route) => {
      route.fulfill({
        status: 200,
        body: 'Stripe checkout intercepted',
      })
    })
  }
}
