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
import { useQueryClient } from '@tanstack/react-query'
import useSubscriptionQuery from '../../subscription/subscriptionQuery'
import { deleteFluentCRMContact } from '@/services/api/fluent-crm.api'

interface DeleteAccountProps {
  onCloseModal?: () => void
}

function DeleteAccount({ onCloseModal }: DeleteAccountProps) {
  const fetchErrorToast = useFetchErrorToast()
  const { data: subscription } = useSubscriptionQuery()
  const queryClient = useQueryClient()
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
    if (!subscription || !user?.email) return
    setIsPending(true)
    try {
      await deleteFluentCRMContact(user.email)
      await deleteAccount(subscription)
      navigate('/')
      queryClient.clear()
    } catch (error) {
      fetchErrorToast()
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
      <div className='mt-8 flex justify-end gap-4'>
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
