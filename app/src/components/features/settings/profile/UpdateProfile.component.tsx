import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import MiniLoader from '@/components/ui/MiniLoader.component'
import { useUpdateProfileMeta } from '../../user/useUpateProfileMeta'
import useProfileQuery from '../../user/profileQuery'
import { useSubscription } from '@/services/context/SubscriptionContext'
import { toast } from 'sonner'
import { updateFluentCRMContact } from '@/services/api/fluent-crm.api'

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
        'sm:min-w-[350px]',
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
      <div className='mt-8 flex justify-end gap-4'>
        <Button
          disabled={isUpdating}
          size='sm'
          variant='outline'
          onClick={onCloseModal}
        >
          Abbrechen
        </Button>
        <div className='flex items-center gap-2'>
          <Button
            size='sm'
            disabled={
              isUpdating || !hasAccess || !input.firstName || !input.lastName
            }
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
