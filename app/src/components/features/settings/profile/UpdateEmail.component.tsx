import { useState } from 'react'
import { useUser } from '../../../../services/context/UserContext'
import fetchErrorToast from '../../../../hooks/fetchErrorToast'
import validateEmail from '../../../../utils/validateEmail'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Mail } from 'lucide-react'

interface EditEmailProps {
  onCloseModal?: () => void
}

export default function EditEmail({ onCloseModal }: EditEmailProps) {
  const { updateEmail } = useUser()
  const [input, setInput] = useState({ email1: '', email2: '' })

  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isPending, setIsPending] = useState(false)

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
    setIsPending(true)
    try {
      await updateEmail(input.email1)
      setSuccess(true)
      return null
    } catch (err) {
      fetchErrorToast()
      return null
    } finally {
      setIsPending(false)
    }
  }

  if (success)
    return (
      <div className='w-[350px]'>
        <DialogTitle>
          <DialogHeader>Bestätige deine E-Mail Adresse</DialogHeader>
        </DialogTitle>
        <Mail strokeWidth={1} className='h-16 my-4 w-auto text-primary' />
        <p>
          Ein Bestätigungslink wurde an <strong>{input.email1}</strong>{' '}
          verschickt. Die Änderung tritt erst nach Bestätigung deiner neuen
          Email-Adresse in Kraft.
        </p>
      </div>
    )

  return (
    <div
      className={cn(
        isPending && 'opacity-80 pointer-events-none',
        'min-w-[350px]',
      )}
    >
      <DialogTitle>
        <DialogHeader>E-Mail Adresse ändern</DialogHeader>
      </DialogTitle>
      <div className='space-y-6'>
        <div>
          <Label htmlFor='email'>Neue Email-Adresse</Label>
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
          <Label htmlFor='email2'>Neue Email-Adresse bestätigen</Label>
          <Input
            id='email2'
            type='email'
            name='email2'
            value={input.email2}
            onChange={handleInput}
            className={cn(error && 'border border-warning')}
          />
          <span className='text-sm mt-1 text-warning'>{error}</span>
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
