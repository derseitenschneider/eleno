import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { PaymentMethod } from '@stripe/stripe-js'

export type TPaymentMethod = {
  brand: string
  last4: string
  exp_month: number
  exp_year: number
}

type PaymentMethodProps = {
  paymentMethod: PaymentMethod
}

export default function PaymentDetail({ paymentMethod }: PaymentMethodProps) {
  return (
    <div>
      <div className='flex flex-col gap-16'>
        <div className='space-y-4'>
          <Card className='px-6 py-4 !w-[300px] space-y-4'>
            <p className='capitalize font-bold text-xl'>
              {paymentMethod.card?.brand}
            </p>
            <hr />
            <p className='font-semibold'>**** {paymentMethod.card?.last4}</p>
            <div className='flex justify-between'>
              <div>
                <p className='text-sm'>Karteninhaber</p>
                <p className='font-semibold'>
                  {paymentMethod.billing_details.name}
                </p>
              </div>
              <div>
                <p className='text-sm'>Gültig bis</p>
                <p className='font-semibold'>
                  <span>{paymentMethod.card?.exp_month}</span>
                  <span>/</span>
                  <span>{paymentMethod.card?.exp_year}</span>
                </p>
              </div>
            </div>
          </Card>
          <Button size='sm'>Zahlungsmittel bearbeiten</Button>
        </div>
        <div className=''>
          <p className='font-bold'>Rechnungsadresse</p>
          <p>{paymentMethod.billing_details.name}</p>
          <p>{paymentMethod.billing_details.address?.line1}</p>
          <p>{paymentMethod.billing_details.address?.line2}</p>
          <p>
            <span>{paymentMethod.billing_details.address?.country} - </span>
            <span>{paymentMethod.billing_details.address?.postal_code} </span>
            <span>{paymentMethod.billing_details.address?.city}</span>
          </p>
          <Button size='sm' className='mt-4'>
            Rechnungsadresse anpassen
          </Button>
        </div>
      </div>
    </div>
  )
}
