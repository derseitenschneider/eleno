import { Link } from 'react-router-dom'

export default function SubscriptionPage() {
  const linkYearly = 'https://buy.stripe.com/test_3csg305lh2sS7mw5kl'

  const linkMonthly = 'https://buy.stripe.com/test_6oEeYWeVR3wW7mwfZ0'
  const prefilledEmail = 'test@test.com'
  const locale = 'de'

  return (
    <div>
      <h1>Subscribe</h1>
      <Link
        to={`${linkMonthly}?prefilled_email=${prefilledEmail}&locale=${locale}`}
        target='_blank'
      >
        Monatlich abschliessen
      </Link>
      <Link
        to={`${linkYearly}?prefilled_email=${prefilledEmail}&locale=${locale}`}
        target='_blank'
      >
        Jährlich abschliessen
      </Link>
    </div>
  )
}
