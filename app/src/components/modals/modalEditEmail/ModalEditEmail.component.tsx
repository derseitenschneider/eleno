import { FunctionComponent, useState } from 'react'
import Modal from '../Modal.component'

import { useUser } from '../../../contexts/UserContext'
import { validateEmail } from '../../../utils/validateEmail'
import fetchErrorToast from '../../../hooks/fetchErrorToast'
import { toast } from 'react-toastify'

interface ModalEditEmailProps {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const ModalEditEmail: FunctionComponent<ModalEditEmailProps> = ({
  setModalOpen,
}) => {
  const { user, updateEmail } = useUser()
  const [input1, setInput1] = useState('')
  const [input2, setInput2] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isPending, setIsPending] = useState(false)
  // Handler input fields
  const input1Handler = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setError('')
    setInput1(e.target.value)
  }

  const input2Handler = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setError('')

    setInput2(e.target.value)
  }

  const closeModal = () => {
    setModalOpen(false)
  }

  // Update Lesson
  const updateHandler = async () => {
    if (!validateEmail(input1)) return setError('Email-Format nicht korrekt')
    if (input1 !== input2)
      return setError('Email-Adressen stimmen nicht überein')
    setIsPending(true)
    try {
      await updateEmail(input1)
      setSuccess(true)
      toast('Check dein Postfach')
    } catch (error) {
      fetchErrorToast()
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Modal
      heading={
        !success ? 'Email-Adresse ändern' : 'Bestätige deine Email-Adresse'
      }
      handlerClose={closeModal}
      className={`modal--edit-email ${isPending ? 'loading' : ''}`}
      buttons={
        !success
          ? [
              {
                label: 'Abbrechen',
                btnStyle: 'secondary',
                handler: closeModal,
              },
              {
                label: 'Speichern',
                btnStyle: 'primary',
                handler: updateHandler,
                disabled: error ? true : false,
              },
            ]
          : []
      }
    >
      {!success ? (
        <>
          <div className="input-el">
            <span>Neue Email-Adresse</span>
            <input
              type="email"
              name="email1"
              value={input1}
              onChange={input1Handler}
              className={`email${error ? ' input--error' : ''}`}
            />
          </div>
          <div className="input-el">
            <span>Neue Email-Adresse bestätigen</span>
            <input
              type="email"
              name="email2"
              value={input2}
              onChange={input2Handler}
              className={`email${error ? ' input--error' : ''}`}
            />
            <p className="error-message">{error}</p>
          </div>
        </>
      ) : (
        <p>
          Ein Bestätigungslink wurde an <strong>{input1}</strong> verschickt.{' '}
          <br />
          Die Änderung tritt erst nach Bestätigung deiner neuen Email-Adresse in
          Kraft.
        </p>
      )}
    </Modal>
  )
}

export default ModalEditEmail
