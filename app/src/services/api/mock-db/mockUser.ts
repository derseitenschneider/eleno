import type { Profile } from '../../../types/types'

const mockUser: Profile = {
  email: 'marlene.muster@demo.net',
  first_name: 'Marlene',
  last_name: 'Muster',
  id: 'mock-user-123456',
  lifetime_membership: false,
  stripe_customer: null,
  stripe_subscription: false,
  login_count: 10_000,
}

export default mockUser
