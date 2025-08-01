import { Badge, type badgeVariants } from '@/components/ui/badge'
import useIsMobileDevice from '@/hooks/useIsMobileDevice'
import { useSubscription } from '@/services/context/SubscriptionContext'
import type { VariantProps } from 'class-variance-authority'
import { differenceInDays } from 'date-fns'
import { useNavigate } from 'react-router-dom'

export default function SubscriptionStatusBadge() {
  const navigate = useNavigate()
  const isMobile = useIsMobileDevice()
  const { subscription } = useSubscription()

  const handleClick = () => {
    navigate('/settings/subscription')
  }

  let variant: VariantProps<typeof badgeVariants>['variant'] = 'secondary'
  let text = ''

  if (subscription) {
    const { subscription_status, plan, period_end, failed_payment_attempts } =
      subscription

    if (plan === 'lifetime') {
      variant = 'success'
      text = isMobile ? 'Lifetime' : 'Lifetime-Abonnement'
    } else if (failed_payment_attempts && failed_payment_attempts > 0) {
      variant = 'destructive'
      text = isMobile ? 'Zahlung offen' : 'Ihre Zahlung ist fehlgeschlagen'
    } else if (subscription_status === 'trial') {
      const daysRemaining =
        differenceInDays(new Date(period_end as string), new Date()) + 1
      if (daysRemaining > 0) {
        variant = 'default'
        text = isMobile
          ? `Noch ${daysRemaining} Tage`
          : `Testabo: Noch ${daysRemaining} Tage`
      } else {
        variant = 'destructive'
        text = isMobile
          ? 'Probezeit abgelaufen'
          : 'Ihre Probezeit ist abgelaufen'
      }
    } else {
      switch (subscription_status) {
        case 'active':
          variant = 'success'
          text = isMobile ? 'Aktiv' : 'Abonnement aktiv'
          break
        case 'canceled':
          variant = 'warning'
          text = isMobile ? 'Gekündigt' : 'Abo zum Periodenende gekündigt'
          break
        case 'expired':
          variant = 'destructive'
          text = isMobile ? 'Abgelaufen' : 'Abonnement abgelaufen'
          break
      }
    }
  } else {
    variant = 'destructive'
    text = isMobile ? 'Inaktiv' : 'Kein aktives Abo'
  }

  return (
    <Badge
      variant={variant}
      className='cursor-pointer'
      onClick={handleClick}
      data-testid='subscription-status-badge'
    >
      {text}
    </Badge>
  )
}
