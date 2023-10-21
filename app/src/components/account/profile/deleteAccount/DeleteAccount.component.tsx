import './deleteAccount.style.scss'

import { FC, useState } from 'react'
import { useUser } from '../../../../contexts/UserContext'
import { useNavigate } from 'react-router-dom'
import fetchErrorToast from '../../../../hooks/fetchErrorToast'
import Button from '../../../common/button/Button.component'

interface DeleteAccountProps {
  onCloseModal?: () => void
}

const DeleteAccount: FC<DeleteAccountProps> = ({ onCloseModal }) => {
  const { user, deleteAccount } = useUser()
  const [input, setInput] = useState('')
  const [check, setCheck] = useState(input === user.email)
  const navigate = useNavigate()

  const inputHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setInput(e.target.value)
    e.target.value === user.email ? setCheck(true) : setCheck(false)
  }

  const handleDelete = async () => {
    try {
      await deleteAccount()
      navigate('/')
    } catch (error) {
      fetchErrorToast()
    }
  }

  return (
    <div className={`delete-account`}>
      <h2 className="heading-2">Benutzerkonto löschen</h2>
      <div className="delete-account__input">
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
      <div className="delete-account__buttons">
        <Button btnStyle="secondary" onClick={onCloseModal}>
          Abbrechen
        </Button>
        <Button btnStyle="danger" onClick={handleDelete} disabled={!check}>
          Benutzerkonto löschen
        </Button>
      </div>
    </div>
  )
}

export default DeleteAccount
