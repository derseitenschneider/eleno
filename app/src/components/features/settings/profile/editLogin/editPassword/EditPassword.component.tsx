import { useState } from 'react'
import { toast } from 'react-toastify'
import { useUser } from '../../../../../../contexts/UserContext'
import fetchErrorToast from '../../../../../../hooks/fetchErrorToast'
import Button from '../../../../../common/button/Button.component'
import './editPassword.style.scss'

interface EditPasswordProps {
  onCloseModal?: () => void
}

function EditPassword({ onCloseModal }: EditPasswordProps) {
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
      toast('Passwort geändert')
      return null
    } catch (err) {
      fetchErrorToast()
      return null
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className={`edit-password ${isPending ? ' loading' : ''}`}>
      <h2 className="heading-2">Passwort ändern</h2>
      <div className="edit-password__inputs">
        <div className="input-el">
          <span>Neues Passwort</span>
          <input
            autoFocus={window.screen.width > 1000}
            type="password"
            name="password1"
            className={`password1${error ? ' input--error' : ''}`}
            value={input.password1}
            onChange={handleInput}
          />
        </div>
        <div className="input-el">
          <span>Neues Passwort wiederholen</span>
          <input
            type="password"
            name="password2"
            className={`password1${error ? ' input--error' : ''}`}
            value={input.password2}
            onChange={handleInput}
          />
        </div>
      </div>
      <div className="edit-password__buttons">
        <p className="error-message">{error}</p>
        <Button type="button" btnStyle="secondary" onClick={onCloseModal}>
          Abbrechen
        </Button>
        <Button type="button" btnStyle="primary" onClick={handleSave}>
          Speichern
        </Button>
      </div>
    </div>
  )
}

export default EditPassword
