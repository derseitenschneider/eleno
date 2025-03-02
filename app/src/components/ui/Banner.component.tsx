import { isDemoMode } from '@/config'
import useIsOnline from '@/hooks/useIsOnline'
import { useSubscription } from '@/services/context/SubscriptionContext'
import { Link } from 'react-router-dom'

function Banner() {
  const isOnline = useIsOnline()
  const { subscriptionState, subscription } = useSubscription()
  const diffInTime =
    new Date(subscription?.period_end || '').getTime() - new Date().getTime()
  const daysRemaining = diffInTime / (1000 * 60 * 60 * 24)

  if (isDemoMode)
    return (
      <div className='z-40 fixed top-0 text-sm text-center w-full bg-primary p-1 text-white'>
        <b>Demo</b>
        <Link
          target='_blank'
          to='https://app.eleno.net/?page=signup'
          className='text-white ml-3 underline'
        >
          Jetzt Benutzerkonto erstellen
        </Link>
      </div>
    )

  if (!isOnline)
    return (
      <div className='z-40 fixed top-0 text-sm text-center w-full bg-amber-700 p-1 text-white'>
        Du bist momentan offline.
      </div>
    )

  if (subscriptionState === 'TRIAL_ACTIVE')
    return (
      <div className='z-40 border-b border-hairline fixed top-0 flex gap-2 text-sm justify-center text-center w-full bg-background100 p-1'>
        <p>
          Du bist aktuell im Testabo und kannst noch{' '}
          <b className='text-primary'>
            {Math.ceil(daysRemaining)} Tag{daysRemaining > 1 && 'e'}
          </b>{' '}
          gratis testen.{' '}
          <Link to='/settings/subscription#pricing' className='underline'>
            Jetzt Abo abschliessen
          </Link>
        </p>
      </div>
    )

  if (subscriptionState === 'TRIAL_EXPIRED')
    return (
      <div className='z-40 border-b border-hairline fixed top-0 flex gap-2 text-sm justify-center text-center w-full bg-warning/5 p-1'>
        <p>
          <b className=''>Dein Testabo ist abgelaufen!</b>{' '}
          <Link to='/settings/subscription#pricing' className='underline'>
            Jetzt Abo abschliessen
          </Link>
        </p>
      </div>
    )
  if (subscriptionState === 'SUBSCRIPTION_ACTIVE_EXPIRED')
    return (
      <div className='z-40 border-b border-hairline fixed top-0 flex gap-2 text-sm justify-center text-center w-full bg-warning/5 p-1'>
        <p>
          <b>Aktion erforderlich:</b>
          {'  '}Deine Zahlung ist fehlgeschlagen!{'  '}
          <Link to='/settings/subscription#pricing' className='underline'>
            Zahlungsinformationen anpassen
          </Link>
        </p>
      </div>
    )

  if (subscriptionState === 'SUBSCRIPTION_CANCELED_EXPIRED')
    return (
      <div className='z-40 border-b border-hairline fixed top-0 flex gap-2 text-sm justify-center text-center w-full bg-primary/5 p-1'>
        <p>
          <b>Dein Abo ist inaktiv</b>
          {'  '}
          <Link to='/settings/subscription#pricing' className='underline'>
            Jetzt Abo abschliessen
          </Link>
        </p>
      </div>
    )
}
export default Banner
