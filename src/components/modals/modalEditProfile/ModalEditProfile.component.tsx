import './modalEditProfile.style.scss'
import { FunctionComponent, useState } from 'react'
import Modal from '../Modal.component'
import { useNotes } from '../../../contexts/NotesContext'
import { useUser } from '../../../contexts/UserContext'
interface ModalEditProfile {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const ModalEditProfile: FunctionComponent<ModalEditProfile> = ({
  setModalOpen,
}) => {
  const { user, updateProfile } = useUser()
  const [input, setInput] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
  })

  const closeModal = () => {
    setModalOpen(false)
  }

  const inputHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const name = e.target.name
    const value = e.target.value
    setInput((prev) => {
      return { ...prev, [name]: value }
    })
  }

  const updateHandler = () => {
    updateProfile(input)
    closeModal()
  }

  return (
    <Modal
      className="modal--profile"
      heading="Profil bearbeiten"
      handlerClose={closeModal}
      handlerOverlay={closeModal}
      buttons={[
        { label: 'Abbrechen', btnStyle: 'secondary', handler: closeModal },
        { label: 'Speichern', btnStyle: 'primary', handler: updateHandler },
      ]}
    >
      <div className="inputs">
        <input
          autoFocus={true}
          type="text"
          name="firstName"
          className="firstName"
          value={input.firstName}
          onChange={inputHandler}
        />
        <input
          autoFocus={true}
          type="text"
          name="lastName"
          className="lastName"
          value={input.lastName}
          onChange={inputHandler}
        />
      </div>
    </Modal>
  )
}

export default ModalEditProfile
