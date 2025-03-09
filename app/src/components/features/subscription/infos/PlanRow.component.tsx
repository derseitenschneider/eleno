import { useSubscription } from '@/services/context/SubscriptionContext'
import { BadgeCheckIcon } from 'lucide-react'

export default function PlanRow() {
  const { plan, subscriptionState } = useSubscription()
  return (
    <>
      <p>Plan:</p>
      <div data-testid='subscription-plan' className='flex gap-1 items-center'>
        {subscriptionState === 'LIFETIME' && (
          <BadgeCheckIcon className='text-primary' size={20} />
        )}
        {plan}
      </div>
    </>
  )
}
