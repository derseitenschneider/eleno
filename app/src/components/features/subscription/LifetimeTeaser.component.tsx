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
    <div
      data-testid='lifetime-teaser'
      className='flex flex-col justify-between gap-8 py-7 lg:flex-row lg:gap-4'
    >
      <div>
        <h2 className='text-primary'>Upgrade auf Lifetime</h2>
        <p className='sm:w-[50ch]'>
          Spare langfristig mit unserem Lifetime-Abo. Statt
          monatlicher/jährlicher Zahlungen erhältst du mit einer einmaligen
          Investition unbegrenzten Zugriff auf alle aktuellen und zukünftigen
          Premium-Features.
        </p>
      </div>
      <Tabs
        defaultValue='chf'
        className='mx-auto flex w-fit flex-col items-center lg:mx-0 lg:items-center'
      >
        <TabsList className=''>
          <TabsTrigger data-testid='currency-switcher-chf' value='chf'>
            CHF
          </TabsTrigger>
          <TabsTrigger data-testid='currency-switcher-eur' value='eur'>
            EUR
          </TabsTrigger>
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
                <span className='text-muted-foreground'>/einmalig*</span>
              </div>
            </CardHeader>
            <CardContent>
              <ButtonCheckoutLifetime currency='CHF' variant='default'>
                Jetzt upgraden
              </ButtonCheckoutLifetime>
              <p className='mt-2 text-xs'>
                * Limitiertes Anbegot bis{' '}
                <span className='font-bold'>12.06.2025</span>
              </p>
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
                <span className='text-muted-foreground'>/einmalig*</span>
              </div>
            </CardHeader>
            <CardContent>
              <ButtonCheckoutLifetime currency='EUR' variant='default'>
                Jetzt upgraden
              </ButtonCheckoutLifetime>
              <p className='mt-2 text-xs'>
                * Limitiertes Anbegot bis{' '}
                <span className='font-bold'>12.06.2025</span>
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
