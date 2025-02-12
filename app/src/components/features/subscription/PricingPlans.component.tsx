import { useSubscription } from '@/services/context/SubscriptionContext'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PricingPlanCHF from './PricingPlanCHF.component'
import PricingPlanEUR from './PricingPlanEUR.component'

const PricingPlans = () => {
  const { hasAccess, isTrial } = useSubscription()

  if (hasAccess() && !isTrial) return null

  return (
    <div id='pricing'>
      <h3 className='text-center mt-6 font-bold'>Jetzt upgraden!</h3>
      <Tabs defaultValue='chf' className='w-full flex flex-col items-center'>
        <TabsList className='mb-12'>
          <TabsTrigger value='chf'>CHF</TabsTrigger>
          <TabsTrigger value='eur'>EUR</TabsTrigger>
        </TabsList>
        <TabsContent value='chf'>
          <PricingPlanCHF />
        </TabsContent>
        <TabsContent value='eur'>
          <PricingPlanEUR />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default PricingPlans
