import { useSubscription } from '@/services/context/SubscriptionContext'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PricingPlanCH from './PricingPlanCH.component'

const PricingPlans = () => {
  const { isActiveSubscription, isTrial } = useSubscription()

  if (isActiveSubscription && !isTrial) return null

  return (
    <div id='pricing' className=''>
      <h3 className='text-center font-bold'>Jetzt upgraden!</h3>
      <Tabs defaultValue='chf' className='w-full flex flex-col items-center'>
        <TabsList>
          <TabsTrigger value='chf'>CHF</TabsTrigger>
          <TabsTrigger value='eur'>EUR</TabsTrigger>
        </TabsList>
        <TabsContent value='chf'>
          <PricingPlanCH />
        </TabsContent>
        <TabsContent value='password'>Change your password here.</TabsContent>
      </Tabs>
    </div>
  )
}

export default PricingPlans
