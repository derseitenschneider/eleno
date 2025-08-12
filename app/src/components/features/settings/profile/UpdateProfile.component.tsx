import MiniLoader from '@/components/ui/MiniLoader.component'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { updateFluentCRMContact } from '@/services/api/fluent-crm.api'
import { useSubscription } from '@/services/context/SubscriptionContext'
import { useState } from 'react'
import { toast } from 'sonner'
import useProfileQuery from '../../user/profileQuery'
import { useUpdateProfileMeta } from '../../user/useUpateProfileMeta'

interface EditProfileProps {
  onCloseModal?: () => void
}

// TODO: implement zod validation, both fields at least 3 chars
function EditProfile({ onCloseModal }: EditProfileProps) {
  const { hasAccess } = useSubscription()
  const { data: userProfile } = useProfileQuery()
  const { updateProfileMeta, isUpdating } = useUpdateProfileMeta()
  const [input, setInput] = useState({
    firstName: userProfile?.first_name || '',
    lastName: userProfile?.last_name || '',
  })

  const inputHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setInput((prev) => {
      return { ...prev, [name]: value }
    })
  }

  async function handleSave() {
    if (!userProfile?.email) return
    try {
      updateProfileMeta(input, {
        onSuccess: () => {
          toast.success('Profil angepasst.')
          onCloseModal?.()
        },
      })

      await updateFluentCRMContact({
        __force_update: 'yes',
        first_name: input.firstName,
        last_name: input.lastName,
        email: userProfile.email,
        status: 'subscribed',
      })
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div
      className={cn(
        isUpdating && 'opacity-80 pointer-events-none',
        'sm:min-w-[350px] p-1',
      )}
    >
      <div className='space-y-6'>
        <div>
          <Label htmlFor='firstName' className='label'>
            Vorname
          </Label>
          <Input
            id='firstName'
            type='text'
            name='firstName'
            className='firstName'
            value={input.firstName}
            onChange={inputHandler}
          />
        </div>
        <div>
          <Label htmlFor='lastName' className='label'>
            Nachname
          </Label>
          <Input
            type='text'
            id='lastName'
            name='lastName'
            className='lastName'
            value={input.lastName}
            onChange={inputHandler}
          />
        </div>
      </div>
      {onCloseModal && <Separator className='my-6 sm:hidden' />}
      <div className='flex flex-col-reverse justify-end gap-3 sm:mt-8 sm:flex-row'>
        {onCloseModal && (
          <Button
            disabled={isUpdating}
            size='sm'
            variant='outline'
            className='w-full sm:w-auto'
            onClick={onCloseModal}
          >
            Abbrechen
          </Button>
        )}
        <div className='flex w-full items-center gap-2 sm:w-auto'>
          <Button
            size='sm'
            disabled={
              isUpdating || !hasAccess || !input.firstName || !input.lastName
            }
            className='w-full sm:w-auto'
            onClick={handleSave}
          >
            Speichern
          </Button>
          {isUpdating && <MiniLoader />}
        </div>
      </div>
    </div>
  )
}

export default EditProfile
