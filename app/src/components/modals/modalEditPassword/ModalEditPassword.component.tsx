import { FunctionComponent, useState } from 'react'
import Modal from '../Modal.component'
import { useUser } from '../../../contexts/UserContext'
import fetchErrorToast from '../../../hooks/fetchErrorToast'
import { toast } from 'react-toastify'
interface ModalEditPassword {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const ModalEditPassword: FunctionComponent<ModalEditPassword> = ({
  setModalOpen,
}) => {
  const { updatePassword } = useUser()
  const [input, setInput] = useState({
    password1: '',
    password2: '',
  })
  const [error, setError] = useState('')
  const [isPending, setIsPending] = useState(false)

  const closeModal = () => {
    setModalOpen(false)
  }

  const inputHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setError('')
    const name = e.target.name
    const value = e.target.value
    setInput((prev) => {
      return { ...prev, [name]: value }
    })
  }

  const updateHandler = async () => {
    if (input.password1 !== input.password2)
      return setError('Die Passwörter stimmen nicht überein!')
    if (input.password1.length < 6)
      return setError('Das Passwort muss aus mindestens 6 Zeichen bestehen!')

    setIsPending(true)
    try {
      await updatePassword(input.password1)
      closeModal()
      toast('Passwort geändert')
    } catch (error) {
      fetchErrorToast()
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Modal
      className={`modal--edit-password ${isPending ? 'loading' : ''}`}
      heading="Passwort ändern"
      handlerClose={closeModal}
      handlerOverlay={closeModal}
      buttons={[
        { label: 'Abbrechen', btnStyle: 'secondary', handler: closeModal },
        {
          label: 'Speichern',
          btnStyle: 'primary',
          handler: updateHandler,
          disabled: error ? true : false,
        },
      ]}
    >
      <div className="input-el">
        <span>Neues Passwort</span>
        <input
          autoFocus={window.screen.width > 1000 ? true : false}
          type="password"
          name="password1"
          className={`password1${error ? ' input--error' : ''}`}
          value={input.password1}
          onChange={inputHandler}
        />
      </div>
      <div className="input-el">
        <span>Neues Passwort wiederholen</span>
        <input
          type="password"
          name="password2"
          className={`password1${error ? ' input--error' : ''}`}
          value={input.password2}
          onChange={inputHandler}
        />
        <p className="error-message">{error}</p>
      </div>
    </Modal>
  )
}

export default ModalEditPassword
