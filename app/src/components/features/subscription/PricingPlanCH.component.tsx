import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import commonFeatures from './commonFeatures'
import ButtonCheckoutMonthly from './buttons/ButtonCheckoutMonthly.component'
import { Badge } from '@/components/ui/badge'
import ButtonCheckoutYearly from './buttons/ButtonCheckoutYearly.component'
import ButtonCheckoutLifetime from './buttons/ButtonCheckoutLifetime.component'
import { Check } from 'lucide-react'

export default function PricingPlanCH() {
  const currency = 'CHF'
  return (
    <div className='flex flex-col sm:flex-row gap-8 max-w-5xl w-full'>
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
          <ul className='space-y-4 mb-8'>
            {commonFeatures.map((feature) => (
              <li key={feature} className='flex items-center gap-2'>
                <Check className='h-5 w-5 text-green-500' />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <ButtonCheckoutMonthly variant='outline' currency={currency}>
            Jetzt starten
          </ButtonCheckoutMonthly>
        </CardContent>
      </Card>

      {/* Jährlich */}
      <Card className='flex-1 border-primary shadow-lg relative'>
        <div className='absolute -top-4 left-1/2 transform -translate-x-1/2'>
          <Badge
            variant='default'
            className='bg-background50 hover:bg-background50 font-bold'
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
            <div className='text-sm text-green-600 mt-1'>15% sparen</div>
          </div>
        </CardHeader>
        <CardContent>
          <ul className='space-y-4 mb-8'>
            {commonFeatures.map((feature) => (
              <li key={feature} className='flex items-center gap-2'>
                <Check className='h-5 w-5 text-green-500' />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <ButtonCheckoutYearly currency={currency}>
            Jetzt starten
          </ButtonCheckoutYearly>
        </CardContent>
      </Card>

      {/* Lebenslang */}
      <Card className='flex-1'>
        <CardHeader>
          <CardTitle>Lifetime</CardTitle>
          <div className='mt-4'>
            <span className='text-4xl font-bold'>
              {new Intl.NumberFormat('de-CH', {
                style: 'currency',
                currency,
                trailingZeroDisplay: 'stripIfInteger',
              }).format(199)}
            </span>
            <span className='text-muted-foreground'>/einmalig</span>
          </div>
        </CardHeader>
        <CardContent>
          <ul className='space-y-4 mb-8'>
            {commonFeatures.map((feature) => (
              <li key={feature} className='flex items-center gap-2'>
                <Check className='h-5 w-5 text-green-500' />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <ButtonCheckoutLifetime variant='outline' currency='EUR'>
            Jetzt starten
          </ButtonCheckoutLifetime>
        </CardContent>
      </Card>
    </div>
  )
}
