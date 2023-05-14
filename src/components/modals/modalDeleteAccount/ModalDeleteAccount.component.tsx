import { FunctionComponent, useState } from 'react'
import Modal from '../Modal.component'
import { useNotes } from '../../../contexts/NotesContext'
import { useUser } from '../../../contexts/UserContext'
import { useNavigate } from 'react-router-dom'
import fetchErrorToast from '../../../hooks/fetchErrorToast'
interface ModalDeleteAccount {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const ModalDeleteAccount: FunctionComponent<ModalDeleteAccount> = ({
  setModalOpen,
}) => {
  const { user, deleteAccount } = useUser()
  const [input, setInput] = useState('')
  const [check, setCheck] = useState(input === user.email)
  const navigate = useNavigate()

  const closeModal = () => {
    setModalOpen(false)
  }

  const inputHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setInput(e.target.value)
    e.target.value === user.email ? setCheck(true) : setCheck(false)
  }

  const handlerDelete = async () => {
    try {
      await deleteAccount()
      navigate('/')
    } catch (error) {
      fetchErrorToast()
    }
  }

  return (
    <Modal
      className="modal--delete-account"
      heading="Benutzerkonto löschen"
      handlerClose={closeModal}
      handlerOverlay={closeModal}
      buttons={[
        { label: 'Abbrechen', btnStyle: 'secondary', handler: closeModal },
        {
          label: 'Benutzerkonto löschen',
          btnStyle: 'danger',
          handler: handlerDelete,
          disabled: !check,
        },
      ]}
    >
      <div className="input-el">
        <span>Email-Adresse zur Bestätigung</span>
        <input
          autoFocus={true}
          type="text"
          name="email"
          className={`email${!check ? ' input--error' : ''}`}
          value={input}
          onChange={inputHandler}
        />
      </div>
    </Modal>
  )
}

export default ModalDeleteAccount
