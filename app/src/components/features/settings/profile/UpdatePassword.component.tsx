import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { PasswordInput } from '@/components/ui/password-input'
import MiniLoader from '@/components/ui/MiniLoader.component'
import { isDemoMode } from '@/config'
import { useUpdatePassword } from '../../user/useUpdatePassword'
import { useSubscription } from '@/services/context/SubscriptionContext'

interface EditPasswordProps {
  onCloseModal?: () => void
}

// TODO: implement zod validation
export default function EditPassword({ onCloseModal }: EditPasswordProps) {
  const { hasAccess } = useSubscription()
  const { updatePassword, isUpdating } = useUpdatePassword()
  const [input, setInput] = useState({
    password1: '',
    password2: '',
  })
  const [error, setError] = useState('')

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

    updatePassword(input.password1, {
      onSuccess: () => {
        onCloseModal?.()
      },
      onError: (error) => {
        if ('same_password' === error.message) {
          setError('Das neue Passwort stimmt mit dem alten Passwort überein.')
        }
      },
    })
  }

  if (isDemoMode) {
    return (
      <p className='text-base'>
        Diese Funktion ist in der Demoversion leider nicht verfügbar.
      </p>
    )
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
          <span className='mt-1 text-sm text-warning'>{error}</span>
        </div>
      </div>
      {onCloseModal && <Separator className='my-6 sm:hidden' />}
      <div className='flex flex-col sm:flex-row justify-end gap-4 sm:mt-8'>
        <div className='flex items-center gap-2 w-full sm:w-auto'>
          <Button
            size='sm'
            disabled={isUpdating || !hasAccess}
            className='w-full sm:w-auto'
            onClick={handleSave}
          >
            Speichern
          </Button>
          {isUpdating && <MiniLoader />}
        </div>
        {onCloseModal && (
          <Button
            size='sm'
            variant='outline'
            disabled={isUpdating}
            className='w-full sm:w-auto'
            onClick={onCloseModal}
          >
            Abbrechen
          </Button>
        )}
      </div>
    </div>
  )
}
