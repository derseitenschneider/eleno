import { type UserFlow } from '../utils/TestUser'

export type SubscriptionStates = {
  state: UserFlow
  access: boolean
  pricingTable: boolean
  lifetimeTeaser: boolean
  manageSubscription: boolean
  downloadInvoice: boolean
  forwardOneMonth?: boolean
  chfOnly?: boolean
  cancelReactivate?: boolean
  reactivateCancel?: boolean
}

export const subscriptionStates: Array<SubscriptionStates> = [
  // {
  //   state: 'trial-active',
  //   access: true,
  //   pricingTable: true,
  //   lifetimeTeaser: false,
  //   manageSubscription: false,
  //   downloadInvoice: false,
  // },
  //
  // {
  //   state: 'trial-expired',
  //   access: false,
  //   pricingTable: true,
  //   lifetimeTeaser: false,
  //   manageSubscription: false,
  //   downloadInvoice: false,
  // },
  //
  // {
  //   state: 'monthly-active',
  //   access: true,
  //   pricingTable: false,
  //   lifetimeTeaser: true,
  //   manageSubscription: true,
  //   downloadInvoice: false,
  //   cancelReactivate: true,
  // },
  //
  // {
  //   state: 'monthly-monthly',
  //   access: true,
  //   pricingTable: false,
  //   lifetimeTeaser: true,
  //   manageSubscription: true,
  //   downloadInvoice: false,
  //   cancelReactivate: true,
  // },
  //
  // {
  //   state: 'monthly-lifetime',
  //   access: true,
  //   pricingTable: false,
  //   lifetimeTeaser: false,
  //   manageSubscription: false,
  //   downloadInvoice: true,
  // },
  //
  // {
  //   state: 'monthly-canceled',
  //   access: true,
  //   pricingTable: false,
  //   lifetimeTeaser: true,
  //   manageSubscription: true,
  //   downloadInvoice: false,
  //   reactivateCancel: true,
  // },
  //
  // {
  //   state: 'monthly-expired',
  //   access: true,
  //   pricingTable: false,
  //   lifetimeTeaser: true,
  //   manageSubscription: true,
  //   downloadInvoice: false,
  // },
  //
  // {
  //   state: 'monthly-expired-canceled',
  //   access: false,
  //   pricingTable: true,
  //   lifetimeTeaser: false,
  //   manageSubscription: false,
  //   downloadInvoice: false,
  //   chfOnly: true,
  // },
  //
  // {
  //   state: 'monthly-canceled-expired',
  //   access: false,
  //   pricingTable: true,
  //   lifetimeTeaser: false,
  //   manageSubscription: false,
  //   downloadInvoice: false,
  //   forwardOneMonth: true,
  // },
  //
  // {
  //   state: 'monthly-expired-paid',
  //   access: true,
  //   pricingTable: false,
  //   lifetimeTeaser: true,
  //   manageSubscription: true,
  //   downloadInvoice: false,
  //   cancelReactivate: true,
  // },
  //
  // {
  //   state: 'trial-lifetime',
  //   access: true,
  //   pricingTable: false,
  //   lifetimeTeaser: false,
  //   manageSubscription: false,
  //   downloadInvoice: true,
  // },
  // {
  //   state: 'monthly-yearly',
  //   access: true,
  //   pricingTable: false,
  //   lifetimeTeaser: true,
  //   manageSubscription: true,
  //   downloadInvoice: false,
  // },
  // {
  //   state: 'yearly-monthly',
  //   access: true,
  //   pricingTable: false,
  //   lifetimeTeaser: true,
  //   manageSubscription: true,
  //   downloadInvoice: false,
  //   cancelReactivate: true,
  // },
  // {
  //   state: 'yearly-active',
  //   access: true,
  //   pricingTable: false,
  //   lifetimeTeaser: true,
  //   manageSubscription: true,
  //   downloadInvoice: false,
  //   cancelReactivate: true,
  // },
  //
  // {
  //   state: 'yearly-yearly',
  //   access: true,
  //   pricingTable: false,
  //   lifetimeTeaser: true,
  //   manageSubscription: true,
  //   downloadInvoice: false,
  //   cancelReactivate: true,
  // },
  // {
  //   state: 'yearly-lifetime',
  //   access: true,
  //   pricingTable: false,
  //   lifetimeTeaser: false,
  //   manageSubscription: false,
  //   downloadInvoice: true,
  // },
  // {
  //   state: 'yearly-expired',
  //   access: true,
  //   pricingTable: false,
  //   lifetimeTeaser: true,
  //   manageSubscription: true,
  //   downloadInvoice: false,
  // },
  // {
  //   state: 'yearly-expired-canceled',
  //   access: false,
  //   pricingTable: true,
  //   lifetimeTeaser: false,
  //   manageSubscription: false,
  //   downloadInvoice: false,
  // },
  // {
  //   state: 'yearly-canceled',
  //   access: true,
  //   pricingTable: false,
  //   lifetimeTeaser: true,
  //   manageSubscription: true,
  //   downloadInvoice: false,
  //   reactivateCancel: true,
  // },
  // {
  //   state: 'yearly-canceled-expired',
  //   access: false,
  //   pricingTable: true,
  //   lifetimeTeaser: false,
  //   manageSubscription: false,
  //   downloadInvoice: false,
  //   forwardOneMonth: true,
  // },
  {
    state: 'yearly-expired-paid',
    access: true,
    pricingTable: false,
    lifetimeTeaser: true,
    manageSubscription: true,
    downloadInvoice: false,
    cancelReactivate: true,
  },
]
