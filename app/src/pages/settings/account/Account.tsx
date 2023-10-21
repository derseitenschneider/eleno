import './account.style.scss'

import { FunctionComponent, useState, useEffect } from 'react'
import { useUser } from '../../../contexts/UserContext'
import Button from '../../../components/common/button/Button.component'

import Modal from '../../../components/common/modal/Modal.component'
import EditProfile from '../../../components/account/profile/editProfile/EditProfile.component'
import EditEmail from '../../../components/account/profile/editLogin/editEmail/EditEmail.component'
import EditPassword from '../../../components/account/profile/editLogin/editPassword/EditPassword.component'
import DeleteAccount from '../../../components/account/profile/deleteAccount/DeleteAccount.component'

const Account: FunctionComponent = () => {
  const { user } = useUser()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

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
        <Modal>
          <Modal.Open opens="edit-profile">
            <Button type="button" btnStyle="primary" label="Bearbeiten" />
          </Modal.Open>
          <Modal.Window name="edit-profile">
            <EditProfile />
          </Modal.Window>
        </Modal>
      </div>

      <div className="section section--login">
        <h3 className="heading-3">Logindaten</h3>
        <div className="container-info container-info--logindata">
          <p>Email-Adresse:</p>
          <p>{user.email}</p>
        </div>
        <div className="container--buttons">
          <Modal>
            <Modal.Open opens="edit-email">
              <Button type="button" btnStyle="primary" label="Email ändern" />
            </Modal.Open>

            <Modal.Window name="edit-email">
              <EditEmail />
            </Modal.Window>
          </Modal>

          <Modal>
            <Modal.Open opens="edit-password">
              <Button
                type="button"
                btnStyle="primary"
                label="Passwort ändern"
              />
            </Modal.Open>
            <Modal.Window name="edit-password">
              <EditPassword />
            </Modal.Window>
          </Modal>
        </div>
      </div>

      <div className="section section--delete-account">
        <h3 className="heading-3">Benutzerkonto löschen</h3>
        <p className="info">
          Wenn du dein Benutzerkonto löschst, werden auch alle deine Daten
          (Schüler:innen, Lektionen, Todos etc.) unwiederruflich aus der
          Datenbank gelöscht!
        </p>
        <Modal>
          <Modal.Open opens="delete-account">
            <Button
              type="button"
              btnStyle="danger"
              label="Benutzerkonto löschen"
            />
          </Modal.Open>
          <Modal.Window name="delete-account">
            <DeleteAccount />
          </Modal.Window>
        </Modal>
      </div>
    </div>
  )
}

export default Account
