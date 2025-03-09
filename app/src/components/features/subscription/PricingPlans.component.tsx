import { useSubscription } from '@/services/context/SubscriptionContext'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PricingPlanCHF from './PricingPlanCHF.component'
import PricingPlanEUR from './PricingPlanEUR.component'

const PricingPlans = () => {
  const { hasAccess, subscriptionState } = useSubscription()

  if (hasAccess && subscriptionState !== 'TRIAL_ACTIVE') return null

  return (
    <div data-testid='pricing-table' id='pricing'>
      <h3 className='text-center mt-6 font-bold'>Jetzt upgraden!</h3>
      <Tabs defaultValue='chf' className='w-full flex flex-col items-center'>
        <TabsList className='mb-12'>
          <TabsTrigger data-testid='currency-switcher-chf' value='chf'>
            CHF
          </TabsTrigger>
          <TabsTrigger data-testid='currency-switcher-eur' value='eur'>
            EUR
          </TabsTrigger>
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
