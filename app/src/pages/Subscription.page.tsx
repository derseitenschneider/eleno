import ButtonCheckoutLifetime from '@/components/features/subscription/buttons/ButtonCheckoutLifetime.component'
import PricingPlans from '@/components/features/subscription/PricingPlans.component'
import { SubscriptionInfos } from '@/components/features/subscription/SubscriptionInfos'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSubscription } from '@/services/context/SubscriptionContext'
export default function SubscriptionPage() {
  const { subscription, isLifetime, isTrial } = useSubscription()

  if (!subscription) return null
  return (
    <div className=''>
      <SubscriptionInfos />
      {!isLifetime && !isTrial && (
        <div className='py-7 flex flex-row justify-between gap-4'>
          <div>
            <h2 className='text-primary'>Upgrade auf Lifetime</h2>
            <p className='w-[50ch]'>
              Spare langfristig mit unserem Lifetime-Abo. Statt monatlicher
              Zahlungen erhältst du mit einer einmaligen Investition
              unbegrenzten Zugriff auf alle aktuellen und zukünftigen
              Premium-Features.
            </p>
          </div>
          <Card className='sm:w-fit'>
            <CardHeader>
              <CardTitle>Lifetime</CardTitle>
              <div className='mt-4'>
                <span className='text-3xl font-bold'>CHF 199</span>
                <span className='text-muted-foreground'>/einmalig</span>
              </div>
            </CardHeader>
            <CardContent>
              {/* <ul className='space-y-4 mb-8'> */}
              {/*   {commonFeatures.map((feature) => ( */}
              {/*     <li key={feature} className='flex items-center gap-2'> */}
              {/*       <Check className='h-5 w-5 text-green-500' /> */}
              {/*       <span>{feature}</span> */}
              {/*     </li> */}
              {/*   ))} */}
              {/* </ul> */}
              <ButtonCheckoutLifetime variant='default'>
                Jetzt upgraden
              </ButtonCheckoutLifetime>
            </CardContent>
          </Card>
        </div>
      )}
      <PricingPlans />
    </div>
  )
}
