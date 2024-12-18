import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useUser } from '@/services/context/UserContext'

export function SubscriptionInfos() {
  const { subscription } = useUser()

  let plan = ''
  if (subscription?.subscription_status === 'lifetime') {
    plan = 'Lifetime'
  } else if (subscription?.amount === 580) {
    plan = 'Monatlich'
  } else plan = 'Jährlich'

  return (
    <div className='py-7'>
      <div className='grid grid-cols-[150px_1fr] gap-4 mb-6'>
        <p>Status:</p>
        <Badge className='w-fit'>Aktiv</Badge>
        <p>Plan:</p>
        <p>{plan}</p>
        <p>Laufzeit</p>
        <p className='text-red-500'>Fehlt noch</p>
      </div>
      <Button size='sm' variant='destructive'>
        Abo kündigen
      </Button>
    </div>
  )
}
