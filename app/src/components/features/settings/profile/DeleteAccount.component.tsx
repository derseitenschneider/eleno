import MiniLoader from '@/components/ui/MiniLoader.component'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { deleteFluentCRMContact } from '@/services/api/fluent-crm.api'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useFetchErrorToast from '../../../../hooks/fetchErrorToast'
import { useUser } from '../../../../services/context/UserContext'
import useSubscriptionQuery from '../../subscription/subscriptionQuery'

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

  return (
    <div className='p-1 sm:w-[350px]'>
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
      {onCloseModal && <Separator className='my-6 sm:hidden' />}
      <div className='flex flex-col justify-end gap-4 sm:mt-8 sm:flex-row'>
        <div className='flex w-full items-center gap-2 sm:w-auto'>
          <Button
            size='sm'
            variant='destructive'
            disabled={!isEmailCorrect || isPending}
            className='w-full sm:w-auto'
            onClick={handleDelete}
          >
            Benutzerkonto löschen
          </Button>
          {isPending && <MiniLoader />}
        </div>
        {onCloseModal && (
          <Button
            size='sm'
            variant='outline'
            disabled={isPending}
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

export default DeleteAccount
