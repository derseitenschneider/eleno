import { type Stripe, loadStripe } from '@stripe/stripe-js'
import { useEffect, useState } from 'react'

export const useStripe = () => {
  const [stripe, setStripe] = useState<Stripe | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        const stripeInstance = await loadStripe(
          import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
        )
        if (stripeInstance) {
          setStripe(stripeInstance)
        } else {
          throw new Error('Failed to initialize Stripe')
        }
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('An unknown error occurred'),
        )
      }
    }

    initializeStripe()
  }, [])

  return { stripe, error }
}
