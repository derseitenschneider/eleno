import useFeatureFlag from '@/hooks/useFeatureFlag'
import useIsMobileDevice from '@/hooks/useIsMobileDevice'
import useIsOnline from '@/hooks/useIsOnline'
import { cn } from '@/lib/utils'
import { useSubscription } from '@/services/context/SubscriptionContext'
import { Link } from 'react-router-dom'

function Banner() {
  const isOnline = useIsOnline()
  const isMobile = useIsMobileDevice()
  const isPaymentFlagEnabled = useFeatureFlag('stripe-payment')
  const { subscriptionState, subscription } = useSubscription()
  const diffInTime =
    new Date(subscription?.period_end || '').getTime() - new Date().getTime()
  const daysRemaining = diffInTime / (1000 * 60 * 60 * 24)
  return false


  if (!isOnline)
    return (
      <div className='fixed top-0 z-40 w-full bg-amber-700 p-1 text-center text-sm text-white'>
        Du bist momentan offline.
      </div>
    )

  if (!isPaymentFlagEnabled) {
    return null
  }

  if (subscriptionState === 'TRIAL_ACTIVE' && !isMobile)
    return (
      <div
        data-testid='banner-trial'
        className={cn(
          daysRemaining > 5 ? 'bg-background100' : 'bg-destructive/20',
          'fixed top-0 z-40 flex w-full justify-center gap-2 border-b border-hairline  p-1 text-center text-sm',
        )}
      >
        <p>
          Du bist aktuell im Testabo und kannst noch{' '}
          <span className='font-medium text-primary'>
            {Math.ceil(daysRemaining)} Tag{daysRemaining > 1 && 'e'}
          </span>{' '}
          gratis testen.{' '}
          <Link to='/settings/subscription#pricing' className='underline'>
            Jetzt Abo abschliessen
          </Link>
        </p>
      </div>
    )

  if (subscriptionState === 'TRIAL_EXPIRED' && !isMobile)
    return (
      <div
        data-testid='banner-trial-expired'
        className='fixed top-0 z-40 flex w-full justify-center gap-2 border-b border-hairline bg-red-50 p-1 text-center text-sm'
      >
        <p>
          <span className='font-medium text-slate-700'>
            Dein Testabo ist abgelaufen!
          </span>{' '}
          <Link to='/settings/subscription#pricing' className='underline'>
            Jetzt Abo abschliessen
          </Link>
        </p>
      </div>
    )
  if (subscriptionState === 'SUBSCRIPTION_ACTIVE_EXPIRED' && !isMobile)
    return (
      <div
        data-testid='banner-payment-failed'
        className='fixed top-0 z-40 flex w-full justify-center gap-2 border-b border-hairline bg-red-50 p-1 text-center text-sm'
      >
        <p className='text-slate-700'>
          <span className='font-medium'>Aktion erforderlich:</span>
          {'  '}Deine Zahlung ist fehlgeschlagen!{'  '}
          <Link to='/settings/subscription#pricing' className='underline'>
            Zahlungsinformationen anpassen
          </Link>
        </p>
      </div>
    )

  if (subscriptionState === 'SUBSCRIPTION_CANCELED_EXPIRED' && !isMobile)
    return (
      <div
        data-testid='banner-subscription-inactive'
        className='fixed top-0 z-40 flex w-full justify-center gap-2 border-b border-hairline bg-red-50 p-1 text-center text-sm'
      >
        <p>
          <span className='font-medium text-slate-700'>
            Dein Abo ist inaktiv
          </span>
          {'  '}
          <Link to='/settings/subscription#pricing' className='underline'>
            Jetzt Abo abschliessen
          </Link>
        </p>
      </div>
    )
}
export default Banner
