import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ButtonCheckoutLifetime from './buttons/ButtonCheckoutLifetime.component'
import { useSubscription } from '@/services/context/SubscriptionContext'

export default function LifetimeTeaser() {
  const { subscriptionState, hasAccess } = useSubscription()

  if (
    !hasAccess ||
    subscriptionState === 'TRIAL_ACTIVE' ||
    subscriptionState === 'LIFETIME'
  ) {
    return null
  }

  return (
    <div className='py-7 flex flex-row justify-between gap-4'>
      <div>
        <h2 className='text-primary'>Upgrade auf Lifetime</h2>
        <p className='w-[50ch]'>
          Spare langfristig mit unserem Lifetime-Abo. Statt
          monatlicher/jährlicher Zahlungen erhältst du mit einer einmaligen
          Investition unbegrenzten Zugriff auf alle aktuellen und zukünftigen
          Premium-Features.
        </p>
      </div>
      <Tabs defaultValue='chf' className='flex flex-col items-center'>
        <TabsList className=''>
          <TabsTrigger value='chf'>CHF</TabsTrigger>
          <TabsTrigger value='eur'>EUR</TabsTrigger>
        </TabsList>
        <TabsContent value='chf'>
          <Card className='sm:w-fit'>
            <CardHeader>
              <CardTitle>Lifetime</CardTitle>
              <div className='mt-4'>
                <span className='text-3xl font-bold'>
                  {new Intl.NumberFormat('de-CH', {
                    style: 'currency',
                    currency: 'CHF',
                    trailingZeroDisplay: 'stripIfInteger',
                  }).format(199)}
                </span>
                <span className='text-muted-foreground'>/einmalig</span>
              </div>
            </CardHeader>
            <CardContent>
              <ButtonCheckoutLifetime currency='CHF' variant='default'>
                Jetzt upgraden
              </ButtonCheckoutLifetime>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='eur'>
          <Card className='sm:w-fit'>
            <CardHeader>
              <CardTitle>Lifetime</CardTitle>
              <div className='mt-4'>
                <span className='text-3xl font-bold'>
                  {new Intl.NumberFormat('de-CH', {
                    style: 'currency',
                    currency: 'EUR',
                    trailingZeroDisplay: 'stripIfInteger',
                  }).format(199)}
                </span>
                <span className='text-muted-foreground'>/einmalig</span>
              </div>
            </CardHeader>
            <CardContent>
              <ButtonCheckoutLifetime currency='EUR' variant='default'>
                Jetzt upgraden
              </ButtonCheckoutLifetime>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
