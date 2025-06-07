import { useSubscription } from '@/services/context/SubscriptionContext'
import { BadgeCheckIcon, Building } from 'lucide-react'

export default function PlanRow() {
  const { plan, subscriptionState } = useSubscription()
  return (
    <>
      <p>Plan:</p>
      <div data-testid='subscription-plan' className='flex items-center gap-1'>
        {subscriptionState === 'LIFETIME' && (
          <BadgeCheckIcon className='text-primary' size={20} />
        )}
        {subscriptionState === 'LICENSED_ACTIVE' && (
          <Building className='text-primary' size={20} />
        )}
        {plan}
      </div>
    </>
  )
}
