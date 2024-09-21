import type { User } from '../../../types/types'

const mockUser: User = {
  email: 'marlene@muster.net',
  first_name: 'Sophie',
  last_name: 'Muster',
  id: 'mock-user-123456',
  lifetime_membership: false,
  stripe_customer: null,
  stripe_subscription: false,
  login_count: 10_000,
}

export default mockUser
