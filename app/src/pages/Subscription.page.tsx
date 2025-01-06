import { SubscriptionInfos } from '@/components/features/subscription/SubscriptionInfos'
import { useUser } from '@/services/context/UserContext'
import { useUserLocale } from '@/services/context/UserLocaleContext'
import { Link } from 'react-router-dom'

const urlBasePath = 'https://buy.stripe.com/'

const slugs = {
  monthly: {
    test: 'test_00gbMK5lh5F4gX67sv',
    live: '',
  },
  yearly: {
    test: 'test_fZeg30fZV5F46is6ou',
    live: '',
  },
  lifeTime: {
    test: 'test_7sIg304hd5F47mw6ov',
    live: '',
  },
}

export default function SubscriptionPage() {
  const { user } = useUser()
  const { userLocale } = useUserLocale()

  if (!user) return null

  const searchParams = {
    prefilled_email: user.email,
    locale: userLocale,
    client_reference_id: user.id,
  }

  const queryString = `?${Object.entries(searchParams)
    .map(([k, v]) => `${k}=${v}`)
    .join('&')}`

  return (
    <>
      <div>
        <SubscriptionInfos />
        <div className='flex gap-4'>
          <Link
            to={urlBasePath + slugs.monthly.test + queryString}
            target='_blank'
          >
            Monatlich abschliessen
          </Link>
          <Link
            to={urlBasePath + slugs.yearly.test + queryString}
            target='_blank'
          >
            Jährlich abschliessen
          </Link>
          <Link
            to={urlBasePath + slugs.lifeTime.test + queryString}
            target='_blank'
          >
            Lifetime
          </Link>
        </div>
      </div>
    </>
  )
}
