import LifetimeTeaser from '@/components/features/subscription/LifetimeTeaser.component'
import PricingPlans from '@/components/features/subscription/PricingPlans.component'
import { SubscriptionInfos } from '@/components/features/subscription/infos/SubscriptionInfos'
import { useSubscription } from '@/services/context/SubscriptionContext'
export default function SubscriptionPage() {
  const { subscription } = useSubscription()

  if (!subscription) return null
  return (
    <div className=''>
      <SubscriptionInfos />
      <LifetimeTeaser />
      <PricingPlans />
    </div>
  )
}
