import './modalEditProfile.style.scss'
import { FunctionComponent, useState } from 'react'
import Modal from '../Modal.component'
import { useUser } from '../../../contexts/UserContext'
import { toast } from 'react-toastify'
import fetchErrorToast from '../../../hooks/fetchErrorToast'
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
  const [isPending, setIsPending] = useState(false)

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

  const updateHandler = async () => {
    setIsPending(true)
    try {
      await updateProfile(input)
      closeModal()
      toast('Profil angepasst')
    } catch (error) {
      fetchErrorToast()
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Modal
      className={`modal--profile ${isPending ? 'loading' : ''}`}
      heading="Profil bearbeiten"
      handlerClose={closeModal}
      buttons={[
        { label: 'Abbrechen', btnStyle: 'secondary', handler: closeModal },
        { label: 'Speichern', btnStyle: 'primary', handler: updateHandler },
      ]}
    >
      <div className="inputs">
        <input
          autoFocus={window.screen.width > 1000 ? true : false}
          type="text"
          name="firstName"
          className="firstName"
          value={input.firstName}
          onChange={inputHandler}
        />
        <input
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
