import { useUser } from '@/services/context/UserContext'
import { useUserLocale } from '@/services/context/UserLocaleContext'
import { Link } from 'react-router-dom'

export default function SubscriptionPage() {
  const { user } = useUser()
  const { userLocale } = useUserLocale()

  const basePathYearly = 'https://buy.stripe.com/test_6oEeYWeVR3wW7mwfZ0'

  if (!user) return null

  const searchParams = {
    prefilled_email: user.email,
    locale: userLocale,
    client_reference_id: user.id,
  } as const

  const queryString = `?${Object.keys(searchParams)
    .map((k) => `${k}=${searchParams[k]}`)
    .join('&')}`

  return (
    <div>
      <h1>Subscribe</h1>
      <div className='flex gap-4'>
        <Link to={basePathYearly + queryString} target='_blank'>
          Jährlich abschliessen
        </Link>
      </div>
    </div>
  )
}
