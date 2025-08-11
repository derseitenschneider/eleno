import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Check } from 'lucide-react'
import ButtonCheckoutLifetime from './buttons/ButtonCheckoutLifetime.component'
import ButtonCheckoutMonthly from './buttons/ButtonCheckoutMonthly.component'
import ButtonCheckoutYearly from './buttons/ButtonCheckoutYearly.component'
import commonFeatures from './commonFeatures'

export default function PricingPlanEUR() {
  const currency = 'EUR'

  return (
    <div className='flex w-full max-w-5xl flex-col gap-x-4 gap-y-8 lg:flex-row'>
      {/* Monatlich */}
      <Card className='flex-1'>
        <CardHeader>
          <CardTitle>Monatlich</CardTitle>
          <div className='mt-4'>
            <span className='text-4xl font-bold'>
              {new Intl.NumberFormat('de-CH', {
                style: 'currency',
                currency,
              }).format(5.8)}
            </span>
            <span className='text-muted-foreground'>/Monat</span>
          </div>
        </CardHeader>
        <CardContent>
          <ButtonCheckoutMonthly variant='outline' currency={currency}>
            Jetzt starten
          </ButtonCheckoutMonthly>
          <ul className='mt-8 space-y-4'>
            {commonFeatures.map((feature) => (
              <li key={feature} className='flex items-start gap-2'>
                <Check className='mt-[2px] h-5 w-5 text-green-500' />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Jährlich */}
      <Card className='relative flex-1 border-primary shadow-lg lg:translate-y-[-28px]'>
        <div className='absolute -top-4 left-1/2 -translate-x-1/2 transform'>
          <Badge
            variant='default'
            className='bg-background50 font-bold hover:bg-background50'
          >
            Empfohlen
          </Badge>
        </div>
        <CardHeader>
          <CardTitle>Jährlich</CardTitle>
          <div className='mt-4'>
            <span className='text-4xl font-bold'>
              {new Intl.NumberFormat('de-CH', {
                style: 'currency',
                currency,
                trailingZeroDisplay: 'stripIfInteger',
              }).format(59)}
            </span>
            <span className='text-muted-foreground'>/Jahr</span>
            <div className='mt-1 text-sm text-green-600'>15% sparen</div>
          </div>
        </CardHeader>
        <CardContent>
          <ButtonCheckoutYearly variant='default' currency={currency}>
            Jetzt starten
          </ButtonCheckoutYearly>
          <ul className='mt-8 space-y-4'>
            {commonFeatures.map((feature) => (
              <li key={feature} className='flex items-start gap-2'>
                <Check className='mt-[2px] h-5 w-5 text-green-500' />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Lebenslang */}
      {/* <Card className='flex-1'> */}
      {/*   <CardHeader> */}
      {/*     <CardTitle>Lifetime</CardTitle> */}
      {/*     <div className='mt-4'> */}
      {/*       <span className='text-4xl font-bold'> */}
      {/*         {new Intl.NumberFormat('de-CH', { */}
      {/*           style: 'currency', */}
      {/*           currency, */}
      {/*           trailingZeroDisplay: 'stripIfInteger', */}
      {/*         }).format(199)} */}
      {/*       </span> */}
      {/*       <span className='text-muted-foreground'>/einmalig*</span> */}
      {/*     </div> */}
      {/*   </CardHeader> */}
      {/*   <CardContent> */}
      {/*     <ButtonCheckoutLifetime variant='outline' currency={currency}> */}
      {/*       Jetzt starten */}
      {/*     </ButtonCheckoutLifetime> */}
      {/*     <ul className='mt-8 space-y-4'> */}
      {/*       {commonFeatures.map((feature) => ( */}
      {/*         <li key={feature} className='flex items-center gap-2'> */}
      {/*           <Check className='h-5 w-5 text-green-500' /> */}
      {/*           <span>{feature}</span> */}
      {/*         </li> */}
      {/*       ))} */}
      {/*     </ul> */}
      {/*     <p className='mt-5 text-xs'> */}
      {/*       * Limitiertes Angebot bis{' '} */}
      {/*       <span className='font-bold'>12.06.2025</span> */}
      {/*     </p> */}
      {/*   </CardContent> */}
      {/* </Card> */}

      <Card className='flex-1'>
        <CardHeader>
          <CardTitle>Für Musikschulen</CardTitle>
          <div className='mt-4'>
            <p>
              Die Lösung für deine gesamte <b>Musikschule</b>. Ab 5 Lizenzen.
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => {
              window.location.href =
                'mailto:info@eleno.net?subject=Anfrage%20für%20Musikschul-Lizenzen'
            }}
            variant='outline'
            className='w-full'
          >
            Angebot einholen
          </Button>
          <ul className='mt-8 space-y-4'>
            {commonFeatures.map((feature) => (
              <li key={feature} className='flex items-start gap-2'>
                <Check className='mt-[2px] h-5 w-5 text-green-500' />
                <span>{feature}</span>
              </li>
            ))}
            <li className='flex items-center gap-2'>
              <Check className='h-5 w-5 text-green-500' />
              <span>Übertragbare Lizenzen</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
