import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { appConfig } from '@/config'
import { useSubscription } from '@/services/context/SubscriptionContext'
import { useNavigate } from 'react-router-dom'

export type BlockerProps = {
  variant?: 'inline' | 'block'
}

export function Blocker({ variant = 'block' }: BlockerProps) {
  const { hasAccess } = useSubscription()
  const { isDemoMode } = appConfig
  const navigate = useNavigate()

  if (hasAccess() || isDemoMode) return null

  if (variant === 'inline')
    return (
      <div className='absolute p-2 inset-0 backdrop-blur-[2px] z-50'>
        <div className='bg-background100 flex w-fit items-center gap-6'>
          <p>Nur im Abo verfügbar</p>
          <Button size='sm' onClick={() => navigate('/settings/subscription')}>
            Abo abschliessen
          </Button>
        </div>
      </div>
    )

  return (
    <div className='absolute flex flex-col justify-center items-center rounded-md inset-[-12px] backdrop-blur-[2px] z-50'>
      <Card className='flex flex-col justify-center items-center p-5'>
        <p className='mb-6'>Nur im Abo verfügbar</p>
        <Button size='sm' onClick={() => navigate('/settings/subscription')}>
          Abo abschliessen
        </Button>
      </Card>
    </div>
  )
}
