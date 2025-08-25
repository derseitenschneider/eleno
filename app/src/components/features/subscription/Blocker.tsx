import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { appConfig } from '@/config'
import { useSubscription } from '@/services/context/SubscriptionContext'

export type BlockerProps = {
  variant?: 'inline' | 'block'
  blockerId?: string
}

export function Blocker({ variant = 'block', blockerId = '' }: BlockerProps) {
  const { hasAccess } = useSubscription()
  const navigate = useNavigate()

  if (hasAccess) return null

  if (variant === 'inline')
    return (
      <div
        data-testid={`access-blocker${blockerId && `-${blockerId}`}`}
        className='absolute left-0 top-0 z-50 h-fit w-full p-2 backdrop-blur-[2px] lg:top-[-2px]'
      >
        <div className='mx-auto flex w-fit items-center gap-4 rounded-sm border border-hairline bg-background100 p-2 px-4 shadow-sm lg:mt-[-10px]'>
          <p>Nur im Abo verfügbar.</p>
          <Button size='sm' onClick={() => navigate('/settings/subscription')}>
            Jetzt Abo abschliessen
          </Button>
        </div>
      </div>
    )

  return (
    <div
      data-testid={`access-blocker${blockerId && `-${blockerId}`}`}
      className='absolute inset-[-0px] z-50 flex flex-col items-center justify-center rounded-md backdrop-blur-[3px]'
    >
      <Card className='flex max-w-[90vw] flex-col items-center justify-center p-5 shadow-sm'>
        <h4 className='mb-2 font-medium'>Nur im Abo verfügbar</h4>
        <p className='mb-6 max-w-[35ch] text-center'>
          Diese Funktion ist Teil unseres Premium-Plans. Schliesse jetzt ein Abo
          ab, um darauf zuzugreifen.
        </p>
        <Button onClick={() => navigate('/settings/subscription')}>
          Jetzt Abo abschliessen
        </Button>
      </Card>
    </div>
  )
}
