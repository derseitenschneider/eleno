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
              Spare langfristig mit unserem Lifetime-Abo. Statt
              monatlicher/jährlicher Zahlungen erhältst du mit einer einmaligen
              Investition unbegrenzten Zugriff auf alle aktuellen und
              zukünftigen Premium-Features.
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
