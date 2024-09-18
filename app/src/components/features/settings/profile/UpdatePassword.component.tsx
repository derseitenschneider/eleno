import { useState } from 'react'
import { useUser } from '../../../../services/context/UserContext'
import fetchErrorToast from '../../../../hooks/fetchErrorToast'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { PasswordInput } from '@/components/ui/password-input'
import { toast } from 'sonner'
import MiniLoader from '@/components/ui/MiniLoader.component'

interface EditPasswordProps {
  onCloseModal?: () => void
}

export default function EditPassword({ onCloseModal }: EditPasswordProps) {
  const { updatePassword } = useUser()
  const [input, setInput] = useState({
    password1: '',
    password2: '',
  })
  const [error, setError] = useState('')
  const [isPending, setIsPending] = useState(false)

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setError('')
    const { name, value } = e.target
    setInput((prev) => {
      return { ...prev, [name]: value }
    })
  }

  const handleSave = async () => {
    if (input.password1 !== input.password2)
      return setError('Die Passwörter stimmen nicht überein!')
    if (input.password1.length < 6)
      return setError('Das Passwort muss aus mindestens 6 Zeichen bestehen!')

    setIsPending(true)
    try {
      await updatePassword(input.password1)
      onCloseModal?.()
      toast.success('Passwort geändert')
    } catch (err) {
      fetchErrorToast()
      return null
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
          <Label htmlFor='password'>Neues Passwort</Label>
          <PasswordInput
            id='password'
            name='password1'
            className={cn(error && 'border border-warning')}
            value={input.password1}
            onChange={handleInput}
          />
        </div>
        <div>
          <Label htmlFor='password2'>Neues Passwort wiederholen</Label>
          <PasswordInput
            id='password2'
            name='password2'
            className={cn(error && 'border border-warning')}
            value={input.password2}
            onChange={handleInput}
          />
          <span className='text-sm mt-1 text-warning'>{error}</span>
        </div>
      </div>
      <div className='mt-8 flex gap-4 justify-end'>
        <Button
          size='sm'
          variant='outline'
          disabled={isPending}
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
