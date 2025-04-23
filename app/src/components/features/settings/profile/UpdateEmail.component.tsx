import { useState } from 'react'
import validateEmail from '../../../../utils/validateEmail'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Mail } from 'lucide-react'
import MiniLoader from '@/components/ui/MiniLoader.component'
import { useUpdateEmail } from '../../user/useUpdateEmail'
import { useSubscription } from '@/services/context/SubscriptionContext'

interface EditEmailProps {
  onCloseModal?: () => void
}

// TODO: implement zod validation
export default function EditEmail({ onCloseModal }: EditEmailProps) {
  const { hasAccess } = useSubscription()
  const { updateEmail, isUpdating } = useUpdateEmail()
  const [input, setInput] = useState({ email1: '', email2: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('')
    const { name, value } = e.target
    setInput((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    if (!validateEmail(input.email1)) {
      return setError('Email-Format nicht korrekt')
    }
    if (input.email1 !== input.email2) {
      return setError('Email-Adressen stimmen nicht überein')
    }
    updateEmail(input.email1, {
      onSuccess: () => setSuccess(true),
    })
  }

  if (success)
    return (
      <div className='sm:w-[350px]'>
        <DialogHeader>
          <DialogTitle>Bestätige deine E-Mail Adresse</DialogTitle>
        </DialogHeader>
        <div className='flex h-12 sm:h-16'>
          <Mail strokeWidth={1.5} className='h-full w-auto text-primary' />
        </div>
        <DialogDescription>
          Ein Bestätigungslink wurde an <strong>{input.email1}</strong>{' '}
          verschickt. Die Änderung tritt erst nach Bestätigung deiner neuen
          E-Mail Adresse in Kraft.
        </DialogDescription>
      </div>
    )

  return (
    <div
      className={cn(
        isUpdating && 'opacity-80 pointer-events-none',
        'sm:min-w-[350px]',
      )}
    >
      <DialogHeader>
        <DialogTitle>E-Mail Adresse ändern</DialogTitle>
      </DialogHeader>
      <DialogDescription className='hidden'>
        Ändere deine E-Mail Adresse
      </DialogDescription>
      <div className='space-y-6'>
        <div>
          <Label htmlFor='email'>Neue E-Mail Adresse</Label>
          <Input
            id='email'
            type='email'
            name='email1'
            value={input.email1}
            onChange={handleInput}
            className={cn(error && 'border border-warning')}
          />
        </div>
        <div>
          <Label htmlFor='email2'>Neue E-Mail Adresse bestätigen</Label>
          <Input
            id='email2'
            type='email'
            name='email2'
            value={input.email2}
            onChange={handleInput}
            className={cn(error && 'border border-warning')}
          />
          <span className='mt-1 text-sm text-warning'>{error}</span>
        </div>
      </div>
      <div className='mt-8 flex justify-end gap-4'>
        <Button
          size='sm'
          disabled={isUpdating}
          variant='outline'
          onClick={onCloseModal}
        >
          Abbrechen
        </Button>
        <div className='flex items-center gap-2'>
          <Button
            disabled={isUpdating || !hasAccess}
            size='sm'
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
