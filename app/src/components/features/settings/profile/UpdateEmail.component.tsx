import { Mail } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DrawerOrDialogDescription,
  DrawerOrDialogHeader,
  DrawerOrDialogTitle,
} from '@/components/ui/DrawerOrDialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import MiniLoader from '@/components/ui/MiniLoader.component'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { useSubscription } from '@/services/context/SubscriptionContext'
import validateEmail from '../../../../utils/validateEmail'
import { useUpdateEmail } from '../../user/useUpdateEmail'

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
        <DrawerOrDialogHeader>
          <DrawerOrDialogTitle>
            Bestätige deine E-Mail Adresse
          </DrawerOrDialogTitle>
        </DrawerOrDialogHeader>
        <div className='flex h-12 sm:h-16'>
          <Mail strokeWidth={1.5} className='h-full w-auto text-primary' />
        </div>
        <DrawerOrDialogDescription>
          Ein Bestätigungslink wurde an <strong>{input.email1}</strong>{' '}
          verschickt. Die Änderung tritt erst nach Bestätigung deiner neuen
          E-Mail Adresse in Kraft.
        </DrawerOrDialogDescription>
      </div>
    )

  return (
    <div
      className={cn(
        isUpdating && 'opacity-80 pointer-events-none',
        'sm:min-w-[350px]',
      )}
    >
      <DrawerOrDialogHeader>
        <DrawerOrDialogTitle>E-Mail Adresse ändern</DrawerOrDialogTitle>
      </DrawerOrDialogHeader>
      <DrawerOrDialogDescription className='hidden'>
        Ändere deine E-Mail Adresse
      </DrawerOrDialogDescription>
      <div className='space-y-6 p-1'>
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
      {onCloseModal && <Separator className='my-6 sm:hidden' />}
      <div className='flex flex-col-reverse justify-end gap-3 sm:mt-8 sm:flex-row'>
        {onCloseModal && (
          <Button
            size='sm'
            disabled={isUpdating}
            variant='outline'
            className='w-full sm:w-auto'
            onClick={onCloseModal}
          >
            Abbrechen
          </Button>
        )}
        <div className='flex w-full items-center gap-2 sm:w-auto'>
          <Button
            disabled={isUpdating || !hasAccess}
            size='sm'
            className='w-full sm:w-auto'
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
