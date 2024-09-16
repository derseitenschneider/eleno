import { useState } from 'react'
import { useUser } from '../../../../services/context/UserContext'
import fetchErrorToast from '../../../../hooks/fetchErrorToast'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import MiniLoader from '@/components/ui/MiniLoader.component'

interface EditProfileProps {
  onCloseModal?: () => void
}

function EditProfile({ onCloseModal }: EditProfileProps) {
  const { user, updateProfile } = useUser()
  const [input, setInput] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
  })
  const [isPending, setIsPending] = useState(false)

  const inputHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setInput((prev) => {
      return { ...prev, [name]: value }
    })
  }

  const handleSave = async () => {
    setIsPending(true)
    try {
      await updateProfile(input)
      onCloseModal?.()
      toast.success('Profil angepasst')
    } catch (error) {
      fetchErrorToast()
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div
      className={cn(
        isPending && 'opacity-80 pointer-events-none',
        'sm:min-w-[350px]',
      )}
    >
      <div className='space-y-6'>
        <div>
          <Label htmlFor='firstName' className='label'>
            Vorname
          </Label>
          <Input
            autoFocus={window.innerWidth > 1000}
            id='first_name'
            type='text'
            name='first_name'
            className='firstName'
            value={input.first_name}
            onChange={inputHandler}
          />
        </div>
        <div>
          <Label htmlFor='lastName' className='label'>
            Nachname
          </Label>
          <Input
            type='text'
            id='last_name'
            name='last_name'
            className='lastName'
            value={input.last_name}
            onChange={inputHandler}
          />
        </div>
      </div>
      <div className='mt-8 flex gap-4 justify-end'>
        <Button
          disabled={isPending}
          size='sm'
          variant='outline'
          onClick={onCloseModal}
        >
          Abbrechen
        </Button>
        <div className='flex items-center gap-2'>
          <Button size='sm' disabled={isPending} onClick={handleSave}>
            Speichern
          </Button>
          {isPending && <MiniLoader />}
        </div>
      </div>
    </div>
  )
}

export default EditProfile
