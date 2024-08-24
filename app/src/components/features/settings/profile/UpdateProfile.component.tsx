import { useState } from 'react'
import { useUser } from '../../../../services/context/UserContext'
import fetchErrorToast from '../../../../hooks/fetchErrorToast'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface EditProfileProps {
  onCloseModal?: () => void
}

function EditProfile({ onCloseModal }: EditProfileProps) {
  const { user, updateProfile } = useUser()
  const [input, setInput] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
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
        'min-w-[350px]',
      )}
    >
      <div className='space-y-6'>
        <div>
          <Label htmlFor='firstName' className='label'>
            Vorname
          </Label>
          <Input
            autoFocus={window.innerWidth > 1000}
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
      <div className='mt-8 flex gap-4 justify-end'>
        <Button variant='outline' onClick={onCloseModal}>
          Abbrechen
        </Button>
        <Button onClick={handleSave}>Speichern</Button>
      </div>
    </div>
  )
}

export default EditProfile
