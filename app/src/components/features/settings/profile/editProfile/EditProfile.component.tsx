import { useState } from 'react'
import { toast } from 'react-toastify'
import { useUser } from '../../../../../services/context/UserContext'
import fetchErrorToast from '../../../../../hooks/fetchErrorToast'
import Button from '../../../../ui/button/Button.component'
import './editProfile.style.scss'

interface EditProfileProps {
  onCloseModal?: () => void
}

function EditProfile({ onCloseModal }: EditProfileProps) {
  const { user, updateProfile } = useUser()
  const [input, setInput] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
  })
  const [isPending, setIsPending] = useState(false)

  const inputHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setInput((prev) => {
      return { ...prev, [name]: value }
    })
  }

  const handleSave = async () => {
    setIsPending(true)
    try {
      await updateProfile(input)
      onCloseModal?.()
      toast('Profil angepasst')
    } catch (error) {
      fetchErrorToast()
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className={`edit-profile ${isPending ? ' loading' : ''}`}>
      <h2 className="heading-2">Profil bearbeiten</h2>
      <div className="edit-profile__inputs">
        <div className="input-el">
          <span className="label">Vorname</span>
          <input
            autoFocus={window.screen.width > 1000}
            type="text"
            name="firstName"
            className="firstName"
            value={input.firstName}
            onChange={inputHandler}
          />
        </div>
        <div className="input-el">
          <span className="label">Nachname</span>
          <input
            type="text"
            name="lastName"
            className="lastName"
            value={input.lastName}
            onChange={inputHandler}
          />
        </div>
      </div>
      <div className="edit-profile__buttons">
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

export default EditProfile
