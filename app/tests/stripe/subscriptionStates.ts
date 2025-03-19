export type SubscriptionStates = {
  state: string
  access: boolean
  pricingTable: boolean
  lifetimeTeaser: boolean
  manageSubscription: boolean
}
export const subscriptionStates: Array<SubscriptionStates> = [
  {
    state: 'trial-active',
    access: true,
    pricingTable: true,
    lifetimeTeaser: false,
    manageSubscription: false,
  },

  {
    state: 'trial-exipred',
    access: true,
    pricingTable: true,
    lifetimeTeaser: false,
    manageSubscription: false,
  },
  {
    state: 'monthly-active',
    access: true,
    pricingTable: false,
    lifetimeTeaser: true,
    manageSubscription: true,
  },
  {
    state: 'monthly-canceled',
    access: true,
    pricingTable: false,
    lifetimeTeaser: true,
    manageSubscription: true,
  },
]
