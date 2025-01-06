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

interface ReactivateSubscriptionProps {
  onCloseModal?: () => void
}

function ReactivateSubscription({ onCloseModal }: ReactivateSubscriptionProps) {
  const { subscription } = useSubscription()
  async function handleReactivate() {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    const token = session?.access_token

    const res = await fetch(
      `${appConfig.apiUrl}/subscriptions/${subscription?.stripe_subscription_id}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    )
    const data = await res.json()
    console.log(data)
  }
  return (
    <div>
      <DialogHeader>
        <DialogTitle>Abo reaktivieren</DialogTitle>
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
            // disabled={}
            size='sm'
            variant='default'
            onClick={handleReactivate}
          >
            Abo reaktivieren
          </Button>
          {/* {isDeleting && <MiniLoader />} */}
        </div>
      </div>
      {/* {isError && ( */}
      {/*   <p className='mt-4 text-center text-sm text-warning'> */}
      {/*     Es ist etwas schiefgelaufen. Versuch's nochmal. */}
      {/*   </p> */}
      {/* )} */}
    </div>
  )
}

export default ReactivateSubscription
