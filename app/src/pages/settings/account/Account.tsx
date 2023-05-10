import './account.style.scss'

import { FunctionComponent, useState } from 'react'
import { useUser } from '../../../contexts/UserContext'
import Button from '../../../components/button/Button.component'
import ModalEditProfile from '../../../components/modals/modalEditProfile/ModalEditProfile.component'
import ModalEditEmail from '../../../components/modals/modalEditEmail/ModalEditEmail.component'
import ModalEditPassword from '../../../components/modals/modalEditPassword/ModalEditPassword.component'
import ModalDeleteAccount from '../../../components/modals/modalDeleteAccount/ModalDeleteAccount.component'
interface AccountProps {}

const Account: FunctionComponent<AccountProps> = () => {
  const { user } = useUser()
  const [modalEditProfileOpen, setModalEditProfileOpen] = useState(false)
  const [modalEditEmailOpen, setModalEditEmailOpen] = useState(false)
  const [modalEditPasswordOpen, setModalEditPasswordOpen] = useState(false)
  const [modalDeleteAccountOpen, setModalDeleteAccountOpen] = useState(false)
  return (
    <div className="account">
      <div className="section section--profile">
        <h3 className="heading-3">Profil</h3>
        <div className="container-info container-info--profile">
          <p>Vorname:</p>
          <p>{user.firstName}</p>
          <p>Nachname:</p>
          <p>{user.lastName}</p>
        </div>
        <Button
          type="button"
          btnStyle="primary"
          label="Bearbeiten"
          handler={() => {
            setModalEditProfileOpen(true)
          }}
        />
      </div>
      <div className="section section--login">
        <h3 className="heading-3">Logindaten</h3>
        <div className="container-info container-info--logindata">
          <p>Email-Adresse:</p>
          <p>{user.email}</p>
        </div>
        <div className="container--buttons">
          <Button
            type="button"
            btnStyle="primary"
            label="Email ändern"
            handler={() => setModalEditEmailOpen(true)}
          />
          <Button
            type="button"
            btnStyle="primary"
            label="Passwort ändern"
            handler={() => setModalEditPasswordOpen(true)}
          />
        </div>
      </div>

      <div className="section section--delete-account">
        <h3 className="heading-3">Benutzerkonto löschen</h3>
        <p className="info">
          Wenn du dein Benutzerkonto löschst, werden auch alle deine Daten
          (Schüler:innen, Lektionen, Todos etc.) unwiederruflich aus der
          Datenbank gelöscht!
        </p>
        <Button
          type="button"
          btnStyle="danger"
          label="Benutzerkonto löschen"
          handler={() => {
            setModalDeleteAccountOpen(true)
          }}
        />
      </div>
      {modalEditProfileOpen && (
        <ModalEditProfile setModalOpen={setModalEditProfileOpen} />
      )}
      {modalEditEmailOpen && (
        <ModalEditEmail setModalOpen={setModalEditEmailOpen} />
      )}
      {modalEditPasswordOpen && (
        <ModalEditPassword setModalOpen={setModalEditPasswordOpen} />
      )}
      {modalDeleteAccountOpen && (
        <ModalDeleteAccount setModalOpen={setModalDeleteAccountOpen} />
      )}
    </div>
  )
}

export default Account
