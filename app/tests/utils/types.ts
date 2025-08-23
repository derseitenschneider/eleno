import type { User } from '@supabase/supabase-js'
import type Stripe from 'stripe'

export interface TestData {
  userId: string
  customerId?: string
  clockId?: string | null
  testUserEmail?: string
  defaultStudentId?: string
  groupId?: string
  additionalStudentIds?: string[]
}

export interface CrossBrowserTestData extends TestData {
  testUserEmail: string
  defaultStudentId: string
}

export interface TestUserExtended {
  user: User | null
  customer: Stripe.Response<Stripe.Customer> | null
  email: string
  studentId: string
}

export interface StatusElement {
  index: number
  text?: string
  backgroundColor: string
  color: string
  className: string
  dataStatus?: string | null
}

export interface StatusGroup {
  status: string
  count: number
  examples: StatusElement[]
}

export interface RepertoireStatusAnalysis {
  totalStatuses: number
  statusGroups: StatusGroup[]
}
