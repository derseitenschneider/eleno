import { useState } from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useStripe as useStripeInit } from '../../../hooks/useStripe'
import { Button } from '@/components/ui/button'

interface SubscriptionResponse {
  requiresAction?: boolean
  clientSecret?: string
  error?: string
}

const StripeSubscriptionForm: React.FC = () => {
  const { stripe: stripeInit } = useStripeInit()
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState<boolean>(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setProcessing(true)

    if (!stripe || !elements) {
      setError('Stripe has not been initialized')
      setProcessing(false)
      return
    }

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) {
      setError('Card element not found')
      setProcessing(false)
      return
    }

    const { error: stripeError, paymentMethod } =
      await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      })

    if (stripeError) {
      setError(stripeError.message ?? 'An unknown error occurred')
      setProcessing(false)
      return
    }

    try {
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          priceId: 'your_price_id', // You might want to get this dynamically
        }),
      })

      const result: SubscriptionResponse = await response.json()

      if (result.requiresAction && result.clientSecret) {
        const { error: confirmError } = await stripe.confirmCardPayment(
          result.clientSecret,
        )
        if (confirmError) {
          setError(confirmError.message ?? 'An unknown error occurred')
        } else {
          // The payment has succeeded
          // Handle successful subscription (e.g., update UI, redirect)
        }
      } else if (result.error) {
        setError(result.error)
      } else {
        // Subscription created successfully
        // Handle successful subscription (e.g., update UI, redirect)
      }
    } catch (fetchError) {
      setError('An error occurred while processing your payment.')
    }

    setProcessing(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      {error && <div>{error}</div>}
      <Button size='sm' type='submit' disabled={!stripe || processing}>
        Abo abschliessen
      </Button>
    </form>
  )
}

export default StripeSubscriptionForm
