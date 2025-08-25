import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import MiniLoader from '@/components/ui/MiniLoader.component'
import { appConfig } from '@/config'
import supabase from '@/services/api/supabase'
import useMessagesQuery from '../messages/messagesQueries'
import useProfileQuery from '../user/profileQuery'
import useSubscriptionQuery from './subscriptionQuery'

interface CancelSubscriptionProps {
  onCloseModal?: () => void
}

function CancelSubscription({ onCloseModal }: CancelSubscriptionProps) {
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'ERROR'>('IDLE')
  const { refetch: refetchMessages } = useMessagesQuery()
  const { data: userProfile } = useProfileQuery()
  const { data: subscription, refetch: refetchSubscription } =
    useSubscriptionQuery()

  async function handleDelete() {
    if (!userProfile) return
    setStatus('LOADING')
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      const token = session?.access_token

      const res = await fetch(
        `${appConfig.apiUrl}/stripe/subscriptions/${subscription?.stripe_subscription_id}/cancel`,
        {
          method: 'POST',
          body: JSON.stringify({
            userId: userProfile.id,
            firstName: userProfile.first_name,
          }),
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      )
      const data = await res.json()
      if (data.status !== 'success') throw new Error()

      await refetchSubscription()
      toast.info('Dein Abo wurde gekündigt.')
      setStatus('IDLE')
      refetchMessages()
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
      <div className='mt-4 flex justify-end gap-4'>
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
          Es ist etwas schiefgelaufen. Bitte versuch's nochmal.
        </p>
      )}
    </div>
  )
}

export default CancelSubscription
