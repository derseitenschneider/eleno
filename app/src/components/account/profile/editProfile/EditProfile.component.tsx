import './editProfile.style.scss'
import { FC, useState } from 'react'
import { useUser } from '../../../../contexts/UserContext'
import { toast } from 'react-toastify'
import fetchErrorToast from '../../../../hooks/fetchErrorToast'
import Button from '../../../common/button/Button.component'

interface EditProfileProps {
  onCloseModal?: () => void
}

const EditProfile: FC<EditProfileProps> = ({ onCloseModal }) => {
  const { user, updateProfile } = useUser()
  const [input, setInput] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
  })
  const [isPending, setIsPending] = useState(false)

  const inputHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const name = e.target.name
    const value = e.target.value
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
            autoFocus={window.screen.width > 1000 ? true : false}
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

export default EditProfile
