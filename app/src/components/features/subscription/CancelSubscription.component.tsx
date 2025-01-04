import { Button } from '@/components/ui/button'
import MiniLoader from '@/components/ui/MiniLoader.component'
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { appConfig } from '@/config'
import { useUser } from '@/services/context/UserContext'
import supabase from '@/services/api/supabase'

interface CancelSubscriptionProps {
  onCloseModal?: () => void
}

function CancelSubscription({ onCloseModal }: CancelSubscriptionProps) {
  const { subscription } = useUser()
  async function handleDelete() {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    const token = session?.access_token

    const res = await fetch(
      `${appConfig.apiUrl}/subscriptions/${subscription?.stripe_subscription_id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    )
    console.log(res)
  }
  return (
    <div>
      <DialogHeader>
        <DialogTitle>Möchtest du dein Abo wirklich kündigen?</DialogTitle>
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
            variant='destructive'
            onClick={handleDelete}
          >
            Abo kündigen
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

export default CancelSubscription
