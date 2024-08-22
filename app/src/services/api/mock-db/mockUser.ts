import type { User } from '../../../types/types'

const mockUser: User = {
  email: 'demo@eleno.net',
  firstName: 'Demo',
  lastName: 'Demo',
  id: 'mock-user-123456',
  lifetime_membership: false,
  stripe_customer: null,
  stripe_subscription: false,
}

export default mockUser
