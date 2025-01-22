import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../../../services/context/UserContext'
import useFetchErrorToast from '../../../../hooks/fetchErrorToast'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import MiniLoader from '@/components/ui/MiniLoader.component'
import { isDemoMode } from '@/config'

interface DeleteAccountProps {
  onCloseModal?: () => void
}

function DeleteAccount({ onCloseModal }: DeleteAccountProps) {
  const showFetcherror = useFetchErrorToast()
  const { user, deleteAccount } = useUser()
  const [input, setInput] = useState('')
  const [isPending, setIsPending] = useState(false)
  const navigate = useNavigate()

  const isEmailCorrect = input === user?.email

  const inputHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setInput(e.target.value)
  }

  const handleDelete = async () => {
    setIsPending(true)
    try {
      await deleteAccount()
      navigate('/')
    } catch (error) {
      showFetcherror()
    } finally {
      setIsPending(false)
    }
  }

  if (isDemoMode) {
    return (
      <p className='text-base'>
        Diese Funktion ist in der Demoversion leider nicht verfügbar.
      </p>
    )
  }

  return (
    <div className='sm:w-[350px]'>
      <div className='space-y-6'>
        <p>Bestätige die Löschung deines Accounts mit deiner E-Mail Adresse.</p>
        <div>
          <Label htmlFor='email'>E-Mail Adresse</Label>
          <Input
            type='email'
            name='email'
            className={cn(!isEmailCorrect && 'border border-warning')}
            value={input}
            onChange={inputHandler}
          />
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
          <Button
            size='sm'
            variant='destructive'
            disabled={!isEmailCorrect || isPending}
            onClick={handleDelete}
          >
            Benutzerkonto löschen
          </Button>
          {isPending && <MiniLoader />}
        </div>
      </div>
    </div>
  )
}

export default DeleteAccount
