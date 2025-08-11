import MiniLoader from '@/components/ui/MiniLoader.component'
import { Button } from '@/components/ui/button'
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { appConfig } from '@/config'
import supabase from '@/services/api/supabase'
import { useSubscription } from '@/services/context/SubscriptionContext'
import { useUser } from '@/services/context/UserContext'
import { useState } from 'react'
import { toast } from 'sonner'
import useMessagesQuery from '../messages/messagesQueries'
import useProfileQuery from '../user/profileQuery'

interface ReactivateSubscriptionProps {
  onCloseModal?: () => void
}

function ReactivateSubscription({ onCloseModal }: ReactivateSubscriptionProps) {
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'ERROR'>('IDLE')
  const { data: userProfile } = useProfileQuery()
  const { subscription } = useSubscription()
  const { refetch: refetchMessages } = useMessagesQuery()

  async function handleReactivate() {
    if (!userProfile) return
    setStatus('LOADING')
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      const token = session?.access_token

      const res = await fetch(
        `${appConfig.apiUrl}/stripe/subscriptions/${subscription?.stripe_subscription_id}/reactivate`,
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
      toast.info('Dein Abo wurde wiederhergestellt.')
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
        <DialogTitle>Abo wiederherstellen</DialogTitle>
      </DialogHeader>

      <DialogDescription>
        Wenn du dein Abo wiederherstellst, wird deine Laufzeit automatisch
        verlängert, sobald sie abläuft.
      </DialogDescription>
      <div className='mt-4 flex justify-end gap-4'>
        <Button size='sm' variant='outline' onClick={onCloseModal}>
          Abbrechen
        </Button>
        <div className='flex items-center gap-2'>
          <Button
            disabled={status === 'LOADING'}
            size='sm'
            variant='default'
            onClick={handleReactivate}
          >
            Abo wiederherstellen
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

export default ReactivateSubscription
