import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../../../services/context/UserContext'
import fetchErrorToast from '../../../../hooks/fetchErrorToast'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface DeleteAccountProps {
  onCloseModal?: () => void
}

function DeleteAccount({ onCloseModal }: DeleteAccountProps) {
  const { user, deleteAccount } = useUser()
  const [input, setInput] = useState('')
  const navigate = useNavigate()

  const isEmailCorrect = input === user?.email

  const inputHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setInput(e.target.value)
  }

  const handleDelete = async () => {
    try {
      await deleteAccount()
      navigate('/')
    } catch (error) {
      fetchErrorToast()
    }
  }

  return (
    <div className='w-[350px]'>
      <div className='space-y-6'>
        <p>Bestätige die Löschung deines Accounts mit deiner E-Mail Adresse.</p>
        <div>
          <Label htmlFor='email'>E-Mail Adresse</Label>
          <Input
            autoFocus
            type='text'
            name='email'
            className={cn(!isEmailCorrect && 'border border-warning')}
            value={input}
            onChange={inputHandler}
          />
        </div>
      </div>
      <div className='mt-8 flex gap-4 justify-end'>
        <Button variant='outline' onClick={onCloseModal}>
          Abbrechen
        </Button>
        <Button
          variant='destructive'
          disabled={!isEmailCorrect}
          onClick={handleDelete}
        >
          Benutzerkonto löschen
        </Button>
      </div>
    </div>
  )
}

export default DeleteAccount
