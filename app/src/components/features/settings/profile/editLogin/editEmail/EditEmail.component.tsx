import { useState } from 'react'
import { toast } from 'react-toastify'
import { useUser } from '../../../../../../contexts/UserContext'
import fetchErrorToast from '../../../../../../hooks/fetchErrorToast'
import { validateEmail } from '../../../../../../utils/validateEmail'
import Button from '../../../../../common/button/Button.component'
import './editEmail.style.scss'

interface EditEmailProps {
  onCloseModal?: () => void
}

function EditEmail({ onCloseModal }: EditEmailProps) {
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
    if (!validateEmail(input.email1))
      return setError('Email-Format nicht korrekt')
    if (input.email1 !== input.email2)
      return setError('Email-Adressen stimmen nicht überein')
    setIsPending(true)
    try {
      await updateEmail(input.email1)
      setSuccess(true)
      toast('Check dein Postfach')
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
      <div className={`edit-email ${isPending ? ' loading' : ''}`}>
        <h2 className="heading-2">Bestätige deine Email-Adresse</h2>
        <p>
          Ein Bestätigungslink wurde an <strong>{input.email1}</strong>{' '}
          verschickt. <br />
          Die Änderung tritt erst nach Bestätigung deiner neuen Email-Adresse in
          Kraft.
        </p>
      </div>
    )

  return (
    <div className="edit-email">
      <h2 className="heading-2">Email-Adresse ändern</h2>
      <div className="edit-email__inputs">
        <div className="input-el">
          <span>Neue Email-Adresse</span>
          <input
            type="email"
            name="email1"
            value={input.email1}
            onChange={handleInput}
            className={`email${error ? ' input--error' : ''}`}
          />
        </div>
        <div className="input-el">
          <span>Neue Email-Adresse bestätigen</span>
          <input
            type="email"
            name="email2"
            value={input.email2}
            onChange={handleInput}
            className={`email${error ? ' input--error' : ''}`}
          />
        </div>
      </div>
      <div className="edit-email__buttons">
        <p className="error-message">{error}</p>
        <Button btnStyle="secondary" onClick={onCloseModal}>
          Abbrechen
        </Button>
        <Button btnStyle="primary" onClick={handleSave}>
          Speichern
        </Button>
      </div>
    </div>
  )
}

export default EditEmail
