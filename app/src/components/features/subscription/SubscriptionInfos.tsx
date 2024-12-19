import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useUser } from '@/services/context/UserContext'
import { useUserLocale } from '@/services/context/UserLocaleContext'

export function SubscriptionInfos() {
  const { userLocale } = useUserLocale()
  const { subscription, subscriptionIsActive } = useUser()

  const isTrial = subscription?.subscription_status === 'trial'

  let plan = ''
  if (subscription?.subscription_status === 'trial') {
    plan = 'Probeabo'
  } else if (subscription?.subscription_status === 'lifetime') {
    plan = 'Lifetime'
  } else if (subscription?.amount === 580) {
    plan = 'Monatlich'
  } else plan = 'Jährlich'

  let startDate = ''
  let endDate = ''

  if (isTrial) {
    startDate = subscription.trial_start || ''
    endDate = subscription.trial_end || ''
  } else if (plan === 'Monatlich') {
    startDate = subscription?.updated_at || ''
    const endDateDate = new Date(startDate)
    endDateDate.setDate(endDateDate.getDate() + 30)
    endDate = endDateDate.toISOString()
  }

  const periodStart = new Date(startDate).toLocaleString(userLocale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  const trialEnd = new Date(endDate).toLocaleString(userLocale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  return (
    <div className='py-7'>
      <Card className='py-4 px-6 sm:w-fit'>
        <div className='grid grid-cols-[150px_1fr] gap-4 mb-6 w-fit'>
          <p>Status:</p>
          <Badge
            variant={subscriptionIsActive ? 'default' : 'secondary'}
            className='w-fit'
          >
            {subscriptionIsActive ? 'Aktiv' : 'Abgelaufen'}
          </Badge>
          <p>Plan:</p>
          <p>{plan}</p>
          <p>Laufzeit</p>
          <p className={cn(!subscriptionIsActive && 'text-warning')}>
            {periodStart} – {trialEnd}
          </p>
        </div>
        {subscriptionIsActive && !isTrial && (
          <Button size='sm' variant='destructive'>
            Abo kündigen
          </Button>
        )}
      </Card>
    </div>
  )
}
