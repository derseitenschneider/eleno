import { useSubscription } from '@/services/context/SubscriptionContext'
import { Button } from '@/components/ui/button'
import Skeleton from '@/components/ui/skeleton'
import useOrganizationQuery from '../organizationQuery'

export function OrganizationRow() {
  const { subscriptionState } = useSubscription()
  const { data: organization } = useOrganizationQuery()

  if (subscriptionState !== 'LICENSED') return null

  return (
    <>
      <p>Organisation:</p>
      {!organization ? (
        <div className='space-y-1'>
          <Skeleton className='size-5 w-48 rounded-full' />
          <Skeleton className='size-5 w-36 rounded-full' />
          <Skeleton className='size-5 w-36 rounded-full' />
          <Skeleton className='size-5 w-32 rounded-full' />
        </div>
      ) : (
        <div className='flex flex-col gap-1'>
          <span className='font-medium'>{organization?.name}</span>
          <span>
            {organization?.street} {organization?.street_number}
          </span>

          <span>
            {organization?.zip_code} {organization?.city}
          </span>
          <Button
            onClick={() => {
              window.location.href = `mailto:${organization?.admin_contact_email}`
            }}
            className='mt-4'
            size='sm'
          >
            Admin kontaktieren
          </Button>
        </div>
      )}
    </>
  )
}
