import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { appConfig } from '@/config'
import { useSubscription } from '@/services/context/SubscriptionContext'
import { useNavigate } from 'react-router-dom'

export type BlockerProps = {
  variant?: 'inline' | 'block'
  blockerId?: string
}

export function Blocker({ variant = 'block', blockerId = '' }: BlockerProps) {
  const { hasAccess } = useSubscription()
  const { isDemoMode } = appConfig
  const navigate = useNavigate()

  if (hasAccess || isDemoMode) return null

  if (variant === 'inline')
    return (
      <div
        data-testid={`access-blocker${blockerId && `-${blockerId}`}`}
        className='absolute inset-0 z-50 p-2 backdrop-blur-[2px]'
      >
        <div className='flex w-fit items-center gap-6 bg-background100'>
          <p>Nur im Abo verfügbar</p>
          <Button size='sm' onClick={() => navigate('/settings/subscription')}>
            Abo abschliessen
          </Button>
        </div>
      </div>
    )

  return (
    <div
      data-testid={`access-blocker${blockerId && `-${blockerId}`}`}
      className='absolute inset-[-12px] z-50 flex flex-col items-center justify-center rounded-md backdrop-blur-[2px]'
    >
      <Card className='flex flex-col items-center justify-center p-5'>
        <p className='mb-6'>Nur im Abo verfügbar</p>
        <Button size='sm' onClick={() => navigate('/settings/subscription')}>
          Abo abschliessen
        </Button>
      </Card>
    </div>
  )
}
