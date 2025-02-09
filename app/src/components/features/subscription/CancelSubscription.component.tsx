import { Button } from '@/components/ui/button'
import MiniLoader from '@/components/ui/MiniLoader.component'
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { appConfig } from '@/config'
import supabase from '@/services/api/supabase'
import { useSubscription } from '@/services/context/SubscriptionContext'
import { useUser } from '@/services/context/UserContext'
import { toast } from 'sonner'
import { useState } from 'react'

interface CancelSubscriptionProps {
  onCloseModal?: () => void
}

function CancelSubscription({ onCloseModal }: CancelSubscriptionProps) {
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'ERROR'>('IDLE')
  const { user } = useUser()
  const { subscription, getSubscription } = useSubscription()

  async function handleDelete() {
    if (!user) return
    setStatus('LOADING')
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      const token = session?.access_token

      const res = await fetch(
        `${appConfig.apiUrl}/subscriptions/${subscription?.stripe_subscription_id}`,
        {
          method: 'DELETE',
          body: JSON.stringify({
            userId: user.id,
            firstName: user.first_name,
          }),
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      )
      const data = await res.json()
      if (data.status !== 'success') throw new Error()

      await getSubscription(user?.id)
      toast.info('Dein Abo wurde gekündigt.')
      setStatus('IDLE')
      onCloseModal?.()
    } catch (e) {
      setStatus('ERROR')
    }
  }

  return (
    <div>
      <DialogHeader>
        <DialogTitle>Möchtest du dein Abo wirklich beenden?</DialogTitle>
      </DialogHeader>

      <DialogDescription>
        Dein Abo ist nach der Kündigung noch bis zum Ende der Laufzeit aktiv. Du
        kannst alle erfassten Daten auch nach der Kündigung jederzeit einsehen.
      </DialogDescription>
      <div className='flex justify-end gap-4 mt-4'>
        <Button size='sm' variant='outline' onClick={onCloseModal}>
          Abbrechen
        </Button>
        <div className='flex items-center gap-2'>
          <Button
            disabled={status === 'LOADING'}
            size='sm'
            variant='destructive'
            onClick={handleDelete}
          >
            Abo kündigen
          </Button>
          {status === 'LOADING' && <MiniLoader />}
        </div>
      </div>
      {status === 'ERROR' && (
        <p className='mt-4 text-center text-sm text-warning'>
          Es ist etwas schiefgelaufen. Versuch's nochmal.
        </p>
      )}
    </div>
  )
}

export default CancelSubscription
