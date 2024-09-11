import type { User } from '../../../types/types'

const mockUser: User = {
  email: 'demo@eleno.net',
  first_name: 'Demo',
  last_name: 'Demo',
  id: 'mock-user-123456',
  lifetime_membership: false,
  stripe_customer: null,
  stripe_subscription: false,
  login_count: 10_000,
}

export default mockUser
